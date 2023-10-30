import WebSocket from 'isomorphic-ws';

var port = 1080;
var connected = false;
var ws;


do {
  try {
    var toConnect = 'ws://localhost:' + port + '';
    ws = new WebSocket(toConnect);
    connected = true;
  } catch (error) {
    port++;
  }
} while (!connected);

ws.onopen = () => {

  ws.addEventListener("message", (event) => {
    console.log(event.data);
    let msg = JSON.parse(event.data);
    switch (msg.action) {
      case "hello":
        ws.send(JSON.stringify({action: "hello"}));
        break;
      case "close":
        console.log(";(");
        break;
      case "send":
        ws.send(JSON.stringify({action: "send"}));
        break;
      case "request":
        ws.send(JSON.stringify({action: "receive"}));
        break;
      default:
        console.log("idk man");
        break;
    }

  });
}