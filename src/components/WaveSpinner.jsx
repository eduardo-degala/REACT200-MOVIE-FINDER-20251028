//src/components/WaveSpinner.jsx

import React from "react";
import "../index.css";

export default function WaveSpinner() {
  return (
    <div className="spinner-card xbg-white p-8 rounded-xl xshadow-lg flex flex-col items-center space-y-4">
      <h2 className="font-semibold text-lg">     </h2>

       {/* WAVE BARS - responsive sizing */}
      <div className="flex gap-1 sm:gap-2 md:gap-3 items-center h-16 sm:h-20 md:h-24 lg:h-32">
        <div className="w-1 sm:w-2 md:w-3 lg:w-4 h-full bg-red-600 animate-wave"></div>
        <div className="w-1 sm:w-2 md:w-3 lg:w-4 h-full bg-red-600 animate-wave wave-delay-1"></div>
        <div className="w-1 sm:w-2 md:w-3 lg:w-4 h-full bg-red-600 animate-wave wave-delay-2"></div>
        <div className="w-1 sm:w-2 md:w-3 lg:w-4 h-full bg-red-600 animate-wave wave-delay-3"></div>
        <div className="w-1 sm:w-2 md:w-3 lg:w-4 h-full bg-red-600 animate-wave wave-delay-4"></div>
      </div>
    </div>
  );
}

/*
        <div className="w-1 sm:w-2 md:w-3 lg:w-4 h-full bg-red-600" 
     style={{animation: 'wave 1.2s ease-in-out infinite'}}>
</div>
*/