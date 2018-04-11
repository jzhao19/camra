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
var Spotify = require("spotify-api-client");
var SpotifyWebApi = require('spotify-web-api-node');


var Master_Playlist = require('./models/Master_Playlists.js');

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

// var first_instance = new Master_Playlist({a_id :'1' ,a_name : 'First'});
// first_instance.save(function (err){
//   if (err) return handleError(err);
// });

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
		getWeatherSongs(weather, function(list) {
		    attachURLs(list, function(list) {
          insertDB(list);
			render(list, res);
		    });
		}); 
            });
	});
    } else if (selection == 'location') {
        getLocation(function(city) {
            getLocationSongs(city, function(list) {
		          attachURLs(list, function(list) {
                insertDB(list);
                render(list, res);
              });
        });
            });
	
    } else {
	getMoodSongs(moodoption,function(list) {
      	    attachURLs(list, function(list) {
		render(list, res);
	    });
	});
    }
});

hashCode = function(s) {
  var h = 0, l = s.length, i = 0;
  if ( l > 0 )
    while (i < l)
      h = (h << 5) - h + s.charCodeAt(i++) | 0;
  return h;
};


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

function getLocationSongs(location, callback) {
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
  /*  Iterator = list.iterate();
    while ((print = Iterator.next().value) != undefined) {
      console.log('Song: ' + print.name); 
      console.log('Artist: ' + print.artist + '\n');
    }
    */
    //res.render(path.join(__dirname, 'views/results.ejs'), {
    //  songs : list
    //});
      callback(list);

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


function getWeatherSongs(weather, callback) {
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
    /*Iterator = list.iterate();
    while ((print = Iterator.next().value) != undefined) {
      console.log('Song: ' + print.name); //not on the console, do it on the gui
      console.log('Artist: ' + print.artist + '\n');
    }*/

      callback(list);
    //res.render(path.join(__dirname, 'views/results.ejs'), {
    //  songs : list
    //});
   
  });
  
}

function getMoodSongs(tag, callback) {
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
    //res.render(path.join(__dirname, 'views/results.ejs'), {
    //  songs : list
    //});
      callback(list);
   
  });
    
}

function attachURLs(list, callback) {
  console.log('I entered the url stuff');
  //console.log("list" + list.song.name); //this is returning undefined
  var input = new List();
  input = list;
  var Nlist = new List();
  Iterator = input.iterate();
  
  var spotifyApi = new SpotifyWebApi({
    clientId : '0b4d677f62e140ee8532bed91951ae52',
    clientSecret : 'cc1e617a9c064aa982e8eeaf65626a94'
  });
    
  // Retrieve an access token.
  spotifyApi.clientCredentialsGrant().then(function(data) {
	console.log('The access token expires in ' + data.body['expires_in']);
	console.log('The access token is ' + data.body['access_token']);
	token = data.body['access_token'];
	// Save the access token so that it's used in future calls
	spotifyApi.setAccessToken(data.body['access_token']);
	while ((song = Iterator.next().value) != undefined) {
	    // console.log("song name: " + song.name);	
	    // console.log("song artist: " + song.artist);	
            obj = spotifyApi.searchTracks('track:'+song.name+' artist:'+song.artist)
		.then(function(data) {  
		    // console.log(song.url);
                    

		    //expanded.url = data.body.tracks.items[0].preview_url;
		    var expanded = new Object();

		    expanded.name = data.body.tracks.items[0].name;
        expanded.artist = data.body.tracks.items[0].artists[0].name;
        
		    if (data.body.tracks.items[0].preview_url != null) {
			// console.log("inside " + song.name);
			expanded.url = data.body.tracks.items[0].preview_url;
			console.log ("HELLO JAVA");
			console.log('Song name: ' + data.body.tracks.items[0].name + ' Song url: '+ data.body.tracks.items[0].preview_url);

			// console.log(expanded.url);
			if(expanded.url != null) {
			    Nlist.push(expanded);
			}
		    }
		    Iterator = Nlist.iterate();
		    console.log("this is nlist" + Nlist);
		    while ((print = Iterator.next().value) != undefined) {
			console.log('Song: ' + print.name); //not on the console, do it on the gui
			console.log('Artist: ' + print.artist + '\n');
			console.log("we got here u dumb url");
      console.log('URL ' + print.url); 
        }
        callback(Nlist);
		}, function(err) {
		    console.error(err);
		}).catch(function() { /*console.log("promise rejected")*/});
	}
    }, function(err) {
	    console.log('Something went wrong when retrieving an access token', err);
    }).catch(function () {
	    console.log("Promise Rejected");
  });
}

function insertDB(list){
  console.log("INSERT INTO THE DB PLEASE");
  Iterator = list.iterate();
  while ((song = Iterator.next().value) != undefined) {
    var a_id = song.name + song.artist;
    var hash = Math.abs(hashCode(a_id));
    console.log("HASH                                      " + hash +  a_id);
    var first_instance = new Master_Playlist({a_id: a_id ,a_name : expanded});
    first_instance.save();
  }
}
function render(list, res) {
  console.log("list to render: " + list);
  res.render(path.join(__dirname, 'views/results.ejs'), {
    songs : list,
  });
}
