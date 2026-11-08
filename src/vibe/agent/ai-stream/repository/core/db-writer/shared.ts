/**
 * Shared constants, types, and small pure helpers for the db-writer modules.
 */

import "server-only";

import { coreEnv } from "next-vibe/core/env";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Environment } from "next-vibe/env/env-util";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { CreditsT } from "@/credits/i18n";

import type { ToolExecutionContext } from "../../../../../core/execution-context";
import type { AbortReason } from "../constants";
import type { MessagesWsEmit } from "../../../../chat/threads/[threadId]/messages/emitter";

/** Callback for emitting thread-title-updated to sidebar channels. */
export type EmitThreadTitleFn = (threadId: string, title: string) => void;

/** The values every method reaches through `this.deps` (constructor args). */
export interface WriterDeps {
  readonly isIncognito: boolean;
  readonly logger: EndpointLogger;
  readonly creditsT: CreditsT;
  readonly locale: CountryLanguage;
  readonly wsEmit: MessagesWsEmit;
  readonly emitTitle: EmitThreadTitleFn;
}

/** The throttle-engine surface the db-writer modules reach through the writer state. */
export interface ThrottleEngineView {
  advanceQueuedMessages(threadId: string, newParentId: string): void;
  scheduleUpdate(messageId: string, content: string): void;
  flush(messageId: string): Promise<void>;
  writeContentAndTokens(
    messageId: string,
    content: string,
    tokens: {
      promptTokens: number | null;
      completionTokens: number | null;
      finishReason: string | null;
      cachedInputTokens?: number | null;
      cacheWriteTokens?: number | null;
      timeToFirstToken?: number | null;
      creditCost?: number | null;
      reasoningSignature?: string;
      reasoningRedactedData?: string;
    },
  ): Promise<void>;
}

/**
 * The mutable state/deps view of MessageDbWriter that the extracted db-writer
 * modules operate on. The class satisfies this structurally - method bodies
 * moved to db-writer/ modules take this view instead of `this`.
 */
export interface DbWriterState {
  readonly deps: WriterDeps;
  readonly engine: ThrottleEngineView;
  /** Tracks the last assistant message ID written - used by headless callers */
  lastAssistantMessageId: string | null;
  /** Tracks the final text content of the last assistant message - populated even in incognito */
  lastAssistantContent: string | null;
  /** Tracks the URL of the last generated media (image/audio/video) - used by headless callers */
  lastGeneratedMediaUrl: string | null;
  /** Running total of credits deducted during this stream - used by headless callers to report cost */
  totalCreditsDeducted: number;
  /** Tracks the thread ID of the last assistant message - used for embedding sync */
  lastThreadId: string | null;
  /**
   * Count of DB writes this stream dropped because its thread no longer exists
   * (deleted mid-stream). See noteThreadGoneWrite.
   */
  threadGoneWrites: number;
  /**
   * Message rows this stream successfully wrote. Distinguishes "thread was
   * deleted mid-stream" (earlier writes landed) from "thread never existed /
   * wrong threadId" (nothing ever landed) when a write hits a missing thread.
   */
  landedWrites: number;
  /**
   * Aborts the owning stream. Called on the first write that finds the thread
   * row gone: every later write would be dropped too, so the loop must not keep
   * calling (and billing) tools. Wired by the stream runner; this is the
   * guaranteed stop - the thread-delete cancel signal only reaches streams on
   * the deleting user's own control channel.
   */
  onThreadGone: (() => void) | null;
  /**
   * Set once a credit deduction failed even after a retry. The turn's output
   * already reached the user and cannot be taken back, so billing fails
   * closed by stopping the stream before any further billed step or tool.
   */
  billingFailed: boolean;
  /** Aborts the owning stream on billing failure (wired by the stream runner). */
  onBillingFailed: (() => void) | null;
  /**
   * Aborts the owning stream when the task guard trips (budget cap, turn /
   * tool-call ceiling). Only set for background-task streams (cronTaskId).
   */
  onTaskGuardTripped:
    | ((
        reason: AbortReason.BUDGET_EXCEEDED | AbortReason.TASK_WATCHDOG,
        detail: string,
      ) => void)
    | null;
  /**
   * In-flight embed of the just-written assistant message. Fired at content-done
   * (write time), awaited by the next step's cortex refresh so the mid-step
   * search sees this turn's assistant vector without re-embedding a query.
   * Best-effort: rejections are swallowed at the await site.
   */
  assistantEmbedPromise: Promise<void> | null;
  /** Stream context (its threadId) — binds the write-time embed to the fixture chain. */
  readonly toolExecutionContext: ToolExecutionContext;
}

/**
 * After this many dropped writes the stream is clearly still running against a
 * deleted thread - the thread delete should have cancelled it.
 */
const THREAD_GONE_RUNAWAY_THRESHOLD = 5;

/**
 * Record a write dropped because the stream's thread row does not exist.
 *
 * NOT assumed benign: the symptom is the same for a user deleting the thread
 * mid-stream and for real bugs (wrong threadId, a write racing thread
 * creation, a mirror/sync delete, incognito/folder misrouting). Every first
 * occurrence per stream is a warning carrying the evidence that tells them
 * apart:
 *  - `reason`: "write-targets-other-thread" (error) when the write's threadId
 *    is not the stream's own - a routing bug, never a delete. Otherwise the
 *    row existed at setup (ensureThread) and vanished since:
 *    "deleted-mid-stream" when earlier writes of THIS stream landed,
 *    "deleted-before-first-write" when none had yet.
 *  - a user/remote delete of a streaming thread logs
 *    "[thread-delete] Thread deleted while streaming" (same threadId) - that
 *    line is the confirmation that the deletion was a real user action.
 * The first drop also stops the stream (onThreadGone). Further drops (writes
 * already in flight) are counted (debug) and re-surfaced as a warning once the
 * count shows the stream kept running against the gone thread anyway.
 */
export function noteThreadGoneWrite(
  w: DbWriterState,
  write: string,
  meta: {
    threadId: string;
    messageId: string;
    userId?: string;
    toolName?: string;
  },
): void {
  w.threadGoneWrites++;
  // Setup verified (ensureThread) the stream's own thread row before the loop
  // started, so a miss on THAT id means the row vanished afterwards. A miss on
  // any other id is a routing bug in the caller, never a delete.
  const streamThreadId = w.toolExecutionContext.threadId;
  const reason =
    streamThreadId !== undefined && meta.threadId !== streamThreadId
      ? "write-targets-other-thread"
      : w.landedWrites > 0
        ? "deleted-mid-stream"
        : "deleted-before-first-write";
  const evidence = {
    ...meta,
    write,
    reason,
    streamThreadId: streamThreadId ?? null,
    landedWritesThisStream: w.landedWrites,
    droppedWrites: w.threadGoneWrites,
    lastAssistantMessageId: w.lastAssistantMessageId,
  };
  if (w.threadGoneWrites === 1) {
    (reason === "write-targets-other-thread"
      ? w.deps.logger.error
      : w.deps.logger.warn
    ).bind(w.deps.logger)(
      "[MessageDbWriter] Thread row missing mid-stream, dropping write - stopping stream",
      evidence,
    );
    w.onThreadGone?.();
  } else if (w.threadGoneWrites === THREAD_GONE_RUNAWAY_THRESHOLD) {
    w.deps.logger.warn(
      "[MessageDbWriter] Stream still writing to a missing thread - it was not cancelled",
      evidence,
    );
  } else {
    w.deps.logger.debug(
      "[MessageDbWriter] Thread row missing mid-stream, dropping write",
      evidence,
    );
  }
}

/**
 * Throttle window in ms - coalesces content updates to same message so rapid
 * token deltas don't hammer the DB in prod. Collapses to 0 under `test` (fixture
 * replay): there is no DB-hammering concern in a test run, and the 300ms trailing
 * timer on every intermediate delta added dead wall-clock to every replayed turn.
 */
export const THROTTLE_MS = coreEnv.NODE_ENV === Environment.TEST ? 0 : 300;

/** Map a MIME type to an uploads mount type folder */
export function getMimeTypeFolder(mimeType: string): string {
  if (mimeType.startsWith("image/")) {
    return "images";
  }
  if (mimeType.startsWith("audio/")) {
    return "audio";
  }
  if (mimeType.startsWith("video/")) {
    return "video";
  }
  if (
    mimeType.startsWith("text/") ||
    mimeType === "application/pdf" ||
    mimeType.startsWith("application/vnd.") ||
    mimeType === "application/json" ||
    mimeType === "application/xml" ||
    mimeType === "application/msword"
  ) {
    return "documents";
  }
  return "other";
}

/**
 * Build thin thread content for cortex embedding.
 * Only title + tags + preview - no message content duplication.
 * Full thread content is resolved on-demand via the thread mount resolver.
 */
export function buildThinThreadContent(thread: {
  title: string | null;
  rootFolderId: string;
  tags: string[] | null;
  description: string | null;
}): string {
  return [
    `# ${thread.title ?? "Untitled"}`,
    `Folder: ${thread.rootFolderId}`,
    thread.tags?.length ? `Tags: ${thread.tags.join(", ")}` : "",
    thread.description
      ? `Description: ${thread.description.slice(0, 300)}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export interface PendingWrite {
  messageId: string;
  content: string;
  timer: ReturnType<typeof setTimeout> | null;
  inflightPromise: Promise<void> | null;
}
