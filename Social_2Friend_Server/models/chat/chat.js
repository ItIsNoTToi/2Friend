const mongoose = require('mongoose');

const  chatschema  = mongoose.Schema({
    Chatpicture:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'media',
    },
    name:{
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    updatedAt:{
        type: Date,
        default: Date.now,
    },
    Isgroup: {
        type: Boolean,
        default: false,
    }
});

const chat = mongoose.model('chat', chatschema);

module.exports = chat;