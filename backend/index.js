/*backend/index.js*/
  //entry point to START SERVER
    //imports Express app
    //starts server w/ .listen()

/* eslint no-console: "off" */

import server from './server.js';
import dotenv from 'dotenv';

dotenv.config();

//SERVER START
const PORT = process.env.PORT || 5001;

server.listen(PORT, () => console.log(`Server is listening on ${PORT}, index.js`));

/*
lsof -i :5000
kill -9 12345 (PID)

backend=5000
frontend=5173

npm run dev
http://localhost:5173/

apple, cannot be 5000 due to command controlce commplex-main, must be 5001 or alt


REMOVE:  frontend react code, react is browser/client-side, not in Node.js aka server-side

//React Router
//npm install react-router-dom
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

//wrap app in <BrowserRouter>
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
*/