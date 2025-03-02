import axios from 'axios';
import { setAlert } from './alert';
import {
  GET_MANGA,
  GET_MANGA_DETAIL,
  MANGA_ERROR,
  GET_LATEST_MANGA,
  GET_POPULAR_MANGA,
  ADD_MANGA,
  UPDATE_MANGA,
  DELETE_MANGA,
  CLEAR_MANGA,
  SET_LOADING
} from './types';

// Установить состояние загрузки
export const setLoading = () => dispatch => {
  dispatch({
    type: SET_LOADING
  });
};

// Очистить текущую мангу
export const clearManga = () => dispatch => {
  dispatch({
    type: CLEAR_MANGA
  });
};

// Получить все манги
export const getAllManga = (page = 1, limit = 20, filters = {}) => async dispatch => {
  try {
    dispatch(setLoading());
    
    // Формирование параметров запроса
    let queryParams = `?page=${page}&limit=${limit}`;
    
    if (filters.genre) queryParams += `&genre=${filters.genre}`;
    if (filters.status) queryParams += `&status=${filters.status}`;
    if (filters.search) queryParams += `&search=${filters.search}`;
    if (filters.year) queryParams += `&year=${filters.year}`;
    if (filters.sort) queryParams += `&sort=${filters.sort}`;
    if (filters.order) queryParams += `&order=${filters.order}`;
    
    const res = await axios.get(`/api/manga${queryParams}`);

    dispatch({
      type: GET_MANGA,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: MANGA_ERROR,
      payload: { 
        msg: err.response?.statusText || 'Ошибка сервера', 
        status: err.response?.status || 500 
      }
    });
  }
};

// Получить мангу по ID
export const getMangaById = id => async dispatch => {
  try {
    dispatch(setLoading());
    
    const res = await axios.get(`/api/manga/${id}`);

    dispatch({
      type: GET_MANGA_DETAIL,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: MANGA_ERROR,
      payload: { 
        msg: err.response?.statusText || 'Ошибка сервера', 
        status: err.response?.status || 500 
      }
    });
  }
};

// Получить последние добавленные манги
export const getLatestManga = () => async dispatch => {
  try {
    dispatch(setLoading());
    
    const res = await axios.get('/api/manga/latest');

    dispatch({
      type: GET_LATEST_MANGA,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: MANGA_ERROR,
      payload: { 
        msg: err.response?.statusText || 'Ошибка сервера', 
        status: err.response?.status || 500 
      }
    });
  }
};

// Получить популярные манги
export const getPopularManga = () => async dispatch => {
  try {
    dispatch(setLoading());
    
    const res = await axios.get('/api/manga/popular');

    dispatch({
      type: GET_POPULAR_MANGA,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: MANGA_ERROR,
      payload: { 
        msg: err.response?.statusText || 'Ошибка сервера', 
        status: err.response?.status || 500 
      }
    });
  }
};

// Добавить новую мангу (только для админов)
export const addManga = formData => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.post('/api/manga', formData, config);

    dispatch({
      type: ADD_MANGA,
      payload: res.data
    });

    dispatch(setAlert('Манга успешно добавлена', 'success'));
  } catch (err) {
    const errors = err.response?.data?.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: MANGA_ERROR,
      payload: { 
        msg: err.response?.statusText || 'Ошибка сервера', 
        status: err.response?.status || 500 
      }
    });
  }
};

// Обновить мангу (только для админов)
export const updateManga = (id, formData) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.put(`/api/manga/${id}`, formData, config);

    dispatch({
      type: UPDATE_MANGA,
      payload: res.data
    });

    dispatch(setAlert('Манга успешно обновлена', 'success'));
  } catch (err) {
    const errors = err.response?.data?.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: MANGA_ERROR,
      payload: { 
        msg: err.response?.statusText || 'Ошибка сервера', 
        status: err.response?.status || 500 
      }
    });
  }
};

// Удалить мангу (только для админов)
export const deleteManga = id => async dispatch => {
  if (window.confirm('Вы уверены, что хотите удалить эту мангу? Это действие нельзя отменить.')) {
    try {
      await axios.delete(`/api/manga/${id}`);

      dispatch({
        type: DELETE_MANGA,
        payload: id
      });

      dispatch(setAlert('Манга успешно удалена', 'success'));
    } catch (err) {
      dispatch({
        type: MANGA_ERROR,
        payload: { 
          msg: err.response?.statusText || 'Ошибка сервера', 
          status: err.response?.status || 500 
        }
      });
    }
  }
}; 