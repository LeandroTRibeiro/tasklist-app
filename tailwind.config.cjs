/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'tb': {'max': '1024px'},
      'mg': {'max': '768px'},
      'ms': {'max': '425px'},
      'mx': {'max': '350px'}
    },
    extend: {},
  },
  plugins: [require("daisyui")],
}
