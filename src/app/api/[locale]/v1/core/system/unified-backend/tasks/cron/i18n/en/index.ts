import { translations as historyTranslations } from "../../history/i18n/en";
import { translations as statsTranslations } from "../../stats/i18n/en";
import { translations as statusTranslations } from "../../status/i18n/en";
import { translations as taskTranslations } from "../../task/[id]/i18n/en";
import { translations as tasksTranslations } from "../../tasks/i18n/en";

export const translations = {
  history: historyTranslations,
  stats: statsTranslations,
  status: statusTranslations,
  task: taskTranslations,
  tasks: tasksTranslations,
  errors: {
    fetch_all_failed: "Failed to fetch cron tasks",
    fetch_by_id_failed: "Failed to fetch cron task by ID",
    fetch_by_name_failed: "Failed to fetch cron task by name",
    create_failed: "Failed to create cron task",
    update_failed: "Failed to update cron task",
    delete_failed: "Failed to delete cron task",
    not_found: "Cron task not found",
    execution_create_failed: "Failed to create cron task execution",
    execution_update_failed: "Failed to update cron task execution",
    execution_not_found: "Cron task execution not found",
    executions_fetch_failed: "Failed to fetch cron task executions",
    recent_executions_fetch_failed: "Failed to fetch recent cron executions",
    schedules_fetch_failed: "Failed to fetch cron task schedules",
    schedule_update_failed: "Failed to update cron task schedule",
    schedule_not_found: "Cron task schedule not found",
    statistics_fetch_failed: "Failed to fetch cron task statistics",
  },
};
