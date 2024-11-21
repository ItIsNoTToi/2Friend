const mongoose = require('mongoose');

const  commentlikeschema  = mongoose.Schema({

    createdAt:{
        type: Date,
        default: Date.now,
    },
    Comment:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment',
    },
    User:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
});

const commentlike = mongoose.model('commentlike', commentlikeschema);

module.exports = commentlike;