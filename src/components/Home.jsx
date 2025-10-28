//src/components/Home.jsx
  //main page of movie finder app 
  //listens for changes to ?q= and performs the actual API fetch + results display
  //handles data fetching and rendering results whenever the URL query changes
  //reads ?q= using useSearchParams(), calls backend API, displays loading and results

import { useState, useEffect } from 'react';                   //useState, create state variables f/storing data & useEffect, runs die effects (debounced search)
import { Link, useSearchParams } from 'react-router-dom';      //Link, navigates between routes w/o full page reload, useSearchParams

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





return ( 
  <div> 
  
    {loading && <p>Loading...</p>}

    <div> 
      {results.map((movie) => ( 
        <div key={movie.imdbID}> 
        <Link to={`/movie/${movie.imdbID}`}> 
          <h3>{movie.Title}</h3> 
          <img src={movie.Poster} alt={movie.Title} width="100" /> 
        </Link> 
        </div> 
      ))} 
    </div> 
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