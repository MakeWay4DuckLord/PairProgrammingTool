import WebSocket from 'isomorphic-ws';


// export const ws = new WebSocket('ws://sd-vm01.csc.ncsu.edu');
export const ws = new WebSocket('ws://sd-vm01.csc.ncsu.edu:80/ws');
var userId;
var idRegistered = false;

export const generateId = () => {
  userId = "User" + Math.floor(Math.random() * 10000);
  return userId;
}

export const registerId = (id, setId, setAction, setPartnerId) => {
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
        // hello
        } else if (JSON.parse(event.data).action === 'hello') {
          sleep(10000).then(() => {
            ws.send(JSON.stringify({action: "keepalive"}));
          })
        // id already in use
        } else if (!idRegistered) {
          let newId = generateId();
          setId(newId);
          registerId(newId);
        // else, error or start
        } else if (JSON.parse(event.data).action === 'start') {
          setAction(JSON.parse(event.data).action);
          setPartnerId(JSON.parse(event.data).partner)
        } else if (JSON.parse(event.data).action === 'error') {
          setAction(JSON.parse(event.data).action);
        } else if (JSON.parse(event.data).action === 'keepalive') {
          sleep(10000).then(() => {
            ws.send(JSON.stringify({action: "keepalive"}));
          })
        }
      });
    }
  }
}

export const createPair = (id, partnerId, setMessage) => {
  ws.send(JSON.stringify({
    action: "pair", id1: id, id2: partnerId
  }));
}

export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}