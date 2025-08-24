// ltds-alert.js
export class LtdsAlert extends HTMLElement {
  static get observedAttributes() {
    return ['scheme', 'title', 'content'];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    // Re-render à chaque changement d'attribut observé
    this.render();
  }

  _iconFor(scheme) {
    switch (scheme) {
      case 'success': return 'check';
      case 'warning': return 'warning';
      case 'danger':  return 'error';
      default:        return 'about';
    }
  }

  render() {
    const scheme  = this.getAttribute('scheme') || 'info';
    const title   = this.getAttribute('title')  || '';
    const content = this.getAttribute('content') || '';

    const role = (scheme === 'danger' || scheme === 'warning') ? 'alert' : 'status';
    const icon = this._iconFor(scheme);

    // Squelette HTML
    this.innerHTML = `
      <div class="ltds-alert ltds-alert--${scheme}" role="${role}">
        <div class="ltds-alert-icon">
          <i class="icon lt-icon-${icon} icon-size-lg" aria-hidden="true" style="color: var(--color-${scheme})"></i>
        </div>
        <div class="ltds-alert-main">
          <div class="ltds-alert-title">
            <span class="ltds-alert-heading">${title}</span>
          </div>
          <div class="ltds-alert-content"></div>
        </div>
      </div>
    `;

    // Injection "safe" du contenu (affiche < > & littéraux)
    const contentEl = this.querySelector('.ltds-alert-content');
    // Option 1: textContent (le plus simple/rapide)
    contentEl.textContent = content;

    // Si un jour tu veux autoriser du HTML volontairement,
    // tu pourrais prévoir un attribut ex: allow-html
    // if (this.hasAttribute('allow-html')) contentEl.innerHTML = content;
  }
}

customElements.define('ltds-alert', LtdsAlert);
