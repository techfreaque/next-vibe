/**
 * AI Stream Repository
 * Handles AI streaming chat functionality with thread/message creation
 */

import "server-only";

import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { stepCountIs, streamText } from "ai";
import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import {
  createStreamingResponse,
  ErrorResponseTypes,
  type ResponseType,
  type StreamingResponse,
} from "next-vibe/shared/types/response.schema";

import { creditRepository } from "@/app/api/[locale]/v1/core/credits/repository";
import { db } from "@/app/api/[locale]/v1/core/system/db";
import { loadTools } from "@/app/api/[locale]/v1/core/system/unified-interface/ai/loader";
import type {
  CoreTool,
  DiscoveredEndpoint,
} from "@/app/api/[locale]/v1/core/system/unified-interface/ai/types";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/platform";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction, TranslationKey } from "@/i18n/core/static-types";

import { setupAiStream } from "./stream-setup";

import {
  chatMessages,
  type ToolCall,
  type ToolCallResult,
  type ToolCallWidgetMetadata,
} from "../../chat/db";
import type { DefaultFolderId } from "../../chat/config";
import { ChatMessageRole } from "../../chat/enum";
import { getModelById, type ModelId } from "../../chat/model-access/models";
import { generateThreadTitle } from "../../chat/threads/repository";
import {
  fetchMessageHistory,
  createErrorMessage,
  createTextMessage,
  updateMessageContent,
  createToolMessage,
} from "../../chat/threads/[threadId]/messages/repository";
import { CONTINUE_CONVERSATION_PROMPT } from "../system-prompt";
import type {
  AiStreamPostRequestOutput,
  AiStreamPostResponseOutput,
} from "../definition";
import { createStreamEvent, formatSSEEvent } from "../events";
import { isUncensoredAIModel } from "../providers/uncensored-ai";
import { handleUncensoredAI } from "../providers/uncensored-handler";

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
    request: NextRequest;
  }): Promise<ResponseType<AiStreamPostResponseOutput> | StreamingResponse>;
}

/**
 * Type guard for tool result values
 * Validates that value is JSON-serializable and matches ToolCallResult type
 */
// eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Type guard requires unknown parameter
function isValidToolResult(value: unknown): value is ToolCallResult {
  if (value === null) {
    return true;
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
 * Convert ChatMessageRole enum to AI SDK compatible role
 * Filters out TOOL and ERROR roles (converts TOOL -> USER, ERROR -> ASSISTANT)
 */
function toAiSdkMessage(message: { role: ChatMessageRole; content: string }): {
  role: "user" | "assistant" | "system";
  content: string;
} | null {
  switch (message.role) {
    case ChatMessageRole.USER:
      return { content: message.content, role: ChatMessageRole.USER };
    case ChatMessageRole.ASSISTANT:
      return { content: message.content, role: ChatMessageRole.ASSISTANT };
    case ChatMessageRole.SYSTEM:
      return { content: message.content, role: ChatMessageRole.SYSTEM };
    case ChatMessageRole.TOOL:
      return { content: message.content, role: ChatMessageRole.USER };
    case ChatMessageRole.ERROR:
      // Error messages become get removed
      return null;
  }
}

function toAiSdkMessages(
  messages: Array<{ role: ChatMessageRole; content: string }>,
): Array<{ role: "user" | "assistant" | "system"; content: string }> {
  return messages.map((msg) => toAiSdkMessage(msg)).filter(Boolean) as Array<{
    role: "user" | "assistant" | "system";
    content: string;
  }>;
}

/**
 * Extract user identifiers from request
 */
function extractUserIdentifiers(
  user: JwtPayloadType,
  request: NextRequest,
  logger: EndpointLogger,
): {
  userId?: string;
  leadId?: string;
  ipAddress?: string;
} {
  logger.debug("Extracting user identifiers", {
    isPublic: user.isPublic,
    hasId: "id" in user,
    hasLeadId: "leadId" in user,
  });

  const userId = !user.isPublic && "id" in user ? user.id : undefined;
  const leadId =
    "leadId" in user && typeof user.leadId === "string"
      ? user.leadId
      : undefined;
  const ipAddress =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    undefined;

  logger.debug("Extracted identifiers", { userId, leadId, ipAddress });

  return { userId, leadId, ipAddress };
}

/**
 * AI Stream Repository Implementation
 */
class AiStreamRepository implements IAiStreamRepository {
  /**
   * Handle send operation - normal message send
   */
  private handleSendOperation(data: AiStreamPostRequestOutput): {
    threadId: string | null | undefined;
    parentMessageId: string | null | undefined;
    content: string;
    role: ChatMessageRole;
  } {
    return {
      threadId: data.threadId,
      parentMessageId: data.parentMessageId,
      content: data.content,
      role: data.role,
    };
  }

  /**
   * Build message context for AI
   */
  private async buildMessageContext(params: {
    operation: "send" | "retry" | "edit" | "answer-as-ai";
    threadId: string | null | undefined;
    parentMessageId: string | null | undefined;
    content: string;
    role: ChatMessageRole;
    userId: string | undefined;
    isIncognito: boolean;
    messageHistory?: Array<{
      role: ChatMessageRole;
      content: string;
    }> | null;
    logger: EndpointLogger;
  }): Promise<
    Array<{ role: "user" | "assistant" | "system"; content: string }>
  > {
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
      // For incognito mode, use provided message history
      if (params.isIncognito && params.messageHistory) {
        const messages = toAiSdkMessages(params.messageHistory);
        if (params.content.trim()) {
          messages.push({ role: "user", content: params.content });
        } else {
          messages.push({
            role: "user",
            content: CONTINUE_CONVERSATION_PROMPT,
          });
        }
        return messages;
      }

      // For non-incognito mode, fetch from database
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
          const messages = toAiSdkMessages(contextMessages);

          if (params.content.trim()) {
            messages.push({ role: "user", content: params.content });
          } else {
            messages.push({
              role: "user",
              content: CONTINUE_CONVERSATION_PROMPT,
            });
          }
          return messages;
        } else {
          params.logger.error("Parent message not found in thread", {
            parentMessageId: params.parentMessageId,
            threadId: params.threadId,
          });
          return params.content.trim()
            ? [{ role: "user", content: params.content }]
            : [];
        }
      } else if (params.content.trim()) {
        return [{ role: "user", content: params.content }];
      } else {
        return [];
      }
    } else if (!params.isIncognito && params.userId && params.threadId) {
      // Non-incognito mode: fetch history from database
      const history = await fetchMessageHistory(
        params.threadId,
        params.userId,
        params.logger,
      );
      const currentMessage = toAiSdkMessage({
        role: params.role,
        content: params.content,
      });
      if (!currentMessage) {
        return history;
      }
      return [...history, currentMessage];
    } else if (params.isIncognito && params.messageHistory) {
      // Incognito mode with message history: use provided history from client
      params.logger.debug("Using provided message history for incognito mode", {
        operation: params.operation,
        historyLength: params.messageHistory.length,
      });
      const historyMessages = toAiSdkMessages(params.messageHistory);
      const currentMessage = toAiSdkMessage({
        role: params.role,
        content: params.content,
      });
      if (!currentMessage) {
        return historyMessages;
      }
      return [...historyMessages, currentMessage];
    } else {
      // Fallback: no thread or no history (new conversation)
      const currentMessage = toAiSdkMessage({
        role: params.role,
        content: params.content,
      });
      if (!currentMessage) {
        return [];
      }
      return [currentMessage];
    }
  }

  /**
   * Deduct credits after successful AI response
   */
  private async deductCreditsAfterCompletion(params: {
    modelCost: number;
    user: JwtPayloadType;
    model: ModelId;
    logger: EndpointLogger;
  }): Promise<void> {
    await creditRepository.deductCreditsForFeature(
      params.user,
      params.modelCost,
      params.model,
      params.logger,
    );
  }

  /**
   * Setup tools for OpenRouter streaming
   * Returns tools and updated system prompt
   */
  private async setupStreamingTools(params: {
    model: ModelId;
    requestedTools: string[] | null | undefined;
    user: JwtPayloadType;
    locale: CountryLanguage;
    logger: EndpointLogger;
    systemPrompt: string;
  }): Promise<{
    tools: Record<string, CoreTool> | undefined;
    systemPrompt: string;
  }> {
    const modelConfig = getModelById(params.model);

    if (!modelConfig?.supportsTools) {
      return {
        tools: undefined,
        systemPrompt: params.systemPrompt,
      };
    }

    const toolsResult = await loadTools({
      requestedTools: params.requestedTools,
      user: params.user,
      locale: params.locale,
      logger: params.logger,
      systemPrompt: params.systemPrompt,
    });

    return {
      tools: toolsResult.tools,
      systemPrompt: toolsResult.systemPrompt,
    };
  }

  /**
   * Emit initial stream events (thread creation and user message)
   */
  private emitInitialEvents(params: {
    isNewThread: boolean;
    threadId: string;
    rootFolderId: DefaultFolderId;
    subFolderId: string | null;
    content: string;
    operation: "send" | "retry" | "edit" | "answer-as-ai";
    userMessageId: string;
    effectiveRole: ChatMessageRole;
    effectiveParentMessageId: string | null | undefined;
    messageDepth: number;
    effectiveContent: string;
    controller: ReadableStreamDefaultController<Uint8Array>;
    encoder: TextEncoder;
    logger: EndpointLogger;
  }): void {
    const {
      isNewThread,
      threadId,
      rootFolderId,
      subFolderId,
      content,
      operation,
      userMessageId,
      effectiveRole,
      effectiveParentMessageId,
      messageDepth,
      effectiveContent,
      controller,
      encoder,
      logger,
    } = params;

    // Emit thread-created event if new thread
    if (isNewThread) {
      logger.debug("Emitting THREAD_CREATED event", {
        threadId,
        rootFolderId,
      });
      const threadEvent = createStreamEvent.threadCreated({
        threadId,
        title: generateThreadTitle(content),
        rootFolderId,
        subFolderId: subFolderId || null,
      });
      controller.enqueue(encoder.encode(formatSSEEvent(threadEvent)));
      logger.debug("THREAD_CREATED event emitted", {
        threadId,
      });
    } else {
      logger.debug("Thread already exists, not emitting THREAD_CREATED", {
        threadId,
        isNew: isNewThread,
      });
    }

    // For answer-as-ai, skip user message event and only emit AI message
    // For regular operations, emit both user and AI message events
    if (operation !== "answer-as-ai" && operation !== "retry") {
      // Emit user message-created event
      logger.debug("Emitting USER MESSAGE_CREATED event", {
        messageId: userMessageId,
        threadId,
        parentId: effectiveParentMessageId || null,
      });
      const userMessageEvent = createStreamEvent.messageCreated({
        messageId: userMessageId,
        threadId,
        role: effectiveRole,
        parentId: effectiveParentMessageId || null,
        depth: messageDepth,
        content: effectiveContent,
      });
      const userMessageEventString = formatSSEEvent(userMessageEvent);
      logger.debug("USER MESSAGE_CREATED event formatted", {
        messageId: userMessageId,
      });
      controller.enqueue(encoder.encode(userMessageEventString));
      logger.debug("USER MESSAGE_CREATED event emitted", {
        messageId: userMessageId,
      });
    } else {
      logger.debug(
        "Skipping USER MESSAGE_CREATED event for answer-as-ai operation",
        {
          messageId: userMessageId,
        },
      );
    }
  }

  /**
   * Emit content delta event for streaming
   */
  private emitContentDelta(params: {
    messageId: string;
    delta: string;
    controller: ReadableStreamDefaultController<Uint8Array>;
    encoder: TextEncoder;
  }): void {
    const { messageId, delta, controller, encoder } = params;

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
  private async createAssistantMessage(params: {
    initialContent: string;
    threadId: string;
    parentId: string | null;
    depth: number;
    model: ModelId;
    persona: string | undefined;
    sequenceId: string;
    sequenceIndex: number;
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
      persona,
      sequenceId,
      sequenceIndex,
      isIncognito,
      userId,
      controller,
      encoder,
      logger,
    } = params;

    const messageId = crypto.randomUUID();

    // Emit MESSAGE_CREATED event
    const messageEvent = createStreamEvent.messageCreated({
      messageId,
      threadId,
      role: ChatMessageRole.ASSISTANT,
      content: initialContent,
      parentId,
      depth,
      model,
      persona,
      sequenceId,
      sequenceIndex,
    });
    controller.enqueue(encoder.encode(formatSSEEvent(messageEvent)));

    // Save ASSISTANT message to database if not incognito
    // Public users (userId undefined) are allowed - helper converts to null
    if (!isIncognito) {
      await createTextMessage({
        messageId,
        threadId,
        content: initialContent,
        parentId,
        depth,
        userId,
        model,
        persona,
        sequenceId,
        sequenceIndex,
        logger,
      });
    }

    logger.debug("ASSISTANT message created", {
      messageId,
      sequenceIndex,
    });

    return { messageId, content: initialContent };
  }

  /**
   * Finalize ASSISTANT message at stream end
   */
  private async finalizeAssistantMessage(params: {
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

    // CRITICAL FIX: If reasoning block is still open, close it at stream end
    if (isInReasoningBlock) {
      const thinkCloseTag = "</think>";
      currentAssistantContent += thinkCloseTag;

      // Emit closing tag delta
      const thinkCloseDelta = createStreamEvent.contentDelta({
        messageId: currentAssistantMessageId,
        delta: thinkCloseTag,
      });
      controller.enqueue(encoder.encode(formatSSEEvent(thinkCloseDelta)));

      logger.info("[AI Stream] ⏱️ Reasoning closed at stream end → </think>", {
        messageId: currentAssistantMessageId,
      });
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
    // Public users (userId undefined) are allowed - helper converts to null
    if (!isIncognito) {
      await db
        .update(chatMessages)
        .set({
          content: currentAssistantContent,
          tokens: usage.totalTokens,
          updatedAt: new Date(),
        })
        .where(eq(chatMessages.id, currentAssistantMessageId));
    }

    logger.info("Finalized ASSISTANT message", {
      messageId: currentAssistantMessageId,
      contentLength: currentAssistantContent.length,
      tokens: usage.totalTokens,
    });
  }

  /**
   * Handle Uncensored.ai model streaming
   * Uncensored.ai doesn't support streaming, so we use direct API call
   * and convert the response to SSE events
   */
  private async handleUncensoredAiStream(params: {
    messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
    temperature: number;
    maxTokens: number;
    locale: CountryLanguage;
    logger: EndpointLogger;
    // Context needed for SSE events
    threadId: string;
    isNewThread: boolean;
    rootFolderId: DefaultFolderId;
    subFolderId: string | null;
    content: string;
    operation: "send" | "retry" | "edit" | "answer-as-ai";
    userMessageId: string;
    effectiveRole: ChatMessageRole;
    effectiveParentMessageId: string | null | undefined;
    messageDepth: number;
    effectiveContent: string;
    model: ModelId;
    persona: string | undefined;
    isIncognito: boolean;
    userId: string | undefined;
    // Credit deduction
    modelCost: number;
    user: JwtPayloadType;
  }): Promise<ResponseType<AiStreamPostResponseOutput> | StreamingResponse> {
    const {
      messages,
      temperature,
      maxTokens,
      locale,
      logger,
      threadId,
      isNewThread,
      rootFolderId,
      subFolderId,
      content,
      operation,
      userMessageId,
      effectiveRole,
      effectiveParentMessageId,
      messageDepth,
      effectiveContent,
      model,
      persona,
      isIncognito,
      userId,
      modelCost,
      user,
    } = params;

    if (!env.UNCENSORED_AI_API_KEY) {
      logger.error("Uncensored.ai API key not configured");
      return {
        success: false,
        message:
          "app.api.v1.core.agent.chat.aiStream.route.errors.uncensoredApiKeyMissing",
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      };
    }

    // Bind shared methods (same as OpenRouter implementation)
    const encoder = new TextEncoder();
    const emitInitialEvents = this.emitInitialEvents.bind(this);
    const emitContentDelta = this.emitContentDelta.bind(this);
    const finalizeAssistantMessage = this.finalizeAssistantMessage.bind(this);
    const deductCredits = this.deductCreditsAfterCompletion.bind(this);

    // Create SSE stream
    const stream = new ReadableStream({
      async start(controller): Promise<void> {
        try {
          // Emit initial events (thread creation and user message) - SHARED LOGIC
          emitInitialEvents({
            isNewThread,
            threadId,
            rootFolderId,
            subFolderId,
            content,
            operation,
            userMessageId,
            effectiveRole,
            effectiveParentMessageId,
            messageDepth,
            effectiveContent,
            controller,
            encoder,
            logger,
          });

          // Calculate initial parent and depth for AI message - SAME AS OPENROUTER
          const initialAiParentId =
            operation === "answer-as-ai" || operation === "retry"
              ? (effectiveParentMessageId ?? null)
              : userMessageId;
          const initialAiDepth =
            operation === "answer-as-ai" || operation === "retry"
              ? messageDepth
              : messageDepth + 1;

          // Track message sequencing - SAME AS OPENROUTER
          const sequenceId = crypto.randomUUID();
          let sequenceIndex = 0;

          // Track current parent/depth - SAME AS OPENROUTER
          const currentParentId = initialAiParentId;
          const currentDepth = initialAiDepth;

          // CRITICAL FIX: Create ASSISTANT message BEFORE API call to show loading state
          // This ensures the UI displays a loading indicator while waiting for the API response
          const aiMessageId = crypto.randomUUID();
          let currentAssistantMessageId: string | null = aiMessageId;
          let currentAssistantContent = "";

          // Emit MESSAGE_CREATED event for ASSISTANT message immediately
          // This shows loading state in UI while API call is in progress
          const messageEvent = createStreamEvent.messageCreated({
            messageId: aiMessageId,
            threadId,
            role: ChatMessageRole.ASSISTANT,
            content: "", // Empty content initially
            parentId: currentParentId,
            depth: currentDepth,
            model,
            persona,
            sequenceId,
            sequenceIndex,
          });
          controller.enqueue(encoder.encode(formatSSEEvent(messageEvent)));

          logger.debug(
            "[Uncensored AI] ASSISTANT message created (loading state)",
            {
              messageId: aiMessageId,
            },
          );

          // Save initial ASSISTANT message to database if not incognito
          // This ensures the message exists in DB while API call is in progress
          if (!isIncognito) {
            await createTextMessage({
              messageId: aiMessageId,
              threadId,
              content: "", // Empty content initially
              parentId: currentParentId,
              depth: currentDepth,
              userId,
              model,
              persona,
              sequenceId,
              sequenceIndex,
              logger,
            });
          }

          // Call Uncensored AI API
          logger.info("[Uncensored AI] Calling API");
          const response = await handleUncensoredAI(
            env.UNCENSORED_AI_API_KEY,
            messages,
            temperature,
            maxTokens,
            locale,
          );

          // Read the complete response
          const responseText = await response.text();
          logger.info("[Uncensored AI] Received response", {
            length: responseText.length,
          });

          // Parse the response - it's in Vercel AI SDK format: 0:"text"\n
          let fullContent = "";
          const lines = responseText.split("\n").filter((line) => line.trim());
          for (const line of lines) {
            // Parse format: 0:"text"
            const match = line.match(/^0:"(.*)"/);
            if (match) {
              // Unescape the JSON string
              const chunk = JSON.parse(`"${match[1]}"`);
              fullContent += chunk;
            }
          }

          logger.info("[Uncensored AI] Parsed content", {
            length: fullContent.length,
          });

          // Stream content in chunks to simulate streaming
          const chunkSize = 20;
          for (let i = 0; i < fullContent.length; i += chunkSize) {
            const chunk = fullContent.slice(i, i + chunkSize);

            // Accumulate content and emit delta
            currentAssistantContent += chunk;
            emitContentDelta({
              messageId: currentAssistantMessageId,
              delta: chunk,
              controller,
              encoder,
            });
          }

          // Finalize ASSISTANT message - SHARED LOGIC
          if (currentAssistantMessageId) {
            await finalizeAssistantMessage({
              currentAssistantMessageId,
              currentAssistantContent,
              isInReasoningBlock: false,
              streamResult: {
                finishReason: "stop",
                usage: {
                  inputTokens: 0,
                  outputTokens: 0,
                  totalTokens: 0,
                },
              },
              isIncognito,
              controller,
              encoder,
              logger,
            });
          }

          logger.info("[Uncensored AI] Stream completed", {
            messageId: currentAssistantMessageId,
            contentLength: fullContent.length,
          });

          // Deduct credits AFTER successful completion (not optimistically) - SAME AS OPENROUTER
          await deductCredits({
            modelCost,
            user,
            model,
            logger,
          });

          controller.close();
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          logger.error("[Uncensored AI] Stream error", {
            error: errorMessage,
          });

          // Emit error event
          const errorEvent = createStreamEvent.error({
            code: "UNCENSORED_AI_ERROR",
            message: errorMessage,
          });
          controller.enqueue(encoder.encode(formatSSEEvent(errorEvent)));
          controller.close();
        }
      },
    });

    logger.info("[Uncensored AI] Returning streaming response");
    return createStreamingResponse(
      new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      }),
    );
  }

  /**
   * Create AI streaming response with SSE events
   * Returns StreamingResponse for SSE stream or error ResponseType
   */
  async createAiStream({
    data,
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
    request: NextRequest;
  }): Promise<ResponseType<AiStreamPostResponseOutput> | StreamingResponse> {
    const { userId, leadId, ipAddress } = extractUserIdentifiers(
      user,
      request,
      logger,
    );

    const setupResult = await setupAiStream({
      data,
      locale,
      logger,
      user,
      userId,
      leadId,
      ipAddress,
      buildMessageContext: this.buildMessageContext.bind(this),
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
    } = setupResult.data;

    let systemPrompt = initialSystemPrompt;

    // Step 9: Start AI streaming (for all operations including answer-as-ai)
    try {
      // Special handling for Uncensored.ai - doesn't support streaming
      if (isUncensoredAIModel(data.model)) {
        return await this.handleUncensoredAiStream({
          messages,
          temperature: data.temperature,
          maxTokens: data.maxTokens,
          locale,
          logger,
          threadId: threadResultThreadId,
          isNewThread,
          rootFolderId: data.rootFolderId,
          subFolderId: data.subFolderId || null,
          content: data.content,
          operation: data.operation,
          userMessageId,
          effectiveRole,
          effectiveParentMessageId,
          messageDepth,
          effectiveContent,
          model: data.model,
          persona: data.persona,
          isIncognito,
          userId,
          modelCost,
          user,
        });
      }

      const provider = createOpenRouter({
        apiKey: env.OPENROUTER_API_KEY,
      });

      logger.debug("Starting OpenRouter stream", {
        model: data.model,
        tools: data.tools,
      });

      const modelConfig = getModelById(data.model);

      const { tools, systemPrompt: updatedSystemPrompt } =
        await this.setupStreamingTools({
          model: data.model,
          requestedTools: data.tools,
          user,
          locale,
          logger,
          systemPrompt,
        });
      systemPrompt = updatedSystemPrompt;

      // Create SSE stream
      const encoder = new TextEncoder();
      const deductCredits = this.deductCreditsAfterCompletion.bind(this);
      const emitInitialEvents = this.emitInitialEvents.bind(this);
      const emitContentDelta = this.emitContentDelta.bind(this);
      const createAssistantMessage = this.createAssistantMessage.bind(this);
      const finalizeAssistantMessage = this.finalizeAssistantMessage.bind(this);

      // Track parent/depth/sequence for error handling (accessible in catch block)
      let lastParentId: string | null = null;
      let lastDepth = 0;
      let lastSequenceId: string | null = null;
      let lastSequenceIndex = 0;

      const stream = new ReadableStream({
        async start(controller): Promise<void> {
          try {
            logger.debug("Stream start() called");

            emitInitialEvents({
              isNewThread,
              threadId: threadResultThreadId,
              rootFolderId: data.rootFolderId,
              subFolderId: data.subFolderId || null,
              content: data.content,
              operation: data.operation,
              userMessageId,
              effectiveRole,
              effectiveParentMessageId,
              messageDepth,
              effectiveContent,
              controller,
              encoder,
              logger,
            });

            // Calculate initial parent and depth for AI message
            // This will be updated if reasoning occurs
            const initialAiParentId =
              data.operation === "answer-as-ai" || data.operation === "retry"
                ? (effectiveParentMessageId ?? null)
                : userMessageId;
            const initialAiDepth =
              data.operation === "answer-as-ai" || data.operation === "retry"
                ? messageDepth
                : messageDepth + 1;

            // Don't emit AI message-created event yet
            // We'll emit it when we start getting content, so we can set the correct parent
            // (if there's reasoning, the AI message should be a child of the reasoning message)

            // Start streaming
            // NEW ARCHITECTURE: Single ASSISTANT message with inline <think> tags
            // Only interrupted by tool calls
            let currentAssistantMessageId: string | null = null; // Current ASSISTANT message being streamed
            let currentAssistantContent = ""; // Accumulated content (reasoning + text with <think> tags inline)
            let currentToolMessageId: string | null = null; // Current tool message being processed
            let currentToolCallData: {
              toolCall: ToolCall;
              parentId: string | null;
              depth: number;
              sequenceIndex: number;
            } | null = null; // Tool call data (stored until result arrives)
            let isInReasoningBlock = false; // Track if we're inside <think></think> tags

            // Track message sequencing - all messages in this response share the same sequenceId
            const sequenceId = crypto.randomUUID(); // Generate independent sequence ID
            let sequenceIndex = 0; // Current position in sequence

            // Track the current parent for chaining messages
            // This gets updated as we create reasoning messages and tool calls
            let currentParentId = initialAiParentId;
            let currentDepth = initialAiDepth;

            // Update last known values for error handling
            lastSequenceId = sequenceId;
            lastParentId = currentParentId;
            lastDepth = currentDepth;
            lastSequenceIndex = sequenceIndex;

            // Get the OpenRouter model ID (use openRouterModel if available, otherwise use model ID directly)
            const openRouterModelId =
              modelConfig?.openRouterModel || data.model;

            // Use Vercel AI SDK's built-in multi-step tool calling
            // maxSteps: allows up to 50 steps (tool call + text generation cycles)
            // This allows for long-running tool sequences that could take minutes
            logger.info("[AI Stream] ⏱️ Calling streamText");
            const streamResult = streamText({
              model: provider(openRouterModelId),
              messages,
              temperature: data.temperature,
              abortSignal: AbortSignal.timeout(maxDuration * 1000),
              system: systemPrompt || undefined,
              ...(tools
                ? {
                    tools,
                    // Enable multi-step tool calling loop - AI can call tools up to 50 times
                    // stopWhen is required for the loop to continue after tool results
                    stopWhen: stepCountIs(50),
                    onStepFinish: ({
                      text,
                      toolCalls,
                      toolResults,
                      finishReason,
                      usage,
                    }): void => {
                      logger.info("[AI Stream] Step finished", {
                        hasText: !!text,
                        textLength: text?.length || 0,
                        toolCallsCount: toolCalls.length,
                        toolResultsCount: toolResults.length,
                        finishReason,
                        totalTokens: usage.totalTokens,
                        textPreview: text?.substring(0, 100),
                      });
                    },
                  }
                : {}),
            });
            logger.info(
              "[AI Stream] ⏱️ streamText returned, starting iteration",
            );

            // Lazy load endpoint metadata only when tool calls are encountered
            // This avoids loading all 143 endpoints when no tools are used
            let endpointMap: Map<string, DiscoveredEndpoint> | null = null;
            const getEndpointMap = async (): Promise<
              Map<string, DiscoveredEndpoint>
            > => {
              if (!endpointMap) {
                const { ToolRegistry } = await import(
                  "@/app/api/[locale]/v1/core/system/unified-interface/ai/registry"
                );
                const allEndpoints = ToolRegistry.getEndpoints(user, Platform.AI);
                endpointMap = new Map(
                  allEndpoints.map((endpoint) => [endpoint.toolName, endpoint]),
                );
                logger.debug("Lazy loaded endpoint metadata for tool calls", {
                  endpointCount: allEndpoints.length,
                });
              }
              return endpointMap;
            };

            // Stream the response
            logger.info("[AI Stream] ⏱️ Starting to process fullStream");

            // NEW ARCHITECTURE: Don't create initial message
            // Messages are created on-demand as content arrives (reasoning, text, tool calls)

            logger.info("[AI Stream] ⏱️ Entering for-await loop");
            for await (const part of streamResult.fullStream) {
              if (part.type === "start-step") {
                logger.info("[AI Stream] Step started", {
                  stepNumber: ("stepNumber" in part
                    ? String(part.stepNumber)
                    : "unknown") as string,
                });
              } else if (part.type === "finish-step") {
                const finishReason =
                  "finishReason" in part
                    ? String(part.finishReason)
                    : "unknown";
                const usage =
                  "usage" in part && part.usage ? part.usage : undefined;
                logger.info("[AI Stream] Step finished", {
                  finishReason,
                  usage: usage as Record<string, number> | undefined,
                });
              } else if (part.type === "text-delta") {
                const textDelta = part.text;

                if (
                  textDelta !== undefined &&
                  textDelta !== null &&
                  textDelta !== ""
                ) {
                  // NEW ARCHITECTURE: Add text to current ASSISTANT message (or create if doesn't exist)
                  if (!currentAssistantMessageId) {
                    const result = await createAssistantMessage({
                      initialContent: textDelta,
                      threadId: threadResultThreadId,
                      parentId: currentParentId,
                      depth: currentDepth,
                      model: data.model,
                      persona: data.persona ?? undefined,
                      sequenceId,
                      sequenceIndex,
                      isIncognito,
                      userId,
                      controller,
                      encoder,
                      logger,
                    });
                    currentAssistantMessageId = result.messageId;
                    currentAssistantContent = result.content;
                  } else {
                    // Accumulate content
                    currentAssistantContent += textDelta;
                  }

                  // Emit content-delta event
                  emitContentDelta({
                    messageId: currentAssistantMessageId,
                    delta: textDelta,
                    controller,
                    encoder,
                  });
                }
              } else if (part.type === "reasoning-start") {
                // NEW ARCHITECTURE: Add <think> tag inline to current ASSISTANT message
                isInReasoningBlock = true;
                const thinkTag = "<think>";

                // Create ASSISTANT message if it doesn't exist yet
                if (!currentAssistantMessageId) {
                  const result = await createAssistantMessage({
                    initialContent: thinkTag,
                    threadId: threadResultThreadId,
                    parentId: currentParentId,
                    depth: currentDepth,
                    model: data.model,
                    persona: data.persona ?? undefined,
                    sequenceId,
                    sequenceIndex,
                    isIncognito,
                    userId,
                    controller,
                    encoder,
                    logger,
                  });
                  currentAssistantMessageId = result.messageId;
                  currentAssistantContent = result.content;
                } else {
                  // Add <think> tag to existing message
                  currentAssistantContent += thinkTag;

                  // Emit delta for <think> tag
                  emitContentDelta({
                    messageId: currentAssistantMessageId,
                    delta: thinkTag,
                    controller,
                    encoder,
                  });
                }

                logger.info("[AI Stream] ⏱️ Reasoning started → <think>");
              } else if (part.type === "reasoning-delta") {
                // NEW ARCHITECTURE: Add reasoning text inline to current ASSISTANT message
                const reasoningText = "text" in part ? part.text : "";

                if (
                  reasoningText !== undefined &&
                  reasoningText !== null &&
                  reasoningText !== "" &&
                  currentAssistantMessageId
                ) {
                  // Accumulate content
                  currentAssistantContent += reasoningText;

                  // Emit content delta
                  emitContentDelta({
                    messageId: currentAssistantMessageId,
                    delta: reasoningText,
                    controller,
                    encoder,
                  });
                }
              } else if (part.type === "reasoning-end") {
                // NEW ARCHITECTURE: Add </think> tag inline to current ASSISTANT message
                if (currentAssistantMessageId && isInReasoningBlock) {
                  const thinkCloseTag = "</think>";

                  // Add closing tag
                  currentAssistantContent += thinkCloseTag;

                  // Emit closing tag delta
                  emitContentDelta({
                    messageId: currentAssistantMessageId,
                    delta: thinkCloseTag,
                    controller,
                    encoder,
                  });

                  isInReasoningBlock = false;

                  logger.info("[AI Stream] ⏱️ Reasoning ended → </think>", {
                    messageId: currentAssistantMessageId,
                    contentLength: currentAssistantContent.length,
                  });
                }
              } else if (part.type === "tool-call") {
                // NEW ARCHITECTURE: Finalize current ASSISTANT message before creating tool message
                if (currentAssistantMessageId && currentAssistantContent) {
                  // CRITICAL FIX: If reasoning block is still open, close it before tool call
                  if (isInReasoningBlock) {
                    const thinkCloseTag = "</think>";
                    currentAssistantContent += thinkCloseTag;

                    // Emit closing tag delta
                    const thinkCloseDelta = createStreamEvent.contentDelta({
                      messageId: currentAssistantMessageId,
                      delta: thinkCloseTag,
                    });
                    controller.enqueue(
                      encoder.encode(formatSSEEvent(thinkCloseDelta)),
                    );

                    isInReasoningBlock = false;

                    logger.info(
                      "[AI Stream] ⏱️ Reasoning interrupted by tool call → </think>",
                      {
                        messageId: currentAssistantMessageId,
                      },
                    );
                  }

                  // Update ASSISTANT message in database with accumulated content
                  // Public users (userId undefined) are allowed - helper converts to null
                  if (!isIncognito) {
                    await updateMessageContent({
                      messageId: currentAssistantMessageId,
                      content: currentAssistantContent,
                      logger,
                    });
                  }

                  logger.debug("Finalized ASSISTANT message before tool call", {
                    messageId: currentAssistantMessageId,
                    contentLength: currentAssistantContent.length,
                  });

                  // Increment sequence index for tool message
                  sequenceIndex++;

                  // Update parent chain: tool message should be child of ASSISTANT message
                  currentParentId = currentAssistantMessageId;
                  currentDepth++;

                  // Update last known values for error handling
                  lastParentId = currentParentId;
                  lastDepth = currentDepth;
                  lastSequenceIndex = sequenceIndex;

                  // Clear current ASSISTANT message (tool call interrupts it)
                  currentAssistantMessageId = null;
                  currentAssistantContent = "";
                  isInReasoningBlock = false;
                }

                // Lazy load endpoint metadata only when tool calls are encountered
                const map = await getEndpointMap();
                const endpoint = map.get(part.toolName);

                // Try to get widget metadata from endpoint definition
                let widgetMetadata: ToolCallWidgetMetadata | undefined;

                // Extract widget metadata from endpoint definition
                if (endpoint) {
                  try {
                    const { ResponseMetadataExtractor } = await import(
                      "@/app/api/[locale]/v1/core/system/unified-interface/cli/widgets/response-metadata-extractor"
                    );
                    const extractor = new ResponseMetadataExtractor();

                    // Debug: Log endpoint structure
                    logger.info("[AI Stream] Endpoint structure", {
                      toolName: part.toolName,
                      hasDefinition: !!endpoint.definition,
                      hasFields: !!endpoint.definition?.fields,
                      fieldsType: typeof endpoint.definition?.fields,
                      fieldsKeys:
                        endpoint.definition?.fields &&
                        typeof endpoint.definition.fields === "object"
                          ? Object.keys(endpoint.definition.fields).slice(0, 5)
                          : [],
                    });

                    const metadata = extractor.extractResponseMetadata(
                      endpoint.definition,
                    );

                    logger.info("[AI Stream] Widget metadata extraction", {
                      toolName: part.toolName,
                      hasMetadata: !!metadata,
                      hasFields: !!metadata?.fields,
                      fieldsCount: metadata?.fields?.length || 0,
                    });

                    if (metadata?.fields && metadata.fields.length > 0) {
                      widgetMetadata = {
                        endpointId: endpoint.toolName,
                        responseFields: metadata.fields.map((field) => ({
                          // By architectural contract, field names/labels/descriptions from endpoint
                          // definitions are translation keys
                          name: field.name as TranslationKey,
                          widgetType: field.widgetType,
                          label: field.label as TranslationKey | undefined,
                          description: field.description as
                            | TranslationKey
                            | undefined,
                          layout: field.config as Record<
                            string,
                            string | number | boolean
                          >,
                        })),
                      };
                      logger.info("[AI Stream] Widget metadata created", {
                        toolName: part.toolName,
                        endpointId: widgetMetadata.endpointId,
                        responseFieldsCount:
                          widgetMetadata.responseFields.length,
                      });
                    } else {
                      widgetMetadata = undefined;
                      logger.warn(
                        "[AI Stream] No widget metadata fields found",
                        {
                          toolName: part.toolName,
                        },
                      );
                    }
                  } catch (error) {
                    logger.error("Failed to extract widget metadata", {
                      error: String(error),
                      toolName: part.toolName,
                    });
                    widgetMetadata = undefined;
                  }
                } else {
                  logger.warn("[AI Stream] No endpoint found for tool", {
                    toolName: part.toolName,
                  });
                  widgetMetadata = undefined;
                }

                // Validate and prepare tool call data
                const rawArgs = "input" in part ? part.input : {};
                const validatedArgs: ToolCallResult = isValidToolResult(rawArgs)
                  ? rawArgs
                  : {};

                const toolCallData: ToolCall = {
                  toolName: part.toolName,
                  displayName: endpoint?.definition.title || part.toolName,
                  icon: endpoint?.definition.aiTool?.icon,
                  args: validatedArgs,
                  creditsUsed: endpoint?.definition.credits ?? 0,
                  widgetMetadata,
                };

                // NEW ARCHITECTURE: Emit MESSAGE_CREATED for UI, but DON'T store in DB yet
                // DB storage happens only when tool-result arrives
                currentToolMessageId = crypto.randomUUID();

                // Store tool call data for later (when result arrives)
                currentToolCallData = {
                  toolCall: toolCallData,
                  parentId: currentParentId,
                  depth: currentDepth,
                  sequenceIndex,
                };

                // Emit MESSAGE_CREATED event for UI (immediate feedback)
                // Include toolCalls array so frontend can render tool display
                const toolMessageEvent = createStreamEvent.messageCreated({
                  messageId: currentToolMessageId,
                  threadId: threadResultThreadId,
                  role: ChatMessageRole.TOOL,
                  content: "",
                  parentId: currentParentId,
                  depth: currentDepth,
                  sequenceId,
                  sequenceIndex,
                  toolCalls: [toolCallData], // Include tool call data for frontend rendering
                });
                controller.enqueue(
                  encoder.encode(formatSSEEvent(toolMessageEvent)),
                );

                // Emit TOOL_CALL event for real-time UX
                const toolCallEvent = createStreamEvent.toolCall({
                  messageId: currentToolMessageId,
                  toolName: toolCallData.toolName,
                  args: toolCallData.args,
                });
                controller.enqueue(
                  encoder.encode(formatSSEEvent(toolCallEvent)),
                );

                logger.info(
                  "[AI Stream] Tool call started (UI notified, DB storage pending)",
                  {
                    messageId: currentToolMessageId,
                    toolName: part.toolName,
                    sequenceIndex,
                  },
                );

                // Increment sequence index for next message
                sequenceIndex++;

                // Update parent chain: next message should be child of this tool message
                currentParentId = currentToolMessageId;
                currentDepth++;
              } else if (part.type === "tool-result") {
                // NEW ARCHITECTURE: NOW store TOOL message in DB with result
                if (currentToolMessageId && currentToolCallData) {
                  // AI SDK returns 'output' as unknown type
                  const output = "output" in part ? part.output : undefined;

                  logger.info("[AI Stream] Tool result RAW output", {
                    toolName: part.toolName,
                    hasOutput: "output" in part,
                    outputType: typeof output,
                    outputStringified: JSON.stringify(output).substring(0, 500),
                  });

                  // Check if the output is an error result
                  let toolError: string | undefined;
                  if (
                    output &&
                    typeof output === "object" &&
                    "success" in output &&
                    "error" in output
                  ) {
                    if (output.success === false) {
                      toolError =
                        typeof output.error === "string"
                          ? (output.error as string)
                          : JSON.stringify(output.error);
                    }
                  }

                  // Clean output by removing undefined values (they break validation)
                  const cleanedOutput = output
                    ? JSON.parse(JSON.stringify(output))
                    : undefined;

                  // Validate and type the output using type guard
                  const validatedOutput: ToolCallResult | undefined =
                    isValidToolResult(cleanedOutput)
                      ? cleanedOutput
                      : undefined;

                  // If error, create ERROR message first (proper timestamp order)
                  if (toolError && !isIncognito && userId) {
                    const errorMessageId = crypto.randomUUID();
                    await createErrorMessage({
                      messageId: errorMessageId,
                      threadId: threadResultThreadId,
                      content: toolError,
                      errorType: "TOOL_ERROR",
                      parentId: currentToolCallData.parentId,
                      depth: currentToolCallData.depth,
                      userId,
                      sequenceId,
                      sequenceIndex: currentToolCallData.sequenceIndex - 0.5, // Insert before tool message
                      logger,
                    });

                    logger.info(
                      "[AI Stream] ERROR message created for tool error",
                      {
                        errorMessageId,
                        toolError,
                      },
                    );
                  }

                  // Add result to tool call data (for both DB and UI)
                  const toolCallWithResult: ToolCall = {
                    ...currentToolCallData.toolCall,
                    result: validatedOutput,
                    error: toolError,
                  };

                  // NOW create TOOL message in DB with result/error
                  // Public users (userId undefined) are allowed - helper converts to null
                  if (!isIncognito) {
                    await createToolMessage({
                      messageId: currentToolMessageId,
                      threadId: threadResultThreadId,
                      toolCall: toolCallWithResult,
                      parentId: currentToolCallData.parentId,
                      depth: currentToolCallData.depth,
                      userId,
                      sequenceId,
                      sequenceIndex: currentToolCallData.sequenceIndex,
                      model: data.model,
                      persona: data.persona,
                      logger,
                    });
                  }

                  logger.info(
                    "[AI Stream] Tool result validated and saved to DB",
                    {
                      messageId: currentToolMessageId,
                      toolName: part.toolName,
                      hasResult: !!validatedOutput,
                      hasError: !!toolError,
                      resultType: typeof validatedOutput,
                      isValid: isValidToolResult(cleanedOutput),
                      wasCleaned: output !== cleanedOutput,
                    },
                  );

                  // Emit TOOL_RESULT event for real-time UX with updated tool call data
                  const toolResultEvent = createStreamEvent.toolResult({
                    messageId: currentToolMessageId,
                    toolName: part.toolName,
                    result: validatedOutput,
                    error: toolError,
                    toolCall: toolCallWithResult, // Include full tool call data with result
                  });
                  controller.enqueue(
                    encoder.encode(formatSSEEvent(toolResultEvent)),
                  );

                  // Clear current tool message tracking
                  currentToolMessageId = null;
                  currentToolCallData = null;

                  logger.info("[AI Stream] Tool result streamed to UI", {
                    toolName: part.toolName,
                    hasResult: !!validatedOutput,
                    hasError: !!toolError,
                  });
                }
              } else {
                // Log unhandled event types
                logger.debug("[AI Stream] Unhandled event type", {
                  type: part.type,
                  partKeys: Object.keys(part),
                });
              }
            }

            logger.info("[AI Stream] Finished processing fullStream");

            // Wait for completion to get final usage stats
            const usage = await streamResult.usage;
            const finishReason = await streamResult.finishReason;

            // NEW ARCHITECTURE: Finalize current ASSISTANT message if exists
            if (currentAssistantMessageId && currentAssistantContent) {
              await finalizeAssistantMessage({
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

            logger.info("[AI Stream] Stream completed", {
              totalTokens: usage.totalTokens,
            });

            // Deduct credits AFTER successful completion (not optimistically)
            await deductCredits({
              modelCost,
              user,
              model: data.model,
              logger,
            });

            controller.close();
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : String(error);
            logger.error("Stream error", { error: errorMessage });

            // NEW ARCHITECTURE: Create ERROR message in DB/localStorage
            // Public users (userId undefined) are allowed - helper converts to null
            const errorMessageId = crypto.randomUUID();
            if (!isIncognito) {
              await createErrorMessage({
                messageId: errorMessageId,
                threadId: threadResultThreadId,
                content: `Stream error: ${errorMessage}`,
                errorType: "STREAM_ERROR",
                parentId: lastParentId,
                depth: lastDepth,
                userId,
                sequenceId: lastSequenceId,
                sequenceIndex: lastSequenceIndex,
                logger,
              });
            }

            // Emit ERROR message event for UI
            const errorMessageEvent = createStreamEvent.messageCreated({
              messageId: errorMessageId,
              threadId: threadResultThreadId,
              role: ChatMessageRole.ERROR,
              content: `Stream error: ${errorMessage}`,
              parentId: lastParentId,
              depth: lastDepth,
              sequenceId: lastSequenceId,
              sequenceIndex: lastSequenceIndex,
            });
            controller.enqueue(
              encoder.encode(formatSSEEvent(errorMessageEvent)),
            );

            // Also emit legacy error event for compatibility
            const errorEvent = createStreamEvent.error({
              code: "STREAM_ERROR",
              message: errorMessage,
            });
            controller.enqueue(encoder.encode(formatSSEEvent(errorEvent)));
            controller.close();
          }
        },
      });

      logger.info("[AI Stream] ⏱️ Returning streaming response to client");
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
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error("Failed to create AI stream", {
        error: errorMessage,
        model: data.model,
      });

      return {
        success: false,
        message:
          "app.api.v1.core.agent.chat.aiStream.route.errors.streamCreationFailed",
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        messageParams: {
          error: errorMessage,
        },
      };
    }
  }
}

/**
 * Singleton instance
 */
export const aiStreamRepository = new AiStreamRepository();
