// src/web-components/divider.js
export class LtdsDivider extends HTMLElement {}

if (!customElements.get("ltds-divider")) {
  customElements.define("ltds-divider", LtdsDivider);
}