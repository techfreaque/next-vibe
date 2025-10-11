import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/businessInfo/business/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Validierung der Unternehmensinformationen fehlgeschlagen",
      description:
        "Ungültige Anfrage-Parameter für den Abruf der Unternehmensinformationen.",
    },
    unauthorized: {
      title: "Zugriff auf Unternehmensinformationen verweigert",
      description:
        "Sie haben keine Berechtigung, auf Unternehmensinformationen zuzugreifen.",
    },
    server: {
      title: "Server-Fehler bei Unternehmensinformationen",
      description:
        "Unternehmensinformationen konnten aufgrund eines Server-Fehlers nicht abgerufen werden.",
    },
    unknown: {
      title: "Abruf der Unternehmensinformationen fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Abrufen der Unternehmensinformationen aufgetreten.",
    },
  },
  success: {
    title: "Unternehmensinformationen abgerufen",
    description: "Unternehmensinformationen wurden erfolgreich abgerufen.",
  },
};
