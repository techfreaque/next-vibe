import type { translations as EnglishSearchTranslations } from "../../en/user/search";

export const translations: typeof EnglishSearchTranslations = {
  error: {
    validation: {
      title: "Validierungsfehler",
      description:
        "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut.",
    },
    unauthorized: {
      title: "Unbefugter Zugriff",
      description: "Sie haben keine Berechtigung für diese Aktion.",
    },
    server: {
      title: "Serverfehler",
      description:
        "Ein Serverfehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unerwarteter Fehler ist aufgetreten.",
    },
  },
  success: {
    title: "Suche erfolgreich",
    description: "Benutzer erfolgreich gefunden.",
  },
};
