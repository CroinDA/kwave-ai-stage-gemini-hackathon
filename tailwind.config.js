/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kwave: {
          purple: '#1a0533',
          'purple-mid': '#2d0a5e',
          'purple-light': '#4a1a8f',
          gold: '#f0c040',
          'gold-light': '#f8d860',
          'gold-dark': '#c09020',
          pink: '#e040fb',
          'pink-dark': '#aa00ff',
          dark: '#0a0015',
          'card-bg': '#12002a',
          border: '#3a1060',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #f0c040, 0 0 10px #f0c040' },
          '100%': { boxShadow: '0 0 20px #f0c040, 0 0 40px #f0c040, 0 0 60px #c09020' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

