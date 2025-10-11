import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/imapErrors/config/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, die Konfiguration anzuzeigen.",
    },
    server: {
      title: "Server-Fehler",
      description: "Ein Fehler ist beim Abrufen der Konfiguration aufgetreten.",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Ein unbekannter Fehler ist beim Abrufen der Konfiguration aufgetreten.",
    },
  },
  success: {
    title: "Konfiguration abgerufen",
    description: "IMAP-Konfiguration wurde erfolgreich abgerufen.",
  },
};
