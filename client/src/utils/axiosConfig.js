import axios from 'axios';
import store from '../store';
import { LOGOUT } from '../actions/types';
import setAuthToken, { getRefreshToken, setRefreshToken, clearTokens } from './setAuthToken';

// Настройка базового URL для всех запросов
axios.defaults.baseURL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_API_URL 
  : 'http://localhost:3001';

// Создаем флаг для отслеживания, идет ли обновление токена
let isRefreshing = false;
// Очередь запросов, ожидающих обновления токена
let failedQueue = [];

// Функция для обработки очереди запросов
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Добавляем перехватчик запросов для логирования
axios.interceptors.request.use(
  config => {
    console.log(`Отправка ${config.method.toUpperCase()} запроса на ${config.url}`);
    return config;
  },
  error => {
    console.error('Ошибка при отправке запроса:', error);
    return Promise.reject(error);
  }
);

// Перехватчик ответов
axios.interceptors.response.use(
  response => {
    console.log(`Получен ответ от ${response.config.url} со статусом ${response.status}`);
    return response;
  },
  async error => {
    console.error('Ошибка ответа:', error);
    
    if (!error.response) {
      console.error('Нет ответа от сервера');
      return Promise.reject(error);
    }
    
    const originalRequest = error.config;
    
    // Если ошибка не связана с авторизацией или запрос уже повторялся, возвращаем ошибку
    if (error.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
    
    // Если это запрос на обновление токена, выходим из системы
    if (originalRequest.url === '/api/auth/refresh') {
      console.log('Ошибка при обновлении токена, выход из системы');
      store.dispatch({ type: LOGOUT });
      clearTokens();
      return Promise.reject(error);
    }
    
    // Если уже идет обновление токена, добавляем запрос в очередь
    if (isRefreshing) {
      console.log('Токен уже обновляется, добавляем запрос в очередь');
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          originalRequest.headers['x-auth-token'] = token;
          return axios(originalRequest);
        })
        .catch(err => {
          return Promise.reject(err);
        });
    }
    
    originalRequest._retry = true;
    isRefreshing = true;
    
    // Получаем refresh токен
    const refreshToken = getRefreshToken();
    
    if (!refreshToken) {
      console.log('Нет refresh токена, выход из системы');
      isRefreshing = false;
      store.dispatch({ type: LOGOUT });
      clearTokens();
      return Promise.reject(error);
    }
    
    // Пытаемся обновить токен
    try {
      console.log('Попытка обновления токена');
      const res = await axios.post('/api/auth/refresh', { refreshToken });
      const { token, refreshToken: newRefreshToken, refreshTokenExpires } = res.data;
      
      console.log('Токен успешно обновлен');
      
      // Сохраняем новые токены
      setAuthToken(token);
      setRefreshToken(newRefreshToken, refreshTokenExpires);
      
      // Обновляем заголовок в исходном запросе
      originalRequest.headers['x-auth-token'] = token;
      
      // Обрабатываем очередь запросов
      processQueue(null, token);
      isRefreshing = false;
      
      // Повторяем исходный запрос
      return axios(originalRequest);
    } catch (err) {
      console.error('Ошибка при обновлении токена:', err);
      processQueue(err, null);
      isRefreshing = false;
      store.dispatch({ type: LOGOUT });
      clearTokens();
      return Promise.reject(err);
    }
  }
);

export default axios; 