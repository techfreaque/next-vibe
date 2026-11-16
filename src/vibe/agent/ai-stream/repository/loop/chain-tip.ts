/**
 * Chain-tip bookkeeping for the StreamLoop: which message the next written
 * message hangs off. Pure functions over the three tip fields of the stream
 * context, shared by the text, reasoning and tool-call paths so every path
 * advances the tip the same way (local and remote loops alike).
 */

import type { ToolExecutionContextImpl } from "../core/stream";

/** The tip fields of the stream context. */
export type ChainTip = Pick<
  ToolExecutionContextImpl,
  "currentParentId" | "lastParentId" | "pendingQueueParentId"
>;

/**
 * Advance the tip to a newly written message so the next message becomes its
 * child.
 *
 * clearPendingQueueParent: pass true when the new message was just created as
 * a child of the current tip (first text/reasoning/placeholder of a step). If
 * pendingQueueParentId (compacting summary or injected queued message) was
 * that parent, the chain has advanced past it and the override is dropped so
 * finish-step and onToolCall don't re-apply it.
 */
export function advanceChainTip(
  tip: ChainTip,
  messageId: string | null,
  opts: { clearPendingQueueParent: boolean },
): void {
  if (
    opts.clearPendingQueueParent &&
    tip.pendingQueueParentId === tip.currentParentId
  ) {
    tip.pendingQueueParentId = null;
  }
  tip.currentParentId = messageId;
  tip.lastParentId = messageId;
}

/**
 * A step that opens with a bare tool call gets a placeholder assistant row as
 * the tool's parent, written as a child of the tip the call started from. The
 * placeholder IS the step's assistant message, so it becomes the tip exactly
 * like the first text or reasoning delta does. Without this, a step right
 * after a mid-stream compacting (or an injected queued message) left the tip
 * and pendingQueueParentId on the summary, onToolCall hung the tool row off
 * the summary too, and the placeholder became a dead-end sibling branch.
 *
 * Skipped when the tip moved while the placeholder was being written (a
 * concurrent prepareStep compacted): that move wins.
 */
export function chainPlaceholderAssistant(
  tip: ChainTip,
  placeholderId: string,
  initialParentId: string | null,
): void {
  if (tip.currentParentId !== initialParentId) {
    return;
  }
  advanceChainTip(tip, placeholderId, { clearPendingQueueParent: true });
}

/**
 * Parent for a tool-call row. Normally the step's assistant message
 * (prepParentId). Mid-stream compacting race: prepareStep can complete its
 * compacting write while the consumer awaits the assistant flush, moving the
 * tip AND pendingQueueParentId to the summary while prepParentId is the stale
 * pre-compacting value. Only while the tip still sits on that summary (nothing
 * chained off it yet) the tool row takes the summary as parent and consumes
 * the override.
 */
export function resolveToolParentId(
  tip: ChainTip,
  prepParentId: string | null,
): string | null {
  const overrideId = tip.pendingQueueParentId;
  if (overrideId === null || tip.currentParentId !== overrideId) {
    return prepParentId;
  }
  tip.pendingQueueParentId = null;
  return overrideId;
}
