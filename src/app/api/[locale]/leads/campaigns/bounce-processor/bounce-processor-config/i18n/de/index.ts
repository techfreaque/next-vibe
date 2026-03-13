export const translations = {
  category: "Kampagnen-Verwaltung",
  tags: {
    leads: "Leads",
    campaigns: "Kampagnen",
  },
  get: {
    title: "Bounce-Prozessor-Konfiguration laden",
    description: "Bounce-Prozessor-Cron-Task-Konfiguration abrufen",
    form: {
      title: "Bounce-Prozessor-Konfiguration",
      description: "Bounce-Prozessor-Konfigurationsdaten",
    },
    response: {
      title: "Konfigurationsantwort",
      description: "Bounce-Prozessor-Konfigurationsdaten",
      enabled: "Aktiviert",
      dryRun: "Testmodus",
      batchSize: "Batch-Größe",
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
      description: "Bounce-Prozessor-Konfiguration erfolgreich geladen",
    },
  },
  post: {
    title: "Bounce-Prozessor-Konfiguration",
    description: "Bounce-Prozessor-Cron-Task konfigurieren",
    form: {
      title: "Bounce-Prozessor-Konfiguration",
      description: "Konfigurationsparameter festlegen",
    },
    enabled: {
      label: "Aktiviert",
      description: "Bounce-Prozessor-Cron-Task aktivieren oder deaktivieren",
    },
    dryRun: {
      label: "Testmodus",
      description: "Bounces scannen ohne Lead-Status zu ändern",
    },
    batchSize: {
      label: "Batch-Größe",
      description: "Maximale Anzahl Bounce-E-Mails pro Lauf (1–500)",
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
      description: "Bounce-Prozessor-Konfiguration Antwortdaten",
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
      description: "Bounce-Prozessor-Konfiguration gespeichert",
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
    title: "Bounce-Prozessor-Konfiguration",
    titleSaved: "Konfiguration gespeichert",
    saving: "Speichern...",
    save: "Einstellungen speichern",
    guidanceTitle: "Bounce-Prozessor-Cron konfigurieren",
    guidanceDescription:
      "Cron-Task aktivieren/deaktivieren und Zeitplan und Batch-Einstellungen festlegen.",
    sections: {
      general: "Allgemein",
      generalDescription: "Hauptsteuerung für Aktivierung und Testmodus.",
      schedule: "Zeitplan",
      scheduleDescription:
        "Cron-Zeitplan für die Bounce-Verarbeitung festlegen.",
      processing: "Verarbeitung",
      processingDescription:
        "Anzahl der Bounce-E-Mails pro Lauf konfigurieren.",
      advanced: "Erweitert",
      advancedDescription: "Priorität, Timeouts und Wiederholungsverhalten.",
    },
  },
};
