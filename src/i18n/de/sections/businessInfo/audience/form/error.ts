import type { errorTranslations as EnglishErrorTranslations } from "../../../../../en/sections/businessInfo/audience/form/error";

export const errorTranslations: typeof EnglishErrorTranslations = {
  title: "Fehler beim Speichern der Zielgruppen-Informationen",
  description:
    "Ihre Zielgruppen-Informationen konnten nicht aktualisiert werden",
  validation: {
    title: "Zielgruppen-Validierung fehlgeschlagen",
    description:
      "Bitte überprüfen Sie Ihre Zielgruppen-Informationen und versuchen Sie es erneut",
  },
  unauthorized: {
    title: "Zugriff verweigert",
    description:
      "Sie haben keine Berechtigung, Zielgruppen-Informationen zu aktualisieren",
  },
  server: {
    title: "Server-Fehler",
    description:
      "Zielgruppen-Informationen konnten aufgrund eines Server-Fehlers nicht gespeichert werden",
  },
  unknown: {
    title: "Unerwarteter Fehler",
    description:
      "Ein unerwarteter Fehler ist beim Speichern der Zielgruppen-Informationen aufgetreten",
  },
};
