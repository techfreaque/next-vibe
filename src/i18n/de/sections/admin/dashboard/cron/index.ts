import type { cronTranslations as EnglishCronTranslations } from "../../../../../en/sections/admin/dashboard/cron";
import { actionsTranslations } from "./actions";
import { buttonsTranslations } from "./buttons";
import { createTaskTranslations } from "./createTask";
import { errorsTranslations } from "./errors";
import { executionHistoryTranslations } from "./executionHistory";
import { formattingTranslations } from "./formatting";
import { navTranslations } from "./nav";
import { priorityTranslations } from "./priority";
import { settingsTranslations } from "./settings";
import { statsTranslations } from "./stats";
import { systemHealthTranslations } from "./systemHealth";
import { systemMetricsTranslations } from "./systemMetrics";
import { tableTranslations } from "./table";
import { tabsTranslations } from "./tabs";
import { taskDetailsTranslations } from "./taskDetails";
import { taskLabelsTranslations } from "./taskLabels";
import { taskStatusTranslations } from "./taskStatus";

export const cronTranslations: typeof EnglishCronTranslations = {
  actions: actionsTranslations,
  buttons: buttonsTranslations,
  createTask: createTaskTranslations,
  errors: errorsTranslations,
  executionHistory: executionHistoryTranslations,
  formatting: formattingTranslations,
  nav: navTranslations,
  priority: priorityTranslations,
  settings: settingsTranslations,
  stats: statsTranslations,
  systemHealth: systemHealthTranslations,
  systemMetrics: systemMetricsTranslations,
  table: tableTranslations,
  tabs: tabsTranslations,
  taskDetails: taskDetailsTranslations,
  taskLabels: taskLabelsTranslations,
  taskStatus: taskStatusTranslations,
  title: "Cron-Task-Verwaltung",
  subtitle: "Überwachen und verwalten Sie automatisierte Aufgaben",
  recentTasks: "Aktuelle Aufgaben",
  systemStatus: "Systemstatus",
  taskManagement: "Aufgabenverwaltung",
};
