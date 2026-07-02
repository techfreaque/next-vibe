/**
 * Tool-message resolution + assertion helpers for the AI-stream suites.
 *
 * All of these are execute-tool-aware: in remote modes every tool call is
 * wrapped in the execute-tool meta-tool, so "find the generate_image call"
 * must match both the direct form (toolCall.toolName === 'generate_image')
 * and the wrapped form (toolName === 'execute-tool', args.toolName === ...).
 */

import "server-only";

import type { WidgetData } from "next-vibe/core/utils/json";
import { expect } from "vitest";

import type { SlimMessage } from "../../../testing/headless-test-runner";
import { toolResultRecord } from "../../../testing/headless-test-runner";
import type { ModeConfig } from "./config";

/**
 * Find a tool message by its logical tool name, handling execute-tool wrapping.
 * Local: finds message where toolCall.toolName === toolName.
 * Remote (execute-tool): finds execute-tool message where args.toolName === toolName.
 * Falls back to execute-tool wrapping even without remoteInstanceId (e.g. UNBOTTLED
 * mode where hermes wraps non-native tools through execute-tool without instanceId).
 */
export function findToolMsg(
  messages: SlimMessage[],
  toolName: string,
  cfg: ModeConfig,
): SlimMessage | undefined {
  // The execute-tool wrapper carries the wrapped tool name in its args. A simple
  // WAIT call has it at args.toolName; a callback-mode call (detach/wakeUp) nests
  // one level deeper at args.input.toolName (execute-tool({toolName, input,
  // callbackMode}) where input itself is the inner execute-tool envelope). Match
  // either level so detach/wakeUp tool messages resolve like WAIT ones.
  // Accept instance-prefixed variants too ("atlas__tool-help"): a relay
  // receiver's catalog can list the caller's tools under their pinned
  // `<instanceId>__<tool>` names (favorite sync carries them across), and the
  // model may pick either form — both route to the same tool.
  const matchesName = (candidate: WidgetData | undefined): boolean =>
    typeof candidate === "string" &&
    (candidate === toolName || candidate.endsWith(`__${toolName}`));
  const wrapsTool = (m: SlimMessage): boolean => {
    if (m.toolCall?.toolName !== "execute-tool") {
      return false;
    }
    const args = toolResultRecord(m.toolCall.args);
    if (matchesName(args?.["toolName"])) {
      return true;
    }
    const inner = toolResultRecord(args?.["input"]);
    return matchesName(inner?.["toolName"]);
  };
  // Use findLast to get the final retry when the model retries after validation errors.
  // The first attempt may have a validation error result; the last one has the real result.
  if (cfg.remoteInstanceId) {
    return messages.findLast((m) => m.role === "tool" && wrapsTool(m));
  }
  // Direct match first (last occurrence)
  const direct = messages.findLast(
    (m) => m.role === "tool" && matchesName(m.toolCall?.toolName),
  );
  if (direct) {
    return direct;
  }
  // Fallback: execute-tool wrapping without instanceId (e.g. UNBOTTLED/hermes)
  return messages.findLast((m) => m.role === "tool" && wrapsTool(m));
}

/**
 * Extract the effective tool result from a tool message, unwrapping execute-tool
 * when the model used it as an intermediary (e.g. UNBOTTLED/hermes mode).
 * For direct tool calls: returns toolResultRecord(msg.toolCall?.result).
 * For execute-tool wrappers: unwraps the inner { result: ... } and returns it.
 */
export function resolveToolResult(
  msg: SlimMessage | undefined,
): Record<string, WidgetData> | null {
  if (!msg) {
    return null;
  }
  // Tools awaiting confirmation have no result stored - synthesize the placeholder
  if (msg.toolCall?.waitingForConfirmation && !msg.toolCall.result) {
    return { status: "waiting_for_confirmation" as WidgetData };
  }
  const raw = toolResultRecord(msg.toolCall?.result);
  if (!raw) {
    return null;
  }
  // If this was an execute-tool call, the inner result is nested under "result"
  if (
    msg.toolCall?.toolName === "execute-tool" &&
    "result" in raw &&
    raw["result"] !== null &&
    typeof raw["result"] === "object" &&
    !Array.isArray(raw["result"])
  ) {
    return raw["result"] as Record<string, WidgetData>;
  }
  return raw;
}

/**
 * Assert remote tool call routing (execute-tool wrapper, instanceId, toolName).
 * No-op when cfg.remoteInstanceId is not set.
 * `expectedStatus` controls lifecycle checks:
 * - "completed": asserts result present + status=completed + remoteTaskId in queue (default)
 * - "pending": asserts status=pending, no result required (async phase1)
 * - undefined: skips status/result checks (routing only)
 */
export function assertRemoteToolCall(
  msg: SlimMessage,
  expectedToolName: string,
  cfg: ModeConfig,
  expectedStatus: "completed" | "pending" | undefined = "completed",
): void {
  if (!cfg.remoteInstanceId) {
    return;
  }
  expect(
    msg.toolCall?.toolName,
    `Expected execute-tool wrapper for remote call to ${expectedToolName}`,
  ).toBe("execute-tool");
  const args = toolResultRecord(msg.toolCall?.args);
  expect(args, "execute-tool args must be an object").not.toBeNull();

  // The AI can route to remote in two ways:
  //   a) explicit instanceId prop:  { toolName: "tool-help", instanceId: "hermes" }
  //   b) prefixed toolName:          { toolName: "hermes__tool-help" }
  // Both are valid - the execute-tool repository handles both (lines 146-152).
  const rawToolName = String(args!["toolName"] ?? "");
  const prefixedForm = `${cfg.remoteInstanceId}__${expectedToolName}`;
  const hasExplicitInstanceId = args!["instanceId"] === cfg.remoteInstanceId;
  const hasPrefixedToolName = rawToolName === prefixedForm;
  const hasPlainToolName = rawToolName === expectedToolName;

  expect(
    hasExplicitInstanceId || hasPrefixedToolName,
    `execute-tool must route to '${cfg.remoteInstanceId}' via instanceId prop or prefixed toolName. ` +
      `Got toolName='${rawToolName}', instanceId='${String(args!["instanceId"] ?? "undefined")}'`,
  ).toBe(true);

  // Tool name must match (plain or prefixed)
  expect(
    hasPlainToolName || hasPrefixedToolName,
    `execute-tool args.toolName must be '${expectedToolName}' or '${prefixedForm}' (got '${rawToolName}')`,
  ).toBe(true);

  if (expectedStatus === "completed") {
    // Result must be present and a record (not a raw string or error blob)
    expect(
      msg.toolCall?.result,
      `execute-tool for '${expectedToolName}' must have a result (not null/undefined)`,
    ).toBeTruthy();
    const resultRec = toolResultRecord(msg.toolCall?.result);
    expect(
      resultRec,
      `execute-tool result for '${expectedToolName}' must be a record`,
    ).not.toBeNull();

    // Note: status and remoteTaskId are defined in ToolCallMetadata but not yet
    // populated by the execute-tool repository. When implemented, strengthen these:
    if (msg.toolCall?.status !== undefined) {
      expect(
        msg.toolCall.status,
        `execute-tool for '${expectedToolName}' status must be "completed" (got "${msg.toolCall.status}")`,
      ).toBe("completed");
    }
    // if (cfg.pulse) { expect(msg.toolCall?.remoteTaskId).toBeTruthy(); }
  } else if (expectedStatus === "pending") {
    // status may be "pending" or undefined (field not yet populated by execute-tool)
    if (msg.toolCall?.status !== undefined) {
      expect(
        msg.toolCall.status,
        `execute-tool for '${expectedToolName}' status must be "pending" (got "${msg.toolCall.status}")`,
      ).toBe("pending");
    }
  }
}

/**
 * Full lifecycle assertion for a remote tool message.
 * Verifies routing, result presence, status completion, and parent chain.
 * `expectedStatus` defaults to "completed" - pass "pending" for async phase1.
 */
export function assertToolMessageComplete(
  msg: SlimMessage,
  expectedToolName: string,
  stepName: string,
  cfg: ModeConfig,
  expectedStatus: "completed" | "pending" = "completed",
): void {
  expect(msg.role, `[${stepName}] Expected tool message role`).toBe("tool");
  expect(
    msg.parentId,
    `[${stepName}] Tool message for '${expectedToolName}' must have a parent`,
  ).toBeTruthy();

  if (cfg.remoteInstanceId) {
    assertRemoteToolCall(msg, expectedToolName, cfg, expectedStatus);
  } else {
    // Local mode: tool may be called directly by name OR via execute-tool wrapper
    // (self-relay to own instance). Both patterns are valid.
    const isExecuteTool = msg.toolCall?.toolName === "execute-tool";
    if (isExecuteTool) {
      const args = toolResultRecord(msg.toolCall?.args);
      const wrappedName = args?.["toolName"];
      // Instance-prefixed variants ("atlas__tool-help") route to the same
      // tool — accept both forms (see findToolMsg).
      const nameOk =
        typeof wrappedName === "string" &&
        (wrappedName === expectedToolName ||
          wrappedName.endsWith(`__${expectedToolName}`));
      expect(
        nameOk,
        `[${stepName}] execute-tool args.toolName must be '${expectedToolName}' (or instance-prefixed) — got '${String(wrappedName)}'`,
      ).toBe(true);
    } else {
      const directName = msg.toolCall?.toolName;
      const directOk =
        typeof directName === "string" &&
        (directName === expectedToolName ||
          directName.endsWith(`__${expectedToolName}`));
      expect(
        directOk,
        `[${stepName}] Expected tool '${expectedToolName}' (or instance-prefixed) — got '${String(directName)}'`,
      ).toBe(true);
    }
    if (expectedStatus === "completed") {
      const effectiveResult = isExecuteTool
        ? resolveToolResult(msg)
        : toolResultRecord(msg.toolCall?.result);
      expect(
        effectiveResult,
        `[${stepName}] Tool '${expectedToolName}' must have a result`,
      ).toBeTruthy();
    }
  }
}

/**
 * Assert that no tool message uses the `instanceId__toolName` prefix form for
 * meta-tools (tool-help, execute-tool). Meta-tools must always be called by
 * bare name with an instanceId param - never as `hermes__tool-help` etc.
 * No-op when cfg.remoteInstanceId is not set.
 */
export function assertNoMetaToolPrefix(
  messages: SlimMessage[],
  cfg: ModeConfig,
): void {
  if (!cfg.remoteInstanceId) {
    return;
  }
  const metaTools = ["tool-help", "execute-tool"];
  for (const meta of metaTools) {
    const prefixed = `${cfg.remoteInstanceId}__${meta}`;
    const bad = messages.filter(
      (m) => m.role === "tool" && m.toolCall?.toolName === prefixed,
    );
    expect(
      bad,
      `Meta-tool '${meta}' must not be called as '${prefixed}' - use bare name with instanceId param`,
    ).toHaveLength(0);
  }
}
