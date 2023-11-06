import * as React from 'react';
import Session from './components/Session'
import EndSession from './components/EndSession'

const App = () => {
  const [page, setPage] = React.useState('start');
  return (
    <div>
      {page === 'start' && <Session onSwitch={setPage}/>}
      {page === 'end' && <EndSession onSwitch={setPage} />}
    </div>
  );
};

export default App;