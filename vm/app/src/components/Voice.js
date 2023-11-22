import * as React from 'react';


const Voice = ({userId, stream})=> {  
    //message is just for debugging the websocket
    const [message, setMessage] = React.useState('');
    // const [socket, setSocket] = React.useState(null);

    function getMicrophone() {
        const audioStream = stream.clone();
        audioStream.removeTrack(audioStream.getVideoTracks()[0]);
        const options = {
          mimeType: "audio/webm;codec=opus",
          bitsPerSecond: 25000000,
          // mimeType: "web/opus",
        }
        return new MediaRecorder(audioStream, options);
    }

    async function openMicrophone(microphone, socket) {
        await microphone.start(5000); 
     
        //send mic data as soon as its available
        microphone.ondataavailable = (e) => {
            if(socket && socket.readyState === 1 /* OPEN */) {
              console.log("client: sent data to websocket");
              console.log("data: " + e.data);
              socket.send(e.data);
            };
        }
      }

      async function start(socket){
        let microphone;
        if (!microphone) {
            // open and close the microphone
            microphone = await getMicrophone();
            await openMicrophone(microphone, socket);
          } else {
            await microphone.stop();
            microphone = undefined;
          }
      }



      React.useEffect( () => {        

          //connect to the websocket created in transcription.js
        const ws = new WebSocket('wss://sd-vm01.csc.ncsu.edu/server/voice'); 
          ws.onopen = () => {
              console.log('WebSocket connection established.');
              //on open, send first message containing user id
              ws.send(userId);
          };
    
          ws.onclose = () => {
              console.log('WebSocket connection closed.');
          };
          
        start(ws);

        // Clean up the WebSocket connection when the component unmounts
        return () => {
            if (ws) {
                ws.close();
            }
        };
        
        

    }, []); // The empty dependency array ensures the effect runs only once when the component mounts
};

export default Voice;