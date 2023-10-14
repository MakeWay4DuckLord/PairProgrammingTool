import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({
  port: 8080,
  // host: "127.0.0.0",
})

// Maps user ids to their generated UIDs
// let userIDs = {};
var userIDs = [];

// Maps users to other users once they have been connected
var pairings = {};

// Maps users to their connection information once they contact the server
var connections = {};


function pair(uid1, uid2) {

  let validPair = true;
  let msg = "";
  if (!uid1 || !uid2) {
    msg = "One or both partners does not exist";
    console.log(msg);
    validPair = false;
  } else if (uid1 in pairings || uid2 in pairings) {
    msg = "One or both partners is already paired.";
    console.log(msg);
    validPair = false;
  } else if (!(userIDs.includes(uid1)) || !(userIDs.includes(uid2))) {
    msg = "One or both partners has not registered yet.";
    console.log(msg);
    validPair = false;
  } else {
    msg = "success";
    pairings[uid1] = uid2;
    pairings[uid2] = uid1;
  }
  return { 'worked': validPair, 'message': msg };
}



wss.on("connection", (ws, request) => {
  console.log(`Connection from ${request.socket.remoteAddress}`);
  // var address = request.socket.remoteAddress;
  
  ws.send(JSON.stringify({action: "hello"}));

  ws.on("message", async (data) => {
    try {
      const message = JSON.parse(data.toString("utf-8"));
      console.log(message);


      switch (message.action) {
        case "id":
          let id = message.id;
          if (connections[id] === undefined) {
            connections[id] = [ws];
          } else {
            connections.push(ws);
          }
          
          if (id in userIDs) {
            ws.send(JSON.stringify({ action: "error", reason: "Id Already Exists"}));
          } else {
            userIDs.push(id);
    
            ws.send(JSON.stringify({ action: "registered", serverid: id}));
          }
    
          break;
        case "pair":
          console.log("Client " + message.id1 + " is trying to pair with Client " + message.id2);

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
          console.log("idk man");
      }
    } catch (e) {
      console.log(e);
    }
  })
})