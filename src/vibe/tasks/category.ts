import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { USER_ME_ALIAS } from "@/user/private/me/constants";

export const category: CategoryDefinition = {
  key: "automation",
  label: {
    "en-US": "Scheduled work",
    "de-DE": "Geplante Aufgaben",
    "pl-PL": "Zaplanowane zadania",
    "fr-FR": "Tâches planifiées",
    "it-IT": "Attività pianificate",
    "es-ES": "Tareas programadas",
    "sk-SK": "Naplánované úlohy",
    "en-GLOBAL": "Scheduled work",
  },
  description: {
    "en-US": "Inspect scheduled jobs, task runs and failures.",
    "de-DE": "Prüfen Sie geplante Aufgaben, Ausführungen und Fehler.",
    "pl-PL": "Sprawdź harmonogram zadań, wykonania i błędy.",
    "fr-FR": "Consultez les tâches planifiées, leur exécution et les échecs.",
    "it-IT": "Verifichi le attività pianificate, le esecuzioni e gli errori.",
    "es-ES": "Revise las tareas programadas, las ejecuciones y los fallos.",
    "sk-SK": "Skontrolujte naplánované úlohy, ich priebeh a zlyhania.",
    "en-GLOBAL": "Inspect scheduled jobs, task runs and failures.",
  },
  group: "system",
  icon: "calendar",
  order: 2,
  adminPathPrefixes: ["vibe/tasks"],
  landing: {
    actions: ["task-list", "cron-queue", "cron-history", "cron-stats"],
  },
  defaultEntry: {
    [UserPermissionRole.ADMIN]: "task-list",
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
};
