/**
 * Module Scoped Translation for the Tasks domain
 *
 * This module provides an isolated translation function for the tasks module.
 * It ONLY uses translations from the tasks/i18n folder (en, de, pl).
 * It does NOT access the global translation object.
 *
 * @example
 * import { scopedTranslation } from "../i18n";
 *
 * const { t } = scopedTranslation.scopedT(locale);
 * t("errors.fetchCronTasks");
 */

import { createScopedTranslation } from "@/i18n/core/scoped-translation";
import type { CountryLanguage } from "@/i18n/core/config";

import { translations as enTranslations } from "./en";

// Create an isolated translation function that ONLY uses tasks module translations
// EN translations are used as the source of truth for type safety
export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("./de").translations,
  pl: () => require("./pl").translations,
});

// Export the translation key type using the helper
export type TasksTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type TasksT = ReturnType<typeof scopedTranslation.scopedT>["t"];

/**
 * Resolve a task display name that may be a scoped translation key or a plain string.
 * Used in seeds and logging where the value comes from DB/registry as a plain string.
 * Falls back to the input unchanged if not a known key.
 */
export function resolveTaskDisplayName(
  nameOrKey: string,
  locale: CountryLanguage,
): string {
  const { t } = scopedTranslation.scopedT(locale);
  return t(nameOrKey as TasksTranslationKey);
}
