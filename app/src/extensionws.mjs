import WebSocket from 'isomorphic-ws';

var port = 10080;
var connected = false;
var ws;

export const connect = () => {
  do {
    try {
      var toConnect = 'ws://localhost:' + port + '/ws';
      ws = new WebSocket(toConnect);
      connected = true;
    } catch (error) {
      port++;
    }
  } while (!connected);

  ws.addEventListener("message", (event) => {
    let msg = JSON.parse(event.data);
    console.log(msg);
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

  return ws;
}


