import "server-only";

import { inArray, or } from "drizzle-orm";

import type { CountryLanguage } from "../../core/i18n/core/config";
import { db } from "../../database";
import { cronTasks } from "../cron/db";
import { translateTaskNames } from "../cron/task-names";

/** Pulse history originally stored display names and scoped keys without task ids. */
export async function loadPulseTaskNames(
  references: readonly string[],
  locale: CountryLanguage,
  unavailableName?: string,
): Promise<Map<string, string>> {
  const values = [...new Set(references)];
  if (values.length === 0) {
    return new Map();
  }
  const byId = inArray(cronTasks.id, values);
  const tasks = await db
    .select({
      id: cronTasks.id,
      routeId: cronTasks.routeId,
      displayName: cronTasks.displayName,
      userId: cronTasks.userId,
    })
    .from(cronTasks)
    .where(
      unavailableName ? or(byId, inArray(cronTasks.displayName, values)) : byId,
    );
  const names = await translateTaskNames(tasks, locale);
  if (unavailableName === undefined) {
    return names;
  }

  const legacy = new Map<string, Set<string>>();
  for (const task of tasks) {
    const name = names.get(task.id) ?? task.displayName;
    const labels = legacy.get(task.displayName) ?? new Set<string>();
    labels.add(name);
    legacy.set(task.displayName, labels);
  }

  for (const value of values) {
    if (names.has(value)) {
      continue;
    }
    const labels = [...(legacy.get(value) ?? [])];
    if (labels.length === 1) {
      names.set(value, labels[0]);
    } else if (
      labels.length > 1 ||
      /^[A-Za-z][\w]*(?:\.[A-Za-z][\w]*)+$/.test(value)
    ) {
      names.set(value, unavailableName);
    }
  }
  return names;
}
