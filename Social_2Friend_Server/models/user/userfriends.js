const mongoose = require('mongoose');

const userfriendsschema = mongoose.Schema({
    UpdatedAt:{ 
        type: Date,
        default: Date.now,
    },
    CreatedAt:{
        type: Date,
        default: Date.now,
    },
    FriendshipType:{
        type: String,
        enum: ['default', 'bestfriend', 'block'], // Các giá trị có thể có của role
        default: 'default', // Giá trị mặc định
    },
    User1:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    User2:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

const userfriends = mongoose.model('userfriends', userfriendsschema);

module.exports = userfriends;