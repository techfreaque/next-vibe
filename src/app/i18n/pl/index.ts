import { translations as i18nTranslations } from "../../../i18n/i18n/pl";
import { translations as packagesTranslations } from "../../../packages/i18n/pl";
import { translations as appTranslations } from "../../[locale]/i18n/pl";
import { translations as apiTranslations } from "../../api/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  appName: "unbottled.ai",
  api: apiTranslations,
  i18n: i18nTranslations,
  packages: packagesTranslations,
  ...appTranslations,
};
