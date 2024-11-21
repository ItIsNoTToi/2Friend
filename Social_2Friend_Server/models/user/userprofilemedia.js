const mongoose = require('mongoose')

const userprofilemediaschema = mongoose.Schema({
    Media:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'media',
    },
    userprofile:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userprofile',
    }
});

const userprofilemedia = mongoose.model('userprofilemedia', userprofilemediaschema);

module.exports = userprofilemedia;