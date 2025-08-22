// import '@tarik-leviathan/ltds/dist/ltds.css';
// import '@tarik-leviathan/ltds/styles/core';
import '@tarik-leviathan/ltds/styles';

import { CustomSelect } from './web-components/customSelect.js';
import { ModalDialog } from './web-components/modalDialog.js';
import { LtdsCard } from './web-components/cardComponent.js';
import { DocSection } from './web-components/docSection.js';
import { LtdsCodeBlock } from './web-components/codeBlock.js';
import { LtdsDivider } from './web-components/divider.js';
import { PanelMenu } from './web-components/panelMenu.js';
import { LtdsMenuItem } from './web-components/menuItem.js';

import UniversalRouter from 'universal-router';
import { routeConfigurations } from './utils/routeConfiguration.js';
import { loadPage } from './utils/routerUtils.js';
import { initializeBaseStructure, initTooltips, modalService, scrollToTop, setupStickyNavbar } from './utils/uiUtils.js';

// helpers
const initPageUI = async (template) => {
  await initializeBaseStructure();
  modalService();
  initTooltips();
  setupStickyNavbar();
  scrollToTop();
  // handleNavLinks(template);
};

function mapRoutes(configs) {
  return configs.map(config => {
    const route = {
      path: config.path,
      action: async () => {
        await loadPage(config.template, config.pageScript);
        await initPageUI(config.template);
        return true;
      }
    };

    if (config.children) {
      route.children = mapRoutes(config.children);
    }

    return route;
  });
}

const routes = mapRoutes(routeConfigurations);
const router = new UniversalRouter(routes);

// premier resolve
router.resolve(window.location.pathname).catch(async err => {
  console.error('Erreur de résolution de la route :', err);
  await loadPage('404');
});