const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({
  manga: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Manga',
    required: true
  },
  number: {
    type: Number,
    required: [true, 'Пожалуйста, укажите номер главы']
  },
  title: {
    type: String,
    default: ''
  },
  pages: [
    {
      number: {
        type: Number,
        required: true
      },
      image: {
        type: String,
        required: true
      }
    }
  ],
  views: {
    type: Number,
    default: 0
  },
  releaseDate: {
    type: Date,
    default: Date.now
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

// Составной индекс для уникальности номера главы в рамках одной манги
ChapterSchema.index({ manga: 1, number: 1 }, { unique: true });

// Обновление даты при изменении
ChapterSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Chapter', ChapterSchema); 