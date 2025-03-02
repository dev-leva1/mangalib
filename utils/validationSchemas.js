const Joi = require('joi');

// Схемы для аутентификации
const authSchemas = {
  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Пожалуйста, укажите корректный email',
      'string.empty': 'Email не может быть пустым',
      'any.required': 'Email обязателен'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Пароль должен быть не менее {#limit} символов',
      'string.empty': 'Пароль не может быть пустым',
      'any.required': 'Пароль обязателен'
    })
  }),
  
  register: Joi.object({
    username: Joi.string().min(3).max(20).required().messages({
      'string.min': 'Имя пользователя должно быть не менее {#limit} символов',
      'string.max': 'Имя пользователя не может быть длиннее {#limit} символов',
      'string.empty': 'Имя пользователя не может быть пустым',
      'any.required': 'Имя пользователя обязательно'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Пожалуйста, укажите корректный email',
      'string.empty': 'Email не может быть пустым',
      'any.required': 'Email обязателен'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Пароль должен быть не менее {#limit} символов',
      'string.empty': 'Пароль не может быть пустым',
      'any.required': 'Пароль обязателен'
    })
  }),
  
  refreshToken: Joi.object({
    refreshToken: Joi.string().required().messages({
      'string.empty': 'Refresh токен не может быть пустым',
      'any.required': 'Refresh токен обязателен'
    })
  })
};

// Схемы для пользователей
const userSchemas = {
  updateProfile: Joi.object({
    username: Joi.string().min(3).max(20).messages({
      'string.min': 'Имя пользователя должно быть не менее {#limit} символов',
      'string.max': 'Имя пользователя не может быть длиннее {#limit} символов'
    }),
    email: Joi.string().email().messages({
      'string.email': 'Пожалуйста, укажите корректный email'
    }),
    avatar: Joi.string()
  }),
  
  updatePassword: Joi.object({
    currentPassword: Joi.string().required().messages({
      'string.empty': 'Текущий пароль не может быть пустым',
      'any.required': 'Текущий пароль обязателен'
    }),
    newPassword: Joi.string().min(6).required().messages({
      'string.min': 'Новый пароль должен быть не менее {#limit} символов',
      'string.empty': 'Новый пароль не может быть пустым',
      'any.required': 'Новый пароль обязателен'
    })
  }),
  
  mangaId: Joi.object({
    mangaId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
      'string.pattern.base': 'Некорректный ID манги',
      'any.required': 'ID манги обязателен'
    })
  })
};

// Схемы для манги
const mangaSchemas = {
  getManga: Joi.object({
    page: Joi.number().integer().min(1).default(1).messages({
      'number.base': 'Номер страницы должен быть числом',
      'number.integer': 'Номер страницы должен быть целым числом',
      'number.min': 'Номер страницы должен быть не менее {#limit}'
    }),
    limit: Joi.number().integer().min(1).max(50).default(10).messages({
      'number.base': 'Лимит должен быть числом',
      'number.integer': 'Лимит должен быть целым числом',
      'number.min': 'Лимит должен быть не менее {#limit}',
      'number.max': 'Лимит должен быть не более {#limit}'
    }),
    genre: Joi.string(),
    status: Joi.string().valid('ongoing', 'completed', 'hiatus'),
    sort: Joi.string().valid('title', 'createdAt', 'updatedAt', 'rating'),
    order: Joi.string().valid('asc', 'desc').default('desc')
  }),
  
  getMangaById: Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
      'string.pattern.base': 'Некорректный ID манги',
      'any.required': 'ID манги обязателен'
    })
  }),
  
  createManga: Joi.object({
    title: Joi.string().min(1).max(100).required().messages({
      'string.min': 'Название должно быть не менее {#limit} символов',
      'string.max': 'Название не может быть длиннее {#limit} символов',
      'string.empty': 'Название не может быть пустым',
      'any.required': 'Название обязательно'
    }),
    description: Joi.string().min(10).required().messages({
      'string.min': 'Описание должно быть не менее {#limit} символов',
      'string.empty': 'Описание не может быть пустым',
      'any.required': 'Описание обязательно'
    }),
    genres: Joi.array().items(Joi.string()).min(1).required().messages({
      'array.min': 'Должен быть указан хотя бы один жанр',
      'any.required': 'Жанры обязательны'
    }),
    status: Joi.string().valid('ongoing', 'completed', 'hiatus').required().messages({
      'any.only': 'Статус должен быть одним из: ongoing, completed, hiatus',
      'any.required': 'Статус обязателен'
    }),
    coverImage: Joi.string().required().messages({
      'string.empty': 'Обложка не может быть пустой',
      'any.required': 'Обложка обязательна'
    }),
    author: Joi.string().required().messages({
      'string.empty': 'Автор не может быть пустым',
      'any.required': 'Автор обязателен'
    })
  })
};

// Схемы для глав
const chapterSchemas = {
  getChapter: Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
      'string.pattern.base': 'Некорректный ID главы',
      'any.required': 'ID главы обязателен'
    })
  }),
  
  createChapter: Joi.object({
    manga: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
      'string.pattern.base': 'Некорректный ID манги',
      'any.required': 'ID манги обязателен'
    }),
    number: Joi.number().required().messages({
      'number.base': 'Номер главы должен быть числом',
      'any.required': 'Номер главы обязателен'
    }),
    title: Joi.string().required().messages({
      'string.empty': 'Название главы не может быть пустым',
      'any.required': 'Название главы обязательно'
    }),
    pages: Joi.array().items(Joi.string()).min(1).required().messages({
      'array.min': 'Должна быть хотя бы одна страница',
      'any.required': 'Страницы обязательны'
    })
  }),
  
  saveReadingProgress: Joi.object({
    page: Joi.number().integer().min(1).required().messages({
      'number.base': 'Номер страницы должен быть числом',
      'number.integer': 'Номер страницы должен быть целым числом',
      'number.min': 'Номер страницы должен быть не менее {#limit}',
      'any.required': 'Номер страницы обязателен'
    })
  })
};

// Схемы для комментариев
const commentSchemas = {
  createComment: Joi.object({
    text: Joi.string().min(1).max(1000).required().messages({
      'string.min': 'Комментарий должен быть не менее {#limit} символов',
      'string.max': 'Комментарий не может быть длиннее {#limit} символов',
      'string.empty': 'Комментарий не может быть пустым',
      'any.required': 'Текст комментария обязателен'
    }),
    parentComment: Joi.string().regex(/^[0-9a-fA-F]{24}$/).messages({
      'string.pattern.base': 'Некорректный ID родительского комментария'
    })
  }),
  
  updateComment: Joi.object({
    text: Joi.string().min(1).max(1000).required().messages({
      'string.min': 'Комментарий должен быть не менее {#limit} символов',
      'string.max': 'Комментарий не может быть длиннее {#limit} символов',
      'string.empty': 'Комментарий не может быть пустым',
      'any.required': 'Текст комментария обязателен'
    })
  })
};

module.exports = {
  authSchemas,
  userSchemas,
  mangaSchemas,
  chapterSchemas,
  commentSchemas
}; 