var request = require('request');
class Song {
    songID : number;
    songName : string;
    songLength : string;
    songArtist : string;
    songURL : string;

    retrieveSongData() {
        request.get('ws.audioscrobbler.com/2.0/?method=track.getinfo&track=Believe&artist=Cher&api_key=eaa991e4c471a7135879ba14652fcbe5&format=json', function(error, resp, body) {
            if (error) {
                return console.dir(error);
            }
            console.dir(JSON.parse(body));
        });
       
        //last.fm
    }

   getSongURL() {
    request.get('ipinfo.io/city', function(error, resp, body) {
        if(error){
            return console.dir(error);
        }
        console.dir(JSON.parse(body));
    });
       //spotify api "preview_url" field
   }
}