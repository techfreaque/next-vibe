import type { executionHistoryTranslations as EnglishExecutionHistoryTranslations } from "../../../../../en/sections/admin/dashboard/cron/executionHistory";

export const executionHistoryTranslations: typeof EnglishExecutionHistoryTranslations =
  {
    title: "Historia wykonań",
    titleWithCount: "Historia wykonań ({{count}})",
    subtitle: "Wyświetl ostatnie wykonania zadań i wyniki",
    refreshing: "Odświeżanie...",
    refresh: "Odśwież",
    noExecutions: "Nie znaleziono wykonań",
    filters: {
      all: "Wszystkie",
      successful: "Udane",
      failed: "Nieudane",
      running: "Działające",
    },
    columns: {
      task: "Zadanie",
      status: "Status",
      startTime: "Czas rozpoczęcia",
      duration: "Czas trwania",
      details: "Szczegóły",
    },
    status: {
      completed: "Zakończone",
      failed: "Nieudane",
      running: "Działające",
      pending: "Oczekujące",
    },
  };
