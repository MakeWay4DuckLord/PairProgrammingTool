import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Peer from 'peerjs';
import { faVolumeUp, faVolumeMute, faVideoCamera, faVideoSlash } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/VideoCall.module.css';
import cx from 'classnames';

const VideoCall=({userId, partnerId, stream, caller})=> {  
    const partnerVideoRef = React.useRef(null);
    const videoRef = React.useRef(null);
    const [muted, setMuted] = React.useState(false);
    const [videoOn, setVideoOn] = React.useState(true);
    const [hideVideo, setHideVideo] = React.useState(false);

    //message is just for debugging the websocket
    const [message, setMessage] = React.useState('');
    const [socket, setSocket] = React.useState(null);

    const [sentStream] = React.useState(stream.clone());
    // const [audioStream] = React.useState(stream.clone());

    function getMicrophone() {
        const audioStream = stream.clone();
        audioStream.removeTrack(audioStream.getVideoTracks()[0]);
        return new MediaRecorder(audioStream);
    }

    async function openMicrophone(microphone, socket) {
        await microphone.start(500);
      
        // microphone.onstart = () => {
        //   console.log("client: microphone opened");
        //   document.body.classList.add("recording");
        // };
      
        // microphone.onstop = () => {
        //   console.log("client: microphone closed");
        //   document.body.classList.remove("recording");
        // };
      
        microphone.ondataavailable = (e) => {
          console.log("client: sent data to websocket");
          socket.send(e.data);
        };
      }

      async function start(socket){
        let microphone;
        if (!microphone) {
            // open and close the microphone
            microphone = await getMicrophone();
            await openMicrophone(microphone, socket);
          } else {
            await microphone.stop(); //might need to move to async function closeMicrophone()
            microphone = undefined;
          }
      }



     React.useEffect( () => {
         if (videoRef.current) {
             //set source object to be displayed in this component
             videoRef.current.srcObject = sentStream;
         }
         //establish connection to signalling server
         const peer = new Peer(userId, {
             host: 'sd-vm01.csc.ncsu.edu',
             port: 443,
             path: "/myapp"
         });
         
         //once connection is established, log id and send a message to peer for debugging
         peer.on("open", id => {
             console.log("Your ID is " + id);
             //this connection thingy is just to send messages for debugging, its not a step for setting up the call
             var conn = peer.connect(partnerId); 
             conn.on("open", () => conn.send("hello from " + id));
             if(caller){
                 //call partner
                 const outgoingCall = peer.call(partnerId, sentStream);
                 //get their stream to display
                 outgoingCall.on('stream', (remoteStream) => {
                     partnerVideoRef.current.srcObject = remoteStream
                 });                
             } else { //otherwise wait for a incoming call
                 peer.on("call", incomingCall => {
                     //answer with your a/v stream
                     incomingCall.answer(sentStream);
                     //display your partners a/v stream
                     incomingCall.on("stream", remoteStream => partnerVideoRef.current.srcObject = remoteStream);
                 });
             }
         });

        
        const ws = new WebSocket('ws://localhost:42069');
        // const ws = new WebSocket('wss://api.deepgram.com/v1/listen');

        ws.onopen = () => {
            console.log('WebSocket connection established.');
        };

        ws.onmessage = (event) => {
            setMessage(event.data);
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed.');
        };

        setSocket(ws);

        start(ws);

        // Clean up the WebSocket connection when the component unmounts
        return () => {
            ws.send({ 'type': 'CloseStream' });
            if (socket) {
                socket.close();
            }
        };
        
        

    }, []); // The empty dependency array ensures the effect runs only once when the component mounts

    const sendMessage = () => {
        if (socket) {
        // Send a message to the WebSocket server
        socket.send('Hello, server!');
        }
    };

    const onMute = () => {
        sentStream.getAudioTracks()[0].enabled = muted;
        setMuted(!muted);
    }

    const onVideoChange = () => {
        sentStream.getVideoTracks()[0].enabled = !videoOn;
        setVideoOn(!videoOn);
    }

    const onHide = () => {
        setHideVideo(!hideVideo);
    }
    
    return (
        <>
            <div className={styles.videoContainer} data-testid="video-call">
                <video width={640} height={360} ref={partnerVideoRef} autoPlay/>
            </div>
            <div className={cx({[styles.hideCamera]:hideVideo}, styles.videoContainer)}>
                <div className={styles.videoCall}>
                    <button onClick={onMute}>{muted ? <FontAwesomeIcon icon={faVolumeMute}/> : <FontAwesomeIcon icon={faVolumeUp}/>}</button>
                    <button onClick={onVideoChange}>{videoOn ? <FontAwesomeIcon icon={faVideoCamera}/> : <FontAwesomeIcon icon={faVideoSlash}/>}</button>
                    <button onClick={onHide}>Hide</button>
                </div>
                <video muted={true} width={640} height={360} ref={videoRef} autoPlay/>
            </div>
            {/* temp stuff for testing voice-to-text */}
            <div>
                <p>Message from server: {message}</p>
                <button onClick={sendMessage}>Send Message</button>
            </div>
        </>
    );
};

export default VideoCall;