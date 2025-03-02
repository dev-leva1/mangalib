const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

// Импорт middleware
const errorHandler = require('./middleware/error');
const { logger, requestLogger } = require('./utils/logger');
const { baseLimiter, authLimiter } = require('./middleware/rateLimiter');

// Инициализация приложения
const app = express();

// Настройка trust proxy для корректной работы с X-Forwarded-For
app.set('trust proxy', 1);

// Middleware
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL || 'https://mangahub-app.herokuapp.com' 
    : 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(requestLogger); // Логирование запросов
app.use(baseLimiter); // Базовое ограничение скорости запросов

// Подключение к базе данных MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mangahub', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    logger.info('MongoDB подключена успешно');
  } catch (err) {
    logger.error(`Ошибка подключения к MongoDB: ${err.message}`);
    // Не завершаем процесс, чтобы сервер мог работать без базы данных
    logger.warn('Сервер запущен без подключения к базе данных');
  }
};

connectDB();

// Определение маршрутов API
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', authLimiter, require('./routes/api/auth')); // Строгое ограничение для аутентификации
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

// Middleware для обработки ошибок (должен быть последним)
app.use(errorHandler);

// Определение порта
const PORT = process.env.PORT || 5001;

// Очистка порта, если он уже используется
const clearPort = () => {
  if (process.env.PORT) {
    logger.info(`Используется порт из переменной окружения: ${process.env.PORT}`);
  } else {
    logger.info(`Используется порт по умолчанию: ${PORT}`);
  }
};

clearPort();

// Запуск сервера
const server = app.listen(PORT, () => {
  logger.info(`Сервер запущен на порту ${PORT}`);
  console.log(`Сервер запущен на порту ${PORT}`);
});

// Обработка ошибок при запуске сервера
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    logger.error(`Порт ${PORT} уже используется. Попробуйте другой порт.`);
    console.error(`Порт ${PORT} уже используется. Попробуйте другой порт.`);
  } else {
    logger.error(`Ошибка при запуске сервера: ${error.message}`);
    console.error(`Ошибка при запуске сервера: ${error.message}`);
  }
  process.exit(1);
});

// Обработка необработанных исключений
process.on('uncaughtException', (err) => {
  logger.error(`Необработанное исключение: ${err.message}`);
  process.exit(1);
});

// Обработка необработанных отклонений промисов
process.on('unhandledRejection', (err) => {
  logger.error(`Необработанное отклонение промиса: ${err.message}`);
  process.exit(1);
}); 