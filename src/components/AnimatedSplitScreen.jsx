//src/components/AnimatedSplitScreen.jsx

import { useState, useEffect } from "react";
import { useLocation, Routes, Route } from "react-router-dom";
import AnimatedTitle from './AnimatedTitle';
import SearchBarExpand from "./SearchBarExpand";    //left pane, reqd f/Home.jsx
import Home from "./Home";                          //left pane, black
import MovieDetails from "./MovieDetails";
import MovieDetailsActor from "./MovieDetailsActor";
import MovieNewReleases from "./MovieNewReleases";  //right pane, white

//EXPORT ANIMATED SPLITSCREEN
export default function AnimatedSplitScreen() {
  const [leftWidth, setLeftWidth] = useState("50%");
  const [rightWidth, setRightWidth] = useState("50%");
  const [activePane, setActivePane] = useState(null); //track which pane is expanded, 'left', 'right', or null
  const location = useLocation();

  //AUTOEXPAND, SEARCHBAR TOPBAR
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    
    //EXPAND LEFT PANE, search query or viewing movie/actor details
    if (query && query.trim()) {
      setLeftWidth("100%");
      setRightWidth("0%");
      setActivePane("left");
    } else if (location.pathname.startsWith('/movie/') || location.pathname.startsWith('/actor/')) {
      setLeftWidth("100%");
      setRightWidth("0%");
      setActivePane("left");
    }
  }, [location.search, location.pathname]);

  //EXPAND LEFT, settings
  const expandLeft = () => {
    setLeftWidth("100%");
    setRightWidth("0%");
    setActivePane("left"); //Home.jsx (search movies function)
  };

  //EXPAND RIGHT, settings
  const expandRight = () => {
    setLeftWidth("0%");
    setRightWidth("100%");
    setActivePane("right"); //MovieNewReleases.jsx (static fetch address, loads content)
  };



 //RETURN 
  return (
    <div className="flex h-screen overflow-hidden xpt-20">

      {/* LEFT PANE, black w/white button */}
      {/* WHITE BUTTON left, small BUTTON */}  
      <div className={`relative bg-black text-white transition-all duration-1000
      ${activePane === "left" ? "overflow-y-auto" : "overflow-hidden"}`}
      style={{ width: leftWidth }}>
        <div
        className={`absolute right-0 top-1/2 w-48 h-48 flex items-center justify-center cursor-pointer
             bg-white text-black font-bold transition-shadow duration-300 shadow-md 
             hover:shadow-[0_0_30px_20px_rgba(255,20,147,0.95)] hover:scale-105 z-10
             ${activePane ? "w-24 h-24 text-sm text-center" : "w-48 h-48 text-lg"}`}
        onClick={expandRight}
        >
        New Releases
        </div>
        
        {/* BLACK left, large */} 
        <div className="min-h-screen p-4 pt-32">
          {/* Conditional Rendering */}
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
            </>
          ) : (
          <div className="flex items-center justify-center h-screen text-2xl">
          SEARCH FOR MOVIES</div>)}
        </div>
      </div>



      {/* RIGHT PANE, white w/black button */}
      {/* BLACK BUTTON right, small BUTTON */}
      <div className={`relative bg-white text-black transition-all duration-1000 
      ${activePane === "right" ? "overflow-y-auto" : "overflow-hidden"}`}
      style={{ width: rightWidth }}>
        <div
        className={`absolute left-0 top-1/2 w-48 h-48 flex items-center justify-center cursor-pointer
             bg-black text-white font-bold transition-shadow duration-300 shadow-lg 
             hover:shadow-[0_0_30px_20px_rgba(255,20,147,0.95)] hover:scale-105 z-10
             ${activePane ? "w-24 h-24 text-sm text-center" : "w-48 h-48 text-lg"}`}
        onClick={expandLeft}
        >
        Search Movies
        </div>

        {/* WHITE right, large */} 
        <div className="min-h-screen p-4 pt-32">
          {/* Conditional Rendering */}
          {activePane === "right" ? (
            <MovieNewReleases />
          ) : (
          <div className="flex items-center justify-center h-screen text-2xl">
          NEW RELEASES</div>)}
        </div>

      </div>

    </div>
  );
}





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