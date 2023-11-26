import * as React from 'react';
import PiChart from './PiChart';
import Accordion from './Accordion'
import styles from '../styles/Session.module.css'
import axios from 'axios';
import cx from 'classnames';
import { getUserId, getPartnerId, closeSession } from '../client'

const Session = ({onSwitch}) => {  
    const [userId] = React.useState(getUserId());
    const [partnerId] = React.useState(getPartnerId());
    const [interruptions, setInterruptions] = React.useState(0);
    const [linesOfCode, setLinesOfCode] = React.useState(0);
    const [count, setCount] = React.useState(0);
    const [partnerLinesOfCode, setPartnerLinesOfCode] = React.useState(0);

    React.useEffect(() => {
        if (userId && partnerId) {
            console.log(interruptions);
            axios.get(`${process.env.REACT_APP_WEBPAGE_URL}/server/api/users/${userId}`).then((body) => {
                setLinesOfCode(body.data.lines_of_code);
                setTimeout(() => {
                    setCount(count + 1);
                }, 500)
            }, () => {
                setTimeout(() => {
                    setCount(count + 1);
                }, 500)
            })
            axios.get(`${process.env.REACT_APP_WEBPAGE_URL}/server/api/users/${partnerId}`).then((body) => {
                setPartnerLinesOfCode(body.data.lines_of_code);
            }, () => {
                //
            })
            axios.get(`${process.env.REACT_APP_WEBPAGE_URL}/server/api/utterances/interruptions/${userId}/${partnerId}`).then((body) => {
                setInterruptions(body.data);
            }, () => {
                //
            })
        }
    }, [count])

    const endSession = () => {
        closeSession();
        onSwitch('end');
    }

    const interruptionClassnames = cx({[styles.interruptions]:true, [styles.red]:interruptions > 10, [styles.green]:interruptions < 5, [styles.orange]:interruptions > 5});
    
    return (
        <div className={styles.SessionContainer}>
            <h1>Your Collaboration Metrics</h1>
            <Accordion 
                title="Code Contribution"
                content=
                {<div>
                    <PiChart subject="Code Contribution" 
                    subject1="Your Lines of Code" 
                    subject2="Your Partner's Lines of Code" 
                    metric="Lines of Code" 
                    val1={linesOfCode} val2={partnerLinesOfCode} />
                </div>}
                
            />
            <Accordion title="Voice Activity" content={
            <div className={styles.text}>
                <span className={styles.voice}>You have interrupted your partner <p className={interruptionClassnames}>{interruptions}</p> times!</span>
            </div>
            } />
            <button className={styles.end} onClick={endSession}>End Session</button>
        </div>
    );
};

export default Session;