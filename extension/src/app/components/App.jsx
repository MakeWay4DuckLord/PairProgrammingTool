import * as React from 'react';
import StartSession from './StartSession';
import Session from './Session';

const App = () => {
  const [page, setPage] = React.useState(localStorage.getItem('page'));
  if (localStorage.getItem('page') === undefined) {
    localStorage.setItem('page', 'start');
    setPage('start');
  }
  return (
    <div>
      {page === 'start' && <StartSession onSwitch={setPage}/>}
      {page === 'session' && <Session onSwitch={setPage}/>}
    </div>
  );
};

export default App;