import {
  GET_MANGA,
  GET_MANGA_DETAIL,
  GET_POPULAR_MANGA,
  GET_LATEST_MANGA,
  MANGA_ERROR,
  CLEAR_MANGA,
  SET_LOADING
} from '../actions/types';

const initialState = {
  manga: [],
  mangaDetail: null,
  popularManga: [],
  latestManga: [],
  loading: true,
  error: {}
};

const mangaReducer = function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_MANGA:
      return {
        ...state,
        manga: payload.manga,
        totalPages: payload.totalPages,
        currentPage: payload.currentPage,
        totalItems: payload.totalItems,
        loading: false
      };
    case GET_MANGA_DETAIL:
      return {
        ...state,
        mangaDetail: payload,
        loading: false
      };
    case GET_POPULAR_MANGA:
      return {
        ...state,
        popularManga: payload,
        loading: false
      };
    case GET_LATEST_MANGA:
      return {
        ...state,
        latestManga: payload,
        loading: false
      };
    case MANGA_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case CLEAR_MANGA:
      return {
        ...state,
        mangaDetail: null,
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

export default mangaReducer; 