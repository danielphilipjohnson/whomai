/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-blue': '#00F0FF',
        'neon-green': '#39FF14',
        'neon-purple': '#BC13FE',
        'neon-red': '#FF073A',
      },
      filter: {
        'neon-glow': 'drop-shadow(0 0 5px #00F0FF) drop-shadow(0 0 10px #00F0FF)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
