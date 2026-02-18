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
      description: "Cron-Task-Statistiken erfolgreich abgerufen",
    },
  },
  widget: {
    title: "Cron-Statistiken",
    loading: "Statistiken werden geladen...",
    viewTasks: "Aufgaben",
    viewHistory: "Verlauf",
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
};
