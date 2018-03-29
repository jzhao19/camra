var List = require("collections/list");
var Iterator = require("collections/iterator");
var request = require('request');

describe("getWeather", function(){
	it("should return current weather", function(){

});
});

describe("getSongs", function(){
	it("should return a list of songs", function(){
		var list = new List();
		var keyword = "Disco";
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
          });
		expect(list).not.toBeNull();
});
});

describe("getLocation", function(){
	it("should return current Location", function(){
		var city = ''; //eventually have this just be blank and assigned inside
		request.get('http://ipinfo.io/', function(error, resp, body) {
		if(error){
			return console.log(JSON.parse(error));
		}
		var obj = JSON.parse(body);
	
		city = obj.city;
		expect(city).toBe("Cleveland");
		});
	});
});