const express = require('express');
const http = require('http');


const app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json());
const db = require('./config/db.js');

// Import and use the db api routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// const voiceToText = require('./transcription.js');
// app.use('/voice-to-text', voiceToText);

const startTranscription = require('./transcription.js');
startTranscription();


//I (declan) changed it to 5050 instead of 5000 cause my computer is silly and is using 5000 for control center or sumn 
app.listen(5050, () => {
  console.log('Server is running on port 5050');
});
