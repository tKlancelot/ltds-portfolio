export const loadPage = async (pageName, pageScript) => {
  try {
    // 1. Charger le HTML
    const response = await fetch(`/src/pages/${pageName}.html`);
    const html = await response.text();
    document.getElementById('app').querySelector('main').innerHTML = html;
    console.log(`✅ ${pageName} chargé`);
  } catch (error) {
    console.error(`❌ Erreur lors du chargement de ${pageName}:`, error);
    if (pageName !== '404') loadPage('404');
    return; // on arrête ici si la page n'existe pas
  }

  // 2. Charger le JS associé dynamiquement
  if (pageScript) {
    try {
      await import(/* @vite-ignore */ `/src/js/${pageScript}`);
      console.log(`✅ ${pageScript} importé`);
    } catch (error) {
      console.error(`❌ Erreur lors de l'import de ${pageScript}:`, error);
    }
  }
};
