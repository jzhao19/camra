var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var request = require('request');
var ObjectID = mongodb.ObjectID;

var app = express();
const path = require('path');
const http = require('http');
//const api = require('./server/routes/api');

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Set our api routes
//app.use('/api', api);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));

request.get('http://ipinfo.io', function(error, resp, body) {
  if(error){
    return console.dir(error);
  }
  console.dir(JSON.parse(body));
})
