import { translations as packagesTranslations } from "../../../packages/i18n/de";
import { translations as appTranslations } from "../../[locale]/i18n/de";
import { translations as apiTranslations } from "../../api/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
  ...appTranslations,
};
