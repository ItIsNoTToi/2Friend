const mongoose = require('mongoose');

const userfollowsschema = mongoose.Schema({
    CreatedAt:{
        type: Date,
        default: Date.now,
    },
    Sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    Accept:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    Status:{
        type: String,
        enum: ['Pending', 'Accepted', 'Declined'], // Các giá trị có thể có của role
        default: 'Pending', // Giá trị mặc định
    },
});

// Tạo model từ schema
const userfollows = mongoose.model('userfollows', userfollowsschema);

module.exports = userfollows;