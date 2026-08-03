/**
 * AI Stream revival — the whole async-result delivery + finalize story, in
 * narrative order: wake-up channel → live-stream injection → deferred insert →
 * post-stream revival batch → stream-finished emit.
 */

import "server-only";

import type { ModelMessage } from "ai";
import { eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { ResolvedRelayContext } from "next-vibe/realtime/core/relay-context";

import {
  DefaultFolderId,
  type ToolExecutionContext,
} from "../../../../core/execution-context";
import { chatMessages, chatThreads, type ToolCall } from "../../../chat/db";
import { ChatMessageRole, ThreadStreamingState } from "../../../chat/enum";
import { createFolderContentsEmitter } from "../../../chat/folder-contents/[rootFolderId]/emitter";
import {
  createMessagesEmitter,
  createMessagesGetEmitter,
} from "../../../chat/threads/[threadId]/messages/emitter";
import { createThreadsGetEmitter } from "../../../chat/threads/emitter";
import type { FavoriteConfig } from "../../../skills/favorites/db";
import type { ChatModelId, ChatModelOption } from "../../models";
import type { AiStreamPostRequestOutput } from "../../stream/definition";
import type { AiStreamT } from "../../stream/i18n";
import { createFixtureFetch } from "../../testing/fetch-cache";
import { buildToolResultOutput } from "../context/tool-output";
import { buildSseMessageRow } from "../core/db-writer/sse-row";
import { type ToolExecutionContextImpl } from "../core/stream";
import { walkToLeafMessage } from "../core/tree-walk";
import type { HeadlessAiStreamResult } from "../setup/setup";

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

export interface WakeUpPayload {
  toolMessageId: string;
  authorId: string | null;
  originalSequenceId: string | null;
  originalToolCall: ToolCall;
  wakeUpResult: WidgetData | undefined;
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
/**
 * Live-stream wakeUp result injection — the spec's "stream still running:
 * result injected into current turn as next step" path.
 *
 * When a wakeUp task completes while the dispatching stream is STILL RUNNING,
 * the result must reach the model inside the SAME agent loop — not via a fresh
 * headless revival turn. A fresh turn re-presents the original user
 * instruction as the active prompt, and a tool-primed model re-dispatches the
 * tool in a loop (the relay wakeUp cascade). Injection instead:
 *
 *   1. Inserts the deferred TOOL message into the DB chain at the live tip
 *      (single-writer guarantee holds: the stream is the only inserter) and
 *      emits the usual message-created + tool-result WS events.
 *   2. Appends the converter-shaped assistant(tool-call)+tool(result) pair to
 *      the in-flight ModelMessage list via prepareStep, so the model sees the
 *      result as the natural next step and acknowledges it in-context.
 *   3. Marks the payload's tool message as suppressed so the post-stream
 *      revival batch (the dead-stream fallback) never double-fires.
 *
 * Payloads that arrive after the final step (loop already ending) are NOT
 * drained here — they fall through to the existing post-stream
 * handleWakeUpRevivalBatch, which inserts the deferred and runs ONE revival.
 * Local and relay run this identical code — the loop just lives elsewhere.
 */

/**
 * Drain all pending wakeUp payloads into the live message list.
 * Returns the extended message list when at least one payload was injected,
 * or null when there was nothing to drain (caller keeps its list untouched).
 */
export async function injectPendingWakeUpResults(params: {
  messages: ModelMessage[];
  payloads: WakeUpPayload[];
  ctx: ToolExecutionContextImpl;
  toolExecutionContext: ToolExecutionContext;
  threadId: string;
  modelConfig: ChatModelOption;
  user: JwtPayloadType;
  logger: EndpointLogger;
}): Promise<ModelMessage[] | null> {
  const {
    messages,
    payloads,
    ctx,
    toolExecutionContext,
    threadId,
    modelConfig,
    user,
    logger,
  } = params;
  if (payloads.length === 0) {
    return null;
  }

  const extended = [...messages];
  // All injected results of one drain share a sequenceId so the UI groups
  // them with the assistant's in-stream acknowledgement.
  const batchSequenceId = crypto.randomUUID();

  for (const payload of payloads) {
    // 1. Persist the deferred TOOL message at the live chain tip.
    const { deferredId } = await insertDeferredWakeUpMessage(
      threadId,
      payload,
      logger,
      user,
      batchSequenceId,
    );

    // Advance the live chain: the next assistant message (the model's
    // acknowledgement) must parent under the deferred result — same pattern
    // as queued-message injection.
    ctx.currentParentId = deferredId;
    ctx.lastParentId = deferredId;
    ctx.sequenceId = batchSequenceId;

    // 2. Append the converter-shaped pair to the model context. The deferred
    //    reuses the original toolCallId in DB (originalToolCallId link); the
    //    in-flight conversation already used that id for the dispatch, so the
    //    injected pair gets a suffixed id to keep provider-side ids unique.
    const injectedCallId = `${payload.originalToolCall.toolCallId}-deferred`;
    const toolName = payload.originalToolCall.toolName;
    // Modality-aware output (image passthrough when the model can see it) —
    // the same shaping the converter applies to deferred messages on the
    // next full-context turn.
    const output = await buildToolResultOutput(
      logger,
      payload.wakeUpResult,
      toolName,
      modelConfig,
      true,
      createFixtureFetch(toolExecutionContext, logger),
    );
    extended.push(
      {
        role: "assistant",
        content: [
          {
            type: "tool-call",
            toolCallId: injectedCallId,
            toolName,
            input: {
              hint: "async wakeUp task settled — result delivered below",
            },
          },
        ],
      },
      {
        role: "tool",
        content: [
          {
            type: "tool-result",
            toolCallId: injectedCallId,
            toolName,
            output,
          },
        ],
      },
    );

    // 3. Suppress the post-stream revival batch for this payload — it was
    //    delivered inline (same contract await-task uses).
    if (!toolExecutionContext.suppressedWakeUpToolMessageIds) {
      toolExecutionContext.suppressedWakeUpToolMessageIds = new Set();
    }
    toolExecutionContext.suppressedWakeUpToolMessageIds.add(
      payload.toolMessageId,
    );

    logger.debug("[WakeUp] Injected result into live stream", {
      threadId,
      toolMessageId: payload.toolMessageId,
      deferredId,
    });
  }

  // No instruction injection: the completed tool call + result in the history
  // are all a well-formed model state needs to continue the task naturally.
  return extended;
}
/**
 * insertDeferredWakeUpMessage
 *
 * Inserts a deferred TOOL message into the thread and emits the matching WS events.
 * Called by the live stream's finally block when a wakeUp signal was received.
 * Keeping insertion here (inside the stream's finally) means only the single live
 * stream ever inserts - no concurrent-insertion race is possible.
 */

export async function insertDeferredWakeUpMessage(
  threadId: string,
  payload: WakeUpPayload,
  logger: EndpointLogger,
  user: JwtPayloadType,
  sharedSequenceId?: string,
  resolvedRelayContext?: ResolvedRelayContext,
): Promise<{ deferredId: string; deferredSequenceId: string }> {
  const {
    toolMessageId,
    authorId,
    originalToolCall,
    wakeUpResult,
    wakeUpStatus,
    resolvedModel,
    resolvedSkill,
    leafMessageId,
  } = payload;

  const deferredId = crypto.randomUUID();
  const deferredSequenceId = sharedSequenceId ?? crypto.randomUUID();

  const deferredStatus =
    wakeUpStatus === "completed" ? ("completed" as const) : ("failed" as const);

  const deferredToolCall = {
    ...originalToolCall,
    toolCallId: originalToolCall.toolCallId,
    result: wakeUpResult,
    status: deferredStatus,
    originalToolCallId: originalToolCall.toolCallId,
    callbackMode: "wakeUp" as const,
    isDeferred: true,
    // Do NOT propagate isConfirmed - this is an async background result,
    // not a user-confirmation action. Prevents "Confirmed by you" badge.
    isConfirmed: false,
  };

  // Walk from the best-known position to find the actual current leaf.
  // leafMessageId is a hint from the caller (may be the tool message itself or a later message).
  // Always walk forward to find the newest descendant — handles stale hints correctly.
  const chainParentId = await walkToLeafMessage(
    threadId,
    leafMessageId ?? toolMessageId,
    toolMessageId,
  );

  await db.insert(chatMessages).values({
    id: deferredId,
    threadId,
    role: ChatMessageRole.TOOL,
    content: null,
    parentId: chainParentId,
    authorId: authorId ?? undefined,
    sequenceId: deferredSequenceId,
    isAI: true,
    model: resolvedModel,
    skill: resolvedSkill,
    metadata: { toolCall: deferredToolCall },
  });

  const [threadRow] = await db
    .select({ rootFolderId: chatThreads.rootFolderId })
    .from(chatThreads)
    .where(eq(chatThreads.id, threadId))
    .limit(1);
  const rootFolderId = threadRow?.rootFolderId;
  if (!rootFolderId) {
    return { deferredId, deferredSequenceId };
  }
  const wsEmit = createMessagesEmitter(logger, user, {
    threadId,
    rootFolderId,
    resolvedRelayContext,
  });
  wsEmit("message-created", {
    responseData: {
      messages: [
        buildSseMessageRow({
          id: deferredId,
          threadId,
          role: ChatMessageRole.TOOL,
          isAI: true,
          parentId: chainParentId,
          model: resolvedModel,
          skill: resolvedSkill,
          sequenceId: deferredSequenceId,
          metadata: { toolCall: deferredToolCall },
        }),
      ],
      streamingState: ThreadStreamingState.STREAMING,
    },
  });
  wsEmit("tool-result", {
    responseData: {
      messages: [{ id: deferredId, metadata: { toolCall: deferredToolCall } }],
    },
  });

  logger.debug("[WakeUp] Deferred message inserted by live stream", {
    threadId,
    toolMessageId,
    deferredId,
    chainParentId,
  });

  return { deferredId, deferredSequenceId };
}

/**
 * The fields that vary between wakeUp-revival call sites. The invariant trio
 * (prompt:"", wakeUpRevival:true)
 * is applied by fireWakeUpRevival so every revival turn behaves identically.
 */
export interface FireWakeUpRevivalParams {
  favoriteId?: string;
  favoriteConfig: FavoriteConfig | null;
  model: ChatModelId;
  skill: string;
  explicitParentMessageId: string;
  sequenceIdOverride?: string;
  threadId: string;
  rootFolderId: DefaultFolderId;
  subFolderId?: string;
  subAgentDepth: number;
  user: JwtPayloadType;
  locale: CountryLanguage;
  logger: EndpointLogger;
  t: AiStreamT;
  abortSignal: AbortSignal;
}

/**
 * Fire ONE wakeUp-revival headless stream. Wraps
 * AiStreamRepository.createAiStream({ awaitResult: true }) with the common
 * revival shape; callers keep their own then/catch cleanup semantics.
 */
export async function fireWakeUpRevival(
  params: FireWakeUpRevivalParams,
): Promise<ResponseType<HeadlessAiStreamResult>> {
  // Fixture context needs no special handling here: it is anchored on the
  // THREAD (chat_threads.stream_context.toolExecutionContext) and adopted by stream setup,
  // so a revival firing in ANY process continues the dispatching test's
  // context; content-addressed fixture matching (fetch-cache requestHash)
  // keeps the revival's model calls distinct from the dispatch turn's.
  // No revival instructions: the completed tool call + result in the thread
  // history are all a well-formed model state needs — it continues the task
  // (further tool calls included) or wraps up on its own judgment.
  const syntheticData: AiStreamPostRequestOutput = {
    operation: "send", // placeholder — headlessIntake derives the real one
    rootFolderId: params.rootFolderId,
    subFolderId: params.subFolderId ?? null,
    threadId: params.threadId,
    userMessageId: null,
    parentMessageId: params.explicitParentMessageId,
    content: "",
    role: ChatMessageRole.USER,
    model: params.model,
    skill: params.skill,
    favoriteConfig: params.favoriteConfig,
    toolConfirmations: null,
    messageHistory: [],
    voiceMode: { enabled: false },
    audioInput: { file: null },
    resumeToken: null,
    timezone: "UTC",
    attachments: null,
    executionContext: { mode: "local" as const },
  };

  // Lazy import: revival → index is a known module cycle (index → loop →
  // revival → index); a static import here TDZ-crashes SSR after partial HMR.
  const { AiStreamRepository } = await import("../index");
  return await AiStreamRepository.createAiStream({
    data: syntheticData,
    locale: params.locale,
    logger: params.logger,
    user: params.user,
    request: undefined,
    t: params.t,
    awaitResult: true,
    isRevival: true,
    // A revival fires from a KNOWN parent (the deferred/tool leaf) — pass it
    // top-level so the headless intake phase loads history from exactly there
    // rather than falling back to the thread's latest-by-createdAt message.
    explicitParentMessageId: params.explicitParentMessageId,
    extraInstructions: undefined,
    favoriteIdOverride: params.favoriteId,
    sequenceIdOverride: params.sequenceIdOverride,
    subAgentDepth: params.subAgentDepth,
    parentAbortSignal: params.abortSignal,
  });
}

/**
 * Insert all pending wakeUp deferred messages as a linear chain, then fire ONE
 * revival headless stream from the last one. Batching ensures that if multiple
 * wakeUp tools complete before the stream yields, all their deferred messages
 * are inserted together and a single AI turn sees all of them — no duplicate
 * revival responses. No-op for an empty batch.
 */
export async function handleWakeUpRevivalBatch(params: {
  payloads: WakeUpPayload[];
  threadId: string;
  rootFolderId: DefaultFolderId;
  subAgentDepth: number;
  user: JwtPayloadType;
  locale: CountryLanguage;
  logger: EndpointLogger;
  aiStreamT: AiStreamT;
  abortSignal: AbortSignal;
}): Promise<void> {
  const {
    payloads,
    threadId,
    rootFolderId,
    subAgentDepth,
    user,
    locale,
    logger,
    aiStreamT,
    abortSignal,
  } = params;
  if (payloads.length === 0) {
    return;
  }

  let lastDeferredId = "";
  let lastPayload = payloads[0];
  // All deferred messages in a batch share one sequenceId so the UI groups them
  // into a single assistant bubble together with the revival AI response.
  const batchSequenceId = crypto.randomUUID();

  // Insert all deferred messages sequentially so they form a linear chain
  // (each walkToLeafMessage finds the previous deferred as the new leaf).
  for (const payload of payloads) {
    const { deferredId } = await insertDeferredWakeUpMessage(
      threadId,
      payload,
      logger,
      user,
      batchSequenceId,
    );
    lastDeferredId = deferredId;
    lastPayload = payload;
  }

  logger.debug("[WakeUp] Firing revival after stream yield", {
    threadId,
    deferredCount: payloads.length,
    lastDeferredId,
  });
  await fireWakeUpRevival({
    favoriteId: lastPayload.favoriteId,
    favoriteConfig: null,
    model: lastPayload.resolvedModel,
    skill: lastPayload.resolvedSkill,
    explicitParentMessageId: lastDeferredId,
    sequenceIdOverride: batchSequenceId,
    threadId,
    rootFolderId,
    subAgentDepth,
    user,
    locale,
    logger,
    t: aiStreamT,
    abortSignal,
  }).catch((err: Error) => {
    logger.error("[WakeUp] Revival failed", {
      threadId,
      error: err.message,
    });
  });
}

/**
 * Emit the `stream-finished` "done" signal on all three channels a client may be
 * subscribed to: the per-thread messages-get channel, the threads-get list
 * channel, and (when a root folder is known) the folder-contents channel. Used
 * by both the headless and interactive finalize paths so the 3-channel fan-out
 * lives in exactly one place.
 */
export async function emitStreamFinished(params: {
  threadId: string;
  state: ThreadStreamingState;
  updatedAt: Date;
  rootFolderId: DefaultFolderId | null | undefined;
  logger: EndpointLogger;
  user: JwtPayloadType;
  resolvedRelayContext?: ResolvedRelayContext;
}): Promise<void> {
  const {
    threadId,
    state,
    updatedAt,
    rootFolderId,
    logger,
    user,
    resolvedRelayContext,
  } = params;
  // Route the LIST channels to the thread's REAL folder — a subfolder thread's
  // `stream-finished` must reach the subfolder list, not the root (was
  // hardcoded subFolderId:null, so subfolder views never saw the done signal).
  const [row] = await db
    .select({ folderId: chatThreads.folderId })
    .from(chatThreads)
    .where(eq(chatThreads.id, threadId))
    .limit(1);
  const subFolderId = row?.folderId ?? null;
  const threadUpdate = {
    id: threadId,
    streamingState: state,
    updatedAt,
  };
  createMessagesGetEmitter(logger, user, {
    threadId,
    rootFolderId: rootFolderId ?? DefaultFolderId.PRIVATE,
    resolvedRelayContext,
  })("stream-finished", {
    responseData: { streamingState: state },
  });
  createThreadsGetEmitter(logger, user, {
    rootFolderId: rootFolderId ?? DefaultFolderId.PRIVATE,
    subFolderId,
    resolvedRelayContext,
  })("stream-finished", {
    responseData: { threads: [threadUpdate] },
  });
  if (rootFolderId) {
    // Target the thread's own folder channel (subFolderId) + carry the
    // type/rootFolderId/folderId discriminators so nested-folder viewers get the
    // done signal and a not-yet-cached thread doesn't merge as a partial stub.
    createFolderContentsEmitter(logger, user, rootFolderId, {
      subFolderId,
      resolvedRelayContext,
    })("stream-finished", {
      responseData: {
        items: [
          {
            ...threadUpdate,
            type: "thread" as const,
            rootFolderId,
            folderId: subFolderId,
          },
        ],
      },
    });
  }
}
