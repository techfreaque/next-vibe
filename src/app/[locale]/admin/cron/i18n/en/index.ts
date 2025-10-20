// Parent aggregator for cron translations
// Imports from co-located child directory i18n folders
import { translations as historyTranslations } from "../../history/i18n/en";
import { translations as statsTranslations } from "../../stats/i18n/en";
import { translations as taskTranslations } from "../../task/i18n/en";
import { translations as tasksTranslations } from "../../tasks/i18n/en";

export const translations = {
  history: historyTranslations,
  stats: statsTranslations,
  task: taskTranslations,
  tasks: tasksTranslations,
  // Shared cron-level translations
  nav: {
    stats: "Statistics",
    stats_description:
      "View cron task execution statistics and performance metrics",
    tasks: "Tasks",
    tasks_description: "Manage and configure cron tasks",
    history: "History",
    history_description: "View cron task execution history",
  },
  buttons: {
    previous: "Previous",
    next: "Next",
  },
  executionHistory: {
    titleWithCount: "Execution History ({{count}})",
    pagination: "Showing {{from}} to {{to}} of {{total}}",
    errorType: "Error Type",
  },
  cronErrors: {
    admin: {
      interface: {
        noResults: "No results",
        filter: "Filter",
        clear: "Clear",
        executionHistory: {
          searchPlaceholder: "Search by task name...",
          statusFilter: "Filter by status",
          startDate: "Start date",
          endDate: "End date",
          loadingHistory: "Loading execution history...",
          noHistory: "No execution history found",
          started: "Started",
          duration: "Duration",
          completed: "Completed",
          errorDetails: "Error Details",
        },
      },
    },
  },
};
