
import express from 'express';
import axios from 'axios';
const app = express();

import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.OMDB_API_KEY;

app.get('/api/movie/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`https://www.omdbapi.com/?apikey=${apiKey}&i=${id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movie data' });
  }
});

app.get('/api/search', async (req, res) => {
  const { query } = req.query;
  try {
    const response = await axios.get(`https://www.omdbapi.com/?apikey=${apiKey}&s=${query}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

export default app;
