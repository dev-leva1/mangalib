import { v4 as uuidv4 } from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';

// Установка оповещения
export const setAlert = (msg, alertType, timeout = 5000) => dispatch => {
  const id = uuidv4();
  
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id }
  });

  // Автоматическое удаление оповещения через указанное время
  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
}; 