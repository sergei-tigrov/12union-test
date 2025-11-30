/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f0ff',
          100: '#e0e0ff',
          500: '#6A5ACD',
          600: '#5a4fb8',
          700: '#4a44a3',
        },
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        pink: {
          50: '#fdf2f8',
          100: '#fce7f3',
          600: '#db2777',
          800: '#9d174d',
        },
        green: {
          50: '#f0fdf4',
          100: '#dcfce7',
          600: '#16a34a',
          800: '#166534',
        },
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          600: '#9333ea',
        },
        indigo: {
          50: '#eef2ff',
          100: '#e0e7ff',
          600: '#7c3aed',
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'Raleway', 'Roboto', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
