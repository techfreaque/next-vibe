import type { statusTranslations as EnglishStatusTranslations } from "../../../../../../en/sections/admin/dashboard/cron/stats/status";

export const statusTranslations: typeof EnglishStatusTranslations = {
  completed: "Abgeschlossen",
  failed: "Fehlgeschlagen",
  pending: "Ausstehend",
  running: "Läuft",
  cancelled: "Abgebrochen",
  timeout: "Zeitüberschreitung",
  skipped: "Übersprungen",
};
