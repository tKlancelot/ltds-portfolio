export class LtdsCodeBlock extends HTMLElement {
  connectedCallback() {
    const lang = this.getAttribute("language") || "markup";
    const shouldDedent = this.hasAttribute("dedent");
    const enableCopy = this.getAttribute("copy") !== "false";

    // 1) Récup + normalisation du contenu
    const rawSource = this.textContent || "";
    const cleaned = shouldDedent ? this.#dedent(rawSource) : rawSource;

    // 2) Structure DOM (sans Shadow DOM)
    this.innerHTML = ""; // reset contenu
    if (enableCopy) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ltds-copy-btn u-fs-0";
      btn.setAttribute("aria-label", "Copier le code");
      btn.title = "Copier";
      btn.textContent = "Copier";
      btn.addEventListener("click", () => this.#copyToClipboard(cleaned, btn));
      this.appendChild(btn);
    }

    const pre = document.createElement("pre");
    pre.className = `language-${lang}`;
    const codeEl = document.createElement("code");
    codeEl.className = `language-${lang}`;
    codeEl.textContent = cleaned; // (sécurisé) → échappe automatiquement
    pre.appendChild(codeEl);
    this.appendChild(pre);

    // 3) Prism highlight
    if (window.Prism?.highlightElement) {
      window.Prism.highlightElement(codeEl);
    }
  }

  // --- helpers ---
  #dedent(str = "") {
    const s = str.replace(/^\n+|\n+$/g, "");
    const lines = s.split("\n");
    const indents = lines.filter(l => l.trim()).map(l => (l.match(/^(\s*)/)?.[0].length) || 0);
    const min = indents.length ? Math.min(...indents) : 0;
    return lines.map(l => l.slice(min)).join("\n");
  }

  async #copyToClipboard(text, btn) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback legacy
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      btn.textContent = "Copié !";
      btn.classList.add("is-copied");
      setTimeout(() => {
        btn.textContent = "Copier";
        btn.classList.remove("is-copied");
      }, 1200);
    } catch (e) {
      btn.textContent = "Échec";
      setTimeout(() => (btn.textContent = "Copier"), 1200);
      console.error("Copie impossible:", e);
    }
  }
}

if (!customElements.get("ltds-code-block")) {
  customElements.define("ltds-code-block", LtdsCodeBlock);
}
