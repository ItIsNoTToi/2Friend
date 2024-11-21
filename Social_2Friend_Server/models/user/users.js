const mongoose = require('mongoose');

// Định nghĩa schema cho User
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    usernameUpdatedAt:{
        type: Date,
        default: Date.now,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    emailUpdatedAt:{
        type: Date,
        default: Date.now,
    },
    phone: {
        type: String,
        required: false,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    PasswordUpdatedAt:{
        type: Date,
        default: Date.now,
    },
    avatar: { 
        type: String, 
        default: '/images/defaultavatar.jpg',
    },
    LastActiveAt:{
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    Isdeleted:{
        type: Boolean,
        required: true,
        default: false,
    },
    DeletedAt:{
        type: Date,
        default: Date.now,
    },
    IsDeactivated:{
        type: Boolean,
        required: true,
        default: false,
    },
    DeactivatedAt:{
        type: Date,
        default: Date.now,
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'moderator'], // Các giá trị có thể có của role
        default: 'user', // Giá trị mặc định
    },
    chats: [
        {
            chatId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'chat',
            },
            joinedAt: {
                type: Date,
                default: Date.now,
            }
        }
    ]
});

// Tạo model từ schema
const User = mongoose.model('User', userSchema);

module.exports = User;
