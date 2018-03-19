var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var mongodb = require("mongodb");
var request = require('request');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
const path = require('path');
const http = require('http');



var Master_Playlist = require('./models/Master_Playlists.js')
var ObjectID = mongodb.ObjectID;

var app = express();

app.use(cookieParser());
app.use(bodyParser());

app.set('view engine', 'ejs');

app.use(session({ secret: 'camra'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./src/app/routes.js')(app, passport);

require('./passport.js')(passport);

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

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);
const server = http.createServer(app);
server.listen(port, () => console.log(`API running on localhost:${port}`));

request.get('http://ipinfo.io/', function(error, resp, body) {
  if(error){
    return console.log(JSON.parse(error));
  }
  console.dir(JSON.parse(body));
});
