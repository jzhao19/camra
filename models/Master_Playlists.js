var mongoose = require('mongoose');

var m_Playlist_Schema = mongoose.Schema({
	a_id : Number,
	a_name : String,
})

module.exports = mongoose.model('Master_Playlist', m_Playlist_Schema);