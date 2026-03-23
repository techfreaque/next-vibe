/**
 * Shared validation error formatter
 * Used by CLI, MCP, and AI tool responses to produce human-readable error text
 */

import type { CreateApiEndpointAny } from "../types/endpoint-base";
import type { JsonValue } from "./error-types";

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
function serializeFlag(key: string, value: JsonValue): string {
  const kebabKey = camelToKebab(key);
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    const entries = Object.entries(value as Record<string, JsonValue>);
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
function parseValidationErrors(
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

  const flags = Object.entries(example as Record<string, JsonValue>)
    .map(([k, v]) => serializeFlag(k, v))
    .join(" ");

  // eslint-disable-next-line i18next/no-literal-string
  return `vibe ${alias} ${flags}`;
}

/**
 * Format validation error messageParams into readable text.
 * Detects the { error: "field: msg, ...", errorCount: N } shape from validateData()
 * and returns a multi-line string with bullet points and an optional example command.
 *
 * Returns null if the params don't match the validation error shape.
 */
export function formatValidationErrorDetails(
  messageParams: Record<string, string | number> | undefined,
  endpoint: CreateApiEndpointAny | null | undefined,
  /** Already-provided input values - used to pre-fill the --interactive hint */
  inputData?: Record<string, string> | undefined,
): string | null {
  if (
    !messageParams ||
    !("error" in messageParams) ||
    !("errorCount" in messageParams)
  ) {
    return null;
  }

  const rawErrors = String(messageParams.error);
  const count = Number(messageParams.errorCount);
  const parsed = parseValidationErrors(rawErrors);

  // eslint-disable-next-line i18next/no-literal-string
  let out = `Missing required fields (${count}):`;
  for (const { field, message } of parsed) {
    if (field) {
      // eslint-disable-next-line i18next/no-literal-string
      out += `\n  • --${camelToKebab(field)}: ${message}`;
    } else {
      // eslint-disable-next-line i18next/no-literal-string
      out += `\n  • ${message}`;
    }
  }

  if (endpoint) {
    const alias =
      endpoint.aliases && endpoint.aliases.length > 0
        ? endpoint.aliases[0]
        : endpoint.path.join("-");

    const exampleValues =
      endpoint.examples?.requests &&
      typeof endpoint.examples.requests === "object"
        ? (Object.values(
            endpoint.examples.requests as Record<
              string,
              Record<string, string>
            >,
          )[0] ?? {})
        : {};

    // Merge: user-provided values take precedence over example values
    const merged = { ...exampleValues, ...inputData };

    if (Object.keys(merged).length > 0) {
      const flags = Object.entries(merged)
        .map(([k, v]) => serializeFlag(k, v))
        .join(" ");
      // eslint-disable-next-line i18next/no-literal-string
      out += `\n\nExample:\n  vibe ${alias} ${flags}`;
    }

    // Interactive hint with already-provided flags pre-filled
    const existingFlags =
      inputData && Object.keys(inputData).length > 0
        ? `${Object.entries(inputData)
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
