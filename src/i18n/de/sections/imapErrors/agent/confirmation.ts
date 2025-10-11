import type { confirmationTranslations as EnglishConfirmationTranslations } from "../../../../en/sections/imapErrors/agent/confirmation";

export const confirmationTranslations: typeof EnglishConfirmationTranslations =
  {
    error: {
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie sind nicht berechtigt, auf Bestätigungsanfragen zu antworten.",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Bestätigungsantwortdaten angegeben.",
      },
      not_found: {
        title: "Bestätigung nicht gefunden",
        description: "Die Bestätigungsanfrage konnte nicht gefunden werden.",
      },
      conflict: {
        title: "Bestätigung bereits verarbeitet",
        description: "Diese Bestätigungsanfrage wurde bereits verarbeitet.",
      },
      expired: {
        title: "Bestätigung abgelaufen",
        description:
          "Diese Bestätigungsanfrage ist abgelaufen und kann nicht verarbeitet werden.",
      },
      server: {
        title: "Serverfehler",
        description: "Fehler beim Verarbeiten der Bestätigungsantwort.",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Unbekannter Fehler bei der Bestätigungsverarbeitung aufgetreten.",
      },
    },
    success: {
      approved: "Aktion genehmigt und erfolgreich ausgeführt",
      rejected: "Aktion erfolgreich abgelehnt",
    },
  };
