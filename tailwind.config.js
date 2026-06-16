/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f172a",
        card: "#1e293b",
        border: "#334155",
        accent: "#06b6d4",
        secondary: "#94a3b8",
      },
      fontFamily: {
        mono: ['"Fira Code"', '"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
