import type { errorTranslations as EnglishErrorTranslations } from "../../../../../en/sections/businessInfo/challenges/form/error";

export const errorTranslations: typeof EnglishErrorTranslations = {
  title: "Fehler beim Speichern der Herausforderungen",
  description:
    "Ihre Herausforderungen-Informationen konnten nicht aktualisiert werden",
  validation: {
    title: "Herausforderungen-Validierung fehlgeschlagen",
    description:
      "Bitte überprüfe Ihre Herausforderungen-Informationen und versuche es erneut",
  },
  unauthorized: {
    title: "Zugriff verweigert",
    description:
      "Sie haben keine Berechtigung, Herausforderungen-Informationen zu aktualisieren",
  },
  server: {
    title: "Server-Fehler",
    description:
      "Herausforderungen-Informationen konnten aufgrund eines Server-Fehlers nicht gespeichert werden",
  },
  unknown: {
    title: "Unerwarteter Fehler",
    description:
      "Ein unerwarteter Fehler ist beim Speichern der Herausforderungen-Informationen aufgetreten",
  },
};
