/**
 * Uncensored.ai API Handler
 *
 * Handles UncensoredAI model streaming with SSE events, tool calls, and database persistence.
 * Converts UncensoredAI responses to proper SSE format for the frontend.
 */

import "server-only";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { CoreTool } from "@/app/api/[locale]/v1/core/system/unified-interface/ai/tools-loader";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { ModelId } from "../../chat/model-access/models";
import type { DefaultFolderId } from "../../chat/config";
import { ChatMessageRole } from "../../chat/enum";
import { createStreamEvent, formatSSEEvent } from "../events";
import { createTextMessage } from "../../chat/threads/[threadId]/messages/repository";
import { generateThreadTitle } from "../../chat/threads/repository";
import { db } from "@/app/api/[locale]/v1/core/system/db";
import { chatMessages } from "../../chat/db";
import { eq } from "drizzle-orm";
import type {
  ResponseType,
  StreamingResponse,
} from "next-vibe/shared/types/response.schema";
import {
  createStreamingResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import type { AiStreamPostResponseOutput } from "../definition";

interface UncensoredMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

// FlexibleSchema type that accepts both Zod schemas and plain objects
type FlexibleSchema = { [key: string]: JsonValue } | Record<string, never>;

interface UncensoredRequest {
  model: string;
  messages: UncensoredMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  tools?: Array<{
    type: "function";
    function: {
      name: string;
      description: string;
      parameters: FlexibleSchema;
    };
  }>;
}

interface HandleUncensoredAIStreamParams {
  apiKey: string;
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  locale: CountryLanguage;
  logger: EndpointLogger;
  tools?: Record<string, CoreTool>;
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
  // Credit deduction callback
  deductCredits: () => Promise<void>;
}

/**
 * Handle UncensoredAI model streaming with proper SSE events
 * Converts UncensoredAI API response to SSE format for frontend consumption
 */
export async function handleUncensoredAIStream(
  params: HandleUncensoredAIStreamParams,
): Promise<ResponseType<AiStreamPostResponseOutput> | StreamingResponse> {
  const {
    apiKey,
    messages,
    systemPrompt,
    temperature,
    maxTokens,
    locale,
    logger,
    tools,
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
    deductCredits,
  } = params;

  const { t } = simpleT(locale);

  if (!apiKey) {
    logger.error("Uncensored.ai API key not configured");
    return {
      success: false,
      message:
        "app.api.v1.core.agent.chat.aiStream.route.errors.uncensoredApiKeyMissing",
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    };
  }

  // Convert tools to UncensoredAI format if provided
  const uncensoredTools = tools
    ? Object.entries(tools).map(([name, tool]) => ({
        type: "function" as const,
        function: {
          name,
          description: tool.description || "",
          // Zod schema will be serialized to JSON Schema by the API
          parameters: tool.inputSchema as never as FlexibleSchema,
        },
      }))
    : undefined;

  // Prepend system prompt as first message if provided
  const messagesWithSystem = systemPrompt
    ? [{ role: "system" as const, content: systemPrompt }, ...messages]
    : messages;

  // Request streaming with tools support
  const requestBody: UncensoredRequest = {
    model: "uncensored-lm",
    messages: messagesWithSystem.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
    temperature,
    max_tokens: maxTokens,
    stream: true,
    ...(uncensoredTools && uncensoredTools.length > 0
      ? { tools: uncensoredTools }
      : {}),
  };

  logger.info("[Uncensored AI] Making API request", {
    model: requestBody.model,
    messagesCount: messages.length,
    temperature,
    maxTokens,
    hasTools: !!uncensoredTools && uncensoredTools.length > 0,
    toolsCount: uncensoredTools?.length || 0,
  });

  // Create SSE stream
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller): Promise<void> {
      try {
        // Emit initial events (thread creation and user message)
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

        // Calculate initial parent and depth for AI message
        const initialAiParentId =
          operation === "answer-as-ai" || operation === "retry"
            ? (effectiveParentMessageId ?? null)
            : userMessageId;
        const initialAiDepth =
          operation === "answer-as-ai" || operation === "retry"
            ? messageDepth
            : messageDepth + 1;

        // Track message sequencing
        const sequenceId = crypto.randomUUID();

        // Track current parent/depth
        const currentParentId = initialAiParentId;
        const currentDepth = initialAiDepth;

        // Create ASSISTANT message BEFORE API call to show loading state
        const aiMessageId = crypto.randomUUID();
        const currentAssistantMessageId: string = aiMessageId;
        let currentAssistantContent = "";

        // Emit MESSAGE_CREATED event for ASSISTANT message immediately
        const messageEvent = createStreamEvent.messageCreated({
          messageId: aiMessageId,
          threadId,
          role: ChatMessageRole.ASSISTANT,
          content: "",
          parentId: currentParentId,
          depth: currentDepth,
          model,
          persona,
          sequenceId,
        });
        controller.enqueue(encoder.encode(formatSSEEvent(messageEvent)));

        logger.debug(
          "[Uncensored AI] ASSISTANT message created (loading state)",
          {
            messageId: aiMessageId,
          },
        );

        // Save initial ASSISTANT message to database if not incognito
        if (!isIncognito) {
          await createTextMessage({
            messageId: aiMessageId,
            threadId,
            content: "",
            parentId: currentParentId,
            depth: currentDepth,
            userId,
            model,
            persona: persona ?? "",
            sequenceId,
            logger,
          });
        }

        // Call Uncensored AI API
        logger.info("[Uncensored AI] Calling API");
        const response = await fetch(
          "https://mkstqjtsujvcaobdksxs.functions.supabase.co/functions/v1/chat-backup",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // eslint-disable-next-line i18next/no-literal-string
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify(requestBody),
          },
        );

        if (!response.ok) {
          const errorText = await response.text();
          // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Internal helper throws, caught by caller
          throw new Error(
            t(
              "app.api.v1.core.agent.chat.aiStream.providers.uncensoredHandler.errors.apiError",
              {
                status: response.status.toString(),
                errorText,
              },
            ),
          );
        }

        // Stream the response in real-time
        const reader = response.body?.getReader();
        if (!reader) {
          // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Internal helper throws, caught by caller
          throw new Error("Response body is not readable");
        }

        const decoder = new TextDecoder();
        let buffer = "";
        let isStreamingMode = true;
        let hasProcessedStreamingData = false;

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            // Handle any remaining buffered data as complete JSON response
            if (buffer.trim() && !hasProcessedStreamingData) {
              try {
                const parsed = JSON.parse(buffer);
                const content = parsed.choices?.[0]?.message?.content;
                if (content) {
                  // Stream content in small chunks for real-time feel
                  const chunkSize = 20;
                  for (let i = 0; i < content.length; i += chunkSize) {
                    const chunk = content.slice(i, i + chunkSize);
                    currentAssistantContent += chunk;
                    emitContentDelta({
                      messageId: currentAssistantMessageId,
                      delta: chunk,
                      controller,
                      encoder,
                    });
                  }
                }
              } catch {
                // Not valid JSON, ignore
              }
            }
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;

          // Detect streaming mode: check if we have SSE or newline-delimited JSON
          if (!isStreamingMode && buffer.includes("\n")) {
            const firstLine = buffer.split("\n")[0].trim();
            isStreamingMode =
              firstLine.startsWith("data:") || firstLine.startsWith("{");
          }

          // If not in streaming mode yet, continue buffering
          if (!isStreamingMode) {
            continue;
          }

          // Process streaming data line-by-line
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmedLine = line.trim();

            if (!trimmedLine) {
              continue;
            }

            let jsonData: string | null = null;

            // Handle SSE format: "data: {json}"
            if (trimmedLine.startsWith("data: ")) {
              jsonData = trimmedLine.slice(6);
            }
            // Handle newline-delimited JSON streaming
            else if (trimmedLine.startsWith("{")) {
              jsonData = trimmedLine;
            }

            if (!jsonData || jsonData === "[DONE]") {
              continue;
            }

            try {
              const parsed = JSON.parse(jsonData);

              // Check for streaming format (delta.content - OpenAI streaming format)
              const deltaContent = parsed.choices?.[0]?.delta?.content;

              // Check for non-streaming format (message.content - complete format)
              const messageContent = parsed.choices?.[0]?.message?.content;

              const textContent = deltaContent || messageContent;

              if (textContent) {
                hasProcessedStreamingData = true;
                // Accumulate content and emit delta
                currentAssistantContent += textContent;
                emitContentDelta({
                  messageId: currentAssistantMessageId,
                  delta: textContent,
                  controller,
                  encoder,
                });
              }

              // TODO: Handle tool calls when UncensoredAI supports them
              // Check for tool_calls in delta or message
              // const toolCalls = parsed.choices?.[0]?.delta?.tool_calls || parsed.choices?.[0]?.message?.tool_calls;
            } catch {
              // Skip invalid JSON lines
            }
          }
        }

        logger.info("[Uncensored AI] Stream completed", {
          messageId: currentAssistantMessageId,
          contentLength: currentAssistantContent.length,
        });

        // Finalize ASSISTANT message
        const contentDoneEvent = createStreamEvent.contentDone({
          messageId: currentAssistantMessageId,
          content: currentAssistantContent,
          totalTokens: null,
          finishReason: "stop",
        });
        controller.enqueue(encoder.encode(formatSSEEvent(contentDoneEvent)));

        // Update ASSISTANT message in database with final content
        if (!isIncognito) {
          await db
            .update(chatMessages)
            .set({
              content: currentAssistantContent,
              tokens: null,
              updatedAt: new Date(),
            })
            .where(eq(chatMessages.id, currentAssistantMessageId));
        }

        logger.info("Finalized ASSISTANT message", {
          messageId: currentAssistantMessageId,
          contentLength: currentAssistantContent.length,
        });

        // Deduct credits AFTER successful completion
        await deductCredits();

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
 * Emit initial stream events (thread creation and user message)
 */
function emitInitialEvents(params: {
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
  }

  // For answer-as-ai and retry, skip user message event
  if (operation !== "answer-as-ai" && operation !== "retry") {
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
    controller.enqueue(encoder.encode(formatSSEEvent(userMessageEvent)));
    logger.debug("USER MESSAGE_CREATED event emitted", {
      messageId: userMessageId,
    });
  }
}

/**
 * Emit content delta event for streaming
 */
function emitContentDelta(params: {
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
