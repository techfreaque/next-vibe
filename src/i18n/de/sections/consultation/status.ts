import type { statusTranslations as EnglishStatusTranslations } from "../../../en/sections/consultation/status";

export const statusTranslations: typeof EnglishStatusTranslations = {
  pending: "Ausstehend",
  scheduled: "Geplant",
  confirmed: "Bestätigt",
  completed: "Abgeschlossen",
  cancelled: "Storniert",
  noShow: "Nicht erschienen",
  filter: {
    all: "Alle Status",
  },
};
