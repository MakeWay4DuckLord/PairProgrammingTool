// export const ws = new WebSocket('ws://sd-vm01.csc.ncsu.edu');

import WebSocket from 'isomorphic-ws'

export const ws = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_URL}/server/extension/ws`);
var userId = null;
var partnerId = null;
var extensionId = null;
var idRegistered = false;

export const registerId = (id, setPage) => {
  if (!idRegistered) {
    // wait for connection to establish
    ws.onopen = () => {
      extensionId = id;
      // register ID
      ws.send(JSON.stringify({ action: "extensionId", eid: id }));
      extensionId = id;
      // keep alive
      ws.send(JSON.stringify({ action: "keepalive" }));
      // wait to see if ID is correctly registered
      ws.addEventListener("message", (event) => {
        console.log(JSON.parse(event.data));
        // id successfully registered
        if (JSON.parse(event.data).action === 'registered') {
          idRegistered = true;
        // hello
        } else if (JSON.parse(event.data).action === 'hello') {
          sleep(10000).then(() => {
            ws.send(JSON.stringify({action: "keepalive", id: id}));
          })
        // else, error or start
        } else if (JSON.parse(event.data).action === 'start') {
          partnerId = JSON.parse(event.data).partnerID;
        } else if (JSON.parse(event.data).action === 'keepalive') {
          sleep(10000).then(() => {
            ws.send(JSON.stringify({action: "keepalive", id: id}));
          })
        } else if (JSON.parse(event.data).action === 'paired') {
          userId = JSON.parse(event.data).id;
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

export const closeSession = () => {
  ws.send(JSON.stringify({
    action: "close", eid: extensionId, id: userId
  }));
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