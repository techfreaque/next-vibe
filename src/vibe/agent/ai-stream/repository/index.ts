/**
 * AI Stream Repository
 * Handles AI streaming chat functionality with thread/message creation
 */

import "server-only";

import type { JSONValue } from "ai";
import { and, eq, sql } from "drizzle-orm";
import { getInstanceAvailability } from "next-vibe/agent/env-availability";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { CallbackMode } from "next-vibe/execute-tool/constants";
import { RouteExecuteRepository } from "next-vibe/execute-tool/repository";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { CoreTool } from "next-vibe/platforms/ai/tools-loader";
import { Platform } from "next-vibe/platforms/platforms";
import type { ResolvedRelayContext } from "next-vibe/realtime/remote-event-bridge/relay-context";
import { RemoteEventBridgeRepository } from "next-vibe/realtime/remote-event-bridge/repository";
import type { NextRequest } from "next-vibe/ui/lib/request";

import type { ToolExecutionContext } from "../../chat/config";
import { DefaultFolderId, makeHeadlessContext } from "../../chat/config";
import { chatMessages, chatThreads, type ToolCall } from "../../chat/db";
import {
  ChatMessageRole,
  ThreadStatus,
  ThreadStreamingState,
} from "../../chat/enum";
import { createFolderContentsEmitter } from "../../chat/folder-contents/[rootFolderId]/emitter";
import { scopedTranslation as chatScopedTranslation } from "../../chat/i18n";
import { isSkillVariantId, isUuid, parseSkillId } from "../../chat/slugify";
import {
  createMessagesEmitter,
  type MessagesWsEmit,
} from "../../chat/threads/[threadId]/messages/emitter";
import {
  createThreadsGetEmitter,
  createThreadsPostEmitter,
} from "../../chat/threads/emitter";
import type { ImageGenModelSelection } from "../../image-generation/models";
import type { MusicGenModelSelection } from "../../music-generation/models";
import {
  chatFavorites,
  FAVORITE_CONFIG_COLUMNS,
  type FavoriteConfig,
} from "../../skills/favorites/db";
import { SkillsRepository } from "../../skills/repository";
import { stripThinkTags } from "../../text-to-speech/content-processing";
import type { VideoGenModelSelection } from "../../video-generation/models";
import type {
  AiStreamRunPostRequestOutput,
  AiStreamRunPostResponseOutput,
} from "../run/definition";
import type {
  AiStreamPostRequestOutput,
  AiStreamPostResponseOutput,
} from "../stream/definition";
import type { AiStreamT } from "../stream/i18n";
import { buildSystemPrompt } from "../system-prompt/builder";
import { CompactingHandler } from "./compacting/pre-stream";
import { rebuildWithCompactedHistory } from "./context/history";
import {
  shouldTriggerCompacting,
  truncateToContextWindow,
} from "./context/token-budget";
import { AbortReason } from "./core/constants";
import { resolveModelSkill } from "./core/modality-resolver";
import {
  clearStreamingState,
  QueueRegistry,
  setStreamingStateWaiting,
} from "./core/stream";
import { findLatestThreadMessage, walkToLeafMessage } from "./core/tree-walk";
import {
  emitSetupError,
  emitStreamCreationError,
  StreamErrorCatchHandler,
} from "./errors/errors";
import { GapFillExecutor } from "./handlers/gap-fill-executor";
import { InitialEventsHandler } from "./handlers/initial-events-handler";
import { StreamStartHandler } from "./handlers/stream-start-handler";
import { runAutoQueueBranch } from "./intake/queue";
import { StreamLoop } from "./loop/loop";
import { runRelayBranch } from "./relay/caller";
import {
  emitStreamFinished,
  handleWakeUpRevivalBatch,
  subscribeWakeUpSignal,
  type WakeUpPayload,
} from "./revival/revival";
import {
  type HeadlessIntake,
  type HeadlessPreCall,
  runHeadlessIntakePhase,
} from "./setup/headless-intake-phase";
import { type HeadlessAiStreamResult, setupAiStream } from "./setup/setup";

/**
 * The single source of truth for createAiStream's parameters. The overloads
 * are expressed as intersections with { awaitResult: true } / { awaitResult?: false }
 * so the ~20-field list exists exactly ONCE (it used to be typed three times
 * and had drifted between the copies).
 */
export interface CreateAiStreamParams {
  data: AiStreamPostRequestOutput;
  locale: CountryLanguage;
  logger: EndpointLogger;
  user: JwtPayloadType;
  request: NextRequest | undefined;
  /** Revival stream (resume-stream after a wakeUp task completed). */
  isRevival?: boolean;
  /**
   * True for ws-provider RECEIVER loops (relay / inference-provider): the loop
   * runs headless here but mirrors a live interactive session on the
   * originator — confirmation gates apply (see ToolExecutionContext).
   */
  relayReceiver?: boolean;
  /** FOREIGN copy: the owning instance (relay executor landing). */
  originInstanceId?: string;
  /** Transient plumbing thread (tool executions): excluded from thread sync. */
  syncEligible?: boolean;
  /** Model-pipe relay receiver: suppress this instance's own identity in the
   *  system prompt — the caller's relayed context is authoritative. */
  suppressSelfIdentity?: boolean;
  /** Relay receiver: caller instance that owns this thread — rename-thread
   *  round-trips to it (see SystemPromptServerParams.relayCallerInstanceId). */
  relayCallerInstanceId?: string;
  t: AiStreamT;
  extraInstructions?: string;
  excludeMemories?: boolean;
  favoriteIdOverride?: string;
  sequenceIdOverride?: string;
  subAgentDepth: number;
  mediaModelOverrides?: {
    musicGenModelSelection?: MusicGenModelSelection;
    videoGenModelSelection?: VideoGenModelSelection;
    imageGenModelSelection?: ImageGenModelSelection;
  };
  /** Override tools entirely (ws-provider relay / API provider client tools). */
  toolsOverride?: Record<string, CoreTool>;
  /**
   * The ToolExecutionContext the toolsOverride closures were BOUND to (the
   * relay receiver builds them against a headless context before the stream
   * exists). The stream wires its live pendingToolMessages map onto it so
   * per-call tool-message resolution — and with it the wakeUp/detach park
   * anchor (storePendingCallId + revival registration) — works exactly like
   * server-loaded tools.
   */
  toolsContext?: ToolExecutionContext;
  /** Parent stream's abort signal - sub-stream aborts when parent does. */
  parentAbortSignal?: AbortSignal;
  /**
   * Per-tool confirmation requirements injected by the relay target
   * (ws-provider) — the remote loop has no favorite of its own, so these
   * carry the caller's favorite/skill confirmation gates to the remote
   * execute-tool gate. Merged into the resolved availableTools confirmations.
   */
  confirmationOverridesOverride?: Array<{
    toolId: string;
    requiresConfirmation: boolean;
  }> | null;
  /**
   * Cap on agent-loop tool-call rounds for THIS stream (ai-run maxTurns).
   * Defaults to MAX_TOOL_CALLS when omitted.
   */
  maxToolCalls?: number;
  /**
   * Headless-adapter intake: inject preCalls as thread messages and derive
   * the effective operation/parent/userMessageId from thread state before
   * any branch runs. Set ONLY by awaitResult callers that build a synthetic
   * request (ai-run) — interactive clients and the ws-provider/relay receivers
   * send fully-formed data instead.
   */
  headlessIntake?: HeadlessIntake;
  /**
   * Called as soon as the thread ID is known (before intake/preCalls and the
   * AI turn). ai-run uses this to emit a partial tool result carrying the
   * threadId so the parent UI renders sub-thread messages in real-time.
   */
  onThreadCreated?: (threadId: string) => Promise<void>;
  /**
   * REVIVAL: deferred wakeUp payload. When set (with isRevival), the intake
   * phase inserts the deferred TOOL message at the chain leaf before the loop,
   * so revival "just calls createAiStream" — no separate pre-insertion step.
   */
  deferredWakeUpPayload?: WakeUpPayload;
  /**
   * REVIVAL: explicit parent message id for history loading (skips the
   * "last message by createdAt" fallback). Set by revival so the deferred
   * TOOL result is the ancestry root. `isRevival` already selects the
   * "wakeup-resume" operation (no CONTINUE_CONVERSATION_PROMPT).
   */
  explicitParentMessageId?: string;
  /**
   * Spawning thread when this stream is a SUB-STREAM/SUB-AGENT (ai-run child,
   * image-gen LLM sub-stream). Persisted on the child thread row (provenance);
   * the fixture engine walks it child → parent → root to find the run's counter.
   * NULL/absent for top-level streams and relay mirrors.
   */
  parentThreadId?: string;
}

export class AiStreamRepository {
  /**
   * Maximum duration for streaming responses (in seconds)
   */
  private static readonly maxDuration = 900; // 15 minutes for multi-step tool calling

  /**
   * Extract user identifiers from request
   */
  private static extractUserIdentifiers(
    user: JwtPayloadType,
    request: NextRequest | undefined,
    awaitResult: boolean,
  ): {
    userId: string | undefined;
    leadId: string;
    ipAddress?: string;
  } {
    const userId = !user.isPublic && user.id ? user.id : undefined;

    const ipAddress = request
      ? request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        undefined
      : awaitResult
        ? "headless"
        : "cli";

    return { userId, leadId: user.leadId, ipAddress };
  }

  /**
   * Emit the thread-created event to the threads + folder-contents channels so
   * other tabs/clients render a newly-created thread immediately. Pure WS
   * emission — no state mutation. Callers gate on isNewThread && !incognito &&
   * !relayReceiver (a foreign-copy landing must never echo creation).
   */
  private static emitThreadCreated(params: {
    threadId: string;
    title: string;
    rootFolderId: DefaultFolderId;
    subFolderId: string | null;
    logger: EndpointLogger;
    user: JwtPayloadType;
    resolvedRelayContext?: ResolvedRelayContext;
  }): void {
    const {
      threadId,
      title,
      rootFolderId,
      subFolderId,
      logger,
      user,
      resolvedRelayContext,
    } = params;
    const now = new Date();
    createThreadsPostEmitter(logger, user, { resolvedRelayContext })(
      "thread-created",
      {
        requestData: {
          id: threadId,
          title,
          rootFolderId: rootFolderId as Exclude<
            DefaultFolderId,
            typeof DefaultFolderId.INCOGNITO
          >,
          // SAME-id placement for cross-instance mirrors: the peer hangs its
          // mirror off this exact folder id once the chain has synced.
          subFolderId: subFolderId ?? undefined,
        },
      },
    );
    // Target the channel of the folder the thread lives in (subFolderId) so a
    // viewer of a NESTED folder — on that folder's channel, not the root view's —
    // receives the create. Root-level threads (subFolderId null) hit the root view.
    createFolderContentsEmitter(logger, user, rootFolderId, {
      subFolderId,
      resolvedRelayContext,
    })("thread-created", {
      responseData: {
        items: [
          {
            id: threadId,
            type: "thread" as const,
            title,
            rootFolderId,
            folderId: subFolderId,
            status: ThreadStatus.ACTIVE,
            streamingState: ThreadStreamingState.STREAMING,
            createdAt: now,
            updatedAt: now,
          },
        ],
      },
    });
  }

  /**
   * Strip <think>...</think> reasoning tags from AI message content.
   * Handles both complete tags and incomplete (streaming-cut) trailing tags.
   */
  /**
   * Execute a single pre-call and return its result.
   * Args are passed as flat merged data — execute-tool auto-splits
   * urlPathParams from data using the endpoint's requestUrlPathParamsSchema.
   */
  private static async executePreCall(
    routeId: string,
    mergedArgs: Record<string, WidgetData>,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    toolExecutionContext: ToolExecutionContext,
  ): Promise<
    ResponseType<{
      routeId: string;
      args: Record<string, WidgetData>;
      data: WidgetData;
    }>
  > {
    logger.debug("[AiStreamRun] Executing pre-call", { routeId });

    const result = await RouteExecuteRepository.runInProcess({
      toolName: routeId,
      input: mergedArgs,
      callbackMode: CallbackMode.WAIT,
      user,
      locale,
      logger,
      toolExecutionContext,
      platform: Platform.AI,
    });

    if (!result.success) {
      return fail({
        message:
          result.message ?? "app.api.agent.ai-stream.run.errors.preCallFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    // runInProcess wraps inline WAIT results as { result: actualData }.
    // Unwrap so callers get the endpoint's raw output, not the execute-tool wrapper.
    const rawData = result.data;
    const unwrapped =
      rawData !== null &&
      typeof rawData === "object" &&
      !Array.isArray(rawData) &&
      "result" in rawData
        ? rawData.result
        : rawData;
    return success({
      routeId,
      args: mergedArgs,
      data: unwrapped,
    });
  }

  /**
   * RUN mode one-shot (`ai-run`), folded INTO createAiStream. Called from the
   * `waitForResult` branch of createAiStream. Runs the genuinely run-specific
   * work — pre-call EXECUTION, sub-agent favorite override, companion soul
   * injection — then delegates the actual turn to
   * `createAiStream({ awaitResult: true })` (which resolves model/skill/tool-config
   * ONCE, so this method deliberately does NOT re-resolve them). Waits for the
   * headless turn to settle, reads the last assistant message + tokens from the
   * DB, strips think tags, fetches thread metadata, and shapes the run response.
   */
  static async runAndWait({
    data,
    locale,
    logger,
    user,
    t: aiStreamT,
    toolExecutionContext,
  }: {
    data: AiStreamRunPostRequestOutput;
    locale: CountryLanguage;
    logger: EndpointLogger;
    user: JwtPayloadType;
    t: AiStreamT;
    toolExecutionContext: ToolExecutionContext;
  }): Promise<ResponseType<AiStreamRunPostResponseOutput>> {
    const prompt = data.prompt;
    const subAgentDepth = toolExecutionContext.subAgentDepth ?? 0;
    const runPreCalls = data.preCalls;
    const extraInstructions = data.instructions;
    const excludeMemories = data.excludeMemories ?? false;
    const favoriteIdOverride = data.favoriteId;
    const maxToolCalls = data.maxTurns;
    const parentAbortSignal = toolExecutionContext.abortSignal;
    const onThreadCreated = toolExecutionContext.emitPartialToolResult
      ? async (subThreadId: string): Promise<void> => {
          await toolExecutionContext.emitPartialToolResult!({
            threadId: subThreadId,
          });
        }
      : undefined;
    // The calling companion's skill (for companion-soul inheritance) rides the
    // stream context of the invoking turn.
    const callerSkillId = toolExecutionContext.skillId;
    try {
      const rootFolderId = data.rootFolderId ?? DefaultFolderId.BACKGROUND;

      // incognito rootFolder → no persistence; existing thread → append; else new.
      const isIncognito = rootFolderId === DefaultFolderId.INCOGNITO;
      const headlessThreadMode: "none" | "new" | "append" = isIncognito
        ? "none"
        : "new";

      // ── Step 1: Execute pre-calls sequentially ──────────────────────────
      const preCallResults: Array<{
        routeId: string;
        args: Record<string, WidgetData>;
        success: boolean;
        data?: WidgetData;
        error?: string;
        executionTimeMs?: number;
      }> = [];

      const preCallAbortController = new AbortController();

      if (runPreCalls && runPreCalls.length > 0) {
        // Pre-calls run in the run's own folder at the parent's sub-agent depth
        // (makeHeadlessContext defaults to BACKGROUND/depth-0; override both).
        const preCallContext: ToolExecutionContext = {
          ...makeHeadlessContext(
            preCallAbortController.signal,
            undefined,
            toolExecutionContext.timezone,
          ),
          rootFolderId,
          headless: undefined,
          subAgentDepth,
          isRevival: false,
        };
        for (const call of runPreCalls) {
          const startTime = Date.now();
          const result = await AiStreamRepository.executePreCall(
            call.routeId,
            call.args,
            user,
            locale,
            logger,
            preCallContext,
          );
          preCallResults.push({
            routeId: result.success ? result.data.routeId : call.routeId,
            args: result.success ? result.data.args : call.args,
            success: result.success,
            data: result.success ? result.data.data : undefined,
            error: result.success ? undefined : result.message,
            executionTimeMs: Date.now() - startTime,
          });
        }
      }

      logger.debug("[AiStreamRun] Running headless stream", {
        model: data.model,
        promptLength: prompt.length,
        preCallCount: preCallResults.length,
      });

      // Map to HeadlessPreCall format for proper tool message injection.
      const headlessPreCalls: HeadlessPreCall[] = preCallResults.map(
        (r): HeadlessPreCall => ({
          routeId: r.routeId,
          args: r.args,
          result: r.data ?? null,
          success: r.success,
          error: r.error,
          executionTimeMs: r.executionTimeMs,
        }),
      );

      // ── Sub-agent favorite override ──────────────────────────────────────
      // When invoked from within an active stream, the invoking favorite
      // (favoriteIdOverride) may carry a subAgentFavoriteId. If so, the
      // sub-agent inherits THAT favorite's full config instead of the parent's.
      // null = task isolation (default); set = power-user override.
      let effectiveFavoriteId = favoriteIdOverride;
      let overrideFavoriteConfig: FavoriteConfig | null = null;
      const userId = user.isPublic ? undefined : user.id;
      if (favoriteIdOverride && userId) {
        const favoriteIdCondition = isUuid(favoriteIdOverride)
          ? eq(chatFavorites.id, favoriteIdOverride)
          : isSkillVariantId(favoriteIdOverride)
            ? ((): ReturnType<typeof and> => {
                const { skillId, variantId } = parseSkillId(favoriteIdOverride);
                return and(
                  eq(chatFavorites.skillId, skillId),
                  variantId !== null
                    ? eq(chatFavorites.variantId, variantId)
                    : sql`${chatFavorites.variantId} IS NULL`,
                );
              })()
            : eq(chatFavorites.slug, favoriteIdOverride);
        const [invokingFavorite] = await db
          .select({ subAgentFavoriteId: chatFavorites.subAgentFavoriteId })
          .from(chatFavorites)
          .where(and(favoriteIdCondition, eq(chatFavorites.userId, userId)))
          .limit(1);

        if (invokingFavorite?.subAgentFavoriteId) {
          effectiveFavoriteId = invokingFavorite.subAgentFavoriteId;
          const [overrideFav] = await db
            .select(FAVORITE_CONFIG_COLUMNS)
            .from(chatFavorites)
            .where(
              and(
                eq(chatFavorites.id, invokingFavorite.subAgentFavoriteId),
                eq(chatFavorites.userId, userId),
              ),
            )
            .limit(1);
          if (overrideFav) {
            overrideFavoriteConfig = overrideFav;
          }
        }
      }

      // ── Companion soul injection ─────────────────────────────────────────
      // When the calling companion (toolExecutionContext.skillId) has a companionPrompt
      // set, prepend it to instructions so the sub-agent inherits the soul.
      let effectiveInstructions = extraInstructions;
      if (callerSkillId) {
        const companionPrompt =
          await SkillsRepository.getCompanionPrompt(callerSkillId);
        if (companionPrompt) {
          effectiveInstructions = effectiveInstructions
            ? `${companionPrompt}\n\n${effectiveInstructions}`
            : companionPrompt;
        }
      }

      // ── Step 2: Resolve model/skill (the ONE resolution) + build request ──
      // ai-run supplies EXACTLY ONE model source, in precedence order:
      // explicit model (source-1, skill as label) → favorite → skill variant.
      // The sub-agent override favoriteConfig rides as downstream context.
      const runModel = data.model || undefined;
      const runFavoriteId = runModel ? undefined : effectiveFavoriteId;
      const runSkill = runModel
        ? data.skill || undefined // source-1 skill label
        : runFavoriteId
          ? undefined // favorite carries its own skill
          : data.skill || undefined; // source-3 skill variant
      const resolvedForRun = await resolveModelSkill({
        model: runModel,
        skill: runSkill,
        favoriteConfig: overrideFavoriteConfig,
        favoriteId: runFavoriteId,
        user,
        locale,
        logger,
        t: aiStreamT,
      });
      if (!resolvedForRun.success) {
        return resolvedForRun;
      }
      // ai-run is a text one-shot: no voice/audio/attachments inputs exist on
      // the request, so those fields are genuinely empty here (not defaulted).
      const syntheticData: AiStreamPostRequestOutput = {
        operation: "send",
        rootFolderId,
        subFolderId: data.subFolderId ?? null,
        threadId: data.appendThreadId ?? crypto.randomUUID(),
        userMessageId: null,
        parentMessageId: null,
        content: prompt,
        role: ChatMessageRole.USER,
        model: resolvedForRun.data.model,
        skill: resolvedForRun.data.skill,
        favoriteConfig: resolvedForRun.data.favoriteConfig,
        toolConfirmations: null,
        messageHistory: [],
        voiceMode: { enabled: false },
        audioInput: { file: null },
        resumeToken: null,
        // Inherited from the calling stream's context (originally the frontend).
        timezone: toolExecutionContext.timezone,
        attachments: null,
        executionContext: { mode: "local" as const },
      };

      const streamResult = await AiStreamRepository.createAiStream({
        data: syntheticData,
        locale,
        logger,
        user,
        request: undefined,
        t: aiStreamT,
        awaitResult: true,
        headlessIntake: {
          preCalls: headlessPreCalls.length > 0 ? headlessPreCalls : undefined,
          operationOverride: "send",
        },
        isRevival: false,
        extraInstructions: effectiveInstructions,
        excludeMemories,
        favoriteIdOverride: effectiveFavoriteId,
        subAgentDepth: subAgentDepth + 1,
        onThreadCreated,
        parentAbortSignal,
        maxToolCalls,
        // Sub-agent child: link to the spawning thread for provenance + fixture
        // root walk. The `data.appendThreadId ?? random` id above stays the
        // child's own identity.
        parentThreadId: toolExecutionContext.threadId,
      });

      if (!streamResult.success) {
        return streamResult;
      }

      return AiStreamRepository.shapeRunResult({
        headlessResult: streamResult.data,
        isIncognito,
        headlessThreadMode,
        preCallResults,
        logger,
      });
    } catch (error) {
      const msg = parseError(error).message;
      logger.error("[AiStreamRun] Failed", { error: msg });
      return fail({
        message: aiStreamT("errors.unexpectedError", { error: msg }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Shape the headless turn result into the ai-run response: read the last
   * assistant message + tokens from the DB (in-memory content for incognito),
   * strip think-tags, fetch thread metadata, and attach the pre-call summary.
   */
  private static async shapeRunResult(params: {
    headlessResult: HeadlessAiStreamResult;
    isIncognito: boolean;
    headlessThreadMode: "none" | "new" | "append";
    preCallResults: Array<{
      routeId: string;
      success: boolean;
      error?: string;
    }>;
    logger: EndpointLogger;
  }): Promise<ResponseType<AiStreamRunPostResponseOutput>> {
    const {
      headlessResult,
      isIncognito,
      headlessThreadMode,
      preCallResults,
      logger,
    } = params;
    const { lastAiMessageId, threadId, lastAiMessageContent } = headlessResult;

    // Incognito → messages aren't persisted; use in-memory content directly.
    // Persistent modes → DB read also provides token metadata.
    let rawText: string | null = lastAiMessageContent ?? null;
    let promptTokens: number | null = null;
    let completionTokens: number | null = null;
    let creditCost: number | null = null;

    if (!isIncognito) {
      const [aiMessage] = await db
        .select({
          content: chatMessages.content,
          metadata: chatMessages.metadata,
        })
        .from(chatMessages)
        .where(eq(chatMessages.id, lastAiMessageId))
        .limit(1);

      rawText = aiMessage?.content ?? rawText;
      promptTokens = aiMessage?.metadata?.promptTokens ?? null;
      completionTokens = aiMessage?.metadata?.completionTokens ?? null;
      creditCost = aiMessage?.metadata?.creditCost ?? null;
    }

    const text = rawText ? stripThinkTags(rawText) : null;
    const resultThreadId =
      (headlessThreadMode !== "none" ? threadId : null) ?? null;

    let threadTitle: string | null = null;
    let threadCreatedAt: string | null = null;
    if (resultThreadId) {
      const [thread] = await db
        .select({ title: chatThreads.title, createdAt: chatThreads.createdAt })
        .from(chatThreads)
        .where(eq(chatThreads.id, resultThreadId))
        .limit(1);
      threadTitle = thread?.title ?? null;
      threadCreatedAt = thread?.createdAt?.toISOString() ?? null;
    }

    logger.debug("[AiStreamRun] Complete", {
      lastAiMessageId,
      threadId: resultThreadId,
      textLength: text?.length ?? 0,
      promptTokens,
      completionTokens,
    });

    return success({
      text,
      threadId: resultThreadId,
      lastAiMessageId: headlessThreadMode !== "none" ? lastAiMessageId : null,
      threadTitle,
      threadCreatedAt,
      promptTokens,
      completionTokens,
      creditCost,
      preCallResults: preCallResults.map((r) => ({
        routeId: r.routeId,
        success: r.success,
        error: r.error ?? null,
      })),
    });
  }

  /** Headless overload - returns structured result with threadId + lastAiMessageId */
  static createAiStream(
    params: CreateAiStreamParams & { awaitResult: true },
  ): Promise<ResponseType<HeadlessAiStreamResult>>;

  /** Interactive overload - returns response output (events stream via WS) */
  static createAiStream(
    params: CreateAiStreamParams & { awaitResult?: false },
  ): Promise<ResponseType<AiStreamPostResponseOutput>>;

  static async createAiStream({
    data,
    locale,
    logger,
    user,
    request,
    awaitResult = false,
    isRevival,
    relayReceiver,
    relayCallerInstanceId,
    originInstanceId,
    syncEligible,
    suppressSelfIdentity,
    t: aiStreamT,
    extraInstructions,
    excludeMemories,
    favoriteIdOverride,
    sequenceIdOverride,
    subAgentDepth,
    mediaModelOverrides,
    toolsOverride,
    toolsContext,
    parentAbortSignal,
    confirmationOverridesOverride,
    maxToolCalls,
    headlessIntake,
    onThreadCreated,
    deferredWakeUpPayload,
    explicitParentMessageId,
    parentThreadId,
  }: CreateAiStreamParams & {
    awaitResult?: boolean;
  }): Promise<
    | ResponseType<AiStreamPostResponseOutput>
    | ResponseType<HeadlessAiStreamResult>
  > {
    const { userId, leadId, ipAddress } =
      AiStreamRepository.extractUserIdentifiers(user, request, awaitResult);

    // Notify the caller of the thread ID before any work starts (ai-run emits
    // a partial tool result so the parent UI can render the sub-thread live).
    if (onThreadCreated) {
      await onThreadCreated(data.threadId);
    }

    // ================================================================
    // Model/skill resolution — ALWAYS, EXACTLY ONE source in precedence:
    // explicit model (interactive client — model+skill, favoriteConfig as
    // context) → favoriteId → skill variant. The interactive path carries a
    // model, so this resolves to source-1 (a no-op on the concrete value).
    // ================================================================
    {
      const streamModel = data.model || undefined;
      const streamFavoriteId = streamModel ? undefined : favoriteIdOverride;
      const streamSkill = streamModel
        ? data.skill || undefined
        : streamFavoriteId
          ? undefined
          : data.skill || undefined;
      const resolved = await resolveModelSkill({
        model: streamModel,
        skill: streamSkill,
        favoriteConfig: data.favoriteConfig ?? null,
        favoriteId: streamFavoriteId,
        user,
        locale,
        logger,
        t: aiStreamT,
      });
      if (!resolved.success) {
        return resolved;
      }
      data = {
        ...data,
        model: resolved.data.model,
        skill: resolved.data.skill,
        favoriteConfig: resolved.data.favoriteConfig,
      };
    }

    // ================================================================
    // Headless intake: inject preCalls as thread messages and derive
    // operation/parent/userMessageId from thread state. Must run BEFORE
    // the relay branch so relayed headless turns forward the DERIVED
    // operation + parent to the remote instance.
    //
    // Runs whenever the intake phase must derive operation/userMessageId,
    // i.e. any turn that does NOT already carry a userMessageId from a client:
    //   - explicit `headlessIntake` (adapter/ai-run with preCalls or override)
    //   - a REVIVAL (wakeUp/WAIT resume — derives "wakeup-resume")
    //   - ANY headless (awaitResult) send that a synthetic caller (e.g. the
    //     media-gen sub-stream) built with content but no userMessageId
    // Without this, the "send" placeholder + null userMessageId falls through
    // to setup's userMessageId guard and fails with "Invalid JSON in request
    // body". The intake phase is the ONE place that mints the userMessageId, so
    // no synthetic call site has to remember to pass `headlessIntake`.
    // ================================================================
    const needsIntakeDerivation =
      isRevival ||
      (awaitResult &&
        !data.userMessageId &&
        !(data.toolConfirmations && data.toolConfirmations.length > 0));
    const effectiveHeadlessIntake: HeadlessIntake | undefined =
      headlessIntake ?? (needsIntakeDerivation ? {} : undefined);
    if (effectiveHeadlessIntake) {
      const intakeResult = await runHeadlessIntakePhase({
        data,
        intake: effectiveHeadlessIntake,
        isRevival,
        explicitParentMessageId,
        deferredWakeUpPayload,
        user,
        locale,
        logger,
      });
      if (!intakeResult.success) {
        return intakeResult;
      }
      data = intakeResult.data;
    }

    // ================================================================
    // WS-provider branch: request came from a remote relay caller.
    //   - inference-provider: runs INCOGNITO (no DB thread) with caller identity
    //     for tool callbacks + WS events (UNBOTTLED / pure inference).
    //   - relay: PERSISTS the thread at the mirrored BACKGROUND/<originator>/
    //     <folderPath> location (remote-chat-root REMOTE-folder routing).
    // ================================================================
    if (
      data.executionContext.mode === "inference-provider" ||
      data.executionContext.mode === "relay"
    ) {
      const { runWsProviderStream } = await import("./relay/receiver");
      return runWsProviderStream({
        data,
        // Narrowed by the mode check above - the branch needs the relay fields.
        executionContext: data.executionContext,
        locale,
        logger,
        user,
        request,
        t: aiStreamT,
      });
    }

    // ================================================================
    // Remote host: resolve routing to find a remote target.
    // Priority: per-stream loopInstanceId → thread's loop_instance_id column →
    // creation-time REMOTE/<x> stamp → inference-provider fallback. Placement
    // never routes. Delegates via the ws-provider/stream protocol.
    //
    // NEVER for receiver loops (relayReceiver): the executor IS the loop
    // location — its copy carries loop_instance_id NULL by construction.
    // ================================================================
    if (!relayReceiver) {
      const relayResult = await runRelayBranch({
        data,
        locale,
        logger,
        user,
        userId,
        leadId,
        ipAddress,
        headless: awaitResult,
        aiStreamT,
        subAgentDepth,
      });
      if (relayResult !== null) {
        return relayResult;
      }
    }

    // ================================================================
    // Auto-queue: if the thread is already streaming, save the user
    // message with isQueued metadata and return immediately - no AI
    // stream, no credits, no tools. The queue processor will pick
    // this up after the current stream ends. (Server-side detection.)
    // ================================================================
    const queueResult = await runAutoQueueBranch({
      data,
      user,
      userId,
      logger,
    });
    if (queueResult !== null) {
      return queueResult;
    }

    // Resolve relay context once for this stream — skips per-event DB queries
    // on originInstanceId + activeConnections throughout the entire stream.
    const resolvedRelayContext: ResolvedRelayContext | undefined = userId
      ? await RemoteEventBridgeRepository.resolveRemoteEventContext(userId)
      : undefined;

    const setupResult = await setupAiStream({
      data,
      locale,
      logger,
      user,
      userId,
      leadId,
      ipAddress,
      aiStreamT,
      maxDuration: AiStreamRepository.maxDuration,
      request,
      headless: awaitResult,
      subAgentDepth,
      isRevival,
      relayReceiver,
      originInstanceId,
      syncEligible,
      suppressSelfIdentity,
      relayCallerInstanceId,
      extraInstructions,
      excludeMemories,
      favoriteIdOverride,
      mediaModelOverrides,
      toolsOverride,
      parentAbortSignal,
      parentThreadId,
      resolvedRelayContext,
    });

    if (!setupResult.success) {
      logger.error("[AiStream] Setup failed", {
        errorType: setupResult.errorType?.errorCode,
        message: setupResult.message,
        threadId: data.threadId,
      });
      await emitSetupError({ setupResult, data, user, logger });
      return setupResult;
    }

    const {
      isIncognito,
      effectiveParentMessageId,
      effectiveContent,
      effectiveRole,
      threadId: threadResultThreadId,
      isNewThread,
      userMessageId,
      aiMessageId,
      userMessageCreatedAt,
      messages,
      systemPrompt,
      trailingSystemMessage: initialTrailingSystemMessage,
      toolConfirmationResults,
      voiceMode,
      voiceTranscription,
      userMessageMetadata,
      fileUploadPromise,
      modelConfig,
      tools,
      toolsConfig,
      activeToolNames,
      provider,
      streamAbortController,
      cancelStreamControlSub,
      effectiveCompactTrigger,
      toolExecutionContext,
      skipAiTurn,
      bridgeContext,
      systemPromptParams,
    } = setupResult.data;
    let trailingSystemMessage = initialTrailingSystemMessage;

    // Relay-injected confirmation gates: the relay target (ws-provider) carries
    // the caller's favorite/skill confirmation requirements here because the
    // remote loop has no favorite of its own. Merge into whatever stream-setup
    // resolved so the execute-tool gate fires on the remote for these tools.
    if (
      confirmationOverridesOverride &&
      confirmationOverridesOverride.length > 0
    ) {
      const existing = toolExecutionContext.confirmationOverrides ?? [];
      const merged = [...existing];
      for (const o of confirmationOverridesOverride) {
        if (!merged.some((e) => e.toolId === o.toolId)) {
          merged.push(o);
        }
      }
      toolExecutionContext.confirmationOverrides = merged;
    }

    // All confirmations were wakeUp-pending OR a confirmed execute-tool (queue WAIT) already
    // created a remote task - no AI turn needed here.
    // wakeUp-pending: resume-stream will handle revival when each goroutine completes.
    // queue WAIT: handleTaskCompletion fires the revival after the remote task finishes.
    if (skipAiTurn) {
      const isWaitPending =
        toolExecutionContext.waitingForRemoteResult === true;
      logger.debug(
        isWaitPending
          ? "[AiStream] Confirmed execute-tool (queue WAIT) created remote task - skipping AI turn, waiting for revival"
          : "[AiStream] All confirmations wakeUp-pending - skipping AI turn, revival handles it",
        { threadId: data.threadId },
      );
      if (isWaitPending && threadResultThreadId) {
        // Set thread → waiting so the UI shows the stop button and blocks new messages.
        // clearStreamingState is called by handleTaskCompletion when the revival fires.
        await setStreamingStateWaiting(threadResultThreadId, logger, user);
      }
      if (awaitResult) {
        return {
          success: true,
          data: {
            threadId: threadResultThreadId,
            lastAiMessageId: aiMessageId,
            lastAiMessageContent: null,
            lastGeneratedMediaUrl: null,
            totalCreditsDeducted: 0,
            pinnedToolCount: 0,
          },
        } satisfies ResponseType<HeadlessAiStreamResult>;
      }
      return {
        success: true,
        data: {
          success: true,
          messageId: aiMessageId,
          responseThreadId: threadResultThreadId,
        },
      } satisfies ResponseType<AiStreamPostResponseOutput>;
    }

    // Captured refs so headless path can read lastAiMessageId + content after runStream completes
    let capturedLastAiMessageId: string = aiMessageId;
    let capturedLastAiMessageContent: string | null = null;
    let capturedLastGeneratedMediaUrl: string | null = null;
    let capturedTotalCreditsDeducted = 0;
    const capturedPinnedToolCount = tools ? Object.keys(tools).length : 0;
    // Set to true when prepareStep injects a queued message mid-stream.
    // Used by the interactive finally block to skip processNextQueuedMessage.
    let capturedQueueInjected = false;
    // Captured wakeUp payloads - queue written by the signal handler, processed in finally for deferred insertion + revival.
    // Array supports parallel wakeUp tools: each completion pushes its payload; all are processed sequentially.
    const capturedWakeUpPayloads: WakeUpPayload[] = [];

    // Create emitter on the messages channel - events are owned by messages endpoint.
    const wsEmit: MessagesWsEmit = createMessagesEmitter(logger, user, {
      threadId: threadResultThreadId,
      rootFolderId: data.rootFolderId,
      resolvedRelayContext,
    });
    const emitTitle = (threadId: string, title: string): void => {
      createThreadsGetEmitter(logger, user, {
        rootFolderId: data.rootFolderId,
        subFolderId: null,
        resolvedRelayContext,
      })("thread-title-updated", {
        responseData: {
          threads: [{ id: threadId, title }],
        },
      });
      if (data.rootFolderId) {
        createFolderContentsEmitter(logger, user, data.rootFolderId, {
          subFolderId: data.subFolderId ?? undefined,
          resolvedRelayContext,
        })("thread-title-updated", {
          responseData: {
            items: [{ id: threadId, title }],
          },
        });
      }
    };

    // Emit thread-created so other tabs/clients can render the new thread in
    // the sidebar immediately (the optimistic update only exists in the
    // creating client). NEVER for relay-receiver loops (foreign-copy landing).
    if (isNewThread && !isIncognito && !relayReceiver) {
      AiStreamRepository.emitThreadCreated({
        threadId: threadResultThreadId,
        title: chatScopedTranslation.scopedT(locale).t("common.newChat"),
        rootFolderId: data.rootFolderId,
        subFolderId: data.subFolderId ?? null,
        logger,
        user,
        resolvedRelayContext,
      });
    }

    // Step 9: Start AI streaming (for all operations including answer-as-ai)
    try {
      const runStream = async (): Promise<void> => {
        const streamAvailability = await getInstanceAvailability();

        // Phase-2 confirmation parent: with parallel tools the confirmed
        // message is not necessarily the branch tip (a sibling tool that ran
        // without confirmation chains after it) — walk to the actual leaf so
        // the AI response never branches the chain.
        const lastConfirmed =
          toolConfirmationResults[toolConfirmationResults.length - 1];
        const confirmationParentLeafId =
          lastConfirmed && !isIncognito
            ? await walkToLeafMessage(
                threadResultThreadId,
                lastConfirmed.messageId,
                lastConfirmed.messageId,
              )
            : undefined;

        // Initialize stream context, TTS handler, and emit tool confirmations.
        // User MESSAGE_CREATED is emitted below, after the compacting check.
        const { ctx, ttsHandler, emittedToolResultIds } =
          StreamStartHandler.initializeStream({
            userMessageId,
            aiMessageId,
            effectiveParentMessageId,
            toolConfirmationResults,
            voiceMode,
            fileUploadPromise,
            isNewThread,
            isIncognito,
            threadId: threadResultThreadId,
            messages,
            locale,
            user,
            logger,
            wsEmit,
            emitTitle,
            sequenceIdOverride,
            availability: streamAvailability,
            toolExecutionContext: toolExecutionContext,
            streamRunId: toolExecutionContext.streamRunId,
            confirmationParentLeafId,
          });

        // Tear down the stream-control pub/sub subscription when the stream ends
        // (normal completion). A cancel signal auto-settles the subscription; this
        // covers the no-cancel path so the bus handler is never left dangling.
        ctx.onCleanup(cancelStreamControlSub);

        // Wire toolExecutionContext.pendingToolMessages into ToolExecutionContext so
        // tools-loader can inject the correct currentToolMessageId per toolCallId
        // before calling each tool's execute() - parallel-safe, no polling needed.
        toolExecutionContext.pendingToolMessages = ctx.pendingToolMessages;
        // Same-step provider toolCallId collisions (see duplicateToolCallKeys
        // on toolExecutionContext) - tools-loader's execute() wrapper needs these to
        // resolve which pendingToolMessages entry it corresponds to.
        toolExecutionContext.duplicateToolCallKeys = ctx.duplicateToolCallKeys;
        toolExecutionContext.executeClaimCount = ctx.executeClaimCount;
        // toolsOverride closures (relay receiver) hold their OWN pre-stream
        // context — wire the live map onto it too, or wakeUp/detach dispatches
        // from those tools never resolve a tool message id and lose their park
        // anchor (pendingCallId) + revival registration.
        if (toolsContext) {
          toolsContext.pendingToolMessages = ctx.pendingToolMessages;
          toolsContext.duplicateToolCallKeys = ctx.duplicateToolCallKeys;
          toolsContext.executeClaimCount = ctx.executeClaimCount;
          // The park/revival anchors also need the live thread identity —
          // registerPendingCall stores threadId for wakeUp revival and the
          // completion handler schedules resume-stream against it. A null
          // threadId silently skips the resume-stream scheduling.
          toolsContext.threadId = toolExecutionContext.threadId;
          // Confirmation gating: applyConfirmationGate skips pure-headless
          // contexts (headless && !relayReceiver) and reads the caller's
          // confirmationOverrides — without these the receiver executes
          // requiresConfirmation tools WITHOUT approval.
          toolsContext.relayReceiver = toolExecutionContext.relayReceiver;
          toolsContext.confirmationOverrides =
            toolExecutionContext.confirmationOverrides;
          // MUTABLE coordination state must be SHARED, not copied: tools set
          // flags mid-stream (await-task → waitingForRemoteResult +
          // pendingTimeoutMs, confirmation gate → stepHasToolsAwaitingConfirmation,
          // wakeUp suppression → suppressedWakeUpToolMessageIds) and the LOOP
          // reads them from ITS toolExecutionContext (stop conditions, park logic) —
          // and vice versa (currentToolMessageId/leafMessageId are written by
          // the loop and read by tools). A one-way field copy silently drops
          // every flag set after this point (observed: relay-receiver
          // await-task set waitingForRemoteResult on the tools context, the
          // loop never paused, the model re-polled forever). Accessor-bridge
          // them so the tools context is a live view onto the loop's
          // stream context.
          const bridgeField = <
            K extends
              | "waitingForRemoteResult"
              | "pendingTimeoutMs"
              | "stepHasToolsAwaitingConfirmation"
              | "suppressedWakeUpToolMessageIds"
              | "callerCallbackMode"
              | "currentToolMessageId"
              | "aiMessageId"
              | "leafMessageId",
          >(
            field: K,
          ): void => {
            Object.defineProperty(toolsContext, field, {
              configurable: true,
              enumerable: true,
              get: (): (typeof toolExecutionContext)[K] =>
                toolExecutionContext[field],
              set: (value: (typeof toolExecutionContext)[K]): void => {
                toolExecutionContext[field] = value;
              },
            });
          };
          bridgeField("waitingForRemoteResult");
          bridgeField("pendingTimeoutMs");
          bridgeField("stepHasToolsAwaitingConfirmation");
          bridgeField("suppressedWakeUpToolMessageIds");
          bridgeField("callerCallbackMode");
          bridgeField("currentToolMessageId");
          bridgeField("aiMessageId");
          bridgeField("leafMessageId");
        }

        // Wire emitPartialToolResult so long-running tools (e.g. ai-run) can
        // stream intermediate state (like a sub-thread ID) before completion.
        toolExecutionContext.emitPartialToolResult = async (
          partialResult,
        ): Promise<void> => {
          const toolMessageId = toolExecutionContext.currentToolMessageId;
          if (!toolMessageId) {
            return;
          }
          // Look up the pending tool data by messageId (callerToolCallId may not be
          // set for the default inline execution path in tools-loader).
          let pendingToolCall:
            | { toolCallData: { toolCall: ToolCall } }
            | undefined;
          for (const entry of ctx.pendingToolMessages.values()) {
            if (entry.messageId === toolMessageId) {
              pendingToolCall = entry;
              break;
            }
          }
          if (!pendingToolCall) {
            return;
          }
          const partialToolCall = {
            ...pendingToolCall.toolCallData.toolCall,
            result: partialResult,
            isPartial: true,
          };
          await ctx.dbWriter.emitPartialToolResult({
            toolMessageId,
            toolCall: partialToolCall,
          });
        };

        // Wire stop-signal into Agent SDK provider so it can abort its internal loop
        // when endLoop / approve / wakeUp flags are set. The Agent SDK doesn't emit
        // finish-step between turns, so this callback replaces the finish-step abort.

        // Subscribe to wake-up signal so resume-stream can hand a completed
        // wakeUp result to this LIVE stream. prepareStep drains the pending
        // injections: the deferred message is written at the live chain tip
        // and the result is injected into the in-flight context as the next
        // step (spec: "stream still running → result injected into current
        // turn"). Payloads that arrive after the final step stay undrained
        // and fall through to the post-stream revival batch below.
        const unsubscribeWakeUp = subscribeWakeUpSignal(
          threadResultThreadId,
          (payload) => {
            logger.debug(
              "[WakeUp] Signal received - queued for live-stream injection",
              {
                threadId: threadResultThreadId,
                toolMessageId: payload.toolMessageId,
              },
            );
            capturedWakeUpPayloads.push(payload);
            ctx.pendingWakeUpInjections.push(payload);
          },
        );
        ctx.onCleanup(unsubscribeWakeUp);

        try {
          // Check if compacting is needed (fetches branch messages from DB/storage).
          // Revival streams (wakeUp/wait acknowledgment) never compact: they are short
          // one-line responses confirming async task results. Compacting before "your
          // image is ready" is wasteful. The next user-initiated turn compacts if needed.
          const compactingCheck = await shouldTriggerCompacting({
            threadId: threadResultThreadId,
            currentUserMessageId: userMessageId,
            currentUserContent: effectiveContent,
            currentUserRole: effectiveRole,
            currentUserMetadata: userMessageMetadata,
            userId,
            parentMessageId: effectiveParentMessageId,
            isIncognito,
            messageHistory: data.messageHistory ?? undefined,
            systemPrompt,
            tools,
            modelConfig,
            timezone: data.timezone,
            rootFolderId: data.rootFolderId,
            locale,
            logger,
            compactTrigger: isRevival
              ? Number.MAX_SAFE_INTEGER
              : effectiveCompactTrigger,
            toolExecutionContext: toolExecutionContext,
          });

          logger.debug("[Compacting] Check result", {
            shouldCompact: compactingCheck.shouldCompact,
            totalTokens: compactingCheck.totalTokens,
            messagesToCompactCount: compactingCheck.messagesToCompact.length,
            lastCompactingMessage: compactingCheck.lastCompactingMessage?.id,
          });
          // Store estimated input tokens from compacting check so streaming token
          // pushes include promptTokens without recalculating.
          ctx.estimatedInputTokens = compactingCheck.totalTokens;

          // Emit USER MESSAGE_CREATED AFTER the compacting check so ordering is always correct:
          // - Non-compacting: user message emitted here with original parentId
          // - Compacting: CompactingHandler emits it with parentId = compactingMessageId
          // NEVER for confirmation turns: no user-message ROW is created for
          // them (createUserMessageWithAttachments skips) — emitting one materializes an
          // empty phantom user leaf on every mirror.
          if (
            userMessageId &&
            data.operation !== "answer-as-ai" &&
            toolConfirmationResults.length === 0 &&
            !compactingCheck.shouldCompact
          ) {
            InitialEventsHandler.emitUserMessage({
              userMessageId,
              threadId: threadResultThreadId,
              operation: data.operation,
              effectiveParentMessageId,
              effectiveContent,
              model: data.model,
              skill: data.skill,
              user,
              dbWriter: ctx.dbWriter,
              logger,
              isNewThread,
              voiceTranscription,
              userMessageMetadata,
            });
          }

          if (compactingCheck.shouldCompact) {
            logger.debug("[Compacting] Starting compacting operation", {
              isRetry: !!compactingCheck.failedCompactingMessage,
              failedCompactingMessageId:
                compactingCheck.failedCompactingMessage?.id ?? null,
            });

            // Determine parent for the new compacting message.
            // Normal: compacting sits directly below effectiveParentMessageId.
            // Retry: failed compacting already occupies that slot - new compacting is a sibling,
            //        so use the same parentId as the failed one.
            const compactingParentId = compactingCheck.failedCompactingMessage
              ? (compactingCheck.failedCompactingMessage.parentId ?? null)
              : effectiveParentMessageId || null;

            // Pre-gap-fill the branch messages so the compacting LLM gets text variants
            // for any images/audio that the compacting model can't handle natively.
            let preFilledHistoryMessages:
              | Parameters<
                  (typeof CompactingHandler)["executeCompacting"]
                >["0"]["preFilledHistoryMessages"]
              | undefined;
            {
              try {
                const { toAiSdkMessages } = await import("./context/convert");
                const preConvertedHistory = await toAiSdkMessages(
                  compactingCheck.branchMessages,
                  logger,
                  data.timezone,
                  data.rootFolderId,
                  undefined,
                  undefined,
                  toolExecutionContext,
                );
                const gapFilledForCompacting = await GapFillExecutor.runGapFill(
                  {
                    messages: preConvertedHistory,
                    chatHistory: compactingCheck.branchMessages,
                    activeModel: modelConfig,
                    bridgeContext,
                    dbWriter: ctx.dbWriter,
                    abortSignal: streamAbortController.signal,
                    isIncognito,
                    logger,
                    user,
                    locale,
                    toolExecutionContext: toolExecutionContext,
                  },
                );
                preFilledHistoryMessages = gapFilledForCompacting as Parameters<
                  (typeof CompactingHandler)["executeCompacting"]
                >["0"]["preFilledHistoryMessages"];
              } catch (gapErr) {
                // Non-fatal: compacting continues without pre-filled variants
                logger.warn(
                  "[Compacting] Pre-compacting gap fill failed, proceeding without variants",
                  {
                    error:
                      gapErr instanceof Error ? gapErr.message : String(gapErr),
                  },
                );
              }
            }

            // Compacting gets its own sequenceId so it appears as a
            // separate, independently-deletable message group in the UI.
            const compactingSequenceId = crypto.randomUUID();
            // Use timestamp from just before user message insert, minus 1ms.
            // Compacting re-parents the user message (compacting → user), so
            // compacting.createdAt must be strictly less than user.createdAt.
            const compactingMessageCreatedAt = new Date(
              userMessageCreatedAt.getTime() - 1,
            );
            const compactingResult = await CompactingHandler.executeCompacting({
              messagesToCompact: compactingCheck.messagesToCompact,
              branchMessages: compactingCheck.branchMessages,
              currentUserMessage: compactingCheck.currentUserMessage,
              threadId: threadResultThreadId,
              parentId: compactingParentId,
              sequenceId: compactingSequenceId,
              ctx,
              isIncognito,
              userId,
              user,
              model: data.model,
              skill: data.skill,
              providerModel: provider.chat(modelConfig.providerModel),
              abortSignal: streamAbortController.signal,
              logger,
              timezone: data.timezone,
              rootFolderId: data.rootFolderId,
              compactingMessageCreatedAt,
              preFilledHistoryMessages,
              t: aiStreamT,
              toolExecutionContext: toolExecutionContext,
            });

            // Check if compacting failed
            if (!compactingResult.success) {
              logger.error("[AI Stream] Compacting failed, stopping stream", {
                compactingMessageId: compactingResult.compactingMessageId,
                threadId: threadResultThreadId,
                model: data.model,
              });

              // STOP - don't continue with broken state
              ctx.cleanup();
              return;
            }

            // Refresh cortex context after compaction. The search reads this
            // thread's stored message embeddings (written at write time) — no
            // query is built or embedded here.
            try {
              const refreshedPrompt = await buildSystemPrompt({
                ...systemPromptParams,
                voiceTranscription: null,
              });
              trailingSystemMessage = refreshedPrompt.trailingSystemMessage;
              logger.debug(
                "[Compacting] Refreshed cortex context for rebuilt history",
              );
            } catch (refreshError) {
              // Non-fatal: use original trailing message if refresh fails
              logger.warn(
                "[Compacting] Cortex refresh failed, using original context",
                {
                  error:
                    refreshError instanceof Error
                      ? refreshError.message
                      : String(refreshError),
                },
              );
            }

            // Rebuild message history with compacted version
            const rebuiltHistory = await rebuildWithCompactedHistory({
              compactedSummary: compactingResult.compactedSummary,
              compactingMessageId: compactingResult.compactingMessageId,
              currentUserMessage: compactingCheck.currentUserMessage,
              threadId: threadResultThreadId,
              isIncognito,
              messageHistory: data.messageHistory ?? undefined,
              logger,
              upcomingAssistantMessageId: aiMessageId,
              upcomingAssistantMessageCreatedAt: new Date(),
              model: data.model,
              skill: data.skill,
              timezone: data.timezone,
              rootFolderId: data.rootFolderId,
              trailingSystemMessage,
              locale,
              toolExecutionContext: toolExecutionContext,
            });

            // Check if rebuilding failed
            if (!rebuiltHistory) {
              const error = new Error(
                "rebuildWithCompactedHistory returned null",
              );
              logger.error(
                "[AI Stream] Failed to rebuild history after compacting",
                error,
              );

              // Emit error event to frontend (noop in headless)
              ctx.dbWriter.emitError(
                fail({
                  message: aiStreamT("errors.compactingRebuildFailed"),
                  errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
                }),
                ctx.lastParentId,
              );

              // STOP - don't continue with broken state
              ctx.cleanup();
              return;
            }

            // Update messages array for main stream
            messages.length = 0;
            messages.push(...rebuiltHistory);

            // Update ctx so the AI response has the correct parent.
            // Chain: effectiveParent → compacting → user → AI
            ctx.currentParentId =
              userMessageId ?? compactingResult.compactingMessageId;

            logger.debug("[Compacting] Updated messages for main stream", {
              messageCount: messages.length,
              compactingMessageId: compactingResult.compactingMessageId,
              contextParentId: ctx.currentParentId,
            });
          }

          // Hard-truncate safety net: drop oldest non-system messages if we are
          // still over the model's context window (e.g. compacting wasn't enough,
          // or a single message is enormous).
          const truncated = truncateToContextWindow(
            messages,
            compactingCheck.modelContextWindow,
            logger,
            systemPrompt,
            tools,
          );
          if (truncated.length !== messages.length) {
            messages.length = 0;
            messages.push(...truncated);
          }

          // Mark thread as streaming before gap-fill so the UI shows activity
          // during potentially long vision/STT bridge calls.
          if (threadResultThreadId) {
            ctx.dbWriter.emitStreamingStateChanged({
              threadId: threadResultThreadId,
              state: ThreadStreamingState.STREAMING,
            });
          }

          // Gap-fill: replace unsupported attachment parts with text variants
          // via vision bridge / STT.
          {
            const chatHistory = [
              ...compactingCheck.branchMessages,
              ...(compactingCheck.currentUserMessage
                ? [compactingCheck.currentUserMessage]
                : []),
            ];
            const gapFilledMessages = await GapFillExecutor.runGapFill({
              messages,
              chatHistory,
              currentUserMessageId: userMessageId ?? null,
              activeModel: modelConfig,
              bridgeContext,
              dbWriter: ctx.dbWriter,
              abortSignal: streamAbortController.signal,
              isIncognito,
              logger,
              user,
              locale,
              toolExecutionContext: toolExecutionContext,
            });
            messages.length = 0;
            messages.push(...gapFilledMessages);
          }

          logger.debug("[AI Stream] Starting StreamLoop", {
            messageCount: messages.length,
            hasTools: !!tools,
            modelId: data.model,
          });

          await new StreamLoop({
            provider,
            modelConfig,
            messages,
            streamAbortController,
            systemPrompt,
            trailingSystemMessage,
            tools,
            toolsConfig,
            activeToolNames,
            ctx,
            threadId: threadResultThreadId,
            model: data.model,
            skill: data.skill,
            isIncognito,
            userId,
            emittedToolResultIds,
            ttsHandler,
            user,
            locale,
            logger,
            t: aiStreamT,
            toolExecutionContext,
            maxToolCalls,
            imageSize: data.imageSize ?? undefined,
            imageQuality: data.imageQuality ?? undefined,
            musicDuration: data.musicDuration ?? undefined,
            systemPromptParams,
            midStreamCompactingThreshold: tools ? effectiveCompactTrigger : 0,
            midStreamCompactingParams: {
              model: data.model,
              skill: data.skill,
              threadId: threadResultThreadId,
              isIncognito,
              userId,
              user,
              providerModel: provider.chat(modelConfig.providerModel),
              t: aiStreamT,
            },
          }).run();

          // After stream completes, capture the last assistant message ID from the writer.
          // In a tool loop there can be multiple assistant messages; lastAssistantMessageId
          // on the writer is updated on every write so it always holds the final one.
          capturedQueueInjected = ctx.queueInjectedInStream;
          if (ctx.dbWriter.lastAssistantMessageId) {
            capturedLastAiMessageId = ctx.dbWriter.lastAssistantMessageId;
            capturedLastAiMessageContent = ctx.dbWriter.lastAssistantContent;
            capturedLastGeneratedMediaUrl = ctx.dbWriter.lastGeneratedMediaUrl;
            capturedTotalCreditsDeducted = ctx.dbWriter.totalCreditsDeducted;
          } else if (awaitResult) {
            // No assistant message was written - the stream errored before the
            // first emit. The pre-generated aiMessageId never reached the DB,
            // and callers chain follow-up messages off lastAiMessageId - a
            // phantom id would force the parent-not-committed fallback on the
            // next message. Resolve to the thread's newest committed message.
            const lastCommitted =
              await findLatestThreadMessage(threadResultThreadId);
            if (lastCommitted) {
              capturedLastAiMessageId = lastCommitted.id;
            }
            logger.warn(
              "[AI Stream] Headless stream completed with no assistant message written - " +
                "lastAiMessageId resolved to the thread's newest committed message",
              {
                aiMessageId,
                resolvedLastAiMessageId: lastCommitted?.id ?? null,
                threadId: threadResultThreadId,
              },
            );
          }
        } catch (error) {
          // Cancel TTS to avoid wasting API calls + credits after error/disconnect
          if (ttsHandler) {
            ttsHandler.cancel();
          }

          if (streamAbortController.signal.aborted) {
            // AbortErrorHandler should have already run in StreamExecutionHandler.
            // Log and continue - the finally block will emit STREAM_FINISHED.
            logger.debug(
              "[AI Stream] Post-abort error in outer catch (abort already handled)",
              {
                abortHandled: ctx.abortHandled,
                error: error instanceof Error ? error.message : String(error),
              },
            );
          } else {
            await StreamErrorCatchHandler.handleError({
              error: error as Error | JSONValue,
              ctx,
              maxDuration: AiStreamRepository.maxDuration,
              model: data.model,
              threadId: threadResultThreadId,
              user,
              logger,
              t: aiStreamT,
            });
          }
        }
      };

      // ─── Shared post-stream finalization (headless AND interactive) ───────
      // Order matters: cancel the pending timer → clearStreamingState (must run
      // BEFORE stream-finished so a streaming-state-changed:waiting reaches
      // clients first) → stream-finished fan-out → wakeUp revival batch (the
      // dead-stream fallback for payloads prepareStep didn't inject) → queue
      // processing. Queue draining runs for EVERY turn regardless of how it was
      // invoked — processNextQueuedMessage is a no-op when nothing is queued, so
      // a message queued against an ai-run/revival thread is never dropped.
      const finalizeStream = async (): Promise<void> => {
        // Cancel any pending stream timeout timer (e.g. wakeUp mode where AI
        // writes a "task fired" response and the loop ends naturally before the
        // 90s escalation timeout fires). Without this, the timer would fire
        // after the stream has already ended and interfere with the revival.
        toolExecutionContext.cancelPendingStreamTimer?.();

        // Skip wakeUp revival ONLY if the stream was genuinely CANCELLED (user
        // stop / error) — NOT for an intentional wakeUp/wait PARK abort
        // (REMOTE_TOOL_WAIT / LOOP_STOP / TOOL_CONFIRMATION / STREAM_TIMEOUT).
        // A fast-completing wakeUp goroutine (e.g. cortex-write, ~3ms) settles
        // while the dispatching stream is still parking; its result queues into
        // pendingWakeUpInjections but the parking stream never runs another
        // prepareStep to drain it inline, so this post-stream batch is the ONLY
        // path that revives it. Treating the park-abort as "aborted" here skipped
        // the batch → the wakeUp phase-2 revival never fired (120s test timeout).
        // Filter out payloads intercepted by await-task or already delivered
        // inline by the prepareStep injection (both mark suppressed).
        const abortReason = streamAbortController.signal.aborted
          ? streamAbortController.signal.reason
          : null;
        const abortReasonName =
          abortReason &&
          typeof abortReason === "object" &&
          "reason" in abortReason &&
          typeof abortReason.reason === "string"
            ? abortReason.reason
            : null;
        // Park-aborts are the loop's own "stop this turn, revival continues"
        // signals — never a cancellation. Anything else aborted (user cancel,
        // unexpected error) suppresses the revival as before.
        const isParkAbort =
          abortReasonName === AbortReason.REMOTE_TOOL_WAIT ||
          abortReasonName === AbortReason.LOOP_STOP ||
          abortReasonName === AbortReason.TOOL_CONFIRMATION ||
          abortReasonName === AbortReason.STREAM_TIMEOUT;
        const wasAborted = streamAbortController.signal.aborted && !isParkAbort;
        const suppressed = toolExecutionContext.suppressedWakeUpToolMessageIds;
        const pendingWakeUps = suppressed
          ? capturedWakeUpPayloads.filter(
              (p) => !suppressed.has(p.toolMessageId),
            )
          : capturedWakeUpPayloads;

        const clearResult = await clearStreamingState(
          threadResultThreadId,
          logger,
          user,
          toolExecutionContext.streamRunId,
        );
        // Emit STREAM_FINISHED with finalState so the client knows whether to
        // show the stop button (waiting) or go idle after the stream ends.
        // Superseded = a newer stream owns the claim; it emits its own events.
        if (!clearResult.superseded) {
          await emitStreamFinished({
            threadId: threadResultThreadId,
            state: clearResult.state,
            updatedAt: clearResult.updatedAt,
            rootFolderId: data.rootFolderId,
            logger,
            user,
            resolvedRelayContext,
          });
        }

        // wakeUp revival: insert deferred (single stream = no race) then revive.
        // Superseded claim = a newer stream is live on this thread — inserting
        // a deferred at its moving leaf or starting a queued turn now would
        // recreate the concurrent-stream race; the owner handles its own queue.
        if (pendingWakeUps.length > 0 && clearResult.superseded) {
          logger.warn(
            "[WakeUp] Skipping revival batch - streaming claim superseded by a newer stream",
            {
              threadId: threadResultThreadId,
              pendingWakeUps: pendingWakeUps.length,
            },
          );
        } else if (pendingWakeUps.length > 0 && !wasAborted) {
          await handleWakeUpRevivalBatch({
            payloads: pendingWakeUps,
            threadId: threadResultThreadId,
            rootFolderId: data.rootFolderId,
            subAgentDepth,
            user,
            locale,
            logger,
            aiStreamT,
            abortSignal: streamAbortController.signal,
          });
        } else if (pendingWakeUps.length > 0) {
          logger.debug("[WakeUp] Skipping revival - stream was aborted", {
            threadId: threadResultThreadId,
            pendingWakeUps: pendingWakeUps.length,
          });
        }

        // On abort/cancel: clear the in-memory queue so orphaned QueueRegistry
        // entries don't leak. The DB messages remain (isQueued=true) and will
        // be picked up by processNextQueuedMessage on the next stream attempt.
        if (wasAborted) {
          QueueRegistry.clear(threadResultThreadId);
        }

        // Queue processing: if the stream completed naturally, check for
        // queued messages. Skip if prepareStep already injected one
        // mid-stream (a new stream would double-process it), or if a newer
        // stream superseded this one's claim (the owner drains the queue).
        if (!wasAborted && !capturedQueueInjected && !clearResult.superseded) {
          const { processNextQueuedMessage } = await import("./intake/queue");
          await processNextQueuedMessage(
            threadResultThreadId,
            logger,
            user,
            locale,
            aiStreamT,
            data.rootFolderId,
            subAgentDepth,
          ).catch((err: Error) => {
            logger.error("[Queue] Failed to process queued message", {
              error: err.message,
              cause: err.cause instanceof Error ? err.cause.message : undefined,
              threadId: threadResultThreadId,
            });
          });
        }
      };

      if (awaitResult) {
        // Headless path: await the full loop AND finalization — the caller
        // (relay receiver, cron, ai-run) treats the return as "thread settled".
        try {
          await runStream();
        } finally {
          await finalizeStream();
        }

        logger.debug("[AI Stream] Headless execution complete", {
          threadId: threadResultThreadId,
          lastAiMessageId: capturedLastAiMessageId,
        });

        return {
          success: true,
          data: {
            threadId: threadResultThreadId,
            lastAiMessageId: capturedLastAiMessageId,
            lastAiMessageContent: capturedLastAiMessageContent,
            lastGeneratedMediaUrl: capturedLastGeneratedMediaUrl,
            totalCreditsDeducted: capturedTotalCreditsDeducted,
            pinnedToolCount: capturedPinnedToolCount,
          },
        } satisfies ResponseType<HeadlessAiStreamResult>;
      }

      // Interactive path: fire-and-forget - stream runs independently of HTTP
      // connection. Events flow via WebSocket; the POST returns immediately
      // with threadId. The finally guarantees finalization even on crashes.
      void runStream()
        .catch((error) => {
          const msg = error instanceof Error ? error.message : String(error);
          logger.error("[AI Stream] Background stream failed", {
            error: msg,
            threadId: threadResultThreadId,
          });
        })
        .finally(() => {
          void finalizeStream().catch(async (err) => {
            logger.error("[AI Stream] Stream finalization failed", {
              error: err instanceof Error ? err.message : String(err),
              threadId: threadResultThreadId,
            });
            // Still emit STREAM_FINISHED so the client doesn't stay stuck in
            // streaming/aborting state if the DB update failed.
            await emitStreamFinished({
              threadId: threadResultThreadId,
              state: ThreadStreamingState.IDLE,
              updatedAt: new Date(),
              rootFolderId: data.rootFolderId,
              logger,
              user,
            });
          });
        });

      logger.debug("[AI Stream] Interactive stream started (fire-and-forget)", {
        threadId: threadResultThreadId,
        messageId: aiMessageId,
      });

      return {
        success: true,
        data: {
          success: true,
          messageId: aiMessageId,
          responseThreadId: threadResultThreadId,
        },
      } satisfies ResponseType<AiStreamPostResponseOutput>;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error("Failed to create AI stream", {
        error: errorMessage,
        model: data.model,
      });

      // Safety net: clear streaming state if threadId is available
      if (threadResultThreadId) {
        await clearStreamingState(
          threadResultThreadId,
          logger,
          user,
          toolExecutionContext.streamRunId,
        ).catch((err) => {
          logger.error(
            "[AI Stream] Failed to clear streaming state in outer catch",
            {
              error: err instanceof Error ? err.message : String(err),
              threadId: threadResultThreadId,
            },
          );
        });
      }

      // Emit error to thread so the user always sees what went wrong.
      // Chain as child of the last written message so it never creates a sibling branch.
      const errorThreadId = threadResultThreadId ?? data.threadId;
      // Chain error as child of the last message written during the stream
      // (assistant/tool/user). Falls back to data.parentMessageId if the stream
      // never wrote anything.
      const errorParentId =
        capturedLastAiMessageId !== aiMessageId
          ? capturedLastAiMessageId
          : data.parentMessageId || null;
      await emitStreamCreationError({
        errorThreadId,
        errorParentId,
        data,
        user,
        userId,
        isIncognito,
        aiStreamT,
        logger,
      });

      return fail({
        message: aiStreamT("route.errors.streamCreationFailed"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
  }
}
