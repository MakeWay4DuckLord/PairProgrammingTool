import * as React from 'react';
import Accordion from './Accordion';
import { clearSession } from '../client';
import styles from '../styles/EndSession.module.css';
import Score from './Score';
import { getUserId, getPartnerId } from '../client';
import axios from 'axios';

const EndSession = ({ onSwitch }) => {
  const [score, setScore] = React.useState(null);
  const [userId] = React.useState(getUserId());
  const [partnerId] = React.useState(getPartnerId());
  const [leadershipStyle, setLeadershipStyle] = React.useState('');
  const [communicationStyle, setCommunicationStyle] = React.useState('');
  const [selfEfficacy, setSelfEfficacy] = React.useState('');
  const [userInterruptions, setUserInterruptions] = React.useState(null);

  const completeSession = () => {
    clearSession();
    onSwitch('');
  };

  const leadershipStyleOptions = ["AUTHORITATIVE", "DEMOCRATIC"];
  const communicationStyleOptions = ["VERBAL", "NON-VERBAL"];
  const selfEfficacyOptions = ["HIGH", "LOW"];

  const fetchLinesOfCode = () => {
    try {
      return axios.get(`${process.env.REACT_APP_WEBPAGE_URL}/server/api/users/${userId}`)
        .then(responseUser => {
          const LOCUser = responseUser.data.lines_of_code;

          return axios.get(`${process.env.REACT_APP_WEBPAGE_URL}/server/api/users/${partnerId}`)
            .then(responsePartner => {
              const LOCPartner = responsePartner.data.lines_of_code;
              return [LOCUser, LOCPartner];
            });
        });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchInterruptions = () => {
    try {
      return axios.get(`${process.env.REACT_APP_WEBPAGE_URL}/server/api/utterances/interruptions/${userId}/${partnerId}`)
        .then(responseUser => {
          const InterUser = responseUser.data;

          return axios.get(`${process.env.REACT_APP_WEBPAGE_URL}/server/api/utterances/interruptions/${partnerId}/${userId}`)
            .then(responsePartner => {
              const InterPartner = responsePartner.data;
              return [InterUser, InterPartner];
            });
        });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchExpressionScore = () => {
    try {
      return axios.get(`${process.env.REACT_APP_WEBPAGE_URL}/server/api/users/${userId}`)
        .then(responseUser => {
          const ESUser = responseUser.data.expression_scores;
          return ESUser;
        });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const calculateScores = (LOC, Interruptions, ExpressionScore) => {

    if ((LOC[0] + LOC[1]) == 0){
        setLeadershipStyle(leadershipStyleOptions[1]);
    }
    else if (LOC[0]/(LOC[0] + LOC[1]) < .25 || LOC[0]/(LOC[0] + LOC[1]) > .75){
        setLeadershipStyle(leadershipStyleOptions[0]);
    }
    else {
        setLeadershipStyle(leadershipStyleOptions[1]);
    }

    var locColab
    if ((LOC[0] + LOC[1]) == 0){
        locColab = 0;
    }
    else{
        locColab = 10 - Math.abs(LOC[0]/(LOC[0] + LOC[1]) - .5 )  * 20;
    }

    // check on how to get partner's utternaces 
    const nonZeroEntries = ExpressionScore.filter(entry => entry !== 0);
    const expRatio = ExpressionScore.length / nonZeroEntries.length;

    if (expRatio > .5) {
        setCommunicationStyle(communicationStyleOptions[1]);
    }
    else {
        setCommunicationStyle(communicationStyleOptions[0]);
    }

    var interColab
    if ((Interruptions[0] + Interruptions[1]) == 0){
        interColab = 10;
    }
    else{
        interColab = 10 - Math.abs(Interruptions[0]/(Interruptions[0] + Interruptions[1]) - .5 ) * 20;
    }

    setScore(((locColab + interColab) / 2).toFixed(1));

    // if (expRatio > .5 && verbalRatio < .5) {
    //     setCommunicationStyle("Non-Verabal");
    // }
    // else if (expRatio < .5 && verbalRatio > .5) {
    //     setCommunicationStyle("Verbal")
    // }
    // else {
    //     setCommunicationStyle("Verbal and Non-Verbal")
    // }

    const length = ExpressionScore.length;

    if (ExpressionScore.length < 3){
        setSelfEfficacy(selfEfficacyOptions[0]);
    }
    else{
        // Calculate the indices for the first, middle, and final thirds
        const firstThirdEnd = Math.floor(length / 3);
        const middleThirdStart = firstThirdEnd;
        const middleThirdEnd = Math.floor((2 * length) / 3);
    
        // Use slice to get the subarrays for each third
        const firstThird = array.slice(0, firstThirdEnd);
        const middleThird = array.slice(middleThirdStart, middleThirdEnd);
        const finalThird = array.slice(middleThirdEnd);
    
        // Calculate the sum of each third
        const sumFirstThird = firstThird.reduce((acc, num) => acc + num, 0);
        const sumMiddleThird = middleThird.reduce((acc, num) => acc + num, 0);
        const sumFinalThird = finalThird.reduce((acc, num) => acc + num, 0);

        if (sumFinalThird >= (sumFirstThird + sumMiddleThird) / 2){
            setSelfEfficacy(selfEfficacyOptions[0]);
        }
        else if (sumFinalThird <= (sumFirstThird + sumMiddleThird) / 2){
            setSelfEfficacy(selfEfficacy[1]);
        }
    }

};

  React.useEffect(() => {
    if (userId && partnerId) {
      fetchLinesOfCode()
        .then(LOC => {
          fetchInterruptions()
            .then(Interruptions => {
              setUserInterruptions(Interruptions[0]);
              fetchExpressionScore()
                .then(ExpressionScore => {
                  calculateScores(LOC, Interruptions, ExpressionScore);
                });
            });
        });
    }
  }, [userId, partnerId]);

  return (
    <div className={styles.SessionContainer}>
      <h1>Today's Collaboration Score</h1>
      {score !== null && (
        <Score number={score} />
      )}

      {/* Conditionally render Accordions only when state values are set */}
      {communicationStyle !== '' && (
        <Accordion
          title={`Your communication style was ${communicationStyle}`}
          content={
            <div>
              <h3>Calculated by evaluating the ratio of positive and negative emotions to neutral emotions</h3>
            </div>
          }
        />
      )}
      {userInterruptions !== null && (
        <Accordion
          title={`You interrupted your partner ${userInterruptions} times`}
          content={
            <div>
              <h3>Calculated by evaluating the timestamp of your utterance against your partner's</h3>
            </div>
          }
        />
      )}
      {leadershipStyle !== '' && (
        <Accordion
          title={`Your leadership style was ${leadershipStyle}`}
          content={
            <div>
              <h3>Calculated by evaluating the ratio of your lines of code contribution to your partner's'</h3>
            </div>
          }
        />
      )}
      {selfEfficacy !== '' && (
        <Accordion
          title={`You displayed a ${selfEfficacy} level of self efficacy`}
          content={
            <div>
              <h3>Calculated by observing the aggregate expression score of the final third of the session compared to the beginning two-thirds </h3>
            </div>
          }
        />
      )}

      <button onClick={completeSession}>Close Report</button>
    </div>
  );
};

export default EndSession;
