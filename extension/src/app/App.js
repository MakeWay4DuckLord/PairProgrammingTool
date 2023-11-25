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
  registerId(extensionID, setPage);

  React.useEffect(() => {
    if (page === '' && partnerId) {
      setUserId(null);
      setPartnerId(null);
    }
  }, [page])

  React.useEffect(() => {
    // Attempt to get the userID that is paired with the extension ID
    if (!userId && getUserId()) {
      setUserId(getUserId());
      setTimeout(() => {
        setNumber(number + 1);
      }, 100)
    } else {
      setTimeout(() => {
        setCount(count + 1);
      }, 300)
    }
  }, [count])

  React.useEffect(() => {
    // Attempt to get the userID that is paired with the extension ID
    if (userId && !partnerId && getPartnerId()) {
      setPage('start');
      setPartnerId(getPartnerId());
    } else if (userId) {
      setTimeout(() => {
        setNumber(number + 1);
      }, 300)
    }
  }, [number])

  return (
    <div className={styles.App}>
      {page === '' && <a href={url}><button>Create New Session</button></a>}
      {page === 'start' && <Session onSwitch={setPage}/>}
      {page === 'end' && <EndSession onSwitch={setPage} />}
    </div>
  );
};

export default App;