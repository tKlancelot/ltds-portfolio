import { cards } from "../datas/cards-data";

export class SearchBar extends HTMLElement {
    constructor() {
        super();
        this.input = null;
        this.results = null;
        this.modal = null;
        this.firstDisplay = true;
    }

    connectedCallback() {
        console.log('search bar component !');
        this.render();
        this.input = this.querySelector('modal-dialog input');
        this.results = this.querySelector('modal-dialog .results');
        this.modal = this.querySelector('modal-dialog');

        this.displayRandomResults(); // <-- méthode renommée

        this.input.addEventListener('input', this.onChange.bind(this));
        this.modal.addEventListener('open', this.focusModalInput.bind(this));
    }

    render() {
        this.innerHTML = `
            <div class="search-bar">
                <div class="input" data-modal-ref="modal-search">
                    <i class="icon lt-icon-search icon-size-xl icon-size-mob-sm"></i>
                    <input class="u-text-style-italic u-display-mob-none" type="search" placeholder="Rechercher">
                    <i class="icon lt-icon-jump-to icon-size-lg icon-size-mob-sm"></i>
                </div>
                <modal-dialog id="modal-search" modal-title="Search" class="modal modal-color-scheme-primary" max-width="auto">
                <div class="u-min-w-l-7 u-min-h-l-4">
                    <div class="input">
                        <i class="icon lt-icon-search icon-size-xl"></i>
                        <input type="search" class="u-w-full" placeholder="Rechercher">
                    </div>
                    <div class="results u-mt-2 u-max-h-l-3 u-overflow-y-auto"></div>
                </div>
                </modal-dialog>
            </div>
        `
    }


    showHideResults() {

        let firstDisplay = this.firstDisplay;
        let isInputEmpty = !this.input.value;

        let displayCondition = firstDisplay || isInputEmpty;
        this.results.classList.toggle('hidden', displayCondition);
    }

    // 🔹 Méthode renommée et modifiée pour ne garder que 4 résultats aléatoires
    displayRandomResults() {
        const shuffled = [...cards].sort(() => 0.5 - Math.random()); // mélange aléatoire
        const randomCards = shuffled.slice(0, 4); // prend 4 résultats

        this.results.innerHTML = randomCards.map(card => `
            <a href="/design-system/${card.slug}" class="u-col-span-4">
                <li class="ltds-menu-item">${card.title}</li>
            </a>
        `).join('');
    }

    focusModalInput() {
        console.log('modal dialog dispatch event "open"');
        if(this.modal.classList.contains('is-open')) {
            this.modal.querySelector('input').focus();
        }
    }

    onChange(event) {
        const searchTerm = event.target.value;
        const filteredCards = this.filterCards(searchTerm);
        console.log(filteredCards);

        if(searchTerm === '') {
            this.results.innerHTML = '';
            return;
        }
        this.results.innerHTML = filteredCards.map(card => `
            <a href="/design-system/${card.slug}" class="u-col-span-4">
                <li class="ltds-menu-item">${card.title}</li>
            </a>
        `).join('');
    }

    filterCards(searchTerm) {
        return cards.filter(card => card.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
}

customElements.define('search-bar', SearchBar);
