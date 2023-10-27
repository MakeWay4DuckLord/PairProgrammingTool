const express = require('express');
const app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json());
const db = require('./config/db.js');

// Import and use the db api routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
