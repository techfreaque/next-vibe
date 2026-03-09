import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Kampagnenverwaltung",
  tag: "Bounce-Verarbeitung",
  task: {
    description:
      "IMAP-Posteingang nach Bounce-Benachrichtigungen durchsuchen und Lead-Status auf BOUNCED setzen",
  },
  post: {
    title: "Bounce-Verarbeitung",
    description: "E-Mail-Bounce-Benachrichtigungen aus IMAP verarbeiten",
    container: {
      title: "Bounce-Verarbeitung",
      description:
        "Durchsucht IMAP nach Bounce-Benachrichtigungen und unterdrückt bounced Leads",
    },
    fields: {
      dryRun: {
        label: "Testlauf",
        description: "Ausführen ohne Änderungen vorzunehmen",
      },
      batchSize: {
        label: "Batch-Größe",
        description: "Maximale Anzahl von Bounce-E-Mails pro Durchlauf",
      },
    },
    response: {
      bouncesFound: "Bounces gefunden",
      leadsUpdated: "Leads aktualisiert",
      campaignsCancelled: "Kampagnen abgebrochen",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verboten",
      },
      server: {
        title: "Serverfehler",
        description: "Fehler bei der Bounce-Verarbeitung",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
    },
    success: {
      title: "Bounce-Verarbeitung abgeschlossen",
      description: "Bounce-Benachrichtigungen erfolgreich verarbeitet",
    },
  },
};
