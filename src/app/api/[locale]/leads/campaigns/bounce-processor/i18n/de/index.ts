import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Kampagnenverwaltung",
  tag: "Bounce-Verarbeitung",
  task: {
    description:
      "IMAP-Posteingang nach Bounce-Benachrichtigungen durchsuchen und Lead-Status auf BOUNCED setzen",
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
    title: "Bounce-Verarbeitung",
    description: "E-Mail-Bounce-Benachrichtigungen aus IMAP verarbeiten",
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
        description: "Fehler bei der Bounce-Verarbeitung",
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
    backButton: {
      label: "Zurück",
    },
    submitButton: {
      label: "Einstellungen speichern",
      loadingText: "Wird gespeichert...",
    },
    success: {
      title: "Bounce-Verarbeitung abgeschlossen",
      description: "Bounce-Benachrichtigungen erfolgreich verarbeitet",
    },
  },
  get: {
    title: "Bounce-Verarbeitung-Konfiguration abrufen",
    description: "Bounce-Verarbeitung-Cron-Konfiguration laden",
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
      schedule: "Zeitplan",
      priority: "Priorität",
      timeout: "Timeout",
      retries: "Wiederholungen",
      retryDelay: "Wiederholungsverzögerung",
    },
    backButton: {
      label: "Zurück",
    },
    success: {
      title: "Konfiguration erfolgreich geladen",
      description: "Bounce-Verarbeitung-Konfiguration erfolgreich geladen",
    },
  },
  put: {
    title: "Bounce-Verarbeitung-Konfiguration",
    description: "Bounce-Verarbeitung-Cron-Konfiguration aktualisieren",
    enabled: {
      label: "Aktiviert",
      description: "Bounce-Verarbeitung-Cron-Task aktivieren oder deaktivieren",
    },
    dryRun: {
      label: "Testmodus",
      description: "Bounces suchen ohne Lead-Status zu aktualisieren",
    },
    batchSize: {
      label: "Batch-Größe",
      description: "Maximale Anzahl von Bounce-E-Mails pro Durchlauf (1–500)",
    },
    schedule: {
      label: "Zeitplan",
      description: "Cron-Ausdruck für die Bounce-Verarbeitung",
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
      description: "Bounce-Verarbeitung-Konfiguration erfolgreich gespeichert",
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
    title: "Bounce-Verarbeitung-Konfiguration",
    titleSaved: "Konfiguration gespeichert",
    saving: "Speichern...",
    save: "Einstellungen speichern",
    guidanceTitle: "Bounce-Verarbeitung-Cron konfigurieren",
    guidanceDescription:
      "Bounce-Verarbeitung-Cron-Task aktivieren/deaktivieren und Zeitplan sowie Batch-Einstellungen konfigurieren.",
    runButton: "Jetzt ausführen",
    running: "Wird ausgeführt...",
    done: "Fertig",
    sections: {
      general: "Allgemein",
      generalDescription:
        "Hauptsteuerung für Bounce-Verarbeitung-Task und Testmodus.",
      schedule: "Zeitplan",
      scheduleDescription: "Cron-Zeitplan für Bounce-Verarbeitung festlegen.",
      processing: "Verarbeitung",
      processingDescription:
        "Konfigurieren Sie, wie viele Bounce-E-Mails pro Durchlauf verarbeitet werden.",
      advanced: "Erweitert",
      advancedDescription:
        "Task-Ausführungseinstellungen wie Priorität, Timeouts und Wiederholungsverhalten.",
    },
  },
};
