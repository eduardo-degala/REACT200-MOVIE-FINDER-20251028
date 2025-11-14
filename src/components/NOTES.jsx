//NOTES.jsx is used to cut/paste multiple in-work items, no other appliation



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

      {/* Recent Releases */}

      <div className="flex-shrink-0">
    <img
      src="/images/1-RECENT-RELEASES.png"
      alt="Recent Releases"
      className="w-48 h-auto rounded-lg shadow-lg"
    />
  </div>

      <div>
        <button
          onClick={() => setExpanded({ ...expanded, justReleased: !expanded.justReleased })}
          className="w-full text-left text-yellow-500 font-bold bg-black p-2 rounded"
        >
          Recent Releases (Last 6 Months) {expanded.justReleased ? '▲' : '▼'}
        </button>
        {expanded.justReleased && (
          <div className="p-2 bg-gray-900 rounded mt-1 space-y-2">
            {justReleased.length === 0 ? <p>No movies found.</p> : justReleased.map(renderMovie)}
          </div>
        )}
      </div>
      {/* Now Playing */}

        <div className="flex-shrink-0">
    <img
      src="/images/2-NOW-PLAYING.png"
      alt="Now Playing"
      className="w-48 h-auto rounded-lg shadow-lg"
    />
  </div>
    
      <div>
        <button
          onClick={() => setExpanded({ ...expanded, nowPlaying: !expanded.nowPlaying })}
          className="w-full text-left text-yellow-500 font-bold bg-black p-2 rounded"
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

        <div className="flex-shrink-0">
    <img
      src="/images/3-UPCOMING-MOVIES.png"
      alt="Upcoming Movies"
      className="w-48 h-auto rounded-lg shadow-lg"
    />
  </div>

      <div>
        <button
          onClick={() => setExpanded({ ...expanded, upcoming: !expanded.upcoming })}
          className="w-full text-left text-yellow-500 font-bold bg-black p-2 rounded"
        >
          Upcoming Movies (Next 6 Months) {expanded.upcoming ? '▲' : '▼'}
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

NEXT...

//src/components/MovieNewReleases.jsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DotsSpinner from './DotsSpinner';
import MovieTrailer from "./MovieTrailer";


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
    <div key={movie.id} className="border-3 border-yellow-500 pb-x mb-20 bg-red-900 p-20">
      <h3 className="font-bold text-center text-2xl sm:text-2xl md:text-3xl lg:text-4xl text-yellow-300 mb-4">
        {movie.title} ({movie.release_date})
      </h3>
      {movie.poster_path && (
        <img
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          alt={movie.title}
          className="mx-auto mt-8 mb-8 my-2 rounded-lg shadow-md border border-1 border-white"
        />
      )}
      <p className="text-white text-xl text-left"><strong>Overview:</strong> {movie.overview}</p>
      <MovieTrailer movieId={movie.imdb_id || movie.imdbID} title={movie.title} />
    </div>
  );

  //STARTER PAGE CARDS
  //RENDER CARD, reuseaable card block component
  const renderCard = (title, imgSrc, key, movies) => (
    <div className="bg-black rounded-lg shadow-lg p-4 mb-0 flex flex-col md:flex-row items-center text-center gap-6 border border-gray-800 w-full max-w-3xl lg:max-w-[50%] mx-auto">
      
      {/* IMAGE */}
      <div className="flex-shrink-0">
        <img
          src={imgSrc}
          alt={title}
          className="w-56 h-auto rounded-md shadow-md border-3 border-white"
        />
      </div>

      {/* DROPDOWN */}
      <div className="flex-1">
        <button
          onClick={() => setExpanded({ ...expanded, [key]: !expanded[key] })}
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
      {renderCard('Recent Releases (Last 6 Months)', '/images/1-RECENT-RELEASES.png', 'justReleased', justReleased)}
      {renderCard('Now Playing (In Theaters Now)', '/images/2-NOW-PLAYING.png', 'nowPlaying', nowPlaying)}
      {renderCard('Upcoming Movies (Next 6 Months)', '/images/3-UPCOMING-MOVIES.png', 'upcoming', upcoming)}
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

  {/* Background Video */}
  <video
    autoPlay
    loop
    muted
    playsInline
    className="fixed top-0 left-0 w-screen h-screen object-cover z-0"
  >
    <source src="/images/BG-METAL-HNY.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>


//this is split screen, return, trying to correct screen variation w/caruousel and buttons...


 //RETURN 
  return (
    <div className="flex h-screen overflow-hidden xpt-20">

      {/* RED, enter text */}
      {!activePane && (
      <div className="absolute top-0 left-0 w-full h-full group">
        <p className="absolute top-[22%] left-1/2 transform -translate-x-1/2
        text-center text-red-600 text-9xl font-bold z-25 cursor-pointer">
        Enter</p>

        {/* RED, hover text */}
        <span className="absolute top-[38%] left-1/2 transform -translate-x-1/2 mt-4
        bg-white text-red-600 text-lg font-bold border border-3 border-red-600 rounded px-3 py-1 opacity-0
        transition-opacity duration-300 group-hover:opacity-100 z-30">
        Click a button below to expand a pane.
        </span>
      </div>
      )}

    {/* SCROLLING CAROUSEL, images/posters */}
    {!activePane && (
    <div className="absolute left-1/2 bottom-[calc(12rem+20px)] transform -translate-x-1/2 w-[90%] z-20">
      <AnimatedScrollCarousel images={images} />
    </div>
  )}



      {/* LEFT PANE, white button */} 
      <div className={`relative bg-black text-white transition-all duration-1000
      ${activePane === "left" ? "overflow-y-auto" : "overflow-hidden"}`}
      style={{ width: leftWidth }}>

        <div
        className={`absolute right-0 top-1/2 w-48 h-48 flex items-center justify-center cursor-pointer
             bg-white text-black font-bold transition-shadow duration-300 shadow-md 
             hover:shadow-[0_0_30px_20px_rgba(255,0,0,0.95)] hover:scale-105 z-10
             ${activePane ? "w-24 h-24 text-sm text-center" : "w-48 h-48 text-lg"}`}
        onClick={expandRight}
        >
        New Releases
        </div>
        
        
        {/* LEFT PANE, black background */} 
        <div className="min-h-screen p-4 pt-32">
          {/* UPON EXPANSION, Conditional Rendering */}
          {activePane === "left" ? (
            <>
              <AnimatedTitle
                  containerClassName="flex-shrink-0 p-0 mb-20 h-auto z-20"
                  className="text-5xl sm:text-5xl md:text-7xl lg:text-9xl text-center text-white"
                />

              <SearchBarExpand />

              {/* ROUTES */}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/actor/:name" element={<MovieDetailsActor />} />
              </Routes>
            </>
          ) : (
          <div className="flex items-center justify-center h-screen text-2xl">
          SEARCH FOR MOVIES</div>)}
        </div>
      </div>



      {/* RIGHT PANE, black button */}
      <div className={`relative bg-white text-black transition-all duration-1000 
      ${activePane === "right" ? "overflow-y-auto" : "overflow-hidden"}`}
      style={{ width: rightWidth }}>
        <div
        className={`absolute left-0 top-1/2 w-48 h-48 flex items-center justify-center cursor-pointer
             bg-black text-white font-bold transition-shadow duration-300 shadow-lg 
             hover:shadow-[0_0_30px_20px_rgba(255,0,0,0.95)] hover:scale-105 z-10
             ${activePane ? "w-24 h-24 text-sm text-center" : "w-48 h-48 text-lg"}`}
        onClick={expandLeft}
        >
        Search Movies
        </div>

        {/* RIGHT PANE, white background */} 
        <div className="min-h-screen p-4 pt-32">
          {/* UPON EXPANSION, Conditional Rendering */}
          {activePane === "right" ? (
            <> 
            <AnimatedTitle 
              containerClassName="flex-shrink-0 p-0 mb-20 h-auto z-20"
              text="MOVIE FINDER"
              className="text-5xl sm:text-5xl md:text-7xl lg:text-9xl text-center text-black animate-dimlightGray drop-shadow-md"
            />
            <div className="mt-36">
            <MovieNewReleases />
            </div>
              </>
          ) : (
          <div className="flex items-center justify-center h-screen text-2xl">
          NEW RELEASES</div>)}
        </div>

      </div>

    </div>
  );
}

//MOVIE DETAILS,prestyling to matching to new releases...

return (
    <div className="space-y-4 text-white xbg-gray-900 p-6 rounded-lg">

      {/* TITLE */}
      <h2 className="text-3xl font-bold mb-2 p-0">{movie.Title}</h2>
      <h3 className="text-base font-bold mb-4">{movie.Year} - {movie.Rated} - {movie.Runtime}</h3>

      {/* MAIN SECTION */}
      <div className="flex flex-col md:flex-row md:flex-nowrap md:space-x-0 md:items-start">

        {/* POSTER */}
        <div className="flex-shrink-0">
          <img
            src={movie.Poster && movie.Poster !== "N/A"
              ? movie.Poster
              : "/images/NoImage-300X445.png"}
            alt={movie.Title}
            className="w-[300px] h-[445px] object-cover rounded-lg shadow-lg mb-4 md:mb-0"
          />
        </div>
        </div>

        {/* DETAILS */}
        <div className="bg-yellow-600 text-black p-6 mt-4 space-y-1">
          <div>
            <p><strong>Released:</strong> {movie.Released}</p>
            <p><strong>Runtime:</strong> {movie.Runtime}</p>
            <p><strong>Genre:</strong> {movie.Genre}</p>
            <p><strong>Director:</strong> {movie.Director}</p>
            <p><strong>Writer:</strong> {movie.Writer}</p>
          </div>
        </div>

          {/* ACTOR BUTTONS */}
          <div className="bg-red-600 text-white p-6 mt-4 space-y-1">
            <p className="font-semibold mb-2">Actors:</p>
            <div className="flex flex-wrap gap-4">
              {actorImages.map((actor) => (
                <div
                  key={actor.name}
                  className="flex flex-col items-center w-24"
                >
                  {actor.img ? (
                    <img
                      src={actor.img}
                      alt={actor.name}
                      className="w-16 h-16 object-cover rounded-full border-2 border-blue-400 shadow-md mb-1"
                    />
                  ) : (
                    <img
                      src="/images/NoImage-64X64.png"
                      alt="No actor"
                      className="w-16 h-16 object-cover rounded-full border-2 border-blue-400 shadow-md mb-1"
                    />
                  )}

                  <button
                    onClick={() =>
                      navigate(`/actor/${encodeURIComponent(actor.name)}`)
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-2 py-1 rounded text-center leading-tight min-h-[4.0rem] w-full break-words"
                  >
                    {actor.name}
                  </button>
                </div>
              ))}
            
          
        </div>
      </div>

      {/* PLOT */}
      <div className="bg-yellow-600 text-black p-6 mt-4 space-y-1">
        <p><strong>Plot:</strong> {movie.Plot}</p>
      </div>

      {/* ADDITIONAL DETAILS */}
      <div className="bg-red-600 text-white p-6 mt-4 space-y-1">
        <p><strong>Rated:</strong> {movie.Rated}</p>
        <p><strong>Language:</strong> {movie.Language}</p>
        <p><strong>Country:</strong> {movie.Country}</p>
        <p><strong>Awards:</strong> {movie.Awards}</p>
        <p><strong>IMDb Rating:</strong> {movie.imdbRating}</p>
        <p><strong>Metascore:</strong> {movie.Metascore}</p>
        <p><strong>DVD:</strong> {movie.DVD}</p>
        <p><strong>Production:</strong> {movie.Production}</p>
      </div>

      {/* BOX OFFICE */}
      <div className="bg-yellow-600 text-black p-6 mt-4 space-y-1">
        <p><strong>Box Office:</strong> {movie.BoxOffice}</p>
      </div>

      {/* TRAILER, title */}  
      <div className="p-6 text-white">
        <h2 className="text-4xl font-bold mb-4">{movie.title}</h2>
      <p>{movie.overview}</p>

      {/* TRAILER, video */}
      <MovieTrailer movieId={movie.imdbID} title={movie.Title} />
      </div>

    </div>
  );
}

export default MovieDetails;