//src/components/MovieTrailer.jsx

import { useEffect, useState } from "react";

function MovieTrailer({ movieId, title }) {
  const [tmdbId, setTmdbId] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Step 1: Convert IMDb ID → TMDB ID
  useEffect(() => {
    const fetchTmdbId = async () => {
      try {
        setLoading(true);
        setError(null);

        // call backend proxy for find by IMDb
        const res = await fetch(`/api/find/${movieId}`);
        if (!res.ok) throw new Error(`TMDB find failed: ${res.status}`);
        const data = await res.json();

        // Extract TMDB ID
        const tmdbMovie = data.movie_results?.[0];
        if (tmdbMovie?.id) {
          setTmdbId(tmdbMovie.id);
        } else {
          throw new Error("No TMDB match found for IMDb ID");
        }
      } catch (err) {
        console.error("Failed to map IMDb → TMDB:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (movieId) fetchTmdbId();
  }, [movieId]);

  // Step 2: Fetch trailer videos using TMDB ID
  useEffect(() => {
    const fetchTrailer = async () => {
      if (!tmdbId) return;

      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/tmdb/movie/${tmdbId}/videos`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // Filter for YouTube trailer
        const trailer =
          data.results?.find(
            (v) =>
              v.type === "Trailer" &&
              v.site === "YouTube" &&
              /official/i.test(v.name)
          ) ||
          data.results?.find((v) => v.site === "YouTube");

        setTrailerKey(trailer?.key || null);
      } catch (err) {
        console.error("Error fetching trailer:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrailer();
  }, [tmdbId]);

  // UI
  if (loading) return <p>Loading trailer...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!trailerKey)
    return (
      <p>
        No trailer found for <strong>{title}</strong>.
      </p>
    );

  return (
    <div className="my-6">
      <h3 className="text-xl font-bold mb-4 text-red-600 text-left">
        Trailer: {title}
      </h3>
      <div className="aspect-w-16 aspect-h-9 rounded-md border border-5 border-red-600">
        <iframe
          src={`https://www.youtube.com/embed/${trailerKey}`}
          title={`${title} Trailer`}
          allowFullScreen
          className="w-full h-96 rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
}

export default MovieTrailer;

/*
How to use the TMDB API for trailers
    Get an API key: Sign up for a free API key from the TMDB website. 
    Find a movie's ID: Use the API to search for the movie and get its unique ID. 
    Request video data: 
        Use the GET /movie/{movie_id}/videos endpoint with your API key to get a list of all videos associated with that movie. 

Example URL: https://api.themoviedb.org/3/movie/{movie_id}/videos?api_key=YOUR_API_KEY 
    Filter for the trailer: The API response will include a list of videos. You can filter this list to find the trailer by looking for a video with a type of "trailer" and a relevant name (e.g., "Official Trailer"). 
    Get the YouTube embed URL: Once you have the key for the trailer from the API response, you can construct a YouTube embed URL to display the video. 

Example URL: https://www.youtube.com/embed/{trailer_key} 

*/