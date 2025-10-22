import { useState, useEffect, useCallback } from 'react';

interface WindowDimensions {
  width: number;
  height: number;
  x: number;
  y: number;
}

interface UseWindowDimensionsOptions {
  defaultWidth?: number;
  defaultHeight?: number;
  padding?: number;
}

export const useWindowDimensions = ({
  defaultWidth = 600,
  defaultHeight = 400,
  padding = 32,
}: UseWindowDimensionsOptions = {}): WindowDimensions => {
  const calculateDimensions = useCallback((): WindowDimensions => {
    if (typeof window === 'undefined') {
      return { width: defaultWidth, height: defaultHeight, x: 0, y: 0 };
    }

    const maxWidth = window.innerWidth - padding;
    const maxHeight = window.innerHeight - padding;

    const width = Math.min(maxWidth, defaultWidth);
    const height = Math.min(maxHeight, defaultHeight);

    const x = (window.innerWidth - width) / 2;
    const y = (window.innerHeight - height) / 2;

    return { width, height, x, y };
  }, [defaultWidth, defaultHeight, padding]);

  const [dimensions, setDimensions] = useState<WindowDimensions>(calculateDimensions);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setDimensions(calculateDimensions());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateDimensions]);

  return dimensions;
};
