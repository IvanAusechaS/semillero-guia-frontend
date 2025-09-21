/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Tipografía institucional según especificaciones
        'heading': ['Open Sans', 'Roboto', 'Lato', 'sans-serif'], // Sans-serif moderna para encabezados
        'body': ['Open Sans', 'Roboto', 'Lato', 'sans-serif'],    // Misma fuente para consistencia
        'institutional': ['Open Sans', 'sans-serif'],              // Fuente institucional principal
      },
      colors: {
        // Colores institucionales de la universidad
        institutional: {
          red: '#B40000',      // Rojo institucional principal
          white: '#FFFFFF',    // Blanco puro
          lightGray: '#F5F5F5', // Gris claro para fondos
          mediumGray: '#666666', // Gris medio para texto secundario
          black: '#000000',    // Negro para encabezados
          blue: '#003366',     // Azul oscuro para enlaces
        },
        primary: {
          // Mantener estructura de primary pero con colores institucionales
          50: '#FEF2F2',       // Muy claro del rojo institucional
          100: '#FEE2E2',      // Claro del rojo institucional
          200: '#FECACA',      // Medio claro
          300: '#FCA5A5',      // Medio
          400: '#F87171',      // Medio oscuro
          500: '#B40000',      // Rojo institucional (color principal)
          600: '#A30000',      // Más oscuro
          700: '#920000',      // Oscuro
          800: '#7F0000',      // Muy oscuro
          900: '#6B0000',      // Muy muy oscuro
        },
        secondary: {
          // Azul institucional para enlaces y elementos secundarios
          50: '#F0F8FF',       // Muy claro del azul
          100: '#E0F2FE',      // Claro del azul
          200: '#BAE6FD',      // Medio claro
          300: '#7DD3FC',      // Medio
          400: '#38BDF8',      // Medio oscuro
          500: '#003366',      // Azul institucional (color principal)
          600: '#002A55',      // Más oscuro
          700: '#002244',      // Oscuro
          800: '#001A33',      // Muy oscuro
          900: '#001122',      // Muy muy oscuro
        },
        accent: {
          // Grises institucionales
          light: '#F5F5F5',    // Gris claro para fondos
          medium: '#666666',   // Gris medio para texto secundario
          dark: '#333333',     // Gris oscuro
        },
        // Mantener algunos colores originales para compatibilidad
        gradient: {
          from: '#B40000',     // Rojo institucional
          via: '#003366',      // Azul institucional
          to: '#B40000',       // Rojo institucional
        }
      },
      backgroundImage: {
        // Gradientes institucionales con los colores de la universidad
        'gradient-primary': 'linear-gradient(135deg, #B40000 0%, #003366 50%, #B40000 100%)',
        'gradient-soft': 'linear-gradient(135deg, #F5F5F5 0%, #FFFFFF 50%, #F5F5F5 100%)',
        'gradient-dark': 'linear-gradient(135deg, #000000 0%, #003366 50%, #B40000 100%)',
        'gradient-institutional': 'linear-gradient(90deg, #B40000 0%, #003366 100%)',
        'gradient-light': 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)',
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