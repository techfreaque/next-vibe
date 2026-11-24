import "server-only";

import { getEndpoint } from "@/generated/endpoints/endpoint";

import type { CountryLanguage } from "../../core/i18n/core/config";

const I18N_KEY_RE = /^[A-Za-z0-9_]+(\.[A-Za-z0-9_]+)+$/;

export interface TaskNameSource {
  id: string;
  routeId: string;
  displayName: string;
  userId: string | null;
}

type TaskTranslation = (key: string) => string;

async function getTaskTranslation(
  task: Pick<TaskNameSource, "id" | "routeId">,
  locale: CountryLanguage,
): Promise<TaskTranslation | undefined> {
  const endpoint = await getEndpoint(task.routeId);
  if (endpoint) {
    return endpoint.scopedTranslation.scopedT(locale).t;
  }

  // Seeded tasks can be listed even when their endpoint is not in the public
  // catalog, such as the model price refresh task outside development.
  const { cronTasks } = await import("@/generated/tasks/index");
  const registeredTask = cronTasks.find((entry) => entry.id === task.id);
  return registeredTask?.definition.scopedTranslation.scopedT(locale).t;
}

function resolveName(
  task: TaskNameSource,
  t: TaskTranslation | undefined,
): string {
  const translated: string | undefined = t?.(task.displayName);
  if (translated && translated !== task.displayName) {
    return translated;
  }
  return I18N_KEY_RE.test(task.displayName) ? task.id : task.displayName;
}

export async function translateTaskName(
  task: TaskNameSource,
  locale: CountryLanguage,
): Promise<string> {
  if (task.userId !== null) {
    return task.displayName;
  }
  return resolveName(task, await getTaskTranslation(task, locale));
}

export async function translateTaskFields<
  T extends {
    id: string;
    routeId: string;
    displayName: string;
    description: string | null;
  },
>(task: T, userId: string | null, locale: CountryLanguage): Promise<T> {
  if (userId !== null) {
    return task;
  }

  const t = await getTaskTranslation(task, locale);
  const translatedDescription: string | undefined = task.description
    ? t?.(task.description)
    : undefined;
  return {
    ...task,
    displayName: resolveName({ ...task, userId }, t),
    description:
      translatedDescription !== task.description && translatedDescription
        ? translatedDescription
        : task.description && !I18N_KEY_RE.test(task.description)
          ? task.description
          : null,
  };
}

/** Map of task id to display name in the viewer's locale. */
export async function translateTaskNames(
  rows: readonly TaskNameSource[],
  locale: CountryLanguage,
): Promise<Map<string, string>> {
  const unique = new Map(rows.map((row) => [row.id, row]));
  const names = await Promise.all(
    [...unique.values()].map(async (row): Promise<[string, string]> => [
      row.id,
      await translateTaskName(row, locale),
    ]),
  );
  return new Map(names);
}
