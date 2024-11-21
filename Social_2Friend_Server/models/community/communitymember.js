const mongoose = require('mongoose');

const  communitymemberschema  = mongoose.Schema({
    Community:{
        type: mongoose.Schema.ObjectId,
        ref: 'community',
    },
    User:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    updatedAt:{
        type: Date,
        default: Date.now,
    },
    CommunityMemberType:{
        type: String,
        enum: ['Member', 'Admin', 'Owner'], // Các giá trị có thể có của role
        default: 'Member',
    },
});

const communitymember = mongoose.model('communitymember', communitymemberschema);

module.exports = communitymember;