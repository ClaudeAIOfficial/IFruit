/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {
    colors: { ink:'#000000', panel:'#121212', amber:'#FCAF17', muted:'#A0A0A0' },
    fontFamily: { display:['Oswald','Impact','sans-serif'], body:['Inter','Helvetica Neue','sans-serif'] },
    maxWidth: { '7xl':'1280px' },
    keyframes: { rise:{from:{opacity:'0',transform:'translateY(25px)'},to:{opacity:'1',transform:'translateY(0)'}} },
    animation: { rise:'rise .75s ease-out both' }
  } },
  plugins: []
};
