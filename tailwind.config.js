/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        abb: {
          red: '#FF000D',
          'red-dark': '#CC000A',
        }
      }
    },
  },
  plugins: [],
};