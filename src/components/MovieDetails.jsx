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
import MovieTrailer from "./MovieTrailer";
import ScrollToTop from "./ScrollToTop";

//SOUNDS, default onclick for buttons
const clickSound = new Audio('/sounds/bubble.mp3');

//playClickSound();
export const playClickSound = () => {
  const audio = new Audio('/sounds/bubble.mp3');
  audio.currentTime = 0; // start from beginning
  audio.play().catch((err) => console.log('Audio play failed:', err));
};

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

  /*
  // AUTO TEXT-TO-SPEECH: say title + plot
  useEffect(() => {
  const speakMovieDetails = async () => {
    if (!movie || !window.puter?.ai?.txt2speech) return;
    if (hasSpoken.current) return; // ✅ already spoken — skip

    hasSpoken.current = true; // mark as spoken

    try {
      //speaks title first
      const titleAudio = await window.puter.ai.txt2speech(movie.Title, {
        voice: "Joanna",
        engine: "standard", // use "neural" or "standard" if you want faster playback, "generative" for quality
        language: "en-US",
      });
      await titleAudio.play();

      //wait briefly between title and plot
      await new Promise((resolve) => setTimeout(resolve, 1000));

      //speak plot next
      const plotAudio = await window.puter.ai.txt2speech(movie.Plot, {
        voice: "Joanna",
        engine: "standard",
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
*/



//CHECK
console.log("/src/components/MovieDetails loaded");

//NOTES MovieDetails.jsx - link actors 
        //movie.Actors are comma-separated string aka "Tom Hanks, Robin Wright, Gary Sinise" 
        //change f/MovieDetailsActor.jsx to <Link> routes to /actor/:name 

 //LOADING MOVIE DETAILS...
 if (!movie) {
  return (
    <div className="text-white p-6">
      <p>Loading movie details...</p>
    </div>
  );
}

//MOVIE NOT FOUND.
if (movie.Response === "False") {
  return (
    <div className="text-white p-6">
      <p>Movie not found.</p>
    </div>
  );
}






//RETURN
  return (
    <div  className="border-3 border-yellow-500 pb-x mb-20 xbg-red-900 p-20 rounded-md shadow-lg"
      style={{backgroundImage: `url('/images/BG-RED-4Kx4K.jpg')`,}}>

      {/* TITLE */}
      <h2 className="text-yellow-300 text-left text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-cinzel font-bold mb-2 p-0">{movie.Title}</h2>
      <h3 className="text-yellow-300 text-left text-base sm:text-lg md:text-xl lg:text-1xl font-serif font-bold mb-4">{movie.Year} - {movie.Rated} - {movie.Runtime}</h3>


      {/* MAIN SECTION */}
      <div className="flex flex-row flex-wrap gap-6 items-start mt-6 mb-6">

        {/* POSTER */}
        <div className="flex-shrink-0">
          <img
            src={movie.Poster && movie.Poster !== "N/A"
              ? movie.Poster
              : "/images/NoImage-300X445.png"}
            alt={movie.Title}
            className="w-[300px] h-auto object-cover rounded-lg shadow-lg"
          />
        </div>
        
        {/* DETAILS */}
        <div className="text-white flex-1 min-w-[300px] space-y-1 max-w-2xl">
          <p><strong>Title:</strong> {movie.Title}</p>
          <p><strong>Released:</strong> {movie.Released}</p>
          <p><strong>Runtime:</strong> {movie.Runtime}</p>
          <p><strong>Genre:</strong> {movie.Genre}</p>
          <p><strong>Director:</strong> {movie.Director}</p>
          <p><strong>Writer:</strong> {movie.Writer}</p>
        </div>

      </div>

      {/* PLOT */}
      <div className="text-white mt-6 space-y-1 max-w-2xl">
        <p><strong>Plot:</strong> {movie.Plot}</p>
      </div>

      {/* ACTOR BUTTONS */}
      <div className="text-white mt-6 mb-0">
        <p className="font-semibold mb-4">Actors:</p>
        <div className="flex flex-wrap gap-4">
          {actorImages.map((actor) => (
            <button
              key={actor.name}
              onClick={() => {
                playClickSound(); 
                navigate(`/actor/${encodeURIComponent(actor.name)}`)}}
              className="flex flex-col items-center w-24 group hover:scale-120 transition-all duration-300 ease-out"
            >
              <img
                src={actor.img || "/images/NoImage-64X64.png"}
                alt={actor.name}
                className="w-16 h-16 object-cover rounded-full border-2 border-white shadow-md mb-1 transition-all duration-300 ease-out"
              />
              <span className="bg-gradient-to-b from-red-100 from-0% via-red-600 via-40% to-black to-80% group-hover:from-white group-hover:via-red-500 group-hover:to-gray-950 text-white text-sm px-3 py-2 rounded-full text-center leading-tight min-h-[4.5rem] w-full break-words transition-all duration-300 ease-out shadow-[inset_0_6px_10px_rgba(255,255,255,0.7),inset_0_-6px_12px_rgba(0,0,0,0.8),0_4px_10px_rgba(0,0,0,0.4)] flex items-center justify-center border-2 border-red-900/70">
                {actor.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ADDITIONAL DETAILS */}
      <div className="text-white mt-6 space-y-1 max-w-2xl">
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
      <div className="bg-yellow-600 text-black p-6 mt-6 space-y-1 rounded-lg max-w-2xl"
      style={{backgroundImage: `url('/images/BG-YELLOW.jpg')`,}}>
        <p><strong>Box Office:</strong> {movie.BoxOffice}</p>
      </div>

      {/* TRAILER, title */}  
      <div className="text-white mt-6 max-w-2xl">
        <h2 className="text-4xl font-bold mb-4">{movie.title}</h2>
        <p>{movie.overview}</p>

        {/* TRAILER, video */}
        <MovieTrailer movieId={movie.imdbID} title={movie.Title} />
      </div>

        {/* Scroll To Top */}
        <ScrollToTop />
    </div>
  );
}

export default MovieDetails;





/* test full flow in browser npm run dev http://localhost:5173 */

/* 
test full flow in browser

npm run dev

http://localhost:5173

*/