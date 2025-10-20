import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  common: {
    sideTasksActionLabel: "Aktion",
    sideTasksActionDescription: "Wählen Sie die auszuführende Aktion",
    sideTasksActionList: "Tasks auflisten",
    sideTasksActionGet: "Task abrufen",
    sideTasksActionCreate: "Task erstellen",
    sideTasksActionUpdate: "Task aktualisieren",
    sideTasksActionDelete: "Task löschen",
    sideTasksActionStats: "Task-Statistiken",
    sideTasksActionExecutions: "Task-Ausführungen",
    sideTasksActionHealthCheck: "Gesundheitsprüfung",
    sideTasksIdLabel: "Task-ID",
    sideTasksIdDescription: "Die eindeutige Kennung des Tasks",
    sideTasksNameLabel: "Task-Name",
    sideTasksNameDescription: "Der Name des Tasks",
    sideTasksLimitLabel: "Limit",
    sideTasksLimitDescription:
      "Maximale Anzahl der zurückzugebenden Ergebnisse",
    sideTasksDataLabel: "Task-Daten",
    sideTasksDataDescription: "Zusätzliche Daten für den Task",
    sideTasksRepositoryFetchAllFailed: "Fehler beim Abrufen aller Side Tasks",
    sideTasksRepositoryFetchByIdFailed:
      "Fehler beim Abrufen der Side Task nach ID",
    sideTasksRepositoryCreateFailed: "Fehler beim Erstellen der Side Task",
  },
  post: {
    title: "Side Tasks Verwaltung",
    description: "Side Tasks Operationen verwalten",
    category: "System Tasks",
    container: {
      title: "Side Tasks",
      description: "Side Task Operationen konfigurieren",
    },
  },
  get: {
    title: "Side Task abrufen",
    description: "Side Task Informationen abrufen",
    container: {
      title: "Side Task Details",
      description: "Side Task Details anzeigen",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie sind nicht berechtigt, Side Tasks anzuzeigen",
      },
      internalError: {
        title: "Interner Fehler",
        description: "Beim Abrufen der Side Tasks ist ein Fehler aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Side Tasks erfolgreich abgerufen",
    },
  },
  tasks: {
    side: {
      response: {
        success: {
          title: "Erfolg",
        },
        message: {
          title: "Nachricht",
        },
        data: {
          title: "Daten",
        },
        count: {
          title: "Anzahl",
        },
      },
    },
  },
  category: "API Endpunkt",
  tags: {
    sidetasks: "Sidetasks",
  },
  errors: {
    fetchByNameFailed: "Fehler beim Abrufen der Side Task nach Name",
    updateTaskFailed: "Fehler beim Aktualisieren der Side Task",
    deleteTaskFailed: "Fehler beim Löschen der Side Task",
    createExecutionFailed: "Fehler beim Erstellen der Side Task Ausführung",
    updateExecutionFailed: "Fehler beim Aktualisieren der Side Task Ausführung",
    fetchExecutionsFailed: "Fehler beim Abrufen der Side Task Ausführungen",
    fetchRecentExecutionsFailed:
      "Fehler beim Abrufen der letzten Side Task Ausführungen",
    createHealthCheckFailed:
      "Fehler beim Erstellen des Side Task Health Checks",
    fetchLatestHealthCheckFailed:
      "Fehler beim Abrufen des letzten Health Checks",
    fetchHealthCheckHistoryFailed:
      "Fehler beim Abrufen der Health Check Historie",
    fetchStatisticsFailed: "Fehler beim Abrufen der Side Task Statistiken",
    taskNotFound: "Side Task nicht gefunden",
    executionNotFound: "Side Task Ausführung nicht gefunden",
  },
};
