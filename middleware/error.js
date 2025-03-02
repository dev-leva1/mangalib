const { logger } = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  // Логирование ошибки
  logger.error(`${err.message}\n${err.stack}`);

  // Определение статуса ошибки
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Отправка ответа с ошибкой
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = errorHandler; 