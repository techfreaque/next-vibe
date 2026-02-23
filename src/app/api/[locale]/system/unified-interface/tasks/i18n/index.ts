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

import { translations as deTranslations } from "./de";
import { translations as enTranslations } from "./en";
import { translations as plTranslations } from "./pl";

// Create an isolated translation function that ONLY uses tasks module translations
// EN translations are used as the source of truth for type safety
export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: deTranslations,
  pl: plTranslations,
});

// Export the translation key type using the helper
export type TasksTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type TasksT = ReturnType<typeof scopedTranslation.scopedT>["t"];
