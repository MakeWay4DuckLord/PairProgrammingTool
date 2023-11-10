import { WebSocketServer } from 'ws';

var port = 10080;
var connected = false;
export var wss;

export const bind = () => {
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
  return wss;
}


export const sendData = (wss, data) => {
  wss.send(JSON.stringify(data));
}
