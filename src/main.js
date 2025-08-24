// import '@tarik-leviathan/ltds/dist/ltds.css';
// import '@tarik-leviathan/ltds/styles/core';
// import '@tarik-leviathan/ltds/styles';

import { CustomSelect } from './web-components/customSelect.js';
import { ModalDialog } from './web-components/modalDialog.js';
import { LtdsCard } from './web-components/cardComponent.js';
import { DocSection } from './web-components/docSection.js';
import { LtdsCodeBlock } from './web-components/codeBlock.js';
import { LtdsDivider } from './web-components/divider.js';
import { PanelMenu } from './web-components/panelMenu.js';
import { LtdsMenuItem } from './web-components/menuItem.js';
import { LtdsAlert } from './web-components/alertComponent.js';

import UniversalRouter from 'universal-router';
import { routeConfigurations } from './utils/routeConfiguration.js';
import { loadPage } from './utils/routerUtils.js';
import * as UI from './utils/uiUtils.js';


// helpers
const defaultUI = [
  UI.initializeBaseStructure,
  UI.modalService,
  UI.initTooltips,
  UI.setupStickyNavbar,
  UI.scrollToTop,
  UI.changeTheme,
  UI.showVersions,
  () => UI.initReveals({ resetOnExit: true }),
];

const initPageUI = async (template) => {
  for (let fn of defaultUI) await fn(template);

  // gradient spécifique
  UI.applyPageGradient(
    template === 'home'
      ? { haloSizeX: '150%', haloShiftY: '-20%', haloStrength: 0.9 }
      : { haloSizeY: '100%', haloSizeX: '150%', haloShiftY: '-20%', haloStrength: 0.8, haloColor: 'var(--color-primary-opacity-10)' }
  );
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