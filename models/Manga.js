const mongoose = require('mongoose');

const MangaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Пожалуйста, укажите название манги'],
    trim: true,
    maxlength: [100, 'Название не может быть длиннее 100 символов']
  },
  alternativeTitles: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    required: [true, 'Пожалуйста, добавьте описание манги']
  },
  coverImage: {
    type: String,
    default: 'default-cover.jpg'
  },
  author: {
    type: String,
    required: [true, 'Пожалуйста, укажите автора']
  },
  artist: {
    type: String,
    default: ''
  },
  genres: {
    type: [String],
    required: [true, 'Пожалуйста, укажите хотя бы один жанр']
  },
  tags: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['ongoing', 'completed', 'hiatus', 'cancelled'],
    default: 'ongoing'
  },
  releaseYear: {
    type: Number
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  favorites: {
    type: Number,
    default: 0
  },
  isAdult: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Виртуальное поле для глав
MangaSchema.virtual('chapters', {
  ref: 'Chapter',
  localField: '_id',
  foreignField: 'manga',
  justOne: false
});

// Обновление даты при изменении
MangaSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Manga', MangaSchema); 