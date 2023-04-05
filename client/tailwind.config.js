/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    //"./app/**/*.{js,ts,jsx,tsx}",
    //"./pages/**/*.{js,ts,jsx,tsx}",
    //"./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
    borderWidth: {
      DEFAULT: '1px',
      '0.5': '.5px',
      '2': '2px',
      '3': '3px',
      '4': '4px',
      '6': '6px',
      '8': '8px',
    },
    screens: {
      '2xl': {'max': '1535px'},
      'xl': {'max': '1279px'},
      'lg': {'max': '1023px'},
      'md': {'max': '767px'},
      'sm': {'max': '639px'},
    }
  },
  plugins: [],
}
