const express = require('express');
var cors = require('cors')
const app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json());

if (process.env.NODE_ENV !== 'test') {
  require('./config/db.js');
}

app.use(cors())

// Import and use the db api routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

app.listen(443, () => {
  console.log('Server is running on port 443');
});

module.exports = app;