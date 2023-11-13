const express = require('express');
const { ExpressPeerServer, PeerServer} = require("peer");
var cors = require('cors');
var bodyParser = require("body-parser");
const app = express();
const server = require('http').Server(app)
app.use(bodyParser.json());

if (process.env.NODE_ENV !== 'test') {
    require('./api/data/DB.js');
}
  
app.use(cors());

//WebSockets
const expressWs = require('express-ws')(app);

const routes = require('./routes.js');
app.use(routes);

const peerServer = PeerServer({ port: 4000, path: "/myapp" });

// As our server to listen for incoming connections
const PORT = 3000;
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
module.exports = app;