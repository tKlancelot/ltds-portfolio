// ltds-menu-item webcomponent 

export class LtdsMenuItem extends HTMLElement {
    constructor() {
        super();
        this.href = this.getAttribute('href');
    }
    
    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <li class="ltds-menu-item">
                <a href="#">My link test</a>
            </li>
        `
    }
}

customElements.define('ltds-menu-item', LtdsMenuItem);