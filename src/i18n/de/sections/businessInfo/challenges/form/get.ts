import type { getTranslations as EnglishGetTranslations } from "../../../../../en/sections/businessInfo/challenges/form/get";

export const getTranslations: typeof EnglishGetTranslations = {
  success: {
    title: "Herausforderungen-Informationen erfolgreich geladen",
    description:
      "Ihre geschäftlichen Herausforderungen-Informationen wurden abgerufen",
  },
  error: {
    validation: {
      title: "Herausforderungen-Validierungsfehler",
      description:
        "Ungültige Anfrageparameter zum Abrufen von Herausforderungen.",
    },
    unauthorized: {
      title: "Zugriff auf Herausforderungen verweigert",
      description:
        "Sie haben keine Berechtigung, auf Herausforderungsinformationen zuzugreifen.",
    },
    server: {
      title: "Herausforderungen-Serverfehler",
      description:
        "Herausforderungsinformationen können aufgrund eines Serverfehlers nicht abgerufen werden.",
    },
    unknown: {
      title: "Abrufen von Herausforderungen fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Abrufen der Herausforderungsinformationen aufgetreten.",
    },
  },
};
