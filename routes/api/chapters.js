const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Chapter = require('../../models/Chapter');
const Manga = require('../../models/Manga');
const User = require('../../models/User');

// @route   GET api/chapters/:id
// @desc    Получение главы по ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    
    if (!chapter) {
      return res.status(404).json({ msg: 'Глава не найдена' });
    }

    // Увеличение счетчика просмотров
    chapter.views += 1;
    await chapter.save();

    res.json(chapter);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Глава не найдена' });
    }
    res.status(500).send('Ошибка сервера');
  }
});

// @route   POST api/chapters
// @desc    Создание новой главы
// @access  Private (только для админов)
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Проверка прав доступа
    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Доступ запрещен' });
    }

    const { manga, number, title, pages, releaseDate } = req.body;

    // Проверка существования манги
    const mangaExists = await Manga.findById(manga);
    if (!mangaExists) {
      return res.status(404).json({ msg: 'Манга не найдена' });
    }

    // Проверка уникальности номера главы для данной манги
    const chapterExists = await Chapter.findOne({ manga, number });
    if (chapterExists) {
      return res.status(400).json({ msg: 'Глава с таким номером уже существует' });
    }

    // Создание новой главы
    const newChapter = new Chapter({
      manga,
      number,
      title,
      pages,
      releaseDate: releaseDate || Date.now()
    });

    const chapter = await newChapter.save();

    // Обновление даты обновления манги
    mangaExists.updatedAt = Date.now();
    await mangaExists.save();

    res.json(chapter);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   PUT api/chapters/:id
// @desc    Обновление главы
// @access  Private (только для админов)
router.put('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Проверка прав доступа
    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Доступ запрещен' });
    }

    const chapter = await Chapter.findById(req.params.id);
    
    if (!chapter) {
      return res.status(404).json({ msg: 'Глава не найдена' });
    }

    // Обновление полей главы
    const { title, pages, releaseDate } = req.body;

    if (title) chapter.title = title;
    if (pages) chapter.pages = pages;
    if (releaseDate) chapter.releaseDate = releaseDate;

    await chapter.save();

    // Обновление даты обновления манги
    const manga = await Manga.findById(chapter.manga);
    manga.updatedAt = Date.now();
    await manga.save();

    res.json(chapter);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Глава не найдена' });
    }
    res.status(500).send('Ошибка сервера');
  }
});

// @route   DELETE api/chapters/:id
// @desc    Удаление главы
// @access  Private (только для админов)
router.delete('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Проверка прав доступа
    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Доступ запрещен' });
    }

    const chapter = await Chapter.findById(req.params.id);
    
    if (!chapter) {
      return res.status(404).json({ msg: 'Глава не найдена' });
    }

    // Удаление главы
    await chapter.remove();
    
    res.json({ msg: 'Глава удалена' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Глава не найдена' });
    }
    res.status(500).send('Ошибка сервера');
  }
});

// @route   POST api/chapters/:id/read
// @desc    Сохранение прогресса чтения
// @access  Private
router.post('/:id/read', auth, async (req, res) => {
  try {
    const { page } = req.body;
    const chapterId = req.params.id;
    
    // Получение главы
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res.status(404).json({ msg: 'Глава не найдена' });
    }

    // Получение пользователя
    const user = await User.findById(req.user.id);
    
    // Проверка существования записи в истории
    const historyIndex = user.readingHistory.findIndex(
      item => item.chapter.toString() === chapterId
    );

    if (historyIndex !== -1) {
      // Обновление существующей записи
      user.readingHistory[historyIndex].page = page;
      user.readingHistory[historyIndex].lastRead = Date.now();
    } else {
      // Создание новой записи
      user.readingHistory.push({
        manga: chapter.manga,
        chapter: chapterId,
        page,
        lastRead: Date.now()
      });
    }

    await user.save();
    res.json({ msg: 'Прогресс чтения сохранен' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

module.exports = router; 