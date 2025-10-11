import type { statusTranslations as EnglishStatusTranslations } from "../../../../../../en/sections/admin/dashboard/cron/stats/status";

export const statusTranslations: typeof EnglishStatusTranslations = {
  completed: "Zakończone",
  failed: "Nieudane",
  pending: "Oczekujące",
  running: "Uruchomione",
  cancelled: "Anulowane",
  timeout: "Przekroczenie czasu",
  skipped: "Pominięte",
};
