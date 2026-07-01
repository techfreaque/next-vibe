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
      everyMinutes: "alle {{interval}} Minuten",
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
      everyIntervalMinutes: "alle {{interval}} Minuten",
      everyIntervalMinutesStarting:
        "alle {{interval}} Minuten ab Minute {{start}}",
      atMinutes: "bei Minuten {{minutes}}",
      fromMinuteToMinute: "von Minute {{from}} bis {{to}}",
      atMinute: "bei Minute {{minute}}",
      everyIntervalHours: "alle {{interval}} Stunden",
      everyIntervalHoursStarting:
        "alle {{interval}} Stunden ab Stunde {{start}}",
      atHours: "bei Stunden {{hours}}",
      fromHourToHour: "von Stunde {{from}} bis {{to}}",
      atHour: "bei Stunde {{hour}}",
    },
    calendar: {
      onDays: "an Tagen {{days}}",
      onDay: "an Tag {{day}}",
      inMonths: "in {{months}}",
      inMonth: "in {{month}}",
      onWeekdays: "an {{days}}",
      fromWeekdayToWeekday: "von {{start}} bis {{end}}",
      onWeekday: "an {{day}}",
    },
    timezone: "in {{timezone}}",
    time: {
      midnight: "Mitternacht",
      noon: "Mittag",
      hourAm: "{{hour}} Uhr",
      hourPm: "{{hour}} Uhr",
      hourMinuteAm: "{{hour}}:{{minute}} Uhr",
      hourMinutePm: "{{hour}}:{{minute}} Uhr",
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
    fetchCronStatus: "Fehler beim Abrufen des Cron-Aufgaben-Status",
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
      title: "System-Gesundheitsprüfung",
      titleShort: "DB-Gesundheit",
      description: "Datenbank, Arbeitsspeicher und Festplatte prüfen",
      container: {
        title: "Systemgesundheit",
        description:
          "DB-Verbindung, Speicherauslastung und Festplattenauslastung",
      },
      response: {
        healthy: "Gesund",
        status: "Status",
        dbResponseMs: "DB-Antwortzeit (ms)",
        memoryUsedPct: "Speicher genutzt (%)",
        heapUsedMb: "Heap genutzt (MB)",
        rssMb: "RSS (MB)",
        diskUsedPct: "Festplatte genutzt (%)",
        uptimeHours: "Laufzeit (Stunden)",
        warnings: "Warnungen",
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
        systemAlert: "System {{status}}: {{warnings}}",
      },
      success: {
        title: "DB gesund",
        description: "Datenbankverbindung ist gesund",
      },
    },
  },
  completeTask: {
    post: {
      title: "Aufgabe abschließen",
      titleShort: "Task abschließen",
      description:
        "Markiert eine Hintergrundaufgabe als abgeschlossen. Der Coding-Agent ruft dies auf, wenn die asynchrone Arbeit fertig ist. Der KI-Stream wird mit dem Ergebnis fortgesetzt.",
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
          description: "Ein Netzwerkfehler ist aufgetreten",
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
        description: "Aufgabe als erledigt markiert und KI-Stream fortgesetzt",
      },
    },
  },
  waitForTask: {
    post: {
      title: "Auf Aufgabe warten",
      titleShort: "Auf Task warten",
      description:
        "Wartet auf eine ausstehende Cron-Aufgabe. Gibt das Ergebnis sofort zurück, falls bereits abgeschlossen, oder pausiert den KI-Stream bis die Aufgabe fertig ist.",
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
        originalToolName: {
          title: "Tool",
          description: "Das ursprünglich ausgeführte Tool.",
        },
        originalArgs: {
          title: "Argumente",
          description: "Die Eingabeargumente des ursprünglichen Tools.",
        },
      },
      widget: {
        noToolName: "Kein Toolname verfügbar.",
        resolving: "Tool wird aufgelöst...",
        unknownTool: "Unbekanntes Tool: {{toolName}}",
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
      status: {
        waiting: "Warte auf Aufgabe...",
        complete: "Aufgabe abgeschlossen",
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
        titleShort: "Logs bereinigen",
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
  cronSystem: {
    history: {
      category: "Aufgabenverwaltung",

      errors: {
        cronTaskNotFound: "Cron-Aufgabe nicht gefunden",
        repositoryInternalError: "Ein interner Fehler ist aufgetreten",
        fetchCronTaskHistory: "Fehler beim Abrufen der Cron-Aufgabenhistorie",
      },

      get: {
        tags: {
          tasks: "Aufgaben",
          monitoring: "Überwachung",
        },
        title: "Task-Ausführungsverlauf",
        description:
          "Historische Ausführungsaufzeichnungen für Cron-Tasks anzeigen",
        fields: {
          taskId: {
            label: "Task-ID",
            description: "Nach spezifischer Task-ID filtern",
            placeholder: "Task-ID eingeben",
          },
          taskName: {
            label: "Task-Name",
            description: "Nach Task-Namen filtern (Teilübereinstimmung)",
            placeholder: "Task-Namen eingeben",
          },
          status: {
            label: "Ausführungsstatus",
            description: "Nach Ausführungsstatus filtern",
            placeholder: "Status auswählen",
            options: {
              PENDING: "Ausstehend",
              SCHEDULED: "Geplant",
              RUNNING: "Läuft",
              COMPLETED: "Abgeschlossen",
              FAILED: "Fehlgeschlagen",
              ERROR: "Fehler",
              TIMEOUT: "Zeitüberschreitung",
              SKIPPED: "Übersprungen",
              CANCELLED: "Abgebrochen",
              STOPPED: "Gestoppt",
              BLOCKED: "Blockiert",
            },
          },
          priority: {
            label: "Task-Priorität",
            description: "Nach Task-Prioritätsstufe filtern",
            placeholder: "Prioritäten auswählen",
            options: {
              LOW: "Niedrig",
              MEDIUM: "Mittel",
              HIGH: "Hoch",
              CRITICAL: "Kritisch",
            },
          },
          startDate: {
            label: "Startdatum",
            description: "Ausführungen nach diesem Datum filtern",
          },
          endDate: {
            label: "Enddatum",
            description: "Ausführungen vor diesem Datum filtern",
          },
          limit: {
            label: "Ergebnislimit",
            description: "Maximale Anzahl der zurückzugebenden Ergebnisse",
            placeholder: "50",
          },
          offset: {
            label: "Ergebnisversatz",
            description:
              "Anzahl der zu überspringenden Ergebnisse für Paginierung",
            placeholder: "0",
          },
        },
        response: {
          title: "Task-Verlaufsantwort",
          description: "Historische Ausführungsdaten für Cron-Tasks",
          executions: {
            title: "Ausführungsaufzeichnungen",
          },
          totalCount: {
            title: "Gesamtanzahl",
          },
          hasMore: {
            title: "Weitere Ergebnisse vorhanden",
          },
          statusCounts: {
            title: "Statusanzahl",
          },
          summary: {
            title: "Ausführungszusammenfassung",
          },
        },
        errors: {
          validation: {
            title: "Validierungsfehler",
            description: "Ungültige Anfrageparameter angegeben",
          },
          internal: {
            title: "Interner Serverfehler",
            description: "Task-Verlauf konnte nicht abgerufen werden",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description:
              "Sie haben keine Berechtigung, den Task-Verlauf anzuzeigen",
          },
          notFound: {
            title: "Nicht gefunden",
            description: "Task oder Ausführungsaufzeichnung nicht gefunden",
          },
          network: {
            title: "Netzwerkfehler",
            description:
              "Netzwerkfehler beim Abrufen des Task-Verlaufs aufgetreten",
          },
          forbidden: {
            title: "Verboten",
            description: "Zugriff auf Task-Verlauf ist verboten",
          },
          server: {
            title: "Serverfehler",
            description: "Interner Serverfehler aufgetreten",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unbekannter Fehler ist aufgetreten",
          },
          unsavedChanges: {
            titleChanges: "Ungespeicherte Änderungen",
            title: "Ungespeicherte Änderungen",
            description: "Sie haben ungespeicherte Änderungen",
          },
          conflict: {
            title: "Konflikt",
            description: "Datenkonflikt aufgetreten",
          },
        },
        success: {
          title: "Verlauf abgerufen",
          description: "Task-Ausführungsverlauf erfolgreich abgerufen",
        },
        log: {
          fetchSuccess:
            "{{count}} Ausführungsaufzeichnungen erfolgreich abgerufen",
          fetchError: "Task-Ausführungsverlauf konnte nicht abgerufen werden",
        },
        request: {
          title: "Anfrageparameter",
          description: "Task-Ausführungsverlauf filtern",
        },
        unknownTask: "Unbekannter Task",
      },
      widget: {
        title: "Ausführungsverlauf",
        loading: "Verlauf wird geladen...",
        header: {
          tasks: "Aufgaben",
          stats: "Statistiken",
          pulse: "Pulse",
          refresh: "Aktualisieren",
        },
        summary: {
          total: "Gesamt",
          successful: "Erfolgreich",
          failed: "Fehlgeschlagen",
          successRate: "Erfolgsrate",
          avgDuration: "Ø Dauer",
        },
        search: {
          placeholder: "Aufgaben suchen...",
        },
        filter: {
          all: "Alle",
          running: "Laufend",
          completed: "Abgeschlossen",
          failed: "Fehlgeschlagen",
          timeout: "Zeitüberschreitung",
          cancelled: "Abgebrochen",
        },
        col: {
          taskName: "Aufgabenname",
          status: "Status",
          duration: "Dauer",
          started: "Gestartet",
          completed: "Abgeschlossen",
          environment: "Umgebung",
          error: "Fehler",
        },
        empty: "Kein Ausführungsverlauf gefunden",
        result: "Ergebnis",
        error: {
          collapse: "Fehler einklappen",
          label: "Fehler",
        },
        pagination: {
          info: "Seite {{page}} von {{totalPages}} ({{total}} gesamt)",
          prev: "Zurück",
          next: "Weiter",
        },
      },
    },
    stats: {
      category: "Aufgabenverwaltung",

      errors: {
        fetchCronTaskStats: "Fehler beim Abrufen der Cron-Aufgabenstatistiken",
      },

      get: {
        title: "Hintergrundaufgaben-Statistiken Abrufen",
        description:
          "Umfassende Statistiken und Metriken für Cron-Tasks abrufen",
        tag: "Hintergrund-Statistiken",
        form: {
          title: "Hintergrundaufgaben-Statistiken-Anfrage",
          description:
            "Parameter für das Abrufen von Cron-Task-Statistiken konfigurieren",
        },
        fields: {
          period: {
            title: "Zeitraum",
            description: "Zeitraum für die Statistik-Aggregation",
          },
          type: {
            title: "Statistik-Typ",
            description: "Typ der abzurufenden Statistiken",
          },
          taskId: {
            title: "Task-ID",
            description:
              "Optionale spezifische Task-ID zum Filtern der Statistiken",
          },
          limit: {
            title: "Ergebnis-Limit",
            description: "Maximale Anzahl der zurückzugebenden Ergebnisse",
          },
          timePeriod: {
            title: "Zeitraum",
          },
          dateRangePreset: {
            title: "Datumsbereich-Voreinstellung",
          },
          taskName: {
            title: "Task-Name",
          },
          taskStatus: {
            title: "Task-Status",
          },
          taskPriority: {
            title: "Task-Priorität",
          },
          healthStatus: {
            title: "Gesundheitsstatus",
          },
          minDuration: {
            title: "Mindestdauer",
          },
          maxDuration: {
            title: "Maximaldauer",
          },
          includeDisabled: {
            title: "Deaktivierte einbeziehen",
          },
          includeSystemTasks: {
            title: "Systemtasks einbeziehen",
          },
          hasRecentFailures: {
            title: "Hat kürzliche Fehler",
          },
          hasTimeout: {
            title: "Hat Timeout",
          },
          search: {
            title: "Suche",
          },
        },
        period: {
          hour: "Stündlich",
          day: "Täglich",
          week: "Wöchentlich",
          month: "Monatlich",
        },
        type: {
          overview: "Übersicht",
          performance: "Leistung",
          errors: "Fehler-Analyse",
          trends: "Trend-Analyse",
        },
        response: {
          totalTasks: { title: "Gesamtaufgaben" },
          executedTasks: { title: "Ausgeführte Aufgaben" },
          successfulTasks: { title: "Erfolgreiche Aufgaben" },
          failedTasks: { title: "Fehlgeschlagene Aufgaben" },
          averageExecutionTime: { title: "Ø Ausführungszeit (ms)" },
          totalExecutions: { title: "Gesamtausführungen" },
          executionsLast24h: { title: "Ausführungen letzte 24h" },
          successRate: { title: "Erfolgsrate (%)" },
          successfulExecutions: { title: "Erfolgreiche Ausführungen" },
          failedExecutions: { title: "Fehlgeschlagene Ausführungen" },
          failureRate: { title: "Fehlerrate (%)" },
          avgExecutionTime: { title: "Ø Ausführungszeit (ms)" },
          minExecutionTime: { title: "Min Ausführungszeit (ms)" },
          maxExecutionTime: { title: "Max Ausführungszeit (ms)" },
          medianExecutionTime: { title: "Median Ausführungszeit (ms)" },
          pendingExecutions: { title: "Ausstehende Ausführungen" },
          runningExecutions: { title: "Laufende Ausführungen" },
          activeTasks: { title: "Aktive Aufgaben" },
          systemStatus: { title: "Systemstatus" },
          uptime: { title: "Laufzeit" },
          healthyTasks: { title: "Gesunde Aufgaben" },
          degradedTasks: { title: "Beeinträchtigte Aufgaben" },
          systemLoad: { title: "Systemauslastung (%)" },
          queueSize: { title: "Warteschlangengröße" },
        },
        errors: {
          server: {
            title: "Server-Fehler",
            description:
              "Ein interner Server-Fehler ist beim Abrufen der Statistiken aufgetreten",
          },
          validation: {
            title: "Validierungsfehler",
            description: "Die bereitgestellten Parameter sind ungültig",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description:
              "Authentifizierung erforderlich für den Zugriff auf Statistiken",
          },
          forbidden: {
            title: "Verboten",
            description:
              "Unzureichende Berechtigungen für den Zugriff auf Statistiken",
          },
          notFound: {
            title: "Nicht gefunden",
            description:
              "Die angeforderten Statistiken konnten nicht gefunden werden",
          },
          conflict: {
            title: "Konflikt",
            description:
              "Ein Konflikt ist bei der Verarbeitung der Anfrage aufgetreten",
          },
          network: {
            title: "Netzwerk-Fehler",
            description:
              "Ein Netzwerk-Fehler ist beim Abrufen der Statistiken aufgetreten",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unbekannter Fehler ist aufgetreten",
          },
          unsavedChanges: {
            title: "Nicht gespeicherte Änderungen",
            description:
              "Es gibt nicht gespeicherte Änderungen, die bearbeitet werden müssen",
          },
        },
        success: {
          title: "Statistiken Abgerufen",
          description: "Hintergrundaufgaben-Statistiken erfolgreich abgerufen",
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
        title: "Hintergrund-Statistiken",
        loading: "Statistiken werden geladen...",
        viewTasks: "Aufgaben",
        viewHistory: "Verlauf",
        viewPulse: "Pulse",
        refresh: "Aktualisieren",
        totalTasks: "Gesamtaufgaben",
        executedTasks: "Ausgeführte Aufgaben",
        successfulTasks: "Erfolgreich",
        failedTasks: "Fehlgeschlagen",
        successRate: "Erfolgsrate",
        avgDuration: "Ø Dauer",
        overallSuccessRate: "Gesamterfolgsrate",
        activeTasks: "Aktive Aufgaben",
        runningExecutions: "Laufend",
        pendingExecutions: "Ausstehend",
        healthyTasks: "Gesunde Aufgaben",
        degradedTasks: "Beeinträchtigte Aufgaben",
        systemLoad: "Systemauslastung",
        queueSize: "Warteschlangengröße",
        executionsLast24h: "Letzte 24 Std",
        tasksByStatus: "Aufgaben nach Status",
        tasksByPriority: "Aufgaben nach Priorität",
        topPerforming: "Beste Aufgaben",
        problemTasks: "Problemaufgaben",
        recentActivity: "Aktuelle Aktivität",
        dailyStats: "Tagesstatistiken",
        systemStatus: {
          healthy: "Gesund",
          warning: "Warnung",
          critical: "Kritisch",
          unknown: "Unbekannt",
        },
        uptime: "Laufzeit",
        col: {
          rank: "#",
          taskName: "Aufgabenname",
          executions: "Ausführungen",
          avgDuration: "Ø Dauer",
          failures: "Fehler",
          failureRate: "Fehlerrate",
          date: "Datum",
          successes: "Erfolge",
          uniqueTasks: "Eindeutige Aufgaben",
        },
      },
    },
    task: {
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
            description:
              "Die angeforderte Aufgabe konnte nicht gefunden werden",
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
            description:
              "Diese Aufgabe nur einmal ausführen und dann deaktivieren",
          },
          targetInstance: {
            label: "Ziel-Instanz",
            description:
              "Instanz-ID, auf der diese Aufgabe ausgeführt werden soll. Leer lassen oder null setzen für alle Instanzen.",
            placeholder: "z.B. hermes, thea-prod",
          },
          lastExecutionStatus: {
            label: "Ausführungsstatus",
            description:
              "Letzten Ausführungsstatus überschreiben. Verwenden zum Zurücksetzen einer feststeckenden 'laufenden' Aufgabe.",
            placeholder: "Status auswählen",
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
            description:
              "Die zu löschende Aufgabe konnte nicht gefunden werden",
          },
          internal: {
            title: "Interner Serverfehler",
            description: "Beim Löschen der Aufgabe ist ein Fehler aufgetreten",
          },
          forbidden: {
            title: "Verboten",
            description:
              "Sie haben keine Berechtigung, diese Aufgabe zu löschen",
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
        background: "Cron",
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
        scheduleAutocomplete: {
          customBadge: "Benutzerdefiniert",
          noSchedulesFound: "Keine Zeitpläne gefunden",
          useCustomSchedule: "Benutzerdefinierten Zeitplan verwenden",
          commonSchedules: "Häufige Zeitpläne",
        },
        schedulePicker: {
          selectPlaceholder: "Zeitplan wählen...",
          customOption: "Eigener...",
          presets: {
            title: "Schnellauswahl",
            everyMinute: "Jede Minute",
            every5m: "Alle 5 Minuten",
            every15m: "Alle 15 Minuten",
            every30m: "Alle 30 Minuten",
            everyHour: "Stündlich",
            every2h: "Alle 2 Stunden",
            every4h: "Alle 4 Stunden",
            every6h: "Alle 6 Stunden",
            every12h: "Alle 12 Stunden",
            dailyMidnight: "Täglich um Mitternacht",
            daily6am: "Täglich um 6 Uhr",
            dailyNoon: "Täglich um Mittag",
            daily6pm: "Täglich um 18 Uhr",
            weeklyMon: "Wöchentlich montags",
            weeklySun: "Wöchentlich sonntags",
            monthlyFirst: "Am 1. jeden Monats",
          },
          custom: {
            title: "Eigener Zeitplan",
            repeatEvery: "Ausführen alle",
            at: "Um",
            onDays: "An",
            preview: "→ {{description}}",
            nextRun: "Nächste Ausführung: {{time}}",
            nextRunMultiple: "Nächste Ausführung: {{first}}, dann {{second}}",
            unit: {
              minutes: "Minuten",
              hours: "Stunden",
              days: "Tage",
              weeks: "Wochen",
              months: "Monate",
            },
            days: {
              mon: "Mo",
              tue: "Di",
              wed: "Mi",
              thu: "Do",
              fri: "Fr",
              sat: "Sa",
              sun: "So",
            },
            advanced: "Erweiterte Ausdrücke",
            advancedPlaceholder: "z.B. 0 9 * * 1-5",
            advancedInvalid: "Ungültiger Cron-Ausdruck",
          },
        },
      },
    },
    tasks: {
      category: "API Endpunkt",
      tags: {
        tasks: "Tasks",
        cron: "Cron",
        scheduling: "Planung",
      },
      errors: {
        fetchCronTasks: "Fehler beim Abrufen der Cron-Aufgaben",
        createCronTask: "Fehler beim Erstellen der Cron-Aufgabe",
        invalidTaskInput:
          "Task-Eingabe stimmt nicht mit dem Anforderungsschema des Endpunkts überein",
        endpointNotFound: "Endpunkt für die angegebene Route-ID nicht gefunden",
        targetInstanceForbidden:
          "Nur Administratoren können die Zielinstanz für Aufgaben festlegen",
      },
      list: {
        columns: {
          createdAt: "Erstellt am",
          updatedAt: "Aktualisiert am",
        },
      },
      get: {
        title: "Cron-Aufgaben auflisten",
        description: "Liste der Cron-Aufgaben mit optionaler Filterung abrufen",
        container: {
          title: "Cron-Aufgaben Liste",
          description: "Cron-Aufgaben filtern und anzeigen",
        },
        fields: {
          status: {
            label: "Status",
            description: "Nach Aufgabenstatus filtern",
            placeholder: "Status auswählen...",
          },
          priority: {
            label: "Priorität",
            description: "Nach Aufgabenpriorität filtern",
            placeholder: "Priorität auswählen...",
          },
          category: {
            label: "Kategorie",
            description: "Nach Aufgabenkategorie filtern",
            placeholder: "Kategorie auswählen...",
          },
          enabled: {
            label: "Status",
            description: "Nach Aktivierungsstatus filtern",
            placeholder: "Alle Aufgaben",
          },
          hidden: {
            label: "Sichtbarkeit",
            description:
              "Nach Sichtbarkeitsstatus filtern (Standard: nur sichtbare)",
            placeholder: "Sichtbare Aufgaben",
          },
          search: {
            label: "Suche",
            description:
              "Aufgaben nach Name, Route, Beschreibung oder Kategorie filtern",
            placeholder: "Aufgaben suchen...",
          },
          sort: {
            label: "Sortierung",
            description: "Sortierreihenfolge der Aufgabenliste",
          },
          limit: {
            label: "Limit",
            description: "Maximale Anzahl der zurückzugebenden Aufgaben",
          },
          offset: {
            label: "Offset",
            description: "Anzahl der zu überspringenden Aufgaben",
          },
        },
        response: {
          tasks: {
            title: "Aufgaben",
          },
          task: {
            title: "Aufgabe",
            description: "Individuelle Aufgabeninformationen",
            id: "Aufgaben-ID",
            name: "Aufgabenname",
            taskDescription: "Beschreibung",
            schedule: "Zeitplan",
            enabled: "Aktiviert",
            hidden: "Versteckt",
            priority: "Priorität",
            status: "Status",
            category: "Kategorie",
            lastRun: "Letzter Lauf",
            nextRun: "Nächster Lauf",
            version: "Version",
            timezone: "Zeitzone",
            timeout: "Zeitüberschreitung (ms)",
            retries: "Wiederholungen",
            retryDelay: "Wiederholungsverzögerung (ms)",
            lastExecutedAt: "Zuletzt ausgeführt am",
            lastExecutionStatus: "Status der letzten Ausführung",
            lastExecutionError: "Fehler der letzten Ausführung",
            lastExecutionDuration: "Dauer der letzten Ausführung (ms)",
            nextExecutionAt: "Nächste Ausführung am",
            executionCount: "Ausführungsanzahl",
            successCount: "Erfolgreiche Ausführungen",
            errorCount: "Fehleranzahl",
            averageExecutionTime: "Durchschnittliche Ausführungszeit (ms)",
            createdAt: "Erstellt am",
            updatedAt: "Aktualisiert am",
          },
          totalTasks: "Gesamtaufgaben",
        },
        errors: {
          internal: {
            title: "Interner Serverfehler beim Abrufen der Aufgaben",
            description:
              "Ein unerwarteter Fehler ist beim Abrufen der Aufgabenliste aufgetreten",
          },
          unauthorized: {
            title: "Unbefugter Zugriff auf Aufgabenliste",
            description:
              "Sie haben keine Berechtigung, die Aufgabenliste anzuzeigen",
          },
          validation: {
            title: "Ungültige Anfrageparameter",
            description: "Die bereitgestellten Anfrageparameter sind ungültig",
          },
          forbidden: {
            title: "Zugriff verboten",
            description: "Der Zugriff auf diese Ressource ist verboten",
          },
          notFound: {
            title: "Aufgaben nicht gefunden",
            description:
              "Es wurden keine Aufgaben gefunden, die den Kriterien entsprechen",
          },
          network: {
            title: "Netzwerkfehler",
            description:
              "Ein Netzwerkfehler ist beim Abrufen der Aufgaben aufgetreten",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unbekannter Fehler ist aufgetreten",
          },
          unsaved: {
            title: "Nicht gespeicherte Änderungen",
            description:
              "Es gibt nicht gespeicherte Änderungen, die bearbeitet werden müssen",
          },
          conflict: {
            title: "Konfliktfehler",
            description:
              "Ein Konflikt ist bei der Verarbeitung der Anfrage aufgetreten",
          },
        },
        success: {
          retrieved: {
            title: "Aufgaben erfolgreich abgerufen",
            description: "Die Aufgabenliste wurde erfolgreich abgerufen",
          },
        },
      },
      post: {
        title: "Cron-Aufgabe erstellen",
        description: "Neue Cron-Aufgabe erstellen",
        container: {
          title: "Aufgabe erstellen",
          description: "Neue Cron-Aufgabe konfigurieren",
        },
        fields: {
          id: {
            label: "Task-ID",
            description:
              "Eindeutiger, stabiler Bezeichner für diese Aufgabe (z.B. 'db-health')",
            placeholder: "Task-ID eingeben...",
          },
          routeId: {
            label: "Route-ID",
            description:
              "Handler-Bezeichner: Aufgabenname, Endpunktalias oder 'cron-steps'",
            placeholder: "Route-ID eingeben...",
          },
          displayName: {
            label: "Anzeigename",
            description: "Menschenlesbares Label für diese Aufgabe",
            placeholder: "Anzeigenamen eingeben...",
          },
          outputMode: {
            label: "Ausgabemodus",
            description: "Wann Benachrichtigungen nach der Ausführung senden",
            placeholder: "Ausgabemodus auswählen...",
          },
          description: {
            label: "Beschreibung",
            description: "Aufgabenbeschreibung",
            placeholder: "Beschreibung eingeben...",
          },
          schedule: {
            label: "Zeitplan",
            description: "Cron-Zeitplanausdruck",
            placeholder: "*/5 * * * *",
          },
          priority: {
            label: "Priorität",
            description: "Aufgabenpriorität",
          },
          category: {
            label: "Kategorie",
            description: "Aufgabenkategorie",
          },
          enabled: {
            label: "Aktiviert",
            description: "Aufgabe aktivieren oder deaktivieren",
          },
          hidden: {
            label: "Versteckt",
            description:
              "Diese Aufgabe in KI-System-Prompts und Standard-Aufgabenlisten ausblenden",
          },
          timeout: {
            label: "Zeitüberschreitung (ms)",
            description: "Maximale Ausführungszeit in Millisekunden",
          },
          retries: {
            label: "Wiederholungen",
            description: "Anzahl der Wiederholungsversuche",
          },
          retryDelay: {
            label: "Wiederholungsverzögerung (ms)",
            description: "Verzögerung zwischen Wiederholungen in Millisekunden",
          },
          taskInput: {
            label: "Aufgabeneingabe",
            description: "JSON-Eingabedaten für die Aufgabe",
          },
          runOnce: {
            label: "Einmal ausführen",
            description:
              "Diese Aufgabe nur einmal ausführen und dann deaktivieren",
          },
          targetInstance: {
            label: "Ziel-Instanz",
            description:
              "Instanz-ID, auf der diese Aufgabe ausgeführt werden soll. Leer lassen für alle Instanzen.",
            placeholder: "Leer lassen für alle Instanzen",
          },
        },
        response: {
          task: {
            title: "Erstellte Aufgabe",
          },
        },
        errors: {
          validation: {
            title: "Validierung fehlgeschlagen",
            description: "Die bereitgestellten Aufgabendaten sind ungültig",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Sie haben keine Berechtigung, Aufgaben zu erstellen",
          },
          internal: {
            title: "Interner Fehler",
            description:
              "Beim Erstellen der Aufgabe ist ein Fehler aufgetreten",
          },
          forbidden: {
            title: "Verboten",
            description: "Zugriff auf diese Ressource ist verboten",
          },
          conflict: {
            title: "Konflikt",
            description: "Eine Aufgabe mit diesem Namen existiert bereits",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Ein Netzwerkfehler ist aufgetreten",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unbekannter Fehler ist aufgetreten",
          },
          notFound: {
            title: "Nicht gefunden",
            description: "Die angeforderte Ressource wurde nicht gefunden",
          },
          unsaved: {
            title: "Nicht gespeicherte Änderungen",
            description: "Es gibt nicht gespeicherte Änderungen",
          },
        },
        success: {
          created: {
            title: "Aufgabe erstellt",
            description: "Die Aufgabe wurde erfolgreich erstellt",
          },
        },
      },
      widget: {
        title: "Cron-Aufgaben",
        loading: "Aufgaben werden geladen...",
        header: {
          stats: "Statistiken",
          graphs: "Graphen",
          history: "Verlauf",
          queue: "Warteschlange",
          refresh: "Aktualisieren",
          create: "Neue Aufgabe",
        },
        filter: {
          all: "Alle",
          running: "Laufend",
          completed: "Abgeschlossen",
          failed: "Fehlgeschlagen",
          pending: "Ausstehend",
          disabled: "Deaktiviert",
          allPriorities: "Alle Prioritäten",
          allCategories: "Alle Kategorien",
          visible: "Sichtbar",
          hiddenOnly: "Versteckt",
          allTasks: "Alle Aufgaben",
        },
        search: {
          placeholder: "Aufgaben suchen...",
        },
        sort: {
          nameAsc: "Name A-Z",
          nameDesc: "Name Z-A",
          schedule: "Zeitplan",
          lastRunNewest: "Letzter Lauf (neueste)",
          executionsMost: "Meiste Ausführungen",
        },
        task: {
          executions: "Ausführungen:",
          lastRun: "Letzter Lauf:",
          never: "Nie",
          nextRun: "Nächster Lauf:",
          notScheduled: "Nicht geplant",
          routeId: "Route-ID",
          hiddenBadge: "Versteckt",
          owner: {
            system: "System",
            user: "Benutzer",
          },
          outputMode: {
            storeOnly: "Nur speichern",
            notifyOnFailure: "Bei Fehler benachrichtigen",
            notifyAlways: "Immer benachrichtigen",
          },
        },
        action: {
          view: "Details anzeigen",
          history: "Verlauf anzeigen",
          edit: "Aufgabe bearbeiten",
          delete: "Aufgabe löschen",
          runNow: "Jetzt ausführen",
        },
        bulk: {
          selected: "{count} ausgewählt",
          selectAll: "Alle auswählen",
          clearSelection: "Auswahl aufheben",
          enable: "Aktivieren",
          disable: "Deaktivieren",
          runNow: "Jetzt ausführen",
          delete: "Löschen",
          confirmDeleteTitle: "Aufgaben löschen?",
          confirmDelete:
            "{count} Aufgabe(n) löschen? Dies kann nicht rückgängig gemacht werden.",
          cancel: "Abbrechen",
          success: "{succeeded} erfolgreich, {failed} fehlgeschlagen",
        },
        empty: {
          noTasks: "Keine Cron-Aufgaben",
          noTasksDesc: "Erstellen Sie Ihre erste Cron-Aufgabe",
          noMatches: "Keine Aufgaben entsprechen Ihren Filtern",
          noMatchesDesc:
            "Versuchen Sie, Ihre Suche oder Filterkriterien anzupassen",
          clearFilters: "Filter löschen",
        },
      },
    },
    errors: {
      fetch_all_failed: "Fehler beim Abrufen der Cron-Tasks",
      fetch_by_id_failed: "Fehler beim Abrufen des Cron-Tasks nach ID",
      fetch_by_name_failed: "Fehler beim Abrufen des Cron-Tasks nach Name",
      create_failed: "Fehler beim Erstellen des Cron-Tasks",
      update_failed: "Fehler beim Aktualisieren des Cron-Tasks",
      delete_failed: "Fehler beim Löschen des Cron-Tasks",
      not_found: "Cron-Task nicht gefunden",
      execution_create_failed: "Fehler beim Erstellen der Cron-Task-Ausführung",
      execution_update_failed:
        "Fehler beim Aktualisieren der Cron-Task-Ausführung",
      execution_not_found: "Cron-Task-Ausführung nicht gefunden",
      executions_fetch_failed: "Fehler beim Abrufen der Cron-Task-Ausführungen",
      recent_executions_fetch_failed:
        "Fehler beim Abrufen der letzten Cron-Ausführungen",
      schedules_fetch_failed: "Fehler beim Abrufen der Cron-Task-Zeitpläne",
      schedule_update_failed:
        "Fehler beim Aktualisieren des Cron-Task-Zeitplans",
      schedule_not_found: "Cron-Task-Zeitplan nicht gefunden",
      statistics_fetch_failed: "Fehler beim Abrufen der Cron-Task-Statistiken",
    },
  },
  pulseSystem: {
    execute: {
      category: "Pulse Ausführung",
      tags: {
        execute: "Ausführen",
      },
      post: {
        title: "Pulse Ausführen",
        description: "Pulse Gesundheitsüberwachung und Aufgabenausführung",
        container: {
          title: "Pulse Ausführung",
          description:
            "Pulse Überwachung ausführen und geplante Aufgaben starten",
        },
        fields: {
          dryRun: {
            label: "Testlauf",
            description: "Testlauf ohne tatsächliche Änderungen durchführen",
          },
          taskNames: {
            label: "Aufgabennamen",
            description: "Spezifische Aufgabennamen zum Ausführen (optional)",
          },
          force: {
            label: "Erzwungene Ausführung",
            description:
              "Ausführung erzwingen, auch wenn Aufgaben nicht fällig sind",
          },
          success: {
            title: "Erfolg",
          },
          message: {
            title: "Nachricht",
          },
        },
        response: {
          pulseId: "Pulse ID",
          executedAt: "Ausgeführt am",
          totalTasksDiscovered: "Gefundene Aufgaben gesamt",
          tasksDue: "Fällige Aufgaben",
          tasksExecuted: "Ausgeführte Aufgaben",
          tasksSucceeded: "Erfolgreiche Aufgaben",
          tasksFailed: "Fehlgeschlagene Aufgaben",
          tasksSkipped: "Übersprungene Aufgaben",
          totalExecutionTimeMs: "Gesamtausführungszeit (ms)",
          errors: "Fehler",
          summary: "Ausführungszusammenfassung",
          results: "Ergebnisse",
          resultsDescription: "Aufgabenausführungsergebnisse",
          taskName: "Aufgabenname",
          success: "Erfolg",
          duration: "Dauer",
          message: "Nachricht",
          executionFailed: "Ausführung fehlgeschlagen",
          dryRunSuccess: "Probelauf erfolgreich abgeschlossen",
          executionSuccess: "Ausführung erfolgreich abgeschlossen",
        },
        examples: {
          basic: {
            title: "Grundlegende Pulse Ausführung",
          },
          dryRun: {
            title: "Testlauf Ausführung",
          },
          success: {
            title: "Erfolgreiche Ausführung",
          },
        },
        errors: {
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Authentifizierung erforderlich",
          },
          internal: {
            title: "Interner Fehler",
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
          unsaved: {
            title: "Ungespeicherte Änderungen",
            description: "Es gibt ungespeicherte Änderungen",
          },
          validation: {
            title: "Validierungsfehler",
            description: "Ungültige Anfrageparameter",
          },
        },
        success: {
          title: "Erfolg",
          description: "Operation erfolgreich abgeschlossen",
        },
      },
    },
    status: {
      category: "API Endpunkt",
      tags: {
        status: "Status",
      },
      get: {
        title: "Pulse Status",
        description: "Pulse-Gesundheitsüberwachungsstatus abrufen",
        container: {
          title: "Pulse-Gesundheitsstatus",
          description: "Pulse-Ausführungsgesundheit und Statistiken überwachen",
        },
        fields: {
          status: {
            title: "Status",
            label: "Pulse Status",
            description: "Aktueller Pulse-Gesundheitsstatus",
          },
          lastPulseAt: {
            title: "Letzter Pulse um",
            label: "Letzter Pulse",
            description: "Zeitstempel der letzten Pulse-Ausführung",
          },
          successRate: {
            title: "Erfolgsrate",
            label: "Erfolgsrate",
            description: "Prozentsatz erfolgreicher Pulse-Ausführungen",
          },
          totalExecutions: {
            title: "Gesamtausführungen",
            label: "Gesamtausführungen",
            description: "Gesamtanzahl der Pulse-Ausführungen",
          },
        },
        examples: {
          basic: {
            title: "Grundlegende Statusanfrage",
          },
          success: {
            title: "Erfolgreiche Statusantwort",
          },
        },
        errors: {
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Authentifizierung erforderlich",
          },
          internal: {
            title: "Interner Fehler",
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
          unsaved: {
            title: "Nicht gespeicherte Änderungen",
            description: "Es gibt nicht gespeicherte Änderungen",
          },
          validation: {
            title: "Validierungsfehler",
            description: "Ungültige Anfrageparameter",
          },
        },
        success: {
          title: "Erfolg",
          description: "Operation erfolgreich abgeschlossen",
        },
      },
    },
    history: {
      category: "Aufgabenverwaltung",

      tags: {
        pulse: "Pulse",
        monitoring: "Überwachung",
      },

      errors: {
        fetchCronTaskHistory:
          "Fehler beim Abrufen des Pulse-Ausführungsverlaufs",
      },

      get: {
        title: "Pulse-Ausführungsverlauf",
        description: "Historische Pulse-Ausführungszyklen anzeigen",
        fields: {
          startDate: {
            label: "Startdatum",
            description: "Pulse-Zyklen nach diesem Datum filtern",
          },
          endDate: {
            label: "Enddatum",
            description: "Pulse-Zyklen vor diesem Datum filtern",
          },
          status: {
            label: "Status",
            description: "Nach Ausführungsstatus filtern",
            placeholder: "Alle Status",
          },
          limit: {
            label: "Ergebnislimit",
            description: "Maximale Anzahl der zurückzugebenden Ergebnisse",
            placeholder: "50",
          },
          offset: {
            label: "Ergebnisversatz",
            description:
              "Anzahl der zu überspringenden Ergebnisse für die Paginierung",
            placeholder: "0",
          },
        },
        response: {
          executions: { title: "Pulse-Ausführungen" },
          totalCount: { title: "Gesamtanzahl" },
          hasMore: { title: "Weitere Ergebnisse vorhanden" },
          summary: { title: "Ausführungszusammenfassung" },
        },
        errors: {
          validation: {
            title: "Validierungsfehler",
            description: "Ungültige Anfrageparameter angegeben",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Netzwerkfehler beim Abrufen des Pulse-Verlaufs",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description:
              "Sie haben keine Berechtigung, den Pulse-Verlauf anzuzeigen",
          },
          forbidden: {
            title: "Verboten",
            description: "Zugriff auf den Pulse-Verlauf ist verboten",
          },
          notFound: {
            title: "Nicht gefunden",
            description: "Pulse-Ausführungsdatensatz nicht gefunden",
          },
          server: {
            title: "Serverfehler",
            description: "Interner Serverfehler aufgetreten",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unbekannter Fehler ist aufgetreten",
          },
          unsavedChanges: {
            title: "Ungespeicherte Änderungen",
          },
          conflict: {
            title: "Konflikt",
            description: "Datenkonflik aufgetreten",
          },
        },
        success: {
          title: "Verlauf abgerufen",
          description: "Pulse-Ausführungsverlauf erfolgreich abgerufen",
        },
      },
      pulse: {
        execution: {
          success: "Erfolgreich",
          failure: "Fehlgeschlagen",
          timeout: "Zeitüberschreitung",
          cancelled: "Abgebrochen",
          pending: "Ausstehend",
        },
      },
      widget: {
        title: "Pulse-Verlauf",
        empty: "Keine Pulse-Ausführungen gefunden",
        details: "Details",
        discovered: "{{count}} erkannt",
        due: "{{count}} fällig",
        succeeded: "{{count}} ok",
        failed: "{{count}} fehlgeschlagen",
        tasksExecuted: "Ausgeführt",
        tasksSucceeded: "Erfolgreich",
        tasksFailed: "Fehlgeschlagen",
        tasksSkipped: "Übersprungen",
        header: {
          cronHistory: "Cron-Verlauf",
          stats: "Statistiken",
          refresh: "Aktualisieren",
        },
        summary: {
          total: "Gesamt",
          successful: "Erfolgreich",
          failed: "Fehlgeschlagen",
          successRate: "Erfolgsrate",
          avgDuration: "Ø Dauer",
        },
        filter: {
          all: "Alle",
          success: "Erfolgreich",
          failure: "Fehlgeschlagen",
          timeout: "Timeout",
        },
        pagination: {
          info: "Seite {{page}} von {{totalPages}} ({{total}} gesamt)",
          prev: "Zurück",
          next: "Weiter",
        },
      },
    },
    success: {
      title: "Erfolg",
      description: "Puls erfolgreich ausgeführt",
      content: "Erfolg",
    },
    container: {
      title: "Puls-Container",
      description: "Puls-Container-Beschreibung",
    },
  },
  unifiedRunner: {
    category: "Aufgabenverwaltung",

    description: "Führt Cron-Tasks aus und verwaltet Side-Tasks",
    common: {
      taskName: "Aufgabenname",
      taskNamesDescription: "Namen der zu filternden Aufgaben",
      detailed: "Detailliert",
      detailedDescription: "Detaillierte Informationen einbeziehen",
      active: "Aktiv",
      total: "Gesamt",
      uptime: "Betriebszeit",
      id: "ID",
      status: "Status",
      lastRun: "Letzter Lauf",
      nextRun: "Nächster Lauf",
      schedule: "Zeitplan",
    },
    post: {
      title: "Einheitlicher Task Runner",
      description:
        "Verwalten Sie den einheitlichen Task Runner für Cron-Tasks und Seitenaufgaben",
      container: {
        title: "Einheitliche Task Runner Verwaltung",
        description:
          "Steuern Sie den einheitlichen Task Runner, der sowohl Cron-Tasks als auch Seitenaufgaben verwaltet",
      },
      fields: {
        action: {
          label: "Aktion",
          description: "Aktion, die am Task Runner ausgeführt werden soll",
          options: {
            start: "Runner starten",
            stop: "Runner stoppen",
            status: "Status abrufen",
            restart: "Runner neu starten",
          },
        },
        taskFilter: {
          label: "Task Filter",
          description: "Tasks nach Typ filtern",
          options: {
            all: "Alle Tasks",
            cron: "Nur Cron Tasks",
            side: "Nur Seitenaufgaben",
          },
        },
        dryRun: {
          label: "Testlauf",
          description: "Testlauf ohne tatsächliche Änderungen durchführen",
        },
      },
      response: {
        success: "Erfolgreich",
        actionResult: "Aktionsergebnis",
        message: "Nachricht",
        timestamp: "Zeitstempel",
      },
      reasons: {
        previousInstanceRunning: "Vorherige Instanz läuft noch",
      },
      messages: {
        taskSkipped: "Task wurde übersprungen",
        taskCompleted: "Task erfolgreich abgeschlossen",
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
        internal: {
          title: "Interner Fehler",
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
        unsaved: {
          title: "Ungespeicherte Änderungen",
          description: "Es gibt ungespeicherte Änderungen",
        },
        execution: {
          title: "Task-Ausführungsfehler",
          description: "Fehler beim Ausführen der Aufgabe",
        },
        taskAlreadyRunning: {
          title: "Task läuft bereits",
          description: "Die angegebene Aufgabe läuft bereits",
        },
        sideTaskExecution: {
          title: "Side-Task-Ausführungsfehler",
          description: "Fehler beim Ausführen der Side-Task",
        },
      },
      success: {
        title: "Erfolg",
        description: "Vorgang erfolgreich abgeschlossen",
      },
    },
  },
};
