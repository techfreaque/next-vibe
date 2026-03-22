import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Kampagnen-Verwaltung",
  tag: "E-Mail-Kampagnen",
  task: {
    description:
      "Automatisierte E-Mail-Kampagnen an Leads basierend auf deren Phase und Timing senden",
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
    notFound: {
      title: "Nicht gefunden",
      description: "Ressource nicht gefunden",
    },
    conflict: {
      title: "Konflikt",
      description: "Datenkonflikt aufgetreten",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Es gibt ungespeicherte Änderungen",
    },
  },
  post: {
    title: "E-Mail-Kampagnen",
    description: "E-Mail-Kampagnen für Leads verarbeiten",
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: { title: "Verboten", description: "Zugriff verboten" },
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
      emailsScheduled: "Geplante E-Mails",
      emailsSent: "Gesendete E-Mails",
      emailsFailed: "Fehlgeschlagene E-Mails",
      leadsProcessed: "Verarbeitete Leads",
    },
    success: {
      title: "Erfolg",
      description: "Vorgang erfolgreich abgeschlossen",
    },
  },
  get: {
    title: "E-Mail-Kampagnen-Konfiguration abrufen",
    description: "E-Mail-Kampagnen-Cron-Konfiguration laden",
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: { title: "Verboten", description: "Zugriff verboten" },
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
    response: {
      enabled: "Aktiviert",
      dryRun: "Testmodus",
      batchSize: "Batch-Größe",
      maxEmailsPerRun: "Max. E-Mails pro Durchlauf",
      schedule: "Zeitplan",
      priority: "Priorität",
      timeout: "Timeout",
      retries: "Wiederholungen",
      retryDelay: "Wiederholungsverzögerung",
    },
    success: {
      title: "Konfiguration erfolgreich geladen",
      description: "E-Mail-Kampagnen-Konfiguration erfolgreich geladen",
    },
  },
  put: {
    title: "E-Mail-Kampagnen-Konfiguration",
    description: "E-Mail-Kampagnen-Cron-Konfiguration aktualisieren",
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
      description: "Anzahl der zu verarbeitenden Leads pro Batch (1–100)",
    },
    maxEmailsPerRun: {
      label: "Max. E-Mails pro Durchlauf",
      description:
        "Maximale Anzahl zu sendender E-Mails pro Cron-Durchlauf (1–1000)",
    },
    schedule: {
      label: "Zeitplan",
      description: "Cron-Ausdruck für die E-Mail-Kampagnen-Ausführung",
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
      description: "Anzahl der Wiederholungsversuche bei Fehler",
    },
    retryDelay: {
      label: "Wiederholungsverzögerung (ms)",
      description:
        "Verzögerung zwischen Wiederholungsversuchen in Millisekunden",
    },
    success: {
      title: "Konfiguration gespeichert",
      description: "E-Mail-Kampagnen-Konfiguration erfolgreich gespeichert",
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
      "E-Mail-Kampagnen-Cron-Task aktivieren/deaktivieren und Zeitplan, Batch-Größe konfigurieren.",
    runButton: "Jetzt ausführen",
    running: "Wird ausgeführt...",
    done: "Fertig",
    sections: {
      general: "Allgemein",
      generalDescription:
        "Hauptsteuerung für E-Mail-Kampagnen-Task und Testmodus.",
      schedule: "Zeitplan",
      scheduleDescription: "Cron-Zeitplan für E-Mail-Versand festlegen.",
      processing: "Verarbeitung",
      processingDescription:
        "Konfigurieren Sie, wie viele Leads und E-Mails pro Durchlauf verarbeitet werden.",
      advanced: "Erweitert",
      advancedDescription:
        "Task-Ausführungseinstellungen wie Priorität, Timeouts und Wiederholungsverhalten.",
    },
  },
};
