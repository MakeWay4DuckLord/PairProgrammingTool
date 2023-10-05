import WebSocket from 'isomorphic-ws';

export const ws = new WebSocket('ws://localhost:8080');
var userId;
var idRegistered = false;

export const generateId = () => {
  userId = "User" + Math.floor(Math.random() * 10000);
  return userId;
}

export const registerId = (id, setId, onSwitch) => {
  if (!idRegistered) {
    // wait for connection to establish
    ws.onopen = () => {
      // register ID
      ws.send(JSON.stringify({ action: "id", id: id}));
      // wait to see if ID is correctly registered
      ws.addEventListener("message", (event) => {
        // id successfully registered
        if (JSON.parse(event.data).action === 'registered') {
          idRegistered = true;
          // add an event listener if partner connects for us
          ws.addEventListener("message", (event) => {
            if (JSON.parse(event.data).action === 'start') {
              switchPage('session');
            }
          })
        // id already in use
        } else {
          let newId = generateId();
          setId(newId);
          registerId(newId);
        }
      });
    }
  }
}

export const createPair = (id, partnerId, setMessage) => {
  ws.send(JSON.stringify({
    action: "pair", id1: id, id2: partnerId
  }));

  ws.addEventListener("message", (event) => {
    setMessage(JSON.parse(event.data).action);
  })
}