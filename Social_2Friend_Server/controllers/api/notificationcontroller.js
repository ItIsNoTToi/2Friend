// models/notification.js
const mongoose = require('mongoose');

// Định nghĩa schema cho Notification
const NotificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu tới model User
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu tới model User
    required: true,
  },
  type: {
    type: String,
    enum: ['like', 'comment', 'friendRequest', 'message', 'other'], // Các loại thông báo
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post', // Tham chiếu tới model Post, nếu cần
  },
  isRead: {
    type: Boolean,
    default: false, // Mặc định là chưa đọc
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Tạo model từ schema và xuất nó
const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;
