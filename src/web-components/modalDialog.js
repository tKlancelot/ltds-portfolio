export class ModalDialog extends HTMLElement {
  constructor() {
    super();
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onClickBackdrop = this._onClickBackdrop.bind(this);
    this._hasRendered = false;
    this._containerElement = null;
  }

  connectedCallback() {
    if (!this._hasRendered) {
      this._render();
    }

    // Dismiss button
    this.querySelectorAll("[data-modal-dismiss]").forEach((btn) => {
      btn.addEventListener("click", () => this.close());
    });

    this.querySelector(".modal")?.addEventListener("click", this._onClickBackdrop);

    // Container personnalisé
    const containerSelector = this.getAttribute("container");
    if (containerSelector) {
      const container = document.querySelector(containerSelector);
      if (container && this.parentElement !== container) {
        container.appendChild(this); // ✅ Ne déplace que si nécessaire
      } else if (!container) {
        console.warn(`[modal-dialog] Container "${containerSelector}" not found.`);
      }
    }
  }

  open() {
    const content = this.querySelector(".modal-content");
    if (!content) return;

    this.classList.add("is-open");

    requestAnimationFrame(() => {
      content.classList.add("animate-in");
    });
    document.addEventListener("keydown", this._onKeyDown);
  }

  close() {
    const content = this.querySelector(".modal-content");
    if (!content) return;

    content.classList.remove("animate-in");
    content.classList.add("animate-out");

    const onAnimationEnd = () => {
      content.removeEventListener("transitionend", onAnimationEnd);
      this.classList.remove("is-open");
      content.classList.remove("animate-out");
      console.log("Animation ended");
    };

    content.addEventListener("transitionend", onAnimationEnd);
    document.removeEventListener("keydown", this._onKeyDown);
  }
  _onKeyDown(e) {
    if (e.key === "Escape") this.close();
  }

  _onClickBackdrop(e) {
    if (e.target.classList.contains("modal")) {
      this.close();
    }
  }

_render() {
  if (this._hasRendered) return;
  this._hasRendered = true;

  const maxWidth = this.getAttribute("max-width") || "400";
  const extraClass = this.getAttribute("extra-class") || "";
  const titleIcon = this.getAttribute("title-icon") || "";
  const title = this.getAttribute("modal-title") || "Titre de la modale";

  // Détache et stocke seulement les *vrais* enfants initiaux une fois
  const children = Array.from(this.childNodes).filter(
    (node) => !(node.nodeType === 3 && node.textContent.trim() === "")
  );

  // Nettoie le contenu de l’élément sans innerHTML (meilleur pour éviter des effets de bord)
  this.innerHTML = "";

  // Création DOM propre
  const modalWrapper = document.createElement("div");
  modalWrapper.className = "modal";

  const modalContent = document.createElement("div");
  modalContent.className = `modal-content ${extraClass}`;
  modalContent.style.maxWidth = `${maxWidth}px`;

  modalContent.innerHTML = `
    <div class="modal-header">
      <h3 class="modal-title lt-stack lt-stack--center">
        ${titleIcon ? `<i class="${titleIcon} icon icon-size-lg"></i>` : ""} 
        ${title}
      </h3>
      <button class="modal-close ltds-btn ltds-btn--ghost ltds-btn--shape ltds-btn--sm" aria-label="Fermer la modale" data-modal-dismiss>
        <i class="icon lt-icon-close lt-icon-style-solid icon-size-md"></i>
      </button>
    </div>
    <div class="modal-slot"></div>
  `;

  modalWrapper.appendChild(modalContent);
  this.appendChild(modalWrapper);

  const slotContainer = this.querySelector(".modal-slot");
  children.forEach((child) => slotContainer.appendChild(child));
}


  destroy() {
    // Nettoyage des événements
    document.removeEventListener('keydown', this._onKeyDown);

    this.querySelector('.modal-close')?.removeEventListener('click', () => this.close());
    this.querySelector('.modal')?.removeEventListener('click', this._onClickBackdrop);

    // Suppression du DOM
    this.remove();
  }

} 

customElements.define("modal-dialog", ModalDialog);
