/**
 * AI Stream Setup
 * Handles validation, credit checks, and preparation before streaming
 */

import "server-only";

import type { ModelMessage } from "ai";
import { eq } from "drizzle-orm";
import type { NextRequest } from "next-vibe-ui/lib/request";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import {
  getChatModelById,
  getChatModelForProvider,
  type ChatModelOption,
} from "@/app/api/[locale]/agent/ai-stream/models";
import { agentEnv } from "@/app/api/[locale]/agent/env";
import { buildMissingKeyMessage } from "@/app/api/[locale]/agent/env-availability";
import {
  getBestImageGenModel,
  type ImageGenModelSelection,
} from "@/app/api/[locale]/agent/image-generation/models";
import { ApiProvider } from "@/app/api/[locale]/agent/models/models";
import {
  getBestMusicGenModel,
  type MusicGenModelSelection,
} from "@/app/api/[locale]/agent/music-generation/models";
import type { VoiceModelSelection } from "@/app/api/[locale]/agent/text-to-speech/models";
import {
  getBestVideoGenModel,
  type VideoGenModelSelection,
} from "@/app/api/[locale]/agent/video-generation/models";
import { db } from "@/app/api/[locale]/system/db";
import type { CoreTool } from "@/app/api/[locale]/system/unified-interface/ai/tools-loader";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import type { AiStreamT } from "../stream/i18n";

import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import {
  FOLDER_DENIED_TOOL_IDS,
  type ToolExecutionContext,
} from "../../chat/config";
import { chatThreads, type ToolCall } from "../../chat/db";
import type { ChatMessageRole } from "../../chat/enum";
import { chatFavorites } from "../../chat/favorites/db";
import { chatSettings } from "../../chat/settings/db";
import { DEFAULT_SKILLS } from "../../chat/skills/config";
import { customSkills } from "../../chat/skills/db";
import { isUuid } from "../../chat/slugify";
import { createMessagesEmitter } from "../../chat/threads/[threadId]/messages/emitter";
import { ThreadsRepository } from "../../chat/threads/repository";
import { type AiStreamPostRequestOutput } from "../stream/definition";
import { AbortControllerSetup } from "./core/abort-controller-setup";
import { AbortReason, COMPACT_TRIGGER, isStreamAbort } from "./core/constants";
import { CreditValidatorHandler } from "./core/credit-validator-handler";
import { ModalityResolver, type BridgeContext } from "./core/modality-resolver";
import { ProviderFactory as ProviderFactoryClass } from "./core/provider-factory";
import { StreamRegistry } from "./core/stream-registry";
import { ToolsSetupHandler } from "./core/tools-setup-handler";
import { MessageContextBuilder } from "./handlers/message-context-builder";
import { OperationHandler } from "./handlers/operation-handler";
import { ToolConfirmationProcessor } from "./handlers/tool-confirmation-processor";
import { UserMessageHandler } from "./handlers/user-message-handler";
import { buildSystemPrompt } from "./system-prompt/builder";

/** Normalize DB tool config items - ensures requiresConfirmation is always boolean */
function normalizeToolConfig(
  items:
    | Array<{ toolId: string; requiresConfirmation?: boolean | null }>
    | null
    | undefined,
): Array<{ toolId: string; requiresConfirmation: boolean }> | null {
  if (!items) {
    return null;
  }
  return items.map((item) => ({
    toolId: item.toolId,
    requiresConfirmation: item.requiresConfirmation ?? false,
  }));
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
  toolsConfig: Map<string, { requiresConfirmation: boolean; credits: number }>;
  /** Set of tool names the model is allowed to execute (permission layer). null = all allowed. */
  activeToolNames: Set<string> | null;
  /** Effective compact trigger token threshold (cascade: favorite → skill → settings → global) */
  effectiveCompactTrigger: number;
  /** Provider for AI streaming */
  provider: ReturnType<typeof ProviderFactoryClass.getProviderForModel>;
  /** Abort controller for stream timeout and cancellation */
  streamAbortController: AbortController;
  /** Rich context for tool executions - rootFolderId, threadId, aiMessageId, etc. */
  streamContext: ToolExecutionContext;
  /**
   * When true, all tool confirmations were wakeUp-pending (goroutines still running).
   * The AI turn should be skipped - resume-stream will handle revival for each task.
   */
  skipAiTurn?: boolean;
  /** Resolved bridge models for STT, TTS, vision, and translation */
  bridgeContext: BridgeContext;
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
  /** Override the favoriteId stored in streamContext (used by headless runs with explicit favoriteId) */
  favoriteIdOverride: string | undefined;
  /** Override resolved media gen model selections - used by integration tests to force a specific model */
  mediaModelOverrides?: {
    musicGenModelSelection?: MusicGenModelSelection;
    videoGenModelSelection?: VideoGenModelSelection;
    imageGenModelSelection?: ImageGenModelSelection;
  };
  /**
   * Force all model resolution (chat + image/music/video gen) to use a specific API provider.
   * When set, picks the cheapest variant of each resolved model from that provider.
   * Used by UNBOTTLED self-relay tests to route all inference through the UNBOTTLED provider.
   */
  providerOverride?: ApiProvider;
  /** Override tools entirely - used by API provider for client-provided tools only */
  toolsOverride?: Record<string, CoreTool>;
  /**
   * Parent stream's abort signal. When set, this sub-stream aborts when the parent does.
   * Used for headless sub-streams (ai-run) so parent cancellation propagates.
   */
  parentAbortSignal?: AbortSignal;
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
    providerOverride,
  } = params;
  const isIncognito = data.rootFolderId === "incognito";

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

  logger.debug("[Setup] RECOMPILED - Setting up AI stream", {
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

  // Create abort controller early so signal is available for confirmations and streamContext
  const streamAbortController = AbortControllerSetup.setupAbortController({
    maxDuration: params.maxDuration,
    parentSignal: params.parentAbortSignal,
  });

  // Handle tool confirmations if present - execute tools and update messages
  let toolConfirmationResults: Array<{
    messageId: string;
    sequenceId: string;
    toolCall: ToolCall;
  }> = [];

  if (data.toolConfirmations && data.toolConfirmations.length > 0) {
    // Resolve media model selections early for the confirmation context.
    // The full bridge context is built later (after thread/credits), but confirmations
    // need media model selections NOW so tool serverDefaults (e.g. image gen model) resolve correctly.
    const confirmMediaModels = await (async (): Promise<{
      imageGenModelSelection: ImageGenModelSelection | undefined;
      musicGenModelSelection: MusicGenModelSelection | undefined;
      videoGenModelSelection: VideoGenModelSelection | undefined;
    }> => {
      // 1. Explicit overrides (provided by callers such as integration tests)
      if (mediaModelOverrides) {
        return {
          imageGenModelSelection: mediaModelOverrides.imageGenModelSelection,
          musicGenModelSelection: mediaModelOverrides.musicGenModelSelection,
          videoGenModelSelection: mediaModelOverrides.videoGenModelSelection,
        };
      }
      // 2. Resolve from favorite via ModalityResolver cascade
      const effectiveFavoriteId = params.favoriteIdOverride;
      if (effectiveFavoriteId && userId) {
        const [favRow] = await db
          .select()
          .from(chatFavorites)
          .where(
            isUuid(effectiveFavoriteId)
              ? eq(chatFavorites.id, effectiveFavoriteId)
              : eq(chatFavorites.slug, effectiveFavoriteId),
          )
          .limit(1);
        if (favRow) {
          // Include the skill in the mini bridge so skill-level model defaults
          // (e.g. quality-tester.imageGenModelSelection) are respected when the favorite
          // has no explicit model selection.
          const uuidPattern =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          const favSkill = uuidPattern.test(favRow.skillId)
            ? null
            : (DEFAULT_SKILLS.find((c) => c.id === favRow.skillId) ?? null);
          const favVariantId = favRow.variantId ?? null;
          const favActiveVariant = favSkill
            ? ((favVariantId
                ? (favSkill.variants.find((v) => v.id === favVariantId) ??
                  favSkill.variants.find((v) => v.isDefault) ??
                  favSkill.variants[0])
                : (favSkill.variants.find((v) => v.isDefault) ??
                  favSkill.variants[0])) ?? null)
            : null;
          const miniBridgeCtx: BridgeContext = {
            skill: favActiveVariant,
            favorite: favRow,
            userSettings: null,
          };
          return {
            imageGenModelSelection:
              ModalityResolver.resolveImageGenSelection(miniBridgeCtx),
            musicGenModelSelection:
              ModalityResolver.resolveMusicGenSelection(miniBridgeCtx),
            videoGenModelSelection:
              ModalityResolver.resolveVideoGenSelection(miniBridgeCtx),
          };
        }
      }
      return {
        imageGenModelSelection: undefined,
        musicGenModelSelection: undefined,
        videoGenModelSelection: undefined,
      };
    })();

    const confirmationResult = await ToolConfirmationProcessor.processAll({
      toolConfirmations: data.toolConfirmations,
      messageHistory: data.messageHistory ?? undefined,
      isIncognito,
      locale,
      logger,
      user,
      t: aiStreamT,
      streamContext: {
        rootFolderId: data.rootFolderId,
        threadId: data.threadId ?? undefined,
        aiMessageId: undefined,
        currentToolMessageId: undefined,
        callerToolCallId: undefined,
        callerCallbackMode: undefined,
        pendingToolMessages: undefined,
        pendingTimeoutMs: undefined,
        // Pass leafMessageId from request so deferred confirm inserts use the correct branch tip
        leafMessageId: data.leafMessageId ?? undefined,
        skillId: data.skill,
        variantId: undefined,
        modelId: data.model,
        imageGenModelSelection: confirmMediaModels.imageGenModelSelection,
        musicGenModelSelection: confirmMediaModels.musicGenModelSelection,
        videoGenModelSelection: confirmMediaModels.videoGenModelSelection,
        providerOverride,
        favoriteId: params.favoriteIdOverride,
        headless: params.headless,
        subAgentDepth: params.subAgentDepth,
        isRevival: params.isRevival,
        waitingForRemoteResult: undefined,
        onEscalatedTaskCancel: undefined,
        pendingEscalatedTaskId: undefined,
        cancelPendingStreamTimer: undefined,
        abortSignal: streamAbortController.signal,
        escalateToTask: undefined,
      },
    });

    if (!confirmationResult.success) {
      return confirmationResult;
    }

    toolConfirmationResults = confirmationResult.data;
  }

  if (!userId && !leadId && !isIncognito) {
    logger.error("User has neither userId nor leadId", {
      rootFolderId: data.rootFolderId,
    });
    return fail({
      message: aiStreamT("route.errors.authenticationRequired"),
      errorType: ErrorResponseTypes.AUTH_ERROR,
    });
  }
  const modelConfig = providerOverride
    ? getChatModelForProvider(data.model, providerOverride)
    : getChatModelById(data.model);

  // Guard: TTS/STT models are dispatched via their own handlers, not the LLM stream pipeline
  if (
    modelConfig.apiProvider === ApiProvider.OPENAI_TTS ||
    modelConfig.apiProvider === ApiProvider.OPENAI_STT ||
    modelConfig.apiProvider === ApiProvider.ELEVENLABS ||
    modelConfig.apiProvider === ApiProvider.DEEPGRAM ||
    modelConfig.apiProvider === ApiProvider.EDEN_AI_TTS ||
    modelConfig.apiProvider === ApiProvider.EDEN_AI_STT
  ) {
    logger.warn("[Setup] TTS/STT model routed to LLM stream - invalid", {
      model: data.model,
      provider: modelConfig.apiProvider,
    });
    return fail({
      message: aiStreamT("route.errors.invalidRequestData"),
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }

  // Guard: check that the required API key for this model's provider is configured
  const providerKeyMissing = ((): string | null => {
    switch (modelConfig.apiProvider) {
      case ApiProvider.OPENROUTER:
        return agentEnv.OPENROUTER_API_KEY
          ? null
          : buildMissingKeyMessage("openRouter");
      case ApiProvider.UNCENSORED_AI:
        return agentEnv.UNCENSORED_AI_API_KEY
          ? null
          : buildMissingKeyMessage("uncensoredAI");
      case ApiProvider.FREEDOMGPT:
        return agentEnv.FREEDOMGPT_API_KEY
          ? null
          : buildMissingKeyMessage("freedomGPT");
      case ApiProvider.GAB_AI:
        return agentEnv.GAB_AI_API_KEY ? null : buildMissingKeyMessage("gabAI");
      case ApiProvider.VENICE_AI:
        return agentEnv.VENICE_AI_API_KEY
          ? null
          : buildMissingKeyMessage("veniceAI");
      case ApiProvider.OPENAI_IMAGES:
        return agentEnv.OPENAI_API_KEY
          ? null
          : buildMissingKeyMessage("openAiImages");
      case ApiProvider.REPLICATE:
        return agentEnv.REPLICATE_API_TOKEN
          ? null
          : buildMissingKeyMessage("replicate");
      case ApiProvider.FAL_AI:
        return agentEnv.FAL_AI_API_KEY ? null : buildMissingKeyMessage("falAi");
      case ApiProvider.CLAUDE_CODE:
        // Agent SDK authenticates via OAuth login, no separate API key needed
        return null;
      default:
        return null;
    }
  })();

  // Guard: Agent SDK models are admin-only
  if (
    modelConfig.apiProvider === ApiProvider.CLAUDE_CODE &&
    (user.isPublic || !user.roles.includes(UserPermissionRole.ADMIN))
  ) {
    logger.warn("[Setup] Non-admin user attempted to use Agent SDK model", {
      model: data.model,
    });
    return fail({
      message: aiStreamT("route.errors.invalidRequestData"),
      errorType: ErrorResponseTypes.FORBIDDEN,
    });
  }

  if (providerKeyMissing) {
    logger.warn("AI provider API key not configured", { model: data.model });
    return fail({
      message: aiStreamT("route.errors.invalidRequestData", {
        issue: providerKeyMissing,
      }),
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }

  const creditValidation = await CreditValidatorHandler.validateCredits({
    user,
    ipAddress,
    modelInfo: modelConfig,
    locale,
    logger,
    t: aiStreamT,
  });

  if (!creditValidation.success) {
    return creditValidation;
  }

  const { effectiveLeadId, modelCost } = creditValidation.data;

  // Process operation and handle audio transcription
  const operationResult = await OperationHandler.processOperation({
    operation: data.operation,
    data,
    user,
    locale,
    logger,
  });

  if (!operationResult.success) {
    return operationResult;
  }

  const {
    threadId: effectiveThreadId,
    parentMessageId: effectiveParentMessageId,
    content: effectiveContent,
    role: effectiveRole,
    voiceTranscription,
  } = operationResult.data;

  const threadResult = await ThreadsRepository.ensureThread({
    threadId: effectiveThreadId,
    rootFolderId: data.rootFolderId,
    subFolderId: data.subFolderId,
    userId,
    leadId,
    content: effectiveContent,
    isIncognito,
    logger,
    user,
    locale,
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
    logger.error(
      "User message ID must be provided by client",
      data.userMessageId,
    );
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
  const userMessageResult =
    await UserMessageHandler.createUserMessageWithAttachments({
      userMessageId,
      operation: data.operation,
      hasToolConfirmations,
      isIncognito,
      threadId: threadResult.data.threadId,
      effectiveRole,
      effectiveContent,
      effectiveParentMessageId,
      userId,
      attachments: data.attachments ?? undefined,
      logger,
      t: aiStreamT,
    });

  if (!userMessageResult.success) {
    return userMessageResult;
  }

  // Capture file upload promise and attachment metadata from handler
  if (userMessageResult.data.fileUploadPromise) {
    fileUploadPromise = userMessageResult.data.fileUploadPromise;
  }

  // Use attachment metadata from user message handler
  const userMessageMetadata = userMessageResult.data.attachmentMetadata
    ? { attachments: userMessageResult.data.attachmentMetadata }
    : undefined;

  // Resolve effective compact trigger: favorite → skill → settings → global default
  const effectiveCompactTrigger = await (async (): Promise<number> => {
    if (userId) {
      // 1. Check active favorite compactTrigger (look up activeFavoriteId from settings)
      const [settings] = await db
        .select({
          compactTrigger: chatSettings.compactTrigger,
          activeFavoriteId: chatSettings.activeFavoriteId,
        })
        .from(chatSettings)
        .where(eq(chatSettings.userId, userId))
        .limit(1);

      if (settings?.activeFavoriteId) {
        const [fav] = await db
          .select({ compactTrigger: chatFavorites.compactTrigger })
          .from(chatFavorites)
          .where(
            isUuid(settings.activeFavoriteId)
              ? eq(chatFavorites.id, settings.activeFavoriteId)
              : eq(chatFavorites.slug, settings.activeFavoriteId),
          )
          .limit(1);
        if (fav?.compactTrigger !== null && fav?.compactTrigger !== undefined) {
          return fav.compactTrigger;
        }
      }

      // 2. Check skill compactTrigger (custom skills only - UUIDs)
      if (data.skill) {
        // Only query DB for UUIDs (custom skills); default/config skills have no DB row
        const uuidPattern =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidPattern.test(data.skill)) {
          const [char] = await db
            .select({ compactTrigger: customSkills.compactTrigger })
            .from(customSkills)
            .where(eq(customSkills.id, data.skill))
            .limit(1);
          if (
            char?.compactTrigger !== null &&
            char?.compactTrigger !== undefined
          ) {
            return char.compactTrigger;
          }
        }
      }

      // 3. Use settings compactTrigger
      if (
        settings?.compactTrigger !== null &&
        settings?.compactTrigger !== undefined
      ) {
        return settings.compactTrigger;
      }
    }
    // 4. Fall back to global constant
    return COMPACT_TRIGGER;
  })();

  logger.debug("[Setup] Effective compact trigger resolved", {
    effectiveCompactTrigger,
    skill: data.skill,
    userId,
  });

  // Resolve tool config cascade: favorite → skill → settings → client-provided → null (all allowed)
  // null means "no restriction" - model can call any tool
  const resolvedToolConfig = await (async (): Promise<{
    availableTools: Array<{
      toolId: string;
      requiresConfirmation: boolean;
    }> | null;
    pinnedTools: Array<{
      toolId: string;
      requiresConfirmation: boolean;
    }> | null;
    /** Union of skill-level + favorite-level denied tools. Applied as a hard block. */
    deniedToolIds: Set<string>;
    /** Text from the active favorite's promptAppend - appended to system prompt. */
    promptAppend: string | null;
    /** Resolved memory token limit from cascade: favorite → skill → settings → null */
    memoryLimit: number | null;
  }> => {
    if (!userId) {
      return {
        availableTools: null,
        pinnedTools: null,
        deniedToolIds: new Set(),
        promptAppend: null,
        memoryLimit: null,
      };
    }

    // 1. Load user settings (activeFavoriteId + tool overrides + memory limit)
    const [userSettings] = await db
      .select({
        activeFavoriteId: chatSettings.activeFavoriteId,
        availableTools: chatSettings.availableTools,
        pinnedTools: chatSettings.pinnedTools,
        memoryLimit: chatSettings.memoryLimit,
      })
      .from(chatSettings)
      .where(eq(chatSettings.userId, userId))
      .limit(1);

    // Build denied tool IDs from skill + favorite (both stack; order doesn't matter)
    const deniedToolIds = new Set<string>();
    let promptAppend: string | null = null;
    // memoryLimit cascade: favorite → skill → settings → null
    let memoryLimit: number | null = null;

    // Collect skill-level deniedTools regardless of where tool config is resolved from
    if (data.skill) {
      const uuidPattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidPattern.test(data.skill)) {
        const [skillRow] = await db
          .select({ deniedTools: customSkills.deniedTools })
          .from(customSkills)
          .where(eq(customSkills.id, data.skill))
          .limit(1);
        for (const t of skillRow?.deniedTools ?? []) {
          deniedToolIds.add(t.toolId);
        }
      } else {
        const defaultChar = DEFAULT_SKILLS.find((c) => c.id === data.skill);
        for (const t of defaultChar?.deniedTools ?? []) {
          deniedToolIds.add(t.toolId);
        }
      }
    }

    // 1a. Check active favorite for tool config + deniedTools + promptAppend + memoryLimit
    if (userSettings?.activeFavoriteId) {
      const [fav] = await db
        .select({
          availableTools: chatFavorites.availableTools,
          pinnedTools: chatFavorites.pinnedTools,
          deniedTools: chatFavorites.deniedTools,
          promptAppend: chatFavorites.promptAppend,
          memoryLimit: chatFavorites.memoryLimit,
        })
        .from(chatFavorites)
        .where(
          isUuid(userSettings.activeFavoriteId)
            ? eq(chatFavorites.id, userSettings.activeFavoriteId)
            : eq(chatFavorites.slug, userSettings.activeFavoriteId),
        )
        .limit(1);

      // Stack favorite deniedTools on top of skill's
      for (const t of fav?.deniedTools ?? []) {
        deniedToolIds.add(t.toolId);
      }

      // Capture promptAppend from favorite (carried through all subsequent returns)
      promptAppend = fav?.promptAppend ?? null;

      // Favorite memory limit takes highest priority
      if (fav?.memoryLimit !== null && fav?.memoryLimit !== undefined) {
        memoryLimit = fav.memoryLimit;
      }

      if (fav && (fav.availableTools !== null || fav.pinnedTools !== null)) {
        logger.debug("[Setup] Tool config resolved from active favorite", {
          activeFavoriteId: userSettings.activeFavoriteId,
        });
        return {
          availableTools: normalizeToolConfig(fav.availableTools),
          pinnedTools: normalizeToolConfig(fav.pinnedTools),
          deniedToolIds,
          promptAppend,
          memoryLimit,
        };
      }
    }

    // 2. Check skill tool config (and skill-level memoryLimit for custom skills)
    if (data.skill) {
      const uuidPattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidPattern.test(data.skill)) {
        // Custom skill (DB-stored, UUID) - availableTools/pinnedTools only (deniedTools already fetched above)
        const [char] = await db
          .select({
            availableTools: customSkills.availableTools,
            pinnedTools: customSkills.pinnedTools,
            memoryLimit: customSkills.memoryLimit,
          })
          .from(customSkills)
          .where(eq(customSkills.id, data.skill))
          .limit(1);

        // Skill memoryLimit used only if favorite didn't set one
        if (
          memoryLimit === null &&
          char?.memoryLimit !== null &&
          char?.memoryLimit !== undefined
        ) {
          memoryLimit = char.memoryLimit;
        }

        if (
          char &&
          (char.availableTools !== null || char.pinnedTools !== null)
        ) {
          logger.debug("[Setup] Tool config resolved from custom skill", {
            skillId: data.skill,
          });
          return {
            availableTools: normalizeToolConfig(char.availableTools),
            pinnedTools: normalizeToolConfig(char.pinnedTools),
            deniedToolIds,
            promptAppend,
            memoryLimit,
          };
        }
      } else {
        // Default skill (config-based, string ID)
        const defaultChar = DEFAULT_SKILLS.find((c) => c.id === data.skill);
        if (defaultChar?.availableTools) {
          logger.debug(
            "[Setup] Tool config resolved from default skill config",
            {
              skillId: data.skill,
            },
          );
          return {
            availableTools: normalizeToolConfig(defaultChar.availableTools),
            pinnedTools: normalizeToolConfig(defaultChar.pinnedTools ?? null),
            deniedToolIds,
            promptAppend,
            memoryLimit,
          };
        }
      }
    }

    // 3. Check user's personal settings (customised tool config + memoryLimit fallback)
    if (
      memoryLimit === null &&
      userSettings?.memoryLimit !== null &&
      userSettings?.memoryLimit !== undefined
    ) {
      memoryLimit = userSettings.memoryLimit;
    }

    if (
      userSettings &&
      (userSettings.availableTools !== null ||
        userSettings.pinnedTools !== null)
    ) {
      logger.debug("[Setup] Tool config resolved from user settings");
      return {
        availableTools: normalizeToolConfig(userSettings.availableTools),
        pinnedTools: normalizeToolConfig(userSettings.pinnedTools),
        deniedToolIds,
        promptAppend,
        memoryLimit,
      };
    }

    // 4. Fall back to null (all tools allowed / default visible set)
    return {
      availableTools: null,
      pinnedTools: null,
      deniedToolIds,
      promptAppend,
      memoryLimit,
    };
  })();

  // Inject folder-type denied tools - applies regardless of skill/favorite cascade.
  // Works for incognito (userId=null) because the IIFE returns an empty deniedToolIds set.
  for (const toolId of FOLDER_DENIED_TOOL_IDS[data.rootFolderId] ?? []) {
    resolvedToolConfig.deniedToolIds.add(toolId);
  }

  // Resolve bridge models via cascade: skill variant → favorite → userSettings → system default
  // This wires the ModalityResolver into the stream pipeline so all downstream
  // handlers (STT, TTS, vision bridge, translation) use the correct models.
  const bridgeContext = await (async (): Promise<BridgeContext> => {
    let skillConfig: BridgeContext["skill"] = null;
    let favoriteConfig: BridgeContext["favorite"] = null;
    let userSettingsConfig: BridgeContext["userSettings"] = null;

    // Resolve favorite and userSettings first so we know the active variantId
    if (userId) {
      const [userSettingsRow] = await db
        .select({
          activeFavoriteId: chatSettings.activeFavoriteId,
          voiceModelSelection: chatSettings.voiceModelSelection,
          sttModelSelection: chatSettings.sttModelSelection,
          imageVisionModelSelection: chatSettings.imageVisionModelSelection,
          videoVisionModelSelection: chatSettings.videoVisionModelSelection,
          audioVisionModelSelection: chatSettings.audioVisionModelSelection,
          defaultChatMode: chatSettings.defaultChatMode,
          imageGenModelSelection: chatSettings.imageGenModelSelection,
          musicGenModelSelection: chatSettings.musicGenModelSelection,
          videoGenModelSelection: chatSettings.videoGenModelSelection,
        })
        .from(chatSettings)
        .where(eq(chatSettings.userId, userId))
        .limit(1);

      if (userSettingsRow) {
        userSettingsConfig = userSettingsRow;
      }

      // Explicit favoriteId from request → use that favorite for bridge context
      const effectiveFavoriteId =
        params.favoriteIdOverride ?? userSettingsRow?.activeFavoriteId;
      if (effectiveFavoriteId) {
        const [favRow] = await db
          .select()
          .from(chatFavorites)
          .where(
            isUuid(effectiveFavoriteId)
              ? eq(chatFavorites.id, effectiveFavoriteId)
              : eq(chatFavorites.slug, effectiveFavoriteId),
          )
          .limit(1);
        if (favRow) {
          favoriteConfig = favRow;
        }
      }
    }

    // Resolve skill: default skills come from config (variant-aware), custom skills from DB
    if (data.skill) {
      const uuidPattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidPattern.test(data.skill)) {
        // Custom skills: resolve variant-aware model selections
        const [customSkillRow] = await db
          .select({
            voiceModelSelection: customSkills.voiceModelSelection,
            sttModelSelection: customSkills.sttModelSelection,
            imageVisionModelSelection: customSkills.imageVisionModelSelection,
            videoVisionModelSelection: customSkills.videoVisionModelSelection,
            audioVisionModelSelection: customSkills.audioVisionModelSelection,
            defaultChatMode: customSkills.defaultChatMode,
            variants: customSkills.variants,
          })
          .from(customSkills)
          .where(eq(customSkills.id, data.skill))
          .limit(1);
        if (customSkillRow) {
          // Try to resolve active variant from favorite's variantId
          const activeVariantId = favoriteConfig?.variantId ?? null;
          const variants = customSkillRow.variants;
          const activeVariant =
            variants && activeVariantId
              ? (variants.find((v) => v.id === activeVariantId) ??
                variants.find((v) => v.isDefault) ??
                variants[0])
              : variants
                ? (variants.find((v) => v.isDefault) ?? variants[0])
                : null;

          skillConfig = activeVariant
            ? {
                voiceModelSelection:
                  activeVariant.voiceModelSelection ??
                  customSkillRow.voiceModelSelection ??
                  undefined,
                sttModelSelection:
                  activeVariant.sttModelSelection ??
                  customSkillRow.sttModelSelection ??
                  undefined,
                imageVisionModelSelection:
                  activeVariant.imageVisionModelSelection ??
                  customSkillRow.imageVisionModelSelection ??
                  undefined,
                videoVisionModelSelection:
                  activeVariant.videoVisionModelSelection ??
                  customSkillRow.videoVisionModelSelection ??
                  undefined,
                audioVisionModelSelection:
                  activeVariant.audioVisionModelSelection ??
                  customSkillRow.audioVisionModelSelection ??
                  undefined,
                defaultChatMode:
                  activeVariant.defaultChatMode ??
                  customSkillRow.defaultChatMode ??
                  undefined,
                imageGenModelSelection:
                  activeVariant.imageGenModelSelection ?? undefined,
                musicGenModelSelection:
                  activeVariant.musicGenModelSelection ?? undefined,
                videoGenModelSelection:
                  activeVariant.videoGenModelSelection ?? undefined,
              }
            : {
                voiceModelSelection:
                  customSkillRow.voiceModelSelection ?? undefined,
                sttModelSelection:
                  customSkillRow.sttModelSelection ?? undefined,
                imageVisionModelSelection:
                  customSkillRow.imageVisionModelSelection ?? undefined,
                videoVisionModelSelection:
                  customSkillRow.videoVisionModelSelection ?? undefined,
                audioVisionModelSelection:
                  customSkillRow.audioVisionModelSelection ?? undefined,
                defaultChatMode: customSkillRow.defaultChatMode ?? undefined,
                imageGenModelSelection: undefined,
                musicGenModelSelection: undefined,
                videoGenModelSelection: undefined,
              };
        }
      } else {
        // Default skill: resolve the active variant and use its model selections
        const defaultSkill = DEFAULT_SKILLS.find((c) => c.id === data.skill);
        if (defaultSkill) {
          const activeVariantId = favoriteConfig?.variantId ?? null;
          const activeVariant = activeVariantId
            ? (defaultSkill.variants.find((v) => v.id === activeVariantId) ??
              defaultSkill.variants.find((v) => v.isDefault) ??
              defaultSkill.variants[0])
            : (defaultSkill.variants.find((v) => v.isDefault) ??
              defaultSkill.variants[0]);
          skillConfig = activeVariant ?? null;
        }
      }
    }

    return {
      skill: skillConfig,
      favorite: favoriteConfig,
      userSettings: userSettingsConfig,
    };
  })();

  // Resolve TTS selection via cascade - actual model resolved at point of use (streaming-tts.ts)
  const resolvedTtsSelection = ModalityResolver.resolveTtsSelection(
    bridgeContext,
    data.voiceMode?.voice ?? undefined,
  );

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

  // Resolve models once for system-prompt mediaCapabilities (name display only)
  // Pass providerOverride so media gen models are constrained to the same provider
  // as the chat model (e.g. UNBOTTLED routes image/music/video through hermes too).
  const effectiveImageGenModel = getBestImageGenModel(
    effectiveImageGenSelection,
    user,
    providerOverride,
  );
  const effectiveMusicGenModel = getBestMusicGenModel(
    effectiveMusicGenSelection,
    user,
    providerOverride,
  );
  const effectiveVideoGenModel = getBestVideoGenModel(
    effectiveVideoGenSelection,
    user,
    providerOverride,
  );

  logger.debug("[Setup] Bridge models resolved via cascade", {
    ttsSelectionType: resolvedTtsSelection.selectionType,
    sttModelId:
      ModalityResolver.resolveSttModel(bridgeContext, user)?.id ?? null,
    imageVisionModelId:
      ModalityResolver.resolveImageVisionModel(bridgeContext, user)?.id ?? null,
    imageGenModelId: effectiveImageGenModel?.id ?? null,
    musicGenModelId: effectiveMusicGenModel?.id ?? null,
    videoGenModelId: effectiveVideoGenModel?.id ?? null,
  });

  // Build complete system prompt from skill and formatting instructions
  const { systemPrompt: builtSystemPrompt, trailingSystemMessage } =
    await buildSystemPrompt({
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
      },
      threadId: threadResult.data.threadId,
      voiceTranscription: voiceTranscription
        ? {
            wasTranscribed: voiceTranscription.wasTranscribed,
            confidence: voiceTranscription.confidence,
          }
        : null,
    });

  logger.debug("System prompt built", {
    systemPromptLength: builtSystemPrompt.length,
    hasSkill: !!data.skill,
  });

  // Generate AI message ID and timestamp BEFORE building context
  // CRITICAL: Use same timestamp for metadata AND database to ensure cache stability
  const aiMessageId = crypto.randomUUID();
  const aiMessageCreatedAt = new Date();

  // Build the rich stream context - passed through to all tool executions
  const streamContext: ToolExecutionContext = {
    rootFolderId: data.rootFolderId,
    threadId: threadResult.data.threadId,
    aiMessageId,
    skillId: data.skill,
    variantId: bridgeContext.favorite?.variantId ?? undefined,
    modelId: data.model,
    imageGenModelSelection: effectiveImageGenSelection,
    musicGenModelSelection: effectiveMusicGenSelection,
    videoGenModelSelection: effectiveVideoGenSelection,
    providerOverride,
    headless: params.headless,
    subAgentDepth: params.subAgentDepth,
    isRevival: params.isRevival,
    // favoriteId: from headless override (run endpoint) - lets resume-stream reload full context
    favoriteId: params.favoriteIdOverride,
    currentToolMessageId: undefined,
    callerToolCallId: undefined,
    callerCallbackMode: undefined,
    // pendingToolMessages is wired after StreamContext is created (see index.ts)
    pendingToolMessages: undefined,
    pendingTimeoutMs: undefined,
    leafMessageId: undefined,
    waitingForRemoteResult: undefined,
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

  const messages = await MessageContextBuilder.buildMessageContext({
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
  });

  // Apply deniedTools filter: strip blocked tools from both visible and active sets.
  // This is a hard block - denied tools cannot be seen or executed regardless of cascade.
  const applyDeniedFilter = <T extends { toolId: string }>(
    tools: T[] | null | undefined,
  ): T[] | null | undefined => {
    if (!resolvedToolConfig.deniedToolIds.size || !tools) {
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
    ? {
        tools: params.toolsOverride,
        toolsConfig: new Map<
          string,
          { requiresConfirmation: boolean; credits: number }
        >(),
        activeToolNames: new Set<string>(Object.keys(params.toolsOverride)),
        systemPrompt: builtSystemPrompt,
      }
    : await ToolsSetupHandler.setupStreamingTools({
        modelConfig,
        // Tool config cascade: cascade-resolved (favorite/skill) takes precedence over client-provided.
        // deniedTools are stripped from both sets before reaching the AI SDK.
        // requiresConfirmation from data.availableTools always takes precedence:
        // cascade determines which tools are permitted; client specifies confirmation per-tool.
        pinnedTools: filterUnavailableMediaTools(
          applyDeniedFilter(resolvedToolConfig.pinnedTools ?? data.pinnedTools),
        ),
        availableTools: filterUnavailableMediaTools(
          applyDeniedFilter(
            resolvedToolConfig.availableTools ?? data.availableTools,
          ),
        ),
        confirmationOverrides: data.availableTools,
        user,
        locale,
        logger,
        systemPrompt: builtSystemPrompt,
        toolConfirmationResults,
        streamContext,
      });

  const provider = ProviderFactoryClass.getProviderForModel(
    modelConfig,
    logger,
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
    pinnedTools: data.pinnedTools,
    availableTools: data.availableTools,
    supportsTools: modelConfig?.supportsTools,
  });

  // streamAbortController was created early (before tool confirmations) so the signal
  // is already wired into streamContext.abortSignal above.

  // Wire escalateToTask closure into streamContext.
  // Captures user, locale, logger, and streamContext by reference so tool authors
  // can call context.streamContext.escalateToTask() from inside execute() to escape
  // the 90s stream timeout for long-running tools (SSH, claude-code, etc.).
  //
  // The stream aborts via REMOTE_TOOL_WAIT (same as remote queue wait) so the UI
  // stays in a visible, cancellable waiting state - not a silent STREAM_TIMEOUT.
  // User cancel fires onEscalatedTaskCancel which marks the task CANCELLED.
  streamContext.escalateToTask = async (options?: {
    callbackMode?: string;
    displayName?: string;
  }): Promise<{
    taskId: string;
    onComplete: (result: {
      success: boolean;
      data?: Record<string, WidgetData>;
      message?: string;
    }) => Promise<void>;
  }> => {
    const { CallbackMode } =
      await import("@/app/api/[locale]/system/unified-interface/ai/execute-tool/constants");

    const callbackMode = options?.callbackMode ?? CallbackMode.WAKE_UP;
    const escalatedTaskId = `escalated-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const { db: dbInstance } = await import("@/app/api/[locale]/system/db");
    const { cronTasks: cronTasksTable } =
      await import("@/app/api/[locale]/system/unified-interface/tasks/cron/db");
    const { CronTaskPriority, CronTaskStatus, TaskCategory, TaskOutputMode } =
      await import("@/app/api/[locale]/system/unified-interface/tasks/enum");

    const taskThreadId = streamContext.threadId;
    const taskToolMessageId =
      streamContext.currentToolMessageId ?? streamContext.aiMessageId;
    const taskLeafMessageId = streamContext.leafMessageId;

    // Insert task row with the requested callbackMode so complete-task /
    // handleTaskCompletion honours wait vs wakeUp vs detach semantics.
    await dbInstance.insert(cronTasksTable).values({
      id: escalatedTaskId,
      shortId: escalatedTaskId,
      routeId: "escalated-tool",
      displayName: options?.displayName ?? `Escalated: ${escalatedTaskId}`,
      category: TaskCategory.SYSTEM,
      schedule: "* * * * *",
      priority: CronTaskPriority.HIGH,
      enabled: false,
      runOnce: true,
      lastExecutionStatus: CronTaskStatus.RUNNING,
      taskInput: {},
      wakeUpCallbackMode: callbackMode,
      wakeUpThreadId: taskThreadId ?? null,
      wakeUpToolMessageId: taskToolMessageId ?? null,
      wakeUpLeafMessageId: taskLeafMessageId ?? null,
      wakeUpModelId: streamContext.modelId ?? null,
      wakeUpSkillId: streamContext.skillId ?? null,
      wakeUpFavoriteId: streamContext.favoriteId ?? null,
      wakeUpSubAgentDepth: streamContext.subAgentDepth,
      outputMode: TaskOutputMode.STORE_ONLY,
      notificationTargets: [],
      tags: ["escalated", "local"],
      userId: user.id,
    });

    // Always abort via REMOTE_TOOL_WAIT - stream dies, thread → waiting.
    // revival (via handleTaskCompletion) delivers the result and resumes the thread.
    // callbackMode controls what happens ON revival (backfill vs deferred), not how the stream stops.
    streamContext.waitingForRemoteResult = true;
    // Track the escalated task ID so stream-part-handler can backfill wakeUpToolMessageId
    // with the correct TOOL message ID once it's created (after escalateToTask returns).
    streamContext.pendingEscalatedTaskId = escalatedTaskId;
    // Set timeout from the tool's definition (callerTimeoutMs). 0 = no timer.
    const escalateTimeoutMs = streamContext.callerTimeoutMs;
    if (escalateTimeoutMs === undefined) {
      streamContext.pendingTimeoutMs = 90_000; // default
    } else if (escalateTimeoutMs > 0) {
      streamContext.pendingTimeoutMs = escalateTimeoutMs;
    }
    // escalateTimeoutMs === 0 → no timer (long-running tool, wait forever)

    // Mark thread as "waiting" - task is in flight, stream will die soon.
    // Clients subscribe to STREAMING_STATE_CHANGED and show the stop button.
    if (taskThreadId) {
      const { chatThreads: chatThreadsTable } =
        await import("@/app/api/[locale]/agent/chat/db");
      const { eq: drizzleEq } = await import("drizzle-orm");
      try {
        await dbInstance
          .update(chatThreadsTable)
          .set({ streamingState: "waiting" })
          .where(drizzleEq(chatThreadsTable.id, taskThreadId));
        createMessagesEmitter(
          taskThreadId,
          data.rootFolderId,
          logger,
          user,
        )("streaming-state-changed", { streamingState: "waiting" });
      } catch (err) {
        logger.warn("[StreamSetup] Failed to set thread waiting state", {
          taskThreadId,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    logger.debug("[StreamSetup] Tool escalated to task", {
      taskId: escalatedTaskId,
      callbackMode,
      taskThreadId,
      taskToolMessageId,
    });

    // Wire cancel propagation: when the user cancels the stream, mark the task
    // CANCELLED so the dashboard reflects reality and the thread unlocks.
    streamContext.onEscalatedTaskCancel = async (): Promise<void> => {
      streamContext.onEscalatedTaskCancel = undefined; // prevent double-fire
      const { eq: drizzleEq } = await import("drizzle-orm");
      const { CronTaskStatus: CronStatus } =
        await import("@/app/api/[locale]/system/unified-interface/tasks/enum");
      try {
        await dbInstance
          .update(cronTasksTable)
          .set({ lastExecutionStatus: CronStatus.CANCELLED, enabled: false })
          .where(drizzleEq(cronTasksTable.id, escalatedTaskId));
        logger.debug("[StreamSetup] Escalated task marked CANCELLED", {
          taskId: escalatedTaskId,
        });
        // Clear "waiting" → "idle" so the thread unlocks for new messages.
        if (taskThreadId) {
          const { chatThreads: chatThreadsTable } =
            await import("@/app/api/[locale]/agent/chat/db");
          await dbInstance
            .update(chatThreadsTable)
            .set({ streamingState: "idle" })
            .where(drizzleEq(chatThreadsTable.id, taskThreadId));
        }
      } catch (err) {
        logger.warn("[StreamSetup] Failed to cancel escalated task", {
          taskId: escalatedTaskId,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    };

    const onComplete = async (result: {
      success: boolean;
      data?: Record<string, WidgetData>;
      message?: string;
    }): Promise<void> => {
      streamContext.onEscalatedTaskCancel = undefined; // task done, no cancel needed
      const { handleTaskCompletion } =
        await import("@/app/api/[locale]/system/unified-interface/tasks/task-completion-handler");
      const { CallbackMode: CM } =
        await import("@/app/api/[locale]/system/unified-interface/ai/execute-tool/constants");
      const { CronTaskStatus: CronStatus } =
        await import("@/app/api/[locale]/system/unified-interface/tasks/enum");
      const { eq: drizzleEq } = await import("drizzle-orm");

      const finalStatus = result.success
        ? CronStatus.COMPLETED
        : CronStatus.FAILED;
      const finalOutput: Record<string, WidgetData> | null =
        result.success && result.data ? result.data : null;

      // Determine effective callbackMode - default to WAKE_UP for backward compat
      const effectiveMode =
        callbackMode === CM.WAIT
          ? CM.WAIT
          : callbackMode === CM.DETACH
            ? CM.DETACH
            : callbackMode === CM.END_LOOP
              ? CM.END_LOOP
              : CM.WAKE_UP;

      if (taskToolMessageId && taskThreadId && user.id) {
        await handleTaskCompletion({
          toolMessageId: taskToolMessageId,
          threadId: taskThreadId,
          callbackMode: effectiveMode,
          status: finalStatus,
          output: finalOutput,
          taskId: escalatedTaskId,
          modelId: streamContext.modelId ?? null,
          skillId: streamContext.skillId ?? null,
          favoriteId: streamContext.favoriteId ?? null,
          leafMessageId: taskLeafMessageId ?? null,
          subAgentDepth: streamContext.subAgentDepth,
          ownerUser: user,
          logger,
          directResumeLocale: locale,
          abortSignal: streamContext.abortSignal,
        });
      }

      // Self-delete task row
      try {
        await dbInstance
          .delete(cronTasksTable)
          .where(drizzleEq(cronTasksTable.id, escalatedTaskId));
      } catch {
        // Non-fatal
      }
    };

    return { taskId: escalatedTaskId, onComplete };
  };

  // Register in stream registry so the cancel endpoint can find and abort it
  StreamRegistry.register(threadResult.data.threadId, streamAbortController);

  // When the user cancels the stream, propagate cancellation to any escalated task.
  // The abort signal fires synchronously when StreamRegistry.cancel() is called.
  streamAbortController.signal.addEventListener("abort", () => {
    const abortErr = streamAbortController.signal.reason;
    if (
      isStreamAbort(abortErr) &&
      abortErr.reason === AbortReason.USER_CANCELLED &&
      streamContext.onEscalatedTaskCancel
    ) {
      void streamContext.onEscalatedTaskCancel();
    }
  });

  // Mark thread as streaming in DB (for refresh recovery + cross-tab detection)
  if (!isIncognito) {
    await db
      .update(chatThreads)
      .set({ streamingState: "streaming" })
      .where(eq(chatThreads.id, threadResult.data.threadId));
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
        (data.toolConfirmations?.length ?? 0) > 0 &&
        toolConfirmationResults.length === 0,
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
      effectiveCompactTrigger,
      streamContext,
      bridgeContext,
    },
  };
}
