//src/components/DotsSpinner.jsx

import React from "react";
import "../index.css";

//DOTS SPINNER - for processing...

export default function DotsSpinner() {
  return (
    <div className="flex flex-col items-start justify-center space-y-6 p-4">
      {/* Dots animation */}
      <div className="dots-container flex gap-3">
        <div className="dot bg-purple-500 dark:bg-purple-400"></div>
        <div className="dot bg-purple-500 dark:bg-purple-400"></div>
        <div className="dot bg-purple-500 dark:bg-purple-400"></div>
      </div>

      {/* Button */}
      <button className="px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition duration-300">
        PROCESSING
      </button>
    </div>
  );
}
