import { translations as deTranslations } from "../../i18n/de/index.js";
import { translations as enTranslations } from "../../i18n/en/index.js";
import { translations as plTranslations } from "../../i18n/pl/index.js";

type Translations = typeof enTranslations;
type TranslationKey = string;

interface TranslationParams {
  [key: string]: string | number;
}

const translations: Record<string, Translations> = {
  en: enTranslations,
  de: deTranslations,
  pl: plTranslations,
};

function getNestedValue(obj: Translations, path: string): string {
  const keys = path.split(".");
  let value: string | Record<string, unknown> | undefined = obj as Record<
    string,
    unknown
  >;

  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = value[key] as string | Record<string, unknown>;
    } else {
      return path;
    }
  }

  return typeof value === "string" ? value : path;
}

function interpolate(template: string, params?: TranslationParams): string {
  if (!params) {
    return template;
  }

  return template.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
    return params[key]?.toString() ?? match;
  });
}

export function t(key: TranslationKey, params?: TranslationParams): string {
  // Default to English for CLI tools
  // eslint-disable-next-line node/no-process-env
  const locale = process.env.LOCALE ?? "en";
  const translationSet = translations[locale] ?? translations.en;

  const template = getNestedValue(translationSet, key);
  return interpolate(template, params);
}
