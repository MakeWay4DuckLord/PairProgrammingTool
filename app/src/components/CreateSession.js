import * as React from 'react';
import styles from '../styles/CreateSession.module.css';
import { generateId, createPair, registerId } from '../client.js';
import VideoCall from './VideoCall'
import cx from 'classnames';

const CreateSession = () => {  
    const [userId, setUserId] = React.useState(generateId());
    const [partnerId, setPartnerId] = React.useState('');
    const [paired, setPaired] = React.useState(false);
    const [permissionsGranted, setPermissionsGranted] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [action, setAction] = React.useState('');
    const errorClassNames = cx(styles['error'], {[styles.hidden]:(!error)});
    const inputClassnames = cx({[styles.errorInput]: error});
    const [caller, setCaller] = React.useState(false);
    const [stream, setStream] = React.useState(null);

    React.useEffect(() => {
        const getUserMedia = async () => {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(async (mediaStream) => {
                setStream(mediaStream);
                setPermissionsGranted(true);
            }, () => {
                
            });
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

    registerId(userId, setUserId, setAction, setPartnerId);
    
    return (
        <>
            {!permissionsGranted && 
                <div>Waiting for permissions...
                </div>}
            {permissionsGranted && !paired && <div className={styles.container}>
                <h1>Create New Session</h1>
                <div className={styles.id}>
                    <label>Your unique ID: </label>
                    <label className={styles.userId}>{userId}</label>
                </div>
                <label className={styles.inputLabel}>Enter Your Partner's ID: </label>
                <input 
                className={inputClassnames}
                id="partner-id" 
                placeholder='User...' 
                type="text"/>
                <button id="id" onClick={onSubmit}>Start Session</button>
                <p className={errorClassNames}>ERROR! Please check your partner's ID and try again.</p>
            </div>}
            {permissionsGranted && paired && <VideoCall userId={userId} stream={stream} partnerId={partnerId} caller={caller}/>}
        </>
    );
};

export default CreateSession;