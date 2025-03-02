import axios from 'axios';
import { setAlert } from './alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE
} from './types';
import setAuthToken, { setRefreshToken, clearTokens } from '../utils/setAuthToken';

// Загрузка пользователя
export const loadUser = () => async dispatch => {
  // Проверка наличия токена в localStorage
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  } else {
    console.log('Нет токена в localStorage, пропускаем загрузку пользователя');
    dispatch({
      type: AUTH_ERROR
    });
    return;
  }

  try {
    console.log('Загрузка данных пользователя...');
    const res = await axios.get('/api/auth');
    console.log('Данные пользователя получены:', res.data);

    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    console.error('Ошибка при загрузке пользователя:', err);
    
    if (err.response) {
      console.error('Статус ошибки:', err.response.status);
      console.error('Данные ошибки:', err.response.data);
    }
    
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// Регистрация пользователя
export const register = ({ name, email, password }) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({ username: name, email, password });

  try {
    console.log('Отправка запроса на регистрацию...');
    console.log('URL:', '/api/users');
    console.log('Данные:', { username: name, email, password: '***' });
    
    const res = await axios.post('/api/users', body, config);
    console.log('Ответ получен:', res.data);

    // Сохраняем токены
    const { token, refreshToken, refreshTokenExpires } = res.data;
    setAuthToken(token);
    setRefreshToken(refreshToken, refreshTokenExpires);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });

    // Загрузка пользователя после успешной регистрации
    dispatch(loadUser());
  } catch (err) {
    console.error('Ошибка регистрации:', err);
    
    if (err.response) {
      console.error('Статус ошибки:', err.response.status);
      console.error('Данные ошибки:', err.response.data);
      
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach(error => dispatch(setAlert(error.message || error.msg, 'danger')));
      } else if (err.response.data.msg) {
        dispatch(setAlert(err.response.data.msg, 'danger'));
      } else {
        dispatch(setAlert('Ошибка регистрации', 'danger'));
      }
    } else if (err.request) {
      console.error('Ошибка запроса:', err.request);
      dispatch(setAlert('Не удалось соединиться с сервером. Проверьте подключение к интернету.', 'danger'));
    } else {
      console.error('Ошибка:', err.message);
      dispatch(setAlert('Произошла ошибка при регистрации. Пожалуйста, попробуйте позже.', 'danger'));
    }

    dispatch({
      type: REGISTER_FAIL
    });
  }
};

// Вход пользователя
export const login = (email, password) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({ email, password });

  try {
    console.log('Отправка запроса на аутентификацию...');
    console.log('URL:', '/api/auth');
    console.log('Данные:', { email, password: '***' });
    
    const res = await axios.post('/api/auth', body, config);
    console.log('Ответ получен:', res.data);

    // Сохраняем токены
    const { token, refreshToken, refreshTokenExpires } = res.data;
    setAuthToken(token);
    setRefreshToken(refreshToken, refreshTokenExpires);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });

    // Загрузка пользователя после успешного входа
    dispatch(loadUser());
  } catch (err) {
    console.error('Ошибка аутентификации:', err);
    
    if (err.response) {
      console.error('Статус ошибки:', err.response.status);
      console.error('Данные ошибки:', err.response.data);
      
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach(error => dispatch(setAlert(error.message || error.msg, 'danger')));
      } else if (err.response.data.msg) {
        dispatch(setAlert(err.response.data.msg, 'danger'));
      } else {
        dispatch(setAlert('Ошибка аутентификации', 'danger'));
      }
    } else if (err.request) {
      console.error('Ошибка запроса:', err.request);
      dispatch(setAlert('Не удалось соединиться с сервером. Проверьте подключение к интернету.', 'danger'));
    } else {
      console.error('Ошибка:', err.message);
      dispatch(setAlert('Произошла ошибка при входе. Пожалуйста, попробуйте позже.', 'danger'));
    }

    dispatch({
      type: LOGIN_FAIL
    });
  }
};

// Выход пользователя
export const logout = () => async dispatch => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (refreshToken) {
      console.log('Отправка запроса на выход...');
      // Отправляем запрос на сервер для удаления refresh токена
      await axios.post('/api/auth/logout', { refreshToken });
      console.log('Выход выполнен успешно');
    } else {
      console.log('Нет refresh токена, выполняем локальный выход');
    }
  } catch (err) {
    console.error('Ошибка при выходе:', err);
  } finally {
    // Очищаем токены и состояние Redux
    clearTokens();
    dispatch({ type: CLEAR_PROFILE });
    dispatch({ type: LOGOUT });
  }
}; 