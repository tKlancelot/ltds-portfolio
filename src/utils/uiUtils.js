// utils/uiUtils.js
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css'; // optional for styling
import { getRole, getToken } from "./userUtils";
import { apiUrl } from './config.js';


export const initializeBaseStructure = async () => {
    let app = document.getElementById('app');

    const navbar = fetch('/src/parts/navbar.html').then(res => res.text());
    if (navbar) {
      console.log('✅ Navbar chargé');
      let menuNav = document.getElementById('menu-nav');
      menuNav.innerHTML = await navbar;
      app.prepend(menuNav);       // déplacer le noeud menu-nav dans #app
    }


};

export const handlePermissions = () => {


    const logoutLink = document.getElementById('logout');
    const addSettingLink = document.getElementById('add-setting');
    const pageSettingsLink = document.getElementById('page-settings');
    const usersAdminLink = document.getElementById('users-admin');
    const addUserLink = document.getElementById('add-user');

    // HAS TOKEN PERMISSION
    logoutLink.style.display = getToken() ? 'block' : 'none';

    // ADMIN PERMISSIONS 
    addSettingLink.style.display = getToken() && (getRole() === 'admin' || getRole() === 'super_admin') ? 'block' : 'none';
    pageSettingsLink.style.display = getToken() && (getRole() === 'admin' || getRole() === 'super_admin') ? 'block' : 'none';

    // SUPER ADMIN PERMISSIONS
    usersAdminLink.style.display = getToken() && (getRole() === 'super_admin') ? 'block' : 'none';
    addUserLink.style.display = getToken() && (getRole() === 'super_admin') ? 'block' : 'none';

    logoutLink.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        window.location.href = '/';
    });
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


export const handleNavLinks = async (templatePath) => {
    // handle active nav link 
    let navLinks = document.querySelectorAll('.navbar li');
    console.log(navLinks);
    let currentPage = templatePath.split('/').pop().split('.')[0];
    navLinks.forEach(link => {
        link.classList.remove('active');
        let linkName = link.textContent.toLowerCase().split(' ').join('-');
        if (linkName === currentPage) {
            link.classList.add('active');
        }
    });
};

