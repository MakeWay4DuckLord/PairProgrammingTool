import * as React from 'react';
import Session from './components/Session'
import EndSession from './components/EndSession'
import styles from './styles/App.module.css'
// import {extensionID} from 'extension.js'

const App = () => {
  const [page, setPage] = React.useState('');
  return (
    <div className={styles.App}>
      {page === '' && <a href="https://sd-vm01.csc.ncsu.edu/?extension=${extensionID}"><button>Create New Session</button></a>}
      {page === 'start' && <Session onSwitch={setPage}/>}
      {page === 'end' && <EndSession onSwitch={setPage} />}
    </div>
  );
};

export default App;