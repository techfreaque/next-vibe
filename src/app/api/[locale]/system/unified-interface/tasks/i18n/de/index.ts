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
