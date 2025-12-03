import { translations as listTranslations } from "../../list/i18n/pl";
import { translations as syncTranslations } from "../../sync/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Foldery",
  list: listTranslations,
  sync: syncTranslations,
};
