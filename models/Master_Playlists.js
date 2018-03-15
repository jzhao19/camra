var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var m_Playlist = new Schema({
	a_id : Number,
	a_name : String,
})

module.exports = mongoose.model('Master_Playlists', m_Playlist);