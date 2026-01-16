/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'kemet': {
          'primary': '#2a4c41',
          'primary-dark': '#1F3930',
          'primary-light': '#3A6351',
          'secondary': '#023E8A',
          'accent': '#F72585',
          'success': '#06D6A0',
          'warning': '#FFD60A',
          'danger': '#EF476F',
        },
        'dark': {
          'bg': '#000000',
          'card': 'rgba(42, 76, 65, 0.1)',
          'border': 'rgba(255, 255, 255, 0.1)',
          'hover': 'rgba(42, 76, 65, 0.2)',
        },
        'light': {
          'bg': '#FFFFFF',
          'card': 'rgba(255, 255, 255, 0.7)',
          'text': '#000000',
        },
        // Aliases pour compatibilité
        'background-dark': '#000000',
        'background-light': '#FFFFFF',
        'card-dark': 'rgba(42, 76, 65, 0.1)',
        'border-dark': 'rgba(255, 255, 255, 0.1)',
        'charcoal-dark': '#000000',
        'charcoal-medium': '#1a1a1a',
        'charcoal-light': '#2a2a2a',
        'primary': '#2a4c41',
        'premium-gray': '#e5e7eb',
      },
      backgroundImage: {
        'gradient-kemet': 'linear-gradient(135deg, #2a4c41 0%, #1F3930 100%)',
        'gradient-mesh': 'radial-gradient(at 27% 37%, rgba(42, 76, 65, 0.15) 0px, transparent 50%), radial-gradient(at 97% 21%, rgba(42, 76, 65, 0.1) 0px, transparent 50%), radial-gradient(at 52% 99%, rgba(42, 76, 65, 0.12) 0px, transparent 50%), radial-gradient(at 10% 29%, rgba(42, 76, 65, 0.08) 0px, transparent 50%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'gradient-glass-dark': 'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 100%)',
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(42, 76, 65, 0.2)',
        'glow': '0 0 25px rgba(42, 76, 65, 0.3)',
        'glow-lg': '0 0 40px rgba(42, 76, 65, 0.4)',
        'inner-glow': 'inset 0 0 20px rgba(42, 76, 65, 0.1)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        'glass-lg': '0 12px 48px 0 rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
        'glass-primary': '0 8px 32px 0 rgba(42, 76, 65, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        'elevation-1': '0 2px 8px rgba(0, 0, 0, 0.3), 0 0 1px rgba(255, 255, 255, 0.1)',
        'elevation-2': '0 4px 16px rgba(0, 0, 0, 0.4), 0 0 2px rgba(255, 255, 255, 0.1)',
        'elevation-3': '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 4px rgba(255, 255, 255, 0.1)',
        'kemet': '0 4px 20px rgba(42, 76, 65, 0.3)',
        'kemet-lg': '0 10px 40px rgba(42, 76, 65, 0.4)',
      },
      backdropBlur: {
        'xs': '2px',
        'glass': '10px',
        'glass-md': '16px',
        'glass-lg': '24px',
      },
    },
  },
  plugins: [],
}
