/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
      },
      colors: {
        accent: {
          DEFAULT: '#722f37',
          soft: 'rgba(114, 47, 55, 0.12)',
        },
        surface: '#f5f5f5',
      },
      maxWidth: {
        prose: '42rem',
      },
    },
  },
  plugins: [],
}
