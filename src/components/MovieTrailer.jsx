//src/components/MovieTrailer.jsx



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