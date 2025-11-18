//src/components/AnimatedSplitScreen.jsx

//splitscreen, has left and right panes, expands on click, has audio, animated title, scrolling carousel, and routes for movie details and new releases

import { useState, useEffect, useRef } from "react";
import { useLocation, Routes, Route } from "react-router-dom";
import AnimatedTitle from './AnimatedTitle';
import SearchBarExpand from "./SearchBarExpand";    //left pane, reqd f/Home.jsx
import Home from "./Home";                          //left pane, black
import MovieDetails from "./MovieDetails";          //OMDB
import MovieDetailsActor from "./MovieDetailsActor";//TMDB
import MovieNewReleases from "./MovieNewReleases";  //TMDB
import AnimatedScrollCarousel from "./AnimatedScrollCarousel";
import WaveSpinner from "./WaveSpinner"; 
import MovieMinimal from "./MovieMinimal";
import { Link } from 'react-router-dom';

//PANE, onclick - wistful
const wistfulSound = new Audio("/sounds/wistful.mp3");

//EXPORT ANIMATED SPLITSCREEN
export default function AnimatedSplitScreen() {
  const [leftWidth, setLeftWidth] = useState("50%");
  const [rightWidth, setRightWidth] = useState("50%");
  const [activePane, setActivePane] = useState(null); //track which pane is expanded, 'left', 'right', or null
  const location = useLocation();
  const [showIntroText, setShowIntroText] = useState(true);

  //AUTOEXPAND, SEARCHBAR TOPBAR
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    
    //EXPAND LEFT PANE, search query or viewing movie/actor details
    if (query && query.trim()) {
      setLeftWidth("100%");
      setRightWidth("0%");
      setActivePane("left");
      setShowIntroText(false); //hide intro text on search
    } else if (location.pathname.startsWith('/movie/') || location.pathname.startsWith('/actor/')) {
      setLeftWidth("100%");
      setRightWidth("0%");
      setActivePane("left");
      setShowIntroText(false); //hide intro text on details pages
    } else {
      setShowIntroText(true);  //show intro text only on initial page
    }
  }, [location.search, location.pathname]);

  //EXPAND LEFT, settings
  const expandLeft = () => {
    wistfulSound.currentTime = 0; //rewind if already playing
    wistfulSound.play().catch(err => console.log("Sound play error:", err));

    setLeftWidth("100%");  //active pane
    setRightWidth("0%");   //inactive pane
    setActivePane("left"); //Home.jsx (search movies function)
  };

  //EXPAND RIGHT, settings
  const expandRight = () => {
    wistfulSound.currentTime = 0; // rewind if already playing
    wistfulSound.play().catch(err => console.log("Sound play error:", err));

    setLeftWidth("0%");     //inactive pane
    setRightWidth("100%");  //active pane
    setActivePane("right"); //MovieNewReleases.jsx (static fetch address, loads content)
  };

//SCROLLING CAROUSEL, data
  const images = [
    "/images/mov-28days.png",
    "/images/mov-scarface.png",
    "/images/mov-amerwere.png",
    "/images/mov-godfather.png",
    "/images/mov-ocean11.png",
    "/images/mov-fightpwr.png",
    "/images/mov-westside.png",
    "/images/mov-pubenemy.png",
    "/images/mov-goodfellas.png",
    "/images/mov-rambo.png",
  ];

  //AUDIO, background music
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.log("Autoplay blocked:", err);
      });
    }
  }, []);








 //RETURN 
  return (

    <div className="flex h-screen overflow-hidden xpt-20">

      {/* AUDIO */}
      {!activePane && (
      <audio
        ref={audioRef}
        src="/sounds/splitscreen.mp3"
        autoPlay
        controls
        xloop
        className="scale-75 fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 
        rounded-3xl border-5 border-red-600 bg-black xbg-opacity-70 shadow-xl p-3"
      />
      )}

      {/* GREEN TITLE (3d effect), links to minimal page (original page) */}
      {!activePane && (
      <div className="absolute top-0 left-0 w-full h-full flex items-start justify-center pointer-events-none z-20">
        <div className="flex space-x-2 mt-40">

        <Link to="/minimal"
        className="pointer-events-auto">

          <div className="flex items-center justify-center leading-none 
          text-green-500 text-9xl text-center font-candy font-bold font-effect-3d 
          xborder border-3d border-20 border-green-500 px-10 py-8 
          bg-transparent xshadow-md rounded-full xanimate-fadeinleft
          hover:border-orange-500 hover:border-10 hover:scale-105">
          MOVIE FINDER</div>
          </Link>
        </div>
      </div>
      )}

      {/* GREEN subTITLE (text info), fade effect */}
      {!activePane && (
      <div className="absolute top-0 left-0 w-full h-full flex items-start justify-center pointer-events-none z-20">
        <div className="flex space-x-2 mt-80">
          <div class="flex items-center justify-center 
          text-black text-2xl font-candy font-normal xfont-effect-3d
          bg-transparent xshadow-md rounded-xl animate-bounce [animation-duration:3s]">
          Click For Minimal</div>
        </div>
      </div>
      )}

      {/* RED, "enter" text */}
      {!activePane && (
      <div className="absolute top-0 left-0 w-full h-full group">
        <p className="absolute top-[35%] left-1/2 transform -translate-x-1/2
        text-center text-red-600 text-8xl font-cinzelx font-bold z-25 cursor-pointer xanimate-pulse">
        Enter</p>

      {/* RED, WaveSpinner wave bars appears on hover */}
      <div className="absolute top-[25%] left-1/2 transform -translate-x-1/2 
      opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
        <WaveSpinner />
      </div>

      {/* RED, hover text */}
        <span className="absolute top-[44%] left-1/2 transform -translate-x-1/2 mt-4
        bg-white text-red-600 text-lg font-bold border border-3 border-red-600 rounded-full px-3 py-1 opacity-0
        transition-opacity duration-300 group-hover:opacity-100 z-30">
        Click a button below to expand a pane.
        </span>
      </div>
      )}

    {/* SCROLLING CAROUSEL, images/posters */}
    {!activePane && (
    <div className="absolute bottom-[5%] left-1/2 transform -translate-x-1/2 w-[90%] z-20">
      <AnimatedScrollCarousel images={images} />
    </div>
  )}



      {/* LEFT PANE, white button */} 
      <div className={`relative bg-black text-white transition-all duration-1000
      ${activePane === "left" ? "overflow-y-auto" : "overflow-hidden"}`}
      style={{ width: leftWidth }}>

        <div
        className={`absolute right-0 top-1/2 w-48 h-48 flex items-center justify-center cursor-pointer
             bg-white text-black font-candy font-bold transition-shadow duration-300 shadow-md 
             hover:shadow-[0_0_30px_20px_rgba(255,0,0,0.95)] hover:scale-105 z-10
             ${activePane ? "w-24 h-24 text-sm text-center" : "w-48 h-48 text-2xl"}`}
        onClick={expandRight}
        >
        New Releases
        </div>
        
        
        {/* LEFT PANE, black background */} 
        <div className="relative min-h-screen p-4 pt-32 overflow-hidden">

{/* MATRIX BACKGROUND VIDEO — ONLY when intro text is shown */}
{activePane === "left" && showIntroText && (
  <video
    className="absolute left-0 w-full h-[calc(100%-200px)] top-1/3 object-fill opacity-40 z-0 pointer-events-none p-20"
    src="/images/BG-MATRIX.mp4"
    autoPlay
    muted
    loop
  />
)}

          {/* UPON EXPANSION, Conditional Rendering */}
          {activePane === "left" ? (
            <>
              <AnimatedTitle
                  containerClassName="flex-shrink-0 p-0 mb-20 h-auto z-20"
                  className="text-5xl sm:text-5xl md:text-7xl lg:text-9xl text-center text-white"
                />

              <SearchBarExpand />

              {/* ROUTES */}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/actor/:name" element={<MovieDetailsActor />} />
              </Routes>



      {showIntroText && (
      <div className="absolute top-[50%] left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center justify-center 
          text-green-500 text-8xl font-candy font-normal xfont-effect-3d
          bg-transparent xshadow-md rounded-xl animate-fadeoutup [animation-duration:3s]">
          SEARCH
        </div>

        <div className="flex items-center justify-center 
          text-green-500 text-7xl font-candy font-normal xfont-effect-3d
          bg-transparent xshadow-md rounded-xl animate-fadeinleft [animation-duration:3s]">
          AND
        </div>

        <div className="flex items-center justify-center 
          text-green-500 text-9xl font-candy font-normal xfont-effect-3d
          bg-transparent xshadow-md rounded-xl animate-fadeout [animation-duration:3s]">
          FIND
        </div>

        <div className="flex items-center justify-center 
          text-green-500 text-7xl font-candy font-normal xfont-effect-3d
          bg-transparent xshadow-md rounded-xl animate-fadeinright [animation-duration:3s]">
          YOUR
        </div>

        <div className="flex items-center justify-center 
          text-green-500 text-9xl font-candy font-normal xfont-effect-3d
          bg-transparent xshadow-md rounded-xl animate-fadeoutdown [animation-duration:3s]">
          MOVIE
        </div>




      </div>
    )}

            </>
          ) : (
          <div className="text-black flex items-center justify-center h-screen text-2xl">
          xxxSEARCH FOR MOVIES</div>)}
        </div>
      </div>



      {/* RIGHT PANE, black button */}
      <div className={`relative bg-white text-black transition-all duration-1000 
      ${activePane === "right" ? "overflow-y-auto" : "overflow-hidden"}`}
      style={{ width: rightWidth }}>
        <div
        className={`absolute left-0 top-1/2 w-48 h-48 flex items-center justify-center cursor-pointer
             bg-black text-white font-candy font-bold transition-shadow duration-300 shadow-lg 
             hover:shadow-[0_0_30px_20px_rgba(255,0,0,0.95)] hover:scale-105 z-10
             ${activePane ? "w-24 h-24 text-sm text-center" : "w-48 h-48 text-2xl"}`}
        onClick={expandLeft}
        >
        Search Movies
        </div>

        {/* RIGHT PANE, white background */} 
        <div className="min-h-screen p-4 pt-32">
          {/* UPON EXPANSION, Conditional Rendering */}
          {activePane === "right" ? (
            <> 
            <AnimatedTitle 
              containerClassName="flex-shrink-0 p-0 mb-20 h-auto z-20"
              text="MOVIE FINDER"
              className="text-5xl sm:text-5xl md:text-7xl lg:text-9xl text-center text-black animate-dimlightGray drop-shadow-md"
            />
            <div className="mt-36">
            <MovieNewReleases />
            </div>
              </>
          ) : (
          <div className="text-white flex items-center justify-center h-screen text-2xl">
          xxxNEW RELEASES</div>)}
        </div>

      </div>

    </div>
  );


}
//keep this curly, end of function





/*
// App.jsx
import AnimatedSplitScreen from "./AnimatedSplitScreen";

function App() {
  return <SplitScreen />;
}

export default App;

src/
 ├─ components/
 │    ├─ SplitScreen.jsx
 │    ├─ LeftPane.jsx
 │    └─ RightPane.jsx
 ├─ App.jsx
 └─ index.jsx


 AnimatedSplitScreen.jsx, layout and animation logic
 LeftPane.jsx, left content
 RightPane.jsx, right content

https://prismic.io/blog/tailwind-animations


*/