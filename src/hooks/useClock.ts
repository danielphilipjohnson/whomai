import { useEffect, useState } from 'react';

export const useClock = (interval: number = 1000) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), interval);
    return () => clearInterval(timer);
  }, [interval]);

  return now;
};
