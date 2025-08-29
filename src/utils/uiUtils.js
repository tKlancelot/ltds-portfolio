// utils/uiUtils.js
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

// 👉 Vite importe le HTML comme string
import navbarTpl from '../parts/navbar.html?raw';
import footerTpl from '../parts/footer.html?raw';
import { createDesktopMenu, createMobileMenu } from './menuUtils';
import { portfolioVersion, ldsVersion } from './version';


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
  // console.log('allThemeBtns', allThemeBtns);
  // on regarde si localstorage contient une clé de theme
  const scheme = localStorage.getItem('scheme');

  // si oui, on l'applique
  if (scheme) {
    document.body.dataset.scheme = scheme
    // ajouter selected sur le bouton correspondant
    allThemeBtns.forEach(btn => {
      if (btn.dataset.scheme === scheme) {
        btn.classList.add('selected');
      }
    })
  } 

  // sinon on set par défaut le theme de document.body 
  // et on ajoute selected sur le bouton correspondant
  else {
    document.body.dataset.scheme = '0';
    allThemeBtns.forEach(btn => {
      if (btn.dataset.scheme === '0') {
        btn.classList.add('selected');
      }
    })
  }
  // allThemeBtns.foreach 
  allThemeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // remove all selected 
      allThemeBtns.forEach(btn => {
        btn.classList.remove('selected');
      })
      document.body.dataset.scheme = btn.dataset.scheme;
      localStorage.setItem('scheme', btn.dataset.scheme);
      btn.classList.add('selected');
    })
  })
}


export function applyPageGradient({
  target = 'body',
  haloSizeX = '120%',
  haloSizeY = '100%',
  haloStrength = 0.8,
  haloShiftY = '-8%',
  haloColor = 'var(--brand-primary-opacity-40)'
} = {}) {


  // seulement si on est en darkmode 

  let mode = document.body.dataset.mode;
  if(mode === 'light') return;

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


// reveal.js
export function initReveals({
  selector = '.reveal',
  root = null,
  rootMargin = '0px 0px -12% 0px',
  threshold = 0.1,
  resetOnExit = true,   // ← retire la classe quand on sort
} = {}) {
  const els = Array.from(document.querySelectorAll(selector));
  if (!('IntersectionObserver' in window) || els.length === 0) {
    els.forEach(el => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;
      if (entry.isIntersecting) {
        el.classList.add('is-in');     // entre → joue l’anim
      } else if (resetOnExit) {
        el.classList.remove('is-in');  // sort → reset, rejouera plus tard
      }
    });
  }, { root, rootMargin, threshold });

  els.forEach(el => io.observe(el));
}

export function showVersions() {
  // Emplacements dans ton HTML
  const elDs  = document.querySelectorAll('[data-version="ltds"]');
  const elApp = document.querySelectorAll('[data-version="portfolio"]');

  
  elDs.forEach(el => el.textContent = ldsVersion);
  elApp.forEach(el => el.textContent = portfolioVersion);

  // Option: log
  console.log(`[versions] portfolio ${portfolioVersion} — ltds ${ldsVersion}`);
}


// toggle-darkmode.js
// toggle-darkmode.js
export function toggleDarkmode () {
  const KEY = "mode";
  const root = document.documentElement;
  const toggles = [
    { input: document.getElementById("modeToggle"), label: document.getElementById("modeLabel") },
    { input: document.getElementById("modeToggleMobile"), label: document.getElementById("modeLabelMobile") }
  ];

  const get = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
  const set = (v) => { try { localStorage.setItem(KEY, v); } catch {} };

  const apply = (mode) => {
    const m = mode === "dark" ? "dark" : "light";
    root.setAttribute("data-mode", m);
    root.style.colorScheme = m;
    toggles.forEach(({ input, label }) => {
      if (input) input.checked = (m === "dark");
      if (label) label.textContent = m === "dark" ? "DARK" : "LIGHT";
    });
  };

  // état initial
  apply(get() || root.getAttribute("data-mode") || "light");

  // interactions
  toggles.forEach(({ input }) => {
    if (input) {
      input.addEventListener("change", () => {
        const next = input.checked ? "dark" : "light";
        apply(next); set(next);
      });
    }
  });

  // synchro multi-onglets
  window.addEventListener("storage", (e) => {
    if (e.key === KEY && e.newValue) apply(e.newValue);
  });
}

