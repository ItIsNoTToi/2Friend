const mongoose = require('mongoose');

const  commentschema  = mongoose.Schema({
    content:{
        type: String,
        required: true,
    },
    RepliedCommentNavigation:{
        type: mongoose.Schema.ObjectId,
        ref: 'comment',
    },
    post:{
        type: mongoose.Schema.ObjectId,
        ref: 'post',
    },
    Author:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    createdAt:{
        type: Date,
        type: Date.now,
    },
    updatedAt:{
        type: Date,
        type: Date.now,
    },
    MediaType:{
        type: String,
        enum: ['Image', 'video', 'Audio'], // Các giá trị có thể có của role
        default: 'Image', // Giá trị mặc định
    }

});

const comment = mongoose.model('comment', commentschema);

module.exports = comment;