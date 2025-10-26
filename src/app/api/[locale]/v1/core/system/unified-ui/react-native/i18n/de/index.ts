import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  app: {
    _layout: {
      failedToLoadLayout: "Layout konnte nicht geladen werden",
    },
    index: {
      failedToLoadPage: "Seite konnte nicht geladen werden",
    },
  },
  utils: {
    "nextjs-compat-wrapper": {
      failedToLoadPage: "Seite konnte nicht geladen werden",
    },
  },
  errors: {
    missingUrlParam: "Erforderlicher URL-Parameter fehlt",
    urlConstructionFailed: "URL konnte nicht erstellt werden",
    validationFailed: "Validierung fehlgeschlagen",
    htmlResponseReceived: "HTML-Antwort statt JSON erhalten",
    networkError: "Netzwerkfehler aufgetreten",
  },
};
