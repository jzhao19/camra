var request = require('request');
class Playlist {
    playlistID : number;
    songList : Song[];

    constructor(myplaylistID: number, mysongList: Song[]){
        this.playlistID = myplaylistID;
        this.songList = mysongList;
    }
}