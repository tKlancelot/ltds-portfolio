export class DocSection extends HTMLElement {

  static get observedAttributes() {
    return ["title","extra-class"];
  }

  connectedCallback() {
    const title = this.getAttribute("title") || "";
    const wrapper = document.createElement("section");
    wrapper.classList.add("doc-section","u-py-4","u-tab-py-2",this.getAttribute("extra-class"));

    if (title) {
      const h2 = document.createElement("h2");
      h2.className = "doc-section-title u-mob-fs-3";
      h2.textContent = title;
      wrapper.appendChild(h2);
    }

    const content = document.createElement("div");
    content.className = "doc-section-content";

    while (this.firstChild) {
      content.appendChild(this.firstChild);
    }

    wrapper.appendChild(content);
    this.appendChild(wrapper);
  }
}

if (!customElements.get("doc-section")) {
  customElements.define("doc-section", DocSection);
}
