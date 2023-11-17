import React from 'react';
import styles from '../styles/Accordion.module.css';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion as AccordionContainer, AccordionDetails, AccordionSummary } from '@mui/material'

const Accordion = ({title, content}) => {
    return (
        <AccordionContainer className={styles.Accordion}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>{title}</AccordionSummary>
            <AccordionDetails>{content}</AccordionDetails>
        </AccordionContainer>
    )
}

export default Accordion;