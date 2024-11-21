const mongoose = require('mongoose');

const  messagelikeschema  = mongoose.Schema({
    message:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'message',
    },
    chatmember:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chatmember',
    },
    CreatedAt:{
        type: Date,
        default: Date.now,
    },
});

const messagelike = mongoose.model('messagelike', messagelikeschema );

module.exports = messagelike;