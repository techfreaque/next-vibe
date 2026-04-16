/**
 * StreamRegistry - Server-side in-memory registry of active AI streams.
 *
 * Keyed by threadId so the cancel endpoint can find and abort a running stream.
 * The Map lives for the lifetime of the server process.
 */

import "server-only";

import { and, eq, ne } from "drizzle-orm";

import { chatFolders, chatThreads } from "@/app/api/[locale]/agent/chat/db";
import { createMessagesEmitter } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/emitter";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { cronTasks } from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";
import { CronTaskStatus } from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import { AbortReason, StreamAbortError } from "./constants";

interface StreamEntry {
  controller: AbortController;
  registeredAt: number;
}

const activeStreams = new Map<string, StreamEntry>();

export const StreamRegistry = {
  /**
   * Register a new stream. Aborts any existing stream for the same thread.
   */
  register(threadId: string, controller: AbortController): void {
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
export async function setStreamingStateAborting(
  threadId: string,
): Promise<void> {
  await db
    .update(chatThreads)
    .set({ streamingState: "aborting" })
    .where(eq(chatThreads.id, threadId));
}

/** Maximum preview length (chars) stored on the thread. */
const PREVIEW_MAX_CHARS = 120;

/**
 * Compute a short plain-text preview from the last assistant message content.
 * Strips leading markdown headings/bullets and truncates to PREVIEW_MAX_CHARS.
 */
function computePreview(content: string): string {
  const stripped = content
    .replace(/^#{1,6}\s+/gm, "") // headings
    .replace(/^\s*[-*+]\s+/gm, "") // bullets
    .replace(/\*\*(.+?)\*\*/g, "$1") // bold
    .replace(/\*(.+?)\*/g, "$1") // italic
    .replace(/`(.+?)`/g, "$1") // inline code
    .replace(/\n+/g, " ")
    .trim();
  return stripped.length > PREVIEW_MAX_CHARS
    ? `${stripped.slice(0, PREVIEW_MAX_CHARS).trimEnd()}…`
    : stripped;
}

export interface ClearStreamingResult {
  state: "idle" | "waiting";
  preview: string | null;
  updatedAt: Date;
}

export async function clearStreamingState(
  threadId: string,
  logger: EndpointLogger,
  user: JwtPayloadType,
  lastContent?: string | null,
): Promise<ClearStreamingResult> {
  const wsEmit = createMessagesEmitter(threadId, null, logger, user);
  StreamRegistry.unregister(threadId);
  const now = new Date();

  // Check for active tasks tied to this thread - if any are still running,
  // set "waiting" instead of "idle" so the stop button stays visible.
  const [activeTask] = await db
    .select({ id: cronTasks.id })
    .from(cronTasks)
    .where(
      and(
        eq(cronTasks.wakeUpThreadId, threadId),
        eq(cronTasks.lastExecutionStatus, CronTaskStatus.RUNNING),
      ),
    )
    .limit(1);

  const nextState = activeTask ? "waiting" : "idle";
  const preview =
    lastContent && lastContent.trim().length > 0
      ? computePreview(lastContent)
      : null;

  const [thread] = await db
    .update(chatThreads)
    .set({
      streamingState: nextState,
      updatedAt: now,
      ...(preview !== null ? { preview } : {}),
    })
    .where(
      and(
        eq(chatThreads.id, threadId),
        ne(chatThreads.streamingState, "waiting"),
      ),
    )
    .returning({ folderId: chatThreads.folderId });

  // Bubble last-activity to parent folder so it sorts correctly in sidebar
  if (thread?.folderId) {
    await db
      .update(chatFolders)
      .set({ updatedAt: now })
      .where(eq(chatFolders.id, thread.folderId));
  }

  // When a task is in flight, emit STREAMING_STATE_CHANGED: waiting so clients
  // show the stop button. Emit regardless of whether the DB update matched —
  // escalateToTask may have already set DB to "waiting" (skipping the update),
  // but the frontend still needs this event to show the stop button.
  if (nextState === "waiting") {
    wsEmit("streaming-state-changed", { streamingState: "waiting" });
  }

  return { state: nextState, preview, updatedAt: now };
}

/**
 * Set streaming state to "waiting": unregister from in-memory map + set streamingState="waiting" in DB.
 * Used when the stream aborts but a task is still in flight (REMOTE_TOOL_WAIT, STREAM_TIMEOUT).
 * Revival (via handleTaskCompletion) will set the state back to idle/streaming when the task completes.
 */
export async function setStreamingStateWaiting(
  threadId: string,
): Promise<void> {
  StreamRegistry.unregister(threadId);
  const now = new Date();
  const [thread] = await db
    .update(chatThreads)
    .set({ streamingState: "waiting", updatedAt: now })
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
