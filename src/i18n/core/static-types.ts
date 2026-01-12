import type { ExplicitObjectType } from "next-vibe/shared/types/utils";

import type { translationsKeyTypesafety } from "@/config/debug";

import type { TranslationSchema } from "./config";
import type { TranslatedKeyType } from "./scoped-translation";

export interface TranslationElement {
  [key: string]: string | number | string[] | TranslationElement;
}

// Utility type to create dot-notation paths for nested objects
type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;

export type DotNotation<T> = (
  T extends ExplicitObjectType
    ? {
        [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<DotNotation<T[K]>>}`;
      }[Exclude<keyof T, symbol>]
    : ""
) extends infer D
  ? Extract<D, string>
  : never;

// Type for all possible translation keys
export type TranslationKey = typeof translationsKeyTypesafety extends true
  ? _TranslationKey
  : string;
type _TranslationKey = DotNotation<TranslationSchema> | TranslatedKeyType;

// Utility type to get the type of a value at a specific path
type PathValue<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? PathValue<T[K], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;

// Type for getting the value type of a translation key
export type TranslationValue<K extends TranslationKey> = PathValue<
  TranslationSchema,
  K
>;

export type TParams = Record<string, string | number>;
export type TFunction = <K extends TranslationKey>(
  key: K,
  params?: TParams,
) => string;

/**
 * Utility type to extract the scoped key type from a scopedT function or scoped translation object
 *
 * For best results, use with the full createScopedTranslation result which includes ScopedTranslationKey:
 * @example
 * import { scopedTranslation } from "@/app/api/[locale]/contact/i18n";
 * type ContactKeys = ExtractScopedKeyType<typeof scopedTranslation>;
 * // ContactKeys = "title" | "description" | "form.label" | "form.fields.name.label" | ...
 *
 * For scopedT functions, use the string type from the scoped translation object's ScopedTranslationKey:
 * @example
 * type ContactKeys = typeof scopedTranslation.ScopedTranslationKey;
 */
export type ExtractScopedKeyType<T> =
  // If T has ScopedTranslationKey property (from createScopedTranslation result), extract it
  T extends { ScopedTranslationKey: infer K extends string }
    ? K
    : // Otherwise return never - use the ScopedTranslationKey property directly instead
      never;
