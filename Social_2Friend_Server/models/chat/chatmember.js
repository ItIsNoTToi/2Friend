const mongoose = require('mongoose');

const  chatmemberschema  = mongoose.Schema({
    chatmembertype:{
        type: String,
        enum: ['Admin', 'Member', 'Owner'],
        default: 'Member',
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    UpdatedAt:{
        type: Date,
        default: Date.now,
    },
    User:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    Chat:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chat',
    },
});

const chatmember = mongoose.model('chatmember', chatmemberschema);

module.exports = chatmember;