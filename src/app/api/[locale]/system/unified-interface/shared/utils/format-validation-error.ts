/**
 * Shared validation error parser and formatters
 * parseValidationError extracts structured data - each platform formats it.
 */

import type { CreateApiEndpointAny } from "../types/endpoint-base";
import type { WidgetData } from "../types/json";

/**
 * Convert camelCase to kebab-case for CLI flags
 */
function camelToKebab(str: string): string {
  return str.replaceAll(/([A-Z])/g, "-$1").toLowerCase();
}

/**
 * Serialize a single field key+value into CLI flag string(s).
 * Objects are expanded as dot-notation: --key.subkey="value"
 * Primitives: --key="value"
 */
function serializeFlag(key: string, value: WidgetData): string {
  const kebabKey = camelToKebab(key);
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    const entries = Object.entries(value);
    if (entries.length === 0) {
      return `--${kebabKey}.KEY="value"`;
    }
    return entries
      .map(([k, v]) => `--${kebabKey}.${k}="${String(v)}"`)
      .join(" ");
  }
  return `--${kebabKey}="${String(value)}"`;
}

/**
 * Parse a comma-joined validation error string into field/message pairs
 * Input: "name: msg, email: msg2"
 */
function parseFieldErrors(
  errorStr: string,
): Array<{ field: string; message: string }> {
  const parts = errorStr.split(/,\s*(?=\w[\w.]*:\s)/);
  return parts.map((part) => {
    const colonIdx = part.indexOf(":");
    if (colonIdx === -1) {
      return { field: "", message: part.trim() };
    }
    return {
      field: part.slice(0, colonIdx).trim(),
      message: part.slice(colonIdx + 1).trim(),
    };
  });
}

/**
 * Structured data extracted from a validation error response.
 * Each platform uses this to build its own formatted message.
 */
export interface ValidationErrorData {
  /** Number of validation errors */
  count: number;
  /** Per-field errors with CLI flag name pre-computed */
  fields: Array<{ field: string; flagName: string; message: string }>;
  /** Endpoint alias for example commands (null if no endpoint) */
  alias: string | null;
  /** Raw example values from endpoint definition */
  exampleValues: Record<string, WidgetData>;
  /** Already-provided input values (for --interactive pre-fill) */
  inputData: Record<string, string>;
}

/**
 * Extract structured validation error data from messageParams.
 * Returns null if messageParams don't match the validation error shape.
 */
export function parseValidationError(
  messageParams: Record<string, string | number> | undefined,
  endpoint?: CreateApiEndpointAny | null,
  inputData?: Record<string, string>,
): ValidationErrorData | null {
  if (
    !messageParams ||
    !("error" in messageParams) ||
    !("errorCount" in messageParams)
  ) {
    return null;
  }

  const rawErrors = String(messageParams.error);
  const count = Number(messageParams.errorCount);
  const parsed = parseFieldErrors(rawErrors);

  const fields = parsed.map(({ field, message }) => ({
    field,
    flagName: field ? camelToKebab(field) : "",
    message,
  }));

  const alias = endpoint
    ? endpoint.aliases && endpoint.aliases.length > 0
      ? endpoint.aliases[0]
      : endpoint.path.join("-")
    : null;

  const exampleValues =
    endpoint?.examples?.requests &&
    typeof endpoint.examples.requests === "object"
      ? ((Object.values(
          endpoint.examples.requests as Record<string, Record<string, string>>,
        )[0] ?? {}) as Record<string, WidgetData>)
      : {};

  return {
    count,
    fields,
    alias,
    exampleValues,
    inputData: inputData ?? {},
  };
}

/**
 * Build an example command from endpoint data
 * Returns a vibe CLI example string, or null if no examples defined
 */
export function buildExampleCommand(
  endpoint: CreateApiEndpointAny,
): string | null {
  const example =
    endpoint.examples?.requests &&
    typeof endpoint.examples.requests === "object"
      ? (Object.values(
          endpoint.examples.requests as Record<string, Record<string, string>>,
        )[0] ?? null)
      : null;

  if (!example || typeof example !== "object") {
    return null;
  }

  const alias =
    endpoint.aliases && endpoint.aliases.length > 0
      ? endpoint.aliases[0]
      : endpoint.path.join("-");

  const flags = Object.entries(example as Record<string, WidgetData>)
    .map(([k, v]) => serializeFlag(k, v))
    .join(" ");

  // eslint-disable-next-line i18next/no-literal-string
  return `vibe ${alias} ${flags}`;
}

/**
 * Format validation error for CLI output.
 * Bullets per field + vibe example command + --interactive hint + vibe help.
 */
export function formatValidationErrorDetails(
  messageParams: Record<string, string | number> | undefined,
  endpoint: CreateApiEndpointAny | null | undefined,
  /** Already-provided input values - used to pre-fill the --interactive hint */
  inputData?: Record<string, string> | undefined,
): string | null {
  const data = parseValidationError(messageParams, endpoint, inputData);
  if (!data) {
    return null;
  }

  const { count, fields, alias, exampleValues, inputData: input } = data;

  // eslint-disable-next-line i18next/no-literal-string
  let out = `Missing required fields (${count}):`;
  for (const { flagName, field, message } of fields) {
    if (field) {
      // eslint-disable-next-line i18next/no-literal-string
      out += `\n  • --${flagName}: ${message}`;
    } else {
      // eslint-disable-next-line i18next/no-literal-string
      out += `\n  • ${message}`;
    }
  }

  if (alias) {
    const merged = { ...exampleValues, ...input };

    if (Object.keys(merged).length > 0) {
      const flags = Object.entries(merged)
        .map(([k, v]) => serializeFlag(k, v))
        .join(" ");
      // eslint-disable-next-line i18next/no-literal-string
      out += `\n\nExample:\n  vibe ${alias} ${flags}`;
    }

    const existingFlags =
      Object.keys(input).length > 0
        ? `${Object.entries(input)
            .filter(([, v]) => v !== undefined && v !== "")
            .map(([k, v]) => serializeFlag(k, v))
            .join(" ")} `
        : "";

    // eslint-disable-next-line i18next/no-literal-string
    out += `\n\nOr run interactively:\n  vibe ${alias} ${existingFlags}--interactive`;

    // eslint-disable-next-line i18next/no-literal-string
    out += `\n\nMore info:\n  vibe help ${alias}`;
  }

  return out;
}

/**
 * Format validation error for API/MCP/AI output.
 * Compact field list only - no vibe CLI hints.
 */
export function formatValidationErrorCompact(
  messageParams: Record<string, string | number> | undefined,
  endpoint?: CreateApiEndpointAny | null,
): string | null {
  const data = parseValidationError(messageParams, endpoint);
  if (!data) {
    return null;
  }

  const { count, fields } = data;

  // eslint-disable-next-line i18next/no-literal-string
  let out = `Validation failed (${count} error${count === 1 ? "" : "s"}):`;
  for (const { field, message } of fields) {
    if (field) {
      // eslint-disable-next-line i18next/no-literal-string
      out += `\n  • ${field}: ${message}`;
    } else {
      // eslint-disable-next-line i18next/no-literal-string
      out += `\n  • ${message}`;
    }
  }

  return out;
}
