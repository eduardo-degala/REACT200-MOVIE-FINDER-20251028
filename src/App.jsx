//src/App.jsx

import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import MovieDetails from './components/MovieDetails';
import MovieDetailsActor from './components/MovieDetailsActor';
import SearchBar from './components/SearchBar';
import MovieNewReleases from './components/MovieNewReleases';

console.log('App.jsx API Key:', 'API_KEY debugger unquote for validation');
console.log('App.jsx loaded')

function App() {
  return (
    <>
      <h1 className="text-4xl font-bold animation-dimlight box-reflect text-center mt-4">
      MOVIE FINDER
      </h1>

      <SearchBar /> {/* always visible */}

      <div className="bg-white dark:bg-black border-2 border-blue-500 p-4 m-4">
      <h2>Temporary MovieNewReleases Preview</h2>
      <MovieNewReleases />
      </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/actor/:name" element={<MovieDetailsActor />} />
          <Route path="/movies/new" element={<MovieNewReleases />} />
        </Routes>

    </>
  );
}

export default App;
