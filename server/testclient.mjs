import WebSocket from 'ws';

// const ws = new WebSocket({
//   port: 8080,
//   host: "127.0.0.0",
// });
const ws = new WebSocket("ws://localhost:8080");

let myId = 2;
let partnerId = 1;
var tryAgain = false;


function pair(id, partnerId) {
  ws.send(JSON.stringify({
    action: "pair", id1: id, id2: partnerId
  }))
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function keepTrying(ws) {
  sleep(5000).then(() => {
    if (tryAgain) {
      console.log("Attempting to Pair");
      ws.send(JSON.stringify({
        action: "pair", id1: myId, id2: partnerId,
      }));
    }
  })
}
 



ws.on('open', () => {
  console.log("Connected to server");

  
  ws.send(JSON.stringify({ action: "id", id: myId}))

  
  
  ws.on('message', (data) => {
    const message = JSON.parse(data.toString());
    console.log(message);
    if (message.action === "registered") {
      tryAgain = true;
      keepTrying(ws);
    } else if (message.action === "start") {
      tryAgain = false;
      console.log("I have paired with Client " + message.partner);
      // ws.send(JSON.stringify({
      //   action: "close"
      // }));
    // } else if (message.action === "partner-disconnect") {
    //   console.log("Partner Disconnected");
    //   ws.send(JSON.stringify({ action: "close", }))
    } else if (message.action === "error") {
      console.log(message.reason);
      if (message.reason === "One of the users has not been registered yet.") {
        tryAgain = true;
        keepTrying(ws);
      }
    }
  })
})