const express = require('express');
const websocketRouter = express.Router();

let clients = new Set();
let extensions = new Set();
var userIDs = [];
var pairings = {};
var connections = {};
var extensionIDs = [];
var extensionPairs = {};
var extensionConnections = {};

/******************\
* WEBSOCKET ROUTES *
\******************/
websocketRouter.ws('/extension/ws', (ws, req) => {
  extensions.add(ws);
  console.log('New Extension');
  sendPacket(ws, {action: "hello"});
  ws.on('message', (msg) => {
    const message = JSON.parse(msg);
    console.log(message);
    switch (message.action) {
      case "hello":
        console.log("Said hello");
        break;
      case "extensionId":
        let extensionId = message.eID;
        if (extensionConnections[extensionId] === undefined) {
          extensionConnections[extensionId] = [ws];
        }
        if (!(extensionId in extensionIDs)) {
          extensionIDs.push(extensionId);
        }
        sendPacket(ws, { action: "registered1", id: extensionId });
        if (extensionPairs[extensionId] !== undefined) {
          sendPacket(ws, { action: "paired", id: extensionPairs[extensionId]});
        }
        break;
      case "keepalive":
        sendPacket(ws, {action: "keepalive"});
        break;
      default:
        console.log("WS: idk man");
    }
  });
})


websocketRouter.ws('/ws', (ws, req) => {
  extensions.add(ws);
  console.log('New client');
  sendPacket(ws, {action: "hello"});
  ws.on('message', (msg) => {
    const message = JSON.parse(msg);
    console.log(message);
    switch (message.action) {
      case "hello":
        console.log("Said hello");
        break;
      case "id":
        console.log("registering an id");
        let id = message.id;
        let eid = message.eid;
        if (connections[id] === undefined) {
          connections[id] = [ws];
        }
          
        if (id in userIDs) {
          sendPacket(ws, { action: "error", reason: "Id Already Exists"})
        } else {
          userIDs.push(id);
          extensionPairs[eid] = id;
          sendPacket(ws, {action: "registered", id: id});

          let pairedExtension = Object.keys(extensionPairs).find(key => extensionPairs[key] === message.eid);
          sendPacket(extensionConnections[pairedExtension], { action: "paired", id: id});
        }

        break;
      case "pair":
        console.log("WS: Client " + message.id1 + " is trying to pair with Client " + message.id2);

        let returns = pair(message.id1, message.id2);
    
        if (returns.worked) {
          sendPacket(ws, {action: "start", partner: message.id2});
          // sendPacket()
              
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
        let pairedExtension = Object.keys(extensionPairs).find(key => extensionPairs[key] === message.id);
        delete connections[message.id];
        extensions.delete(extensionConnections[pairedExtension]);
        delete extensionConnections[pairedExtension];
        userIDs.splice(userIDs.indexOf(message.id), 1);
        extensionIDs.splice(extensionID.indexOf(pairedExtension), 1);
        delete pairings[message.id];
        delete extensionPairs[pairedExtension];
        clients.delete(ws);
        break;
      case "keepalive":
        sendPacket(ws, {action: "keepalive"});
        break;
      case "extensionId":
        let extensionId = message.eID;
        if (extensionConnections[extensionId] === undefined) {
          extensionConnections[extensionId] = [ws];
        }
        if (!(extensionId in extensionIDs)) {
          extenionIDs.push(extensionId);
        }
        sendPacket(ws, { action: "registered1", id: extensionId });
        if (extensionPairs[extensionId] !== undefined) {
          sendPacket(ws, { action: "paired", id: extensionPairs[extensionId]});
        } 
        break;
      case "loc":
        console.log("The user typed " + msg.count + "words.");
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