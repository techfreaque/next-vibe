import { translations as consultationTranslations } from "../../consultation/i18n/de";
import { translations as listTranslations } from "../../list/i18n/de";
import { translations as statsTranslations } from "../../stats/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  consultation: consultationTranslations,
  list: listTranslations,
  stats: statsTranslations,
};
