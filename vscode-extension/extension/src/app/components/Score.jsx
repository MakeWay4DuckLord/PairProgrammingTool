import React from 'react';
import styles from '../styles/Score.module.css';
import cx from 'classnames';

const Score = ({number}) => {
    const classNames = cx(styles.score, 
        {[styles.small]: number <= 3.33}, 
        {[styles.medium]: number > 3.33 && number <= 6.66},
        {[styles.large]: number > 6.66})
    return (
        <span className={classNames}>{number}</span>
    )
}

export default Score;