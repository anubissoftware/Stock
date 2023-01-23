
/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens:{
        'phone': '300px',
        'tablet': '640px',
        'laptop': '1024px',
        'desktop': '1280px',
        'screen': '1536px',
        'cesarTv': '2000px'
      },
      maxHeight:{
        'modal': '500px'
      },
      height:{
        'modal': '500px'
      },
      colors: {
        'primary':'#A64AEE',
        'secondary':'#F69A36',
        'third':'#3D256A',
        'extra':'#1F0B44',
      }
    },
  },
  plugins: [],
  safelist:[
    {
      pattern: /(bg|text|border|hover)-(primary|secondary|third)/,
      variants: ['hover', 'focus'],
    },
  ]
}
