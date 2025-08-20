// fantasticon.config.js
module.exports = {
  inputDir: './svg-library',       // Dossier contenant les SVG
  outputDir: './icon-font',        // Dossier de sortie
  fontTypes: ['woff', 'woff2'],    // Types de fonts utiles sur le web
  assetTypes: ['css','json'],     // Types d'assets utiles
  name: 'icons',                   // Nom de la police générée
  prefix: 'lt-icon',                  // Classe CSS de base : .icon-[nom]
  normalize: true,                 // Normaliser la taille des glyphes
  fontHeight: 1000,                // Hauteur logique de la font
  descent: 200                     // Ajuste verticalement si nécessaire
};
