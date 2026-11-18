/**
 * Utility helpers that need i18n but cannot live in i18n/index.ts
 * (the boilerplate lint rule only allows the two standard exports there).
 */

import type { CountryLanguage } from "../../core/i18n/core/config";
import type { TasksTranslationKey } from "../i18n";
import { scopedTranslation } from "../i18n";

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

/**
 * Like resolveTaskDisplayName, but also tries the task endpoint's own scope:
 * system tasks store the endpoint-scoped key (e.g. "start.cron.name"), which
 * the tasks scope cannot resolve, so logs showed the raw key.
 */
export async function resolveTaskDisplayNameForRoute(
  nameOrKey: string,
  routeId: string,
  locale: CountryLanguage,
): Promise<string> {
  const viaTasksScope = resolveTaskDisplayName(nameOrKey, locale);
  if (viaTasksScope !== nameOrKey) {
    return viaTasksScope;
  }
  const { getEndpoint } = await import("@/generated/endpoints/endpoint");
  const endpoint = await getEndpoint(routeId);
  if (!endpoint) {
    return nameOrKey;
  }
  const { t } = endpoint.scopedTranslation.scopedT(locale);
  return t(nameOrKey);
}
