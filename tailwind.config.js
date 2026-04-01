/** @type {import('tailwindcss').Config} */
import { slate, zinc, teal } from "tailwindcss/colors";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        sidebar: {
          DEFAULT: teal[900],
          foreground: slate[50],
        },
        "sidebar-dark": {
          DEFAULT: zinc[900],
          foreground: zinc[50],
        },
      },
    },
  },
  plugins: [],
};
