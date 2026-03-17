import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "System",
  tags: {
    cron: "Cron",
    scheduling: "Planung",
  },
  get: {
    title: "Cron-Aufgabe abrufen",
    description: "Eine einzelne Cron-Aufgabe nach ID abrufen",
    container: {
      title: "Cron-Aufgabendetails",
      description: "Details einer bestimmten Cron-Aufgabe anzeigen",
    },
    fields: {
      id: {
        label: "Aufgaben-ID",
        description: "Eindeutige Kennung der Aufgabe",
      },
    },
    response: {
      task: {
        title: "Aufgabe",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die angegebene Aufgaben-ID ist ungültig",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie sind nicht berechtigt, diese Aufgabe anzuzeigen",
      },
      notFound: {
        title: "Aufgabe nicht gefunden",
        description: "Die angeforderte Aufgabe konnte nicht gefunden werden",
      },
      internal: {
        title: "Interner Serverfehler",
        description: "Beim Abrufen der Aufgabe ist ein Fehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, auf diese Aufgabe zuzugreifen",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Ein Netzwerkfehler ist aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      unsaved: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten",
      },
    },
    success: {
      retrieved: {
        title: "Aufgabe abgerufen",
        description: "Aufgabe erfolgreich abgerufen",
      },
    },
  },
  put: {
    title: "Cron-Aufgabe aktualisieren",
    description: "Eine bestehende Cron-Aufgabe aktualisieren",
    container: {
      title: "Cron-Aufgabe aktualisieren",
      description: "Aufgabeneinstellungen ändern",
    },
    fields: {
      id: {
        label: "Aufgaben-ID",
        description: "Eindeutige Kennung der Aufgabe",
      },
      displayName: {
        label: "Anzeigename",
        description: "Menschenlesbares Label für diese Aufgabe",
        placeholder: "Anzeigenamen eingeben",
      },
      outputMode: {
        label: "Ausgabemodus",
        description: "Wann Benachrichtigungen nach der Ausführung senden",
        placeholder: "Ausgabemodus auswählen",
      },
      description: {
        label: "Beschreibung",
        description: "Aufgabenbeschreibung",
        placeholder: "Aufgabenbeschreibung eingeben",
      },
      schedule: {
        label: "Zeitplan",
        description: "Cron-Zeitplanausdruck",
        placeholder: "*/5 * * * *",
      },
      enabled: {
        label: "Aktiviert",
        description: "Ob die Aufgabe aktiviert ist",
      },
      priority: {
        label: "Priorität",
        description: "Aufgabenpriorität",
        placeholder: "Priorität auswählen",
      },
      category: {
        label: "Kategorie",
        description: "Aufgabenkategorie",
        placeholder: "Kategorie auswählen",
      },
      timeout: {
        label: "Zeitüberschreitung",
        description: "Maximale Ausführungszeit in Sekunden",
        placeholder: "3600",
      },
      retries: {
        label: "Wiederholungen",
        description: "Anzahl der Wiederholungsversuche bei Fehler",
        placeholder: "3",
      },
      retryAttempts: {
        label: "Wiederholungsversuche",
        description: "Anzahl der Wiederholungsversuche bei Fehler",
      },
      retryDelay: {
        label: "Wiederholungsverzögerung (ms)",
        description: "Verzögerung zwischen Wiederholungen in Millisekunden",
        placeholder: "5000",
      },
      taskInput: {
        label: "Aufgabeneingabe",
        description: "JSON-Eingabedaten für die Aufgabe",
      },
      hidden: {
        label: "Versteckt",
        description:
          "Diese Aufgabe in KI-System-Prompts und Standard-Aufgabenlisten ausblenden",
      },
      runOnce: {
        label: "Einmal ausführen",
        description: "Diese Aufgabe nur einmal ausführen und dann deaktivieren",
      },
      targetInstance: {
        label: "Ziel-Instanz",
        description:
          "Instanz-ID, auf der diese Aufgabe ausgeführt werden soll. Leer lassen oder null setzen für alle Instanzen.",
        placeholder: "z.B. hermes, thea-prod",
      },
    },
    response: {
      task: {
        title: "Aktualisierte Aufgabe",
      },
      success: {
        title: "Erfolg",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die angegebenen Daten sind ungültig",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie sind nicht berechtigt, diese Aufgabe zu aktualisieren",
      },
      notFound: {
        title: "Aufgabe nicht gefunden",
        description:
          "Die zu aktualisierende Aufgabe konnte nicht gefunden werden",
      },
      internal: {
        title: "Interner Serverfehler",
        description:
          "Beim Aktualisieren der Aufgabe ist ein Fehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, diese Aufgabe zu aktualisieren",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Ein Netzwerkfehler ist aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      unsaved: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Beim Aktualisieren der Aufgabe ist ein Konflikt aufgetreten",
      },
    },
    submitButton: {
      label: "Aufgabe speichern",
      loadingText: "Speichern...",
    },
    success: {
      updated: {
        title: "Aufgabe aktualisiert",
        description: "Aufgabe erfolgreich aktualisiert",
      },
    },
  },
  delete: {
    title: "Cron-Aufgabe löschen",
    description: "Eine Cron-Aufgabe löschen",
    container: {
      title: "Cron-Aufgabe löschen",
      description: "Eine Aufgabe aus dem System entfernen",
    },
    fields: {
      id: {
        label: "Aufgaben-ID",
        description: "Eindeutige Kennung der zu löschenden Aufgabe",
      },
    },
    response: {
      success: {
        title: "Erfolg",
      },
      message: {
        title: "Nachricht",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die angegebene Aufgaben-ID ist ungültig",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie sind nicht berechtigt, diese Aufgabe zu löschen",
      },
      notFound: {
        title: "Aufgabe nicht gefunden",
        description: "Die zu löschende Aufgabe konnte nicht gefunden werden",
      },
      internal: {
        title: "Interner Serverfehler",
        description: "Beim Löschen der Aufgabe ist ein Fehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung, diese Aufgabe zu löschen",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Ein Netzwerkfehler ist aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      unsaved: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Aufgabe kann aufgrund eines Konflikts nicht gelöscht werden",
      },
    },
    success: {
      deleted: {
        title: "Aufgabe gelöscht",
        description: "Aufgabe erfolgreich gelöscht",
      },
    },
  },
  priority: {
    critical: "Kritisch",
    high: "Hoch",
    medium: "Mittel",
    low: "Niedrig",
    background: "Hintergrund",
  },
  status: {
    pending: "Ausstehend",
    running: "Läuft",
    completed: "Abgeschlossen",
    failed: "Fehlgeschlagen",
    timeout: "Zeitüberschreitung",
    cancelled: "Abgebrochen",
    skipped: "Übersprungen",
    blocked: "Blockiert",
    scheduled: "Geplant",
    stopped: "Gestoppt",
    error: "Fehler",
  },
  taskCategory: {
    development: "Entwicklung",
    build: "Build",
    watch: "Überwachen",
    generator: "Generator",
    test: "Test",
    maintenance: "Wartung",
    database: "Datenbank",
    system: "System",
    monitoring: "Überwachung",
  },
  outputMode: {
    storeOnly: "Nur speichern",
    notifyOnFailure: "Bei Fehler benachrichtigen",
    notifyAlways: "Immer benachrichtigen",
  },
  widget: {
    notFound: "Aufgabe nicht gefunden",
    never: "Nie",
    history: "Verlauf",
    edit: "Bearbeiten",
    delete: "Löschen",
    enabled: "Aktiviert",
    disabled: "Deaktiviert",
    identity: "Identität",
    id: "Aufgaben-ID",
    routeId: "Route-ID",
    displayName: "Anzeigename",
    version: "Version",
    category: "Kategorie",
    priority: "Priorität",
    schedule: "Zeitplan",
    timezone: "Zeitzone",
    createdAt: "Erstellt",
    updatedAt: "Aktualisiert",
    owner: "Eigentümer",
    ownerSystem: "System",
    ownerUser: "Benutzer",
    outputMode: "Ausgabemodus",
    outputModes: {
      storeOnly: "Nur speichern",
      notifyOnFailure: "Bei Fehler benachrichtigen",
      notifyAlways: "Immer benachrichtigen",
    },
    stats: {
      totalExecutions: "Gesamtausführungen",
      successful: "Erfolgreich",
      errors: "Fehler",
      successRate: "Erfolgsrate",
    },
    timingSection: "Zeitplan",
    timing: {
      avgDuration: "Ø Dauer",
      lastDuration: "Letzte Dauer",
      lastRun: "Letzter Lauf",
      nextRun: "Nächster Lauf",
      timeout: "Zeitlimit",
      retries: "Wiederholungen",
      retryDelay: "Wiederholungsverzögerung",
    },
    lastExecutionError: "Letzter Fehler",
    run: "Jetzt ausführen",
    runSuccess: "Aufgabe erfolgreich ausgeführt",
    running: "Wird ausgeführt...",
    refresh: "Aktualisieren",
    taskInput: {
      title: "Aufgabeneingabe",
      loading: "Endpunkt-Definition wird geladen...",
      notFound: "Endpunkt-Definition für diese Aufgabe nicht gefunden",
      empty: "Keine Eingabeparameter konfiguriert",
      editTitle: "Aufgaben-Eingabeparameter",
      editDescription:
        "Eingabeparameter für diesen Aufgaben-Endpunkt konfigurieren",
    },
  },
};
