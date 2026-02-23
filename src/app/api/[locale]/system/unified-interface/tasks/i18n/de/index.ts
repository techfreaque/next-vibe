import { translations as cronTranslations } from "../../cron/i18n/de";
import { translations as pulseTranslations } from "../../pulse/i18n/de";
import { translations as unifiedRunnerTranslations } from "../../unified-runner/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Aufgabenverwaltung",
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
    description: "Überprüft die Datenbankverbindungsgesundheit jede Minute",
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
  claudeCode: {
    tags: {
      tasks: "Aufgaben",
    },
    run: {
      post: {
        title: "Claude Code ausführen",
        description:
          "Startet eine Claude Code-Sitzung auf Hermes (dem lokalen Entwicklungsrechner). BEVORZUGE headless:false (Standard) — öffnet eine vollständige bidirektionale Claude Code-Sitzung, bei der Max aktiv teilnehmen kann. headless:true nur für vollautomatisierte Batch-Aufgaben ohne menschliche Eingabe verwenden (z.B. Cron-Jobs). Im interaktiven Modus wird die Sitzung live ins Terminal gestreamt; im Batch-Modus läuft `claude -p` und gibt die gesamte Ausgabe zurück. Läuft immer mit --dangerously-skip-permissions.",
        fields: {
          prompt: {
            title: "Prompt",
            description:
              "Die Aufgabe oder Frage für Claude Code. Spezifisch sein — Dateipfade, Kontext und erwartetes Ausgabeformat angeben.",
          },
          model: {
            title: "Modell",
            description:
              "Claude Modell-ID (z.B. claude-sonnet-4-6, claude-opus-4-6). Verwendet Claude Code-Standard wenn nicht angegeben.",
          },
          maxBudgetUsd: {
            title: "Max. Budget (USD)",
            description:
              "Maximales Ausgabelimit in USD. Verhindert unkontrollierte Tool-Nutzungskosten. Weglassen für kein Limit.",
          },
          systemPrompt: {
            title: "System-Prompt",
            description:
              "Optionaler System-Prompt. Für Persona, Einschränkungen oder Kontext der gesamten Sitzung.",
          },
          allowedTools: {
            title: "Erlaubte Tools",
            description:
              "Kommagetrennte Liste erlaubter Tools (z.B. Read,Edit,Bash). Weglassen für alle Standard-Tools.",
          },
          headless: {
            title: "Headless (Batch-Modus)",
            description:
              "BEVORZUGE false (Standard). headless:false öffnet eine vollständige interaktive Claude Code-Sitzung — Max sieht die Ausgabe live und kann teilnehmen. Nur auf true setzen für vollautomatisierte Batch-Aufgaben (Cron-Jobs, Pipelines) ohne menschliche Interaktion.",
          },
          workingDir: {
            title: "Arbeitsverzeichnis",
            description:
              "Absoluter Pfad für den Claude Code-Prozess. Standard: aktuelles Server-Verzeichnis.",
          },
          timeoutMs: {
            title: "Timeout (ms)",
            description:
              "Maximale Ausführungszeit in Millisekunden. Standard: 600000 (10 Minuten).",
          },
          output: {
            title: "Ausgabe",
            description: "Kombinierter stdout des Claude Code-Prozesses.",
          },
          exitCode: {
            title: "Exit-Code",
            description: "Prozess-Exit-Code. 0 = Erfolg, ungleich 0 = Fehler.",
          },
          durationMs: {
            title: "Dauer (ms)",
            description: "Gesamte Laufzeit des Prozesses.",
          },
        },
        errors: {
          validation: {
            title: "Validierungsfehler",
            description:
              "Ungültige Anfrageparameter — Prompt und Felder prüfen",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description:
              "Authentifizierung erforderlich — Admin-Rolle benötigt",
          },
          internal: {
            title: "Ausführung fehlgeschlagen",
            description:
              "Claude Code-Prozess konnte nicht gestartet werden oder ist abgestürzt",
          },
          forbidden: {
            title: "Verboten",
            description: "Zugriff verweigert — unzureichende Berechtigungen",
          },
          notFound: {
            title: "Nicht gefunden",
            description: "Ressource oder Arbeitsverzeichnis nicht gefunden",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Netzwerkfehler bei der Kommunikation mit Claude Code",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Unerwarteter Fehler während der Ausführung",
          },
          unsaved: {
            title: "Ungespeicherte Änderungen",
            description: "Konflikt durch ungespeicherte Änderungen erkannt",
          },
          conflict: {
            title: "Konflikt",
            description:
              "Ausführungskonflikt — möglicherweise läuft bereits eine Sitzung",
          },
        },
        success: {
          title: "Claude Code abgeschlossen",
          description:
            "Claude Code-Prozess beendet — exitCode für Erfolg/Fehler und output für Ergebnisse prüfen",
        },
      },
    },
  },
  taskSync: {
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
