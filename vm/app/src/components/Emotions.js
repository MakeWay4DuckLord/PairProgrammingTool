import React, { useState, useEffect, useRef } from 'react';
import emotions from './Constants';
import axios from 'axios';
import styles from '../styles/Emotion.module.css'
import ReconnectingWebSocket from 'reconnecting-websocket';

const API_KEY = process.env.REACT_APP_HUME_API_KEY; // Replace with your actual API key
const endpoint = process.env.REACT_APP_HUME_ENDPOINT;

const score_interval = 5000 // calculate score every five minute (300000)
const emotion_interval = 500 // get an emotion response every half second 

const Emotions = React.forwardRef(({ videoStream, id}, ref) => {
  const [emotion, setEmotion] = useState('');
  const [socket, setSocket] = useState(null);
  const [numOfRequests, setNumOfRequests] = useState(0)

  function initializeWebSocket() {
    const newSocket = new ReconnectingWebSocket(`${endpoint}?apiKey=${encodeURIComponent(API_KEY)}`);
    return newSocket;
  }
  
  useEffect(() => {
    const newSocket = initializeWebSocket();
    setSocket(newSocket);
  
    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, []);


  useEffect(() => {
    // Handle WebSocket events when the socket is set
    if (socket) {

      const video = ref.current;

      // Capture frames from the video stream and send them to the WebSocket server
      const captureAndSendFrame = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg'); // Convert the frame to base64
        const message = {
          models: {
            face: {},
          },
          data: imageData,
        };

          socket.send(JSON.stringify(message));
	      
      };

      const captureInterval = setInterval(captureAndSendFrame, emotion_interval);

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      socket.onclose = (event) => {
        console.log('WebSocket connection closed:', event);
      };

      socket.onmessage = (event) => {
        const receivedMessage = JSON.parse(event.data);
        if (receivedMessage && receivedMessage.face && receivedMessage.face.predictions) {
          const emotionsArray = receivedMessage.face.predictions[0].emotions;
          if (emotionsArray && emotionsArray.length > 0) {
            let maxEmotion = emotionsArray[0];
            for (let i = 1; i < emotionsArray.length; i++) {
              if (emotionsArray[i].score > maxEmotion.score) {
                maxEmotion = emotionsArray[i];
              }
            }
            setEmotion(maxEmotion.name);
            setNumOfRequests((prevNumOfRequests) => prevNumOfRequests + 1);
          }
        }
      };      

    }
  }, [socket]);

  useEffect(() => {
    var score = 0;
    var tempScore = emotions[emotion];
    
    if (tempScore !== undefined && tempScore !== null && !isNaN(score)) {
      var newScore = ((score + tempScore) / numOfRequests);
      score = newScore;
    }
  
    if (numOfRequests >= (score_interval / emotion_interval)) {
      try {
        axios.put(`https://sd-vm01.csc.ncsu.edu/server/api/users/${id}/expressionScore/${score}`)
          .then(() => {
            // Handle success if needed
          })
          .catch((error) => {
            console.error("Error in axios.put:", error);
          });
      } catch (error) {
        console.error("Error in axios.put:", error);
      }
      score = 0;
      setNumOfRequests(0);
    }
  }, [emotion, numOfRequests, id]);
  

  useEffect(() => {
    if (ref.current) {
      ref.current.srcObject = videoStream;
    }
  }, [videoStream]);

  return (
    <div>
      <div className={styles.emotion}>
        <p>{emotion}</p>
      </div>
    </div>
  );
  

});

export default Emotions;
