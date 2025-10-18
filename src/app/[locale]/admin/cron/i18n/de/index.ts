// Parent aggregator for cron translations
// Imports from co-located child directory i18n folders
import { translations as historyTranslations } from "../../history/i18n/de";
import { translations as statsTranslations } from "../../stats/i18n/de";
import { translations as taskTranslations } from "../../task/i18n/de";
import { translations as tasksTranslations } from "../../tasks/i18n/de";

export const translations = {
  history: historyTranslations,
  stats: statsTranslations,
  task: taskTranslations,
  tasks: tasksTranslations,
  // Shared cron-level translations (German)
  nav: {
    stats: "Statistiken",
    stats_description: "Zeigen Sie Statistiken und Leistungsmetriken für Cron-Aufgaben an",
    tasks: "Aufgaben",
    tasks_description: "Verwalten und konfigurieren Sie Cron-Aufgaben",
    history: "Verlauf",
    history_description: "Zeigen Sie den Ausführungsverlauf von Cron-Aufgaben an",
  },
  buttons: {
    previous: "Zurück",
    next: "Weiter",
  },
  executionHistory: {
    titleWithCount: "Ausführungsverlauf ({{count}})",
    pagination: "Zeige {{from}} bis {{to}} von {{total}}",
    errorType: "Fehlertyp",
  },
  cronErrors: {
    admin: {
      interface: {
        noResults: "Keine Ergebnisse",
        filter: "Filter",
        clear: "Löschen",
        executionHistory: {
          searchPlaceholder: "Nach Aufgabenname suchen...",
          statusFilter: "Nach Status filtern",
          startDate: "Startdatum",
          endDate: "Enddatum",
          loadingHistory: "Ausführungsverlauf wird geladen...",
          noHistory: "Kein Ausführungsverlauf gefunden",
          started: "Gestartet",
          duration: "Dauer",
          completed: "Abgeschlossen",
          errorDetails: "Fehlerdetails",
        },
      },
    },
  },
} as const;
