import { translations as appTranslations } from "../../[locale]/i18n/en";
import { translations as apiTranslations } from "../../api/i18n/en";

export const translations = {
  appName: "Social Media Service Center",
  api: apiTranslations,
  // we spread [locale] translations to avoid it in the translation key
  ...appTranslations,
};
