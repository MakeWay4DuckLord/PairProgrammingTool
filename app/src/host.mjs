import WebSocket, { WebSocketServer } from 'ws';

var port = 1080;
var connected = false;
var wss;

do {
  try {
    wss = new WebSocketServer({
      port: port,
      host: "localhost"
    })
    console.log(port);
    connected = true;
  } catch (error) {
    port++;
  }
} while (!connected);


wss.on("connection", (ws, request) => {
  console.log(`Connection from ${request.socket.remoteAddress}`);
  ws.send(JSON.stringify({action: "hello"}));
})
