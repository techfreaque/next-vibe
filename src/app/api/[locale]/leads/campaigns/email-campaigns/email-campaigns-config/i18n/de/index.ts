export const translations = {
  category: "Kampagnen-Verwaltung",
  tags: {
    leads: "Leads",
    campaigns: "Kampagnen",
  },
  get: {
    title: "E-Mail-Kampagnen-Konfiguration laden",
    description: "E-Mail-Kampagnen-Cron-Task-Konfiguration abrufen",
    form: {
      title: "E-Mail-Kampagnen-Konfiguration",
      description: "E-Mail-Kampagnen-Konfigurationsdaten",
    },
    response: {
      title: "Konfigurationsantwort",
      description: "E-Mail-Kampagnen-Konfigurationsdaten",
      enabled: "Aktiviert",
      dryRun: "Testmodus",
      batchSize: "Batch-Größe",
      maxEmailsPerRun: "Max. E-Mails pro Lauf",
      schedule: "Zeitplan",
      priority: "Priorität",
      timeout: "Timeout",
      retries: "Wiederholungen",
      retryDelay: "Wiederholungsverzögerung",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      forbidden: { title: "Verboten", description: "Zugriff verweigert" },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
      conflict: { title: "Konflikt", description: "Datenkonflikt aufgetreten" },
    },
    success: {
      title: "Konfiguration geladen",
      description: "E-Mail-Kampagnen-Konfiguration erfolgreich geladen",
    },
  },
  post: {
    title: "E-Mail-Kampagnen-Konfiguration",
    description: "E-Mail-Kampagnen-Cron-Task konfigurieren",
    form: {
      title: "E-Mail-Kampagnen-Konfiguration",
      description: "Konfigurationsparameter festlegen",
    },
    enabled: {
      label: "Aktiviert",
      description: "E-Mail-Kampagnen-Cron-Task aktivieren oder deaktivieren",
    },
    dryRun: {
      label: "Testmodus",
      description: "E-Mails verarbeiten ohne sie zu senden",
    },
    batchSize: {
      label: "Batch-Größe",
      description: "Anzahl der Leads pro Batch (1–100)",
    },
    maxEmailsPerRun: {
      label: "Max. E-Mails pro Lauf",
      description: "Maximale Anzahl E-Mails pro Cron-Lauf (1–1000)",
    },
    schedule: {
      label: "Zeitplan",
      description: "Cron-Ausdruck für den Ausführungszeitplan",
    },
    priority: {
      label: "Priorität",
      description: "Prioritätsstufe für die Task-Ausführung",
    },
    timeout: {
      label: "Timeout (ms)",
      description: "Maximale Ausführungszeit in Millisekunden",
    },
    retries: {
      label: "Wiederholungen",
      description: "Anzahl der Wiederholungsversuche",
    },
    retryDelay: {
      label: "Wiederholungsverzögerung (ms)",
      description: "Verzögerung zwischen Wiederholungsversuchen",
    },
    response: {
      title: "Antwort",
      description: "E-Mail-Kampagnen-Konfiguration Antwortdaten",
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
        description: "Interner Serverfehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      forbidden: { title: "Verboten", description: "Zugriff verweigert" },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      conflict: { title: "Konflikt", description: "Datenkonflikt aufgetreten" },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Erfolgreich",
      description: "E-Mail-Kampagnen-Konfiguration gespeichert",
    },
  },
  priority: {
    critical: "Kritisch",
    high: "Hoch",
    medium: "Mittel",
    low: "Niedrig",
    background: "Hintergrund",
  },

  widget: {
    title: "E-Mail-Kampagnen-Konfiguration",
    titleSaved: "Konfiguration gespeichert",
    saving: "Speichern...",
    save: "Einstellungen speichern",
    guidanceTitle: "E-Mail-Kampagnen-Cron konfigurieren",
    guidanceDescription:
      "Cron-Task aktivieren/deaktivieren und Zeitplan, Batch-Größe und Ausführungseinstellungen festlegen.",
    sections: {
      general: "Allgemein",
      generalDescription: "Hauptsteuerung für Aktivierung und Testmodus.",
      schedule: "Zeitplan",
      scheduleDescription: "Cron-Zeitplan für den E-Mail-Versand festlegen.",
      processing: "Verarbeitung",
      processingDescription: "Konfigurieren Sie Leads und E-Mails pro Lauf.",
      advanced: "Erweitert",
      advancedDescription: "Priorität, Timeouts und Wiederholungsverhalten.",
    },
  },
};
