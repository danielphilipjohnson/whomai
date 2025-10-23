'use client';

import { backgroundOptions, ThemeKey } from '@/lib/backgrounds';
import { useThemeStore } from '@/store/useThemeStore';

interface ThemeSwitcherProps {
  onSelect?: () => void;
}

export const ThemeSwitcher = ({ onSelect }: ThemeSwitcherProps) => {
  const storeTheme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const theme: ThemeKey = backgroundOptions.some(({ key }) => key === storeTheme)
    ? (storeTheme as ThemeKey)
    : 'dark';

  const handleSelect = (key: ThemeKey) => {
    setTheme(key);
    onSelect?.();
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between text-sm text-gray-300">
        <h2 className="text-xs tracking-[0.3em] text-gray-400 uppercase">Environments</h2>
        <span className="text-[10px] text-gray-500 uppercase">{theme} mode</span>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {backgroundOptions.map(({ key, name, image, description }) => {
          const selected = theme === key;
          return (
            <button
              key={key}
              onClick={() => handleSelect(key)}
              className={`group relative overflow-hidden rounded-lg border text-left transition sm:h-full ${
                selected
                  ? 'border-neon-blue shadow-[0_0_18px_rgba(0,240,255,0.3)]'
                  : 'hover:border-neon-purple/70 border-gray-700'
              }`}
            >
              <div className="relative h-24 w-full sm:h-20">
                <img
                  src={image}
                  alt={`${name} background`}
                  sizes="(min-width: 640px) 120px, 200px"
                  className="object-cover transition duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/10 to-black/60" />
                {selected && (
                  <span className="border-neon-blue text-neon-blue absolute top-2 right-2 rounded-full border bg-black/70 px-2 py-0.5 text-[10px] tracking-wide uppercase">
                    Active
                  </span>
                )}
              </div>
              <div className="p-2">
                <p className="text-xs font-semibold text-gray-100">{name}</p>
                <p className="mt-1 text-[10px] text-gray-400">{description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
