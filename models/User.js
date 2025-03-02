const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Пожалуйста, укажите имя пользователя'],
    unique: true,
    trim: true,
    maxlength: [20, 'Имя пользователя не может быть длиннее 20 символов']
  },
  email: {
    type: String,
    required: [true, 'Пожалуйста, укажите email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Пожалуйста, укажите корректный email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Пожалуйста, укажите пароль'],
    minlength: [6, 'Пароль должен быть не менее 6 символов'],
    select: false
  },
  avatar: {
    type: String,
    default: 'default-avatar.jpg'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Manga'
  }],
  readingHistory: [{
    manga: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Manga'
    },
    chapter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter'
    },
    page: {
      type: Number,
      default: 1
    },
    lastRead: {
      type: Date,
      default: Date.now
    }
  }],
  refreshTokens: [{
    token: {
      type: String,
      required: true
    },
    expires: {
      type: Date,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Хэширование пароля перед сохранением
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Метод для сравнения паролей
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Метод для генерации JWT токена
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '1h' }
  );
};

// Метод для генерации refresh токена
UserSchema.methods.generateRefreshToken = function() {
  // Создаем случайный токен
  const refreshToken = crypto.randomBytes(40).toString('hex');
  
  // Устанавливаем срок действия (30 дней)
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  
  // Добавляем токен в массив refreshTokens
  this.refreshTokens.push({
    token: refreshToken,
    expires
  });
  
  // Ограничиваем количество активных refresh токенов (максимум 5)
  if (this.refreshTokens.length > 5) {
    this.refreshTokens = this.refreshTokens.slice(-5);
  }
  
  return {
    token: refreshToken,
    expires
  };
};

// Метод для проверки валидности refresh токена
UserSchema.methods.isValidRefreshToken = function(token) {
  const tokenDoc = this.refreshTokens.find(t => t.token === token);
  
  if (!tokenDoc) {
    return false;
  }
  
  // Проверяем, не истек ли срок действия
  return new Date() < new Date(tokenDoc.expires);
};

// Метод для удаления refresh токена
UserSchema.methods.removeRefreshToken = function(token) {
  this.refreshTokens = this.refreshTokens.filter(t => t.token !== token);
};

// Метод для удаления всех refresh токенов (при смене пароля)
UserSchema.methods.removeAllRefreshTokens = function() {
  this.refreshTokens = [];
};

module.exports = mongoose.model('User', UserSchema); 