import './App.css';
import CreateSession from './components/CreateSession';
const db = require('./db');

function App() {
  return (
    <div className="App">
      <CreateSession/>
    </div>
  );
}

export default App;
