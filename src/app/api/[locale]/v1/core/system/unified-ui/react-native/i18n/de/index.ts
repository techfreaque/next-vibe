import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    missingUrlParam: "Fehlender URL-Parameter",
    urlConstructionFailed: "URL-Konstruktion fehlgeschlagen",
    validationFailed: "Validierung fehlgeschlagen",
    htmlResponseReceived: "HTML-Antwort statt JSON erhalten",
    networkError: "Netzwerkfehler aufgetreten",
  },
};
