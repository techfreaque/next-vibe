import { translations as historyTranslations } from "../../history/i18n/pl";
import { translations as statsTranslations } from "../../stats/i18n/pl";
import { translations as statusTranslations } from "../../status/i18n/pl";
import { translations as taskTranslations } from "../../task/[id]/i18n/pl";
import { translations as tasksTranslations } from "../../tasks/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  history: historyTranslations,
  stats: statsTranslations,
  status: statusTranslations,
  task: taskTranslations,
  tasks: tasksTranslations,
  errors: {
    fetch_all_failed: "Nie udało się pobrać zadań cron",
    fetch_by_id_failed: "Nie udało się pobrać zadania cron według ID",
    fetch_by_name_failed: "Nie udało się pobrać zadania cron według nazwy",
    create_failed: "Nie udało się utworzyć zadania cron",
    update_failed: "Nie udało się zaktualizować zadania cron",
    delete_failed: "Nie udało się usunąć zadania cron",
    not_found: "Zadanie cron nie zostało znalezione",
    execution_create_failed: "Nie udało się utworzyć wykonania zadania cron",
    execution_update_failed:
      "Nie udało się zaktualizować wykonania zadania cron",
    execution_not_found: "Wykonanie zadania cron nie zostało znalezione",
    executions_fetch_failed: "Nie udało się pobrać wykonań zadań cron",
    recent_executions_fetch_failed:
      "Nie udało się pobrać ostatnich wykonań cron",
    schedules_fetch_failed: "Nie udało się pobrać harmonogramów zadań cron",
    schedule_update_failed:
      "Nie udało się zaktualizować harmonogramu zadania cron",
    schedule_not_found: "Harmonogram zadania cron nie został znaleziony",
    statistics_fetch_failed: "Nie udało się pobrać statystyk zadań cron",
  },
};
