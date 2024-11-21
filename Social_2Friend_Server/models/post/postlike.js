const mongoose = require('mongoose');

const  postlikeschema  = mongoose.Schema({
    CreatedAt:{
        type: Date,
        default: Date.now,
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
    },
    User:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
});

const postlike = mongoose.model('postlike', postlikeschema);

module.exports = postlike;