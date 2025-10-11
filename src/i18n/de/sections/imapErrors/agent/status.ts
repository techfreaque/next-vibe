import type { statusTranslations as EnglishStatusTranslations } from "../../../../en/sections/imapErrors/agent/status";

export const statusTranslations: typeof EnglishStatusTranslations = {
  error: {
    unauthorized: {
      title: "Nicht autorisiert",
      description:
        "Sie sind nicht berechtigt, den Agent-Verarbeitungsstatus anzuzeigen.",
    },
    validation: {
      title: "Validierungsfehler",
      description: "Ungültige Parameter für die Statusabfrage angegeben.",
    },
    server: {
      title: "Serverfehler",
      description: "Fehler beim Abrufen des Agent-Verarbeitungsstatus.",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Unbekannter Fehler beim Abrufen des Status aufgetreten.",
    },
  },
  success: {
    title: "Status abgerufen",
    description: "Agent-Verarbeitungsstatus erfolgreich abgerufen.",
  },
};
