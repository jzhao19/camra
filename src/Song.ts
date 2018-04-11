var request = require('request');
class Song {
    songName : string;
    songArtist : string;
    //songURL : string;

    constructor(mysongName: string, mysongArtist: string){
        this.songName = mysongName;
        this.songArtist = mysongArtist;
        //this.songURL = mysongURL;
    }
}

module.exports = Song;