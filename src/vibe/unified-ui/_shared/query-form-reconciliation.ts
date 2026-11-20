import type { WidgetData } from "../../core/utils/json";

export async function restoreSavedQueryForm({
  readSaved,
  getValues,
  isCurrent,
  apply,
}: {
  readSaved: () => Promise<string | null>;
  getValues: () => Record<string, WidgetData>;
  isCurrent: () => boolean;
  apply: (saved: string) => void;
}): Promise<void> {
  const beforeRead = JSON.stringify(getValues());
  const saved = await readSaved();
  if (saved && isCurrent() && JSON.stringify(getValues()) === beforeRead) {
    apply(saved);
  }
}

/**
 * A GET response can supply missing request fields. Only apply those values
 * to the form that still describes the completed request.
 */
export function getQueryFormResponseDefaults<TRequest, TResponse>(
  submitted: TRequest,
  current: TRequest,
  withResponse: TResponse,
): (TResponse & TRequest) | undefined {
  const currentValues = JSON.stringify(current);
  if (JSON.stringify(submitted) !== currentValues) {
    return undefined;
  }
  const next = { ...withResponse, ...current };
  return JSON.stringify(next) === currentValues ? undefined : next;
}
