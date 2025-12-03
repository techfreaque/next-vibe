import { translations as idTranslations } from "../../[id]/i18n/de";
import { translations as listTranslations } from "../../list/i18n/de";
import { translations as statsTranslations } from "../../stats/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "E-Mail-Nachrichten",
  tag: "Nachrichten",
  tags: {
    stats: "Statistiken",
    analytics: "Analysen",
  },
  id: idTranslations,
  list: listTranslations,
  stats: statsTranslations,
};
