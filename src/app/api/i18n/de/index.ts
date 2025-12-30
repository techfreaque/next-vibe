import { translations as localeTranslations } from "../../[locale]/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...localeTranslations,
};
