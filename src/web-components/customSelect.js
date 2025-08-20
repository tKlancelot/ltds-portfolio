export class CustomSelect extends HTMLElement {
  connectedCallback() {
      setTimeout(() => {
          const options = [...this.querySelectorAll('option')].map(opt => ({
              value: opt.value,
              text: opt.textContent,
          }));

          // Clean
          this.innerHTML = `
              <div class="custom-select">
                  <div class="custom-select-trigger">${options[0]?.text || 'Choisir'} <i class="icon lt-icon-caret-down icon-size-lg"></i></div>
                  <div class="custom-select-dropdown hidden">
                      ${options.map(o =>
                          `<div class="custom-select-option" data-value="${o.value}">${o.text}</div>`
                      ).join('')}
                  </div>
              </div>
          `;

          const trigger = this.querySelector('.custom-select-trigger');
          const dropdown = this.querySelector('.custom-select-dropdown');
          
          // Fonction pour fermer le dropdown
          const closeDropdown = () => {
              dropdown.classList.add('hidden');
          };

          // Ouvrir ou fermer le dropdown
          trigger.addEventListener('click', (e) => {
              const isDropdownOpen = !dropdown.classList.contains('hidden');
              
              // Ferme tous les autres dropdowns ouverts
              document.querySelectorAll('.custom-select-dropdown').forEach((otherDropdown) => {
                  if (otherDropdown !== dropdown) {
                      otherDropdown.classList.add('hidden');
                  }
              });

              // Si le dropdown était déjà ouvert, le fermer, sinon l'ouvrir
              if (isDropdownOpen) {
                  closeDropdown();
              } else {
                  dropdown.classList.remove('hidden');
              }
          });

          // Fermer le dropdown si une option est sélectionnée
          this.querySelectorAll('.custom-select-option').forEach(opt => {
              opt.addEventListener('click', () => {
                  trigger.innerHTML = `${opt.textContent} <i class="icon lt-icon-caret-down icon-size-lg"></i>`;
                  trigger.dataset.value = opt.dataset.value;
                  closeDropdown();

                  // Emit custom event
                  this.dispatchEvent(new CustomEvent('change', {
                      detail: { value: opt.dataset.value }
                  }));
              });
          });

          // gestion du click outside
          document.addEventListener('click', (e) => {
              if (!this.contains(e.target)) {
                  closeDropdown();
              }
          });

      }, 0); // attend fin de micro-tâche (les enfants seront présents)
  }
}

if (!customElements.get('custom-select')) {
  customElements.define('custom-select', CustomSelect);
}
