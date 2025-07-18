/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
      },
      colors: {
        // Default theme colors
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        noise: 'var(--color-noise)',
        signal: 'var(--color-signal)',
        background: 'var(--color-background)',
        
        // Theme-specific colors
        forest: {
          primary: '#2D6A4F',
          secondary: '#D9A21B',
          noise: '#BC4749',
          signal: '#40916C',
          background: '#F8F9FA',
          'dark-background': '#1B2D2A'
        },
        interstellar: {
          primary: '#6246EA',
          secondary: '#E45858',
          noise: '#FF5470',
          signal: '#3BCEAC',
          background: '#EFF1FA',
          'dark-background': '#232946'
        },
        minimal: {
          primary: '#6366F1',
          secondary: '#F59E0B',
          noise: '#EF4444',
          signal: '#10B981',
          background: '#F9FAFB',
          'dark-background': '#1F2937'
        },
        cyber: {
          primary: '#0EA5E9',
          secondary: '#F43F5E',
          noise: '#FB7185',
          signal: '#14B8A6',
          background: '#F8FAFC',
          'dark-background': '#0F172A'
        }
      },
    },
  },
  plugins: [],
}