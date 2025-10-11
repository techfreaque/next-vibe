import type { statusTranslations as EnglishStatusTranslations } from "../../../en/sections/consultation/status";

export const statusTranslations: typeof EnglishStatusTranslations = {
  pending: "Oczekujące",
  scheduled: "Zaplanowane",
  confirmed: "Potwierdzone",
  completed: "Ukończone",
  cancelled: "Anulowane",
  noShow: "Nieobecność",
  filter: {
    all: "Wszystkie statusy",
  },
};
