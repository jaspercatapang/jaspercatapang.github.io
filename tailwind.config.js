/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
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
        accent: 'rgb(var(--color-accent-rgb) / <alpha-value>)',
        surface: 'var(--color-surface)',
        charcoal: {
          950: '#161616',
          900: '#1e1e1e',
          850: '#242424',
          800: '#2a2a2a',
          700: '#3d3d3d',
          600: '#525252',
        },
      },
      maxWidth: {
        prose: '42rem',
      },
    },
  },
  plugins: [],
}
