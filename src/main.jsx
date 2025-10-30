//src/main.jsx

import React from 'react';
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'; //React Router, client-side routing, app changes URL w/o refreshing page, UI in sync w/URL
import { StrictMode } from 'react' //catches potential problems early development, development/not production, app quality/spot bugs

import App from './App.jsx'
import { MovieProvider } from './context/MovieContext'; //import provider/context, shared state of movie(s)/search query, lets components in app access/update movie-related data
import './index.css'

//import ReactDOM from 'react-dom/client';
//import { createRoot } from 'react-dom/client'

console.log('main.jsx loaded')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <MovieProvider>
        <App />
      </MovieProvider>
    </BrowserRouter>
  </StrictMode>
);
