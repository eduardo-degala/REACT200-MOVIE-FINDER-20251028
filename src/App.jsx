//src/App.jsx

import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import MovieDetails from './components/MovieDetails';
import MovieDetailsActor from './components/MovieDetailsActor';
import SearchBar from './components/SearchBar';
import MovieNewReleases from './components/MovieNewReleases';
import AnimatedTitle from './components/AnimatedTitle';

console.log('App.jsx API Key:', 'API_KEY debugger unquote for validation');
console.log('App.jsx loaded')

function App() {
   return (
    <div className="min-h-screen text-black dark:text-white">

      {/* 🎥 Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src="/images/Background-Blue-1920x1080.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Animated Title */}
      <h1 className="text-4xl md:text-6xl xl:text-8xl font-bold animate-dimlight box-reflect text-center mt-8">
        <AnimatedTitle />
      </h1>


      {/* Search bar */}
      <div className="mt-8 px-4">
        <SearchBar />
      </div>

      {/* Temporary New Releases Preview */}
      <div className="bg-white dark:bg-black border-2 border-blue-500 p-4 m-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Temporary MovieNewReleases Preview</h2>
        <MovieNewReleases />
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/actor/:name" element={<MovieDetailsActor />} />
        <Route path="/movies/new" element={<MovieNewReleases />} />
      </Routes>
    </div>
  );
}



export default App;

// /public/images/Background-Blue-1920x1080.mp4