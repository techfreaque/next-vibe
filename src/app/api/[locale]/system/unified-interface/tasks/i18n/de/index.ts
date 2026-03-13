import { translations as cronTranslations } from "../../cron/i18n/de";
import { translations as pulseTranslations } from "../../pulse/i18n/de";
import { translations as unifiedRunnerTranslations } from "../../unified-runner/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Aufgabenverwaltung",
  tags: {
    tasks: "Aufgaben",
  },
  type: {
    cron: "Cron-Aufgabe",
    side: "Hintergrund-Aufgabe",
    task_runner: "Task Runner",
  },
  priority: {
    critical: "Kritisch",
    high: "Hoch",
    medium: "Mittel",
    low: "Niedrig",
    background: "Hintergrund",
    filter: {
      all: "Alle Prioritäten",
      highAndAbove: "Hoch und höher",
      mediumAndAbove: "Mittel und höher",
    },
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
    filter: {
      all: "Alle Status",
      active: "Aktiv",
      error: "Fehlerzustände",
    },
  },
  taskCategory: {
    development: "Entwicklung",
    build: "Build",
    watch: "Überwachung",
    generator: "Generator",
    test: "Test",
    maintenance: "Wartung",
    database: "Datenbank",
    system: "System",
    monitoring: "Monitoring",
    leadManagement: "Lead-Verwaltung",
  },
  enabledFilter: {
    all: "Alle",
    enabled: "Aktiviert",
    disabled: "Deaktiviert",
  },
  hiddenFilter: {
    visible: "Sichtbar",
    hidden: "Versteckt",
    all: "Alle",
  },
  sort: {
    asc: "Aufsteigend",
    desc: "Absteigend",
  },
  pulse: {
    health: {
      healthy: "Gesund",
      warning: "Warnung",
      critical: "Kritisch",
      unknown: "Unbekannt",
    },
    execution: {
      success: "Erfolg",
      failure: "Fehler",
      timeout: "Zeitüberschreitung",
      cancelled: "Abgebrochen",
      pending: "Ausstehend",
    },
  },
  cron: {
    frequency: {
      everyMinute: "jede Minute",
      everyMinutes: "alle {interval} Minuten",
      everyHour: "jede Stunde",
      everyDays: "jeden Tag",
      hourly: "stündlich",
    },
    days: {
      sunday: "Sonntag",
      monday: "Montag",
      tuesday: "Dienstag",
      wednesday: "Mittwoch",
      thursday: "Donnerstag",
      friday: "Freitag",
      saturday: "Samstag",
    },
    common: {
      dailyAtMidnight: "täglich um Mitternacht",
      dailyAtNoon: "täglich um Mittag",
      weeklyOnSunday: "wöchentlich am Sonntag",
      monthlyOnFirst: "monatlich am 1.",
      everyFiveMinutes: "alle 5 Minuten",
      everyThreeMinutes: "alle 3 Minuten",
      everyOneMinutes: "jede Minute",
      everyTenMinutes: "alle 10 Minuten",
      everyFifteenMinutes: "alle 15 Minuten",
      everyThirtyMinutes: "alle 30 Minuten",
    },
    patterns: {
      everyIntervalMinutes: "alle {interval} Minuten",
      everyIntervalMinutesStarting: "alle {interval} Minuten ab Minute {start}",
      atMinutes: "bei Minuten {minutes}",
      fromMinuteToMinute: "von Minute {from} bis {to}",
      atMinute: "bei Minute {minute}",
      everyIntervalHours: "alle {interval} Stunden",
      everyIntervalHoursStarting: "alle {interval} Stunden ab Stunde {start}",
      atHours: "bei Stunden {hours}",
      fromHourToHour: "von Stunde {from} bis {to}",
      atHour: "bei Stunde {hour}",
    },
    calendar: {
      onDays: "an Tagen {days}",
      onDay: "an Tag {day}",
      inMonths: "in {months}",
      inMonth: "in {month}",
      onWeekdays: "an {weekdays}",
      fromWeekdayToWeekday: "von {from} bis {to}",
      onWeekday: "an {weekday}",
    },
    timezone: "in {timezone}",
    time: {
      midnight: "Mitternacht",
      noon: "Mittag",
      hourAm: "{hour} Uhr",
      hourPm: "{hour} Uhr",
      hourMinuteAm: "{hour}:{minute} Uhr",
      hourMinutePm: "{hour}:{minute} Uhr",
    },
    weekdays: {
      sunday: "Sonntag",
      monday: "Montag",
      tuesday: "Dienstag",
      wednesday: "Mittwoch",
      thursday: "Donnerstag",
      friday: "Freitag",
      saturday: "Samstag",
    },
    months: {
      january: "Januar",
      february: "Februar",
      march: "März",
      april: "April",
      may: "Mai",
      june: "Juni",
      july: "Juli",
      august: "August",
      september: "September",
      october: "Oktober",
      november: "November",
      december: "Dezember",
    },
  },
  errors: {
    // Cron Tasks errors
    fetchCronTasks: "Fehler beim Abrufen der Cron-Aufgaben",
    createCronTask: "Fehler beim Erstellen der Cron-Aufgabe",
    updateCronTask: "Fehler beim Aktualisieren der Cron-Aufgabe",
    deleteCronTask: "Fehler beim Löschen der Cron-Aufgabe",
    fetchCronTaskHistory: "Fehler beim Abrufen der Cron-Aufgaben-Historie",
    fetchCronTaskStats: "Fehler beim Abrufen der Cron-Aufgaben-Statistiken",
    fetchCronStatus: "Fehler beim Abrufen des Cron-System-Status",
    cronTaskNotFound: "Cron-Aufgabe nicht gefunden",

    // Unified Runner errors
    startTaskRunner: "Fehler beim Starten des Task Runners",
    stopTaskRunner: "Fehler beim Stoppen des Task Runners",
    getTaskRunnerStatus: "Fehler beim Abrufen des Task Runner Status",
    executeCronTask: "Fehler beim Ausführen der Cron-Aufgabe",

    // Pulse errors
    executePulse: "Fehler beim Ausführen des Pulse",
    fetchPulseStatus: "Fehler beim Abrufen des Pulse-Status",
    pulseExecutionFailed: "Pulse-Ausführung fehlgeschlagen",
    pulseInternalError: "Interner Fehler im Pulse-System",

    // Validation errors
    invalidTaskInput:
      "Task-Eingabe stimmt nicht mit dem Anforderungsschema des Endpunkts überein",
    endpointNotFound: "Endpunkt für die angegebene Route-ID nicht gefunden",

    // Repository errors
    repositoryNotFound: "Ressource nicht gefunden",
    repositoryInternalError: "Ein interner Fehler ist aufgetreten",
    repositoryGetTaskForbidden:
      "Sie haben keine Berechtigung, diese Aufgabe anzuzeigen",
    repositoryUpdateTaskForbidden:
      "Sie haben keine Berechtigung, diese Aufgabe zu aktualisieren",
    repositoryDeleteTaskForbidden:
      "Sie haben keine Berechtigung, diese Aufgabe zu löschen",

    // Task sync errors
    taskSyncListFailed: "Fehler beim Auflisten der Aufgaben für die Sync",
    taskSyncSyncFailed:
      "Fehler beim Synchronisieren der Aufgaben vom Remote-Server",
  },
  common: {
    cronRepositoryTaskUpdateFailed:
      "Fehler beim Aktualisieren der Cron-Aufgabe",
    cronRepositoryTaskDeleteFailed: "Fehler beim Löschen der Cron-Aufgabe",
    cronRepositoryExecutionCreateFailed:
      "Fehler beim Erstellen der Cron-Aufgabenausführung",
    cronRepositoryExecutionUpdateFailed:
      "Fehler beim Aktualisieren der Cron-Aufgabenausführung",
    cronRepositoryExecutionsFetchFailed:
      "Fehler beim Abrufen der Cron-Aufgabenausführungen",
    cronRepositoryRecentExecutionsFetchFailed:
      "Fehler beim Abrufen der letzten Cron-Aufgabenausführungen",
    cronRepositorySchedulesFetchFailed:
      "Fehler beim Abrufen der Cron-Aufgabenpläne",
    cronRepositoryScheduleUpdateFailed:
      "Fehler beim Aktualisieren des Cron-Aufgabenplans",
    cronRepositoryStatisticsFetchFailed:
      "Fehler beim Abrufen der Cron-Aufgabenstatistiken",
  },
  outputMode: {
    storeOnly: "Nur speichern",
    notifyOnFailure: "Bei Fehler benachrichtigen",
    notifyAlways: "Immer benachrichtigen",
  },
  dbHealthCheck: {
    name: "db-health-check",
    description: "Überprüft die Datenbankverbindungsgesundheit jede Minute",
  },
  pulseRunner: {
    name: "pulse-runner",
    description:
      "Ruft das Pulse-Repository einmal pro Minute auf, um geplante Aufgaben auszulösen",
  },
  devWatcher: {
    name: "dev-file-watcher",
    description:
      "Überwacht Dateiänderungen und löst Generatoren im Entwicklungsmodus aus",
  },
  dbHealth: {
    tag: "Datenbank",
    post: {
      title: "DB-Gesundheitsprüfung",
      description: "Datenbankverbindung prüfen",
      container: {
        title: "Datenbankgesundheit",
        description: "Datenbankverbindung überprüfen",
      },
      response: {
        healthy: "Gesund",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff verweigert",
        },
        server: {
          title: "Serverfehler",
          description: "Datenbankgesundheitsprüfung fehlgeschlagen",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Anfrageparameter",
        },
      },
      success: {
        title: "DB gesund",
        description: "Datenbankverbindung ist gesund",
      },
    },
  },
  taskSync: {
    name: "task-sync",
    description:
      "Ruft regelmäßig neue Aufgaben von der entfernten Thea-Instanz ab",
    post: {
      title: "Aufgaben synchronisieren",
      description: "Aufgaben von entfernter Thea-Instanz synchronisieren",
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Anfrageparameter",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        internal: {
          title: "Interner Fehler",
          description: "Aufgabensynchronisierung fehlgeschlagen",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff verweigert",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Ressource nicht gefunden",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkfehler aufgetreten",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        unsaved: {
          title: "Ungespeicherte Änderungen",
          description: "Ungespeicherte Änderungen erkannt",
        },
        conflict: {
          title: "Konflikt",
          description: "Ein Konflikt ist aufgetreten",
        },
      },
      success: {
        title: "Aufgaben synchronisiert",
        description: "Aufgaben erfolgreich synchronisiert",
      },
    },
    pull: {
      post: {
        title: "Aufgaben abrufen",
        description: "Aufgaben von entfernter Thea-Instanz abrufen",
        errors: {
          validation: {
            title: "Validierungsfehler",
            description: "Ungültige Anfrageparameter",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Authentifizierung erforderlich",
          },
          internal: {
            title: "Interner Fehler",
            description: "Aufgabenabruf fehlgeschlagen",
          },
          forbidden: {
            title: "Verboten",
            description: "Zugriff verweigert",
          },
          notFound: {
            title: "Nicht gefunden",
            description: "Ressource nicht gefunden",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Netzwerkfehler aufgetreten",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unerwarteter Fehler ist aufgetreten",
          },
          unsaved: {
            title: "Ungespeicherte Änderungen",
            description: "Ungespeicherte Änderungen erkannt",
          },
          conflict: {
            title: "Konflikt",
            description: "Ein Konflikt ist aufgetreten",
          },
        },
        success: {
          title: "Aufgaben abgerufen",
          description: "Aufgaben erfolgreich abgerufen",
        },
      },
    },
  },
  completeTask: {
    post: {
      title: "Aufgabe abschließen",
      description:
        "Markiert eine Cron-Aufgabe als abgeschlossen oder fehlgeschlagen und meldet das Ergebnis an die Ursprungsinstanz. Dev-only MCP-Tool für interaktive Claude Code-Sitzungen. Wenn Thea eine Aufgabe für Hermes erstellt, ruft Claude Code dieses Tool auf, nachdem der Benutzer die Fertigstellung bestätigt hat.",
      fields: {
        taskId: {
          title: "Aufgaben-ID",
          description: "Die Cron-Aufgaben-Datenbank-ID zum Abschließen.",
        },
        status: {
          title: "Status",
          description:
            "Endstatus: 'completed' für Erfolg, 'failed' für Fehler, 'cancelled' zum Abbrechen.",
        },
        summary: {
          title: "Zusammenfassung",
          description:
            "Kurze Beschreibung des Ergebnisses oder der Fehlerursache.",
        },
        output: {
          title: "Ausgabe-Daten",
          description:
            "Optionale strukturierte Daten (Schlüssel-Wert-Paare) als Ergebnisanhang.",
        },
        completed: {
          title: "Abgeschlossen",
          description:
            "Ob die Aufgabe erfolgreich als erledigt markiert wurde.",
        },
        pushedToRemote: {
          title: "An Remote gesendet",
          description:
            "Ob der Abschluss erfolgreich an die Ursprungsinstanz gemeldet wurde.",
        },
        updatedAt: {
          title: "Aktualisiert am",
          description: "Zeitstempel der Statusaktualisierung.",
        },
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Aufgaben-ID oder Statuswert",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        internal: {
          title: "Abschluss fehlgeschlagen",
          description: "Aufgabe konnte nicht als abgeschlossen markiert werden",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff verweigert",
        },
        notFound: {
          title: "Aufgabe nicht gefunden",
          description: "Keine Aufgabe mit der angegebenen ID gefunden",
        },
        network: {
          title: "Netzwerkfehler",
          description:
            "Abschluss konnte nicht an Remote-Instanz gesendet werden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        unsaved: {
          title: "Ungespeicherte Änderungen",
          description: "Ungespeicherte Änderungen erkannt",
        },
        conflict: {
          title: "Konflikt",
          description:
            "Aufgabe befindet sich nicht in einem abschließbaren Zustand",
        },
      },
      success: {
        title: "Aufgabe abgeschlossen",
        description:
          "Aufgabe als erledigt markiert und Ergebnis an Ursprungsinstanz gesendet",
      },
    },
  },
  taskReport: {
    post: {
      title: "Aufgabenergebnis melden",
      description:
        "Nimmt Ausführungsergebnisse von einer entfernten Instanz entgegen. Wird von Dev-Instanzen aufgerufen, um Aufgabenabschlüsse an die Prod-Instanz zu melden.",
      fields: {
        apiKey: {
          title: "API-Schlüssel",
          description: "Gemeinsamer Schlüssel zur Instanz-Authentifizierung.",
        },
        taskId: {
          title: "Aufgaben-ID",
          description: "Die eindeutige ID der abgeschlossenen Aufgabe.",
        },
        executionId: {
          title: "Ausführungs-ID",
          description: "Eindeutige Ausführungskennung zur Deduplizierung.",
        },
        status: {
          title: "Status",
          description: "Endgültiger Ausführungsstatus.",
        },
        durationMs: {
          title: "Dauer (ms)",
          description: "Gesamte Ausführungszeit in Millisekunden.",
        },
        summary: {
          title: "Zusammenfassung",
          description:
            "Menschenlesbare Zusammenfassung des Ausführungsergebnisses.",
        },
        error: {
          title: "Fehler",
          description: "Fehlermeldung bei fehlgeschlagener Aufgabe.",
        },
        serverTimezone: {
          title: "Server-Zeitzone",
          description:
            "IANA-Zeitzone des ausführenden Servers (z.B. Europe/Vienna).",
        },
        executedByInstance: {
          title: "Ausgeführt von",
          description:
            "Instanz-ID, die die Aufgabe ausgeführt hat (z.B. hermes).",
        },
        output: {
          title: "Ausgabe",
          description: "Strukturierte Ausführungsausgabe.",
        },
        startedAt: {
          title: "Gestartet um",
          description: "ISO-Zeitstempel des Ausführungsbeginns.",
        },
        processed: {
          title: "Verarbeitet",
          description: "Ob der Bericht akzeptiert und angewendet wurde.",
        },
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Berichts-Nutzdaten",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Ungültiger API-Schlüssel",
        },
        internal: {
          title: "Interner Fehler",
          description: "Verarbeitung des Berichts fehlgeschlagen",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff verweigert",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Aufgabe auf dieser Instanz nicht gefunden",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkfehler aufgetreten",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        unsaved: {
          title: "Ungespeicherte Änderungen",
          description: "Ungespeicherte Änderungen erkannt",
        },
        conflict: {
          title: "Konflikt",
          description: "Ein Konflikt ist aufgetreten",
        },
      },
      success: {
        title: "Bericht akzeptiert",
        description: "Ausführungsergebnis auf den Aufgabendatensatz angewendet",
      },
    },
  },
  waitForTask: {
    post: {
      title: "Auf Aufgabe warten",
      description:
        "Wartet auf eine ausstehende Hintergrundaufgabe. Gibt das Ergebnis sofort zurück, falls bereits abgeschlossen, oder pausiert den KI-Stream bis die Aufgabe fertig ist.",
      fields: {
        taskId: {
          title: "Aufgaben-ID",
          description: "Die ID der Aufgabe, auf die gewartet werden soll.",
        },
        status: {
          title: "Status",
          description: "Aktueller Aufgabenstatus.",
        },
        result: {
          title: "Ergebnis",
          description:
            "Ergebnis-Payload der Aufgabe (vorhanden wenn abgeschlossen).",
        },
        waiting: {
          title: "Wartend",
          description:
            "True wenn der Stream pausiert und auf die Aufgabe wartet.",
        },
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Aufgaben-ID",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        internal: {
          title: "Interner Fehler",
          description: "Fehler beim Registrieren des Wartenden",
        },
        forbidden: { title: "Verboten", description: "Zugriff verweigert" },
        notFound: {
          title: "Aufgabe nicht gefunden",
          description: "Keine Aufgabe mit dieser ID gefunden",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkfehler aufgetreten",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        unsaved: {
          title: "Ungespeicherte Änderungen",
          description: "Ungespeicherte Änderungen erkannt",
        },
        conflict: {
          title: "Konflikt",
          description: "Ein Konflikt ist aufgetreten",
        },
      },
      success: {
        title: "Aufgabenergebnis bereit",
        description: "Aufgabe abgeschlossen oder Wartender registriert",
      },
    },
  },
  errorMonitor: {
    name: "error-monitor",
    description: "Durchsucht Chat-Threads alle 3 Stunden nach Fehlermustern",
    tag: "Überwachung",
    post: {
      title: "Fehlermonitor",
      description:
        "Datenschutzfreundliche Fehlerüberwachung - durchsucht Nachrichten nach Fehlermustern ohne Inhalte zu lesen",
      container: {
        title: "Fehlerscan-Ergebnisse",
        description: "Aggregierte Fehlermuster aus Chat-Nachrichten",
      },
      response: {
        errorsFound: "Gefundene Fehler",
        threadsScanned: "Gescannte Threads",
        scanWindowFrom: "Scanfenster-Start",
        scanWindowTo: "Scanfenster-Ende",
        patternType: "Fehlertyp",
        patternCount: "Anzahl",
        patternThreadIds: "Thread-IDs",
        patternModel: "Modell",
        patternTool: "Tool",
        patternFirstSeen: "Erstmals gesehen",
        patternLastSeen: "Zuletzt gesehen",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff verweigert",
        },
        server: {
          title: "Serverfehler",
          description: "Fehlerscan fehlgeschlagen",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Anfrageparameter",
        },
      },
      success: {
        title: "Scan abgeschlossen",
        description: "Fehlerscan erfolgreich abgeschlossen",
      },
    },
    cleanup: {
      name: "error-logs-cleanup",
      description:
        "Bereinigt Fehlerprotokolle älter als 6 Monate und begrenzt auf 100K Einträge",
      post: {
        title: "Fehlerprotokoll-Bereinigung",
        description:
          "Alte Fehlerprotokolleinträge löschen (zeitbasiert + anzahlbasiert) um die Datenbank schlank zu halten",
        container: {
          title: "Bereinigungsergebnisse",
          description: "Anzahl gelöschter Fehlerprotokolle",
        },
        response: {
          deletedCount: "Gelöschte Einträge",
          deletedByTime: "Gelöscht nach Zeit",
          deletedByCount: "Gelöscht nach Anzahlgrenze",
          retentionDays: "Aufbewahrungstage",
          maxRows: "Maximale Einträge",
        },
        success: {
          title: "Bereinigung abgeschlossen",
          description: "Alte Fehlerprotokolle erfolgreich bereinigt",
        },
      },
    },
  },
  csvProcessor: {
    description: "Verarbeitet CSV-Importaufträge in Blöcken",
  },
  imapSync: {
    description:
      "Synchronisiert IMAP-Konten, Ordner und Nachrichten automatisch",
  },
  newsletterUnsubscribeSync: {
    description: "Synchronisiert Lead-Status für Newsletter-Abmeldungen",
  },
  cronSystem: cronTranslations,
  pulseSystem: pulseTranslations,
  unifiedRunner: unifiedRunnerTranslations,
};
