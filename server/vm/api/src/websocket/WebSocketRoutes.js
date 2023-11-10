const express = require('express');
const websocketRouter = express.Router();


let clients = new Set();
var userIDs = [];
var pairings = {};
var connections = {};

/******************\
* WEBSOCKET ROUTES *
\******************/

websocketRouter.ws('/ws', (ws, req) => {
  clients.add(ws);
  console.log('New client');
  sendPacket(ws, {action: "hello"});
  ws.on('message', (msg) => {
    // const packet = JSON.parse(msg);
    const message = JSON.parse(msg);
    console.log(message);
    switch (message.action) {
      case "hello":
        console.log("Said hello");
        break;
      case "id":
        console.log("registering an id");
        let id = message.id;
        if (connections[id] === undefined) {
          connections[id] = [ws];
        }
          
        if (id in userIDs) {
          sendPacket(ws, { action: "error", reason: "Id Already Exists"})
        } else {
          userIDs.push(id);
          sendPacket(ws, {action: "registered", id: id})
        }

        break;
      case "pair":
        console.log("WS: Client " + message.id1 + " is trying to pair with Client " + message.id2);

        let returns = pair(message.id1, message.id2);
    
        if (returns.worked) {
          sendPacket(ws, {action: "start", partner: message.id2});
              
          if (!(connections[message.id2] === undefined)) {
            connections[message.id2].forEach((ws) => {
              sendPacket(ws, {action: "start", partner: message.id1});
            })
          }
                
        } else {
          sendPacket(ws, {action: "error", reason: returns.message});
        }

        break;
      case "close":
        sendPacket(ws, {action: "close"});
        connections[pairings[message.id]].forEach((ws) => {
          sendPacket(ws, {action: "close"});
        });
        delete connections[message.id];
        userIDs.splice(userIDs.indexOf(message.id), 1);
        delete pairings[message.id];
        clients.delete(ws);
        break;
      case "keepalive":
        sendPacket(ws, {action: "keepalive"});
        break;
      default:
        console.log("WS: idk man");
    }
  });

  ws.on('close', e => {
    // closed(ws);
    clients.delete(ws);
    console.log('client closed');
  });
});


function sendPacket(ws, data) {
  ws.send(JSON.stringify(data));
}

// function closed(ws) {
//   sendPacket(ws, {action: "close"});
//   connections[pairings[message.id]].forEach((ws) => {
//     sendPacket(ws, {action: "close"});
//   });
//   delete connections[message.id];
//   userIDs.splice(userIDs.indexOf(message.id), 1);
//   delete pairings[message.id];
// }

function pair(uid1, uid2) {

  let validPair = true;
  let msg = "";
  if (uid1 in pairings || uid2 in pairings) {
    msg = "One or both partners is already paired.";
    console.log("WS: " + msg);
    validPair = false;
  } else if (!(userIDs.includes(uid1)) || !(userIDs.includes(uid2))) {
    msg = "One or both partners has not registered yet.";
    console.log("WS: " + msg);
    validPair = false;
  } else {
    msg = "success";
    pairings[uid1] = uid2;
    pairings[uid2] = uid1;
  }
  return { 'worked': validPair, 'message': msg };
}


module.exports = websocketRouter;