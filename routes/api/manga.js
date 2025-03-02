const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Manga = require('../../models/Manga');
const Chapter = require('../../models/Chapter');
const User = require('../../models/User');
const { logger } = require('../../utils/logger');
const mongoose = require('mongoose');

// @route   GET api/manga
// @desc    Получение списка манги с пагинацией и фильтрацией
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      sort = 'updatedAt',
      order = 'desc',
      genre,
      status,
      search,
      year
    } = req.query;

    // Построение фильтра
    const filter = {};
    if (genre) filter.genres = genre;
    if (status) filter.status = status;
    if (year) filter.releaseYear = year;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { alternativeTitles: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    // Подсчет общего количества документов
    const total = await Manga.countDocuments(filter);

    // Получение манги с пагинацией и сортировкой
    const manga = await Manga.find(filter)
      .sort({ [sort]: order === 'desc' ? -1 : 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    res.json({
      manga,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalItems: total
    });
  } catch (err) {
    logger.error(`Ошибка при получении списка манги: ${err.message}`);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   GET api/manga/popular
// @desc    Получение популярной манги
// @access  Public
router.get('/popular', async (req, res) => {
  try {
    const manga = await Manga.find()
      .sort({ views: -1 })
      .limit(10);
    
    res.json(manga);
  } catch (err) {
    logger.error(`Ошибка при получении популярной манги: ${err.message}`);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   GET api/manga/latest
// @desc    Получение последних обновлений манги
// @access  Public
router.get('/latest', async (req, res) => {
  try {
    const manga = await Manga.find()
      .sort({ updatedAt: -1 })
      .limit(10);
    
    res.json(manga);
  } catch (err) {
    logger.error(`Ошибка при получении последних обновлений манги: ${err.message}`);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   GET api/manga/:id
// @desc    Получение манги по ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    // Проверка валидности ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ msg: 'Манга не найдена' });
    }

    const manga = await Manga.findById(req.params.id);
    
    if (!manga) {
      return res.status(404).json({ msg: 'Манга не найдена' });
    }

    // Увеличение счетчика просмотров
    manga.views += 1;
    await manga.save();

    res.json(manga);
  } catch (err) {
    logger.error(`Ошибка при получении манги по ID: ${err.message}`);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Манга не найдена' });
    }
    res.status(500).send('Ошибка сервера');
  }
});

// @route   GET api/manga/:id/chapters
// @desc    Получение глав манги
// @access  Public
router.get('/:id/chapters', async (req, res) => {
  try {
    // Проверка валидности ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ msg: 'Манга не найдена' });
    }

    const chapters = await Chapter.find({ manga: req.params.id })
      .sort({ number: 1 });
    
    res.json(chapters);
  } catch (err) {
    logger.error(`Ошибка при получении глав манги: ${err.message}`);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   POST api/manga
// @desc    Создание новой манги
// @access  Private (только для админов)
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Проверка прав доступа
    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Доступ запрещен' });
    }

    const {
      title,
      alternativeTitles,
      description,
      coverImage,
      author,
      artist,
      genres,
      tags,
      status,
      releaseYear,
      isAdult
    } = req.body;

    // Создание новой манги
    const newManga = new Manga({
      title,
      alternativeTitles,
      description,
      coverImage,
      author,
      artist,
      genres,
      tags,
      status,
      releaseYear,
      isAdult
    });

    const manga = await newManga.save();
    res.json(manga);
  } catch (err) {
    logger.error(`Ошибка при создании манги: ${err.message}`);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   PUT api/manga/:id
// @desc    Обновление манги
// @access  Private (только для админов)
router.put('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Проверка прав доступа
    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Доступ запрещен' });
    }

    // Проверка валидности ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ msg: 'Манга не найдена' });
    }

    const manga = await Manga.findById(req.params.id);
    
    if (!manga) {
      return res.status(404).json({ msg: 'Манга не найдена' });
    }

    // Обновление полей манги
    const {
      title,
      alternativeTitles,
      description,
      coverImage,
      author,
      artist,
      genres,
      tags,
      status,
      releaseYear,
      isAdult
    } = req.body;

    if (title) manga.title = title;
    if (alternativeTitles) manga.alternativeTitles = alternativeTitles;
    if (description) manga.description = description;
    if (coverImage) manga.coverImage = coverImage;
    if (author) manga.author = author;
    if (artist) manga.artist = artist;
    if (genres) manga.genres = genres;
    if (tags) manga.tags = tags;
    if (status) manga.status = status;
    if (releaseYear) manga.releaseYear = releaseYear;
    if (isAdult !== undefined) manga.isAdult = isAdult;

    await manga.save();
    res.json(manga);
  } catch (err) {
    logger.error(`Ошибка при обновлении манги: ${err.message}`);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Манга не найдена' });
    }
    res.status(500).send('Ошибка сервера');
  }
});

// @route   DELETE api/manga/:id
// @desc    Удаление манги
// @access  Private (только для админов)
router.delete('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Проверка прав доступа
    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Доступ запрещен' });
    }

    // Проверка валидности ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ msg: 'Манга не найдена' });
    }

    const manga = await Manga.findById(req.params.id);
    
    if (!manga) {
      return res.status(404).json({ msg: 'Манга не найдена' });
    }

    // Удаление всех глав манги
    await Chapter.deleteMany({ manga: req.params.id });
    
    // Удаление манги
    await manga.deleteOne();
    
    res.json({ msg: 'Манга удалена' });
  } catch (err) {
    logger.error(`Ошибка при удалении манги: ${err.message}`);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Манга не найдена' });
    }
    res.status(500).send('Ошибка сервера');
  }
});

module.exports = router; 