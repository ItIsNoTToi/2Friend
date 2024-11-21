const mongoose = require('mongoose');

const  mediaschema  = mongoose.Schema({
    filename:{
        type: String,
        required: true,
    },
    filepath:{
        type: String,
        required: true,
    },
    owner:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    MediaType:{
        type: String,
        enum: ['Image', 'video', 'Audio'], // Các giá trị có thể có của role
        default: 'Image', // Giá trị mặc định
    },
});

const media = mongoose.model('media', mediaschema);

module.exports = media;