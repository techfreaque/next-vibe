import type { JSONSchema7 } from "ai";
import { z } from "zod";

import { getFullPath } from "../../core/core-utils/path";
import type { WidgetData } from "../../core/utils/json";
import { WidgetDataSchema } from "../../core/utils/json";
import {
  CallbackMode,
  CallbackModeDB,
  EXECUTE_TOOL_ALIAS,
} from "../../execute-tool/constants";

export function toolSchemaSummary(schema: JSONSchema7): string {
  const fields = Object.entries(schema.properties ?? {}).map(
    ([name, field]) => {
      const type =
        typeof field === "boolean"
          ? "any"
          : (field.enum?.join("|") ?? field.type ?? "any");
      return `${name}${schema.required?.includes(name) ? "" : "?"}: ${type}`;
    },
  );
  return fields.length ? `{ ${fields.join(", ")} }` : "{}";
}

function isRecord(value: WidgetData): value is Record<string, WidgetData> {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    !(value instanceof Date)
  );
}

type FieldSchema = NonNullable<JSONSchema7["additionalProperties"]>;

/** Discriminated unions accept only fields from the selected variant. */
function matchesVariant(schema: FieldSchema, value: WidgetData): boolean {
  if (typeof schema === "boolean") {
    return schema;
  }
  const type = Array.isArray(value)
    ? "array"
    : value === null
      ? "null"
      : typeof value;
  const types = Array.isArray(schema.type) ? schema.type : [schema.type];
  if (
    schema.type &&
    !types.some(
      (candidate) =>
        candidate === type ||
        (candidate === "integer" && Number.isInteger(value)),
    )
  ) {
    return false;
  }
  if (!isRecord(value)) {
    return true;
  }
  return Object.entries(schema.properties ?? {}).every(([key, field]) => {
    if (typeof field === "boolean" || !Object.hasOwn(value, key)) {
      return true;
    }
    return (
      (field.const === undefined || field.const === value[key]) &&
      (!field.enum || field.enum.some((option) => option === value[key]))
    );
  });
}

/** Look for fields Zod would discard. Free-form records accept arbitrary names. */
export function unknownToolFields(
  schema: FieldSchema,
  value: WidgetData,
  path: string,
): string[] {
  if (typeof schema === "boolean") {
    return [];
  }
  if (schema.anyOf || schema.oneOf) {
    const variants = (schema.anyOf ?? schema.oneOf ?? []).filter((part) =>
      matchesVariant(part, value),
    );
    const alternatives = variants.map((part) =>
      unknownToolFields(part, value, path),
    );
    return alternatives.toSorted((a, b) => a.length - b.length)[0] ?? [];
  }
  if (
    typeof value === "string" &&
    (schema.type === "object" || schema.type === "array")
  ) {
    // The route validator accepts JSON-encoded objects/arrays from agent callers.
    // Inspect the exact keys that parser would otherwise remove.
    const trimmed = value.trim();
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      try {
        const decoded: WidgetData = JSON.parse(trimmed);
        return unknownToolFields(schema, decoded, path);
      } catch {
        return [];
      }
    }
  }
  if (Array.isArray(value) && schema.items) {
    const items = schema.items;
    return value.flatMap((entry, i) => {
      const item = Array.isArray(items)
        ? (items[i] ?? schema.additionalItems)
        : items;
      return item ? unknownToolFields(item, entry, `${path}[${i}]`) : [];
    });
  }
  if (!isRecord(value)) {
    return [];
  }
  return Object.entries(value).flatMap(([key, entry]) => {
    const properties = schema.properties;
    const field =
      properties && Object.hasOwn(properties, key)
        ? properties[key]
        : undefined;
    const nested = field ?? schema.additionalProperties;
    if (
      field === undefined &&
      (nested === false || (properties && nested === undefined))
    ) {
      const hint = /^end[_-]?loop$/i.test(key)
        ? `. Use top-level callbackMode: "${CallbackMode.END_LOOP}" to end the turn`
        : /^callback[_-]?mode$/i.test(key)
          ? `. Set callbackMode at the top level: ${CallbackModeDB.join("|")}`
          : "";
      return [
        `Unknown key '${key}' in ${path}. Expected ${toolSchemaSummary(schema)}${hint}`,
      ];
    }
    return nested ? unknownToolFields(nested, entry, `${path}.${key}`) : [];
  });
}

/** The SDK uses the returned value for both the stored call and subsequent prompts. */
export function rawToolArgumentSchema(
  schema: JSONSchema7,
  validator: z.ZodType,
  normalize?: (args: Record<string, WidgetData>) => Record<string, WidgetData>,
): z.ZodRecord<z.ZodString, typeof WidgetDataSchema> {
  return z
    .record(z.string(), WidgetDataSchema, {
      error: () =>
        `Expected a JSON object matching ${toolSchemaSummary(schema)}`,
    })
    .superRefine((raw, ctx) => {
      const args = normalize?.(raw) ?? raw;
      for (const message of unknownToolFields(schema, args, "arguments")) {
        ctx.addIssue({ code: "custom", message });
      }
      const modeField = schema.properties?.callbackMode;
      if (
        args["callbackMode"] !== undefined &&
        modeField &&
        typeof modeField !== "boolean" &&
        modeField.enum &&
        !modeField.enum.some((mode) => mode === args["callbackMode"])
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["callbackMode"],
          message: `Expected ${modeField.enum.join("|")}`,
        });
      }
      // Dispatch controls must be visible to the loop as well as the executor.
      // Otherwise an inner endLoop can be hoisted after the loop has read wait.
      const input = args["input"];
      const target = args["toolName"];
      if (
        normalize &&
        typeof target === "string" &&
        target !== EXECUTE_TOOL_ALIAS &&
        !target.endsWith(`__${EXECUTE_TOOL_ALIAS}`) &&
        isRecord(input) &&
        Object.hasOwn(input, "callbackMode")
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["input", "callbackMode"],
          message: `Misplaced callbackMode in input. Set it at the top level. Expected ${toolSchemaSummary(schema)}`,
        });
      }
      const parsed = validator.safeParse(args);
      if (!parsed.success) {
        for (const issue of parsed.error.issues) {
          ctx.addIssue({
            code: "custom",
            path: issue.path,
            message: `${issue.message}. Expected ${toolSchemaSummary(schema)}`,
          });
        }
      }
    });
}

/** Only catalog identifiers can appear verbatim in argument telemetry. */
export function loggedToolName(name: string): string {
  const local = name.includes("__") ? name.slice(name.indexOf("__") + 2) : name;
  return getFullPath(local) ? local : "[unrecognized]";
}

const secretField =
  /pass(word)?|secret|token|credential|auth|cookie|api.?key|private.?key|pin|code/i;

/** Some refinements interpolate the rejected value into their diagnostics. */
export function safeToolIssues(
  message: string,
  raw: WidgetData,
  key = "",
): string {
  if (Array.isArray(raw)) {
    for (const entry of raw) {
      message = safeToolIssues(message, entry, key);
    }
  } else if (isRecord(raw)) {
    for (const [field, entry] of Object.entries(raw)) {
      message = safeToolIssues(
        message,
        entry,
        secretField.test(key) ? key : field,
      );
    }
  } else if (
    typeof raw === "string" &&
    raw.length > 0 &&
    toolArgsForLog(raw, key) !== raw
  ) {
    message = message.replaceAll(raw, "[redacted]");
  } else if (typeof raw === "number" && secretField.test(key)) {
    message = message.replaceAll(String(raw), "[redacted]");
  }
  return message;
}

/** Free text (including malformed JSON, shell input and credentials) is private. */
export function toolArgsForLog(value: WidgetData, key = ""): WidgetData {
  if (secretField.test(key)) {
    return "[redacted]";
  }
  if (key === "toolName" && typeof value === "string") {
    return loggedToolName(value);
  }
  if (Array.isArray(value)) {
    return value.map((entry) => toolArgsForLog(entry));
  }
  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([name, entry]) => [
        name,
        toolArgsForLog(entry, name),
      ]),
    );
  }
  if (
    typeof value === "string" &&
    !(
      key === "callbackMode" &&
      Object.values(CallbackMode).some((mode) => mode === value)
    )
  ) {
    return "[redacted]";
  }
  return value;
}
