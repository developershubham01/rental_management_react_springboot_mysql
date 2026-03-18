/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        ember: "#f97316",
        sand: "#fff6e8",
        fog: "#eef2ff",
        pine: "#0f766e",
      },
      fontFamily: {
        display: ["'Instrument Serif'", "serif"],
        sans: ["'Space Grotesk'", "sans-serif"],
      },
      boxShadow: {
        float: "0 30px 80px rgba(23,32,51,0.16)",
      },
    },
  },
  plugins: [],
};

