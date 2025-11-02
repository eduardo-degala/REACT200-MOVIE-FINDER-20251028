//src/components/MovieNewReleases.jsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DotsSpinner from './DotsSpinner';
import MovieTrailer from "./MovieTrailer";


const today = new Date();
const sixMonthsAgo = new Date();
sixMonthsAgo.setMonth(today.getMonth() - 6);

const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

const sixMonthsAhead = new Date();
sixMonthsAhead.setMonth(today.getMonth() + 6);

const formatDate = (date) => date.toISOString().split('T')[0];

function MovieNewReleases() {
  const [justReleased, setJustReleased] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

    // Collapse state
  const [expanded, setExpanded] = useState({
    justReleased: false,
    nowPlaying: false,
    upcoming: false,
  });

  // helper to fetch full movie details including credits
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

useEffect(() => {
  const fetchMovies = async () => {
    setLoading(true);
    try {
      // 1️⃣ Just Released (last 6 months)
      const resJustReleased = await fetch(`/api/movies/discover?gte=${formatDate(sixMonthsAgo)}&lte=${formatDate(today)}&sort_by=primary_release_date.desc`);
      if (!resJustReleased.ok) throw new Error(`HTTP ${resJustReleased.status}`);
      const dataJustReleased = await resJustReleased.json();
      console.log('Just Released API Response:', dataJustReleased);
      const detailedJustReleased = await Promise.all(
        (dataJustReleased.results || []).map((movie) => fetchFullMovieDetails(movie.id))
      );
      setJustReleased(detailedJustReleased.filter(Boolean));

      // 2️⃣ Now Playing
      const resNowPlaying = await fetch(`/api/movie/now_playing`);
      if (!resNowPlaying.ok) throw new Error(`HTTP ${resNowPlaying.status}`);
      const dataNowPlaying = await resNowPlaying.json();
      console.log('Now Playing API Response:', dataNowPlaying);
      const detailedNowPlaying = await Promise.all(
        (dataNowPlaying.results || []).map((movie) => fetchFullMovieDetails(movie.id))
      );
      setNowPlaying(detailedNowPlaying.filter(Boolean));

      // 3️⃣ Upcoming (next 6 months)
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
}, []);

//LOADING...
  if (loading) return <DotsSpinner />;




  // render helper
  const renderMovie = (movie) => (
    <div key={movie.id} style={{ marginBottom: '2rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>

      <h3>
        {movie.title} ({movie.release_date})
      </h3>

    {/* movie.poster, only render the poster if it exists */}
    {movie.poster_path && (
      <img
        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
        alt={movie.title}
      />
    )}

      <p><strong>Overview:</strong> {movie.overview}</p>

   {/* 🎬 Add Movie Trailer Component */}
    <MovieTrailer movieId={movie.imdb_id || movie.imdbID} title={movie.title} />

      <p><strong>Genres:</strong> {movie.genres.map((g) => g.name).join(', ')}</p>
      <p><strong>Runtime:</strong> {movie.runtime} min</p>
      <p><strong>Language:</strong> {movie.original_language}</p>
      <p><strong>Vote Average:</strong> {movie.vote_average}</p>
      <p><strong>Vote Count:</strong> {movie.vote_count}</p>
      <p><strong>Adult:</strong> {movie.adult ? 'Yes' : 'No'}</p>
   
      <p><strong>Director:</strong> {movie.credits?.crew?.filter(c => c.job === 'Director').map(d => d.name).join(', ') || 'N/A'}</p>
      <p><strong>Writers:</strong> {movie.credits?.crew?.filter(c => c.job === 'Writer').map(w => w.name).join(', ') || 'N/A'}</p>
      <p><strong>Actors:</strong> {movie.credits?.cast?.slice(0, 5).map(a => a.name).join(', ') || 'N/A'}</p>

    </div>
  );





  return (

     <div className="space-y-4 text-white">

      {/* Just Released */}
      <div>
        <button
          onClick={() => setExpanded({ ...expanded, justReleased: !expanded.justReleased })}
          className="w-full text-left bg-red-600 p-2 rounded"
        >
          Just Released (Last 6 Months) {expanded.justReleased ? '▲' : '▼'}
        </button>
        {expanded.justReleased && (
          <div className="p-2 bg-gray-900 rounded mt-1 space-y-2">
            {justReleased.length === 0 ? <p>No movies found.</p> : justReleased.map(renderMovie)}
          </div>
        )}
      </div>

      {/* Now Playing */}
      <div>
        <button
          onClick={() => setExpanded({ ...expanded, nowPlaying: !expanded.nowPlaying })}
          className="w-full text-left bg-blue-600 p-2 rounded"
        >
          Now Playing (In Theaters Now) {expanded.nowPlaying ? '▲' : '▼'}
        </button>
        {expanded.nowPlaying && (
          <div className="p-2 bg-gray-900 rounded mt-1 space-y-2">
            {nowPlaying.length === 0 ? <p>No movies found.</p> : nowPlaying.map(renderMovie)}
          </div>
        )}
      </div>

      {/* Upcoming */}
      <div>
        <button
          onClick={() => setExpanded({ ...expanded, upcoming: !expanded.upcoming })}
          className="w-full text-left bg-green-600 p-2 rounded"
        >
          Upcoming (Next 6 Months) {expanded.upcoming ? '▲' : '▼'}
        </button>
        {expanded.upcoming && (
          <div className="p-2 bg-gray-900 rounded mt-1 space-y-2">
            {upcoming.length === 0 ? <p>No movies found.</p> : upcoming.map(renderMovie)}
          </div>
        )}
      </div>

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