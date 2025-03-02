import axios from 'axios';

// Функция для установки токена авторизации в заголовки запросов
const setAuthToken = token => {
  if (token) {
    // Если токен есть, добавляем его в заголовки
    axios.defaults.headers.common['x-auth-token'] = token;
    localStorage.setItem('token', token);
  } else {
    // Если токена нет, удаляем заголовок
    delete axios.defaults.headers.common['x-auth-token'];
    localStorage.removeItem('token');
  }
};

// Функция для сохранения refresh токена
export const setRefreshToken = (refreshToken, expires) => {
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
    if (expires) {
      localStorage.setItem('refreshTokenExpires', expires);
    }
  } else {
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('refreshTokenExpires');
  }
};

// Функция для получения refresh токена
export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

// Функция для проверки, истек ли refresh токен
export const isRefreshTokenExpired = () => {
  const expires = localStorage.getItem('refreshTokenExpires');
  if (!expires) return true;
  
  return new Date() > new Date(expires);
};

// Функция для очистки всех токенов при выходе
export const clearTokens = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('refreshTokenExpires');
  delete axios.defaults.headers.common['x-auth-token'];
};

export default setAuthToken; 