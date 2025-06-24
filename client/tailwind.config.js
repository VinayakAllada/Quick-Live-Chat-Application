/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        // primary : "#051aff",
        primary : "#a7aefc",
        secondary : "#7a85fa",
        ternary : "#7a85fa"
      }
    },
  },
  plugins: [],
}