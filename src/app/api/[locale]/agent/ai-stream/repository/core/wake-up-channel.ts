/**
 * Wake-up signal helpers.
 *
 * resume-stream calls publishWakeUpSignal() when a wakeUp tool result is ready.
 * The live AI stream subscribes via subscribeWakeUpSignal() during execution.
 * On signal it stores the payload and yields after the current step finishes.
 * The live stream then inserts the deferred message itself in its finally block —
 * this prevents concurrent-insertion race conditions since only one live stream
 * runs per thread.
 *
 * Architecture:
 * - Uses a global in-process Map for single-process deployments (local dev + prod single-instance).
 * - For multi-process deployments (Redis pub/sub), a Redis adapter can replace this.
 * - The pub/sub adapter's subscribe() is a no-op for the local adapter (WS-only),
 *   so we use a direct in-process handler map here instead.
 */

import type {
  ToolCall,
  ToolCallResult,
} from "@/app/api/[locale]/agent/chat/db";
import type { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";

export interface WakeUpPayload {
  toolMessageId: string;
  authorId: string | null;
  originalSequenceId: string | null;
  originalToolCall: ToolCall;
  wakeUpResult: ToolCallResult | undefined;
  wakeUpStatus: string | undefined;
  resolvedModel: ChatModelId;
  resolvedSkill: string;
  leafMessageId: string | undefined;
  favoriteId: string | undefined;
}

/** Global map: threadId → handler registered by the live stream. */
const wakeUpHandlers = new Map<string, (payload: WakeUpPayload) => void>();

/**
 * Subscribe this live stream to wake-up signals for the given thread.
 * Returns an unsubscribe function - MUST be called when the stream ends.
 */
export function subscribeWakeUpSignal(
  threadId: string,
  handler: (payload: WakeUpPayload) => void,
): () => void {
  wakeUpHandlers.set(threadId, handler);
  return () => {
    wakeUpHandlers.delete(threadId);
  };
}

/**
 * Publish a wake-up signal for the given thread.
 * Called by resume-stream when a wakeUp deferred result is ready and isStreaming=true.
 * The live stream handles deferred insertion - no insertion happens here.
 * Returns true if a handler was found and invoked, false if no live stream is registered.
 */
export function publishWakeUpSignal(
  threadId: string,
  payload: WakeUpPayload,
): boolean {
  const handler = wakeUpHandlers.get(threadId);
  if (handler) {
    handler(payload);
    return true;
  }
  return false;
}
