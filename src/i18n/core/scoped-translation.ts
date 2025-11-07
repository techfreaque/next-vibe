/**
 * Scoped Translation Factory
 * Creates module-specific translation functions that work only within a defined scope
 */

import type { CountryLanguage, Languages } from "./config";
import {
  navigateTranslationObject,
  processTranslationValue,
} from "./shared-translation-utils";
import type { TParams } from "./static-types";

/**
 * Generic translation parameter type for scoped translations
 */
export type ScopedTParams = Record<string, string | number | boolean>;

/**
 * Translation schema type for scoped modules
 * Supports nested structures like { sms: { error: { key: "value" } } }
 */
type NestedTranslation =
  | string
  | { [key: string]: string | { [key: string]: string } };

export type ScopedTranslationSchema = Record<string, NestedTranslation>;

/**
 * Extract translation keys from the EN schema for type safety
 * Recursively extracts all nested keys as dot-notation strings
 */
type ExtractKeys<T, Prefix extends string = ""> = T extends string
  ? Prefix
  : T extends Record<string, string>
    ? {
        [K in keyof T]: ExtractKeys<
          T[K],
          Prefix extends "" ? `${K & string}` : `${Prefix}.${K & string}`
        >;
      }[keyof T]
    : T extends Record<string, Record<string, string>>
      ? {
          [K in keyof T]: ExtractKeys<
            T[K],
            Prefix extends "" ? `${K & string}` : `${Prefix}.${K & string}`
          >;
        }[keyof T]
      : T extends Record<string, NestedTranslation>
        ? {
            [K in keyof T]: ExtractKeys<
              T[K],
              Prefix extends "" ? `${K & string}` : `${Prefix}.${K & string}`
            >;
          }[keyof T]
        : never;

/**
 * Creates a scoped translation system for a specific module
 * EN translations are used as the source of truth for type safety
 *
 * @param translationsByLanguage - Object mapping language codes to their translation schemas
 * @returns A simpleT function that works only with the provided translations
 *
 * @example
 * // In src/app/api/[locale]/v1/core/sms/i18n/index.ts
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
export function createScopedTranslation<
  TEnTranslations extends ScopedTranslationSchema,
  TTranslations extends Record<Languages, TEnTranslations>,
>(translationsByLanguage: TTranslations) {
  type TranslationKey = ExtractKeys<TEnTranslations>;

  return function simpleT(locale: CountryLanguage): {
    t: (key: TranslationKey, params?: ScopedTParams) => string;
  } {
    return {
      t: (key: TranslationKey, params?: ScopedTParams): string => {
        // Extract language from locale with safety check
        if (!locale || typeof locale !== "string") {
          return key; // Return the key as fallback
        }

        const language = locale.split("-")[0] as Languages;
        const fallbackLanguage: Languages = "en";

        // Get translations for the requested language
        const languageTranslations = translationsByLanguage[language];
        const fallbackTranslations = translationsByLanguage[fallbackLanguage];

        // Navigate through the translation object using shared logic
        const keys = key.split(".");
        let value = navigateTranslationObject(languageTranslations, keys);

        // Try fallback language if value not found
        if (value === undefined && language !== fallbackLanguage) {
          value = navigateTranslationObject(fallbackTranslations, keys);
        }

        // Process the translation value using shared logic (handles parameter replacement)
        return processTranslationValue(value, key, params as TParams, "scoped");
      },
    };
  };
}
