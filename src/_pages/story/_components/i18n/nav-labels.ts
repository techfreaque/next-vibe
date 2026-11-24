import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

// Keep these two labels available when a tab changes locale without reloading
// its language-specific bundles.
export const navLabelTranslation = createScopedTranslation({
  en: {
    toggleMenu: "Toggle menu",
    moreNavigation: "More navigation items",
  },
  de: {
    toggleMenu: "Menü umschalten",
    moreNavigation: "Weitere Navigationspunkte",
  },
  pl: {
    toggleMenu: "Przełącz menu",
    moreNavigation: "Więcej opcji nawigacji",
  },
  fr: {
    toggleMenu: "Afficher ou masquer le menu",
    moreNavigation: "Plus d’options de navigation",
  },
  es: {
    toggleMenu: "Mostrar u ocultar el menú",
    moreNavigation: "Más opciones de navegación",
  },
  it: {
    toggleMenu: "Mostra o nascondi il menu",
    moreNavigation: "Altre opzioni di navigazione",
  },
});
