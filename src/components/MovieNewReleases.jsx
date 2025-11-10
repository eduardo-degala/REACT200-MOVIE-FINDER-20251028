//src/components/MovieNewReleases.jsx

import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import DotsSpinner from './DotsSpinner';
import MovieTrailer from "./MovieTrailer";
import ScrollToTop from "./ScrollToTop";


//DEFINING DATE PARAMETERS, for filtering
const today = new Date();
const sixMonthsAgo = new Date();
sixMonthsAgo.setMonth(today.getMonth() - 6);

const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

const sixMonthsAhead = new Date();
sixMonthsAhead.setMonth(today.getMonth() + 6);

const formatDate = (date) => date.toISOString().split('T')[0];


//FUNCTION
function MovieNewReleases() {
  const [justReleased, setJustReleased] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  //collapsed state
  const [expanded, setExpanded] = useState({
    justReleased: false,
    nowPlaying: false,
    upcoming: false,
  });

  //audio, for dropdowns - onclick
  const bassdropRef = useRef(null);

  //fetch helper, helps to fetch full movie details including credits
  const fetchFullMovieDetails = async (movieId) => {
    try {
      const res = await fetch(`/api/movie/details/${movieId}`);
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Error fetching movie details:', err);
      return null;
    }
  };

//USEEFFECT - FETCHMOVIES  
useEffect(() => {
  const fetchMovies = async () => {
    setLoading(true);
    try {
      //DROPDOWN #1, Recent Releases/Just Released (last 6 months)
      const resJustReleased = await fetch(`/api/movies/discover?gte=${formatDate(sixMonthsAgo)}&lte=${formatDate(today)}&sort_by=primary_release_date.desc`);
      if (!resJustReleased.ok) throw new Error(`HTTP ${resJustReleased.status}`);
      const dataJustReleased = await resJustReleased.json();
      console.log('Just Released API Response:', dataJustReleased);
      const detailedJustReleased = await Promise.all(
        (dataJustReleased.results || []).map((movie) => fetchFullMovieDetails(movie.id))
      );
      setJustReleased(detailedJustReleased.filter(Boolean));

      //DROPDOWN #2, Now Playing (In Theaters Now)
      const resNowPlaying = await fetch(`/api/movie/now_playing`);
      if (!resNowPlaying.ok) throw new Error(`HTTP ${resNowPlaying.status}`);
      const dataNowPlaying = await resNowPlaying.json();
      console.log('Now Playing API Response:', dataNowPlaying);
      const detailedNowPlaying = await Promise.all(
        (dataNowPlaying.results || []).map((movie) => fetchFullMovieDetails(movie.id))
      );
      setNowPlaying(detailedNowPlaying.filter(Boolean));

      //DROPDOWN #3, Upcoming Movies (next 6 months)
      const resUpcoming = await fetch(`/api/movies/discover?gte=${formatDate(tomorrow)}&lte=${formatDate(sixMonthsAhead)}&sort_by=primary_release_date.asc`);
      if (!resUpcoming.ok) throw new Error(`HTTP ${resUpcoming.status}`);
      const dataUpcoming = await resUpcoming.json();
      console.log('Upcoming API Response:', dataUpcoming);
      const detailedUpcoming = await Promise.all(
        (dataUpcoming.results || []).map((movie) => fetchFullMovieDetails(movie.id))
      );
      setUpcoming(detailedUpcoming.filter(Boolean));

    } catch (err) {
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchMovies();
}, []);//END USEEFFECT - FETCHMOVIES


//LOADING...
  if (loading) return <DotsSpinner />;




  //MOVIE CONTENT, render movie, render helper, renders each individual movie content (dropdown info)
  const renderMovie = (movie) => (
    <div key={movie.id} className="border-3 border-yellow-500 pb-x mb-20 xbg-red-900 p-20 rounded-md shadow-lg"
      style={{backgroundImage: `url('/images/BG-RED-4Kx4K.jpg')`,}}>
      <h3 className="font-cinzel font-bold text-center text-2xl sm:text-2xl md:text-3xl lg:text-4xl text-yellow-300 mb-4">
        {movie.title} ({movie.release_date})
      </h3>
      {movie.poster_path && (
        <img
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          alt={movie.title}
          className="mx-auto mt-8 mb-8 my-2 rounded-lg shadow-md border border-1 border-white"
        />
      )}
      <p className="font-serif text-white text-xl text-left"><strong>Overview:</strong> {movie.overview}</p>
      <MovieTrailer movieId={movie.imdb_id || movie.imdbID} title={movie.title} />
    </div>
  );

  //STARTER PAGE CARDS
  //RENDER CARD, reuseaable card block component
  const renderCard = (title, imgSrc, key, movies) => (
    <div className="relative group bg-black rounded-lg shadow-lg p-6 mb-8 flex flex-col md:flex-row items-center text-center gap-6 border border-gray-800 w-full max-w-3xl lg:max-w-[50%] mx-auto">
      
      {/* IMAGE CONTAINER */}
      <div className="relative flex-shrink-0 w-56 aspect-square rounded-lg">

      {/* BACK SLIDE (appears on hover) */}
      <div className="absolute inset-0 bg-red-600 rounded-lg shadow-lg transform duration-500 translate-x-0 translate-y-0 group-hover:translate-x-5 group-hover:-translate-y-5 flex justify-start pt-0 p-0 items-center pointer-events-none">
        <p className="absolute top-0 left-0 font-sans font-bold text-white text-md text-center mt-2 px-4">Use Dropdown Below</p>
      </div>

      {/* IMAGE (moves opposite direction on hover) */}
      <img
        src={imgSrc}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg border-2 border-white transform duration-500 group-hover:-translate-x-5 group-hover:translate-y-5 pointer-events-auto"
      />
    </div>

      {/* DROPDOWN */}
      <div className="flex-1">
        <button
          onClick={() => {
    // Play bassdrop
    if (bassdropRef.current) {
      bassdropRef.current.currentTime = 0; // reset to start
      bassdropRef.current.play().catch(err => console.log(err));
    } 

            setExpanded({ ...expanded, [key]: !expanded[key] });
          }}
          className="w-full text-left text-white font-bold bg-black p-3 rounded-md border-3 border-white hover:bg-orange-400 transition"
        >
          {title} {expanded[key] ? '▲' : '▼'}
        </button>
        {expanded[key] && (
          <div className="p-8 bg-black rounded-md mt-2">
            {movies.length === 0 ? (
              <p className="text-white">No movies found.</p>
            ) : (
              movies.map(renderMovie)
            )}
          </div>
        )}
      </div>



    </div>
  );


//RETURN
  return (
    <div className="p-4 space-y-4 text-white">
      <audio ref={bassdropRef} src="/sounds/bassdrop.mp3" preload="auto" />
      {renderCard('Recent Releases (Last 6 Months)', '/images/1-RECENT-RELEASES.png', 'justReleased', justReleased)}
      {renderCard('Now Playing (In Theaters Now)', '/images/2-NOW-PLAYING.png', 'nowPlaying', nowPlaying)}
      {renderCard('Upcoming Movies (Next 6 Months)', '/images/3-UPCOMING-MOVIES.png', 'upcoming', upcoming)}

{/* DEJA VU VIDEO CARD */}
    <div className="relative group bg-black rounded-lg shadow-lg p-6 mb-8 flex flex-col items-center text-center gap-6 border border-gray-800 w-full max-w-3xl lg:max-w-[50%] mx-auto">
      
      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-red-500 mb-2 border-1 border-red-500 animate-pulse">
        Deja Vu? Are you thinking of a movie but can't remember?  Play this clip to trigger your memory!
      </h2>

      <div className="w-56 aspect-square rounded-lg shadow-lg border-2 border-white">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/UT7O7FyUbxA?start=63"
          title="Deja Vu clip"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-lg shadow-lg"
        ></iframe>
      </div>

      <p className="w-full max-w-3xl lg:max-w-[50%] text-center text-white font-bold bg-black p-3 rounded-md border-3 border-white hover:bg-orange-400 transition">
        Enjoy a short clip starting at 1:03!
      </p>

    </div>

      {/* Scroll To Top */}
      <ScrollToTop />

    </div>
  );
}

export default MovieNewReleases;





/*
TMDb f/just released:
    JUST RELEASED
    date -6 months
    discover movies with date filters (most flexible):  GET /discover/movie
        Query Parameters:
            primary_release_date.gte – start date
            primary_release_date.lte – end date
            sort_by=primary_release_date.desc or .asc
            optional: with_genres, vote_average.gte, language=en-US, etc.
  
    IN THEATERS    
    now playing movies: GET /movie/now_playing
        movies currently in theaters

    UPCOMING MOVIES
    data +6 months
    upcoming movies:    GET /movie/upcoming
        movies releasing soon



    full movie details:  GET /movie/{movie_id}?api_key=YOUR_API_KEY&append_to_response=credits
        credits adds:  cast crew actors directors writers

    TMDb data:
        Field	                Notes
        id	                    TMDb movie ID (numeric)
        title	                Movie title
        release_date	        YYYY-MM-DD
        overview	            Short description / plot
        poster_path	            Image path (https://image.tmdb.org/t/p/w500${poster_path})
        backdrop_path	        Banner image
        vote_average	        TMDb rating
        vote_count	            Number of votes
        genre_ids	            Array of genre IDs
        original_language	    Language code
        adult	                Boolean


            <div>
        <h2 style={{ backgroundColor: 'black', fontSize: '2rem', color: 'red' }}>Just Released (Last 6 Months)</h2>
            {justReleased.length === 0 && <p>No movies found in this category.</p>}
            {justReleased.map(renderMovie)}

        <h2 style={{ backgroundColor: 'black', fontSize: '2rem', color: 'red' }}>Now Playing</h2>
            {nowPlaying.length === 0 && <p>No movies found in this category.</p>}
            {nowPlaying.map(renderMovie)}

        <h2 style={{ backgroundColor: 'black', fontSize: '2rem', color: 'red' }}>Upcoming Movies (Next 6 Months)</h2>
            {upcoming.length === 0 && <p>No movies found in this category.</p>}
            {upcoming.map(renderMovie)}
    </div>
*/