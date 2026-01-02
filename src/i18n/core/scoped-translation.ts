/**
 * Scoped Translation Factory
 * Creates module-specific translation functions that work only within a defined scope
 */

import { type CountryLanguage, defaultLocale, type Languages } from "./config";
import { getLanguageFromLocale } from "./language-utils";
import { navigateTranslationObject, processTranslationValue } from "./shared-translation-utils";
import type { TParams } from "./static-types";
import type { DotNotation } from "./static-types";

// this value should never be used at runtime
export type TranslatedKeyType = "createScopedTranslation-key";

/**
 * Translation schema type for scoped modules
 * Supports deeply nested structures with recursive type definition
 */
export interface ScopedTranslationSchema {
  [key: string]: string | ScopedTranslationSchema;
}

/**
 * Creates a scoped translation system for a specific module
 * EN translations are used as the source of truth for type safety
 *
 * @param translationsByLanguage - Object mapping language codes to their translation schemas
 * @returns A simpleT function that works only with the provided translations
 *
 * @example
 * // In src/app/api/[locale]/sms/i18n/index.ts
 * import { createScopedTranslation } from "@/i18n/core/scoped-translation";
 * import { translations as enTranslations } from "./en";
 * import { translations as deTranslations } from "./de";
 * import { translations as plTranslations } from "./pl";
 *
 * export const simpleT = createScopedTranslation({
 *   en: enTranslations,
 *   de: deTranslations,
 *   pl: plTranslations,
 * });
 *
 * // Usage:
 * const { t } = simpleT("en-GLOBAL");
 * t("sms.error.invalid_phone_format"); // Type-safe based on EN schema
 */
/**
 * Helper type to extract the scoped translation key type from createScopedTranslation return
 */
export type ExtractScopedTranslationKey<T> = T extends {
  ScopedTranslationKey: infer K;
}
  ? K
  : never;

export function createScopedTranslation<
  const TTranslations extends Record<Languages, ScopedTranslationSchema>,
>(
  translationsByLanguage: TTranslations,
): {
  readonly ScopedTranslationKey: DotNotation<TTranslations["en"]>;
  readonly scopedT: (locale: CountryLanguage) => {
    t: (key: DotNotation<TTranslations["en"]>, params?: TParams) => TranslatedKeyType;
  };
} {
  return {
    ScopedTranslationKey: undefined as DotNotation<TTranslations["en"]>,

    scopedT: function simpleT(locale: CountryLanguage): {
      t: (key: DotNotation<TTranslations["en"]>, params?: TParams) => TranslatedKeyType;
    } {
      return {
        t: (key: DotNotation<TTranslations["en"]>, params?: TParams): TranslatedKeyType => {
          // Extract language from locale with safety check
          if (!locale || typeof locale !== "string") {
            return key as TranslatedKeyType; // Return the key as fallback
          }
          if (!key || typeof key !== "string") {
            return key as TranslatedKeyType; // Return the key as fallback
          }

          const language = locale.split("-")[0] as Languages;
          const defaultLanguage = getLanguageFromLocale(defaultLocale);

          // Get translations for the requested language
          const languageTranslations = translationsByLanguage[language];
          const fallbackTranslations = translationsByLanguage[defaultLanguage];

          // Navigate through the translation object using shared logic
          const keys = (key as string).split(".");
          let value = navigateTranslationObject(languageTranslations, keys);

          // Try fallback language if value not found
          if (value === undefined && language !== defaultLanguage) {
            value = navigateTranslationObject(fallbackTranslations, keys);
          }

          // Process the translation value using shared logic (handles parameter replacement)
          return processTranslationValue(value, key, params as TParams) as TranslatedKeyType;
        },
      };
    },
  };
}
