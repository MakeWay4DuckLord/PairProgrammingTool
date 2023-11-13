import React, { useState, useEffect, useRef } from 'react';
import emotions from './Constants';
import axios from 'axios';
import styles from '../styles/Emotion.module.css'

const API_KEY = `545WFZ9GWUaMHHffmHZuBlqW5AtwsBFnpdPEUKjnTF86GWsV`; // Replace with your actual API key
const endpoint = 'wss://api.hume.ai/v0/stream/models';

const score_interval = 5000 // calculate score every five minute (300000)
const emotion_interval = 500 // get an emotion response every half second 

const Emotions = ({ videoStream, id }) => {
  const [emotion, setEmotion] = useState('');
  const [socket, setSocket] = useState(null);
  const [numOfRequests, setNumOfRequests] = useState(0)
  const videoRef = useRef(null);

  function initializeWebSocket() {
    const newSocket = new WebSocket(`${endpoint}?apiKey=${encodeURIComponent(API_KEY)}`);
    newSocket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
      // Attempt to reconnect after a delay (e.g., 3 seconds)
      setTimeout(initializeWebSocket, 3000);
    };
  
    return newSocket;
  }
  
  useEffect(() => {
    const newSocket = initializeWebSocket();
    setSocket(newSocket);
  
    return () => {
      // Close the WebSocket connection when the component unmounts
      if (newSocket) {
        newSocket.close();
      }
    };
  }, []);


  useEffect(() => {
    // Handle WebSocket events when the socket is set
    if (socket) {
      if (socket.readyState === WebSocket.CLOSED) {
        // The WebSocket is closed; attempt to reopen it
        const newSocket = initializeWebSocket();
        setSocket(newSocket);
      }

      const video = videoRef.current;

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

        if (socket.readyState == WebSocket.OPEN) {
          socket.send(JSON.stringify(message));
        
        }
      };

      video.addEventListener('play', () => {
        // Start capturing and sending frames when the video starts playing
        const captureInterval = setInterval(captureAndSendFrame, emotion_interval); // Adjust the capture interval as needed
        video.addEventListener('pause', () => {
          // Stop capturing frames when the video pauses or is no longer visible
          clearInterval(captureInterval);
        });
      });

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
          console.log("gets emotions");
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
    if (tempScore !== undefined && tempScore !== null && score !== NaN ) {
      var newScore = ((score + tempScore)/ numOfRequests);
      score = newScore;
    }
    console.log("nor " + numOfRequests);
    if (numOfRequests >= (score_interval / emotion_interval)){
      console.log("sends data");
      axios.put(`http://sd-vm01.csc.ncsu.edu/server/api/users/${id}/expressionScore/${score}`)
      score = 0;
      setNumOfRequests(0);
    }

  }, [emotion, numOfRequests, id])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  return (
    <div>
      <video className={styles.video} ref={videoRef} muted={true} width={640} height={360} autoPlay />
      <div className={styles.emotion}>
        <p>{emotion}</p>
      </div>
    </div>
  );
};

export default Emotions;





