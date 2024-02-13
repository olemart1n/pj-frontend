/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        squareCircle: "squareCircle 1.5s infinite ease",
        switchList: "zIndexWhileMoving 1s ease",
      },
      keyframes: {
        squareCircle: {
          "0%": { aspectRatio: "3/1", borderRadius: "6px" },
          "20%": { aspectRatio: "2/1", borderRadius: "10px" },
          "50%": { aspectRatio: "2/1", borderRadius: "14px" },
          "80%": { aspectRatio: "3/1", borderRadius: "10px" },
          "100%": { aspectRatio: "3/1", borderRadius: "6px" },
        },
        zIndexWhileMoving: {
          "0%": { zIndex: "30" },
          "100%": { zIndex: "0" },
        },
      },
    },
  },
  plugins: [],
};
