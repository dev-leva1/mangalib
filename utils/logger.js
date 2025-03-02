const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Создаем директорию для логов, если она не существует
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Определение форматов логирования
const formats = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Создание логгера
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: formats,
  transports: [
    // Логирование в консоль
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        formats
      ),
      level: 'info' // Устанавливаем уровень для консоли
    }),
    // Логирование ошибок в файл
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error'
    }),
    // Логирование всех сообщений в файл
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log')
    })
  ],
  exitOnError: false // Не завершать процесс при ошибке логирования
});

// Создание middleware для логирования HTTP-запросов
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
    );
  });
  
  next();
};

// Добавляем прямой вывод в консоль для отладки
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
    level: 'debug'
  }));
}

module.exports = { logger, requestLogger }; 