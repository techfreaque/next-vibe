/**
 * AI Stream Repository
 * Handles AI streaming chat functionality with thread/message creation
 */

import "server-only";

import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { type JSONValue, stepCountIs, streamText } from "ai";
import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import {
  createStreamingResponse,
  ErrorResponseTypes,
  type MessageResponseType,
  type ResponseType,
  type StreamingResponse,
} from "next-vibe/shared/types/response.schema";

import { agentEnv } from "@/app/api/[locale]/agent/env";
import { CreditRepository } from "@/app/api/[locale]/credits/repository";
import { db } from "@/app/api/[locale]/system/db";
import { getFullPath } from "@/app/api/[locale]/system/generated/endpoint";
import type { CoreTool } from "@/app/api/[locale]/system/unified-interface/ai/tools-loader";
import { loadTools } from "@/app/api/[locale]/system/unified-interface/ai/tools-loader";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import { parseError } from "../../../shared/utils";
import type { DefaultFolderId } from "../../chat/config";
import { chatMessages, type ToolCall, type ToolCallResult } from "../../chat/db";
import { ChatMessageRole } from "../../chat/enum";
import { ApiProvider, getModelById, type ModelId } from "../../chat/model-access/models";
import {
  createErrorMessage,
  createTextMessage,
  createToolMessage,
  updateMessageContent,
} from "../../chat/threads/[threadId]/messages/repository";
import type { AiStreamPostRequestOutput, AiStreamPostResponseOutput } from "../definition";
import { createStreamEvent, formatSSEEvent } from "../events";
import { createFreedomGPT } from "../providers/freedomgpt";
import { createGabAI } from "../providers/gab-ai";
import { createUncensoredAI } from "../providers/uncensored-ai";
import { setupAiStream } from "./stream-setup";
import { createStreamingTTSHandler, type StreamingTTSHandler } from "./streaming-tts";

/**
 * Maximum duration for streaming responses (in seconds)
 */
export const maxDuration = 300; // 5 minutes for multi-step tool calling

/**
 * AI Stream Repository Interface
 */
export interface IAiStreamRepository {
  createAiStream(params: {
    data: AiStreamPostRequestOutput;
    t: TFunction;
    locale: CountryLanguage;
    logger: EndpointLogger;
    user: JwtPayloadType;
    request: NextRequest | undefined;
  }): Promise<ResponseType<AiStreamPostResponseOutput> | StreamingResponse>;
}

/**
 * Type guard for tool result values
 * Validates that value is JSON-serializable and matches ToolCallResult type
 * Accepts JSONValue from AI SDK which is the type used for tool inputs/outputs
 */
function isValidToolResult(value: JSONValue): value is ToolCallResult {
  if (value === null) {
    return true; // null is a valid tool result
  }
  if (value === undefined) {
    return false; // ToolCallResult does not include undefined
  }
  if (typeof value === "string") {
    return true;
  }
  if (typeof value === "number") {
    return true;
  }
  if (typeof value === "boolean") {
    return true;
  }
  if (Array.isArray(value)) {
    // Arrays are valid - recursively check elements

    return value.every((item) => isValidToolResult(item));
  }
  if (typeof value === "object") {
    // Objects are valid - recursively check values

    return Object.values(value).every((v) => isValidToolResult(v));
  }
  // Reject functions, symbols, etc.
  return false;
}

/**
 * Extract user identifiers from request
 */
function extractUserIdentifiers(
  user: JwtPayloadType,
  request: NextRequest | undefined,
): {
  userId?: string;
  leadId?: string;
  ipAddress?: string;
} {
  const userId = !user.isPublic && "id" in user ? user.id : undefined;
  const leadId = "leadId" in user && typeof user.leadId === "string" ? user.leadId : undefined;
  const ipAddress = request
    ? request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined
    : "cli";

  return { userId, leadId, ipAddress };
}

/**
 * AI Stream Repository Implementation
 */
class AiStreamRepository implements IAiStreamRepository {
  /**
   * Create AI streaming response with SSE events
   * Returns StreamingResponse for SSE stream or error ResponseType
   */
  async createAiStream({
    data,
    t,
    locale,
    logger,
    user,
    request,
  }: {
    data: AiStreamPostRequestOutput;
    t: TFunction;
    locale: CountryLanguage;
    logger: EndpointLogger;
    user: JwtPayloadType;
    request: NextRequest | undefined;
  }): Promise<ResponseType<AiStreamPostResponseOutput> | StreamingResponse> {
    const { userId, leadId, ipAddress } = extractUserIdentifiers(user, request);

    const setupResult = await setupAiStream({
      data,
      locale,
      logger,
      user,
      userId,
      leadId,
      ipAddress,
      t,
    });

    if (!setupResult.success) {
      return setupResult.error;
    }

    const {
      isIncognito,
      modelCost,
      effectiveParentMessageId,
      effectiveContent,
      effectiveRole,
      threadId: threadResultThreadId,
      isNewThread,
      messageDepth,
      userMessageId,
      messages,
      systemPrompt: initialSystemPrompt,
      toolConfirmationResults,
      voiceMode,
      voiceTranscription,
      userMessageMetadata,
      fileUploadPromise,
    } = setupResult.data;

    let systemPrompt = initialSystemPrompt;

    // Step 9: Start AI streaming (for all operations including answer-as-ai)
    try {
      const modelConfig = getModelById(data.model);

      const {
        tools,
        toolsConfig,
        systemPrompt: updatedSystemPrompt,
      } = await this.setupStreamingTools({
        model: data.model,
        requestedTools: data.tools,
        user,
        locale,
        logger,
        systemPrompt,
        toolConfirmationResults,
      });
      systemPrompt = updatedSystemPrompt;

      // Configure provider based on model
      const provider = this.getProviderForModel(data.model, logger);

      logger.info("[AI Stream] Starting OpenRouter stream", {
        model: data.model,
        hasTools: !!tools,
        toolCount: tools ? Object.keys(tools).length : 0,
        requestedTools: data.tools,
        supportsTools: modelConfig?.supportsTools,
      });

      // Create SSE stream
      const encoder = new TextEncoder();

      // Track parent/depth/sequence for error handling (accessible in catch block)
      let lastParentId: string | null = null;
      let lastDepth = 0;
      let lastSequenceId: string | null = null;

      // Create abort controller for this stream - combines request signal with timeout
      const streamAbortController = new AbortController();
      const timeoutAbortController = AbortSignal.timeout(maxDuration * 1000);

      // Abort our controller when timeout fires
      const timeoutAbortHandler = (): void => {
        streamAbortController.abort(new Error("Stream timeout"));
      };
      timeoutAbortController.addEventListener("abort", timeoutAbortHandler);

      // Also abort if client disconnects (request signal)
      if (request?.signal) {
        const requestAbortHandler = (): void => {
          streamAbortController.abort(new Error("Client disconnected"));
        };
        request.signal.addEventListener("abort", requestAbortHandler);
      }

      const stream = new ReadableStream({
        async start(controller): Promise<void> {
          // Create streaming TTS handler if voice mode enabled
          let ttsHandler: StreamingTTSHandler | null = null;
          if (voiceMode?.enabled) {
            ttsHandler = createStreamingTTSHandler({
              controller,
              encoder,
              logger,
              locale,
              voice: voiceMode.voice,
              userId,
              enabled: true,
            });
            logger.info("[AI Stream] Voice mode enabled - streaming TTS active", {
              voice: voiceMode.voice,
              enabled: voiceMode.enabled,
            });
          }

          try {
            // Emit initial events and capture which tool results were already emitted
            // This prevents duplicate TOOL_RESULT emissions during streaming
            const emittedToolResultIds = AiStreamRepository.emitInitialEvents({
              isNewThread,
              threadId: threadResultThreadId,
              rootFolderId: data.rootFolderId,
              subFolderId: data.subFolderId || null,
              // Use effectiveContent for thread title (includes transcribed text for voice input)
              content: effectiveContent,
              operation: data.operation,
              userMessageId,
              effectiveRole,
              effectiveParentMessageId,
              messageDepth,
              effectiveContent,
              toolConfirmationResults,
              voiceTranscription,
              userMessageMetadata,
              controller,
              encoder,
              logger,
            });

            // Handle file upload promise in background (server threads only)
            // When upload completes, emit FILES_UPLOADED event to update UI
            if (fileUploadPromise && userMessageId) {
              void fileUploadPromise
                .then((result) => {
                  if (result.success && result.attachments) {
                    logger.info(
                      "[File Processing] File upload completed - emitting FILES_UPLOADED event",
                      {
                        messageId: result.userMessageId,
                        attachmentCount: result.attachments.length,
                      },
                    );

                    // Emit FILES_UPLOADED event to update UI with attachment metadata
                    const filesUploadedEvent = createStreamEvent.filesUploaded({
                      messageId: result.userMessageId,
                      attachments: result.attachments,
                    });

                    try {
                      controller.enqueue(encoder.encode(formatSSEEvent(filesUploadedEvent)));
                      logger.info("[File Processing] FILES_UPLOADED event emitted", {
                        messageId: result.userMessageId,
                        attachmentCount: result.attachments.length,
                      });
                    } catch (error) {
                      logger.error("[File Processing] Failed to emit FILES_UPLOADED event", {
                        error: parseError(error),
                        messageId: result.userMessageId,
                      });
                    }
                  } else {
                    logger.warn("[File Processing] File upload failed - no event emitted", {
                      messageId: result.userMessageId,
                      success: result.success,
                    });
                  }
                  return undefined;
                })
                .catch((error) => {
                  logger.error("[File Processing] File upload promise rejected", {
                    error: parseError(error),
                    messageId: userMessageId,
                  });
                });
            }

            // Calculate initial parent and depth for AI message
            // This will be updated if reasoning occurs
            // IMPORTANT: Always prefer userMessageId when available (works for both incognito and server-persisted threads)
            // For send/retry/edit: userMessageId is the user message that should be the parent
            // For answer-as-ai: no user message, so fall back to effectiveParentMessageId
            const initialAiParentId = userMessageId ?? effectiveParentMessageId ?? null;
            const initialAiDepth = userMessageId ? messageDepth + 1 : messageDepth;

            // Don't emit AI message-created event yet
            // We'll emit it when we start getting content, so we can set the correct parent
            // (if there's reasoning, the AI message should be a child of the reasoning message)

            // Start streaming
            // Single ASSISTANT message with inline <think> tags
            // Only interrupted by tool calls
            let currentAssistantMessageId: string | null = null; // Current ASSISTANT message being streamed
            let currentAssistantContent = ""; // Accumulated content (reasoning + text with <think> tags inline)
            // Track multiple TOOL messages (created on tool-call, stored on tool-result)
            // Key: toolCallId from AI SDK, Value: { messageId, toolCallData }
            const pendingToolMessages = new Map<
              string,
              {
                messageId: string;
                toolCallData: {
                  toolCall: ToolCall;
                  parentId: string | null;
                  depth: number;
                };
              }
            >();
            let isInReasoningBlock = false; // Track if we're inside <think></think> tags

            // Track if any tools in current step require confirmation
            // When true, we'll abort the stream at finish-step (after all tool calls are processed)
            let stepHasToolsAwaitingConfirmation = false;

            // Track message sequencing - all messages in this response share the same sequenceId
            // CRITICAL: When continuing after tool confirmation, reuse the original sequenceId
            // so all messages (tool + response) are grouped together in the UI
            const lastConfirmedTool = toolConfirmationResults[toolConfirmationResults.length - 1];
            const sequenceId = lastConfirmedTool?.sequenceId ?? crypto.randomUUID();
            logger.info("[AI Stream] Sequence ID initialized", {
              sequenceId,
              isToolContinuation: !!lastConfirmedTool,
              toolMessageId: lastConfirmedTool?.messageId,
              confirmedToolCount: toolConfirmationResults.length,
            });

            // Track the current parent for chaining messages
            // This gets updated as we create reasoning messages and tool calls
            // IMPORTANT: For tool confirmation, the next ASSISTANT message should be child of the LAST TOOL message
            let currentParentId: string | null = lastConfirmedTool?.messageId ?? initialAiParentId;
            let currentDepth = lastConfirmedTool ? messageDepth + 1 : initialAiDepth;

            // Update last known values for error handling
            lastSequenceId = sequenceId;
            lastParentId = currentParentId;
            lastDepth = currentDepth;

            // Log message structure being sent to AI SDK
            logger.info("[AI Stream] Messages structure for AI SDK", {
              messageCount: messages.length,
              messageRoles: messages.map((m, i) => `${i}:${m.role}`).join(", "),
              lastFiveMessages: messages.slice(-5).map((m, i) => ({
                idx: messages.length - 5 + i,
                role: m.role,
                contentType: typeof m.content,
                contentPreview:
                  typeof m.content === "string"
                    ? m.content.slice(0, 80)
                    : Array.isArray(m.content)
                      ? `${m.content.length} parts: ${m.content.map((p) => ("type" in p ? p.type : "unknown")).join(",")}`
                      : "unknown",
              })),
            });

            const streamResult = streamText({
              model: provider.chat(modelConfig.openRouterModel),
              messages,
              temperature: data.temperature,
              abortSignal: streamAbortController.signal,
              system: systemPrompt || undefined,
              ...(tools
                ? {
                    tools,
                    // Enable multi-step tool calling loop - AI can call tools up to 50 times
                    stopWhen: stepCountIs(50),
                    onStepFinish: (): void => {
                      // Tool arguments are already sent via tool-call stream events
                    },
                  }
                : {}),
            });

            for await (const part of streamResult.fullStream) {
              if (part.type === "finish-step") {
                // Finalize current ASSISTANT message before resetting for next step
                if (currentAssistantMessageId && currentAssistantContent) {
                  const usage = await streamResult.usage;
                  const finishReason = await streamResult.finishReason;

                  await AiStreamRepository.finalizeAssistantMessage({
                    currentAssistantMessageId,
                    currentAssistantContent,
                    isInReasoningBlock,
                    streamResult: {
                      finishReason,
                      usage,
                    },
                    isIncognito,
                    controller,
                    encoder,
                    logger,
                  });
                }

                // Check if any tools in this step require confirmation
                // If yes, abort stream AFTER all tool calls have been processed
                if (stepHasToolsAwaitingConfirmation) {
                  logger.info(
                    "[AI Stream] Step complete - tools require confirmation, aborting stream",
                    {
                      toolCallsInStep: pendingToolMessages.size,
                    },
                  );

                  // Abort the stream to stop the AI SDK from processing further
                  streamAbortController.abort(new Error("Tool requires user confirmation"));

                  // Close the controller to stop sending events to client
                  controller.close();

                  // Exit the loop - stream is done until user confirms
                  return;
                }

                // After a step finishes, update currentParentId/currentDepth to point to the last message
                // The next ASSISTANT message should be a CHILD of the last tool message, so increment depth
                logger.info("[AI Stream] Step finished - updating parent chain", {
                  oldParentId: currentParentId,
                  newParentId: lastParentId,
                  oldDepth: currentDepth,
                  newDepth: lastDepth + 1,
                });
                currentParentId = lastParentId;
                currentDepth = lastDepth + 1;

                // Reset currentAssistantMessageId so the next step creates a new ASSISTANT message
                currentAssistantMessageId = null;
                currentAssistantContent = "";

                // Reset confirmation tracking for next step
                stepHasToolsAwaitingConfirmation = false;
              } else if (part.type === "text-delta") {
                const result = await AiStreamRepository.processTextDelta({
                  textDelta: part.text,
                  currentAssistantMessageId,
                  currentAssistantContent,
                  threadId: threadResultThreadId,
                  currentParentId,
                  currentDepth,
                  model: data.model,
                  character: data.character,
                  sequenceId,
                  isIncognito,
                  userId,
                  controller,
                  encoder,
                  logger,
                  ttsHandler,
                });
                currentAssistantMessageId = result.currentAssistantMessageId;
                currentAssistantContent = result.currentAssistantContent;

                // If a new ASSISTANT message was created, update currentParentId/currentDepth
                // Note: TTS handler messageId is already set inside processTextDelta
                if (result.wasCreated) {
                  currentParentId = result.currentAssistantMessageId;
                  currentDepth = result.newDepth;
                  lastParentId = result.currentAssistantMessageId;
                  lastDepth = result.newDepth;
                }
              } else if (part.type === "reasoning-start") {
                isInReasoningBlock = true;
                const result = await AiStreamRepository.processReasoningStart({
                  currentAssistantMessageId,
                  currentAssistantContent,
                  threadId: threadResultThreadId,
                  currentParentId,
                  currentDepth,
                  model: data.model,
                  character: data.character,
                  sequenceId,
                  isIncognito,
                  userId,
                  controller,
                  encoder,
                  logger,
                });
                currentAssistantMessageId = result.currentAssistantMessageId;
                currentAssistantContent = result.currentAssistantContent;

                // If a new ASSISTANT message was created, update currentParentId/currentDepth
                if (result.wasCreated) {
                  currentParentId = result.currentAssistantMessageId;
                  currentDepth = result.newDepth;
                  lastParentId = result.currentAssistantMessageId;
                  lastDepth = result.newDepth;
                }
              } else if (part.type === "reasoning-delta") {
                const reasoningText = "text" in part ? part.text : "";
                currentAssistantContent = AiStreamRepository.processReasoningDelta({
                  reasoningText,
                  currentAssistantMessageId,
                  currentAssistantContent,
                  controller,
                  encoder,
                  logger,
                });
              } else if (part.type === "reasoning-end") {
                if (isInReasoningBlock) {
                  currentAssistantContent = AiStreamRepository.processReasoningEnd({
                    currentAssistantMessageId,
                    currentAssistantContent,
                    controller,
                    encoder,
                    logger,
                  });
                  isInReasoningBlock = false;
                }
              } else if (part.type === "tool-call") {
                if (
                  "toolCallId" in part &&
                  "toolName" in part &&
                  typeof part.toolCallId === "string" &&
                  typeof part.toolName === "string"
                ) {
                  const result = await AiStreamRepository.processToolCall({
                    part: {
                      type: "tool-call",
                      toolCallId: part.toolCallId,
                      toolName: part.toolName,
                      input: "input" in part ? (part.input as JSONValue) : undefined,
                    },
                    currentAssistantMessageId,
                    currentAssistantContent,
                    isInReasoningBlock,
                    threadId: threadResultThreadId,
                    currentParentId,
                    currentDepth,
                    model: data.model,
                    character: data.character,
                    sequenceId,
                    isIncognito,
                    userId,
                    toolsConfig,
                    streamAbortController,
                    controller,
                    encoder,
                    logger,
                  });
                  currentAssistantMessageId = result.currentAssistantMessageId;
                  currentAssistantContent = result.currentAssistantContent;
                  isInReasoningBlock = result.isInReasoningBlock;

                  // Track if this tool requires confirmation
                  if (result.requiresConfirmation) {
                    stepHasToolsAwaitingConfirmation = true;
                    logger.info(
                      "[AI Stream] Tool requires confirmation - will abort at finish-step",
                      {
                        toolName: part.toolName,
                        messageId: result.pendingToolMessage.messageId,
                      },
                    );
                  }

                  // Update currentParentId/currentDepth to chain each tool call to the previous message
                  // This creates: USER → ASSISTANT → TOOL1 → TOOL2 → ASSISTANT (next step)
                  // The next tool call should be a child of THIS tool message
                  currentParentId = result.pendingToolMessage.messageId;
                  currentDepth = result.pendingToolMessage.toolCallData.depth;

                  // Track the last tool message for the next step
                  lastParentId = result.pendingToolMessage.messageId;
                  lastDepth = result.pendingToolMessage.toolCallData.depth;

                  pendingToolMessages.set(part.toolCallId, result.pendingToolMessage);
                }
              } else if (part.type === "tool-error") {
                if (
                  "toolCallId" in part &&
                  "toolName" in part &&
                  typeof part.toolCallId === "string" &&
                  typeof part.toolName === "string"
                ) {
                  const pending = pendingToolMessages.get(part.toolCallId);
                  const result = await AiStreamRepository.processToolError({
                    part: {
                      type: "tool-error",
                      toolCallId: part.toolCallId,
                      toolName: part.toolName,
                      error: "error" in part ? (part.error as JSONValue) : undefined,
                    },
                    pendingToolMessage: pending,
                    threadId: threadResultThreadId,
                    model: data.model,
                    character: data.character,
                    sequenceId,
                    isIncognito,
                    userId,
                    controller,
                    encoder,
                    logger,
                  });
                  if (result) {
                    currentParentId = result.currentParentId;
                    currentDepth = result.currentDepth;
                    lastParentId = result.currentParentId;
                    lastDepth = result.currentDepth;
                    pendingToolMessages.delete(part.toolCallId);
                  }
                }
              } else if (
                part.type === "tool-result" &&
                "toolCallId" in part &&
                "toolName" in part &&
                typeof part.toolCallId === "string" &&
                typeof part.toolName === "string"
              ) {
                const pending = pendingToolMessages.get(part.toolCallId);
                const result = await AiStreamRepository.processToolResult({
                  part: {
                    type: "tool-result",
                    toolCallId: part.toolCallId,
                    toolName: part.toolName,
                    output: "output" in part ? (part.output as JSONValue) : undefined,
                    isError: "isError" in part ? Boolean(part.isError) : false,
                  },
                  pendingToolMessage: pending,
                  threadId: threadResultThreadId,
                  model: data.model,
                  character: data.character,
                  sequenceId,
                  isIncognito,
                  userId,
                  controller,
                  encoder,
                  logger,
                  emittedToolResultIds,
                });
                if (result) {
                  // Update currentParentId/currentDepth for the next tool call
                  // But DON'T update lastParentId/lastDepth here because tool results
                  // can arrive in any order (async). lastParentId/lastDepth should only
                  // be updated when tool CALLS arrive (which is the correct order).
                  currentParentId = result.currentParentId;
                  currentDepth = result.currentDepth;
                  pendingToolMessages.delete(part.toolCallId);
                }
              }
            }

            // Wait for completion to get final usage stats
            const usage = await streamResult.usage;
            const finishReason = await streamResult.finishReason;

            logger.info("[AI Stream] Before finalization check", {
              hasCurrentAssistantMessageId: !!currentAssistantMessageId,
              currentAssistantMessageId,
              hasCurrentAssistantContent: !!currentAssistantContent,
              currentAssistantContentLength: currentAssistantContent.length,
              currentAssistantContentPreview: currentAssistantContent.slice(0, 100),
            });

            // Finalize current ASSISTANT message if exists
            if (currentAssistantMessageId && currentAssistantContent) {
              logger.info("[AI Stream] Calling finalizeAssistantMessage", {
                messageId: currentAssistantMessageId,
                contentLength: currentAssistantContent.length,
              });
              await AiStreamRepository.finalizeAssistantMessage({
                currentAssistantMessageId,
                currentAssistantContent,
                isInReasoningBlock,
                streamResult: {
                  finishReason,
                  usage,
                },
                isIncognito,
                controller,
                encoder,
                logger,
              });
            } else {
              logger.warn("[AI Stream] Skipping finalization", {
                hasCurrentAssistantMessageId: !!currentAssistantMessageId,
                hasCurrentAssistantContent: !!currentAssistantContent,
              });
            }

            // Flush TTS handler to emit any remaining audio
            if (ttsHandler) {
              await ttsHandler.flush();
              logger.info("[AI Stream] TTS handler flushed");
            }

            logger.info("[AI Stream] Stream completed", {
              totalTokens: usage.totalTokens,
            });

            // Deduct credits AFTER successful completion (not optimistically)
            await AiStreamRepository.deductCreditsAfterCompletion({
              modelCost,
              user,
              model: data.model,
              logger,
            });

            controller.close();
          } catch (error) {
            // Check if this is a graceful abort (user stopped generation or tool confirmation required)
            // DO NOT catch AI_NoOutputGeneratedError here - it could be a provider validation error
            if (
              error instanceof Error &&
              (error.name === "AbortError" ||
                error.message === "Client disconnected" ||
                error.message === "Tool requires user confirmation")
            ) {
              logger.info("[AI Stream] Stream aborted", {
                message: error.message,
                errorName: error.name,
                reason:
                  error.message === "Tool requires user confirmation"
                    ? "waiting_for_tool_confirmation"
                    : "client_disconnected",
              });
              // Controller is already closed in processToolCall for tool confirmation
              // Only close if not already closed
              if (error.message !== "Tool requires user confirmation") {
                // Emit a stopped event to inform the frontend
                const stoppedEvent = createStreamEvent.contentDone({
                  messageId: lastSequenceId ?? "",
                  content: "",
                  totalTokens: null,
                  finishReason: "stop",
                });
                controller.enqueue(encoder.encode(formatSSEEvent(stoppedEvent)));
                controller.close();
              }
              return;
            }

            // Check if this is a timeout error
            if (error instanceof Error && error.message === "Stream timeout") {
              logger.error("[AI Stream] Stream timed out", {
                message: error.message,
                maxDuration: `${maxDuration} seconds`,
                model: data.model,
                threadId: threadResultThreadId,
                hasContent: !!lastSequenceId,
              });

              // Create a timeout-specific error message for the UI
              const timeoutError: MessageResponseType = {
                message: "app.api.agent.chat.aiStream.errors.timeout",
                messageParams: { seconds: String(maxDuration) },
              };

              // Create ERROR message in DB if not incognito
              const errorMessageId = crypto.randomUUID();
              if (!isIncognito) {
                const { serializeError } = await import("../error-utils");
                await createErrorMessage({
                  messageId: errorMessageId,
                  threadId: threadResultThreadId,
                  content: serializeError(timeoutError),
                  errorType: "TIMEOUT_ERROR",
                  parentId: lastParentId,
                  depth: lastDepth,
                  userId,
                  sequenceId: lastSequenceId,
                  logger,
                });
              }

              // Emit ERROR message event for UI
              const { serializeError } = await import("../error-utils");
              const errorMessageEvent = createStreamEvent.messageCreated({
                messageId: errorMessageId,
                threadId: threadResultThreadId,
                role: ChatMessageRole.ERROR,
                content: serializeError(timeoutError),
                parentId: lastParentId,
                depth: lastDepth,
                sequenceId: lastSequenceId,
              });
              controller.enqueue(encoder.encode(formatSSEEvent(errorMessageEvent)));

              // Emit error event to update UI state
              const errorEvent = createStreamEvent.error({
                code: "TIMEOUT_ERROR",
                message: `Stream timed out after ${maxDuration} seconds. The response may have been too long.`,
              });
              controller.enqueue(encoder.encode(formatSSEEvent(errorEvent)));
              controller.close();
              return;
            }

            // All other errors (including AI_NoOutputGeneratedError from provider validation)
            // should be sent to the frontend as error messages
            await AiStreamRepository.handleStreamError({
              error: error instanceof Error ? error : (error as JSONValue),
              threadId: threadResultThreadId,
              isIncognito,
              userId,
              lastParentId,
              lastDepth,
              lastSequenceId,
              controller,
              encoder,
              logger,
            });
          }
        },

        // Handle client disconnect - abort the stream
        cancel(reason): void {
          logger.info("[AI Stream] Stream cancelled by client", {
            reason: String(reason),
          });
          streamAbortController.abort(new Error("Client disconnected"));
        },
      });

      return createStreamingResponse(
        new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        }),
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error("Failed to create AI stream", {
        error: errorMessage,
        model: data.model,
      });

      return {
        success: false,
        message: "app.api.agent.chat.aiStream.route.errors.streamCreationFailed",
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        messageParams: {
          error: errorMessage,
        },
      };
    }
  }
  /**
   * Deduct credits after successful AI response
   */
  static async deductCreditsAfterCompletion(params: {
    modelCost: number;
    user: JwtPayloadType;
    model: ModelId;
    logger: EndpointLogger;
  }): Promise<void> {
    await CreditRepository.deductCreditsForFeature(
      params.user,
      params.modelCost,
      params.model,
      params.logger,
    );
  }

  /**
   * Get the appropriate provider for a given model
   */
  private getProviderForModel(
    model: ModelId,
    logger: EndpointLogger,
  ): ReturnType<
    | typeof createOpenRouter
    | typeof createUncensoredAI
    | typeof createFreedomGPT
    | typeof createGabAI
  > {
    const modelOption = getModelById(model);

    switch (modelOption.apiProvider) {
      case ApiProvider.UNCENSORED_AI:
        return createUncensoredAI({
          apiKey: agentEnv.UNCENSORED_AI_API_KEY,
          logger,
        });

      case ApiProvider.FREEDOMGPT:
        return createFreedomGPT();

      case ApiProvider.GAB_AI:
        return createGabAI();

      default:
        return createOpenRouter({
          apiKey: agentEnv.OPENROUTER_API_KEY,
        });
    }
  }

  /**
   * Setup tools for OpenRouter streaming
   * Returns tools and updated system prompt
   */
  private async setupStreamingTools(params: {
    model: ModelId;
    requestedTools: Array<{ toolId: string; requiresConfirmation: boolean }> | null | undefined;
    user: JwtPayloadType;
    locale: CountryLanguage;
    logger: EndpointLogger;
    systemPrompt: string;
    toolConfirmationResults: Array<{
      messageId: string;
      sequenceId: string;
      toolCall: ToolCall;
    }>;
  }): Promise<{
    tools: Record<string, CoreTool> | undefined;
    toolsConfig: Map<string, { requiresConfirmation: boolean }>;
    systemPrompt: string;
  }> {
    const modelConfig = getModelById(params.model);

    if (!modelConfig?.supportsTools) {
      return {
        tools: undefined,
        toolsConfig: new Map(),
        systemPrompt: params.systemPrompt,
      };
    }

    // Extract tool IDs and build confirmation config map
    const toolIds = params.requestedTools?.map((t) => t.toolId) ?? null;

    // Build confirmed tools set for quick lookup
    const confirmedToolNames = new Set(
      params.toolConfirmationResults.map((r) => r.toolCall.toolName),
    );

    // Build toolConfirmationConfig map BEFORE calling loadTools
    // Map tool IDs to their confirmation requirements (from API request)
    const toolConfirmationConfig = new Map<string, boolean>();
    if (params.requestedTools) {
      for (const toolConfig of params.requestedTools) {
        // Map tool alias/path to AI SDK tool name using getFullPath
        const aiSdkToolName = getFullPath(toolConfig.toolId);
        if (aiSdkToolName) {
          // If this tool was just confirmed, DON'T require confirmation again
          // This prevents the infinite loop where the AI calls the same tool again after confirmation
          const isConfirmedTool = confirmedToolNames.has(aiSdkToolName);

          toolConfirmationConfig.set(
            aiSdkToolName,
            isConfirmedTool ? false : toolConfig.requiresConfirmation,
          );
        }
      }
    }

    const toolsResult = await loadTools({
      requestedTools: toolIds,
      user: params.user,
      locale: params.locale,
      logger: params.logger,
      systemPrompt: params.systemPrompt,
      toolConfirmationConfig,
    });

    // Build toolsConfig map using AI SDK tool names (not aliases)
    // The loadTools function returns tools with AI SDK names like 'v1_core_agent_brave-search_GET'
    // We need to map tool aliases to their AI SDK names using getFullPath
    const toolsConfig = new Map<string, { requiresConfirmation: boolean }>();
    if (toolsResult.tools && params.requestedTools) {
      for (const toolConfig of params.requestedTools) {
        // Map tool alias/path to AI SDK tool name using getFullPath
        const aiSdkToolName = getFullPath(toolConfig.toolId);
        if (aiSdkToolName && toolsResult.tools[aiSdkToolName]) {
          // If this tool was just confirmed, DON'T require confirmation again
          const isConfirmedTool = confirmedToolNames.has(aiSdkToolName);

          toolsConfig.set(aiSdkToolName, {
            requiresConfirmation: isConfirmedTool ? false : toolConfig.requiresConfirmation,
          });
        }
      }
    }

    params.logger.info("[AI Stream] Tools loaded", {
      toolCount: toolsResult.tools ? Object.keys(toolsResult.tools).length : 0,
      hasTools: !!toolsResult.tools,
      requestedTools: toolIds,
    });

    return {
      tools: toolsResult.tools,
      toolsConfig,
      systemPrompt: toolsResult.systemPrompt,
    };
  }

  /**
   * Emit initial stream events (thread creation and user message)
   */
  static emitInitialEvents(params: {
    isNewThread: boolean;
    threadId: string;
    rootFolderId: DefaultFolderId;
    subFolderId: string | null;
    content: string;
    operation: "send" | "retry" | "edit" | "answer-as-ai";
    userMessageId: string | null;
    effectiveRole: ChatMessageRole;
    effectiveParentMessageId: string | null | undefined;
    messageDepth: number;
    effectiveContent: string;
    controller: ReadableStreamDefaultController<Uint8Array>;
    encoder: TextEncoder;
    logger: EndpointLogger;
    toolConfirmationResults: Array<{
      messageId: string;
      sequenceId: string;
      toolCall: ToolCall;
    }>;
    /** Voice transcription metadata (when audio input was transcribed) */
    voiceTranscription?: {
      wasTranscribed: boolean;
      confidence: number | null;
      durationSeconds: number | null;
    } | null;
    /** User message metadata (including attachments) */
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
  }): Set<string> | undefined {
    const {
      isNewThread,
      threadId,
      userMessageId,
      effectiveContent,
      controller,
      encoder,
      logger,
      toolConfirmationResults,
      voiceTranscription,
    } = params;

    // Thread is already created client-side before API call
    // No need to emit THREAD_CREATED event (obsolete in Phase 2 architecture)
    logger.debug("Thread handling", {
      threadId,
      isNew: isNewThread,
      note: "Thread already created client-side",
    });

    // Emit VOICE_TRANSCRIBED event if audio was transcribed
    // Voice transcription only happens for "send" operations where userMessageId is not null
    if (voiceTranscription?.wasTranscribed && userMessageId) {
      logger.debug("Emitting VOICE_TRANSCRIBED event", {
        messageId: userMessageId,
        textLength: effectiveContent.length,
        confidence: voiceTranscription.confidence,
      });
      const voiceTranscribedEvent = createStreamEvent.voiceTranscribed({
        messageId: userMessageId,
        text: effectiveContent,
        confidence: voiceTranscription.confidence,
        durationSeconds: voiceTranscription.durationSeconds,
      });
      controller.enqueue(encoder.encode(formatSSEEvent(voiceTranscribedEvent)));
      logger.debug("VOICE_TRANSCRIBED event emitted");
    }

    // Emit TOOL_RESULT events for batch confirmations to update frontend
    // These are needed to show execution state (success/error) in UI immediately
    if (toolConfirmationResults && toolConfirmationResults.length > 0) {
      logger.debug("✅ Emitting TOOL_RESULT events for batch confirmations", {
        count: toolConfirmationResults.length,
        messageIds: toolConfirmationResults.map((r) => r.messageId),
      });

      // Track message IDs that we've emitted TOOL_RESULT for
      // This prevents duplicate emissions during AI streaming
      const emittedToolResults = new Set<string>();

      for (const result of toolConfirmationResults) {
        const toolResultEvent = createStreamEvent.toolResult({
          messageId: result.messageId,
          toolName: result.toolCall.toolName,
          result: result.toolCall.result,
          error: result.toolCall.error,
          toolCall: result.toolCall,
        });
        controller.enqueue(encoder.encode(formatSSEEvent(toolResultEvent)));
        emittedToolResults.add(result.messageId);

        logger.debug("TOOL_RESULT event emitted for batch confirmation", {
          messageId: result.messageId,
          toolName: result.toolCall.toolName,
          hasResult: !!result.toolCall.result,
          hasError: !!result.toolCall.error,
        });
      }

      // Return this set so it can be used during streaming to prevent duplicate emissions
      return emittedToolResults;
    }
    return undefined;
  }

  /**
   * Emit content delta event for streaming
   */
  static emitContentDelta(params: {
    messageId: string;
    delta: string;
    controller: ReadableStreamDefaultController<Uint8Array>;
    encoder: TextEncoder;
    logger: EndpointLogger;
  }): void {
    const { messageId, delta, controller, encoder, logger } = params;

    logger.debug("[AI Stream] Emitting CONTENT_DELTA", {
      messageId,
      deltaLength: delta.length,
      delta: delta.slice(0, 50),
    });

    const deltaEvent = createStreamEvent.contentDelta({
      messageId,
      delta,
    });
    controller.enqueue(encoder.encode(formatSSEEvent(deltaEvent)));
  }

  /**
   * Create new ASSISTANT message in stream
   * Returns the new message ID and content
   */
  static async createAssistantMessage(params: {
    initialContent: string;
    threadId: string;
    parentId: string | null;
    depth: number;
    model: ModelId;
    character: string;
    sequenceId: string;
    isIncognito: boolean;
    userId: string | undefined;
    controller: ReadableStreamDefaultController<Uint8Array>;
    encoder: TextEncoder;
    logger: EndpointLogger;
  }): Promise<{ messageId: string; content: string }> {
    const {
      initialContent,
      threadId,
      parentId,
      depth,
      model,
      character,
      sequenceId,
      isIncognito,
      userId,
      controller,
      encoder,
      logger,
    } = params;

    const messageId = crypto.randomUUID();

    logger.info("[AI Stream] Creating ASSISTANT message", {
      messageId,
      parentId,
      depth,
      sequenceId,
      threadId,
    });

    // Emit MESSAGE_CREATED event with empty content
    // Content will be streamed via CONTENT_DELTA events
    const messageEvent = createStreamEvent.messageCreated({
      messageId,
      threadId,
      role: ChatMessageRole.ASSISTANT,
      content: "",
      parentId,
      depth,
      model,
      character,
      sequenceId,
    });
    controller.enqueue(encoder.encode(formatSSEEvent(messageEvent)));

    logger.info("[AI Stream] MESSAGE_CREATED event sent for ASSISTANT", {
      messageId,
      isIncognito,
      contentLength: initialContent.length,
    });

    // Emit CONTENT_DELTA event for initial content to enable streaming
    if (initialContent) {
      AiStreamRepository.emitContentDelta({
        messageId,
        delta: initialContent,
        controller,
        encoder,
        logger,
      });
    }

    // Save ASSISTANT message to database if not incognito
    // IMPORTANT: Don't save empty messages to avoid clutter in the conversation
    // Empty messages will be saved later when content is added (via finalizeAssistantMessage)
    // Public users (userId undefined) are allowed - helper converts to null
    if (!isIncognito && initialContent) {
      const result = await createTextMessage({
        messageId,
        threadId,
        content: initialContent,
        parentId,
        depth,
        userId,
        model,
        character,
        sequenceId,
        logger,
      });
      if (!result.success) {
        logger.warn("Failed to persist ASSISTANT message - continuing stream", {
          messageId,
          error: result.message,
        });
      }
    } else if (!isIncognito && !initialContent) {
      logger.debug("Skipping database save for empty ASSISTANT message", {
        messageId,
        reason: "Message will be saved when content is added",
      });
    }

    logger.debug("ASSISTANT message created", {
      messageId,
    });

    return { messageId, content: initialContent };
  }

  /**
   * Finalize ASSISTANT message at stream end
   */
  static async finalizeAssistantMessage(params: {
    currentAssistantMessageId: string;
    currentAssistantContent: string;
    isInReasoningBlock: boolean;
    streamResult: {
      finishReason: Awaited<ReturnType<typeof streamText>["finishReason"]>;
      usage: Awaited<ReturnType<typeof streamText>["usage"]>;
    };
    isIncognito: boolean;
    controller: ReadableStreamDefaultController<Uint8Array>;
    encoder: TextEncoder;
    logger: EndpointLogger;
  }): Promise<void> {
    const {
      currentAssistantMessageId,
      isInReasoningBlock,
      streamResult,
      isIncognito,
      controller,
      encoder,
      logger,
    } = params;

    let { currentAssistantContent } = params;

    // If reasoning block is still open, close it at stream end
    if (isInReasoningBlock) {
      const thinkCloseTag = "</think>";
      currentAssistantContent += thinkCloseTag;

      // Emit closing tag delta
      const thinkCloseDelta = createStreamEvent.contentDelta({
        messageId: currentAssistantMessageId,
        delta: thinkCloseTag,
      });
      controller.enqueue(encoder.encode(formatSSEEvent(thinkCloseDelta)));
    }

    // Emit CONTENT_DONE event for ASSISTANT message
    // Wait for completion first to get tokens and finishReason
    const [finishReason, usage] = await Promise.all([
      streamResult.finishReason,
      streamResult.usage,
    ]);

    const contentDoneEvent = createStreamEvent.contentDone({
      messageId: currentAssistantMessageId,
      content: currentAssistantContent,
      totalTokens: usage.totalTokens ?? null,
      finishReason: finishReason || null,
    });
    controller.enqueue(encoder.encode(formatSSEEvent(contentDoneEvent)));

    // Update ASSISTANT message in database with final content and tokens
    // IMPORTANT: Message might not exist in DB if it was created with empty content
    // (empty messages are skipped in createAssistantMessage to avoid clutter)
    // So only update if there's actual content
    // Public users (userId undefined) are allowed - helper converts to null
    if (!isIncognito && currentAssistantContent) {
      await db
        .update(chatMessages)
        .set({
          content: currentAssistantContent.trim() || null, // Save null if content is empty/whitespace
          tokens: usage.totalTokens,
          updatedAt: new Date(),
        })
        .where(eq(chatMessages.id, currentAssistantMessageId));

      logger.debug("Updated ASSISTANT message in database", {
        messageId: currentAssistantMessageId,
        contentLength: currentAssistantContent.length,
      });
    } else if (!isIncognito && !currentAssistantContent) {
      logger.debug("Skipping database update for empty ASSISTANT message", {
        messageId: currentAssistantMessageId,
        reason: "Message has no content",
      });
    }

    logger.info("Finalized ASSISTANT message", {
      messageId: currentAssistantMessageId,
      contentLength: currentAssistantContent.length,
      tokens: usage.totalTokens,
    });
  }

  /**
   * Process text-delta event from stream
   */
  private static async processTextDelta(params: {
    textDelta: string;
    currentAssistantMessageId: string | null;
    currentAssistantContent: string;
    threadId: string;
    currentParentId: string | null;
    currentDepth: number;
    model: ModelId;
    character: string;
    sequenceId: string;
    isIncognito: boolean;
    userId: string | undefined;
    controller: ReadableStreamDefaultController<Uint8Array>;
    encoder: TextEncoder;
    logger: EndpointLogger;
    ttsHandler: StreamingTTSHandler | null;
  }): Promise<{
    currentAssistantMessageId: string;
    currentAssistantContent: string;
    wasCreated: boolean;
    newDepth: number;
  }> {
    const {
      textDelta,
      currentAssistantContent,
      threadId,
      currentParentId,
      currentDepth,
      model,
      character,
      sequenceId,
      isIncognito,
      userId,
      controller,
      encoder,
      logger,
      ttsHandler,
    } = params;

    let { currentAssistantMessageId } = params;

    if (textDelta !== undefined && textDelta !== null && textDelta !== "") {
      // Add text to current ASSISTANT message (or create if doesn't exist)
      if (!currentAssistantMessageId) {
        const result = await AiStreamRepository.createAssistantMessage({
          initialContent: textDelta,
          threadId,
          parentId: currentParentId,
          depth: currentDepth,
          model,
          character,
          sequenceId,
          isIncognito,
          userId,
          controller,
          encoder,
          logger,
        });
        currentAssistantMessageId = result.messageId;

        // IMPORTANT: Set messageId on TTS handler BEFORE calling addDelta
        // Otherwise the chunk will be skipped because messageId is not set
        if (ttsHandler) {
          ttsHandler.setMessageId(result.messageId);
          await ttsHandler.addDelta(textDelta);
        }

        return {
          currentAssistantMessageId,
          currentAssistantContent: result.content,
          wasCreated: true,
          newDepth: currentDepth,
        };
      }
      // Accumulate content
      const newContent = currentAssistantContent + textDelta;

      // Emit content-delta event
      AiStreamRepository.emitContentDelta({
        messageId: currentAssistantMessageId,
        delta: textDelta,
        controller,
        encoder,
        logger,
      });

      // Send delta to TTS handler for audio generation
      if (ttsHandler) {
        await ttsHandler.addDelta(textDelta);
      }

      return {
        currentAssistantMessageId,
        currentAssistantContent: newContent,
        wasCreated: false,
        newDepth: currentDepth,
      };
    }

    return {
      currentAssistantMessageId: currentAssistantMessageId!,
      currentAssistantContent,
      wasCreated: false,
      newDepth: currentDepth,
    };
  }

  /**
   * Process reasoning-start event from stream
   */
  private static async processReasoningStart(params: {
    currentAssistantMessageId: string | null;
    currentAssistantContent: string;
    threadId: string;
    currentParentId: string | null;
    currentDepth: number;
    model: ModelId;
    character: string;
    sequenceId: string;
    isIncognito: boolean;
    userId: string | undefined;
    controller: ReadableStreamDefaultController<Uint8Array>;
    encoder: TextEncoder;
    logger: EndpointLogger;
  }): Promise<{
    currentAssistantMessageId: string;
    currentAssistantContent: string;
    wasCreated: boolean;
    newDepth: number;
  }> {
    const {
      currentAssistantContent,
      threadId,
      currentParentId,
      currentDepth,
      model,
      character,
      sequenceId,
      isIncognito,
      userId,
      controller,
      encoder,
      logger,
    } = params;

    let { currentAssistantMessageId } = params;

    const thinkTag = "<think>";

    // Create ASSISTANT message if it doesn't exist yet
    if (!currentAssistantMessageId) {
      const result = await AiStreamRepository.createAssistantMessage({
        initialContent: thinkTag,
        threadId,
        parentId: currentParentId,
        depth: currentDepth,
        model,
        character,
        sequenceId,
        isIncognito,
        userId,
        controller,
        encoder,
        logger,
      });
      currentAssistantMessageId = result.messageId;
      return {
        currentAssistantMessageId,
        currentAssistantContent: result.content,
        wasCreated: true,
        newDepth: currentDepth,
      };
    }
    // Add <think> tag to existing message
    const newContent = currentAssistantContent + thinkTag;

    // Emit delta for <think> tag
    AiStreamRepository.emitContentDelta({
      messageId: currentAssistantMessageId,
      delta: thinkTag,
      controller,
      encoder,
      logger,
    });

    return {
      currentAssistantMessageId,
      currentAssistantContent: newContent,
      wasCreated: false,
      newDepth: currentDepth,
    };
  }

  /**
   * Process reasoning-delta event from stream
   */
  private static processReasoningDelta(params: {
    reasoningText: string;
    currentAssistantMessageId: string | null;
    currentAssistantContent: string;
    controller: ReadableStreamDefaultController<Uint8Array>;
    encoder: TextEncoder;
    logger: EndpointLogger;
  }): string {
    const {
      reasoningText,
      currentAssistantMessageId,
      currentAssistantContent,
      controller,
      encoder,
      logger,
    } = params;

    if (
      reasoningText !== undefined &&
      reasoningText !== null &&
      reasoningText !== "" &&
      currentAssistantMessageId
    ) {
      // Accumulate content
      const newContent = currentAssistantContent + reasoningText;

      // Emit content delta
      AiStreamRepository.emitContentDelta({
        messageId: currentAssistantMessageId,
        delta: reasoningText,
        controller,
        encoder,
        logger,
      });

      return newContent;
    }

    return currentAssistantContent;
  }

  /**
   * Process reasoning-end event from stream
   */
  private static processReasoningEnd(params: {
    currentAssistantMessageId: string | null;
    currentAssistantContent: string;
    controller: ReadableStreamDefaultController<Uint8Array>;
    encoder: TextEncoder;
    logger: EndpointLogger;
  }): string {
    const { currentAssistantMessageId, currentAssistantContent, controller, encoder, logger } =
      params;

    if (currentAssistantMessageId) {
      const thinkCloseTag = "</think>";

      // Add closing tag
      const newContent = currentAssistantContent + thinkCloseTag;

      // Emit closing tag delta
      AiStreamRepository.emitContentDelta({
        messageId: currentAssistantMessageId,
        delta: thinkCloseTag,
        controller,
        encoder,
        logger,
      });

      return newContent;
    }

    return currentAssistantContent;
  }

  /**
   * Process tool-call event from stream
   */
  private static async processToolCall(params: {
    part: {
      type: "tool-call";
      toolCallId: string;
      toolName: string;
      input?: JSONValue;
    };
    currentAssistantMessageId: string | null;
    currentAssistantContent: string;
    isInReasoningBlock: boolean;
    threadId: string;
    currentParentId: string | null;
    currentDepth: number;
    model: ModelId;
    character: string;
    sequenceId: string;
    isIncognito: boolean;
    userId: string | undefined;
    toolsConfig: Map<string, { requiresConfirmation: boolean }>;
    streamAbortController: AbortController;
    controller: ReadableStreamDefaultController<Uint8Array>;
    encoder: TextEncoder;
    logger: EndpointLogger;
  }): Promise<{
    currentAssistantMessageId: string | null;
    currentAssistantContent: string;
    isInReasoningBlock: boolean;
    currentParentId: string | null;
    currentDepth: number;
    requiresConfirmation: boolean;
    pendingToolMessage: {
      messageId: string;
      toolCallData: {
        toolCall: ToolCall;
        parentId: string | null;
        depth: number;
      };
    };
  }> {
    const {
      part,
      currentAssistantContent,
      isInReasoningBlock,
      threadId,
      model,
      character,
      sequenceId,
      isIncognito,
      userId,
      toolsConfig,
      controller,
      encoder,
      logger,
    } = params;

    let { currentAssistantMessageId, currentParentId, currentDepth } = params;

    // Tool call event without preceding text/reasoning - create placeholder ASSISTANT message
    // CRITICAL: Must CREATE the message in DB so TOOL messages can reference it as parent_id
    if (!currentAssistantMessageId) {
      currentAssistantMessageId = crypto.randomUUID();

      // Update parent chain to point to the placeholder ASSISTANT message
      // This ensures the TOOL message becomes a child of the ASSISTANT message
      const newParentId = currentAssistantMessageId;
      const newDepth = currentDepth;
      currentParentId = newParentId;
      // currentDepth stays the same - ASSISTANT message is at the same depth

      logger.info("[AI Stream] Creating placeholder ASSISTANT message for tool-call parent chain", {
        messageId: currentAssistantMessageId,
        reason: "Tool call without preceding text/reasoning",
        parentId: params.currentParentId,
        depth: newDepth,
      });

      // CRITICAL FIX: Create the ASSISTANT message in the database immediately
      // This prevents foreign key errors when TOOL messages try to reference it as parent_id
      if (!isIncognito && userId) {
        await createTextMessage({
          messageId: currentAssistantMessageId,
          threadId,
          content: "", // Empty content - will be saved as null and updated if AI generates text
          parentId: params.currentParentId,
          depth: newDepth,
          sequenceId,
          userId,
          model,
          character,
          logger,
        });

        logger.info("[AI Stream] Created placeholder ASSISTANT message in database", {
          messageId: currentAssistantMessageId,
          threadId,
        });
      }

      // CRITICAL FIX: Emit MESSAGE_CREATED event for placeholder ASSISTANT messages
      // This is required so the parent chain is maintained in the UI
      // Without this, TOOL messages appear orphaned because their parent doesn't exist in frontend store
      const placeholderMessageEvent = createStreamEvent.messageCreated({
        messageId: currentAssistantMessageId,
        threadId,
        role: ChatMessageRole.ASSISTANT,
        content: "", // Empty content - will be updated if AI generates text
        parentId: params.currentParentId,
        depth: currentDepth,
        sequenceId,
        model,
        character,
      });
      controller.enqueue(encoder.encode(formatSSEEvent(placeholderMessageEvent)));

      logger.info("[AI Stream] MESSAGE_CREATED event sent for placeholder ASSISTANT", {
        messageId: currentAssistantMessageId,
        parentId: params.currentParentId,
        depth: currentDepth,
      });
    }

    let newAssistantContent = currentAssistantContent;
    let _newIsInReasoningBlock = isInReasoningBlock;

    // Finalize current ASSISTANT message before creating tool message
    if (currentAssistantMessageId) {
      // If reasoning block is still open, close it before tool call
      if (isInReasoningBlock) {
        const thinkCloseTag = "</think>";
        newAssistantContent += thinkCloseTag;

        // Emit closing tag delta
        const thinkCloseDelta = createStreamEvent.contentDelta({
          messageId: currentAssistantMessageId,
          delta: thinkCloseTag,
        });
        controller.enqueue(encoder.encode(formatSSEEvent(thinkCloseDelta)));

        _newIsInReasoningBlock = false;

        logger.info("[AI Stream] ⏱️ Reasoning interrupted by tool call → </think>", {
          messageId: currentAssistantMessageId,
        });
      }

      // Update ASSISTANT message in database with accumulated content
      // Public users (userId undefined) are allowed - helper converts to null
      if (!isIncognito && newAssistantContent) {
        await updateMessageContent({
          messageId: currentAssistantMessageId,
          content: newAssistantContent,
          logger,
        });
      }

      logger.debug("Finalized ASSISTANT message before tool call", {
        messageId: currentAssistantMessageId,
        contentLength: newAssistantContent.length,
      });
    }

    // Get tool arguments from the AI SDK part.input
    const toolCallArgs = (part.input as ToolCallResult) || {};

    // Get tool config to determine if confirmation is required
    const toolConfig = toolsConfig.get(part.toolName);
    const requiresConfirmation = toolConfig?.requiresConfirmation ?? false;

    // Update parent chain: TOOL message is always child of the ASSISTANT message
    // currentParentId now points to the ASSISTANT message (either existing or just created)
    // This creates the chain: USER → ASSISTANT → TOOL1 → TOOL2 → ASSISTANT (next step)
    const newCurrentParentId = currentParentId;
    const newCurrentDepth = currentDepth + 1;

    logger.info("[AI Stream] Tool confirmation check", {
      toolName: part.toolName,
      toolConfigFound: !!toolConfig,
      requiresConfirmation,
      toolsConfigSize: toolsConfig.size,
    });

    // Extract tool call ID from AI SDK (used for matching tool results)
    const toolCallId = part.toolCallId; // AI SDK provides unique ID for each tool call

    // Create tool call with args from AI SDK
    const toolCallData: ToolCall = {
      toolCallId, // CRITICAL: Store AI SDK tool call ID for proper result matching
      toolName: part.toolName,
      args: toolCallArgs,
      creditsUsed: 0,
      requiresConfirmation,
      isConfirmed: false,
      waitingForConfirmation: requiresConfirmation, // Set to true if confirmation needed
    };

    // Create tool message ID and emit to UI immediately
    const toolMessageId = crypto.randomUUID();

    // Emit MESSAGE_CREATED event for UI (immediate feedback)
    // Include toolCall object so frontend can render tool display
    const toolMessageEvent = createStreamEvent.messageCreated({
      messageId: toolMessageId,
      threadId,
      role: ChatMessageRole.TOOL,
      content: null, // Tool messages have no text content
      parentId: newCurrentParentId,
      depth: newCurrentDepth,
      sequenceId,
      toolCall: toolCallData, // Include tool call data for frontend rendering (singular - each TOOL message has exactly one tool call)
    });
    controller.enqueue(encoder.encode(formatSSEEvent(toolMessageEvent)));

    // Emit TOOL_CALL event for real-time UX
    const toolCallEvent = createStreamEvent.toolCall({
      messageId: toolMessageId,
      toolName: toolCallData.toolName,
      args: toolCallData.args,
    });
    controller.enqueue(encoder.encode(formatSSEEvent(toolCallEvent)));

    logger.info("[AI Stream] Tool call started (UI notified)", {
      messageId: toolMessageId,
      toolCallId,
      toolName: part.toolName,
      requiresConfirmation,
    });

    // CRITICAL: Store tool message to DB immediately (if not incognito)
    // This is required so subsequent tool calls can use this message as parent
    // Without this, parallel tool calls will fail with foreign key constraint errors
    if (!isIncognito && userId) {
      logger.info("[AI Stream] Creating tool message in DB", {
        messageId: toolMessageId,
        toolCallId,
        toolName: part.toolName,
        parentId: newCurrentParentId,
        depth: newCurrentDepth,
        threadId,
        sequenceId,
      });

      await createToolMessage({
        messageId: toolMessageId,
        threadId,
        toolCall: toolCallData,
        parentId: newCurrentParentId,
        depth: newCurrentDepth,
        userId,
        sequenceId,
        model,
        character,
        logger,
      });

      logger.info("[AI Stream] Tool message saved to DB immediately", {
        messageId: toolMessageId,
        toolCallId,
        toolName: part.toolName,
        parentId: newCurrentParentId,
        depth: newCurrentDepth,
      });
    }

    // If tool requires confirmation, emit TOOL_WAITING event
    // DON'T abort stream yet - allow all tool calls to be processed first
    // Stream will abort at finish-step if any tools require confirmation
    if (requiresConfirmation) {
      logger.info(
        "[AI Stream] Tool requires confirmation - emitting TOOL_WAITING (stream will continue)",
        {
          messageId: toolMessageId,
          toolName: part.toolName,
          isIncognito,
        },
      );

      // Tool message already saved to DB above (for both confirmation and non-confirmation tools)
      // No need to save again here

      // Emit TOOL_WAITING event to notify frontend
      // This works for both logged-in and incognito modes
      const waitingEvent = createStreamEvent.toolWaiting({
        messageId: toolMessageId,
        toolName: part.toolName,
        toolCallId,
      });
      controller.enqueue(encoder.encode(formatSSEEvent(waitingEvent)));

      logger.info(
        "[AI Stream] Emitted TOOL_WAITING event - continuing to process more tool calls",
        {
          messageId: toolMessageId,
          toolName: part.toolName,
          isIncognito,
        },
      );

      // DON'T abort or close controller here - continue processing
      // IMPORTANT: Preserve currentAssistantMessageId so multiple tool calls in the same step
      // all remain children of the same ASSISTANT message (not creating branches)
      return {
        currentAssistantMessageId,
        currentAssistantContent: newAssistantContent,
        isInReasoningBlock: _newIsInReasoningBlock,
        currentParentId: newCurrentParentId,
        currentDepth: newCurrentDepth,
        requiresConfirmation: true,
        pendingToolMessage: {
          messageId: toolMessageId,
          toolCallData: {
            toolCall: toolCallData,
            parentId: newCurrentParentId,
            depth: newCurrentDepth,
          },
        },
      };
    }

    // Tool does NOT require confirmation - AI SDK will execute it automatically
    // Store the tool message info so we can update it when tool-result arrives
    logger.info(
      "[AI Stream] Tool does NOT require confirmation - AI SDK will execute automatically",
      {
        messageId: toolMessageId,
        toolName: part.toolName,
        toolCallId,
      },
    );

    // IMPORTANT: When requiresConfirmation is false, we still need to store the tool in pendingToolMessage
    // so that when the tool-result event arrives, we can match it and save it to the database.
    // The AI SDK will execute the tool automatically and send us the result via tool-result event.
    // IMPORTANT: Preserve currentAssistantMessageId so multiple tool calls in the same step
    // all remain children of the same ASSISTANT message (not creating branches)
    // IMPORTANT: Return the tool message ID so the caller can update the parent chain
    // This creates: USER → ASSISTANT → TOOL1 → TOOL2 → TOOL3 (chained)
    return {
      currentAssistantMessageId,
      currentAssistantContent: newAssistantContent,
      isInReasoningBlock: _newIsInReasoningBlock,
      currentParentId: newCurrentParentId,
      currentDepth: newCurrentDepth,
      requiresConfirmation: false,
      pendingToolMessage: {
        messageId: toolMessageId,
        toolCallData: {
          toolCall: toolCallData,
          parentId: newCurrentParentId,
          depth: newCurrentDepth,
        },
      },
    };
  }

  /**
   * Process tool-error event from stream
   */
  private static async processToolError(params: {
    part: {
      type: "tool-error";
      toolCallId: string;
      toolName: string;
      error?: JSONValue;
    };
    pendingToolMessage:
      | {
          messageId: string;
          toolCallData: {
            toolCall: ToolCall;
            parentId: string | null;
            depth: number;
          };
        }
      | undefined;
    threadId: string;
    model: ModelId;
    character: string;
    sequenceId: string;
    isIncognito: boolean;
    userId: string | undefined;
    controller: ReadableStreamDefaultController<Uint8Array>;
    encoder: TextEncoder;
    logger: EndpointLogger;
  }): Promise<{
    currentParentId: string | null;
    currentDepth: number;
  } | null> {
    const {
      part,
      pendingToolMessage,
      threadId,
      model,
      character,
      sequenceId,
      isIncognito,
      userId,
      controller,
      encoder,
      logger,
    } = params;

    if (!pendingToolMessage) {
      return null;
    }

    const { messageId: toolMessageId, toolCallData } = pendingToolMessage;

    // Extract error from the tool-error event and structure it for translation
    const error: MessageResponseType =
      "error" in part && part.error
        ? part.error instanceof Error
          ? ({
              message: "app.api.agent.chat.aiStream.errors.toolExecutionError",
              messageParams: { error: part.error.message },
            } satisfies MessageResponseType)
          : typeof part.error === "object" &&
              part.error !== null &&
              "message" in part.error &&
              typeof part.error.message === "string"
            ? (part.error as MessageResponseType)
            : ({
                message: "app.api.agent.chat.aiStream.errors.toolExecutionError",
                messageParams: { error: String(part.error) },
              } satisfies MessageResponseType)
        : ({
            message: "app.api.agent.chat.aiStream.errors.toolExecutionFailed",
          } satisfies MessageResponseType);

    logger.info("[AI Stream] Tool error event received", {
      toolName: part.toolName,
      error,
      toolCallId: part.toolCallId,
      messageId: toolMessageId,
    });

    // Add error to tool call data (for UI)
    const toolCallWithError: ToolCall = {
      ...toolCallData.toolCall,
      error,
    };

    // Store TOOL message in DB (or emit for incognito)
    // NO separate ERROR message - error is stored in TOOL message metadata
    if (!isIncognito && userId) {
      // DB mode: UPDATE existing TOOL message with error in metadata
      // The tool message was already created when tool-call event arrived
      const updateResult = await db
        .update(chatMessages)
        .set({
          metadata: { toolCall: toolCallWithError },
          updatedAt: new Date(),
        })
        .where(eq(chatMessages.id, toolMessageId))
        .returning({ id: chatMessages.id });

      if (updateResult.length === 0) {
        logger.error("[AI Stream] CRITICAL: Tool message update failed - message not found in DB", {
          messageId: toolMessageId,
          toolCallId: part.toolCallId,
          toolName: part.toolName,
          threadId,
        });
        // Fallback: create message if update failed
        await createToolMessage({
          messageId: toolMessageId,
          threadId,
          toolCall: toolCallWithError,
          parentId: toolCallData.parentId,
          depth: toolCallData.depth,
          userId,
          sequenceId,
          model,
          character,
          logger,
        });
        logger.warn("[AI Stream] Created missing tool message as fallback", {
          messageId: toolMessageId,
        });
      } else {
        logger.info("[AI Stream] Tool message updated with error", {
          messageId: toolMessageId,
          toolName: part.toolName,
          error,
        });
      }

      logger.info("[AI Stream] TOOL message stored in DB (error)", {
        messageId: toolMessageId,
        toolName: part.toolName,
        error,
      });
    } else if (isIncognito) {
      // Incognito mode: Emit MESSAGE_CREATED event for TOOL message
      const toolMessageEvent = createStreamEvent.messageCreated({
        messageId: toolMessageId,
        threadId,
        role: ChatMessageRole.TOOL,
        content: null, // Tool messages have no text content
        parentId: toolCallData.parentId,
        depth: toolCallData.depth,
        model,
        character,
        sequenceId,
        toolCall: toolCallWithError, // Include tool call data with error (singular - each TOOL message has exactly one tool call)
      });
      controller.enqueue(encoder.encode(formatSSEEvent(toolMessageEvent)));

      logger.info("[AI Stream] TOOL MESSAGE_CREATED event sent (incognito)", {
        messageId: toolMessageId,
        toolName: part.toolName,
      });
    }

    // Emit TOOL_RESULT event to frontend with error
    const toolResultEvent = createStreamEvent.toolResult({
      messageId: toolMessageId,
      toolName: part.toolName,
      result: undefined,
      error,
      toolCall: toolCallWithError,
    });
    controller.enqueue(encoder.encode(formatSSEEvent(toolResultEvent)));

    logger.info("[AI Stream] TOOL_RESULT event sent (error)", {
      messageId: toolMessageId,
      toolName: part.toolName,
    });

    // After tool error, next message should be a child of the TOOL message
    // NO separate ERROR message - error is displayed in the TOOL message UI
    return {
      currentParentId: toolMessageId, // Next message is child of TOOL
      currentDepth: toolCallData.depth + 1, // One level deeper than TOOL
    };
  }

  /**
   * Process tool-result event from stream
   */
  private static async processToolResult(params: {
    part: {
      type: "tool-result";
      toolCallId: string;
      toolName: string;
      output?: JSONValue;
      isError?: boolean;
    };
    pendingToolMessage:
      | {
          messageId: string;
          toolCallData: {
            toolCall: ToolCall;
            parentId: string | null;
            depth: number;
          };
        }
      | undefined;
    threadId: string;
    model: ModelId;
    character: string;
    sequenceId: string;
    isIncognito: boolean;
    userId: string | undefined;
    controller: ReadableStreamDefaultController<Uint8Array>;
    encoder: TextEncoder;
    logger: EndpointLogger;
    emittedToolResultIds?: Set<string>;
  }): Promise<{
    currentParentId: string | null;
    currentDepth: number;
  } | null> {
    const {
      part,
      pendingToolMessage,
      threadId,
      model,
      character,
      sequenceId,
      isIncognito,
      userId,
      controller,
      encoder,
      logger,
      emittedToolResultIds,
    } = params;

    if (!pendingToolMessage) {
      logger.error("[AI Stream] Tool result received but no pending message found", {
        toolCallId: part.toolCallId,
        toolName: part.toolName,
      });
      return null;
    }

    const { messageId: toolMessageId, toolCallData } = pendingToolMessage;

    logger.info("[AI Stream] Processing tool result", {
      toolCallId: part.toolCallId,
      toolName: part.toolName,
      messageId: toolMessageId,
      hasOutput: "output" in part,
      isError: part.isError,
    });

    // If controller is closed (waiting for confirmation), skip processing
    // The tool result will be processed in the next stream after confirmation
    try {
      if (controller.desiredSize === null) {
        logger.info("[AI Stream] Controller closed - skipping tool result processing", {
          toolCallId: part.toolCallId,
          toolName: part.toolName,
        });
        return null;
      }
    } catch (e) {
      logger.warn("[AI Stream] Error checking controller state", parseError(e));
      return null;
    }

    // AI SDK returns 'output' as unknown type
    const output = "output" in part ? part.output : undefined;
    // AI SDK sets isError: true when tool throws an error
    const isError = "isError" in part ? part.isError : false;

    logger.info("[AI Stream] Tool result RAW output", {
      toolName: part.toolName,
      toolCallId: part.toolCallId,
      messageId: toolMessageId,
      hasOutput: "output" in part,
      isError: Boolean(isError),
      outputType: typeof output,
      outputStringified: (JSON.stringify(output) || "undefined").slice(0, 500),
    });

    // Extract error message from AI SDK and structure it for translation
    let toolError: MessageResponseType | undefined;
    if (isError) {
      // When tool throws error, AI SDK puts error message in output
      const errorMessage =
        typeof output === "string"
          ? output
          : output && typeof output === "object" && "message" in output
            ? String(output.message)
            : JSON.stringify(output);

      toolError = {
        message: "app.api.agent.chat.aiStream.errors.toolExecutionError",
        messageParams: { error: errorMessage },
      };
    }

    // Clean output by removing undefined values (they break validation)
    // Check for both undefined and null to avoid "Cannot convert null to object" error
    const cleanedOutput =
      output !== null && output !== undefined ? JSON.parse(JSON.stringify(output)) : undefined;

    // Validate and type the output using type guard
    const validatedOutput: ToolCallResult | undefined = isValidToolResult(cleanedOutput)
      ? cleanedOutput
      : undefined;

    const toolCallWithResult: ToolCall = {
      ...toolCallData.toolCall,
      result: validatedOutput,
      error: toolError,
    };

    // Update TOOL message in DB with result (or emit for incognito)
    if (isIncognito) {
      // Incognito mode: Emit MESSAGE_CREATED events so client can save to localStorage
      // Emit TOOL message with toolCall object
      const toolMessageEvent = createStreamEvent.messageCreated({
        messageId: toolMessageId,
        threadId,
        role: ChatMessageRole.TOOL,
        content: null, // Tool messages have no text content
        parentId: toolCallData.parentId,
        depth: toolCallData.depth,
        model,
        character,
        sequenceId,
        toolCall: toolCallWithResult, // Include tool call data with result (singular - each TOOL message has exactly one tool call)
      });

      try {
        controller.enqueue(encoder.encode(formatSSEEvent(toolMessageEvent)));
      } catch (e) {
        if (e instanceof TypeError && e.message.includes("Controller is already closed")) {
          logger.info("[AI Stream] Controller closed - skipping message event", {
            toolCallId: part.toolCallId,
          });
          return null;
        }
        logger.error("[AI Stream] Failed to enqueue tool message event", parseError(e));
        return null;
      }

      logger.info("[AI Stream] TOOL MESSAGE_CREATED event sent (incognito)", {
        messageId: toolMessageId,
        toolName: part.toolName,
      });

      // Emit ERROR message if error
      if (toolError) {
        const errorMessageId = crypto.randomUUID();
        const { serializeError } = await import("../error-utils");
        const errorMessageEvent = createStreamEvent.messageCreated({
          messageId: errorMessageId,
          threadId,
          role: ChatMessageRole.ERROR,
          content: serializeError(toolError), // Serialize structured error for transmission
          parentId: toolMessageId,
          depth: toolCallData.depth + 1,
          model,
          character,
          sequenceId,
        });
        controller.enqueue(encoder.encode(formatSSEEvent(errorMessageEvent)));

        logger.info("[AI Stream] ERROR MESSAGE_CREATED event sent (incognito)", {
          errorMessageId,
          toolError,
        });
      }
    } else {
      // DB mode: Create ERROR message first if error (proper timestamp order)
      if (toolError && userId) {
        const errorMessageId = crypto.randomUUID();
        const { serializeError } = await import("../error-utils");
        await createErrorMessage({
          messageId: errorMessageId,
          threadId,
          content: serializeError(toolError), // Serialize structured error for storage
          errorType: "TOOL_ERROR",
          parentId: toolMessageId, // Error is child of tool message
          depth: toolCallData.depth + 1,
          userId,
          sequenceId,
          logger,
        });

        logger.info("[AI Stream] ERROR message created for tool error", {
          errorMessageId,
          toolError,
        });
      }

      // UPDATE existing TOOL message in DB with result/error
      // Message was already created in processToolCall, now we just update it with the result
      const updateResult = await db
        .update(chatMessages)
        .set({
          metadata: { toolCall: toolCallWithResult },
          updatedAt: new Date(),
        })
        .where(eq(chatMessages.id, toolMessageId))
        .returning({ id: chatMessages.id });

      if (updateResult.length === 0) {
        logger.error("[AI Stream] CRITICAL: Tool message update failed - message not found in DB", {
          messageId: toolMessageId,
          toolCallId: part.toolCallId,
          toolName: part.toolName,
          threadId,
        });
        // Message doesn't exist - this shouldn't happen since we created it in processToolCall
        // But if it does, we need to create it now
        await createToolMessage({
          messageId: toolMessageId,
          threadId,
          toolCall: toolCallWithResult,
          parentId: toolCallData.parentId,
          depth: toolCallData.depth,
          userId,
          sequenceId,
          model,
          character,
          logger,
        });
        logger.warn("[AI Stream] Created missing tool message as fallback", {
          messageId: toolMessageId,
        });
      } else {
        logger.info("[AI Stream] Tool message updated with result", {
          messageId: toolMessageId,
          hasResult: !!validatedOutput,
          hasError: !!toolError,
        });
      }
    }

    logger.info("[AI Stream] Tool result validated and saved to DB", {
      messageId: toolMessageId,
      toolCallId: part.toolCallId,
      toolName: part.toolName,
      hasResult: !!validatedOutput,
      hasError: !!toolError,
      resultType: typeof validatedOutput,
      isValid: isValidToolResult(cleanedOutput),
      wasCleaned: output !== cleanedOutput,
    });

    // Emit TOOL_RESULT event for real-time UX with updated tool call data
    // SKIP if this tool result was already emitted in batch confirmation handler
    if (emittedToolResultIds && emittedToolResultIds.has(toolMessageId)) {
      logger.info(
        "[AI Stream] Skipping TOOL_RESULT emission - already emitted in batch confirmations",
        {
          messageId: toolMessageId,
          toolName: part.toolName,
        },
      );
    } else {
      const toolResultEvent = createStreamEvent.toolResult({
        messageId: toolMessageId,
        toolName: part.toolName,
        result: validatedOutput,
        error: toolError,
        toolCall: toolCallWithResult, // Include full tool call data with result
      });

      try {
        controller.enqueue(encoder.encode(formatSSEEvent(toolResultEvent)));
      } catch (e) {
        if (e instanceof TypeError && e.message.includes("Controller is already closed")) {
          logger.info("[AI Stream] Controller closed - skipping tool result event", {
            toolCallId: part.toolCallId,
            toolName: part.toolName,
          });
          return null;
        }
        logger.error("[AI Stream] Failed to enqueue tool result event", parseError(e));
        return null;
      }
    }

    // NOW update parent chain: tool message is in DB, next message can be its child
    // Return the tool message's depth (not +1) because processToolCall will increment it
    return {
      currentParentId: toolMessageId,
      currentDepth: toolCallData.depth,
    };
  }

  /**
   * Handle stream error and emit error events
   */
  private static async handleStreamError(params: {
    error: Error | JSONValue;
    threadId: string;
    isIncognito: boolean;
    userId: string | undefined;
    lastParentId: string | null;
    lastDepth: number;
    lastSequenceId: string | null;
    controller: ReadableStreamDefaultController<Uint8Array>;
    encoder: TextEncoder;
    logger: EndpointLogger;
  }): Promise<void> {
    const {
      error,
      threadId,
      isIncognito,
      userId,
      lastParentId,
      lastDepth,
      lastSequenceId,
      controller,
      encoder,
      logger,
    } = params;

    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    logger.error("Stream error", {
      error: errorMessage,
      stack: errorStack,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
    });

    // Create structured error with translation key
    const structuredError: MessageResponseType = {
      message: "app.api.agent.chat.aiStream.errors.streamError",
      messageParams: { error: errorMessage },
    };

    // Create ERROR message in DB/localStorage
    // Public users (userId undefined) are allowed - helper converts to null
    const errorMessageId = crypto.randomUUID();
    if (!isIncognito) {
      const { serializeError } = await import("../error-utils");
      await createErrorMessage({
        messageId: errorMessageId,
        threadId,
        content: serializeError(structuredError),
        errorType: "STREAM_ERROR",
        parentId: lastParentId,
        depth: lastDepth,
        userId,
        sequenceId: lastSequenceId,
        logger,
      });
    }

    // Emit ERROR message event for UI
    const { serializeError } = await import("../error-utils");
    const errorMessageEvent = createStreamEvent.messageCreated({
      messageId: errorMessageId,
      threadId,
      role: ChatMessageRole.ERROR,
      content: serializeError(structuredError),
      parentId: lastParentId,
      depth: lastDepth,
      sequenceId: lastSequenceId,
    });
    controller.enqueue(encoder.encode(formatSSEEvent(errorMessageEvent)));

    // Emit error event to update UI state
    const errorEvent = createStreamEvent.error({
      code: "STREAM_ERROR",
      message: errorMessage,
    });
    controller.enqueue(encoder.encode(formatSSEEvent(errorEvent)));
    controller.close();
  }
}

/**
 * Singleton instance
 */
export const aiStreamRepository = new AiStreamRepository();
