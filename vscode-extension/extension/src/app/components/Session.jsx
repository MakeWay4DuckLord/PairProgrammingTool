import * as React from 'react';

const Session = ({onSwitch}) => {  
    const onSubmit = () => {
        const userId = document.getElementById('id').value;
        onSwitch('session');
    }
    return (
        <div>
        </div>
    );
};

export default Session;