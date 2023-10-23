import * as React from 'react';
import styles from '../styles/CreateSession.module.css';
import cx from 'classnames';

const CreateSession = ({onSubmit, error, userId}) => {  
    const errorClassNames = cx(styles['error'], {[styles.hidden]:(!error)});
    const inputClassnames = cx({[styles.errorInput]: error});
    return (
        <div className={styles.container}>
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
        </div>
    );
};

export default CreateSession;