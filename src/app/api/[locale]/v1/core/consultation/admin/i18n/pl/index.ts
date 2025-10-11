import { translations as consultationTranslations } from "../../consultation/i18n/pl";
import { translations as listTranslations } from "../../list/i18n/pl";
import { translations as statsTranslations } from "../../stats/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  consultation: consultationTranslations,
  list: listTranslations,
  stats: statsTranslations,
};
