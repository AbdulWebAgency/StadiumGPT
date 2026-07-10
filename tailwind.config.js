/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fifa: {
          green: {
            DEFAULT: '#006B3F',
            light: '#008F55',
            dark: '#004D2E',
          },
          gold: {
            DEFAULT: '#FFB800',
            light: '#FFD15C',
            dark: '#C79000',
          },
          blue: {
            DEFAULT: '#0A2540',
            light: '#1E4976',
            dark: '#051220',
          },
          red: {
            DEFAULT: '#D1193E',
            light: '#F23B60',
            dark: '#9B0F2A',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        fifa: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
