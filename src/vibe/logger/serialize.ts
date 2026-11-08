/**
 * Log value serialization.
 *
 * `JSON.stringify(new Error("x"))` is `{}` - message, name, stack and cause
 * are non-enumerable. Every JSON sink (server log file, error_logs.metadata,
 * client → server log reports) runs values through here first so Errors keep
 * their message, name, stack, cause chain and provider context (statusCode,
 * url, responseBody, ...), wherever they sit inside the metadata.
 */

import type { LoggerMetadata } from "./types";

const MAX_STRING_LENGTH = 2000;
const MAX_STACK_LENGTH = 4000;
const MAX_DEPTH = 8;
const MAX_ARRAY_ITEMS = 50;

/**
 * Own Error properties never worth logging: request echoes carry the full
 * prompt (huge, private) and header maps are noise.
 */
const SKIPPED_ERROR_KEYS = new Set([
  "stack",
  "requestBodyValues",
  "requestBody",
  "responseHeaders",
]);

function truncate(value: string, maxLength: number): string {
  return value.length <= maxLength
    ? value
    : `${value.slice(0, maxLength)}... [truncated ${value.length - maxLength} chars]`;
}

function serializeError(
  error: Error,
  seen: WeakSet<WeakKey>,
  depth: number,
): { [key: string]: LoggerMetadata } {
  const out: { [key: string]: LoggerMetadata } = {
    name: error.name,
    message: truncate(error.message, MAX_STRING_LENGTH),
  };
  // Provider/SDK errors carry their context as own enumerable fields
  // (statusCode, url, responseBody, data, code, errno, ...).
  for (const [key, value] of Object.entries(error)) {
    if (key in out || SKIPPED_ERROR_KEYS.has(key)) {
      continue;
    }
    out[key] = toLogValue(value, seen, depth + 1);
  }
  if (error instanceof AggregateError) {
    out["errors"] = toLogValue(error.errors, seen, depth + 1);
  }
  if (error.cause !== undefined) {
    out["cause"] = toLogValue(error.cause, seen, depth + 1);
  }
  if (error.stack) {
    out["stack"] = truncate(error.stack, MAX_STACK_LENGTH);
  }
  return out;
}

function toLogValue(
  // eslint-disable-next-line restricted/no-unknown -- serializes arbitrary thrown values and Error.cause, which the platform types as unknown
  value: unknown,
  seen: WeakSet<WeakKey>,
  depth: number,
): LoggerMetadata {
  if (value === null || value === undefined) {
    return value;
  }
  if (typeof value === "string") {
    return truncate(value, MAX_STRING_LENGTH);
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  if (typeof value === "bigint") {
    return value.toString();
  }
  if (typeof value === "function") {
    return `[Function ${value.name || "anonymous"}]`;
  }
  if (typeof value === "symbol") {
    return value.toString();
  }
  if (typeof value !== "object") {
    return String(value);
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? "Invalid Date" : value.toISOString();
  }
  if (seen.has(value)) {
    return "[Circular]";
  }
  if (depth >= MAX_DEPTH) {
    return "[Truncated: max depth]";
  }
  // `seen` tracks the current ancestor path only: shared (non-circular)
  // references serialize in full each time they appear.
  seen.add(value);
  const result = serializeObject(value, seen, depth);
  seen.delete(value);
  return result;
}

function serializeObject(
  value: WeakKey,
  seen: WeakSet<WeakKey>,
  depth: number,
): LoggerMetadata {
  if (value instanceof Error) {
    return serializeError(value, seen, depth);
  }
  if (Array.isArray(value)) {
    const items = value
      .slice(0, MAX_ARRAY_ITEMS)
      .map((item) => toLogValue(item, seen, depth + 1));
    if (value.length > MAX_ARRAY_ITEMS) {
      items.push(`[+${value.length - MAX_ARRAY_ITEMS} more]`);
    }
    return items;
  }
  if (value instanceof Map) {
    const out: { [key: string]: LoggerMetadata } = {};
    for (const [key, entry] of value) {
      out[String(key)] = toLogValue(entry, seen, depth + 1);
    }
    return out;
  }
  if (value instanceof Set) {
    return [...value]
      .slice(0, MAX_ARRAY_ITEMS)
      .map((item) => toLogValue(item, seen, depth + 1));
  }
  const out: { [key: string]: LoggerMetadata } = {};
  for (const [key, entry] of Object.entries(value)) {
    out[key] = toLogValue(entry, seen, depth + 1);
  }
  return out;
}

/** JSON-safe copy of a log value: Errors become plain, readable objects. */
export function serializeLogValue(value: LoggerMetadata): LoggerMetadata {
  return toLogValue(value, new WeakSet<WeakKey>(), 0);
}

/** JSON-safe copy of a log metadata record. */
export function serializeLogRecord(record: { [key: string]: LoggerMetadata }): {
  [key: string]: LoggerMetadata;
} {
  const out: { [key: string]: LoggerMetadata } = {};
  const seen = new WeakSet<WeakKey>();
  for (const [key, value] of Object.entries(record)) {
    out[key] = toLogValue(value, seen, 0);
  }
  return out;
}
