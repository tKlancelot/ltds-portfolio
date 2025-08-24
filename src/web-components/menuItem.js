export class LtdsMenuItem extends HTMLElement {
  static get observedAttributes() {
    return ['href', 'content', 'is-btn-like', 'extra-class', 'target'];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const href = this.getAttribute('href') || '#';
    const content = this.getAttribute('content') || this.textContent.trim() || 'Link';
    const target = this.getAttribute('target') || '';
    const extraClass = this.getAttribute('extra-class') || '';
    const isBtnLike = this.hasAttribute('is-btn-like'); // ✅ vrai booléen

    const liClasses = [
      isBtnLike ? 'ltds-btn ltds-btn--sm ltds-btn--rounded' : 'ltds-menu-item',
      extraClass
    ].filter(Boolean).join(' ');

    this.innerHTML = `
      <li class="${liClasses}">
        <a href="${href}" ${target ? `target="${target}"` : ''} title="${content}">${content}</a>
      </li>
    `;
  }
}

customElements.define('ltds-menu-item', LtdsMenuItem);
