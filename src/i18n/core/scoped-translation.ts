/**
 * Scoped Translation Factory
 * Creates module-specific translation functions that work only within a defined scope
 */

import { z } from "zod";
import { type CountryLanguage, defaultLocale, type Languages } from "./config";
import { getLanguageFromLocale } from "./language-utils";
import {
  navigateTranslationObject,
  type NestedValue,
  processTranslationValue,
} from "./shared-translation-utils";
import type { DotNotation, TParams } from "./static-types";

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
 * Non-recursive translation schema for generic constraints.
 * Used as a constraint in createScopedTranslation to avoid TypeScript's
 * instantiation depth limit for complex deeply nested translation objects.
 * Structurally equivalent to ScopedTranslationSchema at runtime.
 */
export interface TranslationSchemaConstraint {
  [key: string]:
    | string
    | {
        [key: string]:
          | string
          | {
              [key: string]:
                | string
                | {
                    [key: string]:
                      | string
                      | {
                          [key: string]:
                            | string
                            | {
                                [key: string]:
                                  | string
                                  | {
                                      [key: string]:
                                        | string
                                        | { [key: string]: string };
                                    };
                              };
                        };
                  };
            };
      };
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
 *
 * export const simpleT = createScopedTranslation({
 *   en: enTranslations,
 *   de: () => require("./de").translations,  // lazy - loaded on first DE request
 *   pl: () => require("./pl").translations,  // lazy - loaded on first PL request
 * });
 *
 * // Usage:
 * const { t } = simpleT(locale);
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

/**
 * Resolves a translation entry - supports both eager objects and lazy getters.
 * Lazy getters are called once and their result is cached.
 */
type LazyOrEager<T> = T | (() => T);

function resolveTranslation<T>(entry: LazyOrEager<T>): T {
  if (typeof entry === "function") {
    return (entry as () => T)();
  }
  return entry;
}

export function createScopedTranslation<
  const TEN,
  const TDE,
  const TPL,
>(translationsByLanguage: {
  en: TEN;
  de: LazyOrEager<TDE>;
  pl: LazyOrEager<TPL>;
}): {
  readonly ScopedTranslationKey: DotNotation<TEN>;
  readonly scopedT: (locale: CountryLanguage) => {
    t: (key: DotNotation<TEN>, params?: TParams) => TranslatedKeyType;
  };
  /**
   * Schema for a field that holds a scoped translation key.
   * Use when the value is a key string (e.g. "response.totalLeads") that the
   * frontend/widget will pass to t() to get the translated display string.
   */
  readonly translationKeySchema: () => z.ZodType<DotNotation<TEN>>;
} {
  // Cache resolved translations per language to avoid repeated getter calls
  const resolvedCache = new Map<string, Record<string, NestedValue>>();

  function getTranslations(language: Languages): Record<string, NestedValue> {
    const cached = resolvedCache.get(language);
    if (cached) {
      return cached;
    }

    const raw = resolveTranslation(
      translationsByLanguage[language as keyof typeof translationsByLanguage],
    );
    const resolved = raw as Record<string, NestedValue>;
    resolvedCache.set(language, resolved);
    return resolved;
  }

  return {
    ScopedTranslationKey: undefined as DotNotation<TEN>,
    translationKeySchema: () =>
      // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
      z.string() as unknown as z.ZodType<DotNotation<TEN>>,

    scopedT: function simpleT(locale: CountryLanguage): {
      t: (key: DotNotation<TEN>, params?: TParams) => TranslatedKeyType;
    } {
      return {
        t: (key: DotNotation<TEN>, params?: TParams): TranslatedKeyType => {
          // Extract language from locale with safety check
          if (!locale || typeof locale !== "string") {
            return key as TranslatedKeyType; // Return the key as fallback
          }
          if (!key || typeof key !== "string") {
            return key as TranslatedKeyType; // Return the key as fallback
          }

          const language = locale.split("-")[0] as Languages;
          const defaultLanguage = getLanguageFromLocale(defaultLocale);

          // Get translations for the requested language (resolves lazy getters on first access)
          const languageTranslations = getTranslations(language);
          const fallbackTranslations = getTranslations(defaultLanguage);

          // Navigate through the translation object using shared logic
          const keys = (key as string).split(".");
          let value = navigateTranslationObject(languageTranslations, keys);

          // Try fallback language if value not found
          if (value === undefined && language !== defaultLanguage) {
            value = navigateTranslationObject(fallbackTranslations, keys);
          }

          // Process the translation value using shared logic (handles parameter replacement)
          return processTranslationValue(
            value,
            key,
            params as TParams,
          ) as TranslatedKeyType;
        },
      };
    },
  };
}
