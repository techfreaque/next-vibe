import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/businessInfo/challenges/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Herausforderungen-Validierung fehlgeschlagen",
      description:
        "Ungültige Anfrage-Parameter für den Abruf der Herausforderungen.",
    },
    unauthorized: {
      title: "Zugriff auf Herausforderungen verweigert",
      description:
        "Sie haben keine Berechtigung, auf Herausforderungen-Informationen zuzugreifen.",
    },
    server: {
      title: "Herausforderungen Server-Fehler",
      description:
        "Herausforderungen-Informationen konnten aufgrund eines Server-Fehlers nicht abgerufen werden.",
    },
    unknown: {
      title: "Abruf der Herausforderungen fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Abrufen der Herausforderungen-Informationen aufgetreten.",
    },
  },
  success: {
    title: "Herausforderungen abgerufen",
    description:
      "Herausforderungen-Informationen wurden erfolgreich abgerufen.",
  },
};
