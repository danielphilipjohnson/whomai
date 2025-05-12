'use client'
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const backgrounds = [
  {
    id: 1,
    name: 'Cyberpunk City',
    image: '/whomai/background-image/background-1.jpg',
    gradient: 'from-purple-900/60 to-blue-900/60'
  },
  {
    id: 2,
    name: 'Neon Grid',
    image: '/whomai/background-image/background-2.webp',
    gradient: 'from-cyan-900/60 to-purple-900/60'
  },
  {
    id: 3,
    name: 'Digital Rain',
    image: '/whomai/background-image/background-3.jpg',
    gradient: 'from-green-900/60 to-blue-900/60'
  }
];

const DesktopBackground = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentBackground = backgrounds[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? backgrounds.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === backgrounds.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          backgroundImage: `url('${currentBackground.image}')`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${currentBackground.gradient}`}
        />

      </div>

      <div className="absolute bottom-10 right-4 hidden md:flex items-center gap-2 z-30">
        <button
          onClick={handlePrevious}
          className="p-2 rounded-full bg-black/30 backdrop-blur-sm border border-gray-700 text-gray-400 hover:text-cyan-400 hover:border-cyan-500 transition-all duration-300"
          aria-label="Previous background"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="px-3 py-1 rounded-md bg-black/30 backdrop-blur-sm border border-gray-700 text-gray-400 font-mono text-sm">
          {currentBackground.name}
        </span>
        <button
          onClick={handleNext}
          className="p-2 rounded-full bg-black/30 backdrop-blur-sm border border-gray-700 text-gray-400 hover:text-cyan-400 hover:border-cyan-500 transition-all duration-300"
          aria-label="Next background"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default DesktopBackground; 