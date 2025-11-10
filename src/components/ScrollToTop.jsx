//src/components/ScrollToTop.jsx

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const scrollContainerRef = useRef(null);

  const scrollToTop = () => {
    console.log("Button clicked!");

    // Play the sound
    const whistleSound = new Audio("/sounds/slide-whistle.mp3");
    whistleSound.currentTime = 0; // rewind if already playing
    whistleSound.play().catch(err => console.log("Sound play error:", err));
    
    // Try to find the scrollable container
    const scrollablePane = document.querySelector('.overflow-y-auto');
    
    if (scrollablePane) {
      console.log("Scrolling pane to top");
      scrollablePane.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      console.log("Scrolling window to top");
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const toggleVisibility = () => {
      // Check scroll position of the pane
      const scrollablePane = document.querySelector('.overflow-y-auto');
      
      if (scrollablePane) {
        const scrollPos = scrollablePane.scrollTop;
        console.log("Pane scroll position:", scrollPos);
        setIsVisible(scrollPos > 300);
      } else {
        const scrollPos = window.pageYOffset;
        console.log("Window scroll position:", scrollPos);
        setIsVisible(scrollPos > 300);
      }
    };

    // Listen to scroll on both window and the scrollable pane
    window.addEventListener("scroll", toggleVisibility);
    
    // Find and listen to the scrollable pane
    const checkForScrollPane = setInterval(() => {
      const scrollablePane = document.querySelector('.overflow-y-auto');
      if (scrollablePane) {
        scrollablePane.addEventListener("scroll", toggleVisibility);
        scrollContainerRef.current = scrollablePane;
        clearInterval(checkForScrollPane);
      }
    }, 100);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener("scroll", toggleVisibility);
      }
      clearInterval(checkForScrollPane);
    };
  }, []);

  const button = (
    <div className="group fixed bottom-20 right-20 z-[9999]">
      <button
        onClick={scrollToTop}
        className="w-20 h-20 rounded-full bg-gradient-to-b from-gray-300 via-gray-100 to-gray-900
          text-black text-5xl font-extrabold cursor-pointer 
          shadow-[inset_0_4px_8px_rgba(255,255,255,0.7),inset_0_-4px_10px_rgba(0,0,0,0.8),0_8px_15px_rgba(0,0,0,0.6)]
          border-4 border-red-600
          hover:scale-110 hover:bg-white
          transition-all duration-300 ease-out"
      >
        ↑
      </button>
      
      <span className="absolute right-full top-1/2 transform -translate-y-1/2 mr-7
  bg-black text-white text-base font-serif font-semibold border-4 border-white rounded px-1 py-1 
  opacity-0 transition-opacity duration-300 group-hover:opacity-100
  whitespace-nowrap pointer-events-none shadow-lg">
  To The Top
</span>
    </div>
  );

  return isVisible ? createPortal(button, document.body) : null;
};

export default ScrollToTop;

/*
ADD TO APP, usually near root of component tree:
<ScrollToTop />

IMPORT:
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <div>
      <YourLongPageContent />
      <ScrollToTop />
    </div>
  );
}
*/


