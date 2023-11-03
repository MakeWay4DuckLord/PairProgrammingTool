import * as React from 'react';


const Voice = ({userId, stream})=> {  
    //message is just for debugging the websocket
    const [message, setMessage] = React.useState('');
    // const [socket, setSocket] = React.useState(null);

    function getMicrophone() {
        const audioStream = stream.clone();
        audioStream.removeTrack(audioStream.getVideoTracks()[0]);
        return new MediaRecorder(audioStream);
    }

    async function openMicrophone(microphone, socket) {
        await microphone.start(500); 
     
        microphone.ondataavailable = (e) => {
            if(socket && socket.readyState === 1 /* OPEN */) {
              console.log("client: sent data to websocket");
              socket.send(e.data);
            };
        }
      }

      async function start(socket){

        // while(socket.readyState === 0) {
        //     // //wait for socket to be open
        //     // if(socket.readyState >= 2) {
        //     //     break;
        //     // }
        // }

        // socket.send({user_id: userId});

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
        const ws = new WebSocket('ws://localhost:42069');
        // const ws = io('ws//localhost:42069');

        ws.onopen = () => {
            console.log('WebSocket connection established.');
            ws.send(userId);

            //TODO send a message to tell transcription.js the user id
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