/**
 * Repair the two execute-tool argument mistakes models make most often, before
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
  if (!value.trim().startsWith("{")) {
    return null;
  }
  try {
    const parsed = JSON.parse(value) as WidgetData;
    return isRecord(parsed) ? parsed : null;
  } catch {
    // Not valid JSON (truncated, or garbage like `<arg_value>`): leave it,
    // the validation error tells the model what to fix.
    return null;
  }
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
    const rawInner = nested["input"];
    // Both mistakes at once (minimax-m3.1-flash, prod 2026-11-19): nested
    // one level too deep AND the inner input JSON-encoded.
    const innerInput =
      typeof rawInner === "string" ? parseRecordString(rawInner) : rawInner;
    out = {
      ...without(out, "input"),
      toolName: nested["toolName"],
      input:
        innerInput !== undefined && innerInput !== null && isRecord(innerInput)
          ? innerInput
          : {},
    };
    if (out["callbackMode"] === undefined && nested["callbackMode"]) {
      out["callbackMode"] = nested["callbackMode"];
    }
    if (out["instanceId"] === undefined && nested["instanceId"]) {
      out["instanceId"] = nested["instanceId"];
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
