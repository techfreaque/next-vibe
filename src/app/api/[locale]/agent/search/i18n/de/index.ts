import { translations as braveTranslations } from "../../brave/i18n/de";
import { translations as kagiTranslations } from "../../kagi/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  brave: braveTranslations,
  kagi: kagiTranslations,
};
