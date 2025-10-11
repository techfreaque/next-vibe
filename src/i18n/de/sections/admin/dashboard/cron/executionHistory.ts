import type { executionHistoryTranslations as EnglishExecutionHistoryTranslations } from "../../../../../en/sections/admin/dashboard/cron/executionHistory";

export const executionHistoryTranslations: typeof EnglishExecutionHistoryTranslations =
  {
    title: "Ausführungsverlauf",
    titleWithCount: "Ausführungsverlauf ({{count}})",
    subtitle: "Aktuelle Aufgabenausführungen und Ergebnisse anzeigen",
    refreshing: "Aktualisiere...",
    refresh: "Aktualisieren",
    noExecutions: "Keine Ausführungen gefunden",
    filters: {
      all: "Alle",
      successful: "Erfolgreich",
      failed: "Fehlgeschlagen",
      running: "Läuft",
    },
    columns: {
      task: "Aufgabe",
      status: "Status",
      startTime: "Startzeit",
      duration: "Dauer",
      details: "Details",
    },
    status: {
      completed: "Abgeschlossen",
      failed: "Fehlgeschlagen",
      running: "Läuft",
      pending: "Ausstehend",
    },
  };
