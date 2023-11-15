import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Peer from 'peerjs';
import { faVolumeUp, faVolumeMute, faVideoCamera, faVideoSlash } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/VideoCall.module.css';
import Voice from "./Voice.js"
import cx from 'classnames';
import Emotions from './Emotions';
import axios from 'axios';

const VideoCall=({userId, partnerId, stream, caller})=> {  
    const partnerVideoRef = React.useRef(null);
    const videoRef = React.useRef(null);
    const [muted, setMuted] = React.useState(false);
    const [videoOn, setVideoOn] = React.useState(true);
    const [hideVideo, setHideVideo] = React.useState(false);
    const [sentStream] = React.useState(stream.clone());
    const [isPaired, setIsPaired] = React.useState(false);
    const [inDatabase, setIsInDatabase] = React.useState(false);

    var pairedId = null;
    var user_id = null;

     React.useEffect( () => {
        if (videoRef.current) {
            videoRef.current.srcObject = sentStream;
        }
        //establish connection to signalling server
        const peer = new Peer(userId, {
            host: 'sd-vm01.csc.ncsu.edu',
            path: "/webrtc/myapp"
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
                console.log("enters");
                pairedId = partnerId;
                user_id = id;
                setIsPaired(true);

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

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                await axios.post(`http://sd-vm01.csc.ncsu.edu/server/api/sessions/${userId}/${partnerId}`);
                setIsInDatabase(true);
            } catch (error) {
                console.log(error);
            }
        };
        if (isPaired){
            fetchData();
        }
    }, [isPaired]);

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
                <div className={styles.videoContainer} data-testid="video-call">
                    <video width={640} height={360} ref={videoRef} autoPlay/>
                </div>
                {/* <video muted={true} width={640} height={360} ref={videoRef} autoPlay/> */}
            </div>
            { isPaired && 
            <>
                <Emotions muted={true} videoStream={stream} id={userId} />
                <Voice userId={userId} stream={stream}/>
            </>
            }
        </>
    );
};

export default VideoCall;