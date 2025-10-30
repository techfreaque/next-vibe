import { translations as slugTranslations } from "../../[...slug]/i18n/pl";
import { translations as localeTranslations } from "../../[locale]/i18n/pl";

export const translations = {
  ...localeTranslations,
  "[...slug]": slugTranslations,
};
