const mongoose = require('mongoose');

const  communitychema  = mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    CommunityPicture:{
        type: mongoose.Schema.ObjectId,
        ref: 'media',
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    updatedAt:{
        type: Date,
        default: Date.now,
    },
    Isprivate:{
        type: Boolean,
        default: false,
    }

});

const community = mongoose.model('community', communitychema);

module.exports = community;