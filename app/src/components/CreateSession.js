import * as React from 'react';
import styles from '../styles/StartSession.module.css';
import { generateId, createPair, registerId } from '../client.js';
import VideoCall from './VideoCall'
import cx from 'classnames';

const CreateSession = () => {  
    const [userId, setUserId] = React.useState(generateId());
    const [partnerId, setPartnerId] = React.useState('');
    const [paired, setPaired] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [action, setAction] = React.useState('');
    const [caller, setCaller] = React.useState(false);
    const inputClassnames = cx({[styles.error]: error});

    const stream = React.useRef();

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
        setAction('');
        setPaired(true);
    }

    registerId(userId, setUserId, setAction, setPartnerId);
    
    return (
        <>
            {!paired && <div className={styles.container}>
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
                {error && <p className={styles.error}>ERROR! Please check your partner's ID and try again.</p>}
            </div>}
            {paired && <VideoCall userId={userId} stream={navigator.mediaDevices.getUserMedia({ video: true, audio: true })} partnerId={partnerId} caller={caller}/>}
        </>
    );
};

export default CreateSession;