const mongoose = require('mongoose');

const  medialikeschema  = mongoose.Schema({
    media:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'media',
    },
    User:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    createdAt:{
        type: Date,
        type: Date.now,
    },
});

const medialike = mongoose.model('media', medialikeschema);

module.exports = medialike;