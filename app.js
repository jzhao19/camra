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
var List = require("collections/list");
var Iterator = require("collections/iterator");

var Master_Playlist = require('./models/Master_Playlists.js')
var ObjectID = mongodb.ObjectID;

var app = express();

app.use(cookieParser());
app.use(bodyParser());

app.set('view engine', 'ejs');
app.use("/styles",express.static(__dirname + "/styles"));
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
var listSongs;
app.post('/', function(req, res) {
   // console.log('gets here');
    var selection = req.body.category;
    var moodoption = req.body.moodoption;
    if (selection == 'weather') {
      //console.log("enter W");
      getLocation(function(city) {
        getWeather(city, function(weather) {
          getWeatherSongs(weather,res);  
        });
      });
    } else if (selection == 'location') {
        getLocation(function(city) {
          getLocationSongs(city, res);
         });
    
    } else {
      getMoodSongs(moodoption,res);
    }
});

function getLocation(callback) {

  var city = '';
  request.get('http://ipinfo.io/', function(error, resp, body) {
    if(error){
      return console.log(JSON.parse(error));
    }
    var obj = JSON.parse(body);
    city = obj.city;
   // console.log("inside location" + city);
    callback(city);
  });
}

function getLocationSongs(location, res) {
  var list = new List();
  var keyword = location; 
  console.log("in get location songs " + location);
  request.get('http://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=' + keyword + '&api_key=eaa991e4c471a7135879ba14652fcbe5&format=json', function(error, resp, body) {
    if (error) {
      return console.dir(error);
    }
    obj = JSON.parse(body);  
    var i = 1;
    while (obj.tracks.track[i] != null) {
      var song = new Object();
      song.name = obj.tracks.track[i].name;
      song.artist = obj.tracks.track[i].artist.name;
      i++;
      list.push(song);
        
    }  
            
    Iterator = list.iterate();
    while ((print = Iterator.next().value) != undefined) {
      console.log('Song: ' + print.name); 
      console.log('Artist: ' + print.artist + '\n');
    }
    
    res.render(path.join(__dirname, 'views/results.ejs'), {
      songs : list
    });
  });
}

function getWeather(city, callback) {
  //console.log("weather city" + city);
  var weather = '';
  request.get('http://api.openweathermap.org/data/2.5/weather?q=' + city + '&A\PPID=537eb84d28d1b2075c6e44b37f511b10', function(error, resp, body) {
    if(error) {
      return console.log(JSON.parse(error));
    }
    obj = JSON.parse(body);
    weather = obj.weather[0].main;  
      //console.log("inside weather" + weather); 
    callback(weather);
  });

  //console.log("weather " + weather);

}


function getWeatherSongs(weather,res) {
  var list = new List();
  var keyword = weather;
  console.log("in get weather songs " + weather);
  request.get('http://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=' + keyword + '&api_key=eaa991e4c471a7135879ba14652fcbe5&format=json', function(error, resp, body) {
    if (error) {
      return console.dir(error);
    }
    
    obj = JSON.parse(body);
    var i = 1;
    while (obj.tracks.track[i] != null) {
      var song = new Object();
      song.name = obj.tracks.track[i].name;
      song.artist = obj.tracks.track[i].artist.name;
      i++;
      list.push(song);   
    }  
            
    Iterator = list.iterate();
    while ((print = Iterator.next().value) != undefined) {
      console.log('Song: ' + print.name); //not on the console, do it on the gui
      console.log('Artist: ' + print.artist + '\n');
    }
   
    res.render(path.join(__dirname, 'views/results.ejs'), {
      songs : list
    });
  });
}

function getMoodSongs(tag,res) {
  var list = new List();
  var keyword = tag;
  //console.log(keyword);
  console.log("in get mood songs " + keyword);
  request.get('http://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=' + keyword + '&api_key=eaa991e4c471a7135879ba14652fcbe5&format=json', function(error, resp, body) {
    if (error) {
      return console.dir(error);
    }
    obj = JSON.parse(body);
    var i = 1;
    while (obj.tracks.track[i] != null) {
      var song = new Object();
      song.name = obj.tracks.track[i].name;
      song.artist = obj.tracks.track[i].artist.name;
      i++;
      list.push(song);
    }  
    
    Iterator = list.iterate();
    while ((print = Iterator.next().value) != undefined) {
      console.log('Song: ' + print.name); //not on the console, do it on the gui
      console.log('Artist: ' + print.artist + '\n');
    }
    res.render(path.join(__dirname, 'views/results.ejs'), {
      songs : list
    });
  });
}
     
