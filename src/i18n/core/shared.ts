import type { CountryLanguage, Languages } from "./config";
import type { TFunction, TParams, TranslationKey } from "./static-types";
import { translateKey } from "./translation-utils";

// Server-side translation function
export function simpleT(locale: CountryLanguage): {
  t: TFunction;
} {
  return {
    t: <K extends TranslationKey>(key: K, params?: TParams): string => {
      return _simpleT(locale, key, params);
    },
  };
}

// Server-side translation function
export function _simpleT<K extends TranslationKey>(
  locale: CountryLanguage,
  key: K,
  params?: TParams,
): string {
  // Extract language from locale with safety check
  if (!locale || typeof locale !== "string") {
    // oxlint-disable-next-line no-console
    console.error("Invalid locale provided to translation function:", locale);
    return key; // Return the key as fallback
  }
  if (!key || typeof key !== "string") {
    // oxlint-disable-next-line no-console
    console.error("Invalid key provided to translation function:", key);
    return key; // Return the key as fallback
  }

  const language = locale.split("-")[0] as Languages;

  // Use the shared translation utility with server context
  return translateKey(
    key,
    language,
    params,
    undefined, // Use default fallback language
    "server",
  );
}
