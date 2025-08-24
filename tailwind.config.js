/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html", 
    "./js/**/*.js",
    "./*.tpl"
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          text: '#1D212E',
          primary: '#2C2B3C',
          container: '#191C2E',
          bg: '#121420',
        }
      }
    }
  },
  plugins: [],
}

