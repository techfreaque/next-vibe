import { translations as slugTranslations } from "../../[...slug]/i18n/en";
import { translations as localeTranslations } from "../../[locale]/i18n/en";

export const translations = {
  ...localeTranslations,
  "[...slug]": slugTranslations,
};
