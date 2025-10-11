import type { taskStatusTranslations as EnglishTaskStatusTranslations } from "../../../../../en/sections/admin/dashboard/cron/taskStatus";

export const taskStatusTranslations: typeof EnglishTaskStatusTranslations = {
  pending: "Ausstehend",
  running: "Läuft",
  completed: "Abgeschlossen",
  failed: "Fehlgeschlagen",
  cancelled: "Abgebrochen",
  active: "Aktiv",
  disabled: "Deaktiviert",
  never: "Nie",
  unknown: "Unbekannt",
};
