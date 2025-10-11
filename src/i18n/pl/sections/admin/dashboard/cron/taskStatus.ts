import type { taskStatusTranslations as EnglishTaskStatusTranslations } from "../../../../../en/sections/admin/dashboard/cron/taskStatus";

export const taskStatusTranslations: typeof EnglishTaskStatusTranslations = {
  pending: "Oczekujące",
  running: "Uruchomione",
  completed: "Zakończone",
  failed: "Nieudane",
  cancelled: "Anulowane",
  active: "Aktywny",
  disabled: "Wyłączony",
  never: "Nigdy",
  unknown: "Nieznany",
};
