//src/context/MovieContext.jsx
    //creates the global MovieContext using createContext()
    //uses MovieProvider to wrap your app and provide shared state
    //connects the useReducer hook to the movieReducer for state management

import { createContext, useReducer } from 'react';
import { movieReducer, initialState } from '../context/movieReducer';

//createContext, allows components to consume shared movie data
const MovieContext = createContext();

//create provider, MovieProvider wraps the app and passes down state + dispatch
export const MovieProvider = ({ children }) => {
  const [state, dispatch] = useReducer(movieReducer, initialState);

  return (
    <MovieContext.Provider value={{ state, dispatch }}>
      {children}
    </MovieContext.Provider>
  );
};

//export, so other components to import MovieContext or MovieProvider
export default MovieContext;
