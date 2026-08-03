/**
 * Task/call id minting for the dispatch paths.
 *
 * Its own module because both consumers are on the non-local side — ./local-async
 * (task rows) and ./remote (wire callIds) — while the function used to live on
 * LocalExecution, the one class that is purely "here, now, inline". That placement
 * cost two things this file removes: ./remote had to import ./local to reach it,
 * and ./local-async kept a byte-identical private copy specifically to avoid a
 * static edge back to ./local. One owner, no copy, no edge across the seam.
 */

import type { ToolExecutionContext } from "next-vibe/core/execution-context";

/**
 * Generate a task ID for local async tasks and remote dispatch callIds.
 *
 * The deterministic part is derived from the originating AI SDK toolCallId
 * (e.g. "functions.execute-tool:11"): it is baked into the recorded model
 * response, so it is identical on fixture record and replay AND identical on
 * every instance that processes the same AI turn. That is exactly what the
 * AI's conversation needs when it later echoes the task id back into a prompt.
 *
 * In production the toolCallId is only unique WITHIN one AI turn (a per-turn
 * counter), so a short random tail is appended to guarantee a globally-unique
 * cronTasks primary key across threads. On a fixture-driven execution
 * (the dispatch carries a toolExecutionContext) that tail is dropped so the id
 * stays fully reproducible on replay and identical across instances.
 *
 * When no toolCallId is present (a task not originating from an AI tool call)
 * the whole id is random — those paths need neither replay nor cross-instance
 * stability.
 */
export function generateTaskId(
  type: "local-bg" | "local-wu" | "remote-ws" | "remote-direct",
  options?: {
    instanceId?: string;
    toolCallId?: string;
    toolExecutionContext: ToolExecutionContext;
  },
): string {
  const { instanceId, toolCallId, toolExecutionContext } = options ?? {};
  const prefix = instanceId ? `${type}-${instanceId}` : type;
  if (!toolCallId) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }
  // Sanitise the toolCallId into an id-safe token.
  const token = toolCallId
    .replaceAll(/[^a-zA-Z0-9]+/g, "-")
    .replaceAll(/^-+|-+$/g, "");
  const deterministic = `${prefix}-${token}`;
  if (toolExecutionContext) {
    return deterministic;
  }
  return `${deterministic}-${Math.random().toString(36).slice(2, 8)}`;
}
