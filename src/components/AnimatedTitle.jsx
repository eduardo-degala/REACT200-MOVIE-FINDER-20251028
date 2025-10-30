//src/components/AnimatedTitle.jsx

import React from 'react';

export default function AnimatedTitle() {
  return (
    <div className="flex justify-center items-start h-[11vh]">
      <h1 className="text-5xl md:text-7xl xl:text-9xl font-bold animate-dimlight box-reflect text-center">
        MOVIE FINDER
      </h1>
    </div>
  );
}