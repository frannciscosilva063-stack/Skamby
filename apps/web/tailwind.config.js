/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2E7D32",
        secondary: "#4CAF50",
        deep: "#1B5E20",
        base: "#F5F5F5"
      }
    }
  },
  plugins: []
};
