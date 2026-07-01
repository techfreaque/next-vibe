/**
 * Utility helpers that need i18n but cannot live in i18n/index.ts
 * (the boilerplate lint rule only allows the two standard exports there).
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { TasksTranslationKey } from "next-vibe/tasks/i18n";
import { scopedTranslation } from "next-vibe/tasks/i18n";

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
