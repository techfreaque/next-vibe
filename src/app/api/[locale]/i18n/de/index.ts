import { translations as sharedTranslations } from "../../shared/i18n/de";
import { translations as sharedUtilsTranslations } from "../../shared/utils/i18n/de";
import { translations as systemTranslations } from "../../system/i18n/de";
import { translations as userTranslations } from "../../user/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  shared: {
    ...sharedTranslations,
    utils: sharedUtilsTranslations,
  },

  system: systemTranslations,
  user: userTranslations,
};
