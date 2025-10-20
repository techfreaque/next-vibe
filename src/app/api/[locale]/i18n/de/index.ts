import { translations as v1Translations } from "../../v1/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  v1: v1Translations,
  common: {
    appName: "unbottled.ai",
  },
};
