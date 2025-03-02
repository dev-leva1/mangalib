# MangaHub

Современный сайт для чтения манги с минималистичным дизайном и темной темой.

## Особенности

- Современный минималистичный дизайн с темной темой
- Интуитивно понятный интерфейс
- Адаптивный дизайн для мобильных устройств
- Удобный просмотр манги с различными режимами чтения
- Система комментариев и оценок
- Личный кабинет с историей чтения и избранным
- Административная панель для управления контентом

## Технологии

### Backend
- Node.js с Express
- MongoDB для хранения данных
- JWT для аутентификации
- Express Rate Limit для защиты от DDoS-атак
- Winston для логирования

### Frontend
- React для основной части сайта
- Redux для управления состоянием
- Styled Components для стилизации
- Современный JavaScript (ES6+)

## Установка и запуск

### Требования
- Node.js (v14+)
- MongoDB

### Установка

1. Клонировать репозиторий:
```
git clone https://github.com/dev-leva1/mangalib.git
cd mangahub
```

2. Установить зависимости:
```
npm install
```

3. Создать файл .env в корневой директории и добавить следующие переменные:
```
NODE_ENV=development
PORT=3001
MONGO_URI=mongodb://localhost:27017/mangahub
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
```

4. Установить зависимости клиента:
```
cd client
npm install
cd ..
```

### Запуск

#### Режим разработки (одновременный запуск сервера и клиента):
```
npm run dev
```

#### Только сервер:
```
npm run server
```

#### Только клиент:
```
npm run client
```

#### Продакшн:
```
cd client
npm run build
cd ..
npm start
```

## Структура проекта

```
mangahub/
  ├── client/              # React клиент
  │   ├── src/             # Исходный код клиента
  │   │   ├── actions/     # Redux действия
  │   │   ├── components/  # React компоненты
  │   │   ├── reducers/    # Redux редьюсеры
  │   │   └── utils/       # Утилиты
  ├── models/              # Mongoose модели
  ├── routes/              # Express маршруты
  │   └── api/             # API маршруты
  ├── middleware/          # Middleware функции
  ├── utils/               # Утилиты сервера
  ├── server.js            # Точка входа сервера
  └── package.json         # Зависимости и скрипты
```

## API Endpoints

### Пользователи
- POST /api/users - Регистрация пользователя
- GET /api/users/me - Получение данных текущего пользователя
- PUT /api/users/me - Обновление данных пользователя
- PUT /api/users/password - Изменение пароля
- POST /api/users/favorites/:mangaId - Добавление манги в избранное
- DELETE /api/users/favorites/:mangaId - Удаление манги из избранного
- GET /api/users/favorites - Получение списка избранных манг
- GET /api/users/history - Получение истории чтения

### Аутентификация
- POST /api/auth - Аутентификация пользователя
- GET /api/auth - Получение данных текущего пользователя

### Манга
- GET /api/manga - Получение списка манги с пагинацией и фильтрацией
- GET /api/manga/:id - Получение манги по ID
- GET /api/manga/:id/chapters - Получение глав манги
- POST /api/manga - Создание новой манги (админ)
- PUT /api/manga/:id - Обновление манги (админ)
- DELETE /api/manga/:id - Удаление манги (админ)
- GET /api/manga/popular - Получение популярной манги
- GET /api/manga/latest - Получение последних обновлений

### Главы
- GET /api/chapters/:id - Получение главы по ID
- POST /api/chapters - Создание новой главы (админ)
- PUT /api/chapters/:id - Обновление главы (админ)
- DELETE /api/chapters/:id - Удаление главы (админ)
- POST /api/chapters/:id/read - Сохранение прогресса чтения

### Комментарии
- GET /api/comments/manga/:mangaId - Получение комментариев к манге
- GET /api/comments/chapter/:chapterId - Получение комментариев к главе
- GET /api/comments/replies/:commentId - Получение ответов на комментарий
- POST /api/comments/manga/:mangaId - Добавление комментария к манге
- POST /api/comments/chapter/:chapterId - Добавление комментария к главе
- PUT /api/comments/:id - Редактирование комментария
- DELETE /api/comments/:id - Удаление комментария
- POST /api/comments/:id/like - Лайк комментария
- POST /api/comments/:id/dislike - Дизлайк комментария

## Последние обновления

### Версия 1.1.1 (Март 2025)
- Исправлена проблема с CORS политикой при аутентификации
- Улучшена конфигурация axios на клиенте
- Добавлена явная настройка baseURL для запросов API

### Версия 1.1.0 (Март 2025)
- Исправлена проблема с регистрацией пользователей
- Улучшена обработка ошибок валидации
- Добавлена настройка trust proxy для корректной работы с X-Forwarded-For
- Улучшена система логирования
- Обновлены зависимости

## Известные проблемы и их решения

### Проблема с CORS
Если вы столкнулись с ошибкой "Не разрешено CORS политикой", убедитесь, что:
1. В файле server.js корректно настроены CORS опции
2. В списке разрешенных источников указаны все необходимые домены
3. В клиентском коде axios настроен правильный baseURL

```javascript
// Настройка CORS на сервере
const corsOptions = {
  origin: function(origin, callback) {
    const allowedOrigins = process.env.NODE_ENV === 'production' 
      ? [process.env.CLIENT_URL]
      : ['http://localhost:3000', 'http://localhost:3001', undefined];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Не разрешено CORS политикой'));
    }
  },
  // другие настройки...
};
```

### Проблема с регистрацией
Если вы столкнулись с проблемой при регистрации, убедитесь, что:
1. Все поля формы заполнены
2. Пароли совпадают
3. Email не используется другим пользователем
4. Имя пользователя не занято

### Проблема с express-rate-limit
Если вы видите ошибку, связанную с X-Forwarded-For и express-rate-limit, убедитесь, что в server.js установлен параметр trust proxy:
```javascript
app.set('trust proxy', 1);
```

## Лицензия

MIT 