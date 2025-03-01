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

export default setAuthToken; 