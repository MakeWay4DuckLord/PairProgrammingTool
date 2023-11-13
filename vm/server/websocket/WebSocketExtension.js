const express = require('express');
const websocketRouter = express.Router();

var userId;
var partnerId;
var connections = [];

websocketRouter.ws('/ws', (ws, req) => {
  connections.push(ws);
  // send them a hello
  ws.send(JSON.stringify({action: "hello"}));
  ws.on("message", async (data) => {
    try {
      const message = JSON.parse(data.toString("utf-8"));
      switch (message.action) {
        case "start":
          let id = message.id;
          userId = id;
          let partner = message.partnerId;
          partnerId = partner;
          ws.send(JSON.stringify({ action: "registered", serverid: id}));
          ws.on("close", () => {
            userId = null;
            partnerId = null;
          })
          break;
        case "id":
          if (!userId) {
            ws.send(JSON.stringify({ action: "error" }))
          } else {
            ws.send(JSON.stringify({
              action: "id", id: userId, partnerId: partnerId
            }))
          }
          break;
        case "ping":
          ws.send(JSON.stringify({
            action: "pong"
          }))
        case "close":
            userId = null;
            partnerId = null;
            for (let i = 0; i < connections.length; i++) {
              connections[i].send(JSON.stringify({action: "close"}));
              connections.splice(i, 1);
            }
            break;
        default:
          break;
      }
    } catch (e) {
      console.log("WS: " + e);
    }
  })
})

module.exports = websocketRouter;