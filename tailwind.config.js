/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      colors: {
        orange: { DEFAULT: '#F97316', hover: '#EA6C00' },
        brand: '#F97316',
      },
      borderRadius: {
        '20': '20px',
        '12': '12px',
        '10': '10px',
      },
      backdropBlur: { '20': '20px', '24': '24px' },
    },
  },
  plugins: [],
}
