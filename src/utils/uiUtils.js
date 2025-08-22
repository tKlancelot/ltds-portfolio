// utils/uiUtils.js
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { getRole, getToken } from './userUtils';
import { apiUrl } from './config.js';

// 👉 Vite importe le HTML comme string
import navbarTpl from '../parts/navbar.html?raw';
import footerTpl from '../parts/footer.html?raw';

export const initializeBaseStructure = async () => {
  const app = document.getElementById('app');
  if (!app) return;

  let menuNav = document.getElementById('menu-nav');
  if (menuNav) menuNav.innerHTML = navbarTpl; // Injecte le template importé (pas de fetch)

  // S’assure que la navbar est en haut de #app
  if (!menuNav.parentElement) app.prepend(menuNav);
  else if (menuNav.parentElement !== app) app.prepend(menuNav);

  // injecter footer 
  let footer = document.getElementById('footer');
  if (footer) footer.innerHTML = footerTpl;
  console.log('footer', footer);
  app.append(footer);

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