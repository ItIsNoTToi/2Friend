const mongoose = require('mongoose');

const  messagemediaschema  = mongoose.Schema({
    Chat:{
        type: mongoose.Schema.ObjectId,
        ref: 'chat',
    },
    media:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'media',
    },
    message:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'message',
    },
});

const messagemedia = mongoose.model('messagemedia', messagemediaschema);

module.exports = messagemedia;