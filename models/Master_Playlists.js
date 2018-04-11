var mongoose = require('mongoose');

var m_Playlist_Schema = mongoose.Schema({
	a_id : String,
	a_name : Object,
})

module.exports = mongoose.model('Master_Playlist', m_Playlist_Schema);