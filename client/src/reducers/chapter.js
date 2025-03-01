import {
  GET_CHAPTERS,
  GET_CHAPTER,
  CHAPTER_ERROR,
  ADD_CHAPTER,
  UPDATE_CHAPTER,
  DELETE_CHAPTER
} from '../actions/types';

const initialState = {
  chapters: [],
  chapter: null,
  loading: true,
  error: {}
};

const chapterReducer = function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_CHAPTERS:
      return {
        ...state,
        chapters: payload,
        loading: false
      };
    case GET_CHAPTER:
      return {
        ...state,
        chapter: payload,
        loading: false
      };
    case ADD_CHAPTER:
      return {
        ...state,
        chapters: [payload, ...state.chapters],
        loading: false
      };
    case UPDATE_CHAPTER:
      return {
        ...state,
        chapters: state.chapters.map(chapter =>
          chapter._id === payload._id ? payload : chapter
        ),
        chapter: payload,
        loading: false
      };
    case DELETE_CHAPTER:
      return {
        ...state,
        chapters: state.chapters.filter(chapter => chapter._id !== payload),
        loading: false
      };
    case CHAPTER_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
};

export default chapterReducer; 