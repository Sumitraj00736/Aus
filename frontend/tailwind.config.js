/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        jost: ['Jost', 'sans-serif'],
      },
      colors: {
        brand: {
          green: '#00A859',
          'green-hover': '#008f4c',
          dark: '#1a1a1a',
          gray: '#bbbbbb',
        },
      },
    },
  },
  plugins: [],
}
