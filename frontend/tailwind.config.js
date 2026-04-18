/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sakura: {
          50: '#fff0f5',
          100: '#ffe4ef',
          200: '#ffc9de',
          300: '#ff9dc4',
          400: '#ff5f9e',
          500: '#ff2d7a',
          600: '#ff0866',
          700: '#df004f',
          800: '#b80043',
          900: '#99003b',
        },
        'sakura-pink': '#ff2d7a',
        'neon-blue': '#00d4ff',
        dark: {
          900: '#0a0a0f',
          800: '#131318',
          700: '#1a1a24',
          600: '#24243a',
          500: '#2d2d45',
          lighter: '#1a1a24',
        }
      },
      boxShadow: {
        'glow-pink': '0 0 20px rgba(255, 45, 122, 0.3), 0 0 40px rgba(255, 45, 122, 0.1)',
        'glow-pink-lg': '0 0 30px rgba(255, 45, 122, 0.4), 0 0 60px rgba(255, 45, 122, 0.2)',
        'glow-blue': '0 0 20px rgba(0, 212, 255, 0.4), 0 0 40px rgba(0, 212, 255, 0.2)',
        'glow-blue-lg': '0 0 30px rgba(0, 212, 255, 0.5), 0 0 60px rgba(0, 212, 255, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
