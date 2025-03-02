const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const { logger } = require('../../utils/logger');

// Middleware
const auth = require('../../middleware/auth');
const validator = require('../../middleware/validator');
const { userSchemas, authSchemas } = require('../../utils/validationSchemas');

// @route   POST api/users
// @desc    Регистрация пользователя
// @access  Public
router.post('/', validator(authSchemas.register), async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Проверка существования пользователя
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Пользователь с таким email уже существует' });
    }

    user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: 'Пользователь с таким именем уже существует' });
    }

    // Создание нового пользователя
    user = new User({
      username,
      email,
      password
    });

    await user.save();

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
    logger.error(`Ошибка при регистрации: ${err.message}`);
    
    // Обработка ошибок валидации mongoose
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ msg: messages[0] });
    }
    
    res.status(500).send('Ошибка сервера');
  }
});

// @route   GET api/users/me
// @desc    Получение данных текущего пользователя
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    // Получение пользователя по ID из токена
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

// @route   PUT api/users/me
// @desc    Обновление данных пользователя
// @access  Private
router.put('/me', auth, validator(userSchemas.updateProfile), async (req, res) => {
  const { username, email, avatar } = req.body;
  
  // Построение объекта обновления
  const userFields = {};
  if (username) userFields.username = username;
  if (email) userFields.email = email;
  if (avatar) userFields.avatar = avatar;

  try {
    let user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'Пользователь не найден' });
    }

    // Проверка уникальности имени пользователя
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ msg: 'Пользователь с таким именем уже существует' });
      }
    }

    // Проверка уникальности email
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: 'Пользователь с таким email уже существует' });
      }
    }

    // Обновление пользователя
    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: userFields },
      { new: true }
    ).select('-password -refreshTokens');

    res.json(user);
  } catch (err) {
    logger.error(`Ошибка при обновлении данных пользователя: ${err.message}`);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   PUT api/users/password
// @desc    Изменение пароля пользователя
// @access  Private
router.put('/password', auth, validator(userSchemas.updatePassword), async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    // Получение пользователя с паролем
    const user = await User.findById(req.user.id).select('+password');
    
    if (!user) {
      return res.status(404).json({ msg: 'Пользователь не найден' });
    }

    // Проверка текущего пароля
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Неверный текущий пароль' });
    }

    // Установка нового пароля
    user.password = newPassword;
    
    // Удаление всех refresh токенов при смене пароля
    user.removeAllRefreshTokens();
    
    await user.save();

    res.json({ msg: 'Пароль успешно изменен' });
  } catch (err) {
    logger.error(`Ошибка при изменении пароля: ${err.message}`);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   POST api/users/favorites/:mangaId
// @desc    Добавление манги в избранное
// @access  Private
router.post('/favorites/:mangaId', auth, validator(userSchemas.mangaId, 'params'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'Пользователь не найден' });
    }

    // Проверка, есть ли уже манга в избранном
    if (user.favorites.includes(req.params.mangaId)) {
      return res.status(400).json({ msg: 'Манга уже добавлена в избранное' });
    }

    // Добавление манги в избранное
    user.favorites.push(req.params.mangaId);
    await user.save();

    res.json(user.favorites);
  } catch (err) {
    logger.error(`Ошибка при добавлении манги в избранное: ${err.message}`);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   DELETE api/users/favorites/:mangaId
// @desc    Удаление манги из избранного
// @access  Private
router.delete('/favorites/:mangaId', auth, validator(userSchemas.mangaId, 'params'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'Пользователь не найден' });
    }

    // Удаление манги из избранного
    user.favorites = user.favorites.filter(
      manga => manga.toString() !== req.params.mangaId
    );
    
    await user.save();

    res.json(user.favorites);
  } catch (err) {
    logger.error(`Ошибка при удалении манги из избранного: ${err.message}`);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   GET api/users/favorites
// @desc    Получение списка избранных манг пользователя
// @access  Private
router.get('/favorites', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    
    if (!user) {
      return res.status(404).json({ msg: 'Пользователь не найден' });
    }

    res.json(user.favorites);
  } catch (err) {
    logger.error(`Ошибка при получении списка избранных манг: ${err.message}`);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   GET api/users/history
// @desc    Получение истории чтения пользователя
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'readingHistory.manga',
        select: 'title coverImage'
      })
      .populate({
        path: 'readingHistory.chapter',
        select: 'number title'
      });
    
    if (!user) {
      return res.status(404).json({ msg: 'Пользователь не найден' });
    }

    // Сортировка истории по дате последнего чтения (от новых к старым)
    const sortedHistory = user.readingHistory.sort((a, b) => 
      new Date(b.lastRead) - new Date(a.lastRead)
    );

    res.json(sortedHistory);
  } catch (err) {
    logger.error(`Ошибка при получении истории чтения: ${err.message}`);
    res.status(500).send('Ошибка сервера');
  }
});

module.exports = router; 