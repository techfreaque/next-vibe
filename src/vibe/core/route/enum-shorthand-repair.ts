/**
 * Enum shorthand repair for AI/CLI callers.
 *
 * Enum values are i18n keys (`enums.provider.BRAVE`). Models - and humans on the
 * CLI - routinely send the short form (`BRAVE`, `brave`) and the call failed
 * validation even though the intent was unambiguous. This maps a rejected enum
 * value to the ONE allowed value whose last dot-segment (or whole value) matches
 * case-insensitively. Ambiguous or unknown values are left untouched so the
 * normal validation error still reaches the caller.
 */

import type { z } from "zod";

import type { WidgetData } from "../utils/json";

interface WidgetRecord {
  [key: string]: WidgetData;
}

function isRecord(value: WidgetData): value is WidgetRecord {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    !(value instanceof Date)
  );
}

/** Resolve a shorthand against the allowed values; null when none/ambiguous. */
export function matchEnumShorthand(
  value: string,
  allowed: readonly string[],
): string | null {
  const needle = value.trim().toLowerCase();
  if (needle.length === 0) {
    return null;
  }
  const matches = allowed.filter((candidate) => {
    const lower = candidate.toLowerCase();
    const lastSegment = lower.slice(lower.lastIndexOf(".") + 1);
    return lower === needle || lastSegment === needle;
  });
  return matches.length === 1 ? matches[0] : null;
}

/** Return a copy of `data` with the value at `path` replaced (null if unreachable). */
function setAtPath(
  data: WidgetData,
  path: readonly PropertyKey[],
  replacement: string,
): WidgetData | null {
  if (path.length === 0) {
    return replacement;
  }
  const [head, ...rest] = path;
  if (Array.isArray(data) && typeof head === "number") {
    if (head < 0 || head >= data.length) {
      return null;
    }
    const child = setAtPath(data[head], rest, replacement);
    if (child === null) {
      return null;
    }
    const copy = [...data];
    copy[head] = child;
    return copy;
  }
  if (isRecord(data) && typeof head === "string" && head in data) {
    const child = setAtPath(data[head], rest, replacement);
    if (child === null) {
      return null;
    }
    return { ...data, [head]: child };
  }
  return null;
}

function getAtPath(
  data: WidgetData,
  path: readonly PropertyKey[],
): WidgetData | undefined {
  let current: WidgetData = data;
  for (const key of path) {
    if (Array.isArray(current) && typeof key === "number") {
      current = current[key];
    } else if (isRecord(current) && typeof key === "string") {
      current = current[key];
    } else {
      return undefined;
    }
  }
  return current;
}

/**
 * Repair enum shorthands in `data` against `schema`. Returns the repaired data
 * plus the fields that were rewritten (empty when nothing changed).
 */
export function repairEnumShorthands(
  data: WidgetData,
  schema: z.ZodType,
): { data: WidgetData; repaired: string[] } {
  const parsed = schema.safeParse(data);
  if (parsed.success) {
    return { data, repaired: [] };
  }
  let current = data;
  const repaired: string[] = [];
  for (const issue of parsed.error.issues) {
    if (issue.code !== "invalid_value") {
      continue;
    }
    const allowed = issue.values.filter(
      (v): v is string => typeof v === "string",
    );
    const sent = getAtPath(current, issue.path);
    if (typeof sent !== "string" || allowed.length === 0) {
      continue;
    }
    const match = matchEnumShorthand(sent, allowed);
    if (match === null) {
      continue;
    }
    const next = setAtPath(current, issue.path, match);
    if (next === null) {
      continue;
    }
    current = next;
    repaired.push(issue.path.map(String).join("."));
  }
  return { data: current, repaired };
}
