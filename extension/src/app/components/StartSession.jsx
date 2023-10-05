import * as React from 'react';
import styles from '../styles/StartSession.module.css';
import { generateId, createPair, registerId } from '../../client.js';
import cx from 'classnames';

const StartSession = ({onSwitch}) => {  
    const [userId, setUserId] = React.useState(localStorage.getItem('userId'));
    const [error, setError] = React.useState(false);
    const [action, setAction] = React.useState('');
    const inputClassnames = cx({[styles.error]: error});

    const changeId = (id) => {
        setUserId(id);
        localStorage.setItem('userId', id);
    }
    const onSubmit = () => {
        const partnerId = document.getElementById('partner-id').value;
        createPair(userId, partnerId, setAction);
    }

    if (localStorage.getItem('userId') === undefined) {
        setUserId(generateId());
    } 
    if (action === 'error') {
        setError(true);
        setAction('');
    } else if (action === 'start') {
        setAction('');
        onSwitch('session');
    }

    registerId(userId, changeId, onSwitch);
    
    return (
        <div className={styles.container}>
            <h1>Create New Session</h1>
            <div>
                <label>Your unique ID: </label>
                <label className={styles.userId}>{userId}</label> 
            </div>
            <label>Enter Your Partner's ID: </label>
            <input 
            className={inputClassnames}
            id="partner-id" 
            placeholder='User...' 
            type="text"/>
            <button id="id" onClick={onSubmit}>Start Session</button>
            {error && <p className={styles.error}>ERROR! Please check your partner's ID and try again.</p>}
        </div>
    );
};

export default StartSession;