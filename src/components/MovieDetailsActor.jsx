//src/components/MovieDetailsActor.jsx


import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


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





  return (
    <div className="p-4 text-white bg-gray-900 min-h-screen">
      <h2 className="text-3xl font-bold mb-4">{actor.name}</h2>

      {/* Profile image */}
      {actor.profile_path ? (
        <img
          src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
          alt={actor.name}
          className="rounded-lg mb-4 shadow-md"
        />
      ) : (
        <div className="w-[300px] h-[450px] bg-gray-700 mb-4" />
      )}

      {/* Actor bio and details */}
      <div className="mb-4">
        {actor.biography && (
          <>
            <h3 className="text-xl font-semibold mb-2">Biography</h3>
            <p className="text-gray-300 mb-2">{actor.biography}</p>
          </>
        )}
        <p><strong>Birthday:</strong> {actor.birthday || 'Unknown'}</p>
        {actor.deathday && <p><strong>Death:</strong> {actor.deathday}</p>}
        <p><strong>Place of Birth:</strong> {actor.place_of_birth || 'Unknown'}</p>
        <p><strong>Gender:</strong> {actor.gender === 1 ? 'Female' : actor.gender === 2 ? 'Male' : 'Other'}</p>
        <p><strong>Popularity:</strong> {actor.popularity}</p>
      </div>

      {/* External links as buttons */}
      {external && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">External Links</h3>
          <div className="flex flex-wrap gap-2">
            {external.imdb_id && (
              <button
                onClick={() => window.open(`https://www.imdb.com/name/${external.imdb_id}`, '_blank')}
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded shadow-md transition"
              >
                IMDb
              </button>
            )}
            {external.instagram_id && (
              <button
                onClick={() => window.open(`https://instagram.com/${external.instagram_id}`, '_blank')}
                className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded shadow-md transition"
              >
                Instagram
              </button>
            )}
            {external.twitter_id && (
              <button
                onClick={() => window.open(`https://twitter.com/${external.twitter_id}`, '_blank')}
                className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded shadow-md transition"
              >
                Twitter / X
              </button>
            )}
            {external.facebook_id && (
              <button
                onClick={() => window.open(`https://facebook.com/${external.facebook_id}`, '_blank')}
                className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded shadow-md transition"
              >
                Facebook
              </button>
            )}
          </div>
        </div>
      )}

      {/* Known for */}
      {actor.known_for && actor.known_for.length > 0 && (
        <>
          <h3 className="text-xl font-semibold mb-2">Known For</h3>
          <div className="flex flex-wrap gap-4">
            {actor.known_for.map((item) => (
              <div key={item.id} className="w-[150px] text-center">
                {item.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w185${item.poster_path}`}
                    alt={item.title || item.name}
                    className="rounded-lg shadow mb-1"
                  />
                ) : (
                  <div className="w-full h-[225px] bg-gray-700 mb-1" />
                )}
                <p className="text-sm">{item.title || item.name}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Full filmography */}
      {credits.length > 0 && (
        <>
          <h3 className="text-xl font-semibold my-3">Filmography</h3>
          <div className="flex flex-wrap gap-4">
            {credits.map((credit) => (
              <div
                key={credit.credit_id}
                onClick={() => handleFilmographyClick(credit.title || credit.name)}
                className="w-[150px] cursor-pointer hover:scale-105 transition-transform"
              >
                {credit.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w185${credit.poster_path}`}
                    alt={credit.title || credit.name}
                    className="rounded-lg shadow mb-1"
                  />
                ) : (
                  <div className="w-full h-[225px] bg-gray-700 mb-1" />
                )}
                <p className="text-sm font-semibold">{credit.title || credit.name}</p>
                <p className="text-xs text-gray-400">{credit.character || credit.job || ''}</p>
              </div>
            ))}
          </div>
        </>
      )}
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