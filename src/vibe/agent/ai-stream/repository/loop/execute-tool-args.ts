/**
 * Repair the two execute-tool argument mistakes models make most often, before
 * the call fails validation and costs the model a retry round-trip:
 *
 *  1. The real call nested one level too deep:
 *       { callbackMode: "wait", input: { toolName: "cortex-write", input: {...} } }
 *     → { callbackMode: "wait", toolName: "cortex-write", input: {...} }
 *  2. An invented callbackMode ("omit", "none", ...) → dropped, so the default
 *     (wait) applies instead of rejecting the whole call.
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

function without(record: ArgsRecord, key: string): ArgsRecord {
  return Object.fromEntries(Object.entries(record).filter(([k]) => k !== key));
}

function isKnownCallbackMode(value: WidgetData): boolean {
  return CallbackModeDB.some((mode) => mode === value);
}

export function normalizeExecuteToolArgs(args: ArgsRecord): ArgsRecord {
  let out: ArgsRecord = args;

  const nested = out["input"];
  if (
    typeof out["toolName"] !== "string" &&
    nested !== undefined &&
    isRecord(nested) &&
    typeof nested["toolName"] === "string"
  ) {
    const innerInput = nested["input"];
    out = {
      ...without(out, "input"),
      toolName: nested["toolName"],
      input: innerInput !== undefined && isRecord(innerInput) ? innerInput : {},
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
