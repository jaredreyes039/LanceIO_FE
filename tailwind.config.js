/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}", 'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'],
    theme: {
    colors: {
      'primaryBlack': '#101010',
      'primaryGreen': '#46CD6E',
      'primaryWhite':'#F4DBDB',
      'primaryWhiteOpague': '#F4DBDB50'
    },
    extend: {},
  },
  plugins: [require('flowbite/plugin')],
}

