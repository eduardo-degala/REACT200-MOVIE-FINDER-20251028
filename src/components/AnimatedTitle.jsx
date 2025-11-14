//src/components/AnimatedTitle.jsx

import React from 'react';                      //imports React, create components w/JSX
import { useNavigate } from 'react-router-dom'; //imports hook f/React, allows component navigation to another route/page in app

export default function AnimatedTitle({
  text = "MOVIE FINDER",    //allows edit text
  className = "",           //allows style changes
  containerClassName = "",  //allows outer container changes
}) {

  const navigate = useNavigate();

  const handleClick = () => {
    window.location.href = '/'; //full reload to home
  };


//RETURN
  return (
    <div className={`flex justify-center items-start h-auto p-0 mb-0 ${containerClassName}`}>
      <h1
        onClick={handleClick}
        className={`text-6xl .md:text-7xl .xl:text-9xl font-bold animate-dimlight box-reflect text-center 
          cursor-pointer select-none
          transition-all duration-300 
          hover:text-red-500 hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(255,255,255,1.0)]
          active:scale-95
          ${className}`}
      >
        {text}
      </h1>
    </div>
  );
}

/*
CENTER PAGE VERSION
import React from 'react';

export default function AnimatedTitle() {
  return (
    <div className="flex justify-center items-start h-[11vh] p-6 mb-6">
      <h1 className="text-6xl .md:text-7xl .xl:text-9xl font-bold animate-dimlight box-reflect text-center">
        MOVIE FINDER
      </h1>
    </div>
  );
}

(index):64 cdn.tailwindcss.com should not be used in production. 
To use Tailwind CSS in production, install it as a PostCSS plugin 
or use the Tailwind CLI: https://tailwindcss.com/docs/installation
*/