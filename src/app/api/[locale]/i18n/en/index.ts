import { translations as sharedTranslations } from "../../shared/i18n/en";
import { translations as sharedUtilsTranslations } from "../../shared/utils/i18n/en";
import { translations as systemTranslations } from "../../system/i18n/en";
import { translations as userTranslations } from "../../user/i18n/en";

export const translations = {
  shared: {
    ...sharedTranslations,
    utils: sharedUtilsTranslations,
  },

  system: systemTranslations,
  user: userTranslations,
};
