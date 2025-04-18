/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4285F4",
        secondary: "#FFFFFF",
        text: "#333333",
        border: "#E0E0E0",
        hover: "#3367D6",
        safe: "#34A853",
        unsafe: "#EA4335",
        background: "#4285F4",
      },
    },
  },
  plugins: [],
};
