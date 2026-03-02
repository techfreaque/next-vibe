/**
 * StreamRegistry — Server-side in-memory registry of active AI streams.
 *
 * Keyed by threadId so the cancel endpoint can find and abort a running stream.
 * The Map lives for the lifetime of the server process.
 */

import "server-only";

import { eq } from "drizzle-orm";

import { chatThreads } from "@/app/api/[locale]/agent/chat/db";
import { db } from "@/app/api/[locale]/system/db";

interface StreamEntry {
  controller: AbortController;
  userId: string | undefined;
  leadId: string | undefined;
}

const activeStreams = new Map<string, StreamEntry>();

export const StreamRegistry = {
  /**
   * Register a new stream. Aborts any existing stream for the same thread.
   */
  register(
    threadId: string,
    controller: AbortController,
    userId: string | undefined,
    leadId: string | undefined,
  ): void {
    const existing = activeStreams.get(threadId);
    if (existing) {
      existing.controller.abort(new Error("Superseded by new stream"));
    }
    activeStreams.set(threadId, { controller, userId, leadId });
  },

  /**
   * Cancel a stream by threadId. Triggers AbortErrorHandler for credit deduction.
   * Returns true if an active stream was found and aborted.
   */
  cancel(threadId: string): boolean {
    const entry = activeStreams.get(threadId);
    if (!entry) {
      return false;
    }
    entry.controller.abort(new Error("User cancelled stream"));
    activeStreams.delete(threadId);
    return true;
  },

  /**
   * Remove a stream from the registry (normal completion cleanup).
   */
  unregister(threadId: string): void {
    activeStreams.delete(threadId);
  },

  /**
   * Check if a stream is currently active for a thread.
   */
  isActive(threadId: string): boolean {
    return activeStreams.has(threadId);
  },

  /**
   * Get the registry entry for auth checks before cancelling.
   */
  getEntry(threadId: string): StreamEntry | undefined {
    return activeStreams.get(threadId);
  },
};

/**
 * Clear streaming state: unregister from in-memory map + set isStreaming=false in DB.
 * Called from ALL stream exit paths (completion, abort, error, compacting failure).
 */
export async function clearStreamingState(threadId: string): Promise<void> {
  StreamRegistry.unregister(threadId);
  await db
    .update(chatThreads)
    .set({ isStreaming: false })
    .where(eq(chatThreads.id, threadId));
}
