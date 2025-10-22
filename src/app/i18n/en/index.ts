import { translations as packagesTranslations } from "../../../packages/i18n/en";
import { translations as appTranslations } from "../../[locale]/i18n/en";
import { translations as apiTranslations } from "../../api/i18n/en";

export const translations = {
  appName: "unbottled.ai",
  api: apiTranslations,
  packages: packagesTranslations,
  i18n: {
    common: {
      calendar: {
        timezone: {
          zones: {
            PL: "Europe/Warsaw",
            DE: "Europe/Berlin",
            global: "UTC",
          },
        },
      },
    },
  },
  // we spread [locale] translations to avoid it in the translation key
  ...appTranslations,
};
