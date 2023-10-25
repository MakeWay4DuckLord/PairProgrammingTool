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

    const [sentStream] = React.useState(stream.clone());

     React.useEffect( () => {
        if (videoRef.current) {
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
    });

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
            <div className={styles.videoContainer}>
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
        </>
    );
};

export default VideoCall;