import * as React from 'react';
import Session from './components/Session'

const App = () => {
  const [page, setPage] = React.useState(localStorage.getItem('page'));
  if (localStorage.getItem('page') === undefined) {
    localStorage.setItem('page', 'start');
    setPage('start');
  }
  return (
    <div>
      <Session onSwitch={setPage}/>
    </div>
  );
};

export default App;