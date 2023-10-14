import * as React from 'react';

const VideoCall = ({userId, partnerId, stream}) => {  
    return (
        <>
            <label>{partnerId}</label>
            <div>
                <video width={640} height={360} autoPlay/>
            </div>
            <label>{userId}</label>
            <video width={640} height={360} ref={stream} autoPlay />
        </>
    );
};

export default VideoCall;