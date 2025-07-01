/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'app': ['Inter', 'sans-serif', 'Segoe UI'],
      }
    }
  },
  plugins: [],
};

