// src/utils/routerUtils.js

// 1) Charge toutes les pages HTML comme "raw string"
const pages = import.meta.glob('../pages/*.html', { as: 'raw' });
// 2) Charge les partials (navbar, etc.) aussi en raw
const partials = import.meta.glob('../parts/*.html', { as: 'raw' });
// 3) Prépare l’import dynamique des scripts de page (bundlés par Vite)
const pageModules = import.meta.glob('../js/*.js');

export const loadPage = async (template, pageScript) => {
  // ---- PAGE HTML
  const pageKey = `../pages/${template}.html`;
  if (!pages[pageKey]) {
    // fallback local si template inconnu
    document.getElementById('app').innerHTML = '<h1>404</h1>';
  } else {
    const html = await pages[pageKey](); // renvoie la string HTML
    document.getElementById('app').innerHTML = html;
  }


  // ---- SCRIPT DE PAGE
  if (pageScript) {
    const modKey = `../js/${pageScript}`;
    if (pageModules[modKey]) {
      const mod = await pageModules[modKey](); // charge le module bundlé
      // convention : chaque page exporte `default` = init()
      if (typeof mod.default === 'function') {
        await mod.default(); // exécute l’initialisation de la page
      }
    } else {
      console.warn(`⚠️ Module introuvable: ${modKey}`);
    }
  }
};
