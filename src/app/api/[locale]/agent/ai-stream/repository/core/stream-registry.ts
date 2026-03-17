/**
 * StreamRegistry — Server-side in-memory registry of active AI streams.
 *
 * Keyed by threadId so the cancel endpoint can find and abort a running stream.
 * The Map lives for the lifetime of the server process.
 */

import "server-only";

import { eq } from "drizzle-orm";

import { chatFolders, chatThreads } from "@/app/api/[locale]/agent/chat/db";
import { db } from "@/app/api/[locale]/system/db";

import { AbortReason, StreamAbortError } from "./constants";

interface StreamEntry {
  controller: AbortController;
  userId: string | undefined;
  leadId: string | undefined;
  registeredAt: number;
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
      existing.controller.abort(new StreamAbortError(AbortReason.SUPERSEDED));
    }

    // Evict stale entries that were never unregistered (e.g. crashed handlers).
    // Streams lasting more than 30 minutes are almost certainly orphaned.
    const staleThreshold = Date.now() - 30 * 60 * 1000;
    for (const [id, entry] of activeStreams) {
      if (entry.registeredAt < staleThreshold) {
        activeStreams.delete(id);
      }
    }

    activeStreams.set(threadId, {
      controller,
      userId,
      leadId,
      registeredAt: Date.now(),
    });
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
    entry.controller.abort(new StreamAbortError(AbortReason.USER_CANCELLED));
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
 * Also updates thread updatedAt and bubbles activity to parent folder.
 * Called from ALL stream exit paths (completion, abort, error, compacting failure).
 */
export async function clearStreamingState(threadId: string): Promise<void> {
  StreamRegistry.unregister(threadId);
  const now = new Date();
  const [thread] = await db
    .update(chatThreads)
    .set({ isStreaming: false, updatedAt: now })
    .where(eq(chatThreads.id, threadId))
    .returning({ folderId: chatThreads.folderId });

  // Bubble last-activity to parent folder so it sorts correctly in sidebar
  if (thread?.folderId) {
    await db
      .update(chatFolders)
      .set({ updatedAt: now })
      .where(eq(chatFolders.id, thread.folderId));
  }
}
