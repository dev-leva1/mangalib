const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Comment = require('../../models/Comment');
const User = require('../../models/User');
const Manga = require('../../models/Manga');
const Chapter = require('../../models/Chapter');

// @route   GET api/comments/manga/:mangaId
// @desc    Получение комментариев к манге
// @access  Public
router.get('/manga/:mangaId', async (req, res) => {
  try {
    const comments = await Comment.find({ 
      manga: req.params.mangaId,
      parentComment: null // Только родительские комментарии
    })
      .sort({ createdAt: -1 })
      .populate('user', 'username avatar');
    
    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   GET api/comments/chapter/:chapterId
// @desc    Получение комментариев к главе
// @access  Public
router.get('/chapter/:chapterId', async (req, res) => {
  try {
    const comments = await Comment.find({ 
      chapter: req.params.chapterId,
      parentComment: null // Только родительские комментарии
    })
      .sort({ createdAt: -1 })
      .populate('user', 'username avatar');
    
    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   GET api/comments/replies/:commentId
// @desc    Получение ответов на комментарий
// @access  Public
router.get('/replies/:commentId', async (req, res) => {
  try {
    const replies = await Comment.find({ parentComment: req.params.commentId })
      .sort({ createdAt: 1 })
      .populate('user', 'username avatar');
    
    res.json(replies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   POST api/comments/manga/:mangaId
// @desc    Добавление комментария к манге
// @access  Private
router.post('/manga/:mangaId', auth, async (req, res) => {
  try {
    const { text, parentComment } = req.body;
    const mangaId = req.params.mangaId;

    // Проверка существования манги
    const manga = await Manga.findById(mangaId);
    if (!manga) {
      return res.status(404).json({ msg: 'Манга не найдена' });
    }

    // Проверка существования родительского комментария, если указан
    if (parentComment) {
      const parentCommentExists = await Comment.findById(parentComment);
      if (!parentCommentExists) {
        return res.status(404).json({ msg: 'Родительский комментарий не найден' });
      }
    }

    // Создание нового комментария
    const newComment = new Comment({
      user: req.user.id,
      manga: mangaId,
      text,
      parentComment: parentComment || null
    });

    const comment = await newComment.save();

    // Получение данных пользователя для ответа
    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'username avatar');

    res.json(populatedComment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   POST api/comments/chapter/:chapterId
// @desc    Добавление комментария к главе
// @access  Private
router.post('/chapter/:chapterId', auth, async (req, res) => {
  try {
    const { text, parentComment } = req.body;
    const chapterId = req.params.chapterId;

    // Проверка существования главы
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res.status(404).json({ msg: 'Глава не найдена' });
    }

    // Проверка существования родительского комментария, если указан
    if (parentComment) {
      const parentCommentExists = await Comment.findById(parentComment);
      if (!parentCommentExists) {
        return res.status(404).json({ msg: 'Родительский комментарий не найден' });
      }
    }

    // Создание нового комментария
    const newComment = new Comment({
      user: req.user.id,
      manga: chapter.manga,
      chapter: chapterId,
      text,
      parentComment: parentComment || null
    });

    const comment = await newComment.save();

    // Получение данных пользователя для ответа
    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'username avatar');

    res.json(populatedComment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   PUT api/comments/:id
// @desc    Редактирование комментария
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const commentId = req.params.id;

    // Получение комментария
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({ msg: 'Комментарий не найден' });
    }

    // Проверка прав на редактирование
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Нет прав на редактирование этого комментария' });
    }

    // Обновление текста комментария
    comment.text = text;
    comment.updatedAt = Date.now();
    
    await comment.save();

    res.json(comment);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Комментарий не найден' });
    }
    res.status(500).send('Ошибка сервера');
  }
});

// @route   DELETE api/comments/:id
// @desc    Удаление комментария
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ msg: 'Комментарий не найден' });
    }

    // Проверка прав на удаление (владелец или админ)
    const user = await User.findById(req.user.id);
    
    if (comment.user.toString() !== req.user.id && user.role !== 'admin') {
      return res.status(403).json({ msg: 'Нет прав на удаление этого комментария' });
    }

    // Удаление комментария и всех ответов на него
    await Comment.deleteMany({ $or: [
      { _id: req.params.id },
      { parentComment: req.params.id }
    ]});
    
    res.json({ msg: 'Комментарий удален' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Комментарий не найден' });
    }
    res.status(500).send('Ошибка сервера');
  }
});

// @route   POST api/comments/:id/like
// @desc    Лайк комментария
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ msg: 'Комментарий не найден' });
    }

    // Увеличение счетчика лайков
    comment.likes += 1;
    await comment.save();

    res.json({ likes: comment.likes });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Комментарий не найден' });
    }
    res.status(500).send('Ошибка сервера');
  }
});

// @route   POST api/comments/:id/dislike
// @desc    Дизлайк комментария
// @access  Private
router.post('/:id/dislike', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ msg: 'Комментарий не найден' });
    }

    // Увеличение счетчика дизлайков
    comment.dislikes += 1;
    await comment.save();

    res.json({ dislikes: comment.dislikes });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Комментарий не найден' });
    }
    res.status(500).send('Ошибка сервера');
  }
});

module.exports = router; 