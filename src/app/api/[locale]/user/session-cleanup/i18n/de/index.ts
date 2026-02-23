export const translations = {
  category: "Benutzer",

  post: {
    title: "Sitzungsbereinigung",
    description: "Abgelaufene Benutzersitzungen und Token bereinigen",
    tag: "Sitzungsbereinigung",
    container: {
      title: "Sitzungsbereinigung",
      description: "Sitzungsbereinigung konfigurieren und ausführen",
    },
    fields: {
      sessionRetentionDays: {
        label: "Sitzungsaufbewahrungstage",
        description: "Anzahl der Tage zur Aufbewahrung von Sitzungen",
      },
      tokenRetentionDays: {
        label: "Token-Aufbewahrungstage",
        description: "Anzahl der Tage zur Aufbewahrung von Token",
      },
      batchSize: {
        label: "Stapelgröße",
        description: "Anzahl der Datensätze pro Stapel",
      },
      dryRun: {
        label: "Probelauf",
        description: "Ohne tatsächliches Löschen ausführen",
      },
    },
    response: {
      sessionsDeleted: "Gelöschte Sitzungen",
      tokensDeleted: "Gelöschte Token",
      totalProcessed: "Gesamt verarbeitet",
      executionTimeMs: "Ausführungszeit (ms)",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen Administrator sein",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verweigert",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Bereinigungskonfiguration",
      },
    },
    success: {
      title: "Sitzungsbereinigung abgeschlossen",
      description: "Sitzungen und Token erfolgreich bereinigt",
    },
  },
  task: {
    description:
      "Abgelaufene Benutzersitzungen bereinigen, um die Systemsicherheit zu gewährleisten",
    purpose:
      "Entfernt abgelaufene Sitzungen zur Erhaltung der Sicherheit und Leistung",
    impact:
      "Verbessert die Systemleistung und Sicherheit durch Entfernung veralteter Sitzungsdaten",
    rollback: "Rollback nicht anwendbar für Bereinigungsoperationen",
  },
  errors: {
    default: "Ein Fehler ist beim Bereinigen der Sitzungen aufgetreten",
    execution_failed: {
      title: "Sitzungsbereinigung fehlgeschlagen",
      description: "Fehler beim Bereinigen abgelaufener Sitzungen",
    },
    partial_failure: {
      title: "Teilweise Sitzungsbereinigung fehlgeschlagen",
      description: "Einige Sitzungen konnten nicht bereinigt werden",
    },
    unknown_error: {
      title: "Unbekannter Sitzungsbereinigungsfehler",
      description:
        "Ein unbekannter Fehler ist während der Sitzungsbereinigung aufgetreten",
    },
    invalid_session_retention: {
      title: "Ungültige Sitzungsaufbewahrung",
      description: "Ungültige Sitzungsaufbewahrungsdauer angegeben",
    },
    invalid_token_retention: {
      title: "Ungültige Token-Aufbewahrung",
      description: "Ungültige Token-Aufbewahrungsdauer angegeben",
    },
    invalid_batch_size: {
      title: "Ungültige Stapelgröße",
      description: "Ungültige Stapelgröße für Bereinigung angegeben",
    },
    validation_failed: {
      title: "Validierung fehlgeschlagen",
      description:
        "Validierung der Sitzungsbereinigungskonfiguration fehlgeschlagen",
    },
  },
  success: {
    title: "Sitzungsbereinigung abgeschlossen",
    description: "Abgelaufene Sitzungen erfolgreich bereinigt",
  },
  monitoring: {
    alertTrigger: "Sitzungsbereinigungsaufgabe fehlgeschlagen",
  },
  documentation: {
    overview:
      "Diese Aufgabe entfernt abgelaufene Benutzersitzungen aus dem System, um Sicherheit und Leistung zu gewährleisten",
  },
};
