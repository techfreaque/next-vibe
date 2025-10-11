import { translations as appTranslations } from "../../[locale]/i18n/pl";
import { translations as apiTranslations } from "../../api/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  appName: "Centrum Usług Social Media",
  api: apiTranslations,
  ...appTranslations,
};
