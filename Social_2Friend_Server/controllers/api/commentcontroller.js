// models/comment.js
const mongoose = require('mongoose');

// Định nghĩa schema cho Comment
const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu tới model User
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post', // Tham chiếu tới model Post
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu tới model User
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Tạo model từ schema và xuất nó
const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
