//src/components/AnimatedSplitScreen.jsx

import { useState } from "react";

export default function AnimatedSplitScreen() {
  const [leftWidth, setLeftWidth] = useState("50%");
  const [rightWidth, setRightWidth] = useState("50%");

  const expandLeft = () => {
    setLeftWidth("100%");
    setRightWidth("0%");
  };

  const expandRight = () => {
    setLeftWidth("0%");
    setRightWidth("100%");
  };



//before div className="flex h-screen overflow-hidden" / "flex flex-col md:flex-row h-screen overflow-hidden"
  return (
    <div className="flex h-screen overflow-hidden">

      {/* WHITE left, small */}  
      <div className="relative bg-black text-white transition-all duration-1000" style={{ width: leftWidth }}>
        <div className="absolute right-0 top-1/6 w-48 h-48 flex items-center justify-center cursor-pointer bg-white text-black" onClick={expandRight}>
          New Releases
        </div>
        
        {/* BLACK left, large */} 
        <div className="flex items-center justify-center h-screen">
          SEARCH FOR MOVIES
        </div>
      </div>

      {/* BLACK right, small */}
      <div className="relative bg-white text-black transition-all duration-1000" style={{ width: rightWidth }}>
        <div className="absolute left-0 top-1/6 w-48 h-48 flex items-center justify-center cursor-pointer bg-black text-white" onClick={expandLeft}>
          Search Movies
        </div>

        {/* WHITE right, large */} 
        <div className="flex items-center justify-center h-screen">
          NEW RELEASES
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


JUSTINCASE
import { useState } from "react";

export default function AnimatedSplitScreen() {
  const [leftWidth, setLeftWidth] = useState("50%");
  const [rightWidth, setRightWidth] = useState("50%");

  const expandLeft = () => {
    setLeftWidth("100%");
    setRightWidth("0%");
  };

  const expandRight = () => {
    setLeftWidth("0%");
    setRightWidth("100%");
  };



//before div className="flex h-screen overflow-hidden" / "flex flex-col md:flex-row h-screen overflow-hidden"
  return (
    <div className="flex h-screen overflow-hidden">

      {/* WHITE left, small */}  
      <div className="relative bg-black text-white transition-all duration-1000" style={{ width: leftWidth }}>
        <div className="absolute right-0 top-1/6 w-48 h-48 flex items-center justify-center cursor-pointer bg-white text-black" onClick={expandRight}>
          New Releases
        </div>
        
        {/* BLACK left, large */} 
        <div className="flex items-center justify-center h-screen">
          SEARCH FOR MOVIES
        </div>
      </div>

      {/* BLACK right, small */}
      <div className="relative bg-white text-black transition-all duration-1000" style={{ width: rightWidth }}>
        <div className="absolute left-0 top-1/6 w-48 h-48 flex items-center justify-center cursor-pointer bg-black text-white" onClick={expandLeft}>
          Search Movies
        </div>

        {/* WHITE right, large */} 
        <div className="flex items-center justify-center h-screen">
          NEW RELEASES
        </div>
      </div>
    </div>
  );
}






*/