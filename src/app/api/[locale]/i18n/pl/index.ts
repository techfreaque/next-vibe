import { translations as sharedTranslations } from "../../shared/i18n/pl";
import { translations as sharedUtilsTranslations } from "../../shared/utils/i18n/pl";
import { translations as systemTranslations } from "../../system/i18n/pl";
import { translations as userTranslations } from "../../user/i18n/pl";

export const translations = {
  shared: {
    ...sharedTranslations,
    utils: sharedUtilsTranslations,
  },
  system: systemTranslations,
  user: userTranslations,
};
