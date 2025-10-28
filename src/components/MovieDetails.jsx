//src/components/MovieDetails.jsx
    //page loads w/user clicks on movie in search results
    //uses IMDb id f/URL (like /movie/tt1234567) to fetch full data from OMDb
    //MovieDetails
        //grabs the IMDb ID from the URL (useParams)
        //fetches full movie data using ?i=...&plot=full
        //displays all the fields you requested from OMDb


import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


//MOVIE DETAILS (f/selected movie)
function MovieDetails() {
  const { id } = useParams();                 //get movie ID from URL
  const navigate = useNavigate();             //navigate f/button use MovieDetailsActors

  const [movie, setMovie] = useState(null);   //OMDb API
  const [actors, setActors] = useState([]);   //TMDB API
  const [actorImages, setActorImages] = useState([]);   //TMDB (actor portraits)


  //DETAILS, fetch movie details f/OMDb
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const res = await fetch(`/api/movie/${id}`);
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        console.error('Failed to fetch movie details:', err);
      }
    };

    fetchMovieDetails();
  }, [id]);


  //ACTOR IMAGE, fetch TMDb actor images after movie loads
  useEffect(() => {
    const fetchActorImages = async () => {
      if (!movie?.Actors) return;

      const actorNames = movie.Actors.split(',').map(a => a.trim());
      const results = await Promise.all(
        actorNames.map(async (name) => {
          try {
            const res = await fetch(`/api/actor/${encodeURIComponent(name)}`);
            const data = await res.json();
            const actorInfo = data.results?.[0];
            return {
              name,
              img: actorInfo?.profile_path
                ? `https://image.tmdb.org/t/p/w185${actorInfo.profile_path}`
                : null,
            };
          } catch {
            return { name, img: null };
          }
        })
      );
      setActorImages(results);
    };

    fetchActorImages();
  }, [movie]);

//ERRORS 
if (!movie) return <p>Loading...</p>;
if (movie.Response === 'False') return <p>Movie not found.</p>;
console.log('/src/components/MovieDetails loaded')



  //NOTES
    //MovieDetails.jsx - link actors
    //movie.Actors are comma-separated string aka "Tom Hanks, Robin Wright, Gary Sinise"
    //change f/MovieDetailsActor.jsx to <Link> routes to /actor/:name

  return (
    <div className="space-y-4 text-white bg-gray-900 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">{movie.Title} ({movie.Year})</h2>

      <img src={movie.Poster} alt={movie.Title} className="my-4 rounded-lg shadow-lg" />

      <p><strong>Released:</strong> {movie.Released}</p>
      <p><strong>Runtime:</strong> {movie.Runtime}</p>
      <p><strong>Genre:</strong> {movie.Genre}</p>
      <p><strong>Director:</strong> {movie.Director}</p>
      <p><strong>Writer:</strong> {movie.Writer}</p>

      <div>
        <p className="font-semibold mb-2">Actors:</p>
        <div className="flex flex-wrap gap-4">
          {actorImages.map((actor) => (
            <div key={actor.name} className="flex flex-col items-center w-24">
              {actor.img ? (
                <img
                  src={actor.img}
                  alt={actor.name}
                  className="w-16 h-16 object-cover rounded-full border-2 border-blue-400 shadow-md mb-1"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-700 rounded-full mb-1 flex items-center justify-center text-xs text-gray-300">
                  N/A
                </div>
              )}
              <button
                onClick={() => navigate(`/actor/${encodeURIComponent(actor.name)}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-2 py-1 rounded text-center leading-tight min-h-[4.0rem] w-full break-words"
              >
                {actor.name}
              </button>
            </div>
          ))}
        </div>
      </div>

    <div className="mt-4 space-y-1">
      <p><strong>Plot:</strong> {movie.Plot}</p>
      <p><strong>Rated:</strong> {movie.Rated}</p>
      <p><strong>Language:</strong> {movie.Language}</p>
      <p><strong>Country:</strong> {movie.Country}</p>
      <p><strong>Awards:</strong> {movie.Awards}</p>
      <p><strong>IMDb Rating:</strong> {movie.imdbRating}</p>
      <p><strong>Metascore:</strong> {movie.Metascore}</p>
      <p><strong>DVD:</strong> {movie.DVD}</p>
      <p><strong>Box Office:</strong> {movie.BoxOffice}</p>
      <p><strong>Production:</strong> {movie.Production}</p>
      
      </div>
    </div>
  );
}

export default MovieDetails;

/* 
test full flow in browser

npm run dev

http://localhost:5173

*/