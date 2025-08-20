// config.js
let mode = 'DEV';

export const apiUrl = mode === 'DEV' 
  ? 'http://localhost:3000' 
  : 'https://render-showcase-express.onrender.com';