export const routeConfigurations = [
  { path: "/", template: "home", pageScript: "home.js" },
  { path: "/login", template: "login", pageScript: "login.js" },
  { path: "/about", template: "about", pageScript: "about.js" },

  // sous-pages du design system
  { path: "/design-system/reset", template: "reset", pageScript: "reset.js" },
  { path: "/design-system/tokens", template: "tokens", pageScript: "tokens.js" },
  { path: "/design-system/colors", template: "colors", pageScript: "colors.js" },
  { path: "/design-system/typography", template: "typography", pageScript: "typography.js" },
  { path: "/design-system/utilities", template: "utilities", pageScript: "utilities.js" },
  { path: "/design-system/accessibility", template: "accessibility", pageScript: "accessibility.js" },

  { path: "/404", template: "404", pageScript: null }
];
