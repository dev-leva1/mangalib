const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  manga: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Manga',
    required: true
  },
  chapter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter'
  },
  text: {
    type: String,
    required: [true, 'Пожалуйста, введите текст комментария'],
    trim: true,
    maxlength: [1000, 'Комментарий не может быть длиннее 1000 символов']
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  },
  // Для вложенных комментариев
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Обновление даты при изменении
CommentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Comment', CommentSchema); 