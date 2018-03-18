var request = require('request');
class myLocation {
    lat : number;
    lng : number;
    city : string;
    nearbyPlaces : Array<string>;

    constructor(lat:number, lng:number, city:string, nearbyPlaces:Array<string>){
       this.lat = lat;
       this.lng = lng;
       this.city = city;
       this.nearbyPlaces = nearbyPlaces;
    }

    findNearestCity(){
        request.get('ipinfo.io/city', function(error, resp, body) {
            if(error){
                return console.dir(error);
            }
            console.dir(JSON.parse(body));
        });
    }

    findNearbyPlaces(){

    }

    findLocationSongs(){

    }

    createLocationSongList(){

    }
}