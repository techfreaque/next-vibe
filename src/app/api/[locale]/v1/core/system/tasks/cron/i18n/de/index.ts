import { translations as historyTranslations } from "../../history/i18n/de";
import { translations as statsTranslations } from "../../stats/i18n/de";
import { translations as statusTranslations } from "../../status/i18n/de";
import { translations as taskTranslations } from "../../task/[id]/i18n/de";
import { translations as tasksTranslations } from "../../tasks/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  history: historyTranslations,
  stats: statsTranslations,
  status: statusTranslations,
  task: taskTranslations,
  tasks: tasksTranslations,
  errors: {
    fetch_all_failed: "Fehler beim Abrufen der Cron-Tasks",
    fetch_by_id_failed: "Fehler beim Abrufen des Cron-Tasks nach ID",
    fetch_by_name_failed: "Fehler beim Abrufen des Cron-Tasks nach Name",
    create_failed: "Fehler beim Erstellen des Cron-Tasks",
    update_failed: "Fehler beim Aktualisieren des Cron-Tasks",
    delete_failed: "Fehler beim Löschen des Cron-Tasks",
    not_found: "Cron-Task nicht gefunden",
    execution_create_failed: "Fehler beim Erstellen der Cron-Task-Ausführung",
    execution_update_failed:
      "Fehler beim Aktualisieren der Cron-Task-Ausführung",
    execution_not_found: "Cron-Task-Ausführung nicht gefunden",
    executions_fetch_failed: "Fehler beim Abrufen der Cron-Task-Ausführungen",
    recent_executions_fetch_failed:
      "Fehler beim Abrufen der letzten Cron-Ausführungen",
    schedules_fetch_failed: "Fehler beim Abrufen der Cron-Task-Zeitpläne",
    schedule_update_failed: "Fehler beim Aktualisieren des Cron-Task-Zeitplans",
    schedule_not_found: "Cron-Task-Zeitplan nicht gefunden",
    statistics_fetch_failed: "Fehler beim Abrufen der Cron-Task-Statistiken",
  },
};
