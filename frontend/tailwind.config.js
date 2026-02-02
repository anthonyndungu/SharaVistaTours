/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🔵 Sharavista Navy Blue
        navy: {
          DEFAULT: '#003d82',
          50: '#f0f5fb',
          100: '#e0ebf7',
          200: '#c1d9f0',
          300: '#92bce7',
          400: '#639fd9',
          500: '#347fc9',
          600: '#2a66a1',
          700: '#204d78',
          800: '#163450',
          900: '#0c1b28',
        },
        // 🟠 Orange for CTAs
        orange: {
          DEFAULT: '#FF8C00',
          50: '#fff9f0',
          100: '#ffefd6',
          200: '#ffd6ad',
          300: '#ffbd85',
          400: '#ffa45c',
          500: '#FF8C00',
          600: '#cc7000',
          700: '#995400',
          800: '#663800',
          900: '#331c00',
        },
        // 🟢 Green for success
        green: {
          DEFAULT: '#00D600',
          50: '#f0fff0',
          100: '#e0ffe0',
          200: '#c0ffc0',
          300: '#a0ff80',
          400: '#80ff40',
          500: '#00D600',
          600: '#00a800',
          700: '#007a00',
          800: '#004c00',
          900: '#002600',
        }
      }
    }
  },
  plugins: []
}