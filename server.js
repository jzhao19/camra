var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var request = require('request');
var mongoose = require('mongoose');
const path = require('path');
const http = require('http');

var Master_Playlist = require('./models/Master_Playlists.js')
var ObjectID = mongodb.ObjectID;

var app = express();
//const api = require('./server/routes/api');

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

//Set up default mongoose connection
mongoose.connect('mongodb://localhost:27017/my_database');

var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var first_instance = new Master_Playlist({a_id :'1' ,a_name : 'First'});
first_instance.save(function (err){
  if (err) return handleError(err);
});


Master_Playlist.find(function (err, Master_Playlist) {
  if (err) return console.error(err);
  console.dir(Master_Playlists);
  console.dir("hello");
})
/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);
const server = http.createServer(app);
server.listen(port, () => console.log(`API running on localhost:${port}`));

request.get('http://ipinfo.io', function(error, resp, body) {
  if(error){
    return console.dir(error);
  }
  console.dir(JSON.parse(body));
})
