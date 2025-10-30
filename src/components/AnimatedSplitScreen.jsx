//src/components/AnimatedSplitScreen.jsx

import { useState } from "react";

export default function SplitScreen() {
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

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="relative bg-black text-white transition-all duration-1000" style={{ width: leftWidth }}>
        <div className="absolute right-0 w-12 h-48 flex items-center justify-center cursor-pointer bg-white text-black" onClick={expandRight}>
          links
        </div>
        <div className="flex items-center justify-center h-screen">
          LOREM IPSUM DOLOR
        </div>
      </div>
      <div className="relative bg-white text-black transition-all duration-1000" style={{ width: rightWidth }}>
        <div className="absolute left-0 w-12 h-48 flex items-center justify-center cursor-pointer bg-black text-white" onClick={expandLeft}>
          rechts
        </div>
        <div className="flex items-center justify-center h-screen">
          LOREM IPSUM DOLOR
        </div>
      </div>
    </div>
  );
}

/*
// App.jsx
import SplitScreen from "./SplitScreen";

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


https://prismic.io/blog/tailwind-animations
*/