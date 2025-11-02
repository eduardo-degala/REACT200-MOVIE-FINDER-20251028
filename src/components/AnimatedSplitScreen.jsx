//src/components/AnimatedSplitScreen.jsx

import { useState } from "react";
import SearchBarExpand from "./SearchBarExpand";    //left pane, reqd f/Home.jsx
import Home from "./Home";                          //left pane, black
import MovieNewReleases from "./MovieNewReleases";  //right pane, white

export default function AnimatedSplitScreen() {
  const [leftWidth, setLeftWidth] = useState("50%");
  const [rightWidth, setRightWidth] = useState("50%");

  const [activePane, setActivePane] = useState(null); //track which pane is expanded, 'left', 'right', or null

  const expandLeft = () => {
    setLeftWidth("100%");
    setRightWidth("0%");
    setActivePane("left"); //Home.jsx (search movies function)
  };

  const expandRight = () => {
    setLeftWidth("0%");
    setRightWidth("100%");
    setActivePane("right"); //MovieNewReleases.jsx (static fetch address, loads content)
  };



//before div className="flex h-screen overflow-hidden" / "flex flex-col md:flex-row h-screen overflow-hidden"
  return (
    <div className="flex h-screen overflow-hidden">

      {/* LEFT, black w/white button */}
      {/* WHITE left, small BUTTON */}  
      <div className="relative bg-black text-white transition-all duration-1000" style={{ width: leftWidth }}>
        <div
        className="absolute right-0 top-1/6 w-48 h-48 flex items-center justify-center cursor-pointer
             bg-white text-black transition-shadow duration-300 shadow-md hover:shadow-[0_0_30px_20px_rgba(255,20,147,0.95)] hover:scale-105"
        onClick={expandRight}
        >
        New Releases
        </div>
        
        {/* BLACK left, large */} 
        <div className="flex items-center justify-center h-screen">
          {/* Conditional Rendering */}
          {activePane === "left" ? (
            <>
              <SearchBarExpand />
              <Home />
            </>
          ) : (
            <div className="text-2xl">
            SEARCH FOR MOVIES</div>)}
        </div>
      </div>



      {/* RIGHT, white w/black button */}
      {/* BLACK right, small BUTTON */}
      <div className="relative bg-white text-black transition-all duration-1000" style={{ width: rightWidth }}>
        <div
        className="absolute left-0 top-1/6 w-48 h-48 flex items-center justify-center cursor-pointer
             bg-black text-white transition-shadow duration-300 shadow-lg hover:shadow-[0_0_30px_20px_rgba(255,20,147,0.95)] hover:scale-105"
        onClick={expandLeft}
        >
        Search Movies
        </div>

        {/* WHITE right, large */} 
        <div className="flex items-center justify-center h-screen">
          {/* Conditional Rendering */}
          {activePane === "right" ? <MovieNewReleases /> : <div className="text-2xl">
          NEW RELEASES</div>}
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