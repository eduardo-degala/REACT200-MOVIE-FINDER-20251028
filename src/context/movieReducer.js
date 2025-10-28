//src/context/movieReducer.js
    //defines the initial state for movie-related data
    //exports the movieReducer function to handle dispatched actions

//initial state, defines default structure of global movie data
export const initialState = {
  movies: [],                   //list of all movies
  selectedMovie: null           //one selected movie
};

//reducer, updates state based on action types
export const movieReducer = (state, action) => {
  switch (action.type) {
    case 'SET_MOVIES':          //set, replaces current movie list w/new data
      return { ...state, movies: action.payload };
    case 'SELECT_MOVIE':        //select, sets the currently selected movie
      return { ...state, selectedMovie: action.payload };
    default:                    //default, return unchanged state f/unk actions
      return state;
  }
};
