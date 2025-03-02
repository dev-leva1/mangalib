const rateLimit = require('express-rate-limit');
const { logger } = require('../utils/logger');

// Базовый лимитер для всех запросов
const baseLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // Ограничение каждого IP до 100 запросов за windowMs
  standardHeaders: true, // Возвращать информацию о лимите в заголовках `RateLimit-*`
  legacyHeaders: false, // Отключить заголовки `X-RateLimit-*`
  message: 'Слишком много запросов с этого IP, пожалуйста, попробуйте снова через 15 минут',
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(options.statusCode).json({
      message: options.message
    });
  }
});

// Строгий лимитер для аутентификации
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 час
  max: 10, // Ограничение каждого IP до 10 запросов за windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Слишком много попыток входа, пожалуйста, попробуйте снова через час',
  handler: (req, res, next, options) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`);
    res.status(options.statusCode).json({
      message: options.message
    });
  }
});

module.exports = {
  baseLimiter,
  authLimiter
}; 