import { translations as deTranslations } from "./de";
import { translations as enTranslations } from "./en";
import { translations as plTranslations } from "./pl";

export const i18n = {
  en: enTranslations,
  de: deTranslations,
  pl: plTranslations,
};

export type I18nTranslations = typeof enTranslations;
