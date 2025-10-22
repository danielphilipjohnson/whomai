import { useEffect } from 'react';

type ShortcutCallback = () => void;

export const useShortcut = (key: string, metaKey: boolean, callback: ShortcutCallback) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === key.toLowerCase() && event.metaKey === metaKey) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, metaKey, callback]);
};
