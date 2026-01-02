/**
 * AI Stream Setup
 * Handles validation, credit checks, and preparation before streaming
 */

import "server-only";

import type { CoreMessage, JSONValue } from "ai";
import { eq } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type MessageResponseType,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { creditValidator } from "@/app/api/[locale]/credits/validator";
import { loadTools } from "@/app/api/[locale]/system/unified-interface/ai/tools-loader";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import {
  DEFAULT_TTS_VOICE,
  type TtsVoiceValue,
} from "../../text-to-speech/enum";

import { db } from "../../../system/db";
import type { DefaultFolderId } from "../../chat/config";
import {
  type ChatMessage,
  chatMessages,
  type ToolCall,
  type ToolCallResult,
} from "../../chat/db";
import { ChatMessageRole } from "../../chat/enum";
import { getModelCost } from "../../chat/model-access/costs";
import {
  calculateMessageDepth,
  createUserMessage,
  fetchMessageHistory,
} from "../../chat/threads/[threadId]/messages/repository";
import { ensureThread } from "../../chat/threads/repository";
import { SpeechToTextRepository } from "../../speech-to-text/repository";
import { type AiStreamPostRequestOutput } from "../definition";
import { createMetadataSystemMessage } from "../message-metadata-generator";
import { buildSystemPrompt } from "../system-prompt-builder";

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
  messages: CoreMessage[];
  systemPrompt: string;
  toolConfirmationResult?: {
    messageId: string;
    sequenceId: string;
    toolCall: ToolCall; // Full ToolCall object with all fields including args
  };
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
}): Promise<
  | { success: false; error: ResponseType<never> }
  | { success: true; data: StreamSetupResult }
> {
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

  logger.info("[Setup] RECOMPILED - Setting up AI stream", {
    operation: data.operation,
    model: data.model,
    rootFolderId: data.rootFolderId,
    isIncognito,
    userId,
    leadId,
    hasToolConfirmation: !!data.toolConfirmation,
  });

  // Handle tool confirmation if present - execute tool and update message
  if (data.toolConfirmation) {
    logger.info("[Setup] Processing tool confirmation", {
      messageId: data.toolConfirmation.messageId,
      confirmed: data.toolConfirmation.confirmed,
    });

    const confirmResult = await handleToolConfirmationInSetup({
      toolConfirmation: data.toolConfirmation,
      messageHistory: data.messageHistory ?? undefined,
      isIncognito,
      userId,
      locale,
      logger,
      user,
    });

    if (!confirmResult.success) {
      return { success: false, error: confirmResult };
    }

    logger.info(
      "[Setup] Tool executed - continuing with AI stream to process result",
    );
    // Tool has been executed and message updated with result
    // Continue with the normal flow to start AI stream
    // The tool result is now in the message history and AI will process it
  }

  if (!userId && !leadId && !isIncognito) {
    logger.error("User has neither userId nor leadId", {
      rootFolderId: data.rootFolderId,
    });
    return {
      success: false,
      error: fail({
        message:
          "app.api.agent.chat.aiStream.route.errors.authenticationRequired",
        errorType: ErrorResponseTypes.AUTH_ERROR,
      }),
    };
  }

  const modelCost = getModelCost(data.model);
  let validationResult;
  let effectiveLeadId = leadId;

  if (userId) {
    validationResult = await creditValidator.validateUserCredits(
      userId,
      data.model,
      logger,
    );
  } else if (leadId) {
    validationResult = await creditValidator.validateLeadCredits(
      leadId,
      data.model,
      logger,
    );
  } else if (ipAddress) {
    const leadByIpResult = await creditValidator.validateLeadByIp(
      ipAddress,
      data.model,
      locale,
      logger,
    );

    if (!leadByIpResult.success) {
      return {
        success: false,
        error: fail({
          message:
            "app.api.agent.chat.aiStream.route.errors.creditValidationFailed",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        }),
      };
    }

    effectiveLeadId = leadByIpResult.data.leadId;
    validationResult = {
      success: true,
      data: leadByIpResult.data.validation,
    };
  } else {
    logger.error("No user, lead, or IP address provided");
    return {
      success: false,
      error: fail({
        message: "app.api.agent.chat.aiStream.route.errors.noIdentifier",
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      }),
    };
  }

  if (!validationResult.success) {
    return {
      success: false,
      error: fail({
        message:
          "app.api.agent.chat.aiStream.route.errors.creditValidationFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      }),
    };
  }

  if (!validationResult.data.canUseModel) {
    logger.warn("Insufficient credits", {
      userId,
      leadId: effectiveLeadId,
      model: data.model,
      cost: modelCost,
      balance: validationResult.data.balance,
    });

    return {
      success: false,
      error: fail({
        message: "app.api.agent.chat.aiStream.route.errors.insufficientCredits",
        errorType: ErrorResponseTypes.FORBIDDEN,
        messageParams: {
          cost: modelCost.toString(),
          balance: validationResult.data.balance.toString(),
        },
      }),
    };
  }

  logger.debug("Credit validation passed", {
    userId,
    leadId: effectiveLeadId,
    cost: modelCost,
    balance: validationResult.data.balance,
  });

  let operationResult: {
    threadId: string;
    parentMessageId: string | null | undefined;
    content: string;
    role: ChatMessageRole;
  };

  // Track voice transcription metadata
  let voiceTranscription: StreamSetupResult["voiceTranscription"] = null;

  switch (data.operation) {
    case "send":
    case "retry":
    case "edit":
      // All operations work the same - check for audio input transcription
      if (data.audioInput?.file) {
        logger.info("[Setup] Audio input detected, transcribing...", {
          operation: data.operation,
          fileSize: data.audioInput.file.size,
          fileType: data.audioInput.file.type,
        });

        const transcriptionResult =
          await SpeechToTextRepository.transcribeAudio(
            data.audioInput.file,
            user,
            locale,
            logger,
          );

        if (!transcriptionResult.success) {
          logger.error("[Setup] Audio transcription failed", {
            error: transcriptionResult.message,
          });
          return {
            success: false,
            error: transcriptionResult,
          };
        }

        const transcribedText = transcriptionResult.data.response.text;
        const confidence = transcriptionResult.data.response.confidence ?? null;
        logger.info("[Setup] Audio transcription successful", {
          textLength: transcribedText.length,
          confidence,
        });

        // Store transcription metadata for VOICE_TRANSCRIBED event
        voiceTranscription = {
          wasTranscribed: true,
          confidence,
          durationSeconds: null, // STT response doesn't expose duration here
        };

        // Use transcribed text as content
        operationResult = {
          threadId: data.threadId,
          parentMessageId: data.parentMessageId,
          content: transcribedText,
          role: data.role,
        };
      } else {
        // No audio - use provided content
        operationResult = {
          threadId: data.threadId,
          parentMessageId: data.parentMessageId,
          content: data.content,
          role: data.role,
        };
      }
      break;

    case "answer-as-ai":
      operationResult = data;
      logger.info("Answer-as-AI operation", {
        threadId: data.threadId,
        parentMessageId: data.parentMessageId,
      });
      break;
  }

  const effectiveThreadId = operationResult.threadId;
  const effectiveParentMessageId = operationResult.parentMessageId;
  const effectiveContent = operationResult.content;
  const effectiveRole = operationResult.role;

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
      return {
        success: false,
        error: fail({
          message: "app.api.agent.chat.aiStream.post.errors.forbidden.title",
          errorType: ErrorResponseTypes.FORBIDDEN,
        }),
      };
    }

    return {
      success: false,
      error: fail({
        message: "app.api.agent.chat.aiStream.post.errors.notFound.title",
        errorType: ErrorResponseTypes.NOT_FOUND,
      }),
    };
  }

  const messageDepth = await calculateMessageDepth(
    effectiveParentMessageId,
    isIncognito,
  );

  const userMessageId = crypto.randomUUID();

  // Log the decision-making process for user message creation
  logger.info("[Setup] User message creation decision", {
    operation: data.operation,
    hasToolConfirmation: !!data.toolConfirmation,
    content: data.content,
    contentLength: data.content?.length,
    willCreateMessage:
      data.operation !== "answer-as-ai" &&
      data.operation !== "retry" &&
      !data.toolConfirmation,
  });

  // Skip creating user message if this is a tool confirmation (content is empty)
  if (
    data.operation !== "answer-as-ai" &&
    data.operation !== "retry" &&
    !data.toolConfirmation
  ) {
    logger.info("[Setup] Creating user message", {
      messageId: userMessageId,
      threadId: threadResult.threadId,
    });

    if (isIncognito) {
      logger.debug("Generated incognito user message ID", {
        messageId: userMessageId,
        operation: data.operation,
      });
    } else {
      const authorName = await UserRepository.getUserPublicName(userId, logger);

      await createUserMessage({
        messageId: userMessageId,
        threadId: threadResult.threadId,
        role: effectiveRole,
        content: effectiveContent,
        parentId: effectiveParentMessageId ?? null,
        depth: messageDepth,
        userId,
        authorName,
        logger,
      });
    }
  } else if (data.toolConfirmation) {
    logger.info(
      "[Setup] ✅ SKIPPING user message creation for tool confirmation",
      {
        messageId: data.toolConfirmation.messageId,
        operation: data.operation,
      },
    );
  } else {
    logger.info("[Setup] ✅ SKIPPING user message creation", {
      operation: data.operation,
      reason:
        data.operation === "answer-as-ai"
          ? "answer-as-ai operation"
          : "retry operation",
    });
  }

  // Build complete system prompt from character and formatting instructions
  const systemPrompt = await buildSystemPrompt({
    characterId: data.character,
    userId,
    logger,
    t,
    locale,
    rootFolderId: data.rootFolderId,
    subFolderId: data.subFolderId,
    callMode: data.voiceMode?.callMode,
  });

  logger.debug("System prompt built", {
    systemPromptLength: systemPrompt.length,
    hasCharacter: !!data.character,
  });

  const messages = await buildMessageContext({
    operation: data.operation,
    threadId: effectiveThreadId,
    parentMessageId: data.parentMessageId,
    content: effectiveContent,
    role: effectiveRole,
    userId,
    isIncognito,
    rootFolderId: data.rootFolderId,
    messageHistory: data.messageHistory ?? null,
    logger,
    upcomingResponseContext: { model: data.model, character: data.character },
  });

  if (
    !isIncognito &&
    systemPrompt &&
    messages.length > 0 &&
    messages[0].role !== "system"
  ) {
    messages.unshift({ role: "system", content: systemPrompt });
  }

  const aiMessageId = crypto.randomUUID();
  logger.debug("Generated AI message ID", {
    messageId: aiMessageId,
    operation: data.operation,
    isIncognito,
  });

  // Include tool confirmation result if present (both confirmed and cancelled)
  let toolConfirmationResult:
    | {
        messageId: string;
        sequenceId: string;
        toolCall: ToolCall; // Full ToolCall object with all fields including args
      }
    | undefined;
  if (data.toolConfirmation) {
    // Get the updated tool message to include in result
    let updatedToolMessage: ChatMessage | undefined;
    if (isIncognito && data.messageHistory) {
      updatedToolMessage = data.messageHistory.find(
        (msg) => msg.id === data.toolConfirmation!.messageId,
      );
    } else if (userId) {
      const [dbMessage] = await db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.id, data.toolConfirmation.messageId))
        .limit(1);
      updatedToolMessage = dbMessage;
    }

    if (updatedToolMessage?.metadata?.toolCall) {
      // Extract toolCall from metadata
      // The metadata.toolCall field is typed as ToolCall in MessageMetadata interface
      // but comes from JSONB column, so we validate it has required fields
      const toolCall = updatedToolMessage.metadata.toolCall;

      // Runtime validation: ensure toolCall has the required 'args' field
      // This is necessary because JSONB data might not match the TypeScript type
      if (!toolCall.toolName || !toolCall.args) {
        logger.error("[Setup] Tool call missing required fields", {
          messageId: data.toolConfirmation.messageId,
          hasToolName: !!toolCall.toolName,
          hasArgs: !!toolCall.args,
        });
        return {
          success: false,
          error: fail({
            message:
              "app.api.agent.chat.aiStream.route.errors.invalidRequestData",
            errorType: ErrorResponseTypes.INVALID_DATA_ERROR,
          }),
        };
      }

      const validatedToolCall: ToolCall = {
        toolName: toolCall.toolName,
        args: toolCall.args,
        result: toolCall.result,
        error: toolCall.error,
        executionTime: toolCall.executionTime,
        creditsUsed: toolCall.creditsUsed,
        requiresConfirmation: toolCall.requiresConfirmation,
        isConfirmed: toolCall.isConfirmed,
        waitingForConfirmation: toolCall.waitingForConfirmation,
      };

      toolConfirmationResult = {
        messageId: data.toolConfirmation.messageId,
        toolCall: validatedToolCall,
        // CRITICAL: Reuse the sequenceId from the tool message so new assistant messages
        // after tool execution are grouped with the tool message in the UI
        sequenceId: updatedToolMessage.sequenceId ?? crypto.randomUUID(),
      };
      logger.info("[Setup] Including tool confirmation result in setup data", {
        messageId: toolConfirmationResult.messageId,
        confirmed: data.toolConfirmation.confirmed,
        hasResult: !!toolConfirmationResult.toolCall.result,
        hasError: !!toolConfirmationResult.toolCall.error,
        sequenceId: toolConfirmationResult.sequenceId,
      });
    }
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
      threadId: threadResult.threadId,
      isNewThread: threadResult.isNew,
      messageDepth,
      userMessageId,
      aiMessageId,
      messages,
      systemPrompt,
      toolConfirmationResult,
      voiceMode: data.voiceMode
        ? {
            enabled: data.voiceMode.enabled ?? false,
            voice: data.voiceMode.voice ?? DEFAULT_TTS_VOICE,
          }
        : null,
      voiceTranscription,
      userMessageMetadata,
      fileUploadPromise,
    },
  };
}

/**
 * Build message context for AI
 * Force recompile: 2026-01-01
 */

async function buildMessageContext(params: {
  operation: "send" | "retry" | "edit" | "answer-as-ai";
  threadId: string | null | undefined;
  parentMessageId: string | null | undefined;
  content: string;
  role: ChatMessageRole;
  userId: string | undefined;
  isIncognito: boolean;
  rootFolderId?: DefaultFolderId;
  messageHistory?: NonNullable<AiStreamPostRequestOutput["messageHistory"]>;
  logger: EndpointLogger;
  upcomingResponseContext?: { model: string; character: string | null };
  userMessageMetadata?: {
    attachments?: Array<{
      id: string;
      url: string;
      filename: string;
      mimeType: string;
      size: number;
      data?: string;
    }>;
  };
}): Promise<CoreMessage[]> {
  params.logger.info("[BuildMessageContext] === FUNCTION CALLED ===", {
    operation: params.operation,
    isIncognito: params.isIncognito,
    hasUserId: !!params.userId,
    hasThreadId: !!params.threadId,
    hasUserMessageMetadata: !!params.userMessageMetadata,
    attachmentCount: params.userMessageMetadata?.attachments?.length ?? 0,
  });
  // SECURITY: Reject messageHistory for non-incognito threads
  // Non-incognito threads must fetch history from database to prevent manipulation
  if (!params.isIncognito && params.messageHistory) {
    params.logger.error(
      "Security violation: messageHistory provided for non-incognito thread",
      {
        operation: params.operation,
        threadId: params.threadId,
        isIncognito: params.isIncognito,
      },
    );
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Security violation should throw immediately
    throw new Error(
      "messageHistory is only allowed for incognito mode. Server-side threads fetch history from database.",
    );
  }

  if (params.operation === "answer-as-ai") {
    if (params.isIncognito && params.messageHistory) {
      return toAiSdkMessages(
        params.messageHistory,
        params.rootFolderId,
        params.upcomingResponseContext,
      );
    }

    if (
      !params.isIncognito &&
      params.userId &&
      params.threadId &&
      params.parentMessageId
    ) {
      const allMessages = await db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.threadId, params.threadId))
        .orderBy(chatMessages.createdAt);

      const parentIndex = allMessages.findIndex(
        (msg) => msg.id === params.parentMessageId,
      );

      if (parentIndex !== -1) {
        const contextMessages = allMessages.slice(0, parentIndex + 1);
        return toAiSdkMessages(
          contextMessages,
          params.rootFolderId,
          params.upcomingResponseContext,
        );
      }
      params.logger.error("Parent message not found in thread", {
        parentMessageId: params.parentMessageId,
        threadId: params.threadId,
      });
      return [];
    }
    return [];
  } else if (!params.isIncognito && params.userId && params.threadId) {
    // Non-incognito mode: fetch history from database filtered by branch
    const history = await fetchMessageHistory(
      params.threadId,
      params.logger,
      params.parentMessageId ?? null, // Pass parent message ID for branch filtering, convert undefined to null
    );

    // Fetch file data for attachments in history
    const { getStorageAdapter } = await import("../../chat/storage");
    const storage = getStorageAdapter();

    for (const message of history) {
      if (message.metadata?.attachments) {
        for (const attachment of message.metadata.attachments) {
          // If attachment has URL but no base64 data, fetch from storage
          if (attachment.url && !attachment.data) {
            const base64Data = await storage.readFileAsBase64(
              attachment.id,
              params.threadId,
            );
            if (base64Data) {
              attachment.data = base64Data;
              params.logger.debug(
                "[BuildMessageContext] Fetched file data for attachment",
                {
                  attachmentId: attachment.id,
                  filename: attachment.filename,
                },
              );
            }
          }
        }
      }
    }

    // Return ONLY past messages - new message comes from content/attachments params
    const historyMessages = toAiSdkMessages(
      history,
      params.rootFolderId,
      params.upcomingResponseContext,
    );
    params.logger.debug(
      "[BuildMessageContext] Returning history for server mode",
      {
        historyLength: historyMessages.length,
      },
    );
    return historyMessages;
  } else if (params.isIncognito && params.messageHistory) {
    // Incognito mode: Return ONLY past messages - new message comes from content/attachments params
    params.logger.debug("Using provided message history for incognito mode", {
      operation: params.operation,
      historyLength: params.messageHistory.length,
    });
    const historyMessages = toAiSdkMessages(
      params.messageHistory,
      params.rootFolderId,
      params.upcomingResponseContext,
    );
    params.logger.debug(
      "[BuildMessageContext] Returning history for incognito mode",
      {
        historyLength: historyMessages.length,
      },
    );
    return historyMessages;
  }

  params.logger.info("[BuildMessageContext] No history (new conversation)", {
    operation: params.operation,
    hasThreadId: !!params.threadId,
  });
  return [];
}

/**
 * Type guard to check if a message is a full ChatMessage (not a simple role/content object)
 */
function isChatMessage(
  message: ChatMessage | { role: ChatMessageRole; content: string },
): message is ChatMessage {
  return "id" in message && "createdAt" in message;
}

/**
 * Convert ChatMessageRole enum to AI SDK compatible role
 * Converts TOOL messages to proper AI SDK tool result format
 * Converts ERROR -> ASSISTANT (so errors stay in chain)
 */
function toAiSdkMessage(
  message: ChatMessage | { role: ChatMessageRole; content: string },
): CoreMessage | null {
  switch (message.role) {
    case ChatMessageRole.USER:
      return { content: message.content, role: "user" };
    case ChatMessageRole.ASSISTANT:
      return { content: message.content, role: "assistant" };
    case ChatMessageRole.SYSTEM:
      return { content: message.content, role: "system" };
    case ChatMessageRole.TOOL:
      // Convert TOOL messages to proper AI SDK tool result format
      // The AI SDK expects tool results in assistant messages for proper multi-turn tool calling
      if ("metadata" in message && message.metadata?.toolCall) {
        const toolCall = message.metadata.toolCall;

        // Return tool result in AI SDK format
        // This allows the AI to properly understand the tool execution and continue with more tool calls
        const output = toolCall.error
          ? {
              type: "error-text" as const,
              // Serialize structured error for AI consumption
              value: JSON.stringify({
                message: toolCall.error.message,
                params: toolCall.error.messageParams,
              }),
            }
          : { type: "json" as const, value: toolCall.result ?? null };

        return {
          role: "assistant",
          content: [
            {
              type: "tool-result",
              toolCallId: toolCall.toolCallId, // Use actual AI SDK tool call ID for proper result matching
              toolName: toolCall.toolName,
              output,
            },
          ],
        };
      }
      // Skip TOOL messages without toolCall metadata
      return null;
    case ChatMessageRole.ERROR:
      // Error messages become ASSISTANT messages so they stay in the chain
      return { content: message.content, role: "assistant" };
  }
}

/**
 * Handle tool confirmation - execute tool and update message in DB/messageHistory
 */
async function handleToolConfirmationInSetup(params: {
  toolConfirmation: {
    messageId: string;
    confirmed: boolean;
    updatedArgs?: Record<string, string | number | boolean | null>;
  };
  messageHistory?: NonNullable<AiStreamPostRequestOutput["messageHistory"]>;
  isIncognito: boolean;
  userId: string | undefined;
  locale: CountryLanguage;
  logger: EndpointLogger;
  user: JwtPayloadType;
}): Promise<ResponseType<{ threadId: string; toolMessageId: string }>> {
  const {
    toolConfirmation,
    messageHistory,
    isIncognito,
    userId,
    locale,
    logger,
    user,
  } = params;

  // Find tool message in messageHistory (incognito) or DB
  let toolMessage: ChatMessage | undefined;

  if (isIncognito && messageHistory) {
    toolMessage = messageHistory.find(
      (msg) => msg.id === toolConfirmation.messageId,
    ) as ChatMessage | undefined;
  } else if (userId) {
    const [dbMessage] = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.id, toolConfirmation.messageId))
      .limit(1);
    toolMessage = dbMessage as ChatMessage | undefined;
  }

  if (!toolMessage) {
    logger.error("[Tool Confirmation] Message not found", {
      messageId: toolConfirmation.messageId,
      isIncognito,
    });
    return fail({
      message:
        "app.api.agent.chat.aiStream.post.toolConfirmation.errors.messageNotFound",
      errorType: ErrorResponseTypes.NOT_FOUND,
    });
  }

  const toolCall = toolMessage.metadata?.toolCall as ToolCall | undefined;
  if (!toolCall) {
    logger.error("[Tool Confirmation] ToolCall metadata missing");
    return fail({
      message:
        "app.api.agent.chat.aiStream.post.toolConfirmation.errors.toolCallMissing",
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }

  if (toolConfirmation.confirmed) {
    // Execute tool with updated args
    const finalArgs = toolConfirmation.updatedArgs
      ? {
          ...(toolCall.args as Record<
            string,
            string | number | boolean | null
          >),
          ...toolConfirmation.updatedArgs,
        }
      : toolCall.args;

    // Load and execute tool
    // Note: Tool confirmation already happened - this is executing the confirmed tool
    // So we pass an empty confirmation config (no tools need confirmation)
    const toolsResult = await loadTools({
      requestedTools: [toolCall.toolName],
      user,
      locale,
      logger,
      systemPrompt: "",
      toolConfirmationConfig: new Map(), // Empty - tool already confirmed
    });

    const toolEntry = Object.entries(toolsResult.tools ?? {}).find(
      ([name]) =>
        name === toolCall.toolName || name.endsWith(`/${toolCall.toolName}`),
    );

    if (!toolEntry) {
      logger.error("[Tool Confirmation] Tool not found", {
        toolName: toolCall.toolName,
      });
      return fail({
        message:
          "app.api.agent.chat.aiStream.post.toolConfirmation.errors.toolNotFound",
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    interface ToolExecuteOptions {
      toolCallId: string;
      messages: Array<{ role: ChatMessageRole; content: string }>;
      abortSignal: AbortSignal;
    }
    const [, tool] = toolEntry as [
      string,
      {
        execute?: (
          args: ToolCallResult,
          options: ToolExecuteOptions,
        ) => Promise<ToolCallResult>;
      },
    ];
    let toolResult: ToolCallResult | undefined;
    let toolError: MessageResponseType | undefined;

    try {
      if (tool?.execute) {
        toolResult = await tool.execute(finalArgs, {
          toolCallId: toolConfirmation.messageId,
          messages: [],
          abortSignal: AbortSignal.timeout(60000),
        });
      } else {
        toolError = {
          message: "app.api.agent.chat.aiStream.errors.toolExecutionError",
          messageParams: { error: "Tool does not have execute method" },
        };
      }
    } catch (error) {
      toolError = {
        message: "app.api.agent.chat.aiStream.errors.toolExecutionError",
        messageParams: {
          error: error instanceof Error ? error.message : String(error),
        },
      };
    }

    // Update tool message with result
    const updatedToolCall: ToolCall = {
      ...toolCall,
      args: finalArgs as ToolCallResult,
      result: toolResult,
      error: toolError,
      isConfirmed: true,
      waitingForConfirmation: false,
    };

    // Update in DB (non-incognito) or messageHistory (incognito - handled by client)
    if (!isIncognito && userId) {
      await db
        .update(chatMessages)
        .set({
          metadata: { toolCall: updatedToolCall },
          updatedAt: new Date(),
        })
        .where(eq(chatMessages.id, toolConfirmation.messageId));
    } else if (isIncognito && messageHistory) {
      // Update in messageHistory array for incognito mode
      const msgIndex = messageHistory.findIndex(
        (msg) => msg.id === toolConfirmation.messageId,
      );
      if (msgIndex >= 0) {
        messageHistory[msgIndex].metadata = { toolCall: updatedToolCall };
      }
    }

    logger.info("[Tool Confirmation] Tool executed", {
      hasResult: !!toolResult,
      hasError: !!toolError,
    });
  } else {
    // User rejected - update with structured error that includes the input args
    const rejectedToolCall: ToolCall = {
      ...toolCall,
      args: toolCall.args, // Keep original args for display
      isConfirmed: false,
      waitingForConfirmation: false,
      error: {
        message: "app.api.agent.chat.aiStream.errors.userDeclinedTool",
      },
    };

    if (!isIncognito && userId) {
      await db
        .update(chatMessages)
        .set({
          metadata: { toolCall: rejectedToolCall },
          updatedAt: new Date(),
        })
        .where(eq(chatMessages.id, toolConfirmation.messageId));
    } else if (isIncognito && messageHistory) {
      const msgIndex = messageHistory.findIndex(
        (msg) => msg.id === toolConfirmation.messageId,
      );
      if (msgIndex >= 0) {
        messageHistory[msgIndex].metadata = { toolCall: rejectedToolCall };
      }
    }

    logger.info("[Tool Confirmation] Tool rejected by user");
  }

  return {
    success: true,
    data: {
      threadId: toolMessage.threadId,
      toolMessageId: toolConfirmation.messageId,
    },
  };
}

function toAiSdkMessages(
  messages: Array<ChatMessage | { role: ChatMessageRole; content: string }>,
  rootFolderId?: DefaultFolderId,
  upcomingResponseContext?: { model: string; character: string | null },
): CoreMessage[] {
  const result: CoreMessage[] = [];

  for (const msg of messages) {
    // Inject metadata system message before user/assistant messages
    // Only for full ChatMessage objects (not simple { role, content } objects)
    if (
      isChatMessage(msg) &&
      (msg.role === ChatMessageRole.USER ||
        msg.role === ChatMessageRole.ASSISTANT)
    ) {
      const metadataContent = createMetadataSystemMessage(msg, rootFolderId);
      result.push({
        role: "system",
        content: metadataContent,
      });
    }

    // Convert and add the actual message
    const converted = toAiSdkMessage(msg);
    if (converted !== null) {
      result.push(converted);
    }
  }

  // Add context for the upcoming assistant response at the END
  // This tells the model what config will be used for its response
  // and explicitly instructs not to echo this metadata
  if (upcomingResponseContext) {
    const parts: string[] = [];
    parts.push(`Model:${upcomingResponseContext.model}`);
    if (upcomingResponseContext.character) {
      parts.push(`Character:${upcomingResponseContext.character}`);
    }
    result.push({
      role: "system",
      content: `[Your response context: ${parts.join(" | ")}] DO NOT include this in your response.`,
    });
  }

  return result;
}

/**
 * Process and upload file attachments to storage adapter
 * Validates file types and uploads files in parallel
 */
async function processFileAttachments(params: {
  attachments: File[];
  threadId: string;
  userMessageId: string;
  userId: string | undefined;
  logger: EndpointLogger;
}): Promise<
  | {
      success: false;
      error: ResponseType<never>;
    }
  | {
      success: true;
      data: Array<{
        id: string;
        url: string;
        filename: string;
        mimeType: string;
        size: number;
      }>;
    }
> {
  const { attachments, threadId, userMessageId, userId, logger } = params;

  const { getStorageAdapter } = await import("../../chat/storage");
  const { isAllowedFileType } = await import("../../chat/incognito/file-utils");
  const storage = getStorageAdapter();

  logger.info("[File Processing] Uploading file attachments to storage", {
    fileCount: attachments.length,
  });

  const processedAttachments: Array<{
    id: string;
    url: string;
    filename: string;
    mimeType: string;
    size: number;
  }> = [];

  for (const file of attachments) {
    // Validate file type
    if (!isAllowedFileType(file.type)) {
      logger.error("[File Processing] File type not allowed", {
        filename: file.name,
        mimeType: file.type,
      });
      return {
        success: false,
        error: fail({
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
          message: "app.api.shared.errorTypes.validation_error",
          messageParams: {
            issue: `File type not allowed: ${file.type}`,
          },
        }),
      };
    }

    const result = await storage.uploadFile(file, {
      filename: file.name,
      mimeType: file.type,
      threadId,
      messageId: userMessageId,
      userId,
    });
    processedAttachments.push({
      id: result.fileId,
      url: result.url,
      filename: result.metadata.originalFilename,
      mimeType: result.metadata.mimeType,
      size: result.metadata.size,
    });
  }

  logger.info("[File Processing] File attachments uploaded successfully", {
    uploadedCount: processedAttachments.length,
  });

  return {
    success: true,
    data: processedAttachments,
  };
}
