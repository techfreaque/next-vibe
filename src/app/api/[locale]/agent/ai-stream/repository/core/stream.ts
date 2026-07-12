/**
 * AI Stream core state — live-stream mutable state (StreamContext), the
 * in-memory stream/queue registries with streaming-state transitions, and
 * abort-controller wiring.
 */

import "server-only";

import { and, eq, isNull, like, ne, or, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { cronTasks } from "next-vibe/tasks/cron/db";
import { CronTaskStatus } from "next-vibe/tasks/enum";

import type { CreditsT as ModuleT } from "@/app/api/[locale]/credits/i18n";

import { bubbleFolderActivity } from "../../../chat/bubble-folder-activity";
import type { ToolExecutionContext } from "../../../chat/config";
import type { DefaultFolderId } from "../../../chat/config";
import {
  chatThreads,
  type MessageMetadata,
  type ToolCall,
} from "../../../chat/db";
import { ThreadStreamingState } from "../../../chat/enum";
import type { MessagesWsEmit } from "../../../chat/threads/[threadId]/messages/emitter";
import type { WakeUpPayload } from "../revival/revival";
import { AbortReason, StreamAbortError } from "./constants";
import { type EmitThreadTitleFn, MessageDbWriter } from "./message-db-writer";
import {
  emitStreamingState,
  transitionStreamingState,
} from "./streaming-state";

/**
 * Stream Context - Manages mutable state during streaming
 * Replaces scattered closure variables to prevent memory leaks
 */

export interface PendingToolData {
  messageId: string;
  toolCallData: {
    toolCall: ToolCall;
    parentId: string | null;
  };
}

/**
 * StreamContext - Encapsulates all mutable state during a stream
 * MUST call cleanup() when stream ends to prevent memory leaks
 */
export class StreamContext {
  /** Centralised, throttled DB writer for all assistant message writes */
  readonly dbWriter: MessageDbWriter;
  /** Typed WS emitter for this thread's messages channel. Use this from all stream handlers. */
  readonly wsEmit: MessagesWsEmit;
  private readonly logger: EndpointLogger;
  // Pre-generated ASSISTANT message ID (for cache stability)
  // Used only for the FIRST assistant message in a stream
  private readonly initialAssistantMessageId: string;
  private hasUsedInitialAssistantId = false;

  // Current ASSISTANT message
  currentAssistantMessageId: string | null = null;
  currentAssistantContent = "";

  // Last ASSISTANT message ID (not cleared by finish-step, used for final token reporting)
  lastAssistantMessageId: string | null = null;

  // Reasoning state
  isInReasoningBlock = false;

  // Tool tracking
  pendingToolMessages = new Map<string, PendingToolData>();
  /** All toolCallIds seen so far in the CURRENT step - reset every step (see
   *  onFinishStep) - prevents duplicate DB rows within one step when a
   *  provider's synthetic id (e.g. Gemini's "functions.<tool>:<index>") is
   *  positionally scoped and can repeat for two genuinely different calls. */
  allSeenToolCallIds = new Set<string>();
  /**
   * When the SAME raw toolCallId appears more than once within a step (a
   * provider-side id collision, not an actual retry), each repeat occurrence
   * beyond the first gets its own de-duplicated key here instead of being
   * dropped - pendingToolMessages/DB rows for occurrence 2+ live under this
   * key. Consumed in call order by executeClaimCount / resultClaimCount
   * below. This is a best-effort FIFO match (occurrence N's execute() call
   * and occurrence N's result are assumed to be the Nth of each kind for
   * this raw id) - correct whenever completion order matches call order,
   * which holds for same-tool same-step calls in practice.
   */
  duplicateToolCallKeys = new Map<string, string[]>();
  /** How many times tools-loader's execute() wrapper has resolved a pending
   *  entry for a given raw toolCallId - 0 = next claim uses the raw id
   *  (primary), 1+ = next claim uses duplicateToolCallKeys[n-1]. */
  executeClaimCount = new Map<string, number>();
  /** Same as executeClaimCount, but for tool-result/tool-error part matching
   *  in onToolResult - tracked separately since it's a different consumer. */
  resultClaimCount = new Map<string, number>();
  /** Set when any approve-mode tool is called. Persists across steps so that
   *  sequential approve tool calls all complete before the stream aborts at
   *  the AI-response turn boundary (finish-step with no pending tools). */
  stepHasToolsAwaitingConfirmation = false;

  // Loop control - set to true when model requests to stop the tool loop
  shouldStopLoop = false;

  /** Set to true when prepareStep injects a queued message mid-stream.
   *  Prevents processNextQueuedMessage from double-processing in the finally block. */
  queueInjectedInStream = false;

  /**
   * Set by prepareStep when a queued message is injected mid-stream.
   * finish-step-handler reads this and overrides currentParentId after the normal
   * parent chain update. This avoids a race where tool-result processing resets
   * ctx.lastParentId after prepareStep has already set it to the queued message.
   *
   * Flow: prepareStep fires (AI SDK) → sets this → tool-result event processed
   * (resets lastParentId) → finish-step event processed → reads this → overrides
   * currentParentId → step-1 AI message gets correct parentId.
   */
  pendingQueueParentId: string | null = null;

  /** wakeUp payloads that arrived via pub/sub while this stream is LIVE.
   *  Drained by prepareStep (wakeup-injection): the deferred result is written
   *  at the live chain tip and injected into the in-flight ModelMessages so
   *  the model sees it as the natural next step — no separate revival turn.
   *  Payloads left undrained when the loop ends fall through to the
   *  post-stream revival batch (dead-stream fallback). */
  pendingWakeUpInjections: WakeUpPayload[] = [];

  // Idempotency guard: set to true after AbortErrorHandler runs
  // Prevents double-execution if both inner and outer catch blocks fire
  abortHandled = false;

  /** Callbacks registered by setup code (e.g. pub/sub unsubscribe).
   *  All are called in cleanup(). */
  private cleanupCallbacks: Array<() => void> = [];

  // Timing: requestStartTime set just before AI model call; streamStartTime set on first token
  requestStartTime: number | null = null;
  streamStartTime: number | null = null;

  /**
   * Tracks how many chars were present when we last emitted an estimated token count.
   * Reset to 0 when a new assistant message starts (currentAssistantMessageId changes).
   * Allows throttled estimated token emission every ~200 chars during streaming.
   */
  lastEstimatedTokenEmitLength = 0;

  /**
   * Pre-calculated input token estimate from compactingCheck.totalTokens.
   * Set once after the compacting check so we don't recalculate during streaming.
   */
  estimatedInputTokens = 0;

  /** Most recent real input token count (full prompt size that step).
   *  onStepFinish is synchronous and fires before prepareStep on the next
   *  step, so there is no race. Used for the mid-stream compacting threshold. */
  lastStepInputTokens = 0;
  /** True once a queued user message was injected mid-stream — lifts the
   *  revival text-only constraint (the stream now carries a real user turn). */
  queuedMessageInjected = false;
  /** Prompt text used for generated media metadata (image/audio models). */
  mediaPrompt = "";
  /** Credit cost for the current model (used for generatedMedia metadata). */
  mediaCreditCost = 0;

  // Per-step token accounting (see TokenAccumulator static ops).
  tokenUncachedInput = 0;
  tokenCachedInput = 0;
  tokenCacheWrite = 0;
  tokenOutput = 0;
  /** Full prompt size on the last step — for display/threshold purposes. */
  tokenLastInput = 0;

  /** Provider first-part watchdog timer handle (see FirstPartWatchdog). */
  firstPartWatchdogTimer: ReturnType<typeof setTimeout> | null = null;

  // Parent chain
  currentParentId: string | null;

  // Sequence ID (links messages in same AI response)
  // Mutable: reset when a queued user message is injected mid-stream so
  // the next assistant response gets a fresh sequence separate from the
  // tool-loop steps that preceded it.
  sequenceId: string;

  // For error handling
  lastParentId: string | null;
  lastSequenceId: string | null;

  // Locale for translations
  readonly locale: CountryLanguage;

  /** Ownership token for this stream's 'streaming' claim (see
   *  ToolExecutionContext.streamRunId) — error/abort handlers pass it to
   *  clearStreamingState so a superseded stream's cleanup never clobbers
   *  the successor's claim. Undefined for incognito (no DB state). */
  readonly streamRunId: string | undefined;

  constructor(params: {
    sequenceId: string;
    initialParentId: string | null;
    initialAssistantMessageId: string;
    isIncognito: boolean;
    logger: EndpointLogger;
    creditsT: ModuleT;
    locale: CountryLanguage;
    wsEmit: MessagesWsEmit;
    emitTitle: EmitThreadTitleFn;
    streamRunId: string | undefined;
    /** Fixture chain of the stream — bound onto the dbWriter so embedding-sync
     *  API calls record/replay like every other AI/media call. */
    streamContext: ToolExecutionContext;
  }) {
    this.streamRunId = params.streamRunId;
    this.sequenceId = params.sequenceId;
    this.currentParentId = params.initialParentId;
    this.lastParentId = params.initialParentId;
    this.lastSequenceId = params.sequenceId;
    this.locale = params.locale;
    this.logger = params.logger;
    this.initialAssistantMessageId = params.initialAssistantMessageId;
    this.wsEmit = params.wsEmit;
    this.dbWriter = new MessageDbWriter(
      params.isIncognito,
      params.logger,
      params.creditsT,
      params.locale,
      this.wsEmit,
      params.emitTitle,
      params.streamContext,
    );
  }

  /**
   * The pre-generated ID for the first ASSISTANT message in this stream.
   * Used as a fallback messageId when the stream aborts before any content is generated.
   */
  get preGeneratedAssistantMessageId(): string {
    return this.initialAssistantMessageId;
  }

  /**
   * Get the next assistant message ID
   *
   * For cache stability, the FIRST assistant message uses the pre-generated ID
   * (which matches the metadata injected in message context).
   * Subsequent assistant messages (in tool loops) get new UUIDs.
   */
  getNextAssistantMessageId(): string {
    if (!this.hasUsedInitialAssistantId) {
      this.hasUsedInitialAssistantId = true;
      return this.initialAssistantMessageId;
    }
    return crypto.randomUUID();
  }

  /**
   * Register a callback to run when the stream ends.
   * Used to unsubscribe from pub/sub channels set up during stream initialization.
   */
  onCleanup(cb: () => void): void {
    this.cleanupCallbacks.push(cb);
  }

  /**
   * Update error tracking
   */
  updateErrorTracking(): void {
    this.lastParentId = this.currentParentId;
    this.lastSequenceId = this.sequenceId;
  }

  /**
   * Cleanup - MUST be called when stream ends
   * Flushes any pending DB writes before clearing state.
   */
  cleanup(): void {
    // Flush any remaining throttled writes - log if it fails so we know messages were lost
    void this.dbWriter.flushAll().catch((err: Error) => {
      this.logger.warn(
        "[StreamContext] flushAll failed during cleanup - some writes may be lost",
        {
          error: err.message,
        },
      );
    });
    this.currentAssistantContent = "";
    this.currentAssistantMessageId = null;
    this.lastEstimatedTokenEmitLength = 0;
    this.pendingToolMessages.clear();
    // Run registered cleanup callbacks (e.g. pub/sub unsubscribe)
    for (const cb of this.cleanupCallbacks) {
      try {
        cb();
      } catch {
        // non-fatal
      }
    }
    this.cleanupCallbacks = [];
  }
}

/**
 * Resolve the effective (possibly de-duplicated) key for a RAW toolCallId,
 * consuming one "claim" from the given counter map. Shared by
 * claimExecuteToolCallId/claimResultToolCallId below - split into two
 * functions (rather than one taking a StreamContext) so each caller's
 * minimal structural type only needs the one counter it actually uses:
 * tools-loader's execute() wrapper only ever sees ToolExecutionContext
 * (chat/config.ts), which doesn't carry resultClaimCount.
 */
function claim(
  duplicateToolCallKeys: Map<string, string[]> | undefined,
  claimCount: Map<string, number> | undefined,
  rawToolCallId: string,
): string {
  if (!claimCount) {
    return rawToolCallId;
  }
  const claimIndex = claimCount.get(rawToolCallId) ?? 0;
  claimCount.set(rawToolCallId, claimIndex + 1);
  if (claimIndex === 0) {
    return rawToolCallId;
  }
  return (
    duplicateToolCallKeys?.get(rawToolCallId)?.[claimIndex - 1] ?? rawToolCallId
  );
}

/**
 * Resolve the effective (possibly de-duplicated) toolCallId for THIS
 * execute() invocation - see StreamContext.duplicateToolCallKeys for why a
 * provider-side id collision within one step needs this. Used by
 * tools-loader's execute() wrapper, which only has ToolExecutionContext
 * (not the full StreamContext) - a no-op (returns rawToolCallId unchanged)
 * outside a streaming context where these maps aren't wired up.
 */
export function claimExecuteToolCallId(
  ctx: {
    duplicateToolCallKeys: Map<string, string[]> | undefined;
    executeClaimCount: Map<string, number> | undefined;
  },
  rawToolCallId: string,
): string {
  return claim(ctx.duplicateToolCallKeys, ctx.executeClaimCount, rawToolCallId);
}

/**
 * Same as claimExecuteToolCallId, but for tool-result/tool-error part
 * matching in the loop (a separate counter - a different consumer than
 * execute()). Always called with the full StreamContext.
 */
export function claimResultToolCallId(
  ctx: StreamContext,
  rawToolCallId: string,
): string {
  return claim(ctx.duplicateToolCallKeys, ctx.resultClaimCount, rawToolCallId);
}

// StreamRegistry (in-memory per-process Map) was REMOVED. Stream cancellation is
// now a pub/sub `stream-control` signal (StreamControl in stream-control.ts) that
// reaches the stream in whatever process/instance runs it; "is a stream live?"
// is answered by the thread's DB streamingState (cross-process truth). See
// stream-cancel-pubsub plan.

// ─── Queue Registry ───────────────────────────────────────────────────────────
// In-memory list of queued messages per thread. When a user message is queued
// while a stream is active, it's registered here so the running stream's
// stopWhen predicate can keep the loop alive and prepareStep can inject the
// queued message as the next user turn — instead of the stream ending and
// restarting via the finally-block queue processor.
interface QueuedMessageEntry {
  id: string;
  content: string;
  metadata: MessageMetadata;
  createdAt: Date;
}

const queuedMessages = new Map<string, QueuedMessageEntry[]>();

export const QueueRegistry = {
  /** Register a queued message for a thread. */
  push(threadId: string, entry: QueuedMessageEntry): void {
    const existing = queuedMessages.get(threadId) ?? [];
    existing.push(entry);
    queuedMessages.set(threadId, existing);
  },

  /** Returns true if there are queued messages for this thread (sync, for stopWhen). */
  hasQueued(threadId: string): boolean {
    const q = queuedMessages.get(threadId);
    return q !== undefined && q.length > 0;
  },

  /** Pop the oldest queued message. Returns undefined if none. */
  shift(threadId: string): QueuedMessageEntry | undefined {
    const q = queuedMessages.get(threadId);
    if (!q || q.length === 0) {
      return undefined;
    }
    const entry = q.shift();
    if (q.length === 0) {
      queuedMessages.delete(threadId);
    }
    return entry;
  },

  /** Clear all queued messages for a thread (on stream abort/error). */
  clear(threadId: string): void {
    queuedMessages.delete(threadId);
  },
};

/**
 * Clear streaming state: unregister from in-memory map + set isStreaming=false in DB.
 * Also updates thread updatedAt and bubbles activity to parent folder.
 * Called from ALL stream exit paths (completion, abort, error, compacting failure).
 */
export async function setStreamingStateAborting(
  threadId: string,
  logger: EndpointLogger,
  user: JwtPayloadType,
): Promise<void> {
  // Write ABORTING AND fan it out on all three channels — the cancel path
  // relies on this for immediate "cancelling…" feedback in every view (it
  // previously wrote silently, so the sidebar spinner never reflected it).
  await transitionStreamingState({
    threadId,
    state: ThreadStreamingState.ABORTING,
    logger,
    user,
  });
}

export interface ClearStreamingResult {
  state: ThreadStreamingState.IDLE | ThreadStreamingState.WAITING;
  updatedAt: Date;
  /** True when another stream now owns the claim — nothing was cleared and the
   *  caller must NOT emit STREAM_FINISHED (the owner will emit its own). */
  superseded?: boolean;
}

export async function clearStreamingState(
  threadId: string,
  logger: EndpointLogger,
  user: JwtPayloadType,
  /**
   * Ownership token of the finishing stream (streamContext.streamRunId).
   * When provided, the clear only applies while chat_threads.streamingRunId
   * still matches — a stale finalizer whose claim was superseded by a newer
   * stream (queued turn, revival) becomes a no-op instead of clobbering it.
   * undefined = unowned clear (external reconcilers, user cancel).
   */
  ownerRunId: string | undefined,
): Promise<ClearStreamingResult> {
  const now = new Date();

  // Fetch rootFolderId for WS channel routing — needed to match the client's
  // includeInCacheKey subscription channel. streamingRunId rides along for
  // the ownership check below.
  const [threadMeta] = await db
    .select({
      rootFolderId: chatThreads.rootFolderId,
      streamingRunId: chatThreads.streamingRunId,
    })
    .from(chatThreads)
    .where(eq(chatThreads.id, threadId))
    .limit(1);
  const rootFolderId = threadMeta?.rootFolderId;

  // Ownership check: if a DIFFERENT stream now owns the claim, this finalizer
  // is stale — do not unregister (that would evict the owner's registry entry)
  // and do not touch the state.
  if (
    ownerRunId !== undefined &&
    threadMeta?.streamingRunId !== null &&
    threadMeta?.streamingRunId !== undefined &&
    threadMeta.streamingRunId !== ownerRunId
  ) {
    logger.debug(
      "[clearStreamingState] claim superseded by another stream - skipping",
      { threadId, ownerRunId, currentRunId: threadMeta.streamingRunId },
    );
    return {
      state: ThreadStreamingState.WAITING,
      updatedAt: now,
      superseded: true,
    };
  }

  // Check for active work tied to this thread - if any is still running,
  // set "waiting" instead of "idle" so the stop button stays visible.
  // Two sources: local cron tasks (this instance's own background work) and
  // in-flight remote calls (no task rows — see remote-call/spec.md).
  // DETACH tasks run fire-and-forget — they never revive the thread, so a
  // still-running DETACH goroutine must NOT keep the thread in "waiting".
  const [activeTask] = await db
    .select({ id: cronTasks.id })
    .from(cronTasks)
    .where(
      and(
        sql`${cronTasks.taskInput}->>'threadId' = ${threadId}`,
        eq(cronTasks.lastExecutionStatus, CronTaskStatus.RUNNING),
      ),
    )
    .limit(1);

  // A scheduled-but-not-yet-finished revival (resume-stream row, possibly
  // direct-firing in ANOTHER process) means the thread is about to stream —
  // an idle verdict here would let the revival turn leak into whatever the
  // caller does next.
  const [resumePending] = await db
    .select({ id: cronTasks.id })
    .from(cronTasks)
    .where(
      and(
        eq(cronTasks.enabled, true),
        like(cronTasks.routeId, "resume-stream%"),
        sql`${cronTasks.taskInput}->>'threadId' = ${threadId}`,
      ),
    )
    .limit(1);

  const { PendingCalls } =
    await import("next-vibe/execute-tool/repository/pending-calls");

  const nextState: ThreadStreamingState.IDLE | ThreadStreamingState.WAITING =
    activeTask || resumePending || (await PendingCalls.hasForThread(threadId))
      ? ThreadStreamingState.WAITING
      : ThreadStreamingState.IDLE;

  // Ownership re-check inside the WHERE closes the read→write race: a claim
  // taken between the select above and this update still wins.
  const ownerGuard =
    ownerRunId !== undefined
      ? or(
          isNull(chatThreads.streamingRunId),
          eq(chatThreads.streamingRunId, ownerRunId),
        )
      : undefined;
  const [thread] = await db
    .update(chatThreads)
    .set({
      streamingState: nextState,
      streamingRunId: null,
      updatedAt: now,
    })
    .where(
      nextState === ThreadStreamingState.IDLE
        ? // Positively idle: rows + registry (cross-process reconciled) show
          // no pending work — clearing an earlier 'waiting' is correct, and
          // nothing else would ever transition it back.
          and(eq(chatThreads.id, threadId), ownerGuard)
        : and(
            eq(chatThreads.id, threadId),
            ne(chatThreads.streamingState, ThreadStreamingState.WAITING),
            ownerGuard,
          ),
    )
    .returning({ folderId: chatThreads.folderId });

  // Bubble last-activity up the full ancestor chain so nested folders sort correctly in sidebar
  if (thread?.folderId) {
    await bubbleFolderActivity(thread.folderId, now, logger, user);
  }

  // Fan the terminal transition out on ALL three channels, routed to the
  // thread's REAL folder — for BOTH outcomes:
  //   - IDLE:    clears the sidebar spinner (previously emitted NOTHING here,
  //              so finished subfolder threads span forever on the list).
  //   - WAITING: shows the stop button (a task/remote call is still in flight;
  //              escalateToTask may have already written 'waiting', skipping
  //              the update above — the event must fire regardless).
  await emitStreamingState({
    threadId,
    state: nextState,
    logger,
    user,
    rootFolderId,
    subFolderId: thread?.folderId ?? null,
    updatedAt: now,
  });

  return { state: nextState, updatedAt: now };
}

/**
 * Set streaming state to "waiting": unregister from in-memory map + set streamingState="waiting" in DB.
 * Used when the stream aborts but a task is still in flight (REMOTE_TOOL_WAIT, STREAM_TIMEOUT).
 * Revival (via handleTaskCompletion) will set the state back to idle/streaming when the task completes.
 */
export async function setStreamingStateWaiting(
  threadId: string,
  logger: EndpointLogger,
  user: JwtPayloadType,
): Promise<void> {
  const now = new Date();
  const [thread] = await db
    .update(chatThreads)
    .set({
      streamingState: ThreadStreamingState.WAITING,
      // Parking releases the stream's ownership claim — whoever revives next
      // (resume-stream claim or a fresh turn) takes a new one.
      streamingRunId: null,
      updatedAt: now,
    })
    .where(eq(chatThreads.id, threadId))
    .returning({
      folderId: chatThreads.folderId,
      rootFolderId: chatThreads.rootFolderId,
    });

  // Bubble last-activity up the full ancestor chain so nested folders sort correctly in sidebar
  if (thread?.folderId) {
    await bubbleFolderActivity(thread.folderId, now, logger, user);
  }

  // Fan the WAITING transition out so the sidebar shows the stop button — this
  // previously emitted nothing, leaving the list stuck on the prior state.
  await emitStreamingState({
    threadId,
    state: ThreadStreamingState.WAITING,
    logger,
    user,
    rootFolderId: thread?.rootFolderId ?? null,
    subFolderId: thread?.folderId ?? null,
    updatedAt: now,
  });
}
/**
 * Atomically claim a thread's revival slot: flip streamingState idle|waiting →
 * streaming, stamping the given ownership run id. Returns true iff THIS call won
 * the claim (0 rows updated ⇒ another resume/turn already holds it). The
 * ownership token lets a stale finalizer no-op instead of clobbering the winner.
 * Used by resume-stream to serialize parallel wakeUp/WAIT revivals per thread.
 */
export async function claimRevivalSlot(
  threadId: string,
  claimRunId: string,
  logger: EndpointLogger,
  user: JwtPayloadType,
): Promise<boolean> {
  const [claimed] = await db
    .update(chatThreads)
    .set({
      streamingState: ThreadStreamingState.STREAMING,
      streamingRunId: claimRunId,
    })
    .where(
      and(
        eq(chatThreads.id, threadId),
        sql`${chatThreads.streamingState} IN ('idle', 'waiting')`,
      ),
    )
    .returning({
      rootFolderId: chatThreads.rootFolderId,
      folderId: chatThreads.folderId,
    });
  if (!claimed) {
    return false;
  }
  // Won the claim → fan the STREAMING transition out so the sidebar shows the
  // spinner during the revival (previously emitted nothing).
  await emitStreamingState({
    threadId,
    state: ThreadStreamingState.STREAMING,
    logger,
    user,
    rootFolderId: claimed.rootFolderId,
    subFolderId: claimed.folderId,
  });
  return true;
}

/**
 * Flip a thread's streamingState back to idle, guarded on the expected current
 * state so a concurrent claim's 'streaming' (or a fresh turn) is never
 * clobbered. The streaming-state-changed WS emit ALWAYS fires (even when the
 * guarded DB update is a no-op) so clients never hang on a stale spinner; DB
 * errors propagate to the caller. Used by resume-stream's reset/idempotency paths.
 */
export async function resetStreamingToIdle(
  threadId: string,
  guardState: ThreadStreamingState.STREAMING | ThreadStreamingState.WAITING,
  rootFolderId: DefaultFolderId,
  logger: EndpointLogger,
  user: JwtPayloadType,
): Promise<void> {
  try {
    await db
      .update(chatThreads)
      .set({
        streamingState: ThreadStreamingState.IDLE,
        streamingRunId: null,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(chatThreads.id, threadId),
          eq(chatThreads.streamingState, guardState),
        ),
      );
  } finally {
    // Emit ALWAYS (even when the guarded update was a no-op) so clients never
    // hang on a stale spinner — on all three channels, routed to the thread's
    // real folder (subFolderId loaded from the row).
    await emitStreamingState({
      threadId,
      state: ThreadStreamingState.IDLE,
      logger,
      user,
      rootFolderId,
    });
  }
}

/**
 * AbortControllerSetup - Sets up abort controllers for stream timeout and client disconnect
 */
export class AbortControllerSetup {
  /**
   * Create abort controller with timeout handling.
   * When parentSignal is provided (headless sub-streams), abort propagates from parent.
   */
  static setupAbortController(params: {
    maxDuration: number;
    parentSignal?: AbortSignal;
  }): AbortController {
    const { maxDuration, parentSignal } = params;

    // Create abort controller for this stream - combines request signal with timeout
    const streamAbortController = new AbortController();
    const timeoutAbortController = AbortSignal.timeout(maxDuration * 1000);

    // Abort our controller when timeout fires
    const timeoutAbortHandler = (): void => {
      streamAbortController.abort(
        new StreamAbortError(AbortReason.STREAM_TIMEOUT),
      );
    };
    timeoutAbortController.addEventListener("abort", timeoutAbortHandler, {
      once: true,
    });

    // Propagate parent cancellation (e.g. parent AI stream cancelled while sub-agent runs)
    if (parentSignal) {
      if (parentSignal.aborted) {
        streamAbortController.abort(parentSignal.reason);
      } else {
        parentSignal.addEventListener(
          "abort",
          () => {
            streamAbortController.abort(parentSignal.reason);
          },
          { once: true },
        );
      }
    }

    // Stream survives page refresh - no request.signal linkage.
    // Streams are only cancelled via the cancel endpoint or timeout.

    return streamAbortController;
  }
}
