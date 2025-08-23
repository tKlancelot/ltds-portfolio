// utils/uiUtils.js
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

// 👉 Vite importe le HTML comme string
import navbarTpl from '../parts/navbar.html?raw';
import footerTpl from '../parts/footer.html?raw';
import { createDesktopMenu, createMobileMenu } from './menuUtils';

export const initializeBaseStructure = async (template) => {
  const app = document.getElementById('app');
  if (!app) return;

  let menuNav = document.getElementById('menu-nav');
  if (menuNav) menuNav.innerHTML = navbarTpl; // Injecte le template importé (pas de fetch)

  // S’assure que la navbar est en haut de #app
  if (!menuNav.parentElement) app.prepend(menuNav);
  else if (menuNav.parentElement !== app) app.prepend(menuNav);

  // construire les menus 
  createMobileMenu();
  createDesktopMenu();

  // injecter footer 
  let footer = document.getElementById('footer');
  if (footer) footer.innerHTML = footerTpl;
  console.log('footer', footer);
  app.append(footer);

  // ajouter la classe du template sur body
  document.body.classList.add(template);

};

export const initTooltips = async () => {
  const tooltipElements = document.querySelectorAll('[data-tooltip]');

  tooltipElements.forEach(el => {
    const content = el.getAttribute('data-tooltip');
    const placement = el.getAttribute('data-tooltip-placement') || 'top'; // optionnel

    tippy(el, {
      content,
      placement,
      theme: 'light', // ou 'dark', ou un thème custom si tu veux
      animation: 'shift-away',
      delay: [100, 50],
    });
  });
};


export const modalService = () => {
  const initModals = () => {
    const modalTriggers = document.querySelectorAll('[data-modal-ref]');

    console.log(`[modalService] ${modalTriggers.length} modal triggers found`);

    modalTriggers.forEach(trigger => {
      const modalId = trigger.getAttribute('data-modal-ref');
      const modal = document.getElementById(modalId);

      if (!modal) {
        console.warn(`[modalService] No modal found with id "${modalId}"`);
        return;
      }

      trigger.addEventListener('click', () => {
        const containerSelector = modal.getAttribute('container');
        const container = containerSelector ? document.querySelector(containerSelector) : null;

        if (container && modal.parentElement !== container) {
          container.appendChild(modal);
        }

        if (typeof modal.open === 'function') {
          modal.open();
          trigger.setAttribute('aria-expanded', 'true');
          console.log(`[modalService] Modal with id "${modalId}" opened`);
        } else {
          console.warn(`[modalService] Element with id "${modalId}" is not a modal-dialog component`);
        }
      });
    });
  };

  // DOMContentLoaded check
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initModals);
  } else {
    initModals();
  }
};


export const setupStickyNavbar = () => {
  const nav = document.getElementById('menu-nav');
  const scrollToTop = document.getElementById('scrollToTop');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      nav.classList.add('scrolled');
      // display scrollToTop button
      scrollToTop.style.display = 'flex';
    } else {
      nav.classList.remove('scrolled');
      // hide scrollToTop button
      scrollToTop.style.display = 'none';
    }
  });
};

export const scrollToTop = () => {
  let scrollTop = document.getElementById('scrollToTop');
  scrollTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

export const changeTheme = () => {

  let allThemeBtns = document.querySelectorAll('.theme-switch');
  console.log('allThemeBtns', allThemeBtns);
  // on regarde si localstorage contient une clé de theme
  const scheme = localStorage.getItem('scheme');

  // si oui, on l'applique
  if (scheme) {
    document.body.dataset.scheme = scheme
  } 

  // sinon allThemeBtns.foreach 
  allThemeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.body.dataset.scheme = btn.dataset.scheme;
      localStorage.setItem('scheme', btn.dataset.scheme);
    })
  })
}


/**
 * Applique un halo/dégradé à l’élément cible (par défaut <body>)
 * @param {Object} options - Options de personnalisation
 * @param {string|HTMLElement} [options.target='body'] - Sélecteur ou élément
 * @param {string} [options.haloSizeX='120%']   - Largeur du halo (ellipse)
 * @param {string} [options.haloSizeY='100%']   - Hauteur du halo
 * @param {number} [options.haloStrength=0.8]   - Intensité du halo (0–1)
 * @param {string} [options.haloShiftY='-8%']   - Décalage vertical du halo
 * @param {string} [options.haloColor='var(--color-primary-opacity-40)'] - Couleur du halo
 */
export function applyPageGradient({
  target = 'body',
  haloSizeX = '120%',
  haloSizeY = '100%',
  haloStrength = 0.8,
  haloShiftY = '-8%',
  haloColor = 'var(--color-primary-opacity-40)'
} = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;

  // Applique les custom properties
  el.style.setProperty('--halo-size-x', haloSizeX);
  el.style.setProperty('--halo-size-y', haloSizeY);
  el.style.setProperty('--halo-strength', haloStrength);
  el.style.setProperty('--halo-shift-y', haloShiftY);
  el.style.setProperty('--halo-color', haloColor);

  // Applique le background complet (halo + gradient)
  el.style.background = `
    radial-gradient(
      ellipse var(--halo-size-x) var(--halo-size-y) at 50% var(--halo-shift-y),
      color-mix(in oklab, var(--halo-color), transparent 45%) 0%,
      color-mix(in oklab, var(--halo-color), transparent 65%) 35%,
      rgba(0,0,0, calc(0.35 * (1 - var(--halo-strength)))) 55%,
      transparent 70%
    ),
    linear-gradient(
      to bottom,
      var(--surface-overlay) 0%,
      var(--surface-page) 320px
    )
  `;
}
