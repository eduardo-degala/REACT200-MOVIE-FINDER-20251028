//backend/server.js
  //defines Express app (routes, middleware, APIs)
  //does NOT start server, no .listen() file, located on index.js

import express from 'express';  //imports Express framework/library f/HTTP requests/responses 
import axios from 'axios';      //imports Axios library, makes requests to other APIs/servers, fetch/send data
import dotenv from 'dotenv';    //imports dotenv library, loads env var f/.env

dotenv.config();                //activates dotenv, process.env f/APIs

//EXPRESS APP
const app = express();

//OMDB API
const omdbKey = process.env.OMDB_API_KEY;
const OMDB_URL = 'https://www.omdbapi.com';
console.log('npm run dev:backend, terminal, server.js, OMDb API Key:', omdbKey ? 'loaded' : 'missing');

//TMDB API
const tmdbKey = process.env.TMDB_API_KEY;
const TMDB_URL = 'https://api.themoviedb.org/3';
console.log('npm run dev:backend, terminal, server.js, TMDb API Key:', tmdbKey ? 'loaded' : 'missing');

//IMDB API
//fysa, no requirements for key or use, info pulled f/OMDB

//CHECK ROUTE
app.get('/', (req, res) => {
  res.send('Movie API server is running!');
});


//TMDB API (get actor details)

//APP.GET - TMDb Actor Name
app.get('/api/actor/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const tmdbUrl = `https://api.themoviedb.org/3/search/person?api_key=${tmdbKey}&query=${encodeURIComponent(name)}`;
    const response = await axios.get(tmdbUrl);

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching actor data:', error.message);
    res.status(500).json({ error: 'Failed to fetch actor data' });
  }
});

//APP.GET - TMDb Filmography / Combined Credits
app.get('/api/actor/credits/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${TMDB_URL}/person/${id}/combined_credits?api_key=${tmdbKey}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching actor credits:', error.message);
    res.status(500).json({ error: 'Failed to fetch actor credits' });
  }
});

//APP.GET - TMDb External IDs (IMDb, Twitter, Instagram, etc.)
app.get('/api/actor/external/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${TMDB_URL}/person/${id}/external_ids?api_key=${tmdbKey}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching actor external IDs:', error.message);
    res.status(500).json({ error: 'Failed to fetch actor external IDs' });
  }
});

//APP.GET - TMDb Full Movie Details
app.get('/api/movie/details/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${TMDB_URL}/movie/${id}?api_key=${tmdbKey}&append_to_response=credits`);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch movie details' });
  }
});

//APP.GET - TMDb Now Playing (movies)
app.get('/api/movie/now_playing', async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_URL}/movie/now_playing`, {
      params: { api_key: tmdbKey }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching now playing movies:', error.message);
    res.status(500).json({ error: 'Failed to fetch now playing movies' });
  }
});

//APP.GET - TMDb Discover (movies by date range)
app.get('/api/movies/discover', async (req, res) => {
  try {
    const { gte, lte, sort_by = 'primary_release_date.desc' } = req.query;
    const response = await axios.get(`${TMDB_URL}/discover/movie`, {
      params: { api_key: tmdbKey, 'primary_release_date.gte': gte, 'primary_release_date.lte': lte, sort_by },
    });
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch discovered movies' });
  }
});

//APP.GET IMDb -  TMDb Find by IMDb ID — maps IMDb → TMDb internal ID
app.get("/api/find/:imdbId", async (req, res) => {
  try {
    const { imdbId } = req.params;
    const response = await axios.get(
      `${TMDB_URL}/find/${imdbId}?api_key=${tmdbKey}&external_source=imdb_id`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error mapping IMDb → TMDb:", error.message);
    res.status(500).json({ error: "Failed to map IMDb ID to TMDb ID" });
  }
});

//APP.GET - TMDb Trailers (/api/movie/:id/videos) to youtube (search OMDB f/IMDB id to return TMDB movie-id f/youtube key to URL)
app.get("/api/tmdb/movie/:id/videos", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await fetch(
      `${TMDB_URL}/movie/${id}/videos?api_key=${tmdbKey}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching TMDB videos:", error.message);
    res.status(500).json({ error: "Failed to fetch TMDB videos" });
  }
});


//OMDB API (movie details)

//APP.GET - OMDB API ROUTE(S)
app.get('/api/movie/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`${OMDB_URL}/?apikey=${omdbKey}&i=${id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movie data, server.js' });
  }
});

app.get('/api/search', async (req, res) => {
  const { query } = req.query;
  try {
    const response = await axios.get(`${OMDB_URL}/?apikey=${omdbKey}&s=${query}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movies, server.js' });
  }
});


//EXPORT APP
export default app; //exports app as default for index.js to start server





/*
frontend dev server & hot reload = vite

VITE v6.0.7
npm run dev
http://localhost:5173/
*/
