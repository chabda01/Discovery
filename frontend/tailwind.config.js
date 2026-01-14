/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Kemet Color Palette
        'kemet': {
          'primary': '#00A3E0',      // Cyan principal
          'primary-dark': '#0077B6', // Cyan foncé
          'primary-light': '#4CC9F0', // Cyan clair
          'secondary': '#023E8A',     // Bleu profond
          'accent': '#F72585',        // Rose accent
          'success': '#06D6A0',       // Vert
          'warning': '#FFD60A',       // Jaune
          'danger': '#EF476F',        // Rouge
        },
        'dark': {
          'bg': '#0A1929',           // Fond très sombre
          'card': '#132F4C',         // Carte sombre
          'border': '#1E3A5F',       // Bordure
          'hover': '#1A4971',        // Hover
        },
      },
      backgroundImage: {
        'gradient-kemet': 'linear-gradient(135deg, #00A3E0 0%, #023E8A 100%)',
        'gradient-mesh': 'radial-gradient(at 27% 37%, hsla(215, 98%, 61%, 0.05) 0px, transparent 50%), radial-gradient(at 97% 21%, hsla(125, 98%, 72%, 0.05) 0px, transparent 50%), radial-gradient(at 52% 99%, hsla(354, 98%, 61%, 0.05) 0px, transparent 50%), radial-gradient(at 10% 29%, hsla(256, 96%, 67%, 0.05) 0px, transparent 50%), radial-gradient(at 97% 96%, hsla(38, 60%, 74%, 0.05) 0px, transparent 50%), radial-gradient(at 33% 50%, hsla(222, 67%, 73%, 0.05) 0px, transparent 50%), radial-gradient(at 79% 53%, hsla(343, 68%, 79%, 0.05) 0px, transparent 50%)',
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(0, 163, 224, 0.1)',
        'glow': '0 0 25px rgba(0, 163, 224, 0.15)',
        'glow-lg': '0 0 40px rgba(0, 163, 224, 0.2)',
        'inner-glow': 'inset 0 0 20px rgba(0, 163, 224, 0.1)',
        'elevation-1': '0 2px 8px rgba(0, 0, 0, 0.3), 0 0 1px rgba(255, 255, 255, 0.1)',
        'elevation-2': '0 4px 16px rgba(0, 0, 0, 0.4), 0 0 2px rgba(255, 255, 255, 0.1)',
        'elevation-3': '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 4px rgba(255, 255, 255, 0.1)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}
