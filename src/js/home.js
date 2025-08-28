import Splide from '@splidejs/splide';
import '@splidejs/splide/css'; // optionnel si tu veux le CSS par défaut
import { cards } from '../datas/cards-data.js';
import { applyPageGradient } from '../utils/uiUtils.js';
import { renderThreeScene } from './threeScene.js';

export default async function initHomePage(params) {

    console.log('🏠 Script home.js chargé avec params:', params);


    // Initialisation du carousel Splide
    const carousel = document.querySelector('.splide');
    if (carousel) {
        try {
            const splide = new Splide(carousel, {
                type: 'fade',
                autoplay: false,
                wheel: false,
                speed: 400,
                arrows: false,
                rewind: true,
                interval: 6000,
                perPage: 1
            });
            splide.mount();
            console.log('✅ Splide monté avec succès');
        } catch (error) {
            console.error('❌ Erreur lors du montage de Splide:', error);
        }
    } else {
        console.warn('⚠️ Élément .splide introuvable : le carousel ne sera pas monté');
    }

    const grid = document.querySelector('.ltds-card-grid');

    const shuffleCards = () => {
        // melanger toutes les cartes at random 
        const children = Array.from(grid.children);
        children.sort(() => Math.random() - 0.5);
        grid.innerHTML = '';
        children.forEach(child => grid.appendChild(child));
    }


    cards.forEach(({ title, subtitle, icon, content, extraClass, href, categ }) => {
        const el = document.createElement('ltds-card');
        if (title) el.setAttribute('title', title);
        if (subtitle) el.setAttribute('subtitle', subtitle);
        if (icon) el.setAttribute('icon', icon);
        if (content) el.setAttribute('content', content);
        if (extraClass) el.setAttribute('extra-class', extraClass);
        if (categ) el.setAttribute('extra-class', 'ltds-card--' + categ);
        if (href) el.setAttribute('href', href);
        grid.appendChild(el);
        shuffleCards();
    });



    // copy npm button 
    let btn = document.querySelector('#copy-npm');
    if (btn) {
        btn.addEventListener('click', () => {
            let span = btn.querySelector('span');
            navigator.clipboard.writeText('npm i @tarik-leviathan/ltds');
            span.textContent = 'Copied !';
            setTimeout(() => {
                span.textContent = 'npm i @tarik-leviathan/ltds';
            }, 2000);
        });
    }

    // renderThreeScene();

}