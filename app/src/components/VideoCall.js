import * as React from 'react';
import Peer from 'peerjs';

const VideoCall=({userId, partnerId, stream, caller})=> {  
    const partnerVideoRef = React.useRef(null);
    const videoRef = React.useRef(null);
    const peerInstance = React.useRef(null)
    React.useEffect( () => {
        const peer = new Peer(userId, {
            host: "sd-vm01.csc.ncsu.edu",
            port: 443,
            path: "/myapp"
        });

        peer.on("open", id => {
            console.log("Your ID is " + id);
            var conn = peer.connect(partnerId);
            conn.on("open", () => conn.send("Hi from react!"));
        });
        stream.then((mediaStream) => {
            videoRef.current.srcObject = mediaStream;
            if(caller){
                const outgoingCall = peer.call(partnerId, mediaStream)
                outgoingCall.on('stream', (remoteStream) => {
                    partnerVideoRef.current.srcObject = remoteStream
                });
            } else {
                peer.on("call", incomingCall => {
                    incomingCall.answer(mediaStream); // answer the call with an A/V stream.
                    incomingCall.on("stream", remoteStream => partnerVideoRef.current.srcObject = remoteStream);
                });
            }
        });
    });
    
    return (
        <>
            <label>{partnerId}</label>
            <div>
                <video width={640} height={360} ref={partnerVideoRef} autoPlay/>
            </div>
            <label>{userId}</label>
            <div>
                <video width={640} height={360} ref={videoRef} autoPlay/>
            </div>
        </>
    );
};

export default VideoCall;