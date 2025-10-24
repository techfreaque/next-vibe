import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Cron-Task-Statistiken Abrufen",
    description: "Umfassende Statistiken und Metriken für Cron-Tasks abrufen",
    tag: "Cron-Statistiken",
    form: {
      title: "Cron-Statistiken-Anfrage",
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
      success: {
        title: "Anfrage-Erfolgsstatus",
      },
      data: {
        title: "Statistik-Daten",
      },
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
      description: "Cron-Task-Statistiken erfolgreich abgerufen",
    },
  },
};
