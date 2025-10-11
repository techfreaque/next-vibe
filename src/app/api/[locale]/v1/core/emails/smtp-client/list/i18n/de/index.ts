import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "SMTP-Konten auflisten",
  description: "Paginierte Liste von SMTP-Konten mit Filteroptionen abrufen",

  errors: {
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Admin-Zugriff erforderlich für SMTP-Konten-Liste",
    },
    validation: {
      title: "Validierungsfehler",
      description: "Ungültige Filterparameter",
    },
    server: {
      title: "Serverfehler",
      description: "Fehler beim Abrufen der SMTP-Konten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unerwarteter Fehler ist aufgetreten",
    },
  },

  success: {
    title: "SMTP-Konten abgerufen",
    description: "SMTP-Konten-Liste erfolgreich abgerufen",
  },
};
