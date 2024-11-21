const mongoose = require('mongoose');

const userprofilechema = mongoose.Schema({
    ProfilePictureId: {
        type: Number,
        required: true,
    },
    Username: {
        type: String,
        required: true,
    },
    UserSurename:{
        type: String,
        required: true,
    },
    UserSex:{
        type: String,
        required: true,
    },
    UserCountry:{
        type: String,
        required: true,
    },
    UserEducation:{
        type: String,
        required: true,
    },
    CreatedAt:{
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
    ProfilePicture:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'media',
    },
});

const userprofile = mongoose.model('userprofile', userprofilechema);

module.exports = userprofile;
