/**
 * Repair common execute-tool argument mistakes before
 * the call fails validation and costs the model a retry round-trip:
 *
 *  1. The real call nested one level too deep:
 *       { callbackMode: "wait", input: { toolName: "cortex-write", input: {...} } }
 *     → { callbackMode: "wait", toolName: "cortex-write", input: {...} }
 *  2. An invented callbackMode ("omit", "none", ...) → dropped, so the default
 *     (wait) applies instead of rejecting the whole call.
 *  3. `input` sent as a JSON-encoded string instead of an object
 *     (kimi-k3 / glm-5.3, prod 2026-11-17) → parsed, when it is valid JSON.
 *
 * Anything else is returned unchanged so genuine mistakes (e.g. no toolName at
 * all) still produce the validation error the model learns from.
 */

import type { WidgetData } from "next-vibe/core/utils/json";
import { CallbackModeDB } from "next-vibe/execute-tool/constants";

interface ArgsRecord {
  [key: string]: WidgetData;
}

function isRecord(value: WidgetData): value is ArgsRecord {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    !(value instanceof Date)
  );
}

/** Describe model arguments without storing their contents in the error log. */
export function describeToolArgShape(value: WidgetData): string {
  if (value === undefined) {
    return "missing";
  }
  if (value === null) {
    return "null";
  }
  if (isRecord(value)) {
    return Object.keys(value).length === 0 ? "empty-record" : "record";
  }
  return Array.isArray(value) ? "array" : typeof value;
}

function without(record: ArgsRecord, key: string): ArgsRecord {
  return Object.fromEntries(Object.entries(record).filter(([k]) => k !== key));
}

function isKnownCallbackMode(value: WidgetData): boolean {
  return CallbackModeDB.some((mode) => mode === value);
}

/** A JSON-encoded object string as a record; null when it is anything else. */
function parseRecordString(value: string): ArgsRecord | null {
  const trimmed = value.trim();
  const json =
    /^```(?:json)?\s*\r?\n([\s\S]*?)\r?\n```$/i.exec(trimmed)?.[1]?.trim() ??
    trimmed;
  if (!json.startsWith("{")) {
    return null;
  }
  try {
    const parsed: WidgetData = JSON.parse(json);
    return isRecord(parsed) ? parsed : null;
  } catch {
    // Not valid JSON (truncated, or garbage like `<arg_value>`): leave it,
    // the validation error tells the model what to fix.
    return null;
  }
}

/** Distinguish invalid JSON from a plain string without logging model input. */
export function describeExecuteToolInputEncoding(
  value: WidgetData,
): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  if (trimmed.startsWith("```")) {
    return "code-fence";
  }
  if (trimmed.length === 0) {
    return "empty-string";
  }
  try {
    const parsed: WidgetData = JSON.parse(trimmed);
    return isRecord(parsed) ? "json-object" : "json-non-object";
  } catch {
    return trimmed.startsWith("{") || trimmed.startsWith("[")
      ? "malformed-json"
      : "plain-text";
  }
}

export function describeNestedExecuteToolArgs(value: WidgetData): {
  nestedExecuteToolTargetShape?: string;
  nestedExecuteToolInputShape?: string;
  nestedExecuteToolSiblingFields?: boolean;
} {
  if (!isRecord(value)) {
    return {};
  }
  return {
    nestedExecuteToolTargetShape: describeToolArgShape(value["toolName"]),
    nestedExecuteToolInputShape: describeToolArgShape(value["input"]),
    nestedExecuteToolSiblingFields: Object.keys(value).some(
      (key) =>
        !["toolName", "input", "callbackMode", "instanceId"].includes(key),
    ),
  };
}

export function describeExecuteToolValidationStage(args: ArgsRecord): string {
  const target = args["toolName"];
  if (typeof target !== "string" || target.length === 0) {
    return "wrapper-target";
  }
  const input = args["input"];
  if (input !== undefined && !isRecord(input)) {
    return "wrapper-input";
  }
  return "wrapper-target-and-input-valid";
}

export function normalizeExecuteToolArgs(args: ArgsRecord): ArgsRecord {
  let out: ArgsRecord = args;

  const encodedInput = out["input"];
  if (typeof encodedInput === "string") {
    const decoded = parseRecordString(encodedInput);
    if (decoded) {
      out = { ...out, input: decoded };
    }
  }

  const nested = out["input"];
  if (
    typeof out["toolName"] !== "string" &&
    nested !== undefined &&
    isRecord(nested) &&
    typeof nested["toolName"] === "string"
  ) {
    const {
      toolName,
      input: rawInner,
      callbackMode,
      instanceId,
      ...fields
    } = nested;
    // Both mistakes at once (minimax-m3.1-flash, prod 2026-11-19): nested
    // one level too deep AND the inner input JSON-encoded.
    const innerInput =
      typeof rawInner === "string"
        ? (parseRecordString(rawInner) ?? rawInner)
        : rawInner;
    out = {
      ...without(out, "input"),
      toolName,
      input: innerInput === undefined ? fields : innerInput,
    };
    if (out["callbackMode"] === undefined && callbackMode) {
      out["callbackMode"] = callbackMode;
    }
    if (out["instanceId"] === undefined && instanceId) {
      out["instanceId"] = instanceId;
    }
  }

  const mode = out["callbackMode"];
  if (mode !== undefined && mode !== null && !isKnownCallbackMode(mode)) {
    // A real mode in the wrong case ("Detach", "ENDLOOP") keeps its meaning -
    // dropping it would silently turn an async call synchronous.
    const caseFixed =
      typeof mode === "string"
        ? CallbackModeDB.find(
            (known) => known.toLowerCase() === mode.trim().toLowerCase(),
          )
        : undefined;
    out =
      caseFixed !== undefined
        ? { ...out, callbackMode: caseFixed }
        : without(out, "callbackMode");
  }

  return out;
}
