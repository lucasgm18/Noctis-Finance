/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6E44FF',
          hover: '#5A32E6',
          soft: '#E5DEFF',
          light: '#835FFF',
          dark: '#231942',
          deep: '#2D2054',
        },
        noctis: {
          bg: '#F7F2E7',
          surface: '#EDE5D5',
          card: '#FCF9F2',
          border: '#DFD5C3',
          text: '#231942',
          muted: '#655A7C',
        },
        semantic: {
          income: '#1F9D73',
          incomeSoft: '#E1F7EF',
          expense: '#E0533C',
          expenseSoft: '#FDE8E5',
          warning: '#D97706',
          warningSoft: '#FEF3C7',
        }
      },
      borderRadius: {
        'finwise': '36px',
        'finwise-lg': '40px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(35, 25, 66, 0.06)',
        'float': '0 10px 30px -4px rgba(110, 68, 255, 0.15)',
        'glow': '0 0 25px rgba(110, 68, 255, 0.25)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
