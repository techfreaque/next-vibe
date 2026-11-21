/**
 * Display names for cron tasks.
 *
 * System tasks store scoped i18n keys as displayName (e.g. "task.name").
 * Resolve them through the task's own endpoint; an unresolved key reads worse
 * than the task id, so fall back to the id.
 */

import "server-only";

import { getEndpoint } from "@/generated/endpoints/endpoint";

import type { CountryLanguage } from "../../core/i18n/core/config";

const I18N_KEY_RE = /^[A-Za-z0-9_]+(\.[A-Za-z0-9_]+)+$/;

export interface TaskNameSource {
  id: string;
  routeId: string;
  displayName: string;
}

/** Map of task id -> human display name. */
export async function translateTaskNames(
  rows: readonly TaskNameSource[],
  locale: CountryLanguage,
): Promise<Map<string, string>> {
  const names = new Map<string, string>();
  const unique = new Map(rows.map((row) => [row.id, row]));
  await Promise.all(
    [...unique.values()].map(async (row) => {
      // Plain titles ("Dreaming") need no endpoint lookup.
      if (!I18N_KEY_RE.test(row.displayName)) {
        names.set(row.id, row.displayName);
        return;
      }
      const endpoint = await getEndpoint(row.routeId);
      const translated = endpoint
        ? endpoint.scopedTranslation.scopedT(locale).t(row.displayName)
        : row.displayName;
      names.set(
        row.id,
        !translated || I18N_KEY_RE.test(translated) ? row.id : translated,
      );
    }),
  );
  return names;
}
