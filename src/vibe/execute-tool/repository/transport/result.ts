import type { z } from "zod";

import type { WidgetData } from "../../../core/utils/json";

function copyDates(value: WidgetData, parsed: z.output<z.ZodType>): WidgetData {
  if (typeof value === "string" && parsed instanceof Date) {
    return Number.isFinite(parsed.getTime()) ? parsed : value;
  }
  if (Array.isArray(value) && Array.isArray(parsed)) {
    return value.map((item, index) => copyDates(item, parsed[index]));
  }
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    !(value instanceof Date) &&
    parsed &&
    typeof parsed === "object" &&
    !Array.isArray(parsed)
  ) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        copyDates(item, Object.getOwnPropertyDescriptor(parsed, key)?.value),
      ]),
    );
  }
  return value;
}

/** Restore schema-declared dates while preserving the peer's payload fields. */
export function reviveRemoteResultDates(
  value: WidgetData,
  schema: z.ZodType | undefined,
): WidgetData {
  try {
    const parsed = schema?.safeParse(value);
    return parsed?.success ? copyDates(value, parsed.data) : value;
  } catch {
    // A peer can run a different schema version or expose an unknown tool.
    return value;
  }
}
