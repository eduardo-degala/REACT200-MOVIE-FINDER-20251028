//src/components/MovieDetails.jsx
    //page loads w/user clicks on movie in search results
    //uses IMDb id f/URL (like /movie/tt1234567) to fetch full data from OMDb
    //MovieDetails
        //grabs the IMDb ID from the URL (useParams)
        //fetches full movie data using ?i=...&plot=full
        //displays all the fields you requested from OMDb


import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TextToSpeech from "./TextToSpeech";


//MOVIE DETAILS (f/selected movie)
function MovieDetails() {
  const { id } = useParams();                 //get movie ID from URL
  const navigate = useNavigate();             //navigate f/button use MovieDetailsActors

  const [movie, setMovie] = useState(null);   //OMDb API
  const [actors, setActors] = useState([]);   //TMDB API
  const [actorImages, setActorImages] = useState([]);   //TMDB (actor portraits)
  const hasSpoken = useRef(false);            //text to speech, avoid doubling


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

  // AUTO TEXT-TO-SPEECH: say title + plot
  useEffect(() => {
  const speakMovieDetails = async () => {
    if (!movie || !window.puter?.ai?.txt2speech) return;
    if (hasSpoken.current) return; // ✅ already spoken — skip

    hasSpoken.current = true; // mark as spoken

    try {
      // Speak title first
      const titleAudio = await window.puter.ai.txt2speech(movie.Title, {
        voice: "Joanna",
        engine: "generative", // use "neural" or "standard" if you want faster playback
        language: "en-US",
      });
      await titleAudio.play();

      // Wait briefly between title and plot
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Speak plot next
      const plotAudio = await window.puter.ai.txt2speech(movie.Plot, {
        voice: "Joanna",
        engine: "generative",
        language: "en-US",
      });
      await plotAudio.play();
    } catch (err) {
      console.error("Text-to-speech failed:", err);
    }
  };

  if (movie?.Title && movie?.Plot) {
    speakMovieDetails();
  }
}, [movie]);



//CHECK
console.log("/src/components/MovieDetails loaded");

//NOTES //MovieDetails.jsx - link actors 
// //movie.Actors are comma-separated string aka "Tom Hanks, Robin Wright, Gary Sinise" 
// //change f/MovieDetailsActor.jsx to <Link> routes to /actor/:name 


 // ✅ MAIN RENDER

 if (!movie) {
  return (
    <div className="text-white p-6">
      <p>Loading movie details...</p>
    </div>
  );
}

if (movie.Response === "False") {
  return (
    <div className="text-white p-6">
      <p>Movie not found.</p>
    </div>
  );
}

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

    </div>
  );
}

export default MovieDetails; /* test full flow in browser npm run dev http://localhost:5173 */



/* 
test full flow in browser

npm run dev

http://localhost:5173

*/