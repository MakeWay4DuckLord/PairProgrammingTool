const express = require('express');
const { ExpressPeerServer, PeerServer} = require("peer");

const app = express();
const server = require('http').Server(app)


//WebSockets
const expressWs = require('express-ws')(app);

const routes = require('./src/routes');
app.use(routes);


const peerServer = PeerServer({ port: 4000, path: "/myapp" });

// As our server to listen for incoming connections
const PORT = 3000;
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));

