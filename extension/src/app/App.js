import * as React from 'react';
import Session from './components/Session'
import EndSession from './components/EndSession'
import styles from './styles/App.module.css'
import { getUserId, getPartnerId, registerId } from './client.js';

var url = process.env.REACT_APP_WEBPAGE_URL + '?extension=' + extensionID;

const App = () => {
  const [page, setPage] = React.useState('');
  const [userId, setUserId] = React.useState(null);
  const [partnerId, setPartnerId] = React.useState(null);
  const [count, setCount] = React.useState(0);
  const [number, setNumber] = React.useState(0);
  // Register our extension ID
  registerId(extensionID);

  React.useEffect(() => {
    // Attempt to get the userID that is paired with the extension ID
    if (!userId && getUserId()) {
      setUserId(getUserId());
      setNumber(number + 1);
    } else {
      setTimeout(() => {
        setCount(count + 1);
      }, 1000)
    }
  }, [count])

  React.useEffect(() => {
    // Attempt to get the userID that is paired with the extension ID
    if (userId && !partnerId && getPartnerId()) {
      setPartnerId(getPartnerId());
      setPage('start');
    } else if (userId) {
      setTimeout(() => {
        setNumber(number + 1);
      }, 1000)
    }
  }, [number])

  return (
    <div className={styles.App}>
      {userId && <h1>{userId}</h1>}
      {page === '' && <a href={url}><button>Create New Session</button></a>}
      {page === 'start' && <Session onSwitch={setPage}/>}
      {page === 'end' && <EndSession onSwitch={setPage} />}
    </div>
  );
};

export default App;