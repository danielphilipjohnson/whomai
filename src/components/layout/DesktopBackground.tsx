'use client'
import React from 'react';
import { useThemeStore } from '@/store/useThemeStore';

const backgrounds = {
  dark: {
    id: 1,
    name: 'Cyberpunk City',
    image: '/background-image/background-1.jpg',
    gradient: 'from-purple-900/60 to-blue-900/60'
  },
  neon: {
    id: 2,
    name: 'Neon Grid',
    image: '/background-image/background-2.webp',
    gradient: 'from-cyan-900/60 to-purple-900/60'
  },
  light: {
    id: 3,
    name: 'Digital Rain',
    image: '/background-image/background-3.jpg',
    gradient: 'from-green-900/60 to-blue-900/60'
  }
};

const DesktopBackground = () => {
  const theme = useThemeStore((state) => state.theme);
  const currentBackground = backgrounds[theme as keyof typeof backgrounds] || backgrounds.dark;

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
    </div>
  );
};

export default DesktopBackground;