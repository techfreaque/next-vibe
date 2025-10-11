import { translations as idTranslations } from "../../[id]/i18n/pl";
import { translations as listTranslations } from "../../list/i18n/pl";
import { translations as statsTranslations } from "../../stats/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Wiadomości Email",
  tag: "Wiadomości",
  tags: {
    stats: "Statystyki",
    analytics: "Analityka",
  },
  id: idTranslations,
  list: listTranslations,
  stats: statsTranslations,
};
