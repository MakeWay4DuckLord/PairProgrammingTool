import * as React from 'react';

const App = () => {
  const [value, setValue] = React.useState('clicked: 0');
  const [count, setCount] = React.useState(1);
  const whenClicked = () => {
    setValue(`clicked: ${count}`);
    setCount(count + 1);
    console.log(window.location.href);
  };
  return (
    <div>
      <button onClick={() => (whenClicked())}>{value}</button>
    </div>
  );
};

export default App;