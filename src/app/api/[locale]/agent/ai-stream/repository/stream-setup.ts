/**
 * AI Stream Setup
 * Handles validation, credit checks, and preparation before streaming
 */

import "server-only";

import type { ModelMessage } from "ai";
import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { agentEnv } from "@/app/api/[locale]/agent/env";
import { buildMissingKeyMessage } from "@/app/api/[locale]/agent/env-availability";
import {
  ApiProvider,
  getModelById,
  type ModelOption,
} from "@/app/api/[locale]/agent/models/models";
import { db } from "@/app/api/[locale]/system/db";
import type { CoreTool } from "@/app/api/[locale]/system/unified-interface/ai/tools-loader";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TranslatedKeyType } from "@/i18n/core/scoped-translation";
import { simpleT } from "@/i18n/core/shared";
import type { TParams } from "@/i18n/core/static-types";

import type { AiStreamTranslationKey } from "../i18n";

type AiStreamModuleT = (
  key: AiStreamTranslationKey,
  params?: TParams,
) => TranslatedKeyType;

import type { scopedTranslation as sttScopedTranslation } from "../../speech-to-text/i18n";

type SttModuleT = ReturnType<typeof sttScopedTranslation.scopedT>["t"];

import { customCharacters } from "../../chat/characters/db";
import type { ToolCall } from "../../chat/db";
import type { ChatMessageRole } from "../../chat/enum";
import { chatFavorites } from "../../chat/favorites/db";
import { chatSettings } from "../../chat/settings/db";
import { calculateMessageDepth } from "../../chat/threads/[threadId]/messages/repository";
import { ensureThread } from "../../chat/threads/repository";
import {
  DEFAULT_TTS_VOICE,
  type TtsVoiceValue,
} from "../../text-to-speech/enum";
import { type AiStreamPostRequestOutput } from "../definition";
import { AbortControllerSetup } from "./core/abort-controller-setup";
import { COMPACT_TRIGGER } from "./core/constants";
import { CreditValidatorHandler } from "./core/credit-validator-handler";
import { ProviderFactory as ProviderFactoryClass } from "./core/provider-factory";
import { ToolsSetupHandler } from "./core/tools-setup-handler";
import { MessageContextBuilder } from "./handlers/message-context-builder";
import { OperationHandler } from "./handlers/operation-handler";
import { ToolConfirmationProcessor } from "./handlers/tool-confirmation-processor";
import { UserMessageHandler } from "./handlers/user-message-handler";
import { buildSystemPrompt } from "./system-prompt/builder";

/** Normalize DB tool config items — ensures requiresConfirmation is always boolean */
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
  messageDepth: number;
  userMessageId: string | null;
  aiMessageId: string;
  aiMessageCreatedAt: Date;
  messages: ModelMessage[];
  systemPrompt: string;
  trailingSystemMessage: string;
  memorySummary: string;
  tasksSummary: string;
  favoritesSummary: string;
  toolConfirmationResults: Array<{
    messageId: string;
    sequenceId: string;
    toolCall: ToolCall;
  }>;
  /** Voice mode settings for TTS streaming */
  voiceMode?: {
    enabled: boolean;
    voice: typeof TtsVoiceValue;
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
  modelConfig: ModelOption;
  /** AI SDK tools configuration */
  tools: Record<string, CoreTool> | undefined;
  /** Tools metadata for confirmation checks */
  toolsConfig: Map<string, { requiresConfirmation: boolean }>;
  /** Set of tool names the model is allowed to execute (permission layer). null = all allowed. */
  activeToolNames: Set<string> | null;
  /** Effective compact trigger token threshold (cascade: favorite → character → settings → global) */
  effectiveCompactTrigger: number;
  /** Provider for AI streaming */
  provider: ReturnType<typeof ProviderFactoryClass.getProviderForModel>;
  /** Text encoder for SSE stream */
  encoder: TextEncoder;
  /** Abort controller for stream timeout and cancellation */
  streamAbortController: AbortController;
}

export async function setupAiStream(params: {
  data: AiStreamPostRequestOutput;
  locale: CountryLanguage;
  logger: EndpointLogger;
  user: JwtPayloadType;
  userId: string | undefined;
  leadId: string | undefined;
  ipAddress: string | undefined;
  aiStreamT: AiStreamModuleT;
  sttT: SttModuleT;
  maxDuration: number;
  request: NextRequest | undefined;
  extraInstructions?: string;
  headless?: boolean;
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
    sttT,
  } = params;
  const { t } = simpleT(locale);
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

  // Handle tool confirmations if present - execute tools and update messages
  let toolConfirmationResults: Array<{
    messageId: string;
    sequenceId: string;
    toolCall: ToolCall;
  }> = [];

  if (data.toolConfirmations && data.toolConfirmations.length > 0) {
    const confirmationResult = await ToolConfirmationProcessor.processAll({
      toolConfirmations: data.toolConfirmations,
      messageHistory: data.messageHistory ?? undefined,
      isIncognito,
      locale,
      logger,
      user,
      t: aiStreamT,
    });

    if (!confirmationResult.success) {
      return confirmationResult;
    }

    toolConfirmationResults = confirmationResult.data;
    // Tools have been executed and messages updated with results
    // Continue with the normal flow to start AI stream
    // The tool results are now in the message history and AI will process them
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
  const modelConfig = getModelById(data.model);

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
      default:
        return null;
    }
  })();

  if (providerKeyMissing) {
    logger.warn("AI provider API key not configured", { model: data.model });
    return fail({
      message: aiStreamT("route.errors.invalidRequestData"),
      errorType: ErrorResponseTypes.BAD_REQUEST,
      messageParams: { issue: providerKeyMissing },
    });
  }

  const creditValidation = await CreditValidatorHandler.validateCredits({
    userId,
    leadId,
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
    sttT,
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

  let threadResult;
  try {
    threadResult = await ensureThread({
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
  } catch (error) {
    logger.error("Failed to ensure thread - RAW ERROR", parseError(error), {
      errorType: typeof error,
      errorConstructor:
        error instanceof Error ? error.constructor.name : "unknown",
    });

    const errorMessage = parseError(error).message;
    logger.error("Failed to ensure thread - PARSED", {
      parsedMessage: errorMessage,
    });

    if (errorMessage === "PERMISSION_DENIED") {
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

  const messageDepth = await calculateMessageDepth(
    effectiveParentMessageId,
    isIncognito,
  );

  // Check if we have tool confirmations (don't need userMessageId in this case)
  const hasToolConfirmations = !!(
    data.toolConfirmations && data.toolConfirmations.length > 0
  );

  // Require userMessageId for all operations except answer-as-ai
  if (!data.userMessageId && data.operation !== "answer-as-ai") {
    logger.error(
      "User message ID must be provided by client",
      data.userMessageId,
    );
    return fail({
      message: aiStreamT("route.errors.invalidJson"),
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }

  // For "answer-as-ai", we don't create a user message, so userMessageId should be the parent message
  // This ensures the AI message uses parentMessageId as its parent, not a non-existent userMessageId
  const userMessageId =
    data.operation === "answer-as-ai" ? null : data.userMessageId;

  // Create user message with attachments (if applicable)
  const userMessageResult =
    await UserMessageHandler.createUserMessageWithAttachments({
      userMessageId,
      operation: data.operation,
      hasToolConfirmations,
      isIncognito,
      threadId: threadResult.threadId,
      effectiveRole,
      effectiveContent,
      effectiveParentMessageId,
      messageDepth,
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

  // Resolve effective compact trigger: favorite → character → settings → global default
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
          .where(eq(chatFavorites.id, settings.activeFavoriteId))
          .limit(1);
        if (fav?.compactTrigger !== null && fav?.compactTrigger !== undefined) {
          return fav.compactTrigger;
        }
      }

      // 2. Check character compactTrigger (custom characters only — UUIDs)
      if (data.character) {
        // Only query DB for UUIDs (custom characters); default/config characters have no DB row
        const uuidPattern =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidPattern.test(data.character)) {
          const [char] = await db
            .select({ compactTrigger: customCharacters.compactTrigger })
            .from(customCharacters)
            .where(eq(customCharacters.id, data.character))
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
    character: data.character,
    userId,
  });

  // Resolve tool config cascade: favorite → character → settings → client-provided → null (all allowed)
  // null means "no restriction" — model can call any tool
  const resolvedToolConfig = await (async (): Promise<{
    activeTools: Array<{
      // Internal name kept for ToolsSetupHandler compatibility (permission gate)
      toolId: string;
      requiresConfirmation: boolean;
    }> | null;
    visibleTools: Array<{
      // Internal name kept for ToolsSetupHandler compatibility (context window set)
      toolId: string;
      requiresConfirmation: boolean;
    }> | null;
  }> => {
    if (!userId) {
      return { activeTools: null, visibleTools: null };
    }

    // 1. Load user settings once (used for activeFavoriteId + tool overrides)
    const [userSettings] = await db
      .select({
        activeFavoriteId: chatSettings.activeFavoriteId,
        activeTools: chatSettings.activeTools,
        visibleTools: chatSettings.visibleTools,
      })
      .from(chatSettings)
      .where(eq(chatSettings.userId, userId))
      .limit(1);

    // 1a. Check active favorite tool config
    if (userSettings?.activeFavoriteId) {
      const [fav] = await db
        .select({
          activeTools: chatFavorites.activeTools,
          visibleTools: chatFavorites.visibleTools,
        })
        .from(chatFavorites)
        .where(eq(chatFavorites.id, userSettings.activeFavoriteId))
        .limit(1);

      if (fav && (fav.activeTools !== null || fav.visibleTools !== null)) {
        logger.debug("[Setup] Tool config resolved from active favorite", {
          activeFavoriteId: userSettings.activeFavoriteId,
        });
        return {
          activeTools: normalizeToolConfig(fav.activeTools),
          visibleTools: normalizeToolConfig(fav.visibleTools),
        };
      }
    }

    // 2. Check character tool config (custom characters only — UUIDs)
    if (data.character) {
      const uuidPattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidPattern.test(data.character)) {
        const [char] = await db
          .select({
            activeTools: customCharacters.activeTools,
            visibleTools: customCharacters.visibleTools,
          })
          .from(customCharacters)
          .where(eq(customCharacters.id, data.character))
          .limit(1);

        if (char && (char.activeTools !== null || char.visibleTools !== null)) {
          logger.debug("[Setup] Tool config resolved from character", {
            characterId: data.character,
          });
          return {
            activeTools: normalizeToolConfig(char.activeTools),
            visibleTools: normalizeToolConfig(char.visibleTools),
          };
        }
      }
    }

    // 3. Check user's personal settings (customised tool config)
    if (
      userSettings &&
      (userSettings.activeTools !== null || userSettings.visibleTools !== null)
    ) {
      logger.debug("[Setup] Tool config resolved from user settings");
      return {
        activeTools: normalizeToolConfig(userSettings.activeTools),
        visibleTools: normalizeToolConfig(userSettings.visibleTools),
      };
    }

    // 4. Fall back to null (all tools allowed / default visible set)
    return { activeTools: null, visibleTools: null };
  })();

  // Build complete system prompt from character and formatting instructions
  const {
    systemPrompt: builtSystemPrompt,
    trailingSystemMessage,
    memorySummary,
    tasksSummary,
    favoritesSummary,
  } = await buildSystemPrompt({
    characterId: data.character,
    user,
    logger,
    t,
    locale,
    rootFolderId: data.rootFolderId,
    subFolderId: data.subFolderId,
    callMode: data.voiceMode?.enabled,
    extraInstructions: params.extraInstructions,
    headless: params.headless,
    voiceTranscription: voiceTranscription
      ? {
          wasTranscribed: voiceTranscription.wasTranscribed,
          confidence: voiceTranscription.confidence,
        }
      : null,
  });

  logger.debug("System prompt built", {
    systemPromptLength: builtSystemPrompt.length,
    hasCharacter: !!data.character,
    hasMemories: !!memorySummary,
    hasTasks: !!tasksSummary,
  });

  // Generate AI message ID and timestamp BEFORE building context
  // CRITICAL: Use same timestamp for metadata AND database to ensure cache stability
  const aiMessageId = crypto.randomUUID();
  const aiMessageCreatedAt = new Date();
  logger.debug("Generated AI message ID", {
    messageId: aiMessageId,
    createdAt: aiMessageCreatedAt.toISOString(),
    operation: data.operation,
    isIncognito,
  });

  // Build complete message context for AI streaming
  const messages = await MessageContextBuilder.buildMessageContext({
    operation: data.operation,
    threadId: effectiveThreadId,
    parentMessageId: data.parentMessageId,
    locale,
    content: effectiveContent,
    role: effectiveRole,
    userId,
    isIncognito,
    rootFolderId: data.rootFolderId,
    messageHistory: data.messageHistory,
    logger,
    timezone: data.timezone,
    upcomingResponseContext: { model: data.model, character: data.character },
    userMessageMetadata,
    hasToolConfirmations,
    toolConfirmationResults,
    userMessageId,
    upcomingAssistantMessageId: aiMessageId,
    upcomingAssistantMessageCreatedAt: aiMessageCreatedAt,
    modelConfig,
    trailingSystemMessage,
  });

  const {
    tools,
    toolsConfig,
    activeToolNames,
    systemPrompt: updatedSystemPrompt,
  } = await ToolsSetupHandler.setupStreamingTools({
    modelConfig,
    // Tool config cascade: cascade-resolved (favorite/character) takes precedence over client-provided
    visibleTools: resolvedToolConfig.visibleTools ?? data.tools,
    activeTools: resolvedToolConfig.activeTools ?? data.allowedTools,
    user,
    locale,
    logger,
    systemPrompt: builtSystemPrompt,
    toolConfirmationResults,
  });

  const provider = ProviderFactoryClass.getProviderForModel(
    modelConfig,
    logger,
  );

  logger.debug("[AI Stream] Starting OpenRouter stream", {
    model: data.model,
    hasTools: !!tools,
    toolCount: tools ? Object.keys(tools).length : 0,
    visibleTools: data.tools,
    activeTools: data.allowedTools,
    supportsTools: modelConfig?.supportsTools,
  });

  // Create SSE stream encoder
  const encoder = new TextEncoder();

  // Create abort controller for this stream - combines request signal with timeout
  const streamAbortController = AbortControllerSetup.setupAbortController({
    maxDuration: params.maxDuration,
    request: params.request,
  });

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
      threadId: threadResult.threadId,
      isNewThread: threadResult.isNew,
      messageDepth,
      userMessageId,
      aiMessageId,
      aiMessageCreatedAt,
      messages,
      systemPrompt: updatedSystemPrompt,
      trailingSystemMessage,
      memorySummary,
      tasksSummary,
      favoritesSummary,
      toolConfirmationResults,
      voiceMode: data.voiceMode
        ? {
            enabled: data.voiceMode.enabled ?? false,
            voice: data.voiceMode.voice ?? DEFAULT_TTS_VOICE,
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
      encoder,
      streamAbortController,
      effectiveCompactTrigger,
    },
  };
}
