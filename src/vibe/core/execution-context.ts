/**
 * Tool execution context — the neutral home.
 *
 * Every surface that dispatches a tool (web route handler, CLI, MCP server,
 * cron, execute-tool) constructs and threads a `ToolExecutionContext`. The type
 * is therefore a CORE concept: `core/route/handler.ts` and
 * `core/route/server-default.ts` both name it in their public contracts.
 *
 * It previously lived in `agent/chat/config.ts`, next to agent-chat folder
 * POLICY (FOLDER_DENIED_TOOL_IDS, DEFAULT_FOLDER_CONFIGS, ...). That was a file
 * location, not a domain boundary: it forced core to import upward into the
 * agent domain — including a RUNTIME import of the `DefaultFolderId` enum in
 * `core/route/next-handler.ts` — so anything wanting to dispatch a tool pulled
 * the whole agent tree behind it.
 *
 * This module has ZERO runtime imports by design. Every import below is
 * `import type` and erases at compile time, so it can never participate in an
 * import cycle. Keep it that way: if you need a runtime value here, it belongs
 * in a lower-level module, not in this one.
 *
 * ONE upward type reference remains, and it is deliberate:
 * `resolvedMediaSelections` names the image/music/video-gen selection unions,
 * which are derived from the agent's model catalogs (thousands of lines of
 * model IDs). Those cannot descend into core, and the field cannot be typed
 * structurally without weakening it. It is type-only and runtime-free.
 */

import type { ImageGenModelSelection } from "../agent/image-generation/models";
import type { MusicGenModelSelection } from "../agent/music-generation/models";
import type { VideoGenModelSelection } from "../agent/video-generation/models";
import type { CallbackModeValue } from "../execute-tool/constants";
import type { ErrorResponseType } from "./route/response.schema";
import type { WidgetData } from "./utils/json";

/**
 * Default folder IDs
 * These are special system folder IDs that exist outside the database
 * They use simple string IDs (not UUIDs) for easy reference
 *
 * Lives here rather than in `agent/chat/config.ts` because it types
 * `ToolExecutionContext.rootFolderId` — the execution scope every tool
 * dispatch carries — and `core/route/next-handler.ts` reads it as a value.
 */
export enum DefaultFolderId {
  /** Private folder - user-only access, server-stored */
  PRIVATE = "private",

  /** Shared folder - link-based sharing */
  SHARED = "shared",

  /** Public folder - forum-style with moderation */
  PUBLIC = "public",

  /** Incognito folder - localStorage only, never sent to server */
  INCOGNITO = "incognito",

  /** Background folder - threads created by sub AI agents */
  BACKGROUND = "cron",

  /** Remote folder - hub for connected remote instance threads */
  REMOTE = "remote",
}

/**
 * Stream Context - rich context passed to tool executions during AI streaming.
 * Replaces the old single `rootFolderId` parameter with a structured object
 * so handlers know which thread/message/model they're operating in.
 */
export interface ToolExecutionContext {
  /**
   * Per-context confirmation settings (favorite/skill/request cascade).
   * execute-tool consults these for its TARGET tool so wrapped calls honour
   * the same confirmation gate as direct calls.
   */
  confirmationOverrides?: Array<{
    toolId: string;
    requiresConfirmation: boolean;
  }> | null;
  /** Which root folder the conversation lives in */
  rootFolderId: DefaultFolderId;
  /** Thread ID of the active conversation */
  threadId: string | undefined;
  /**
   * Spawning thread when this stream is a sub-stream/sub-agent child. Carried
   * IN CONTEXT (not just persisted) because an INCOGNITO sub-stream (image-gen
   * LLM path) has no DB row for the fixture engine to walk from — the engine
   * starts the lineage walk here. NULL for top-level streams. Test/dev only in
   * effect (the fixture engine is the sole consumer); harmless in prod.
   */
  parentThreadId?: string;
  /**
   * TEST-ONLY fixture plumbing. When a context is cloned for a single
   * parallel-fan-out call (gap-fill bridge), this pins the fixture ordinal that
   * call must use — reserved synchronously in a stable order BEFORE the
   * concurrent fetches fire, so the racing calls never compete for the shared
   * counter and each replays the same recording every run. Never set in prod
   * (the fixture engine is dev/test-only); ignored outside the fixture fetch.
   */
  fixtureOrdinal?: number;
  /**
   * IANA timezone of the turn (e.g. "Europe/Vienna"). Threaded from the client
   * request for interactive turns and from the owning user / server for
   * server-driven turns (ai-run, revival, cron). Used for date formatting in
   * the system prompt so headless turns don't fall back to UTC.
   */
  timezone: string;
  /**
   * Whether voice (TTS) mode is on for this turn. Threaded so a REVIVAL turn
   * keeps speaking when the original conversation was in voice mode. The VOICE
   * itself is NOT here — it resolves from the favorite/skill (→ default). Sub
   * agents (ai-run) never inherit voice mode.
   */
  voiceEnabled: boolean;
  /** The assistant message ID currently being generated */
  aiMessageId: string | undefined;
  /**
   * The tool message ID for the current tool call being executed.
   * Set by tools-loader execute() wrapper from pendingToolMessages.get(toolCallId)
   * before calling each tool's execute(). Parallel-safe via per-call injection.
   * Used by execute-tool and await-task to record which DB row to update.
   */
  currentToolMessageId: string | undefined;
  /**
   * Read-only reference to toolExecutionContext.pendingToolMessages.
   * Keyed by AI SDK toolCallId. Set once in stream-setup and never replaced.
   * tools-loader inject currentToolMessageId from this map before each execute() call.
   * Not present in non-streaming contexts (cron, headless).
   */
  pendingToolMessages:
    | Map<
        string,
        {
          messageId: string;
          toolCallData?: {
            parentId: string | null;
            toolCall?: {
              requiresConfirmation?: boolean;
              waitingForConfirmation?: boolean;
              isConfirmed?: boolean;
            };
          };
        }
      >
    | undefined;
  /**
   * De-duplicated keys for raw toolCallIds that collided within a step (see
   * toolExecutionContext.duplicateToolCallKeys). Read by tools-loader's execute()
   * wrapper to resolve which pendingToolMessages entry a given execute()
   * invocation corresponds to. Not present in non-streaming contexts.
   */
  duplicateToolCallKeys: Map<string, string[]> | undefined;
  /**
   * How many times tools-loader's execute() wrapper has claimed a pending
   * entry for a given raw toolCallId (see toolExecutionContext.executeClaimCount).
   * Mutated in place by tools-loader - callers share the same Map instance.
   * Not present in non-streaming contexts.
   */
  executeClaimCount: Map<string, number> | undefined;
  /**
   * When set, finish-step-handler starts a timeout of this many ms using the
   * stream's abort controller. Used for remote queue path and await-task.
   * Direct HTTP wait mode does NOT use this - the HTTP connection is the timeout.
   */
  pendingTimeoutMs: number | undefined;
  /**
   * Stream timeout from the called tool's endpoint definition (streamTimeoutMs).
   * Injected by tools-loader before execute() is called.
   * undefined = use default (90_000). 0 = no timeout (long-running tools).
   */
  callerTimeoutMs?: number;
  /**
   * The branch leaf message ID at the time this tool call was initiated.
   * Set by tools-loader from PendingToolData.toolCallData.parentId before each execute() call.
   * Stored on wakeUp task rows so resume-stream can append the deferred result to the
   * correct branch even if the user has switched to a different branch in the meantime.
   */
  leafMessageId: string | undefined;
  /**
   * The active favorite ID - allows resume-stream to reload the exact same
   * model + character config when restarting a dead stream after a remote tool result.
   */
  favoriteId: string | undefined;

  /**
   * The effective resolved skill for this stream.
   * This is the post-resolution value (from favorite or explicit override).
   */
  skillId: string | undefined;

  /**
   * Pre-resolved media model selections from setup — the exact same cascade
   * (mediaModelOverrides → favorite → skill → default) that the system prompt
   * uses. Stored here so generate_music/image/video requestDefaults can inject
   * the right model without re-running the cascade or touching the DB again.
   */
  resolvedMediaSelections?: {
    musicGenModelSelection: MusicGenModelSelection;
    imageGenModelSelection: ImageGenModelSelection;
    videoGenModelSelection: VideoGenModelSelection;
  };

  /** Whether this is a headless/cron invocation */
  headless: boolean | undefined;
  /**
   * True when this stream is a ws-provider RECEIVER loop (relay /
   * inference-provider): it runs headless HERE but mirrors a LIVE interactive
   * session on the originator. Confirmation gates (requiresConfirmation) must
   * apply as if interactive — the originator has the confirmation UI; plain
   * headless callers (MCP/CLI/cron) do not.
   */
  relayReceiver?: boolean;
  /**
   * Sub-agent nesting depth. 0 = top-level (user-facing or cron).
   * Incremented each time ai-run spawns a child stream.
   * Revival / wakeUp streams inherit the parent's depth (they continue, not nest).
   */
  subAgentDepth: number;
  /** Whether this is a revival stream (resume-stream after wakeUp task completed). */
  isRevival: boolean | undefined;
  /**
   * Mutable signal set by remote tools with callbackMode=wait.
   * Stream layer checks this after tool-result to pause and wait for /report.
   */
  waitingForRemoteResult: boolean | undefined;
  /**
   * Set by escalateToTask(callbackMode=wait) to trigger endLoop semantics:
   * wait for all parallel tools to finish, then stop the AI loop without a
   * new request. Bridged to toolExecutionContext.shouldStopLoop in index.ts.
   * Optional - only present in streaming contexts (bridged via defineProperty).
   */
  shouldStopLoop?: boolean;
  /**
   * Set when any tool in the current step requires user confirmation.
   * Causes finish-step-handler to abort the stream before the AI response turn,
   * so the user sees the confirmation UI without the AI continuing.
   * Optional - only meaningful in streaming contexts.
   *
   * Bridge contract (one-way: execute-tool → ai-stream):
   *   - local-execute.ts sets this when the TARGET tool requires confirmation
   *     (requiresConfirmation gate fires inside execute-tool, which has no direct
   *     access to ai-stream's toolExecutionContext).
   *   - stream-part-handler.ts mirrors it onto toolExecutionContext.stepHasToolsAwaitingConfirmation
   *     at tool-result time so the finish-step abort fires correctly.
   * Do not read this field in execute-tool itself — it is a signal OUT to the stream layer.
   */
  stepHasToolsAwaitingConfirmation?: boolean;
  /**
   * Set by tool-confirmation-handler before re-executing a confirmed tool.
   * Signals that the execute-tool requiresConfirmation gate should be bypassed.
   * Without this, re-executing execute-tool(toolName='contact-form') would
   * re-trigger the gate and return waiting_for_confirmation a second time.
   */
  isConfirmedReExecution?: boolean;
  /**
   * The stream's abort signal - set when streaming, undefined for non-stream contexts.
   * Tool executions check this before starting to bail out if the stream was cancelled.
   */
  abortSignal: AbortSignal;
  /**
   * The AI SDK toolCallId for the current tool call being executed.
   * Set by tools-loader execute() wrapper from options.toolCallId before calling execute().
   * Used by execute-tool to look up the correct toolMessageId for parallel tool calls.
   * Not present in non-streaming contexts (cron, headless).
   */
  callerToolCallId: string | undefined;
  /**
   * The callbackMode the AI caller requested for the current tool call.
   * Set by execute-tool before invoking the tool handler so long-running tools
   * (like claude-code interactive) can pass it to escalateToTask() and honour
   * the exact semantics the caller expects (wait/wakeUp/detach/endLoop).
   * Undefined outside of execute-tool invocations.
   */
  callerCallbackMode: CallbackModeValue | undefined;
  /**
   * Call this from inside a long-running tool execute() to escape the 90s stream timeout.
   * Creates a task row with the requested callbackMode and stops the stream cleanly:
   * - wait: sets shouldStopLoop (endLoop semantics, all parallel tools finish first)
   * - wakeUp/detach: sets waitingForRemoteResult (REMOTE_TOOL_WAIT, stream aborts immediately)
   * Also wires cancel propagation. The tool continues running after this returns.
   * When the tool finishes, call onComplete() - or for tools that delegate completion
   * to an external process (e.g. claude-code calling complete-task), ignore onComplete.
   * Only available in streaming contexts - undefined for cron/headless invocations.
   *
   * Usage:
   *   if (context.toolExecutionContext.escalateToTask) {
   *     const { taskId, onComplete } = await context.toolExecutionContext.escalateToTask({
   *       callbackMode: context.toolExecutionContext.callerCallbackMode,
   *       displayName: "My long task",
   *     });
   *     // ... do long-running work ...
   *     await onComplete({ success: true, data: result });
   *   }
   */
  escalateToTask:
    | ((options?: {
        /** callbackMode to honour - defaults to wakeUp for backward compat */
        callbackMode?: CallbackModeValue;
        /** Human-readable name shown in task dashboard */
        displayName?: string;
      }) => Promise<{
        taskId: string;
        onComplete: (
          result:
            | { success: true; data?: Record<string, WidgetData> }
            | ErrorResponseType,
        ) => Promise<void>;
      }>)
    | undefined;
  /**
   * Set by escalateToTask when a task is in flight.
   * Called by the abort signal listener when USER_CANCELLED fires so the task
   * row is marked CANCELLED and the UI unlocks for a new message.
   * Cleared after the cancel runs (or after onComplete).
   */
  onEscalatedTaskCancel: (() => Promise<void>) | undefined;
  /**
   * Set by escalateToTask() immediately after inserting the task row.
   * Cleared by stream-part-handler once it backfills wakeUpToolMessageId with
   * the actual TOOL message ID (which is created after escalateToTask returns).
   * This bridges the timing gap between escalation and TOOL message creation.
   */
  pendingEscalatedTaskId?: string | undefined;
  /**
   * Cancels the pending stream timeout timer set by finish-step-handler.
   * Called by the stream's finally block so the 90s timer doesn't fire
   * after the stream has already ended naturally (e.g. wakeUp mode where
   * the AI writes a response and the loop exits cleanly).
   */
  cancelPendingStreamTimer?: (() => void) | undefined;
  /**
   * Tool message IDs of wakeUp calls that were intercepted by await-task.
   * The stream's finally block skips revival for these so the AI doesn't wake up
   * again after await-task already delivered the result inline.
   */
  suppressedWakeUpToolMessageIds?: Set<string>;
  /**
   * Emit a partial tool result to the parent thread's WS channel and persist to DB.
   * The tool message stays in "Executing" state but result data is available to the widget.
   * Called by long-running tools (e.g. ai-run) to stream intermediate state before completion.
   * Only available in streaming contexts - undefined for cron/headless invocations.
   */
  emitPartialToolResult?: (partialResult: WidgetData) => Promise<void>;
  /**
   * Set by execute-tool's handleIncomingToolRequest (the RECEIVER of a remote
   * detach/wakeUp dispatch). local-async uses it as the task-row ID so the
   * SAME identity (the requester's callId) names the work on both instances —
   * await-task targeted at either side finds it, and the receiver's task
   * history is the durable result store (parity with local detach).
   */
  remoteDispatchCallId?: string;
  /**
   * Completion hook for receiver-side async execution: local-async invokes it
   * after the goroutine settles (post claim/completion handling) so the
   * receiver can emit the tool-execute-result wire event back to the
   * requester. Undefined outside remote-dispatch reception.
   */
  onAsyncTaskSettled?: (outcome: {
    taskId: string;
    status: "completed" | "failed";
    output: Record<string, WidgetData> | null;
    errorMessage: string | null;
  }) => Promise<void>;
  /**
   * Ownership token for this stream execution's 'streaming' claim on
   * chat_threads.streamingRunId. Generated once per stream in setup; finalize
   * and error paths pass it to clearStreamingState so only the CURRENT owner
   * can clear the state — a stale finalizer (late revival, superseded turn)
   * no-ops instead of clobbering the successor stream's claim. Undefined for
   * headless tool contexts that never claim streaming.
   */
  streamRunId?: string;
}

/**
 * Create a minimal headless ToolExecutionContext for non-streaming callers:
 * MCP, CLI, cron tasks, tests, vibe-sense. All stream-specific fields are
 * undefined; only rootFolderId, subAgentDepth, threadId, and abortSignal are
 * set. The threadId doubles as the fixture scope (tests): AI/media calls made
 * with this context record/replay under that thread's fixture prefix.
 */
export function makeHeadlessContext(
  // Both explicit at every call site — headless contexts must consciously
  // decide their abort wiring and thread/fixture scope, never inherit by omission.
  signal: AbortSignal | undefined,
  threadId: string | undefined,
  // The owning USER's IANA timezone — threaded from stored user/thread state,
  // never resolved from the server. Incidental non-AI callers may omit it.
  timezone: string,
): ToolExecutionContext {
  return {
    rootFolderId: DefaultFolderId.BACKGROUND,
    threadId,
    timezone,
    // Headless callers don't speak; a revival that inherits voice mode sets
    // this explicitly on its own context.
    voiceEnabled: false,
    aiMessageId: undefined,
    skillId: undefined,
    headless: true,
    subAgentDepth: 0,
    currentToolMessageId: undefined,
    callerToolCallId: undefined,
    pendingToolMessages: undefined,
    duplicateToolCallKeys: undefined,
    executeClaimCount: undefined,
    pendingTimeoutMs: undefined,
    leafMessageId: undefined,
    waitingForRemoteResult: undefined,
    favoriteId: undefined,
    abortSignal: signal ?? new AbortController().signal,
    callerCallbackMode: undefined,
    onEscalatedTaskCancel: undefined,
    escalateToTask: undefined,
    isRevival: undefined,
  };
}

/**
 * An EXPLICIT thread-less stream context for genuine execution ROOTS that have
 * no stream and never should — standalone maintenance (seed generation,
 * embedding backfill, debug endpoints) and cross-instance relayed appliers.
 *
 * Because it carries no threadId, the fixture engine's read returns null and
 * every external call it reaches runs LIVE (never recorded/replayed). Passing
 * this — instead of a broken `undefined` — keeps `ToolExecutionContext`
 * required across the whole chain, so a missing context anywhere ON a real
 * stream path is a compile error, while these true roots stay greppable.
 */
export function rootlessToolExecutionContext(): ToolExecutionContext {
  // no user context — UTC (dates not user-facing here)
  return makeHeadlessContext(undefined, undefined, "UTC");
}
