// PanelMenu.js
const HEADER_TEMPLATE = (header) => `
  <h3 class="u-text-primary">${header}</h3>
  <button dismiss aria-label="Fermer"
    class="ltds-btn ltds-btn--ghost ltds-btn--shape ltds-btn--sm">
    <i class="icon lt-icon-close icon-size-md"></i>
  </button>
`;

export class PanelMenu extends HTMLElement {
  constructor() {
    super();
    this.trigger = null;
    this.panel   = null;
    this.origin  = this.getAttribute("origin") || "left";
    this.header  = this.getAttribute("header") || "Menu";

    // binding
    this._onTriggerClick   = this._onTriggerClick.bind(this);
    this._onDocPointerDown = this._onDocPointerDown.bind(this);
    this._onKeyDown        = this._onKeyDown.bind(this);
    this._onResize         = this._onResize.bind(this);
    this._onPanelClick     = this._onPanelClick.bind(this);
  }

  connectedCallback() {
    this.trigger = this.querySelector(".panel-menu-trigger");
    this.panel   = this.querySelector(".panel-menu");

    if (!this.trigger || !this.panel) {
      console.warn("[panel-menu] .panel-menu-trigger ou .panel-menu manquant");
      return;
    }

    this._setupAccessibility();
    this._injectHeader();
    this._bindEvents();

    this._onResize(); // init state
  }

  disconnectedCallback() {
    this._unbindEvents();
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

  // ---- Private
  _setupAccessibility() {
    this.panel.classList.add(`origin-${this.origin}`);
    this.trigger.setAttribute("aria-expanded", "false");
    this.trigger.setAttribute("aria-controls", this.panel.id || "panel-menu");
    this.panel.setAttribute("role", "dialog");
    this.panel.setAttribute("aria-modal", "true");
    if (!this.panel.id) this.panel.id = "panel-menu";
  }

  _injectHeader() {
    if (!this.panel.querySelector("[slot=header]")) {
      const header = document.createElement("div");
      header.setAttribute("slot", "header");
      header.innerHTML = HEADER_TEMPLATE(this.header);
      this.panel.prepend(header);
    }
  }

  _bindEvents() {
    this.trigger.addEventListener("click", this._onTriggerClick);
    this.panel.addEventListener("click", this._onPanelClick);
    document.addEventListener("pointerdown", this._onDocPointerDown);
    document.addEventListener("keydown", this._onKeyDown);
    window.addEventListener("resize", this._onResize);
  }

  _unbindEvents() {
    this.trigger?.removeEventListener("click", this._onTriggerClick);
    this.panel?.removeEventListener("click", this._onPanelClick);
    document.removeEventListener("pointerdown", this._onDocPointerDown);
    document.removeEventListener("keydown", this._onKeyDown);
    window.removeEventListener("resize", this._onResize);
  }

  // ---- Handlers
  _onTriggerClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.panel.classList.toggle("is-open");
    const expanded = this.panel.classList.contains("is-open");
    this.trigger.setAttribute("aria-expanded", expanded ? "true" : "false");
  }

  _onPanelClick(e) {
    if (e.target.closest("[dismiss]")) {
      e.preventDefault();
      this.close();
    }
  }

  _onDocPointerDown(e) {
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
}

customElements.define("panel-menu", PanelMenu);
