const mongoose = require('mongoose');

const  postschema  = mongoose.Schema({
    Author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    Comunity:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'community',
    },
    content:{
        type: String,
        required: true,
    },
    Repost:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
    },
    IsCommunityPost:{
        type: Boolean,
        required: true,
        default: false,
    },
    CreatedAt:{
        type: Date,
        default: Date.now,
    },
    UpdateAt:{
        type: Date,
        default: Date.now,
    }
});

const post = mongoose.model('post', postschema );

module.exports = post;