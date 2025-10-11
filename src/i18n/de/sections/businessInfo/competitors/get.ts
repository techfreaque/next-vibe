import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/businessInfo/competitors/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Wettbewerber-Validierung fehlgeschlagen",
      description:
        "Ungültige Anfrage-Parameter für den Abruf der Wettbewerber.",
    },
    unauthorized: {
      title: "Zugriff auf Wettbewerber verweigert",
      description:
        "Sie haben keine Berechtigung, auf Wettbewerber-Informationen zuzugreifen.",
    },
    server: {
      title: "Wettbewerber Server-Fehler",
      description:
        "Wettbewerber-Informationen konnten aufgrund eines Server-Fehlers nicht abgerufen werden.",
    },
    unknown: {
      title: "Abruf der Wettbewerber fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Abrufen der Wettbewerber-Informationen aufgetreten.",
    },
  },
  success: {
    title: "Wettbewerber abgerufen",
    description: "Wettbewerber-Informationen wurden erfolgreich abgerufen.",
  },
};
