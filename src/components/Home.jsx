//src/components/Home.jsx
  //main page of movie finder app 
  //listens for changes to ?q= and performs the actual API fetch + results display
  //handles data fetching and rendering results whenever the URL query changes
  //reads ?q= using useSearchParams(), calls backend API, displays loading and results

import { useState, useEffect } from 'react';                   //useState, create state variables f/storing data & useEffect, runs die effects (debounced search)
import { Link, useSearchParams } from 'react-router-dom';      //Link, navigates between routes w/o full page reload, useSearchParams
import DotsSpinner from "./DotsSpinner"; 
import ScrollToTop from "./ScrollToTop";

//SOUNDS, default onclick for buttons
const clickSound = new Audio('/sounds/bubble.mp3');
clickSound.preload = 'auto'; // Ensure it is loaded ahead

export const playClickSound = () => {
  const sound = new Audio('/sounds/bubble.mp3');
  sound.play().catch((err) => console.log('Audio play failed:', err));
};

//HOME & SEARCH 
function Home() {                                 //HOME, defines main React component, SEARCH page f/users on movie finder app
  const [results, setResults] = useState([]);     //results stores movie array data f/API
  const [loading, setLoading] = useState(false);  //loading is debounce, pause f/search upon onChange/keystroke/char before firing API call
  const [searchParams] = useSearchParams();       //read ?q= from URL

  const handleSearch = async (searchTerm) => {    //async/searchTerm, 
    if (!searchTerm) return;                      //skip empty searches, empty or falsy ignored, stops
    try {
      setLoading(true);                           //setLoading, loading=true, "Loading..."
      const response = await fetch(`/api/search?query=${encodeURIComponent(searchTerm)}`); //GET request to backend API endpoint f/api search query
      const data = await response.json();         //parse converts data to JSON
      setResults(data.Search || []);              //setResults, updates results w/data or empty array
    } catch (err) {                               //error handling
      console.error('handleSearch error Home.jsx:', err);
      setResults([]);                             //clears results
    } finally {
      setLoading(false);                          //finally always runs, sets loading to false, ends "Loading..."
    }
  };

  //useEffect hook, fetch results whenever URL query changes
  useEffect(() => {                               
    const q = searchParams.get('q') || '';        //retrieves value of q f/parameter of URL || empty string default, '' vs null
    if (q) handleSearch(q);                       //check q if empty string, q=empty no action
  }, [searchParams]);                             //runs upon changes only, user input on SearchBar triggers navigation, URL updates

console.log('/src/components/Home.jsx loaded')




//RETURN
  return (
    <div className="p-6 xbg-gray-900 min-h-screen">

      {/* DotsSpinner */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <DotsSpinner />
        </div>
      )}

      {/* Movie grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {results.map((movie) => {

          const posterUrl =
            movie.Poster !== "N/A"
              ? movie.Poster
              : "/images/NoImage-300X445.png"; 



//RETURN
  return (
    <Link
      to={`/movie/${movie.imdbID}`}
      key={movie.imdbID}
      onClick={() => playClickSound()} 
      className="relative flex flex-row xbg-red-600 rounded-lg overflow-hidden 
      shadow-lg hover:scale-[1.02] transition-transform duration-300 border border-white
      hover:border-8 hover:border-white transition-all duration-300"
    >
          {/* 🎥 Video background */}
          <video
            src="/images/BG-RED-LIVE.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
          />

      {/* Poster on the left */}
      <div className="relative z-10 flex-shrink-0 w-32 sm:w-40 md:w-48 lg:w-56">
        <img
          src={posterUrl}
          alt={movie.Title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Text on the right */}
      <div className="relative z-10 flex flex-col justify-center p-4 text-white">
        <h3 className="font-cinzel text-lg md:text-xl font-bold mb-1">{movie.Title}</h3>
        <p className="text-black text-sm">{movie.Year}</p>
        <p className="text-black text-xs mt-2 line-clamp-2">
          {movie.Type?.toUpperCase() || 'MOVIE'}
        </p>
      </div>
          </Link>
          );

      })}
      </div>
      {/* Scroll To Top */}
      <ScrollToTop />
    </div>
  );
}

export default Home;



/*
Example user flow: 
  User visits / → the Home component loads. 
  User types: Inception 
  App sends: https://www.omdbapi.com/?apikey=...&s=Inception 
  API returns a list of movies (basic info). 
  Results show clickable posters and titles. 
  User clicks one 
    → goes to /movie/tt1375666 
    → loads full details (via MovieDetails page). 
    
  https://www.omdbapi.com/ 
  
  JSON, send all data requests to: http://www.omdbapi.com/?apikey=[yourkey]& 
  IMG, poster API requests: http://img.omdbapi.com/?apikey=[yourkey]& 
  
  OMDb API data available: 
    Title 
    Release 
    Year 
    Release Date 
    Runtime 
    Genre(s) 
    Director(s) 
    Writer(s) 
    Actor(s) 
    Plot Summary: (available in short or full versions) 
    Language(s) Country/Countries of origin 
    Awards Won 
    Poster URL 
    Ratings: (e.g., IMDb Rating, Metascore, Rotten Tomatoes) 
    IMDb ID 
    Type: (movie, series, or episode) 
    DVD Release Information 
    Box Office Results 
    Production Company 
    Website(s) 
    
onClick to upon ENTER 
  onKeyDown={(e) => { 
    if (e.key === 'Enter') { 
    handleSearch(); 
    } 
  }} 
        
ENTER upon each keystroke (in process search as you type) 
  onChange={(e) => { 
    setQuery(e.target.value); 
    handleSearch(e.target.value);     
    

CSS:  Tailwind Animations
  https://prismic.io/blog/tailwind-animations  
  

  https://ascii.co.uk/art/air
  ϵ('Θ')϶

  https://mylivewallpapers.com/
  free live wallpapers

  https://giphy.com/gifs/nba-night-lights-light-the-beam-9e63DdAfkW0EWnikgp
  beam team
*/