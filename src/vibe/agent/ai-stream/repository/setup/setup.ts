/**
 * AI Stream Setup
 * Handles validation, credit checks, and preparation before streaming
 */

import "server-only";

import type { ModelMessage } from "ai";
import { and, eq, sql } from "drizzle-orm";
import { getEnvAvailability } from "../../../env-availability";
import {
  getBestImageGenModel,
  type ImageGenModelSelection,
} from "../../../image-generation/models";
import { ApiProvider } from "../../../models/models";
import {
  getBestMusicGenModel,
  type MusicGenModelSelection,
} from "../../../music-generation/models";
import type { VoiceModelSelection } from "../../../text-to-speech/models";
import {
  getBestVideoGenModel,
  type VideoGenModelSelection,
} from "../../../video-generation/models";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { CoreTool } from "next-vibe/platforms/ai/tools-loader";
import { Platform } from "next-vibe/platforms/platforms";
import type { ResolvedRelayContext } from "next-vibe/realtime/core/relay-context";
import type { NextRequest } from "next-vibe/ui/lib/request";

import {
  DefaultFolderId,
  makeHeadlessContext,
  type ToolExecutionContext,
} from "../../../../core/execution-context";
import { type ToolCall } from "../../../chat/db";
import type { ChatMessageRole } from "../../../chat/enum";
import { ThreadStreamingState } from "../../../chat/enum";
import { chatSettings } from "../../../chat/settings/db";
import { isSkillVariantId, isUuid, parseSkillId } from "../../../chat/slugify";
import { ThreadsRepository } from "../../../chat/threads/repository";
import { DEFAULT_SKILLS } from "../../../skills/config";
import {
  chatFavorites,
  FAVORITE_CONFIG_COLUMNS,
  type FavoriteConfig,
} from "../../../skills/favorites/db";
import { buildFavoriteConfig } from "../../../skills/favorites/repository";
import { resolveAgentContext } from "../../../skills/resolve-context";
import { resolveSkillFavoriteContext } from "../../../skills/resolver";
import { type ChatModelOption } from "../../models";
import { type AiStreamPostRequestOutput } from "../../stream/definition";
import type { AiStreamT } from "../../stream/i18n";
import {
  buildSystemPrompt,
  type SystemPromptParams,
} from "../../system-prompt/builder";
import { buildMessageContext } from "../context/history";
import {
  AbortReason,
  COMPACT_TRIGGER,
  COMPACT_TRIGGER_PERCENTAGE,
  isStreamAbort,
  StreamAbortError,
} from "../core/constants";
import { wireEscalateToTask } from "../core/escalation-handler";
import { ProviderFactory as ProviderFactoryClass } from "../core/infra";
import {
  type BridgeContext,
  ModalityResolver,
} from "../core/modality-resolver";
import { AbortControllerSetup } from "../core/stream";
import { StreamControl } from "../core/stream-control";
import { transitionStreamingState } from "../core/streaming-state";
import { ToolsSetupHandler } from "../core/tools-setup-handler";
import {
  createUserMessageWithAttachments,
  processOperation,
} from "../intake/messages";
import { runConfirmationsPhase } from "./confirmations-phase";
import { runModelCreditPhase } from "./model-credit-phase";

/**
 * Load the active favorite ONCE per stream setup.
 * Priority: 1) client-provided favoriteConfig, 2) DB lookup via activeFavoriteId, 3) null.
 * Returns a FavoriteConfig that all downstream resolution blocks can use.
 */
async function loadFavoriteOnce(
  userId: string | undefined,
  clientFavoriteConfig: FavoriteConfig | null | undefined,
  favoriteIdOverride: string | undefined,
  logger: EndpointLogger,
): Promise<FavoriteConfig | null> {
  // 1. Client-provided config takes precedence (public users, or pre-loaded by client)
  if (clientFavoriteConfig) {
    logger.debug("[Setup] Using client-provided favoriteConfig", {
      favoriteId: clientFavoriteConfig.id,
      skillId: clientFavoriteConfig.skillId,
    });
    return clientFavoriteConfig;
  }

  // 2. For authenticated users, load from DB
  if (userId) {
    // favoriteIdOverride (from headless callers) takes precedence over settings
    let effectiveFavoriteId = favoriteIdOverride;
    if (!effectiveFavoriteId) {
      const [settingsRow] = await db
        .select({ activeFavoriteId: chatSettings.activeFavoriteId })
        .from(chatSettings)
        .where(eq(chatSettings.userId, userId))
        .limit(1);
      effectiveFavoriteId = settingsRow?.activeFavoriteId ?? undefined;
    }

    if (effectiveFavoriteId) {
      const favIdCondition = isUuid(effectiveFavoriteId)
        ? eq(chatFavorites.id, effectiveFavoriteId)
        : isSkillVariantId(effectiveFavoriteId)
          ? ((): ReturnType<typeof and> => {
              const { skillId, variantId } = parseSkillId(effectiveFavoriteId);
              return and(
                eq(chatFavorites.skillId, skillId),
                variantId !== null
                  ? eq(chatFavorites.variantId, variantId)
                  : sql`${chatFavorites.variantId} IS NULL`,
              );
            })()
          : eq(chatFavorites.slug, effectiveFavoriteId);
      const [favRow] = await db
        .select(FAVORITE_CONFIG_COLUMNS)
        .from(chatFavorites)
        .where(and(favIdCondition, eq(chatFavorites.userId, userId)))
        .limit(1);

      if (favRow) {
        logger.debug("[Setup] Loaded favorite from DB", {
          favoriteId: favRow.id,
          skillId: favRow.skillId,
        });
        return favRow;
      }

      logger.debug("[Setup] Favorite not found in DB", {
        effectiveFavoriteId,
        userId,
      });
    }

    logger.debug("[Setup] No activeFavoriteId set for authenticated user", {
      userId,
    });
  }

  // 3. No favorite available - downstream cascade resolves skill → system defaults
  return null;
}

/**
 * Resolve the effective compact trigger via cascade: favorite → skill (default
 * then custom) → global default. Always capped at
 * min(configured, floor(contextWindow * COMPACT_TRIGGER_PERCENTAGE)).
 */
function resolveEffectiveCompactTrigger(params: {
  modelConfig: ChatModelOption;
  favorite: { compactTrigger?: number | null } | null;
  customSkill: { compactTrigger?: number | null } | null;
  skill: string | undefined;
}): number {
  const { modelConfig, favorite, customSkill, skill } = params;
  const cap = Math.floor(
    modelConfig.contextWindow * COMPACT_TRIGGER_PERCENTAGE,
  );

  // 1. Favorite compactTrigger
  if (
    favorite?.compactTrigger !== null &&
    favorite?.compactTrigger !== undefined
  ) {
    return Math.min(favorite.compactTrigger, cap);
  }

  // 2. Skill compactTrigger (default skills first, then the prefetched custom skill)
  if (skill) {
    const defaultSkill = DEFAULT_SKILLS.find((c) => c.id === skill);
    if (
      defaultSkill?.compactTrigger !== null &&
      defaultSkill?.compactTrigger !== undefined
    ) {
      return Math.min(defaultSkill.compactTrigger, cap);
    }
    if (
      customSkill?.compactTrigger !== null &&
      customSkill?.compactTrigger !== undefined
    ) {
      return Math.min(customSkill.compactTrigger, cap);
    }
  }

  // 3. Global constant (also capped)
  return Math.min(COMPACT_TRIGGER, cap);
}

/**
 * Resolve bridge model selections via cascade: skill variant → favorite → system default.
 * Returns TTS/media-gen selections plus the models resolved once for system-prompt
 * mediaCapabilities (name display only). Media-gen client overrides win when present.
 */
function resolveBridgeModelSelections(params: {
  bridgeContext: BridgeContext;
  mediaModelOverrides:
    | {
        musicGenModelSelection?: MusicGenModelSelection;
        videoGenModelSelection?: VideoGenModelSelection;
        imageGenModelSelection?: ImageGenModelSelection;
      }
    | undefined;
  user: JwtPayloadType;
  availability: Awaited<ReturnType<typeof getEnvAvailability>>;
  logger: EndpointLogger;
}): {
  resolvedTtsSelection: VoiceModelSelection;
  effectiveImageGenModel: ReturnType<typeof getBestImageGenModel>;
  effectiveMusicGenModel: ReturnType<typeof getBestMusicGenModel>;
  effectiveVideoGenModel: ReturnType<typeof getBestVideoGenModel>;
  effectiveImageGenSelection: ImageGenModelSelection;
  effectiveMusicGenSelection: MusicGenModelSelection;
  effectiveVideoGenSelection: VideoGenModelSelection;
} {
  const { bridgeContext, mediaModelOverrides, user, availability, logger } =
    params;

  // Resolve TTS selection via cascade (favorite → skill → default). The voice
  // is never client-supplied — it lives in the active favorite/skill.
  const resolvedTtsSelection =
    ModalityResolver.resolveTtsSelection(bridgeContext);

  // Resolve media gen selections via cascade - actual models resolved at tool execution time
  const effectiveImageGenSelection: ImageGenModelSelection =
    mediaModelOverrides?.imageGenModelSelection ??
    ModalityResolver.resolveImageGenSelection(bridgeContext);
  const effectiveMusicGenSelection: MusicGenModelSelection =
    mediaModelOverrides?.musicGenModelSelection ??
    ModalityResolver.resolveMusicGenSelection(bridgeContext);
  const effectiveVideoGenSelection: VideoGenModelSelection =
    mediaModelOverrides?.videoGenModelSelection ??
    ModalityResolver.resolveVideoGenSelection(bridgeContext);

  // Resolve models once for system-prompt mediaCapabilities (name display only).
  const effectiveImageGenModel = getBestImageGenModel(
    effectiveImageGenSelection,
    user,
    availability,
  );
  const effectiveMusicGenModel = getBestMusicGenModel(
    effectiveMusicGenSelection,
    user,
    availability,
  );
  const effectiveVideoGenModel = getBestVideoGenModel(
    effectiveVideoGenSelection,
    user,
    availability,
  );

  logger.debug("[Setup] Bridge models resolved via cascade", {
    ttsSelectionType: resolvedTtsSelection.selectionType,
    sttModelId:
      ModalityResolver.resolveSttModel(bridgeContext, user, availability)?.id ??
      null,
    imageVisionModelId:
      ModalityResolver.resolveImageVisionModel(
        bridgeContext,
        user,
        availability,
      )?.id ?? null,
    imageGenModelId: effectiveImageGenModel?.id ?? null,
    musicGenModelId: effectiveMusicGenModel?.id ?? null,
    videoGenModelId: effectiveVideoGenModel?.id ?? null,
  });

  return {
    resolvedTtsSelection,
    effectiveImageGenModel,
    effectiveMusicGenModel,
    effectiveVideoGenModel,
    effectiveImageGenSelection,
    effectiveMusicGenSelection,
    effectiveVideoGenSelection,
  };
}

/**
 * For a REMOTE-folder thread running its loop locally: fetch the remote's
 * complete system prompt (remote identity + tool catalog) cross-instance and
 * use it verbatim, so the thread behaves AS IF used on the remote regardless of
 * where the loop runs. Returns the local prompt unchanged when this is not a
 * remote-folder local loop. Fails loudly (no silent local fallback) when the
 * remote prompt can't be fetched — running with the local identity would
 * silently produce wrong behavior.
 */
async function resolveRemoteFolderPrompt(params: {
  data: AiStreamPostRequestOutput;
  isIncognito: boolean;
  userId: string | undefined;
  relayReceiver: boolean | undefined;
  effectiveContent: string;
  localPrompt: string;
  user: JwtPayloadType;
  locale: CountryLanguage;
  logger: EndpointLogger;
  aiStreamT: AiStreamT;
}): Promise<ResponseType<string>> {
  const {
    data,
    isIncognito,
    userId,
    relayReceiver,
    effectiveContent,
    localPrompt,
    user,
    locale,
    logger,
    aiStreamT,
  } = params;

  if (
    !(
      data.rootFolderId === DefaultFolderId.REMOTE &&
      !relayReceiver &&
      !isIncognito &&
      userId &&
      data.subFolderId
    )
  ) {
    return { success: true, data: localPrompt };
  }

  const { ThreadsRepository: ThreadsRepoForLoop } =
    await import("../../../chat/threads/repository");
  // Pure placement walk — the loop-routing variant returns null for
  // loopLocation:'caller' connections, which is EXACTLY the local-loop case
  // that needs the remote prompt.
  const remoteFolderInstance =
    await ThreadsRepoForLoop.deriveFolderRootInstanceName(data.subFolderId);
  if (!remoteFolderInstance) {
    return { success: true, data: localPrompt };
  }

  const { RouteExecuteRepository } =
    await import("next-vibe/execute-tool/repository");
  const promptDef = (await import("../../system-prompt/debug/definition"))
    .default;
  const remotePromptResult = await RouteExecuteRepository.runInProcessTyped({
    definition: promptDef.GET,
    instanceId: remoteFolderInstance,
    user,
    locale,
    logger,
    platform: Platform.AI,
    input: {
      skillId: data.skill ?? undefined,
      rootFolderId: DefaultFolderId.PRIVATE,
      userMessage: effectiveContent.slice(0, 800),
    },
  });
  const remotePrompt = remotePromptResult.success
    ? remotePromptResult.data?.["systemPrompt"]
    : undefined;
  if (typeof remotePrompt === "string" && remotePrompt.length > 0) {
    logger.debug("[Setup] Remote-folder local loop: remote prompt", {
      remoteFolderInstance,
      promptLength: remotePrompt.length,
    });
    return { success: true, data: remotePrompt };
  }

  logger.error("[Setup] Remote-folder local loop: remote prompt fetch failed", {
    remoteFolderInstance,
  });
  return fail({
    message: aiStreamT("post.errors.serviceUnavailable.title"),
    errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
  });
}

export interface HeadlessAiStreamResult {
  /** ID of the last assistant message - read content from DB using this */
  lastAiMessageId: string;
  /** Thread ID - undefined when threadMode is "none" */
  threadId?: string;
  /** Final text content - populated in memory even for incognito (no DB read needed) */
  lastAiMessageContent: string | null;
  /** URL of the last generated media (image/audio/video) - set when native file parts are emitted */
  lastGeneratedMediaUrl?: string | null;
  /** Total credits deducted during this stream (model + tools) - for cost display in callers */
  totalCreditsDeducted?: number;
  /**
   * Number of tool schemas loaded into the AI context window for this stream.
   * 0 = no tools. Used in tests to assert skill/favorite tool configuration.
   */
  pinnedToolCount: number;
}

export interface StreamSetupResult {
  userId: string | undefined;
  leadId: string | undefined;
  effectiveLeadId: string | undefined;
  isIncognito: boolean;
  modelCost: number;
  effectiveThreadId: string | null | undefined;
  effectiveParentMessageId: string | null | undefined;
  effectiveContent: string;
  effectiveRole: ChatMessageRole;
  threadId: string;
  isNewThread: boolean;
  userMessageId: string | null;
  aiMessageId: string;
  aiMessageCreatedAt: Date;
  userMessageCreatedAt: Date;
  messages: ModelMessage[];
  systemPrompt: string;
  trailingSystemMessage: string;
  toolConfirmationResults: Array<{
    messageId: string;
    sequenceId: string;
    toolCall: ToolCall;
  }>;
  /** Voice mode settings for TTS streaming - carries the resolved selection, not a bare ID */
  voiceMode?: {
    enabled: boolean;
    voiceModelSelection: VoiceModelSelection;
  } | null;
  /** Voice transcription metadata (when audioInput was provided) */
  voiceTranscription?: {
    /** Whether audio was transcribed */
    wasTranscribed: boolean;
    /** Confidence score from STT */
    confidence: number | null;
    /** Audio duration in seconds */
    durationSeconds: number | null;
    /** Credit cost for STT transcription */
    creditCost?: number | null;
  } | null;
  /** User message metadata (including attachments) to include in MESSAGE_CREATED event */
  userMessageMetadata?: {
    attachments?: Array<{
      id: string;
      url: string;
      filename: string;
      mimeType: string;
      size: number;
      data?: string; // base64 for incognito
    }>;
  };
  /** File upload promise (server threads only) - resolves when files finish uploading */
  fileUploadPromise?: Promise<{
    success: boolean;
    userMessageId: string;
    attachments?: Array<{
      id: string;
      url: string;
      filename: string;
      mimeType: string;
      size: number;
    }>;
  }>;
  /** Model configuration */
  modelConfig: ChatModelOption;
  /** AI SDK tools configuration */
  tools: Record<string, CoreTool> | undefined;
  /** Tools metadata for confirmation checks */
  toolsConfig: Map<
    string,
    { requiresConfirmation?: boolean; credits: number; label: string }
  >;
  /** Set of tool names the model is allowed to execute (permission layer). null = all allowed. */
  activeToolNames: Set<string> | null;
  /** Effective compact trigger token threshold (cascade: favorite → skill → global) */
  effectiveCompactTrigger: number;
  /** Provider for AI streaming */
  provider: ReturnType<typeof ProviderFactoryClass.getProviderForModel>;
  /** Abort controller for stream timeout and cancellation */
  streamAbortController: AbortController;
  /** Tear down the stream-control pub/sub subscription — called on cleanup. */
  cancelStreamControlSub: () => void;
  /** Rich context for tool executions - rootFolderId, threadId, aiMessageId, etc. */
  toolExecutionContext: ToolExecutionContext;
  /**
   * When true, all tool confirmations were wakeUp-pending (goroutines still running).
   * The AI turn should be skipped - resume-stream will handle revival for each task.
   */
  skipAiTurn?: boolean;
  /** Resolved bridge models for STT, TTS, vision, and translation */
  bridgeContext: BridgeContext;
  /** Params used to build the system prompt - stored for compacting refresh */
  systemPromptParams: SystemPromptParams;
  // resolvedFavoriteConfig lives inside toolExecutionContext.resolvedFavoriteConfig
  // - no top-level duplicate needed.
}

export async function setupAiStream(params: {
  data: AiStreamPostRequestOutput;
  locale: CountryLanguage;
  logger: EndpointLogger;
  user: JwtPayloadType;
  userId: string | undefined;
  leadId: string;
  ipAddress: string | undefined;
  aiStreamT: AiStreamT;
  maxDuration: number;
  request: NextRequest | undefined;
  extraInstructions: string | undefined;
  excludeMemories: boolean | undefined;
  headless: boolean | undefined;
  subAgentDepth: number;
  /** Whether this is a revival stream (resume-stream after wakeUp task completed). */
  isRevival: boolean | undefined;
  /** ws-provider RECEIVER loop (relay/inference-provider) — confirmation gates apply despite headless. */
  relayReceiver?: boolean;
  /** FOREIGN copy: the owning instance (relay executor landing). Stamped on the thread at creation. */
  originInstanceId?: string;
  /** Transient plumbing thread (tool executions): excluded from thread sync. */
  syncEligible?: boolean;
  /** Model-pipe relay receiver: suppress this instance's own identity in the system prompt. */
  suppressSelfIdentity?: boolean;
  /** Relay receiver: caller instance that owns this thread — rename round-trips to it. */
  relayCallerInstanceId?: string;
  /** Override the favoriteId stored in toolExecutionContext (used by headless runs with explicit favoriteId) */
  favoriteIdOverride: string | undefined;
  /** Override resolved media gen model selections - used by integration tests to force a specific model */
  mediaModelOverrides?: {
    musicGenModelSelection?: MusicGenModelSelection;
    videoGenModelSelection?: VideoGenModelSelection;
    imageGenModelSelection?: ImageGenModelSelection;
  };
  /** Override tools entirely - used by API provider for client-provided tools only */
  toolsOverride?: Record<string, CoreTool>;
  /**
   * Parent stream's abort signal. When set, this sub-stream aborts when the parent does.
   * Used for headless sub-streams (ai-run) so parent cancellation propagates.
   */
  parentAbortSignal?: AbortSignal;
  /** Spawning thread when this is a sub-stream/sub-agent child (persisted on the row). */
  parentThreadId?: string;
  resolvedRelayContext?: ResolvedRelayContext;
}): Promise<ResponseType<StreamSetupResult>> {
  const {
    data,
    locale,
    logger,
    user,
    userId,
    leadId,
    ipAddress,
    aiStreamT,
    mediaModelOverrides,
    resolvedRelayContext,
  } = params;
  const availability = await getEnvAvailability();
  const isIncognito = data.rootFolderId === "incognito";

  // The fixture chain is keyed by threadId (dedicated `fixtures` table, written
  // by the harness on every instance). Early phases (tool confirmations, STT
  // transcription) run before the rich stream context is built, so they bind
  // their external calls to this thread-anchored context; the rich context
  // built below carries the same threadId.
  const threadFixtureContext = makeHeadlessContext(
    undefined,
    data.threadId,
    data.timezone,
  );

  // File upload promise for server threads (captured for SSE event emission)
  let fileUploadPromise:
    | Promise<{
        success: boolean;
        userMessageId: string;
        attachments?: Array<{
          id: string;
          url: string;
          filename: string;
          mimeType: string;
          size: number;
        }>;
      }>
    | undefined;

  logger.debug("[Setup] Setting up AI stream", {
    operation: data.operation,
    model: data.model,
    rootFolderId: data.rootFolderId,
    isIncognito,
    userId,
    leadId,
    hasToolConfirmations:
      !!data.toolConfirmations && data.toolConfirmations.length > 0,
    toolConfirmationCount: data.toolConfirmations?.length ?? 0,
  });

  // Create abort controller early so signal is available for confirmations and toolExecutionContext
  const streamAbortController = AbortControllerSetup.setupAbortController({
    maxDuration: params.maxDuration,
    parentSignal: params.parentAbortSignal,
  });

  // ── Load favorite ONCE for all downstream resolution
  const resolvedFavoriteConfig = await loadFavoriteOnce(
    userId,
    data.favoriteConfig
      ? buildFavoriteConfig({
          ...data.favoriteConfig,
          ...parseSkillId(data.favoriteConfig.skillId),
        })
      : data.favoriteConfig,
    params.favoriteIdOverride,
    logger,
  );

  // Handle tool confirmations if present - execute tools and update messages.
  const confirmationsResult = await runConfirmationsPhase({
    data,
    isIncognito,
    locale,
    logger,
    user,
    aiStreamT,
    abortSignal: streamAbortController.signal,
    favoriteIdOverride: params.favoriteIdOverride,
    headless: params.headless,
    subAgentDepth: params.subAgentDepth,
    isRevival: params.isRevival,
    // Thread anchor not loaded yet at this phase — the thread id is the
    // only explicit carrier here.
    toolExecutionContext: threadFixtureContext,
    resolvedRelayContext,
  });
  if (!confirmationsResult.success) {
    return confirmationsResult;
  }
  const { toolConfirmationResults, confirmationSetWaitingForRemote } =
    confirmationsResult.data;

  const modelCreditResult = await runModelCreditPhase({
    data,
    user,
    userId,
    leadId,
    ipAddress,
    isIncognito,
    locale,
    logger,
    aiStreamT,
  });
  if (!modelCreditResult.success) {
    return modelCreditResult;
  }
  const { modelConfig, effectiveLeadId, modelCost } = modelCreditResult.data;

  // Process operation and handle audio transcription
  const operationResult = await processOperation({
    operation: data.operation,
    data,
    user,
    locale,
    logger,
    sttModelSelection: resolvedFavoriteConfig?.sttModelSelection ?? null,
    toolExecutionContext: threadFixtureContext,
  });

  if (!operationResult.success) {
    return operationResult;
  }

  const {
    threadId: effectiveThreadId,
    parentMessageId: requestedParentMessageId,
    content: effectiveContent,
    role: effectiveRole,
    voiceTranscription,
  } = operationResult.data;
  // Reassigned below to the parent the user-message row ACTUALLY received —
  // createUserMessage falls back to the last committed message when the
  // requested parent was never committed (interrupted stream, bogus client
  // id). Every downstream consumer (event emits, compacting placement, ctx)
  // must see the RESOLVED value or mirrors rebuild a different chain.
  let effectiveParentMessageId = requestedParentMessageId;

  const threadResult = await ThreadsRepository.ensureThread({
    threadId: effectiveThreadId,
    rootFolderId: data.rootFolderId,
    subFolderId: data.subFolderId,
    userId,
    leadId,
    isIncognito,
    logger,
    user,
    locale,
    originInstanceId: params.originInstanceId ?? null,
    // A foreign copy (relay executor landing) NEVER re-routes its loop — the
    // loop is exactly here, so the column must stay NULL or a later revival
    // (wakeUp/auto-queue re-entry) would read the folder-derived instance and
    // relay itself away. Locally-pinned loops get NULL from the creation
    // stamp itself (the connection's loopLocation setting).
    ...(params.originInstanceId ? { loopInstanceId: null } : {}),
    syncEligible: params.syncEligible ?? true,
    parentThreadId: params.parentThreadId ?? null,
  });

  if (!threadResult.success) {
    logger.error("Failed to ensure thread", { message: threadResult.message });
    if (threadResult.errorType === ErrorResponseTypes.FORBIDDEN) {
      return fail({
        message: aiStreamT("post.errors.forbidden.title"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }
    return fail({
      message: aiStreamT("post.errors.notFound.title"),
      errorType: ErrorResponseTypes.NOT_FOUND,
    });
  }

  // Check if we have tool confirmations (don't need userMessageId in this case)
  const hasToolConfirmations = !!(
    data.toolConfirmations && data.toolConfirmations.length > 0
  );

  // Require userMessageId for all operations except answer-as-ai, wakeup-resume, and tool confirmations
  if (
    !data.userMessageId &&
    data.operation !== "answer-as-ai" &&
    data.operation !== "wakeup-resume" &&
    !hasToolConfirmations
  ) {
    // A missing userMessageId here almost always means an internal caller
    // (revival / headless) failed to derive its operation — the intake phase
    // rewrites "send" → "wakeup-resume"/"answer-as-ai" and must run first.
    // Log the full context so that regression is diagnosable at a glance
    // instead of surfacing as an opaque "Invalid JSON in request body".
    logger.error("User message ID must be provided by client", {
      userMessageId: data.userMessageId,
      operation: data.operation,
      isRevival: params.isRevival,
      headless: params.headless,
      threadId: data.threadId,
    });
    return fail({
      message: aiStreamT("route.errors.invalidJson"),
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }

  // For "answer-as-ai" and "wakeup-resume", we don't create a user message
  // The AI message uses parentMessageId as its parent
  const userMessageId =
    data.operation === "answer-as-ai" || data.operation === "wakeup-resume"
      ? null
      : data.userMessageId;

  // Capture timestamp before user message insert so compacting message can be
  // assigned a timestamp strictly earlier (compacting re-parents user message,
  // so its createdAt must be < user message's createdAt to preserve chain order)
  const userMessageCreatedAt = new Date();

  // Create user message with attachments (if applicable)
  const userMessageResult = await createUserMessageWithAttachments({
    userMessageId,
    operation: data.operation,
    hasToolConfirmations,
    isIncognito,
    threadId: threadResult.data.threadId,
    rootFolderId: data.rootFolderId,
    effectiveRole,
    effectiveContent,
    effectiveParentMessageId,
    userId,
    user,
    attachments: data.attachments ?? undefined,
    logger,
    t: aiStreamT,
    // Embed the user message at write time (row lands with its search vector).
    toolExecutionContext: threadFixtureContext,
  });

  if (!userMessageResult.success) {
    return userMessageResult;
  }

  if (userMessageResult.data.resolvedParentMessageId !== undefined) {
    effectiveParentMessageId = userMessageResult.data.resolvedParentMessageId;
  }

  // Capture file upload promise and attachment metadata from handler
  if (userMessageResult.data.fileUploadPromise) {
    fileUploadPromise = userMessageResult.data.fileUploadPromise;
  }

  // The user message's embed was FIRED at write time; the cortex search awaits
  // this so it sees the fresh vector — overlapped with the resolution work below.
  const messageEmbedReady =
    userMessageResult.data.userEmbedPromise ?? Promise.resolve();

  // Use attachment metadata from user message handler
  const userMessageMetadata = userMessageResult.data.attachmentMetadata
    ? { attachments: userMessageResult.data.attachmentMetadata }
    : undefined;

  // ONE skill/favorite context resolution (skills domain) for the three
  // cascade resolutions below (compact trigger, tool config, bridge models).
  // The favorite was already loaded ONCE above and is passed through so it is
  // never re-queried; custom skills cost exactly ONE customSkills query.
  const skillFavoriteContext = await resolveSkillFavoriteContext({
    favoriteId: params.favoriteIdOverride ?? null,
    skillId: data.skill,
    userId,
    favorite: resolvedFavoriteConfig,
  });
  const customSkillConfig = skillFavoriteContext.customSkill;

  // Resolve effective compact trigger: favorite → skill → global default
  // Always capped at min(configured, floor(contextWindow * COMPACT_TRIGGER_PERCENTAGE))
  const effectiveCompactTrigger = resolveEffectiveCompactTrigger({
    modelConfig,
    favorite: resolvedFavoriteConfig,
    customSkill: customSkillConfig,
    skill: data.skill,
  });

  logger.debug("[Setup] Effective compact trigger resolved", {
    effectiveCompactTrigger,
    skill: data.skill,
    userId,
  });

  // Resolve the tool cascade via THE central resolver (favorite → skill →
  // NO_SKILL/role defaults). Reuses skillFavoriteContext so nothing is
  // re-queried. Folder denies are already folded in by the resolver.
  const resolvedToolConfig = await resolveAgentContext({
    skillId: data.skill,
    favoriteConfig: resolvedFavoriteConfig,
    skillFavoriteContext,
    user,
    rootFolderId: data.rootFolderId,
    logger,
  });

  // Resolve bridge models via cascade: skill variant → favorite → system default.
  // Skill comes from the shared skills-domain resolver (variant-aware, resolved
  // once above); FavoriteConfig is structurally compatible with BridgeFavorite.
  const bridgeContext: BridgeContext = {
    skill: skillFavoriteContext.skill,
    favorite: resolvedFavoriteConfig ?? null,
  };

  const {
    resolvedTtsSelection,
    effectiveImageGenModel,
    effectiveMusicGenModel,
    effectiveVideoGenModel,
    effectiveImageGenSelection,
    effectiveMusicGenSelection,
    effectiveVideoGenSelection,
  } = resolveBridgeModelSelections({
    bridgeContext,
    mediaModelOverrides,
    user,
    availability,
    logger,
  });

  // Build complete system prompt from skill and formatting instructions.
  // Cortex vector search reads this thread's STORED message embeddings (written
  // at message-write time) — no query string is built or embedded here.
  const systemPromptParams: SystemPromptParams = {
    // The thread id flows separately as the fixture anchor now.
    toolExecutionContext: threadFixtureContext,
    // Cortex search awaits this so it sees the just-written user message's vector.
    messageEmbedReady,
    skillId: data.skill,
    user,
    logger,
    locale,
    rootFolderId: data.rootFolderId,
    subFolderId: data.subFolderId ?? null,
    callMode: data.voiceMode?.enabled,
    extraInstructions:
      [params.extraInstructions, resolvedToolConfig.promptAppend]
        .filter(Boolean)
        .join("\n\n") || undefined,
    headless: params.headless,
    suppressSelfIdentity: params.suppressSelfIdentity,
    relayCallerInstanceId: params.relayCallerInstanceId ?? null,
    subAgentDepth: params.subAgentDepth,
    excludeMemories: params.excludeMemories,
    memoryLimit: resolvedToolConfig.memoryLimit,
    mediaCapabilities: {
      nativeOutputs: modelConfig.outputs ?? [],
      imageGenModelName: effectiveImageGenModel?.name ?? null,
      musicGenModelName: effectiveMusicGenModel?.name ?? null,
      videoGenModelName: effectiveVideoGenModel?.name ?? null,
      imageGenIsSameAsChatModel:
        !!effectiveImageGenModel && modelConfig.outputs.includes("image"),
      musicGenIsSameAsChatModel:
        !!effectiveMusicGenModel && modelConfig.outputs.includes("audio"),
      videoGenIsSameAsChatModel:
        !!effectiveVideoGenModel && modelConfig.outputs.includes("video"),
      videoGenCapabilities: effectiveVideoGenModel
        ? {
            supportedDurations: effectiveVideoGenModel.supportedDurations,
            supportedAspectRatios: effectiveVideoGenModel.supportedAspectRatios,
            supportedResolutions: effectiveVideoGenModel.supportedResolutions,
            supportedFrameImages: effectiveVideoGenModel.supportedFrameImages,
            allowedPassthroughParameters:
              effectiveVideoGenModel.allowedPassthroughParameters,
          }
        : null,
    },
    threadId: threadResult.data.threadId,
    // Incognito threads have no DB row - the client sends the current
    // title/description so the rename prompt fragment can read them.
    incognitoThreadTitle: isIncognito
      ? (data.incognitoThreadTitle ?? null)
      : null,
    incognitoThreadDescription: isIncognito
      ? (data.incognitoThreadDescription ?? null)
      : null,
    voiceTranscription: voiceTranscription
      ? {
          wasTranscribed: voiceTranscription.wasTranscribed,
          confidence: voiceTranscription.confidence,
        }
      : null,
  };
  // eslint-disable-next-line prefer-const -- builtSystemPrompt is overridden for remote-folder local loops
  let { systemPrompt: builtSystemPrompt, trailingSystemMessage } =
    await buildSystemPrompt(systemPromptParams);

  // ── REMOTE-FOLDER thread running its loop LOCALLY ──────────────────────────
  // A REMOTE-rooted stream that reaches setup IS a local loop: it must behave
  // AS IF used on the remote, so the system prompt comes from the REMOTE.
  const remotePromptResult = await resolveRemoteFolderPrompt({
    data,
    isIncognito,
    userId,
    relayReceiver: params.relayReceiver,
    effectiveContent,
    localPrompt: builtSystemPrompt,
    user,
    locale,
    logger,
    aiStreamT,
  });
  if (!remotePromptResult.success) {
    return remotePromptResult;
  }
  builtSystemPrompt = remotePromptResult.data;

  logger.debug("System prompt built", {
    systemPromptLength: builtSystemPrompt.length,
    hasSkill: !!data.skill,
  });

  // Generate AI message ID and timestamp BEFORE building context
  // CRITICAL: Use same timestamp for metadata AND database to ensure cache stability
  const aiMessageId = crypto.randomUUID();
  const aiMessageCreatedAt = new Date();

  // Build the rich stream context - passed through to all tool executions
  const toolExecutionContext: ToolExecutionContext = {
    // Ownership token for this stream's 'streaming' claim — only the owner
    // may clear the state later (clearStreamingState guard).
    streamRunId: crypto.randomUUID(),
    rootFolderId: data.rootFolderId,
    threadId: threadResult.data.threadId,
    // Sub-stream lineage in-context: an incognito sub-stream (image-gen) has no
    // DB row, so the fixture engine walks the lineage starting from here.
    parentThreadId: params.parentThreadId,
    // Voice mode on/off rides the context so a revival keeps speaking; the
    // voice itself resolves from the favorite/skill, not from here.
    voiceEnabled: data.voiceMode?.enabled ?? false,
    // From the frontend request; threaded to nested tool calls (incl. ai-run)
    // so they format dates in the user's timezone, never the server's.
    timezone: data.timezone,
    confirmationOverrides: resolvedToolConfig.availableTools ?? null,
    aiMessageId,
    skillId: data.skill,
    headless: params.headless,
    // ws-provider receiver loops mirror a LIVE session on the originator —
    // confirmation gates apply even though the loop runs headless here.
    // params.relayReceiver covers the receiver's inner headless stream (its
    // synthetic data carries mode:"local"); the mode check covers direct
    // non-headless receiver paths.
    relayReceiver:
      params.relayReceiver === true ||
      data.executionContext.mode === "relay" ||
      data.executionContext.mode === "inference-provider" ||
      undefined,
    subAgentDepth: params.subAgentDepth,
    isRevival: params.isRevival,
    // favoriteId: from headless override OR favorite config - lets resume-stream reload full context
    favoriteId:
      params.favoriteIdOverride ?? resolvedFavoriteConfig?.id ?? undefined,
    resolvedMediaSelections: {
      musicGenModelSelection: effectiveMusicGenSelection,
      imageGenModelSelection: effectiveImageGenSelection,
      videoGenModelSelection: effectiveVideoGenSelection,
    },
    currentToolMessageId: undefined,
    callerToolCallId: undefined,
    callerCallbackMode: undefined,
    // pendingToolMessages is wired after toolExecutionContext is created (see index.ts)
    pendingToolMessages: undefined,
    duplicateToolCallKeys: undefined,
    executeClaimCount: undefined,
    pendingTimeoutMs: undefined,
    leafMessageId: undefined,
    // Propagate waitingForRemoteResult from confirmation setup: if a confirmed
    // execute-tool (queue WAIT) already created a remote task, the main stream
    // must also abort immediately without creating an AI response. Otherwise the
    // stream runs an AI turn that creates an assistant message, then the WAIT
    // revival creates a second one - branch violation.
    waitingForRemoteResult: confirmationSetWaitingForRemote ? true : undefined,
    onEscalatedTaskCancel: undefined,
    pendingEscalatedTaskId: undefined,
    cancelPendingStreamTimer: undefined,
    abortSignal: streamAbortController.signal,
    // escalateToTask is wired after streamAbortController is created (below)
    escalateToTask: undefined,
  };

  logger.debug("Generated AI message ID", {
    messageId: aiMessageId,
    createdAt: aiMessageCreatedAt.toISOString(),
    operation: data.operation,
    isIncognito,
  });

  // For tool confirmations: use the confirmed tool message ID as parentMessageId
  // so fetchMessageHistory walks up from the confirmed result (includes it in context).
  // Without this, fetchMessageHistory starts from the assistant message and misses
  // the confirmed tool result (which is a child of the assistant, not an ancestor).
  const effectiveContextParentMessageId =
    hasToolConfirmations && toolConfirmationResults.length > 0
      ? (toolConfirmationResults[toolConfirmationResults.length - 1]
          ?.messageId ?? data.parentMessageId)
      : data.parentMessageId;

  const messages = await buildMessageContext({
    operation: data.operation,
    threadId: effectiveThreadId,
    parentMessageId: effectiveContextParentMessageId,
    locale,
    content: effectiveContent,
    role: effectiveRole,
    userId,
    isIncognito,
    rootFolderId: data.rootFolderId,
    messageHistory: data.messageHistory,
    logger,
    timezone: data.timezone,
    upcomingResponseContext: { model: data.model, skill: data.skill },
    userMessageMetadata,
    hasToolConfirmations,
    toolConfirmationResults,
    userMessageId,
    upcomingAssistantMessageId: aiMessageId,
    upcomingAssistantMessageCreatedAt: aiMessageCreatedAt,
    modelConfig,
    trailingSystemMessage,
    toolExecutionContext: toolExecutionContext,
  });

  // Apply deniedTools filter: strip blocked tools from both visible and active sets.
  // This is a hard block - denied tools cannot be seen or executed regardless of cascade.
  const applyDeniedFilter = <T extends { toolId: string }>(
    tools: T[] | null | undefined,
  ): T[] | null | undefined => {
    if (resolvedToolConfig.deniedToolIds.size === 0 || !tools) {
      return tools;
    }
    return tools.filter((t) => !resolvedToolConfig.deniedToolIds.has(t.toolId));
  };

  // Remove media generation tools when:
  // 1. No model is configured for that modality (tool would fail at runtime)
  // 2. The active chat model IS the configured gen model - native output is better,
  //    the tool would just be a slower detour through the same model.
  //    Note: if a different specialized gen model is configured (e.g. Flux when using Gemini),
  //    the tool stays - the user explicitly picked a different model for generation.
  const filterUnavailableMediaTools = <T extends { toolId: string }>(
    tools: T[] | null | undefined,
  ): T[] | null | undefined => {
    if (!tools) {
      return tools;
    }
    // Extract chatModelId as plain string for cross-enum comparison.
    // ImageGenModelId / MusicGenModelId / VideoGenModelId are separate enums whose
    // LLM-generated values happen to match ChatModelId strings at runtime, but
    // TypeScript treats them as disjoint. Widening to string is the type-safe way.
    const chatModelIdStr: string = data.model;
    return tools.filter((t) => {
      if (t.toolId === "generate_image") {
        if (!effectiveImageGenModel) {
          return false;
        }
        const imageGenIdStr: string = effectiveImageGenModel.id;
        if (imageGenIdStr === chatModelIdStr) {
          return false; // active model IS the image gen model - use native output
        }
      }
      if (t.toolId === "generate_music") {
        if (!effectiveMusicGenModel) {
          return false;
        }
        const musicGenIdStr: string = effectiveMusicGenModel.id;
        if (musicGenIdStr === chatModelIdStr) {
          return false; // active model IS the music gen model - use native output
        }
      }
      if (t.toolId === "generate_video") {
        if (!effectiveVideoGenModel) {
          return false;
        }
        const videoGenIdStr: string = effectiveVideoGenModel.id;
        if (videoGenIdStr === chatModelIdStr) {
          return false; // active model IS the video gen model - use native output
        }
      }
      return true;
    });
  };

  // When toolsOverride is provided (API provider mode), skip server-side tool loading
  // entirely and use only the client-provided tools. This ensures zero server tools
  // leak to API consumers.
  const {
    tools,
    toolsConfig,
    activeToolNames,
    systemPrompt: updatedSystemPrompt,
  } = params.toolsOverride
    ? modelConfig.supportsTools === false
      ? {
          // Toolless models (native image gen) can NEVER receive tool schemas —
          // even relayed overrides. Same gate as setupStreamingTools: sending
          // tools makes the model mimic/attempt tool calls instead of doing
          // its native job. Tool history is flattened to text by the
          // converter; the loop runs a single tool-free turn.
          tools: undefined,
          toolsConfig: new Map<
            string,
            { requiresConfirmation?: boolean; credits: number; label: string }
          >(),
          activeToolNames: null,
          systemPrompt: builtSystemPrompt,
        }
      : {
          tools: params.toolsOverride,
          toolsConfig: new Map<
            string,
            { requiresConfirmation?: boolean; credits: number; label: string }
          >(),
          activeToolNames: new Set<string>(Object.keys(params.toolsOverride)),
          systemPrompt: builtSystemPrompt,
        }
    : await ToolsSetupHandler.setupStreamingTools({
        modelConfig,
        // Tool config cascade: resolvedToolConfig (from favorite/skill) is authoritative.
        // deniedTools are stripped from both sets before reaching the AI SDK.
        pinnedTools: filterUnavailableMediaTools(
          applyDeniedFilter(resolvedToolConfig.pinnedTools),
        ),
        availableTools: filterUnavailableMediaTools(
          applyDeniedFilter(resolvedToolConfig.availableTools),
        ),
        confirmationOverrides: resolvedToolConfig.availableTools,
        rootFolderId: data.rootFolderId,
        user,
        locale,
        logger,
        systemPrompt: builtSystemPrompt,
        toolConfirmationResults,
        toolExecutionContext,
      });

  const provider = ProviderFactoryClass.getProviderForModel(
    modelConfig,
    logger,
    toolExecutionContext,
  );

  // Register tool executors for Agent SDK provider (uses CoreTool execute functions)
  if (
    modelConfig.apiProvider === ApiProvider.CLAUDE_CODE &&
    tools &&
    "toolExecutors" in provider
  ) {
    provider.toolExecutors.registerTools(tools, logger);
  }

  logger.debug("[AI Stream] Starting stream", {
    model: data.model,
    hasTools: !!tools,
    toolCount: tools ? Object.keys(tools).length : 0,
    hasFavoriteConfig: !!data.favoriteConfig,
    favoriteId: data.favoriteConfig?.id ?? null,
    supportsTools: modelConfig?.supportsTools,
  });

  // streamAbortController was created early (before tool confirmations) so the signal
  // is already wired into toolExecutionContext.abortSignal above.

  // Wire escalateToTask into toolExecutionContext — extracted to escalation-handler.ts
  wireEscalateToTask({
    toolExecutionContext,
    user,
    locale,
    logger,
    model: data.model,
  });

  // Supersede any PRIOR stream on this thread: deliver a cancel BEFORE we
  // subscribe, so the old stream (in whatever process runs it) aborts while this
  // new one — not yet subscribed — is unaffected. Replaces the old registry's
  // abort-on-register. The normal path shouldn't hit this (a `send` while
  // streaming is queued, not restarted), but this keeps the safety net.
  if (!isIncognito) {
    StreamControl.deliver(threadResult.data.threadId, "cancel", user, logger);
  }

  // Subscribe to this thread's control channel so a `cancel` delivered on the
  // hub/bridge aborts THIS stream — in whatever process/instance it runs. The
  // AbortController lives in this stream's own closure (no shared registry).
  // Cross-process (and cross-instance with a targetInstanceId). The sub is
  // returned in the setup result so the caller tears it down on cleanup.
  const streamControlSub = StreamControl.subscribe(
    threadResult.data.threadId,
    user,
    logger,
  );
  void streamControlSub.signal.then(() => {
    streamAbortController.abort(
      new StreamAbortError(AbortReason.USER_CANCELLED),
    );
    return undefined;
  });

  // When the user cancels the stream, propagate cancellation to any escalated task.
  // The abort signal fires when the control channel delivers a cancel.
  streamAbortController.signal.addEventListener(
    "abort",
    () => {
      const abortErr = streamAbortController.signal.reason;
      if (
        isStreamAbort(abortErr) &&
        abortErr.reason === AbortReason.USER_CANCELLED &&
        toolExecutionContext.onEscalatedTaskCancel
      ) {
        void toolExecutionContext.onEscalatedTaskCancel();
      }
    },
    { once: true },
  );

  // Mark thread as streaming (for refresh recovery + cross-tab detection) AND
  // fan the transition out on all three client channels so the sidebar shows
  // the spinner immediately — for continuation turns too, where no
  // thread-created event fires. Claim ownership: streamingRunId records WHICH
  // stream execution owns the state, so a stale finalizer from a superseded
  // stream can never clear it.
  if (!isIncognito) {
    await transitionStreamingState({
      threadId: threadResult.data.threadId,
      state: ThreadStreamingState.STREAMING,
      logger,
      user,
      streamingRunId: toolExecutionContext.streamRunId,
      resolvedRelayContext,
    });
  }

  return {
    success: true,
    data: {
      userId,
      leadId,
      effectiveLeadId,
      isIncognito,
      modelCost,
      effectiveThreadId,
      effectiveParentMessageId,
      effectiveContent,
      effectiveRole,
      threadId: threadResult.data.threadId,
      isNewThread: threadResult.data.isNew,
      userMessageId,
      aiMessageId,
      aiMessageCreatedAt,
      userMessageCreatedAt,
      messages,
      systemPrompt: updatedSystemPrompt,
      trailingSystemMessage,
      toolConfirmationResults,
      skipAiTurn:
        ((data.toolConfirmations?.length ?? 0) > 0 &&
          toolConfirmationResults.length === 0) ||
        // If a confirmed execute-tool (queue WAIT) already created a remote task,
        // skip the AI turn entirely. The revival stream triggered by handleTaskCompletion
        // will fire the next AI turn. Without this, the SDK makes an initial API call
        // before stopWhen can fire (stopWhen only prevents SUBSEQUENT steps), creating
        // an AI message that then collides with the revival's AI message → branch violation.
        confirmationSetWaitingForRemote,
      voiceMode: data.voiceMode
        ? {
            enabled: data.voiceMode.enabled ?? false,
            voiceModelSelection: resolvedTtsSelection,
          }
        : null,
      voiceTranscription,
      userMessageMetadata,
      fileUploadPromise,
      modelConfig,
      tools,
      toolsConfig,
      activeToolNames,
      provider,
      streamAbortController,
      cancelStreamControlSub: streamControlSub.cancel,
      effectiveCompactTrigger,
      toolExecutionContext,
      bridgeContext,
      systemPromptParams,
    },
  };
}
/**
 * AI Stream setup — tool-confirmations phase.
 *
 * When the request carries toolConfirmations, execute the confirmed/denied tools
 * and update their messages BEFORE the main stream. Extracted verbatim from
 * setupAiStream. Returns the confirmation results plus whether any confirmed tool
 * set waitingForRemoteResult (queue WAIT mode) — in which case the main stream
 * must abort without creating an AI response. Returns a fail ResponseType the
 * orchestrator returns as-is on confirmation failure.
 */
