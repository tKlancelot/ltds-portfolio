// PanelMenu.js
export class PanelMenu extends HTMLElement {
  constructor() {
    super();
    this.trigger = null;
    this.panel = null;
    this.origin = null;
    this.title = null;

    this._onTriggerClick   = this._onTriggerClick.bind(this);
    this._onDocPointerDown = this._onDocPointerDown.bind(this);
    this._onKeyDown        = this._onKeyDown.bind(this);
    this._onResize         = this._onResize.bind(this);
  }

  connectedCallback() {
    this.origin = this.getAttribute("origin") || "left";
    this.title  = this.getAttribute("title")  || "Menu";

    this.trigger = this.querySelector(".panel-menu-trigger");
    this.panel   = this.querySelector(".panel-menu");

    if (!this.trigger || !this.panel) {
      console.warn("[panel-menu] .panel-menu-trigger ou .panel-menu manquant");
      return;
    }

    // Applique l’origine (left|right|top)
    this.panel.classList.add(`origin-${this.origin}`);

    // A11y minimal
    this.trigger.setAttribute("aria-expanded", "false");
    this.trigger.setAttribute("aria-controls", this.panel.id || "panel-menu");
    this.panel.setAttribute("role", "dialog");
    this.panel.setAttribute("aria-modal", "true");
    if (!this.panel.id) this.panel.id = "panel-menu";

    // Délégation: tout clic sur un élément [dismiss] dans le panel ferme
    this._onPanelClick = (e) => {
      const dismisser = e.target.closest("[dismiss]");
      if (dismisser) {
        e.preventDefault();
        this.close();
      }
    };
    this.panel.addEventListener("click", this._onPanelClick);

    // Listeners
    this.trigger.addEventListener("click", this._onTriggerClick);
    document.addEventListener("pointerdown", this._onDocPointerDown);
    document.addEventListener("keydown", this._onKeyDown);
    window.addEventListener("resize", this._onResize);

    this._onResize();
  }

  disconnectedCallback() {
    this.trigger?.removeEventListener("click", this._onTriggerClick);
    this.panel?.removeEventListener("click", this._onPanelClick);
    document.removeEventListener("pointerdown", this._onDocPointerDown);
    document.removeEventListener("keydown", this._onKeyDown);
    window.removeEventListener("resize", this._onResize);
  }

  // ---- Handlers
  _onTriggerClick(e) {
    e.preventDefault();
    e.stopPropagation(); // évite fermeture immédiate par le handler global
    const willOpen = !this.panel.classList.contains("is-open");
    this.panel.classList.toggle("is-open");
    this.trigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
  }

  _onDocPointerDown(e) {
    // ne ferme pas si on clique à l'intérieur du composant (trigger ou panel)
    if (this.contains(e.target) || this.panel.contains(e.target)) return;
    if (this.panel.classList.contains("is-open")) this.close();
  }

  _onKeyDown(e) {
    if (e.key === "Escape" && this.panel.classList.contains("is-open")) {
      this.close();
      this.trigger?.focus();
    }
  }

  _onResize() {
    const isDesktop = window.innerWidth > 768;
    this.style.display = isDesktop ? "none" : "block";
    if (isDesktop) this.close();
  }

  // ---- API
  open() {
    this.panel.classList.add("is-open");
    this.trigger?.setAttribute("aria-expanded", "true");
  }
  close() {
    this.panel.classList.remove("is-open");
    this.trigger?.setAttribute("aria-expanded", "false");
  }
}

customElements.define("panel-menu", PanelMenu);
