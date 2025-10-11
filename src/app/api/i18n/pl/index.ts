import { translations as slugTranslations } from "../../[...slug]/i18n/pl";
import { translations as localeTranslations } from "../../[locale]/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...localeTranslations,
  "[...slug]": slugTranslations,
};
