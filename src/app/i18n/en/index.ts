import { translations as appTranslations } from "../../[locale]/i18n/en";
import { translations as apiTranslations } from "../../api/i18n/en";
import { translations as i18nTranslations } from "../../../i18n/i18n/en";
import { translations as packagesTranslations } from "../../../packages/i18n/en";

export const translations = {
  appName: "unbottled.ai",
  api: apiTranslations,
  i18n: i18nTranslations,
  packages: packagesTranslations,
  // we spread [locale] translations to avoid it in the translation key
  ...appTranslations,
};
