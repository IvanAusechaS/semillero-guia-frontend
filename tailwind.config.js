/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'heading': ['Poppins', 'Montserrat', 'sans-serif'],
        'body': ['Roboto', 'Open Sans', 'sans-serif'],
        'tech': ['Orbitron', 'monospace'],
      },
      colors: {
        primary: {
          blue: '#3B82F6',
          red: '#EF4444',
          purple: '#8B5CF6',
          50: '#EBF8FF',
          100: '#BEE3F8',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          900: '#1E3A8A',
        },
        secondary: {
          red: '#EF4444',
          purple: '#8B5CF6',
        },
        gradient: {
          from: '#3B82F6',
          via: '#8B5CF6',
          to: '#EF4444',
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #EF4444 100%)',
        'gradient-soft': 'linear-gradient(135deg, #EBF8FF 0%, #F3E8FF 50%, #FEF2F2 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1E3A8A 0%, #581C87 50%, #991B1B 100%)',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}