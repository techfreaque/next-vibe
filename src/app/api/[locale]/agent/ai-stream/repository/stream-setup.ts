/**
 * AI Stream Setup
 * Handles validation, credit checks, and preparation before streaming
 */

import "server-only";

import type { ModelMessage } from "ai";
import type { NextRequest } from "next/server";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import {
  getModelById,
  type ModelOption,
} from "@/app/api/[locale]/agent/models/models";
import type { CoreTool } from "@/app/api/[locale]/system/unified-interface/ai/tools-loader";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import type { ToolCall } from "../../chat/db";
import type { ChatMessageRole } from "../../chat/enum";
import { calculateMessageDepth } from "../../chat/threads/[threadId]/messages/repository";
import { ensureThread } from "../../chat/threads/repository";
import {
  DEFAULT_TTS_VOICE,
  type TtsVoiceValue,
} from "../../text-to-speech/enum";
import { type AiStreamPostRequestOutput } from "../definition";
import { AbortControllerSetup } from "./core/abort-controller-setup";
import { CreditValidatorHandler } from "./core/credit-validator-handler";
import { ProviderFactory as ProviderFactoryClass } from "./core/provider-factory";
import { ToolsSetupHandler } from "./core/tools-setup-handler";
import { MessageContextBuilder } from "./handlers/message-context-builder";
import { OperationHandler } from "./handlers/operation-handler";
import { ToolConfirmationProcessor } from "./handlers/tool-confirmation-processor";
import { UserMessageHandler } from "./handlers/user-message-handler";
import { buildSystemPrompt } from "./system-prompt/builder";

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
  messages: ModelMessage[];
  systemPrompt: string;
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
  t: TFunction;
  maxDuration: number;
  request: NextRequest | undefined;
}): Promise<ResponseType<StreamSetupResult>> {
  const { data, locale, logger, user, userId, leadId, ipAddress, t } = params;
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
      message:
        "app.api.agent.chat.aiStream.route.errors.authenticationRequired",
      errorType: ErrorResponseTypes.AUTH_ERROR,
    });
  }

  const creditValidation = await CreditValidatorHandler.validateCredits({
    userId,
    leadId,
    ipAddress,
    model: data.model,
    locale,
    logger,
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
        message: "app.api.agent.chat.aiStream.post.errors.forbidden.title",
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    return fail({
      message: "app.api.agent.chat.aiStream.post.errors.notFound.title",
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

  // Only require userMessageId if we're NOT doing answer-as-ai AND NOT doing tool confirmations
  if (
    !data.userMessageId &&
    data.operation !== "answer-as-ai" &&
    !hasToolConfirmations
  ) {
    logger.error(
      "User message ID must be provided by client",
      data.userMessageId,
    );
    return fail({
      message: "app.api.agent.chat.aiStream.route.errors.invalidJson",
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

  // Build complete system prompt from character and formatting instructions
  const systemPrompt = await buildSystemPrompt({
    characterId: data.character,
    user,
    logger,
    t,
    locale,
    rootFolderId: data.rootFolderId,
    subFolderId: data.subFolderId,
    callMode: data.voiceMode?.enabled,
  });

  logger.debug("System prompt built", {
    systemPromptLength: systemPrompt.length,
    hasCharacter: !!data.character,
  });

  // Build complete message context for AI streaming
  const messages = await MessageContextBuilder.buildMessageContext({
    operation: data.operation,
    threadId: effectiveThreadId,
    parentMessageId: data.parentMessageId,
    content: effectiveContent,
    role: effectiveRole,
    userId,
    isIncognito,
    rootFolderId: data.rootFolderId,
    messageHistory: data.messageHistory,
    logger,
    upcomingResponseContext: { model: data.model, character: data.character },
    userMessageMetadata,
    hasToolConfirmations,
    toolConfirmationResults,
  });

  const aiMessageId = crypto.randomUUID();
  logger.debug("Generated AI message ID", {
    messageId: aiMessageId,
    operation: data.operation,
    isIncognito,
  });

  // Get model configuration
  const modelConfig = getModelById(data.model);

  // Setup tools and update system prompt with tool instructions
  const {
    tools,
    toolsConfig,
    systemPrompt: updatedSystemPrompt,
  } = await ToolsSetupHandler.setupStreamingTools({
    model: data.model,
    requestedTools: data.tools,
    user,
    locale,
    logger,
    systemPrompt,
    toolConfirmationResults,
  });

  // Configure provider based on model
  const provider = ProviderFactoryClass.getProviderForModel(data.model, logger);

  logger.info("[AI Stream] Starting OpenRouter stream", {
    model: data.model,
    hasTools: !!tools,
    toolCount: tools ? Object.keys(tools).length : 0,
    requestedTools: data.tools,
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
      messages,
      systemPrompt: updatedSystemPrompt,
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
      provider,
      encoder,
      streamAbortController,
    },
  };
}
