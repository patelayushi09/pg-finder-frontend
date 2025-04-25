/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust paths based on your project structure
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        coral: "#D96851",
        gold: "#D8B258",
        cream: "#DCD29F",
        sage: "#759B87",
        deepTeal: "#103538",
        
      },
      transitionProperty: {
        transform: "transform",
      },
      animation: {
        "pulse-soft": "pulse-soft 2s infinite",
      },
      keyframes: {
        "pulse-soft": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.02)" },
          "100%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
