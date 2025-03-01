import axios from 'axios';
import { setAlert } from './alert';
import {
  GET_CHAPTERS,
  GET_CHAPTER,
  CHAPTER_ERROR,
  ADD_CHAPTER,
  UPDATE_CHAPTER,
  DELETE_CHAPTER
} from './types';

// Получить все главы манги
export const getChaptersByMangaId = mangaId => async dispatch => {
  try {
    const res = await axios.get(`/api/manga/${mangaId}/chapters`);

    dispatch({
      type: GET_CHAPTERS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: CHAPTER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Получить главу по ID
export const getChapter = chapterId => async dispatch => {
  try {
    const res = await axios.get(`/api/chapters/${chapterId}`);

    dispatch({
      type: GET_CHAPTER,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: CHAPTER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Добавить новую главу (только для админов)
export const addChapter = (mangaId, formData) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.post(`/api/manga/${mangaId}/chapters`, formData, config);

    dispatch({
      type: ADD_CHAPTER,
      payload: res.data
    });

    dispatch(setAlert('Глава успешно добавлена', 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: CHAPTER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Обновить главу (только для админов)
export const updateChapter = (chapterId, formData) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.put(`/api/chapters/${chapterId}`, formData, config);

    dispatch({
      type: UPDATE_CHAPTER,
      payload: res.data
    });

    dispatch(setAlert('Глава успешно обновлена', 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: CHAPTER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Удалить главу (только для админов)
export const deleteChapter = chapterId => async dispatch => {
  if (window.confirm('Вы уверены, что хотите удалить эту главу? Это действие нельзя отменить.')) {
    try {
      await axios.delete(`/api/chapters/${chapterId}`);

      dispatch({
        type: DELETE_CHAPTER,
        payload: chapterId
      });

      dispatch(setAlert('Глава успешно удалена', 'success'));
    } catch (err) {
      dispatch({
        type: CHAPTER_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
}; 