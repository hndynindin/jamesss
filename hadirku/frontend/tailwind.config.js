/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkNavy: '#0B1120',
        navySidebar: '#111827',
        navyCard: '#1E293B',
        navyBorder: '#334155',
        electricBlue: '#3B82F6',
        successGreen: '#22C55E',
        warningYellow: '#EAB308',
        dangerRed: '#EF4444'
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
