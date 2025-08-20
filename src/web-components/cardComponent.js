export class LtdsCard extends HTMLElement {

    connectedCallback() {

        const href = this.getAttribute('href');
        const wrapper = href ? 'a' : 'div';
        const hrefAttr = href ? `href="${href}"` : '';
        const roleAttr = !href ? `role="button" tabindex="0"` : '';

        const props = {
            title: this.getAttribute('title') || '',
            subtitle: this.getAttribute('subtitle') || '',
            content: this.getAttribute('content') || '',
            extraClass: this.getAttribute('extra-class') || ''
        };

        this.innerHTML = `
            <${wrapper} class="ltds-card ltds-card--interactive ${props.extraClass}" ${hrefAttr} ${roleAttr}>
                <header class="ltds-card-header">
                <h3 class="ltds-card-title"><slot name="title">${props.title}</slot></h3>
                <span class="u-text-secondary u-fs-0"><slot name="subtitle">${props.subtitle}</slot></span>
                </header>
                <div class="ltds-card-body">
                <slot name="content">${props.content}</slot>
                </div>
            </${wrapper}>
        `;
    }


    disconnectedCallback() {
        this.innerHTML = '';
    }

}

if (!customElements.get('ltds-card')) {
  customElements.define('ltds-card', LtdsCard);
}