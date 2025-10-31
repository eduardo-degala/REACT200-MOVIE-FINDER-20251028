//src/App.jsx

import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import MovieDetails from './components/MovieDetails';
import MovieDetailsActor from './components/MovieDetailsActor';
import SearchBar from './components/SearchBar';
import SearchBarExpand from './components/SearchBarExpand';
import MovieNewReleases from './components/MovieNewReleases';
import AnimatedTitle from './components/AnimatedTitle';
import AnimatedSplitScreen from "./components/AnimatedSplitScreen";

console.log('App.jsx API Key:', 'API_KEY debugger unquote for validation');
console.log('App.jsx loaded')

function App() {
   return (

    <>
{/* TOP BAR, AnimatedTitle - SearchBar */}
<div className="flex items-center bg-black px-4 py-4 gap-4 mb-0 overflow-visible">
  <AnimatedTitle
    containerClassName="flex-shrink-0 p-0 mb-1 h-auto z-20"
    className="text-xl text-left text-white"
  />
  <div className="flex-grow">
    <SearchBar containerClassName="bg-black" />
  </div>
</div>
    
{/* STARTER PAGE, AnimatedSplitScreen */}
<div className="m-0 p-0">
  <AnimatedSplitScreen />
</div>

    


      {/* 🎥 Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-screen h-screen object-cover -z-10"
      >
         <source 
          src="/images/Background-1920x1080.mp4" 
          type="video/mp4" 
        />
        Your browser does not support the video tag.
      </video>

      {/* Routes */}
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

// /public/images/Background-1920x1080.mp4


      {/* Temporary New Releases Preview */}
      <div className="bg-white dark:bg-black border-2 border-blue-500 p-4 m-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Temporary MovieNewReleases Preview</h2>
        <MovieNewReleases />
      </div>

