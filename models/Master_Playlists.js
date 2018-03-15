var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var m_Playlist_Schema = new Schema({
	a_id : Number,
	a_name : String,
})

module.exports = mongoose.model('Master_Playlist', m_Playlist_Schema);