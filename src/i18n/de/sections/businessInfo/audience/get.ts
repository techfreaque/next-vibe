import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/businessInfo/audience/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Zielgruppen-Validierung fehlgeschlagen",
      description: "Ungültige Anfrage-Parameter für den Abruf der Zielgruppe.",
    },
    unauthorized: {
      title: "Zugriff auf Zielgruppe verweigert",
      description:
        "Sie haben keine Berechtigung, auf Zielgruppen-Informationen zuzugreifen.",
    },
    server: {
      title: "Zielgruppen Server-Fehler",
      description:
        "Zielgruppen-Informationen konnten aufgrund eines Server-Fehlers nicht abgerufen werden.",
    },
    unknown: {
      title: "Abruf der Zielgruppe fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Abrufen der Zielgruppen-Informationen aufgetreten.",
    },
  },
  success: {
    title: "Zielgruppe abgerufen",
    description: "Zielgruppen-Informationen wurden erfolgreich abgerufen.",
  },
};
