const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

// Middleware для защиты маршрутов
const auth = require('../../middleware/auth');

// @route   POST api/auth
// @desc    Аутентификация пользователя и получение токена
// @access  Public
router.post('/', async (req, res) => {
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

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   GET api/auth
// @desc    Получение данных текущего пользователя
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

module.exports = router; 