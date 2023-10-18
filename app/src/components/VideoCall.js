import * as React from 'react';
import Peer from 'peerjs';

const VideoCall=({userId, partnerId, stream, caller})=> {  
    const partnerVideoRef = React.useRef(null);
    const videoRef = React.useRef(null);

     React.useEffect( () => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
        //establish connection to signalling server
        const peer = new Peer(userId, {
            // host: "localhost",
            // port: 8080,
            // path: "/myapp"
        });

        //once connection is established, log id and send a message to peer for debugging
        peer.on("open", id => {
            console.log("Your ID is " + id);
            //this connection thingy is just to send messages for debugging, its not a step for setting up the call
            var conn = peer.connect(partnerId); 
            conn.on("open", () => conn.send("hello from " + id));
            if(caller){
                //call partner
                const outgoingCall = peer.call(partnerId, stream);
                //get their stream to display
                outgoingCall.on('stream', (remoteStream) => {
                    partnerVideoRef.current.srcObject = remoteStream
                });                
            } else { //otherwise wait for a incoming call
                peer.on("call", incomingCall => {
                    //answer with your a/v stream
                    incomingCall.answer(stream);
                    //display your partners a/v stream
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
                <video muted={true} width={640} height={360} ref={videoRef} autoPlay/>
            </div>
        </>
    );
};

export default VideoCall;