const jwt = require('jsonwebtoken');
const { logger } = require('../utils/logger');

module.exports = function(req, res, next) {
  // Получение токена из заголовка
  const token = req.header('x-auth-token');

  // Проверка наличия токена
  if (!token) {
    logger.warn(`Попытка доступа без токена: ${req.originalUrl}`);
    return res.status(401).json({ msg: 'Нет токена, авторизация отклонена' });
  }

  try {
    // Верификация токена
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Проверка срока действия токена
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      logger.warn(`Истекший токен: ${req.originalUrl}`);
      return res.status(401).json({ msg: 'Токен истек' });
    }

    // Добавление пользователя из токена в запрос
    req.user = decoded;
    next();
  } catch (err) {
    logger.warn(`Недействительный токен: ${err.message}`);
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ msg: 'Недействительный токен' });
    } else if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Токен истек' });
    }
    
    res.status(401).json({ msg: 'Ошибка авторизации' });
  }
}; 