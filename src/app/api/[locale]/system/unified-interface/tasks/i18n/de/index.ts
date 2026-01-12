import { translations as cronTranslations } from "../../cron/i18n/de";
import { translations as pulseTranslations } from "../../pulse/i18n/de";
import { translations as sideTasksTranslations } from "../../side-tasks/i18n/de";
import { translations as typesTranslations } from "../../types/i18n/de";
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
    // Side Tasks errors
    fetchSideTaskByName:
      "Fehler beim Abrufen der Hintergrund-Aufgabe nach Name",
    updateSideTask: "Fehler beim Aktualisieren der Hintergrund-Aufgabe",
    deleteSideTask: "Fehler beim Löschen der Hintergrund-Aufgabe",
    createSideTaskExecution:
      "Fehler beim Erstellen der Hintergrund-Aufgaben-Ausführung",
    updateSideTaskExecution:
      "Fehler beim Aktualisieren der Hintergrund-Aufgaben-Ausführung",
    fetchSideTaskExecutions:
      "Fehler beim Abrufen der Hintergrund-Aufgaben-Ausführungen",
    fetchRecentSideTaskExecutions:
      "Fehler beim Abrufen der letzten Hintergrund-Aufgaben-Ausführungen",
    createSideTaskHealthCheck:
      "Fehler beim Erstellen des Hintergrund-Aufgaben-Gesundheitschecks",
    fetchLatestHealthCheck: "Fehler beim Abrufen des letzten Gesundheitschecks",
    fetchHealthCheckHistory:
      "Fehler beim Abrufen der Gesundheitscheck-Historie",
    fetchSideTaskStatistics:
      "Fehler beim Abrufen der Hintergrund-Aufgaben-Statistiken",
    sideTaskNotFound: "Hintergrund-Aufgabe nicht gefunden",
    sideTaskExecutionNotFound: "Hintergrund-Aufgaben-Ausführung nicht gefunden",

    // Cron Tasks errors
    fetchCronTasks: "Fehler beim Abrufen der Cron-Aufgaben",
    createCronTask: "Fehler beim Erstellen der Cron-Aufgabe",
    updateCronTask: "Fehler beim Aktualisieren der Cron-Aufgabe",
    deleteCronTask: "Fehler beim Löschen der Cron-Aufgabe",
    fetchCronTaskHistory: "Fehler beim Abrufen der Cron-Aufgaben-Historie",
    fetchCronTaskStats: "Fehler beim Abrufen der Cron-Aufgaben-Statistiken",
    fetchCronStatus: "Fehler beim Abrufen des Cron-System-Status",
    cronTaskNotFound: "Cron-Aufgabe nicht gefunden",

    // Types errors
    fetchTaskTypes: "Fehler beim Abrufen der Aufgabentypen",
    validateTaskTypes: "Fehler beim Validieren der Aufgabentypen",
    exportTaskTypes: "Fehler beim Exportieren der Aufgabentypen",
    unsupportedExportFormat: "Nicht unterstütztes Exportformat",

    // Unified Runner errors
    startTaskRunner: "Fehler beim Starten des Task Runners",
    stopTaskRunner: "Fehler beim Stoppen des Task Runners",
    getTaskRunnerStatus: "Fehler beim Abrufen des Task Runner Status",
    executeCronTask: "Fehler beim Ausführen der Cron-Aufgabe",
    executeSideTask: "Fehler beim Ausführen der Hintergrund-Aufgabe",

    // Pulse errors
    executePulse: "Fehler beim Ausführen des Pulse",
    fetchPulseStatus: "Fehler beim Abrufen des Pulse-Status",
    pulseExecutionFailed: "Pulse-Ausführung fehlgeschlagen",
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
  cronSystem: cronTranslations,
  pulseSystem: pulseTranslations,
  sideTasks: sideTasksTranslations,
  types: typesTranslations,
  unifiedRunner: unifiedRunnerTranslations,
};
