// Parent aggregator for cron translations
// Imports from co-located child directory i18n folders
import { translations as historyTranslations } from "../../history/i18n/pl";
import { translations as statsTranslations } from "../../stats/i18n/pl";
import { translations as taskTranslations } from "../../task/i18n/pl";
import { translations as tasksTranslations } from "../../tasks/i18n/pl";

export const translations = {
  history: historyTranslations,
  stats: statsTranslations,
  task: taskTranslations,
  tasks: tasksTranslations,
  // Shared cron-level translations (Polish)
  nav: {
    stats: "Statystyki",
    stats_description: "Zobacz statystyki i metryki wydajności zadań cron",
    tasks: "Zadania",
    tasks_description: "Zarządzaj i konfiguruj zadania cron",
    history: "Historia",
    history_description: "Zobacz historię wykonywania zadań cron",
  },
  buttons: {
    previous: "Poprzedni",
    next: "Następny",
  },
  executionHistory: {
    titleWithCount: "Historia wykonań ({{count}})",
    pagination: "Pokazuje {{from}} do {{to}} z {{total}}",
    errorType: "Typ błędu",
  },
  cronErrors: {
    admin: {
      interface: {
        noResults: "Brak wyników",
        filter: "Filtruj",
        clear: "Wyczyść",
        executionHistory: {
          searchPlaceholder: "Szukaj według nazwy zadania...",
          statusFilter: "Filtruj według statusu",
          startDate: "Data rozpoczęcia",
          endDate: "Data zakończenia",
          loadingHistory: "Ładowanie historii wykonań...",
          noHistory: "Nie znaleziono historii wykonań",
          started: "Rozpoczęto",
          duration: "Czas trwania",
          completed: "Zakończono",
          errorDetails: "Szczegóły błędu",
        },
      },
    },
  },
} as const;
