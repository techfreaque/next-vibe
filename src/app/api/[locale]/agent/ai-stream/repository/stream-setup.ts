/**
 * AI Stream Setup
 * Handles validation, credit checks, and preparation before streaming
 */

import "server-only";

import type { CoreMessage } from "ai";
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
import { defaultLocale } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TFunction } from "@/i18n/core/static-types";

import { db } from "../../../system/db";
import type { DefaultFolderId } from "../../chat/config";
import { type ChatMessage, chatMessages, type ToolCall, type ToolCallResult } from "../../chat/db";
import { ChatMessageRole } from "../../chat/enum";
import { getModelCost } from "../../chat/model-access/costs";
import {
  calculateMessageDepth,
  createUserMessage,
  fetchMessageHistory,
} from "../../chat/threads/[threadId]/messages/repository";
import { ensureThread } from "../../chat/threads/repository";
import { SpeechToTextRepository } from "../../speech-to-text/repository";
import { DEFAULT_TTS_VOICE, type TtsVoiceValue } from "../../text-to-speech/enum";
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
  { success: false; error: ResponseType<never> } | { success: true; data: StreamSetupResult }
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

  logger.debug("[Setup] RECOMPILED - Setting up AI stream", {
    operation: data.operation,
    model: data.model,
    rootFolderId: data.rootFolderId,
    isIncognito,
    userId,
    leadId,
    hasToolConfirmations: !!data.toolConfirmations && data.toolConfirmations.length > 0,
    toolConfirmationCount: data.toolConfirmations?.length ?? 0,
  });

  // Handle tool confirmations if present - execute tools and update messages
  const toolConfirmationResults: Array<{
    messageId: string;
    sequenceId: string;
    toolCall: ToolCall;
  }> = [];

  if (data.toolConfirmations && data.toolConfirmations.length > 0) {
    logger.debug("[Setup] Processing tool confirmations", {
      count: data.toolConfirmations.length,
      messageIds: data.toolConfirmations.map(
        (tc: { messageId: string; confirmed: boolean }) => tc.messageId,
      ),
    });

    // Process all confirmations and collect results
    for (const toolConfirmation of data.toolConfirmations) {
      const confirmResult = await handleToolConfirmationInSetup({
        toolConfirmation,
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

      // Get the updated message from database to retrieve the full toolCall data
      const updatedMessage = await db.query.chatMessages.findFirst({
        where: eq(chatMessages.id, toolConfirmation.messageId),
      });

      if (updatedMessage?.metadata?.toolCall) {
        toolConfirmationResults.push({
          messageId: toolConfirmation.messageId,
          sequenceId: updatedMessage.sequenceId ?? crypto.randomUUID(),
          toolCall: updatedMessage.metadata.toolCall,
        });
      }
    }

    logger.debug("[Setup] All tools executed - continuing with AI stream to process results", {
      resultsCount: toolConfirmationResults.length,
    });
    // Tools have been executed and messages updated with results
    // Continue with the normal flow to start AI stream
    // The tool results are now in the message history and AI will process them
  }

  if (!userId && !leadId && !isIncognito) {
    logger.error("User has neither userId nor leadId", {
      rootFolderId: data.rootFolderId,
    });
    return {
      success: false,
      error: fail({
        message: "app.api.agent.chat.aiStream.route.errors.authenticationRequired",
        errorType: ErrorResponseTypes.AUTH_ERROR,
      }),
    };
  }

  const modelCost = getModelCost(data.model);
  let validationResult;
  let effectiveLeadId = leadId;

  if (userId) {
    validationResult = await creditValidator.validateUserCredits(userId, data.model, logger);
  } else if (leadId) {
    validationResult = await creditValidator.validateLeadCredits(leadId, data.model, logger);
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
          message: "app.api.agent.chat.aiStream.route.errors.creditValidationFailed",
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
        message: "app.api.agent.chat.aiStream.route.errors.creditValidationFailed",
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
        logger.debug("[Setup] Audio input detected, transcribing...", {
          operation: data.operation,
          fileSize: data.audioInput.file.size,
          fileType: data.audioInput.file.type,
        });

        const transcriptionResult = await SpeechToTextRepository.transcribeAudio(
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
        logger.debug("[Setup] Audio transcription successful", {
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
      logger.debug("Answer-as-AI operation", {
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
      errorConstructor: error instanceof Error ? error.constructor.name : "unknown",
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

  const messageDepth = await calculateMessageDepth(effectiveParentMessageId, isIncognito);

  // Check if we have tool confirmations (don't need userMessageId in this case)
  const hasToolConfirmations = data.toolConfirmations && data.toolConfirmations.length > 0;

  // Only require userMessageId if we're NOT doing answer-as-ai AND NOT doing tool confirmations
  if (!data.userMessageId && data.operation !== "answer-as-ai" && !hasToolConfirmations) {
    logger.error("User message ID must be provided by client", data.userMessageId);
    return {
      success: false,
      error: fail({
        message: "app.api.agent.chat.aiStream.route.errors.invalidJson",
        errorType: ErrorResponseTypes.BAD_REQUEST,
      }),
    };
  }

  // For "answer-as-ai", we don't create a user message, so userMessageId should be the parent message
  // This ensures the AI message uses parentMessageId as its parent, not a non-existent userMessageId
  const userMessageId = data.operation === "answer-as-ai" ? null : data.userMessageId;
  if (data.operation !== "answer-as-ai" && !hasToolConfirmations) {
    logger.debug("[Setup] Creating user message", {
      messageId: userMessageId,
      operation: data.operation,
      threadId: threadResult.threadId,
    });

    // For incognito mode with messageHistory, user message is already created client-side
    // Skip server-side message creation to avoid duplicates
    if (isIncognito && data.messageHistory) {
      logger.debug("[Setup] ✅ SKIPPING user message creation for incognito with messageHistory", {
        messageId: userMessageId,
        operation: data.operation,
        messageHistoryLength: data.messageHistory.length,
      });
    } else {
      // At this point, userMessageId should not be null since we only skip creation for answer-as-ai
      if (!userMessageId) {
        logger.error("userMessageId is required for user message creation");
        return {
          success: false,
          error: fail({
            message: "app.api.agent.chat.aiStream.route.errors.invalidJson",
            errorType: ErrorResponseTypes.BAD_REQUEST,
          }),
        };
      }

      const authorName = isIncognito
        ? null
        : await UserRepository.getUserPublicName(userId, logger);

      if (!isIncognito) {
        // Start file upload in background if there are attachments
        // Process file attachments if present
        // For NEW threads: convert to base64 for immediate AI use + upload to storage in background
        let attachmentMetadata: Array<{
          id: string;
          url: string;
          filename: string;
          mimeType: string;
          size: number;
          data?: string; // base64 for immediate AI use
        }> = [];

        if (data.attachments && data.attachments.length > 0) {
          logger.debug("[File Processing] Uploading file attachments to storage", {
            fileCount: data.attachments.length,
          });

          // Convert to base64 immediately for AI (like incognito mode)
          attachmentMetadata = await Promise.all(
            data.attachments.map(async (file) => {
              const buffer = Buffer.from(await file.arrayBuffer());
              return {
                id: "", // Will be updated after upload
                url: "", // Will be updated after upload
                filename: file.name,
                mimeType: file.type,
                size: file.size,
                data: buffer.toString("base64"), // For immediate AI use
              };
            }),
          );

          // Upload to storage in background and capture promise for SSE event emission
          fileUploadPromise = processFileAttachments({
            attachments: data.attachments,
            threadId: threadResult.threadId,
            userMessageId,
            userId,
            logger,
          }).then(async (result) => {
            try {
              if (result.success) {
                // Update message with permanent URLs only (no base64 in DB)
                await db
                  .update(chatMessages)
                  .set({
                    metadata: {
                      attachments: result.data,
                    },
                  })
                  .where(eq(chatMessages.id, userMessageId));

                logger.debug("[File Processing] Message updated with attachments", {
                  messageId: userMessageId,
                  attachmentCount: result.data.length,
                });

                return {
                  success: true,
                  userMessageId,
                  attachments: result.data,
                };
              } else {
                logger.error("[File Processing] Failed to upload attachments to storage", {
                  messageId: userMessageId,
                  errorMessage: result.error.message,
                });

                return {
                  success: false,
                  userMessageId,
                };
              }
            } catch (error) {
              logger.error("[File Processing] Error updating message", {
                messageId: userMessageId,
                error: parseError(error),
              });

              return {
                success: false,
                userMessageId,
              };
            }
          });
        }

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
          attachments: attachmentMetadata.length > 0 ? attachmentMetadata : undefined,
        });
      }
    }
  } else if (hasToolConfirmations) {
    logger.debug("[Setup] ✅ SKIPPING user message creation for tool confirmations", {
      count: data.toolConfirmations?.length ?? 0,
      operation: data.operation,
    });
  } else {
    // Only answer-as-ai should reach here now
    logger.debug("[Setup] ✅ SKIPPING user message creation", {
      operation: data.operation,
      reason: "answer-as-ai operation",
    });
  }

  // Extract user message metadata (for both incognito and server mode)
  let userMessageMetadata:
    | {
        attachments?: Array<{
          id: string;
          url: string;
          filename: string;
          mimeType: string;
          size: number;
          data?: string;
        }>;
      }
    | undefined;

  if (isIncognito) {
    // Priority 1: Check if attachments are provided as File objects (retry/branch operations)
    if (data.attachments && data.attachments.length > 0) {
      const attachmentMetadata = await Promise.all(
        data.attachments.map(async (file) => {
          const buffer = Buffer.from(await file.arrayBuffer());
          return {
            id: "", // No ID for incognito
            url: "", // No URL for incognito
            filename: file.name,
            mimeType: file.type,
            size: file.size,
            data: buffer.toString("base64"),
          };
        }),
      );
      userMessageMetadata = {
        attachments: attachmentMetadata,
      };
      logger.debug("[Setup] Converted incognito attachments to base64 for AI", {
        attachmentCount: attachmentMetadata.length,
        operation: data.operation,
      });
    }
    // Priority 2: Check if the user message with attachments is in messageHistory
    else if (data.messageHistory && data.messageHistory.length > 0) {
      const userMessage = data.messageHistory.find((msg) => msg.id === userMessageId);
      if (userMessage?.metadata?.attachments) {
        userMessageMetadata = {
          attachments: userMessage.metadata.attachments,
        };
        logger.debug("[Setup] Extracted user message metadata from messageHistory", {
          messageId: userMessageId,
          attachmentCount: userMessage.metadata.attachments.length,
        });
      }
    }
  } else if (!isIncognito && data.attachments && data.attachments.length > 0) {
    // For NEW server threads, convert attachments to base64 for immediate AI use
    logger.debug("[Setup] Converting server thread attachments to base64 for AI", {
      attachmentCount: data.attachments.length,
      isIncognito,
    });
    const attachmentMetadata = await Promise.all(
      data.attachments.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        return {
          id: "", // Will be updated after upload
          url: "", // Will be updated after upload
          filename: file.name,
          mimeType: file.type,
          size: file.size,
          data: buffer.toString("base64"),
        };
      }),
    );
    userMessageMetadata = {
      attachments: attachmentMetadata,
    };
    logger.debug("[Setup] Converted NEW server thread attachments to base64 for AI", {
      attachmentCount: attachmentMetadata.length,
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
    callMode: data.voiceMode?.enabled,
  });

  logger.debug("System prompt built", {
    systemPromptLength: systemPrompt.length,
    hasCharacter: !!data.character,
  });

  logger.debug("[Setup] *** ABOUT TO CALL buildMessageContext ***", {
    hasUserMessageMetadata: !!userMessageMetadata,
    userMessageMetadataAttachmentCount: userMessageMetadata?.attachments?.length ?? 0,
    isIncognito,
    userId,
    threadId: effectiveThreadId,
  });

  // Get message history (past messages only)
  const historyMessages = await buildMessageContext({
    operation: data.operation,
    threadId: effectiveThreadId,
    parentMessageId: data.parentMessageId,
    content: effectiveContent,
    role: effectiveRole,
    userId,
    isIncognito,
    rootFolderId: data.rootFolderId,
    messageHistory: data.messageHistory ?? undefined,
    logger,
    upcomingResponseContext: { model: data.model, character: data.character },
    userMessageMetadata,
  });

  // Add new user message from content/attachments (unless it's answer-as-ai or tool confirmations)
  const messages = [...historyMessages];
  if (data.operation !== "answer-as-ai" && !hasToolConfirmations && effectiveContent.trim()) {
    const currentMessage = await toAiSdkMessage(
      userMessageMetadata
        ? {
            role: effectiveRole,
            content: effectiveContent,
            metadata: userMessageMetadata,
          }
        : {
            role: effectiveRole,
            content: effectiveContent,
          },
    );
    if (currentMessage) {
      // toAiSdkMessage can return a single message or an array - handle both
      if (Array.isArray(currentMessage)) {
        messages.push(...currentMessage);
      } else {
        messages.push(currentMessage);
      }
      logger.debug("[Setup] Added new user message to context", {
        role: effectiveRole,
        hasMetadata: !!userMessageMetadata,
        attachmentCount: userMessageMetadata?.attachments?.length ?? 0,
      });
    }
  }

  // CRITICAL FIX: Add tool confirmation results to message history
  // Tool messages are created in DB AFTER buildMessageContext is called (during streaming)
  // So we need to manually add them here from toolConfirmationResults
  if (hasToolConfirmations && toolConfirmationResults.length > 0) {
    logger.debug("[Setup] Adding tool confirmation results to message history", {
      count: toolConfirmationResults.length,
    });

    for (const result of toolConfirmationResults) {
      const toolCall = result.toolCall;

      // Convert to AI SDK format - BOTH assistant tool-call AND tool result
      // Translate error messages for AI (using default locale for consistency)
      const output = toolCall.error
        ? {
            type: "error-text" as const,
            value:
              toolCall.error.message === "app.api.agent.chat.aiStream.errors.userDeclinedTool"
                ? simpleT(defaultLocale).t(toolCall.error.message)
                : JSON.stringify({
                    message: toolCall.error.message,
                    params: toolCall.error.messageParams,
                  }),
          }
        : { type: "json" as const, value: toolCall.result ?? null };

      // Add ASSISTANT message with tool-call
      messages.push({
        role: "assistant",
        content: [
          {
            type: "tool-call",
            toolCallId: toolCall.toolCallId,
            toolName: toolCall.toolName,
            input: toolCall.args,
          },
        ],
      });

      // Add TOOL message with tool-result
      messages.push({
        role: "tool",
        content: [
          {
            type: "tool-result",
            toolCallId: toolCall.toolCallId,
            toolName: toolCall.toolName,
            output,
          },
        ],
      });
    }

    logger.debug("[Setup] Added tool confirmation results to messages", {
      totalMessages: messages.length,
    });
  }

  if (!isIncognito && systemPrompt && messages.length > 0 && messages[0].role !== "system") {
    messages.unshift({ role: "system", content: systemPrompt });
  }

  const aiMessageId = crypto.randomUUID();
  logger.debug("Generated AI message ID", {
    messageId: aiMessageId,
    operation: data.operation,
    isIncognito,
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
      systemPrompt,
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
  messageHistory?: ChatMessage[];
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
  params.logger.debug("[BuildMessageContext] === FUNCTION CALLED ===", {
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
    params.logger.error("Security violation: messageHistory provided for non-incognito thread", {
      operation: params.operation,
      threadId: params.threadId,
      isIncognito: params.isIncognito,
    });
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Security violation should throw immediately
    throw new Error(
      "messageHistory is only allowed for incognito mode. Server-side threads fetch history from database.",
    );
  }

  if (params.operation === "answer-as-ai") {
    if (params.isIncognito && params.messageHistory) {
      return await toAiSdkMessages(
        params.messageHistory,
        params.rootFolderId,
        params.upcomingResponseContext,
      );
    }

    if (!params.isIncognito && params.userId && params.threadId && params.parentMessageId) {
      const allMessages = await db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.threadId, params.threadId))
        .orderBy(chatMessages.createdAt);

      const parentIndex = allMessages.findIndex((msg) => msg.id === params.parentMessageId);

      if (parentIndex !== -1) {
        const contextMessages = allMessages.slice(0, parentIndex + 1);
        return await toAiSdkMessages(
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
            const base64Data = await storage.readFileAsBase64(attachment.id, params.threadId);
            if (base64Data) {
              attachment.data = base64Data;
              params.logger.debug("[BuildMessageContext] Fetched file data for attachment", {
                attachmentId: attachment.id,
                filename: attachment.filename,
              });
            }
          }
        }
      }
    }

    // Return ONLY past messages - new message comes from content/attachments params
    const historyMessages = await toAiSdkMessages(
      history,
      params.rootFolderId,
      params.upcomingResponseContext,
    );
    params.logger.debug("[BuildMessageContext] Returning history for server mode", {
      historyLength: historyMessages.length,
    });
    return historyMessages;
  } else if (params.isIncognito && params.messageHistory) {
    // Incognito mode: Return ONLY past messages - new message comes from content/attachments params
    params.logger.debug("Using provided message history for incognito mode", {
      operation: params.operation,
      historyLength: params.messageHistory.length,
    });
    const historyMessages = await toAiSdkMessages(
      params.messageHistory,
      params.rootFolderId,
      params.upcomingResponseContext,
    );
    params.logger.debug("[BuildMessageContext] Returning history for incognito mode", {
      historyLength: historyMessages.length,
    });
    return historyMessages;
  }

  params.logger.debug("[BuildMessageContext] No history (new conversation)", {
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
 * Returns an array when a single DB message needs to be expanded into multiple AI SDK messages (e.g., tool-call + tool-result)
 */
async function toAiSdkMessage(
  message: ChatMessage | { role: ChatMessageRole; content: string },
): Promise<CoreMessage | CoreMessage[] | null> {
  switch (message.role) {
    case ChatMessageRole.USER: {
      // Check if message has attachments
      if (
        "metadata" in message &&
        message.metadata?.attachments &&
        message.metadata.attachments.length > 0
      ) {
        const contentParts: Array<
          { type: "text"; text: string } | { type: "image"; image: string | URL }
        > = [];

        // Add text content if present
        if (message.content) {
          contentParts.push({ type: "text", text: message.content });
        }

        // DEBUG: Log attachment processing
        // oxlint-disable-next-line no-console
        console.error("=== PROCESSING USER MESSAGE WITH ATTACHMENTS ===");
        // oxlint-disable-next-line no-console
        console.error("Attachment count:", message.metadata.attachments.length);
        // oxlint-disable-next-line no-console
        console.error(
          "Attachments:",
          JSON.stringify(
            message.metadata.attachments.map((a) => ({
              filename: a.filename,
              mimeType: a.mimeType,
              hasData: "data" in a && !!a.data,
              hasUrl: !!a.url,
              dataLength: "data" in a && a.data ? a.data.length : 0,
            })),
          ),
        );

        // Add attachments
        for (const attachment of message.metadata.attachments) {
          // Get base64 data - either from attachment.data or from URL
          let base64Data: string | null = null;

          if ("data" in attachment && attachment.data) {
            // First message: has base64 data directly
            base64Data = attachment.data;
          } else if (attachment.url) {
            // Message from history: fetch from URL and convert to base64
            try {
              // oxlint-disable-next-line no-console
              console.error("Fetching attachment from URL for AI context:", attachment.url);
              const response = await fetch(attachment.url);
              if (response.ok) {
                const buffer = await response.arrayBuffer();
                base64Data = Buffer.from(buffer).toString("base64");
                // oxlint-disable-next-line no-console
                console.error("Successfully fetched and converted attachment to base64");
              } else {
                // oxlint-disable-next-line no-console
                console.error("Failed to fetch attachment:", response.status, response.statusText);
              }
            } catch (error) {
              // oxlint-disable-next-line no-console
              console.error("Error fetching attachment from URL:", error);
            }
          }

          if (base64Data) {
            if (attachment.mimeType.startsWith("image/")) {
              // Images: Add as image part
              contentParts.push({
                type: "image",
                image: `data:${attachment.mimeType};base64,${base64Data}`,
              });
              // oxlint-disable-next-line no-console
              console.error("Added image part:", attachment.filename);
            } else if (
              attachment.mimeType.startsWith("text/") ||
              attachment.mimeType === "application/json" ||
              attachment.mimeType === "application/xml"
            ) {
              // Text files: Decode and add as text part
              try {
                const decoded = Buffer.from(base64Data, "base64").toString("utf-8");
                contentParts.push({
                  type: "text",
                  text: `\n\n[File: ${attachment.filename}]\n${decoded}\n[End of file]`,
                });
                // oxlint-disable-next-line no-console
                console.error("Added text file as text part:", attachment.filename);
              } catch (error) {
                // oxlint-disable-next-line no-console
                console.error("Failed to decode text attachment:", attachment.filename, error);
              }
            }
          }
        }

        // oxlint-disable-next-line no-console
        console.error("Final content parts:", contentParts.length, "parts");
        // oxlint-disable-next-line no-console
        console.error(
          "Content parts structure:",
          JSON.stringify(
            contentParts.map((p) => ({
              type: p.type,
              ...(p.type === "text"
                ? { text: p.text }
                : {
                    imageLength: typeof p.image === "string" ? p.image.length : "URL",
                  }),
            })),
          ),
        );

        return { content: contentParts, role: "user" };
      }

      return { content: message.content ?? "", role: "user" };
    }
    case ChatMessageRole.ASSISTANT:
      if (!message.content || !message.content.trim()) {
        return null;
      }
      return { content: message.content.trim(), role: "assistant" };
    case ChatMessageRole.SYSTEM:
      return { content: message.content ?? "", role: "system" };
    case ChatMessageRole.TOOL:
      // Convert TOOL messages to proper AI SDK format
      if ("metadata" in message && message.metadata?.toolCall) {
        const toolCall = message.metadata.toolCall;

        // Check if this TOOL message has a result or error (executed)
        // If yes, we need to return BOTH: ASSISTANT with tool-call AND TOOL with tool-result
        // If no, return only ASSISTANT with tool-call
        if (toolCall.result || toolCall.error) {
          // Tool has been executed - return BOTH messages for AI SDK
          // Message 1: ASSISTANT message with tool-call (the request)
          // Message 2: TOOL message with tool-result (the response)
          // Translate error messages for AI (using default locale for consistency)
          const output = toolCall.error
            ? {
                type: "error-text" as const,
                value:
                  toolCall.error.message === "app.api.agent.chat.aiStream.errors.userDeclinedTool"
                    ? simpleT(defaultLocale).t(toolCall.error.message)
                    : JSON.stringify({
                        message: toolCall.error.message,
                        params: toolCall.error.messageParams,
                      }),
              }
            : { type: "json" as const, value: toolCall.result ?? null };

          return [
            // Message 1: Assistant's tool call
            {
              role: "assistant",
              content: [
                {
                  type: "tool-call",
                  toolCallId: toolCall.toolCallId,
                  toolName: toolCall.toolName,
                  input: toolCall.args,
                },
              ],
            },
            // Message 2: Tool result
            {
              role: "tool",
              content: [
                {
                  type: "tool-result",
                  toolCallId: toolCall.toolCallId,
                  toolName: toolCall.toolName,
                  output,
                },
              ],
            },
          ];
        } else {
          // Tool has not been executed yet - convert to ASSISTANT message with tool-call only
          return {
            role: "assistant",
            content: [
              {
                type: "tool-call",
                toolCallId: toolCall.toolCallId,
                toolName: toolCall.toolName,
                input: toolCall.args,
              },
            ],
          };
        }
      }
      // Skip TOOL messages without toolCall metadata
      return null;
    case ChatMessageRole.ERROR:
      return { content: message.content ?? "", role: "assistant" };
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
  messageHistory?: ChatMessage[];
  isIncognito: boolean;
  userId: string | undefined;
  locale: CountryLanguage;
  logger: EndpointLogger;
  user: JwtPayloadType;
}): Promise<ResponseType<{ threadId: string; toolMessageId: string }>> {
  const { toolConfirmation, messageHistory, isIncognito, userId, locale, logger, user } = params;

  logger.debug("[Tool Confirmation] handleToolConfirmationInSetup called", {
    messageId: toolConfirmation.messageId,
    confirmed: toolConfirmation.confirmed,
    hasUpdatedArgs: !!toolConfirmation.updatedArgs,
  });

  // Find tool message in messageHistory (incognito) or DB
  let toolMessage: ChatMessage | undefined;

  if (isIncognito && messageHistory) {
    toolMessage = messageHistory.find((msg) => msg.id === toolConfirmation.messageId) as
      | ChatMessage
      | undefined;
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
      message: "app.api.agent.chat.aiStream.post.toolConfirmation.errors.messageNotFound",
      errorType: ErrorResponseTypes.NOT_FOUND,
    });
  }

  const toolCall = toolMessage.metadata?.toolCall as ToolCall | undefined;
  if (!toolCall) {
    logger.error("[Tool Confirmation] ToolCall metadata missing");
    return fail({
      message: "app.api.agent.chat.aiStream.post.toolConfirmation.errors.toolCallMissing",
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }

  if (toolConfirmation.confirmed) {
    // Execute tool with updated args
    const finalArgs = toolConfirmation.updatedArgs
      ? {
          ...(toolCall.args as Record<string, string | number | boolean | null>),
          ...toolConfirmation.updatedArgs,
        }
      : toolCall.args;

    // Load and execute tool
    // Note: Tool confirmation already happened - this is executing the confirmed tool
    // Pass toolConfirmationConfig with requiresConfirmation=false to prevent re-checking
    // This signals to the tool that confirmation already happened and it should execute immediately
    const confirmationConfig = new Map<string, boolean>();
    confirmationConfig.set(toolCall.toolName, false); // false = no confirmation needed (already confirmed)

    const toolsResult = await loadTools({
      requestedTools: [toolCall.toolName],
      user,
      locale,
      logger,
      systemPrompt: "",
      toolConfirmationConfig: confirmationConfig,
    });

    const toolEntry = Object.entries(toolsResult.tools ?? {}).find(
      ([name]) => name === toolCall.toolName || name.endsWith(`/${toolCall.toolName}`),
    );

    if (!toolEntry) {
      logger.error("[Tool Confirmation] Tool not found", {
        toolName: toolCall.toolName,
      });
      return fail({
        message: "app.api.agent.chat.aiStream.post.toolConfirmation.errors.toolNotFound",
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
        execute?: (args: ToolCallResult, options: ToolExecuteOptions) => Promise<ToolCallResult>;
      },
    ];
    let toolResult: ToolCallResult | undefined;
    let toolError: MessageResponseType | undefined;

    logger.debug("[Tool Confirmation] Executing tool", {
      toolName: toolCall.toolName,
      hasExecuteMethod: !!tool?.execute,
      finalArgs,
    });

    try {
      if (tool?.execute) {
        toolResult = await tool.execute(finalArgs, {
          toolCallId: toolConfirmation.messageId,
          messages: [],
          abortSignal: AbortSignal.timeout(60000),
        });
        logger.debug("[Tool Confirmation] Tool execution completed", {
          toolName: toolCall.toolName,
          hasResult: !!toolResult,
        });
      } else {
        logger.error("[Tool Confirmation] Tool missing execute method", {
          toolName: toolCall.toolName,
        });
        toolError = {
          message: "app.api.agent.chat.aiStream.errors.toolExecutionError",
          messageParams: { error: "Tool does not have execute method" },
        };
      }
    } catch (error) {
      logger.error("[Tool Confirmation] Tool execution failed", {
        toolName: toolCall.toolName,
        error: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
      });
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
      const msgIndex = messageHistory.findIndex((msg) => msg.id === toolConfirmation.messageId);
      if (msgIndex >= 0) {
        messageHistory[msgIndex].metadata = { toolCall: updatedToolCall };
      }
    }

    logger.debug("[Tool Confirmation] Tool executed", {
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
      const msgIndex = messageHistory.findIndex((msg) => msg.id === toolConfirmation.messageId);
      if (msgIndex >= 0) {
        messageHistory[msgIndex].metadata = { toolCall: rejectedToolCall };
      }
    }

    logger.debug("[Tool Confirmation] Tool rejected by user");
  }

  return {
    success: true,
    data: {
      threadId: toolMessage.threadId,
      toolMessageId: toolConfirmation.messageId,
    },
  };
}

async function toAiSdkMessages(
  messages: ChatMessage[],
  rootFolderId?: DefaultFolderId,
  upcomingResponseContext?: { model: string; character: string | null },
): Promise<CoreMessage[]> {
  const result: CoreMessage[] = [];

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];

    // Inject metadata system message before user/assistant messages
    // Only for full ChatMessage objects (not simple { role, content } objects)
    if (
      isChatMessage(msg) &&
      (msg.role === ChatMessageRole.USER || msg.role === ChatMessageRole.ASSISTANT)
    ) {
      const metadataContent = createMetadataSystemMessage(msg, rootFolderId);
      result.push({
        role: "system",
        content: metadataContent,
      });
    }

    // Convert and add the actual message
    // toAiSdkMessage can return a single message, an array of messages, or null
    const converted = await toAiSdkMessage(msg);
    if (converted !== null) {
      // If it's an array, flatten it into the result
      if (Array.isArray(converted)) {
        result.push(...converted);
      } else {
        result.push(converted);
      }
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
      content: `[Your response context: ${parts.join(" | ")}]`,
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

  logger.debug("[File Processing] Uploading file attachments to storage", {
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

  logger.debug("[File Processing] File attachments uploaded successfully", {
    uploadedCount: processedAttachments.length,
  });

  return {
    success: true,
    data: processedAttachments,
  };
}
