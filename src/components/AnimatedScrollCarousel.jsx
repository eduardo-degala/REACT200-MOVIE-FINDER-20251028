//src/components/AnimatedScrollCarousel.jsx

import { useRef } from "react";
import "./ScrollingCarousel.css";

export default function AnimatedScrollCarousel({ images }) {
  const containerRef = useRef(null);

  return (
    <div className="relative w-full h-[300px] bg-transparent group">

      {/* Fading edges */}
      <div className="pointer-events-none absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-black/60 to-transparent z-10" />
      <div className="pointer-events-none absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-black/60 to-transparent z-10" />

      {/* Scroll container */}
      <div
        ref={containerRef}
        className="flex gap-10 animate-scroll items-center group-hover:[animation-play-state:paused]"
      >
        {[...images, ...images].map((src, index) => (
          <div
            key={index}
            className="carousel-item relative flex-shrink-0 w-[180px] h-[270px] transition-transform duration-200 ease-out will-change-transform"
          >
            <img
              src={src}
              alt={`carousel-${index}`}
              className="w-full h-full object-cover rounded-lg border border-red-500 shadow-[0_0_15px_rgba(255,0,0,0.7)] transition-all duration-300"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}