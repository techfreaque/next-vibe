/**
 * Shared validation error formatters.
 *
 * These take the Zod issues directly: `validateData` picks the variant that
 * suits the calling platform and puts the finished text in `message`. Consumers
 * downstream render that string as-is - none of them reconstruct anything.
 *
 * Both variants take `t` and return an already-translated message, so the copy
 * ships in de/pl like everything else. Field names and Zod's own issue text are
 * data, not copy, and stay verbatim.
 */

import type { ZodIssue } from "zod";

import { CLI_BINARY_NAME } from "../../platforms/cli/types/cli-target";
import type { CreateApiEndpointAny } from "../definition/endpoint-base";
import type { TranslatedKeyType } from "../i18n/core/scoped-translation";
import type { scopedTranslation as sharedScopedTranslation } from "../i18n/shared";
import type { WidgetData } from "../utils/json";

type SharedT = ReturnType<typeof sharedScopedTranslation.scopedT>["t"];

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
 * Structured data extracted from a validation failure.
 * Each platform uses this to build its own formatted message.
 */
interface ValidationErrorData {
  /** Number of validation errors */
  count: number;
  /** Per-field errors with CLI flag name pre-computed */
  fields: Array<{ field: string; flagName: string; message: string }>;
  /** Endpoint alias for example commands (null if no endpoint) */
  alias: string | null;
  /** Raw example values from endpoint definition */
  exampleValues: Record<string, WidgetData>;
  /** Already-provided input values (for --interactive pre-fill) */
  inputData: Record<string, WidgetData>;
}

/**
 * Build formatter input straight from the Zod issues.
 *
 * Field and message come off `issue.path` / `issue.message`. The previous design
 * joined these into a single string, smuggled it through the i18n params
 * channel, then regex-split it back apart here - a round trip that destroyed the
 * structure it then had to guess at. The issues are the source of truth, so they
 * are what the formatters take.
 */
function buildValidationData(
  issues: ZodIssue[],
  endpoint?: CreateApiEndpointAny | null,
  inputData?: Record<string, WidgetData>,
): ValidationErrorData {
  const fields = issues.map((issue) => {
    const field = issue.path.join(".");
    return {
      field,
      flagName: field ? camelToKebab(field) : "",
      message: issue.message,
    };
  });

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
    count: issues.length,
    fields,
    alias,
    exampleValues,
    inputData: inputData ?? {},
  };
}

/**
 * Format validation errors for CLI output.
 * Bullets per field + vibe example command + --interactive hint + vibe help.
 */
export function formatValidationErrorDetails(
  t: SharedT,
  issues: ZodIssue[],
  endpoint: CreateApiEndpointAny | null | undefined,
  /** Already-provided input values - used to pre-fill the --interactive hint */
  inputData?: Record<string, WidgetData> | undefined,
): TranslatedKeyType {
  const {
    count,
    fields,
    alias,
    exampleValues,
    inputData: input,
  } = buildValidationData(issues, endpoint, inputData);

  const header = t("validation.missingFields", { count });
  const fieldLines = formatFieldLines(fields, true);

  let hints = "";
  if (alias) {
    const merged = { ...exampleValues, ...input };
    const exampleFlags =
      Object.keys(merged).length > 0
        ? Object.entries(merged)
            .map(([k, v]) => serializeFlag(k, v))
            .join(" ")
        : "";

    const existingFlags =
      Object.keys(input).length > 0
        ? `${Object.entries(input)
            .filter(([, v]) => v !== undefined && v !== "")
            .map(([k, v]) => serializeFlag(k, v))
            .join(" ")} `
        : "";

    hints = t("validation.cliHints", {
      example: `${CLI_BINARY_NAME} ${alias} ${exampleFlags}`.trimEnd(),
      interactive: `${CLI_BINARY_NAME} ${alias} ${existingFlags}--interactive`,
      help: `${CLI_BINARY_NAME} help ${alias}`,
    });
  }

  return t("validation.report", { header, fields: fieldLines, hints });
}

/**
 * Bullet list of per-field issues. Deliberately not translated: every token is
 * either a field/flag name or Zod's own message, so there is no copy to render.
 */
function formatFieldLines(
  fields: ValidationErrorData["fields"],
  asFlag: boolean,
): string {
  let out = "";
  for (const { flagName, field, message } of fields) {
    if (field) {
      out += asFlag
        ? `\n  • --${flagName}: ${message}`
        : `\n  • ${field}: ${message}`;
    } else {
      out += `\n  • ${message}`;
    }
  }
  return out;
}

/**
 * Format validation errors for API/MCP/AI output.
 * Compact field list only - no vibe CLI hints.
 */
export function formatValidationErrorCompact(
  t: SharedT,
  issues: ZodIssue[],
  endpoint?: CreateApiEndpointAny | null,
): TranslatedKeyType {
  const { count, fields } = buildValidationData(issues, endpoint);

  // Two explicit keys rather than a count placeholder: plural agreement differs
  // per language and the scoped translator has no plural rules.
  const header =
    count === 1
      ? t("validation.failedOne")
      : t("validation.failedMany", { count });

  return t("validation.report", {
    header,
    fields: formatFieldLines(fields, false),
    hints: "",
  });
}
