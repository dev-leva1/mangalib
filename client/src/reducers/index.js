import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import manga from './manga';
import chapter from './chapter';
import profile from './profile';

export default combineReducers({
  alert,
  auth,
  manga,
  chapter,
  profile
}); 