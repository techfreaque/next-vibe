import { translations as slugTranslations } from "../../[...slug]/i18n/de";
import { translations as localeTranslations } from "../../[locale]/i18n/de";

export const translations = {
  ...localeTranslations,
  "[...slug]": slugTranslations,
};
