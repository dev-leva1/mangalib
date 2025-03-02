const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const { logger } = require('../../utils/logger');

// Middleware
const auth = require('../../middleware/auth');
const validator = require('../../middleware/validator');
const { authSchemas } = require('../../utils/validationSchemas');

// @route   POST api/auth
// @desc    Аутентификация пользователя и получение токенов
// @access  Public
router.post('/', validator(authSchemas.login), async (req, res) => {
  const { email, password } = req.body;

  try {
    // Проверка существования пользователя
    let user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ msg: 'Неверные учетные данные' });
    }

    // Проверка пароля
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Неверные учетные данные' });
    }

    // Создание JWT токена
    const token = user.getSignedJwtToken();
    
    // Создание refresh токена
    const refreshToken = user.generateRefreshToken();
    await user.save();

    // Отправка токенов
    res.json({
      token,
      refreshToken: refreshToken.token,
      refreshTokenExpires: refreshToken.expires
    });
  } catch (err) {
    logger.error(`Ошибка при аутентификации: ${err.message}`);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   POST api/auth/refresh
// @desc    Обновление токена доступа с помощью refresh токена
// @access  Public
router.post('/refresh', validator(authSchemas.refreshToken), async (req, res) => {
  const { refreshToken } = req.body;

  try {
    // Находим пользователя с данным refresh токеном
    const user = await User.findOne({ 'refreshTokens.token': refreshToken });
    
    if (!user) {
      return res.status(401).json({ msg: 'Недействительный refresh токен' });
    }

    // Проверяем валидность refresh токена
    if (!user.isValidRefreshToken(refreshToken)) {
      // Удаляем недействительный токен
      user.removeRefreshToken(refreshToken);
      await user.save();
      return res.status(401).json({ msg: 'Истекший refresh токен' });
    }

    // Создаем новый access токен
    const token = user.getSignedJwtToken();

    // Создаем новый refresh токен
    user.removeRefreshToken(refreshToken);
    const newRefreshToken = user.generateRefreshToken();
    await user.save();

    // Отправляем новые токены
    res.json({
      token,
      refreshToken: newRefreshToken.token,
      refreshTokenExpires: newRefreshToken.expires
    });
  } catch (err) {
    logger.error(`Ошибка при обновлении токена: ${err.message}`);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   POST api/auth/logout
// @desc    Выход пользователя (удаление refresh токена)
// @access  Private
router.post('/logout', auth, validator(authSchemas.refreshToken), async (req, res) => {
  const { refreshToken } = req.body;

  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'Пользователь не найден' });
    }

    // Удаляем refresh токен
    user.removeRefreshToken(refreshToken);
    await user.save();

    res.json({ msg: 'Выход выполнен успешно' });
  } catch (err) {
    logger.error(`Ошибка при выходе: ${err.message}`);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   GET api/auth
// @desc    Получение данных текущего пользователя
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -refreshTokens');
    if (!user) {
      return res.status(404).json({ msg: 'Пользователь не найден' });
    }
    res.json(user);
  } catch (err) {
    logger.error(`Ошибка при получении данных пользователя: ${err.message}`);
    res.status(500).send('Ошибка сервера');
  }
});

module.exports = router; 