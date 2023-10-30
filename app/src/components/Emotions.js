import React, { useState, useEffect, useRef } from 'react';
import Data from './Data';
import emotions from './Constants';

const API_KEY = `545WFZ9GWUaMHHffmHZuBlqW5AtwsBFnpdPEUKjnTF86GWsV`; // Replace with your actual API key
const endpoint = 'wss://api.hume.ai/v0/stream/models';

const score_interval = 300000 // calculate score every five minute
const emotion_interval = 500 // get an emotion response every half second 

const Emotions = ({ videoStream }) => {
  const [emotion, setEmotion] = useState('');
  const [socket, setSocket] = useState(null);
  const [score, setScore] = useState(0);
  const [numOfRequests, setNumOfRequests] = useState(0)
  const videoRef = useRef(null);

  useEffect(() => {
    // Create a new WebSocket connection when the component mounts
    const newSocket = new WebSocket(`${endpoint}?apiKey=${encodeURIComponent(API_KEY)}`);
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

        socket.send(JSON.stringify(message));
      };

      video.addEventListener('play', () => {
        // Start capturing and sending frames when the video starts playing
        const captureInterval = setInterval(captureAndSendFrame, 5000); // Adjust the capture interval as needed
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
        var emotionsArray = []
        if (receivedMessage !== null && receivedMessage.face.predictions.length !== 0){
          emotionsArray = receivedMessage.face.predictions[0].emotions;
          console.log(emotionsArray)
          if (emotionsArray.length !== 0) {
            let maxEmotion = emotionsArray[0];
            for (let i = 1; i < emotionsArray.length; i++) {
              if (emotionsArray[i].score > maxEmotion.score) {
                maxEmotion = emotionsArray[i];
              }
            }
            setEmotion(maxEmotion.name)
          }
        }
      };

    }
  }, [socket]);

  useEffect(() => {
    setNumOfRequests(numOfRequests + 1)
    var tempScore = emotions[emotion];
    setScore((score + tempScore) / numOfRequests);
    if (numOfRequests === (score_interval / emotion_interval)){
      // make endpoint request
      setScore(0);
    }
    console.log(score)


  }, [emotion])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  return (
    <div>
      <video ref={videoRef} width={640} height={360} autoPlay />
      <Data emotion={emotion}></Data>
    </div>
  );
};

export default Emotions;





