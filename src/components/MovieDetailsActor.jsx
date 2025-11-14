//src/components/MovieDetailsActor.jsx


import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ScrollToTop from "./ScrollToTop";

//SOUNDS, default onclick for buttons
const clickSound = new Audio('/sounds/bubble.mp3');
clickSound.preload = 'auto'; //preload, to ensure it is loaded ahead

//playClickSound();
export const playClickSound = () => {
  clickSound.currentTime = 0;
  clickSound.play().catch((err) => console.log('Audio play failed:', err));
};

//ACTOR, fetch movie details on the actor f/TMDb
function MovieDetailsActor() {
  const { name } = useParams();                     //get actor name from URL
  const [actor, setActor] = useState(null);
  const [credits, setCredits] = useState([]);       //filmography
  const [external, setExternal] = useState(null);   //external data
  const navigate = useNavigate();                   
  
  const handleFilmographyClick = (title) => {
    navigate(`/?q=${encodeURIComponent(title)}`);   //browser navigates to / with ?q=MovieTitle, Home.jsx reads query runs handleSearch, returns movie and clickable for MovieDetails
  };


    useEffect(() => {
    const fetchActorData = async () => {
      try {
        //DETAILS, fetch actor details from backend
        const res = await fetch(`/api/actor/${encodeURIComponent(name)}`);
        const data = await res.json();
        const actorInfo = data.results?.[0] || null;
        if (!actorInfo) return;

        setActor(actorInfo);

        //CREDITS, fetch actor credits (filmography)
        const creditsRes = await fetch(`/api/actor/credits/${actorInfo.id}`);
        //const creditsRes = await fetch(`http://localhost:5001/api/actor/credits/${actorInfo.id}`);
        const creditsData = await creditsRes.json();
        setCredits(creditsData.cast || []);

        //EXTERNAL, fetch external IDs (IMDB, social links)
        const externalRes = await fetch(`/api/actor/external/${actorInfo.id}`);
        //const externalRes = await fetch(`http://localhost:5001/api/actor/external/${actorInfo.id}`);
        const externalData = await externalRes.json();
        setExternal(externalData);
      } catch (err) {
        console.error('Error fetching actor info:', err);
      }
    };

    fetchActorData();
  }, [name]);

  //LOADING...
  if (!actor) return <p>Loading actor details...</p>;





  //RETURN (ACTOR DETAILS)
  return (
    <div className="border-3 border-yellow-500 pb-x mb-20 p-20 rounded-md shadow-lg"
      style={{backgroundImage: `url('/images/BG-RED-4Kx4K.jpg')`}}>

      {/* TITLE - Actor Name */}
      <h2 className="text-yellow-300 text-left text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-cinzel font-bold mb-2 p-0">
        {actor.name}
      </h2>
      
      {/* SUBTITLE - Basic Info */}
      <h3 className="text-yellow-300 text-left text-base sm:text-lg md:text-xl lg:text-1xl font-serif font-bold mb-4">
        {actor.birthday || 'Unknown'} - {actor.known_for_department || 'Actor'}
      </h3>

      {/* MAIN SECTION - Profile & Bio */}
      <div className="flex flex-row flex-wrap gap-6 items-start mt-6 mb-6">

        {/* PROFILE IMAGE */}
        <div className="flex-shrink-0">
          <img
            src={actor.profile_path 
              ? `https://image.tmdb.org/t/p/w300${actor.profile_path}` 
              : "/images/NoImage-300X445.png"}
            alt={actor.name}
            className="w-[300px] h-[450px] object-cover rounded-lg shadow-lg"
          />
        </div>
        
        {/* DETAILS */}
        <div className="text-white flex-1 min-w-[300px] space-y-1 max-w-2xl">
          <p><strong>Birthday:</strong> {actor.birthday || 'Unknown'}</p>
          {actor.deathday && <p><strong>Death:</strong> {actor.deathday}</p>}
          <p><strong>Place of Birth:</strong> {actor.place_of_birth || 'Unknown'}</p>
          <p><strong>Gender:</strong> {actor.gender === 1 ? 'Female' : actor.gender === 2 ? 'Male' : 'Other'}</p>
          <p><strong>Known For:</strong> {actor.known_for_department || 'Acting'}</p>
          <p><strong>Popularity:</strong> {actor.popularity}</p>
        </div>

      </div>

      {/* BIOGRAPHY */}
      {actor.biography && (
        <div className="text-white mt-6 space-y-1 max-w-2xl">
          <p><strong>Biography:</strong> {actor.biography}</p>
        </div>
      )}

      {/* EXTERNAL LINKS - Candy/Gradient Style Buttons */}
      {external && (
        <div className="text-white mt-6 mb-0">
          <p className="font-semibold mb-4">External Links:</p>
          <div className="flex flex-wrap gap-4">
            {external.imdb_id && (
              <button
                onClick={() => {
                  playClickSound();
                  window.open(`https://www.imdb.com/name/${external.imdb_id}`, '_blank');}}
                className="group hover:scale-110 transition-all duration-300 ease-out"
              >
                <span className="bg-gradient-to-b from-yellow-200 from-0% via-yellow-500 via-40% to-yellow-900 to-80% group-hover:from-yellow-100 group-hover:via-yellow-400 group-hover:to-yellow-800 text-black text-sm px-6 py-3 rounded-full text-center font-bold transition-all duration-300 ease-out shadow-[inset_0_6px_10px_rgba(255,255,255,0.7),inset_0_-6px_12px_rgba(0,0,0,0.8),0_4px_10px_rgba(0,0,0,0.4)] flex items-center justify-center border-2 border-yellow-900/70">
                  IMDb
                </span>
              </button>
            )}
            {external.instagram_id && (
              <button
                onClick={() => {
                  playClickSound();
                  window.open(`https://instagram.com/${external.instagram_id}`, '_blank');}}
                className="group hover:scale-110 transition-all duration-300 ease-out"
              >
                <span className="bg-gradient-to-b from-pink-200 from-0% via-pink-500 via-40% to-pink-900 to-80% group-hover:from-pink-100 group-hover:via-pink-400 group-hover:to-pink-800 text-white text-sm px-6 py-3 rounded-full text-center font-bold transition-all duration-300 ease-out shadow-[inset_0_6px_10px_rgba(255,255,255,0.7),inset_0_-6px_12px_rgba(0,0,0,0.8),0_4px_10px_rgba(0,0,0,0.4)] flex items-center justify-center border-2 border-pink-900/70">
                  Instagram
                </span>
              </button>
            )}
            {external.twitter_id && (
              <button
                onClick={() => {
                  playClickSound();
                  window.open(`https://twitter.com/${external.twitter_id}`, '_blank');}}
                className="group hover:scale-110 transition-all duration-300 ease-out"
              >
                <span className="bg-gradient-to-b from-sky-200 from-0% via-sky-500 via-40% to-sky-900 to-80% group-hover:from-sky-100 group-hover:via-sky-400 group-hover:to-sky-800 text-white text-sm px-6 py-3 rounded-full text-center font-bold transition-all duration-300 ease-out shadow-[inset_0_6px_10px_rgba(255,255,255,0.7),inset_0_-6px_12px_rgba(0,0,0,0.8),0_4px_10px_rgba(0,0,0,0.4)] flex items-center justify-center border-2 border-sky-900/70">
                  Twitter / X
                </span>
              </button>
            )}
            {external.facebook_id && (
              <button
                onClick={() => {
                  playClickSound();
                  window.open(`https://facebook.com/${external.facebook_id}`, '_blank');}}
                className="group hover:scale-110 transition-all duration-300 ease-out"
              >
                <span className="bg-gradient-to-b from-blue-200 from-0% via-blue-600 via-40% to-blue-950 to-80% group-hover:from-blue-100 group-hover:via-blue-500 group-hover:to-blue-900 text-white text-sm px-6 py-3 rounded-full text-center font-bold transition-all duration-300 ease-out shadow-[inset_0_6px_10px_rgba(255,255,255,0.7),inset_0_-6px_12px_rgba(0,0,0,0.8),0_4px_10px_rgba(0,0,0,0.4)] flex items-center justify-center border-2 border-blue-950/70">
                  Facebook
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* KNOWN FOR, hover red border w/note */}
      {actor.known_for && actor.known_for.length > 0 && (
        <div className="text-white mt-8">
          <p className="font-semibold mb-4 text-xl">Known For:</p>
          <div className="flex flex-wrap gap-4">
            {actor.known_for.map((item) => (
              <div key={item.id} className="relative group inline-block">
              <button
                key={item.id}
                onClick={() => {
                  playClickSound();
                  handleFilmographyClick(item.title || item.name);}}
                className="w-[150px] cursor-pointer hover:scale-105 hover:border-3 hover:border-red-600 transition-transform duration-300 ease-out"
              >
                {item.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w185${item.poster_path}`}
                    alt={item.title || item.name}
                    className="rounded-lg shadow-lg mb-2 w-full h-[225px] object-cover"
                  />
                ) : (
                  <div className="w-full h-[225px] bg-gray-700 rounded-lg mb-2 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No Image</span>
                  </div>
                )}
                <p className="text-sm text-center text-white">{item.title || item.name}</p>
              </button>

          <span
            className="absolute top-0 left-0 right-0 mx-auto w-fit mb-2 
              bg-white text-red-600 text-center text-sm font-serif font-semibold border border-red-600 rounded px-3 py-1 
              opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-1 z-30 whitespace-nowrap pointer-events-none">
            Artist Legacy!
          </span>
              </div>  
            ))}
          </div>
        </div>
      )}

      {/* FULL FILMOGRAPHY, hover white border */}
      {credits.length > 0 && (
        <div className="text-white mt-8">
          <p className="font-semibold mb-4 text-xl">Filmography:</p>
          <div className="flex flex-wrap gap-4">
            {credits.map((credit) => (
              <button
                key={credit.credit_id}
                onClick={() => {
                  playClickSound();
                  handleFilmographyClick(credit.title || credit.name);}}
                className="w-[150px] cursor-pointer hover:scale-105 hover:border-3 hover:border-white transition-transform duration-300 ease-out"
              >
                {credit.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w185${credit.poster_path}`}
                    alt={credit.title || credit.name}
                    className="rounded-lg shadow-lg mb-2 w-full h-[225px] object-cover"
                  />
                ) : (
                  <div className="w-full h-[225px] bg-gray-700 rounded-lg mb-2 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No Image</span>
                  </div>
                )}
                <p className="text-sm font-semibold text-center text-white">{credit.title || credit.name}</p>
                <p className="text-xs text-gray-400 text-center">{credit.character || credit.job || ''}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* END NAME, extra for contrast yellow BG (prior placeholder detail) */}
      <div className="bg-yellow-600 text-black text-3xl font-cinzel font-bold p-6 mt-8 space-y-1 rounded-lg max-w-2xl"
      style={{backgroundImage: `url('/images/BG-YELLOW.jpg')`,}}>
        <p><strong>End Filmography:</strong> {actor.name}</p>
      </div>


      {/* Scroll To Top */}
      <ScrollToTop />
    </div>





  );
}

export default MovieDetailsActor;

/*
TMDb API:  The Movie Database
https://developer.themoviedb.org/docs/getting-started

https://developer.themoviedb.org/reference/configuration-details


GOAL FLOW...
/movie/:id  (MovieDetails)
   ↓
click actor name → /actor/:actorName
   ↓
/actor/:actorName (MovieDetailsActor)
   → fetch from your backend /api/actor/:name
   → show TMDb profile info, photo, known-for, etc.

FILMOGRAPHY
GET https://api.themoviedb.org/3/person/{person_id}/combined_credits?api_key=TMDB_KEY&language=en-US

EXTERNAL IDs
GET https://api.themoviedb.org/3/person/{person_id}/external_ids?api_key=TMDB_KEY



*/