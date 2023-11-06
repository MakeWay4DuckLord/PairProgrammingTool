import * as React from 'react';
import PiChart from './PiChart';
import Accordion from './Accordion'
import styles from '../css/EndSession.module.css'
import Score from './Score'

const EndSession = ({onSwitch}) => {  
    const [score, setScore] = React.useState(10);
    const completeSession = () => {
        onSwitch('end');
    }
    return (
        <div className={styles.SessionContainer}>
            <h1>Today's Collaboration Score</h1>
            <Score number={score} />
            <button onClick={completeSession}>End Session</button>
        </div>
    );
};

export default EndSession;