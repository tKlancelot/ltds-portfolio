// menuUtils.js

import { cards } from '../datas/cards-data.js';

// export function getToken() {
//     return localStorage.getItem('token');
// }

// export function getRole() {
//     return localStorage.getItem('role');
// }


export function createMobileMenu() {
    let menu = document.getElementById('mobile-menu');
    let menuItems = '';
    cards.forEach(card => {
        menuItems += `<ltds-menu-item is-btn-like href="/design-system/${card.slug}" content="${card.title}"></ltds-menu-item>`;
    });
    menu.innerHTML = menuItems;
}

export function createDesktopMenu() {
    let menu = document.getElementById('desktop-menu');
    let menuItems = '';
    cards.forEach(card => {
        menuItems += `<a href="/design-system/${card.slug}" class="u-col-span-4"><li class="ltds-menu-item">${card.title}</li></a>`;
    });
    menu.innerHTML = menuItems;
}