const express = require("express");
const { WebSocketServer } = require("ws");

const app = express();

//import pkg from 'peer';
// const { ExpressPeerServer } = require("peer").ExpressPeerServer;
const { ExpressPeerServer } = require("peer");
// import { ExpressPeerServer } from 'peer';

const wss = new WebSocketServer ( { noServer: true, path: "/ws"  });

const server = app.listen(80);

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, socket => {
    wss.emit('connection', socket, request);
  })
})

const peerServer = ExpressPeerServer( server, {
  path: "/myapp" , debug: true
});

app.use("/peerjs", peerServer);






// Maps user ids to their generated UIDs
// let userIDs = {};
var userIDs = [];

// Maps users to other users once they have been connected
var pairings = {};

// Maps users to their connection information once they contact the server
var connections = {};

// Maps users's ids to their Peer connections for WebRTC
var peers = {};


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

wss.on("connection", (ws, request) => {
  console.log(`WS: Connection from ${request.socket.remoteAddress}`);
  // var address = request.socket.remoteAddress;
  
  ws.send(JSON.stringify({action: "hello"}));

  ws.on("message", async (data) => {
    try {
      const message = JSON.parse(data.toString("utf-8"));
      console.log("WS: " + message);


      switch (message.action) {
        case "id":
          let id = message.id;
          if (connections[id] === undefined) {
            connections[id] = [ws];
          }
          
          if (id in userIDs) {
            ws.send(JSON.stringify({ action: "error", reason: "Id Already Exists"}));
          } else {
            userIDs.push(id);
    
            ws.send(JSON.stringify({ action: "registered", serverid: id}));
          }
    
          break;
        case "pair":
          console.log("WS: Client " + message.id1 + " is trying to pair with Client " + message.id2);

          let returns = pair(message.id1, message.id2);
    
          if (returns.worked) {
            ws.send(JSON.stringify({ 
              action: "start", partner: message.id2 
            }))
              
              
            if (!(connections[message.id2] === undefined)) {
              connections[message.id2].forEach((ws) => {
                ws.send(JSON.stringify({
                  action: "start", partner: message.id1 
                }));
              })
            }
                
          } else {
            ws.send(JSON.stringify({
              action: "error", reason: returns.message
            }))
          }

          
          break;
        case "close":
          ws.send(JSON.stringify({
            action: "close"
          }));
          connections[pairings[message.id]].forEach((ws) => {
            ws.send(JSON.stringify({
              action: "close"
            }));
          });
          delete connections[message.id];
          userIDs.splice(userIDs.indexOf(message.id), 1);
          delete pairings[message.id];
          break;
        default:
          console.log("WS: idk man");
      }
    } catch (e) {
      console.log("WS: " + e);
    }
  })
})







