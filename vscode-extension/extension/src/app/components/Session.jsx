import * as React from 'react';
import PiChart from './PiChart';
import Accordion from './Accordion'

const Session = ({onSwitch}) => {  
    return (
        <div>
            <Accordion 
                title="Code Contribution"
                content={<PiChart subject="Code Contribution" subject1="Your Lines of Code" subject2="Your Partner's Lines of Code" metric="Lines of Code" val1={10} val2={20} />}
            />
        </div>
    );
};

export default Session;