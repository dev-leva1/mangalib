import axios from 'axios';
import { setAlert } from './alert';
import {
  GET_PROFILE,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  CLEAR_PROFILE,
  ACCOUNT_DELETED
} from './types';

// Получить текущий профиль пользователя
export const getProfile = () => async dispatch => {
  try {
    const res = await axios.get('/api/profile/me');

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Обновить профиль
export const updateProfile = formData => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.post('/api/profile', formData, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Профиль обновлен', 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Добавить мангу в список чтения
export const addToReadingList = mangaId => async dispatch => {
  try {
    const res = await axios.put(`/api/profile/reading-list/${mangaId}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Манга добавлена в список чтения', 'success'));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Удалить мангу из списка чтения
export const removeFromReadingList = mangaId => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/reading-list/${mangaId}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Манга удалена из списка чтения', 'success'));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Добавить мангу в избранное
export const addToFavorites = mangaId => async dispatch => {
  try {
    const res = await axios.put(`/api/profile/favorites/${mangaId}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Манга добавлена в избранное', 'success'));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Удалить мангу из избранного
export const removeFromFavorites = mangaId => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/favorites/${mangaId}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Манга удалена из избранного', 'success'));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Обновить прогресс чтения
export const updateReadingProgress = (mangaId, chapterId) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.put(`/api/profile/reading-progress/${mangaId}`, { chapterId }, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Удалить аккаунт
export const deleteAccount = () => async dispatch => {
  if (window.confirm('Вы уверены? Это действие НЕЛЬЗЯ отменить!')) {
    try {
      await axios.delete('/api/profile');

      dispatch({ type: CLEAR_PROFILE });
      dispatch({ type: ACCOUNT_DELETED });

      dispatch(setAlert('Ваш аккаунт был удален'));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
}; 