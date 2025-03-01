const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Получение токена из заголовка
  const token = req.header('x-auth-token');

  // Проверка наличия токена
  if (!token) {
    return res.status(401).json({ msg: 'Нет токена, авторизация отклонена' });
  }

  try {
    // Верификация токена
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Добавление пользователя из токена в запрос
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Токен недействителен' });
  }
}; 