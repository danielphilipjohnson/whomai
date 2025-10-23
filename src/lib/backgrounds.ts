export type ThemeKey = 'dark' | 'neon' | 'light';

type BackgroundVariant = {
  id: number;
  name: string;
  image: string;
  gradient: string;
  description: string;
};

export const backgrounds: Record<ThemeKey, BackgroundVariant> = {
  dark: {
    id: 1,
    name: 'Cyberpunk City',
    image: '/whoami/background-image/background-1.jpg',
    gradient: 'from-purple-900/60 to-blue-900/60',
    description: 'Blade Runner skyline bathed in violet haze.',
  },
  neon: {
    id: 2,
    name: 'Neon Grid',
    image: '/whoami//background-image/background-2.webp',
    gradient: 'from-cyan-900/60 to-purple-900/60',
    description: 'Synthwave grid glowing with electric cyan.',
  },
  light: {
    id: 3,
    name: 'Digital Rain',
    image: '/whoami//background-image/background-3.jpg',
    gradient: 'from-green-900/60 to-blue-900/60',
    description: 'Matrix rain cascading over midnight blues.',
  },
};

export const backgroundOptions = (Object.keys(backgrounds) as ThemeKey[]).map((key) => ({
  key,
  ...backgrounds[key],
}));
