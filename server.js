const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

// Инициализация приложения
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к базе данных MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mangahub', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB подключена успешно');
  } catch (err) {
    console.error('Ошибка подключения к MongoDB:', err.message);
    process.exit(1);
  }
};

connectDB();

// Определение маршрутов API
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/manga', require('./routes/api/manga'));
app.use('/api/chapters', require('./routes/api/chapters'));
app.use('/api/comments', require('./routes/api/comments'));

// Обслуживание статических файлов в production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Определение порта
const PORT = process.env.PORT || 5001;

// Запуск сервера
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`)); 