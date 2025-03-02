import {
  GET_FAVORITES,
  ADD_FAVORITE,
  REMOVE_FAVORITE,
  GET_READING_HISTORY,
  UPDATE_READING_PROGRESS,
  PROFILE_ERROR,
  SET_LOADING
} from '../actions/types';

const initialState = {
  favorites: [],
  readingHistory: [],
  loading: true,
  error: {}
};

const profileReducer = function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_FAVORITES:
      return {
        ...state,
        favorites: payload,
        loading: false
      };
    case ADD_FAVORITE:
      return {
        ...state,
        favorites: [...state.favorites, payload],
        loading: false
      };
    case REMOVE_FAVORITE:
      return {
        ...state,
        favorites: state.favorites.filter(manga => manga._id !== payload),
        loading: false
      };
    case GET_READING_HISTORY:
      return {
        ...state,
        readingHistory: payload,
        loading: false
      };
    case UPDATE_READING_PROGRESS:
      return {
        ...state,
        readingHistory: state.readingHistory.map(item => 
          item.chapter._id === payload.chapterId
            ? { ...item, page: payload.page, lastRead: Date.now() }
            : item
        ),
        loading: false
      };
    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case SET_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
};

export default profileReducer; 