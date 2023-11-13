const express = require('express');
const router = express.Router();

const apiRouter = require('./api/APIRoutes');
const websocketRouter = require('./websocket/WebSocketRoutes');


router.use("/api", apiRouter);
router.use(websocketRouter);



module.exports = router;