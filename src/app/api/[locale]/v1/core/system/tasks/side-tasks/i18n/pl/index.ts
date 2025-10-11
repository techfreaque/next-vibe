import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Punkt końcowy API",
  tags: {
    sidetasks: "Sidetasks",
  },
  errors: {
    fetchByNameFailed: "Nie udało się pobrać zadania pobocznego według nazwy",
    updateTaskFailed: "Nie udało się zaktualizować zadania pobocznego",
    deleteTaskFailed: "Nie udało się usunąć zadania pobocznego",
    createExecutionFailed:
      "Nie udało się utworzyć wykonania zadania pobocznego",
    updateExecutionFailed:
      "Nie udało się zaktualizować wykonania zadania pobocznego",
    fetchExecutionsFailed: "Nie udało się pobrać wykonań zadań pobocznych",
    fetchRecentExecutionsFailed:
      "Nie udało się pobrać ostatnich wykonań zadań pobocznych",
    createHealthCheckFailed:
      "Nie udało się utworzyć sprawdzenia zdrowia zadania pobocznego",
    fetchLatestHealthCheckFailed:
      "Nie udało się pobrać ostatniego sprawdzenia zdrowia",
    fetchHealthCheckHistoryFailed:
      "Nie udało się pobrać historii sprawdzeń zdrowia",
    fetchStatisticsFailed: "Nie udało się pobrać statystyk zadań pobocznych",
    taskNotFound: "Zadanie poboczne nie zostało znalezione",
    executionNotFound: "Wykonanie zadania pobocznego nie zostało znalezione",
  },
};
