'use client';
import { useThemeStore } from '@/store/useThemeStore';
import { backgrounds, ThemeKey } from '@/lib/backgrounds';

const DesktopBackground = () => {
  const theme = useThemeStore((state) => state.theme);
  const currentBackground = backgrounds[(theme as ThemeKey) ?? 'dark'] || backgrounds.dark;

  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          backgroundImage: `url('https://danielphilipjohnson.github.io/whomai${currentBackground.image}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${currentBackground.gradient}`} />
      </div>
    </div>
  );
};

export default DesktopBackground;
