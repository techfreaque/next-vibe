import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Kampagnen-Verwaltung",

  tag: "E-Mail-Kampagnen",
  task: {
    description:
      "Automatisierte E-Mail-Kampagnen an Leads basierend auf deren Phase und Timing senden",
  },
  post: {
    title: "E-Mail-Kampagnen",
    description: "E-Mail-Kampagnen verarbeiten",
    form: {
      title: "E-Mail-Kampagnen-Konfiguration",
      description: "E-Mail-Kampagnen-Parameter konfigurieren",
    },
    container: {
      title: "E-Mail-Kampagnen-Konfiguration",
      description: "E-Mail-Kampagnen-Parameter konfigurieren",
    },
    fields: {
      batchSize: {
        label: "Batch-Größe",
        description: "Anzahl der Leads pro Batch",
      },
      maxEmailsPerRun: {
        label: "Max. E-Mails pro Durchlauf",
        description: "Maximale Anzahl zu sendender E-Mails pro Durchlauf",
      },
      dryRun: {
        label: "Testlauf",
        description: "Ohne E-Mail-Versand ausführen",
      },
    },
    response: {
      title: "Antwort",
      description: "Antwortdaten",
      emailsScheduled: "Geplante E-Mails",
      emailsSent: "Gesendete E-Mails",
      emailsFailed: "Fehlgeschlagene E-Mails",
      leadsProcessed: "Verarbeitete Leads",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Vorgang erfolgreich abgeschlossen",
    },
  },
  widget: {
    title: "E-Mail-Kampagnen ausführen",
    description:
      "E-Mail-Kampagnenverarbeitung manuell auslösen. Verarbeitet ausstehende E-Mails basierend auf Lead-Phase und Timing.",
    runButton: "Jetzt ausführen",
    running: "Wird ausgeführt...",
    done: "Fertig",
  },
};
