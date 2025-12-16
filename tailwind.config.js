/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#7c3aed",
        secondary: "#06b6d4",
        dark: "#0f172a",
        light: "#f8fafc",
        accent: "#f59e0b"
      }
    },
  },
  plugins: [],
}
