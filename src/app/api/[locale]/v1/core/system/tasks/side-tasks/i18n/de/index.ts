import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
