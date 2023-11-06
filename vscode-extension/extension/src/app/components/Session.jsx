import * as React from 'react';
import PiChart from './PiChart';
import Accordion from './Accordion'
import styles from '../css/Session.module.css'

const Session = ({onSwitch}) => {  
    const [codeMessage, setCodeMessage] = React.useState("You're contributing evenly! Keep up the great work.");
    const [interruptions, setInterruptions] = React.useState(0);

    const endSession = () => {
        onSwitch('end');
    }
    return (
        <div className={styles.SessionContainer}>
            <h1>Your Collaboration Metrics</h1>
            <Accordion 
                title="Code Contribution"
                content={
                <>
                    <PiChart subject="Code Contribution" 
                    subject1="Your Lines of Code" 
                    subject2="Your Partner's Lines of Code" 
                    metric="Lines of Code" 
                    val1={10} val2={20} />
                    <p>{codeMessage}</p>
                </>
                }
            />
            <Accordion title="Voice Activity" content={
            <>
                <p className={styles.voice}>You've have interrupted your partner <p className={styles.interruptions}>{interruptions}</p> times!</p>
            </>
            } />
            <button onClick={endSession}>End Session</button>
        </div>
    );
};

export default Session;