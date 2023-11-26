import * as React from 'react';
import { generateId, createPair, endSession, registerId } from './client.js';
import VideoCall from './components/VideoCall';
import CreateSession from './components/CreateSession';
import Waiting from './components/Waiting';

const App = () => {  
    const [userId, setUserId] = React.useState(generateId());
    const [partnerId, setPartnerId] = React.useState('');
    const [paired, setPaired] = React.useState(false);
    const [permissionsGranted, setPermissionsGranted] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [action, setAction] = React.useState('');
    const [caller, setCaller] = React.useState(false);
    const [stream, setStream] = React.useState(null);
    const [sessionActive, setSessionActive] = React.useState(true);

    React.useEffect(() => {
        const getUserMedia = async () => {
            if (navigator.mediaDevices) {
                navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(async (mediaStream) => {
                    setStream(mediaStream);
                    setPermissionsGranted(true);
                }, () => {
                    
                });
            }
        };
        getUserMedia();
    }, []);

    const onSubmit = () => {
        const partnerId = document.getElementById('partner-id').value;
        createPair(userId, partnerId, setAction);
        setCaller(true);
    }

    if (action === 'error') {
        setCaller(false);
        setError(true);
        setAction('');
    } else if (action === 'start') {
        setError(false);
        setAction('');
        setPaired(true);
    }

    React.useEffect(() => {
        if (paired) {
            window.addEventListener("beforeunload", () => {  
                endSession(userId);
            });
        }
    }, [paired])

    registerId(userId, setUserId, setAction, setPartnerId, setSessionActive);
    
    return (
        <div className="App">
            {!permissionsGranted && <Waiting />}
            {permissionsGranted && !paired && <CreateSession onSubmit={onSubmit} error={error} userId={userId}/>}
            {permissionsGranted && paired && <VideoCall userId={userId} stream={stream} partnerId={partnerId} caller={caller} active={sessionActive}/>}
        </div>
    );
};

export default App;