import { translations as appTranslations } from "../../[locale]/i18n/de";
import { translations as apiTranslations } from "../../api/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  api: apiTranslations,
  ...appTranslations,
};
