// export const ws = new WebSocket('ws://sd-vm01.csc.ncsu.edu');

import WebSocket from 'isomorphic-ws'

export const ws = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_URL}/server/extension/ws`);
var userId = null;
var partnerId = null;
var extensionId = null;
var idRegistered = false;

export const registerId = (id, setPage) => {
    // wait for connection to establish
    ws.onopen = () => {
      extensionId = id;
      // keep alive
      ws.send(JSON.stringify({ action: "keepalive" }));
      ws.send(JSON.stringify({ action: "extensionId", eid: id }));
      // wait to see if ID is correctly registered
      ws.addEventListener("message", (event) => {
        console.log(event.data);
        // id successfully registered
        if (JSON.parse(event.data).action === 'registered') {
          idRegistered = true;
        // hello
        } else if (JSON.parse(event.data).action === 'start') {
          partnerId = JSON.parse(event.data).partnerId;
        } else if (JSON.parse(event.data).action === 'keepalive') {
          sleep(10000).then(() => {
            ws.send(JSON.stringify({action: "keepalive", id: id}));
          })
        } else if (JSON.parse(event.data).action === 'paired') {
          userId = JSON.parse(event.data).id;
        } else if (JSON.parse(event.data).action === 'close') {
          userId = JSON.parse(event.data).id;
          partnerId = JSON.parse(event.data).partnerId;
          setPage('end');
        }
      });
    }
  }

export const createPair = (id, partnerId, setMessage) => {
  ws.send(JSON.stringify({
    action: "pair", id1: id, id2: partnerId
  }));
}

export const closeSession = () => {
  ws.send(JSON.stringify({
    action: "close", eid: extensionId, id: userId
  }));
}

export const clearSession = () => {
  ws.send(JSON.stringify({
    action: "clear", eid: extensionId, id: userId
  }));
  // Reset
  userId = null;
  partnerId = null;
  setTimeout(() => {
    ws.send(JSON.stringify({ action: "extensionId", eid: extensionId }));
  }, 100)
}

export const getUserId = () => {
  return userId;
}

export const getPartnerId = () => {
  return partnerId;
}

export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}