/**
 * AI Stream Repository
 * Handles AI streaming chat functionality with thread/message creation
 */

import "server-only";

import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { and, eq } from "drizzle-orm";
import {
  createErrorResponse,
  createStreamingResponse,
  ErrorResponseTypes,
  type ResponseType,
  type StreamingResponse,
} from "next-vibe/shared/types/response.schema";

import { braveSearch } from "@/app/api/[locale]/v1/core/agent/chat/tools/brave-search/repository";
import { db } from "@/app/api/[locale]/v1/core/system/db";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import type { EndpointLogger } from "../../../system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import { creditRepository } from "../credits/repository";
import { creditValidator } from "../credits/validator";
import { chatMessages, chatThreads } from "../db";
import { ChatMessageRole } from "../enum";
import { FEATURE_COSTS, getModelCost } from "../model-access/costs";
import { getModelById, type ModelId } from "../model-access/models";
import type {
  AiStreamPostRequestOutput,
  AiStreamPostResponseOutput,
} from "./definition";
import { createStreamEvent, formatSSEEvent } from "./events";
import { isUncensoredAIModel } from "./providers/uncensored-ai";
import { handleUncensoredAI } from "./providers/uncensored-handler";

/**
 * Maximum duration for streaming responses (in seconds)
 */
export const maxDuration = 30;

/**
 * Generate thread title from first message
 */
function generateThreadTitle(content: string): string {
  // Take first 50 chars, trim to last complete word
  const truncated = content.substring(0, 50);
  const lastSpace = truncated.lastIndexOf(" ");
  const ellipsis = "...";
  return lastSpace > 20
    ? `${truncated.substring(0, lastSpace)}${ellipsis}`
    : truncated;
}

/**
 * Create or get thread ID
 */
async function ensureThread({
  threadId,
  rootFolderId,
  subFolderId,
  userId,
  content,
  isIncognito,
  logger,
}: {
  threadId: string | null | undefined;
  rootFolderId: string;
  subFolderId: string | null | undefined;
  userId?: string;
  content: string;
  isIncognito: boolean;
  logger: EndpointLogger;
}): Promise<{ threadId: string; isNew: boolean }> {
  // If threadId provided, verify it exists (unless incognito)
  if (threadId) {
    if (!isIncognito && userId) {
      const [existing] = await db
        .select()
        .from(chatThreads)
        .where(
          and(eq(chatThreads.id, threadId), eq(chatThreads.userId, userId)),
        )
        .limit(1);

      if (!existing) {
        logger.error("Thread not found", { threadId, userId });
        // Return error through Promise rejection - caller will handle
        return await Promise.reject(new Error("THREAD_NOT_FOUND"));
      }
    }
    return { threadId, isNew: false };
  }

  // Create new thread
  const newThreadId = crypto.randomUUID();
  const title = generateThreadTitle(content);

  // Only store in DB if not incognito
  if (!isIncognito && userId) {
    await db.insert(chatThreads).values({
      id: newThreadId,
      userId,
      title,
      rootFolderId,
      folderId: subFolderId || null,
    } as typeof chatThreads.$inferInsert);

    logger.info("Created new thread", { threadId: newThreadId, title });
  } else {
    logger.info("Generated incognito thread ID", { threadId: newThreadId });
  }

  return { threadId: newThreadId, isNew: true };
}

/**
 * Calculate message depth from parent
 */
async function calculateMessageDepth(
  parentMessageId: string | null | undefined,
  isIncognito: boolean,
): Promise<number> {
  if (!parentMessageId || isIncognito) {
    return 0;
  }

  const [parent] = await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.id, parentMessageId))
    .limit(1);

  return parent ? parent.depth + 1 : 0;
}

/**
 * Fetch message history for a thread
 * Returns messages in chronological order for AI context
 */
async function fetchMessageHistory(
  threadId: string,
  userId: string,
  logger: EndpointLogger,
): Promise<Array<{ role: "user" | "assistant" | "system"; content: string }>> {
  const messages = await db
    .select()
    .from(chatMessages)
    .where(
      and(
        eq(chatMessages.threadId, threadId),
        eq(chatMessages.authorId, userId),
      ),
    )
    .orderBy(chatMessages.createdAt);

  logger.info("Fetched message history", {
    threadId,
    messageCount: messages.length,
  });

  return messages.map((msg) => ({
    role: msg.role.toLowerCase() as "user" | "assistant" | "system",
    content: msg.content,
  }));
}

/**
 * Get parent message for retry/edit operations
 * Note: This function does NOT check thread ownership - that's handled at the API route level
 * We just need to verify the message exists and return its data
 */
async function getParentMessage(
  messageId: string,
  userId: string,
  logger: EndpointLogger,
): Promise<{
  id: string;
  threadId: string;
  role: string;
  content: string;
  parentId: string | null;
  depth: number;
} | null> {
  // Get the message by ID (supports both user and AI messages)
  const [message] = await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.id, messageId))
    .limit(1);

  if (!message) {
    logger.error("Parent message not found", { messageId, userId });
    return null;
  }

  logger.info("Found parent message", {
    messageId: message.id,
    threadId: message.threadId,
    role: message.role,
    authorId: message.authorId,
  });

  return {
    id: message.id,
    threadId: message.threadId,
    role: message.role,
    content: message.content,
    parentId: message.parentId,
    depth: message.depth,
  };
}

/**
 * Create AI streaming response with SSE events
 * Returns StreamingResponse for SSE stream or error ResponseType
 */
export async function createAiStream({
  data,
  locale,
  logger,
  userId,
  leadId,
  ipAddress,
}: {
  data: AiStreamPostRequestOutput;
  t: TFunction;
  locale: CountryLanguage;
  logger: EndpointLogger;
  userId?: string;
  leadId?: string;
  ipAddress?: string;
}): Promise<ResponseType<AiStreamPostResponseOutput> | StreamingResponse> {
  const isIncognito = data.rootFolderId === "incognito";

  logger.info("Creating AI stream", {
    operation: data.operation,
    model: data.model,
    rootFolderId: data.rootFolderId,
    isIncognito,
    userId,
    leadId,
  });

  // Step 0: Validate that non-logged-in users can only use incognito mode
  if (!userId && !isIncognito) {
    logger.error("Non-logged-in user attempted to use non-incognito folder", {
      rootFolderId: data.rootFolderId,
      leadId,
    });
    return createErrorResponse(
      "app.api.v1.core.agent.chat.aiStream.route.errors.authenticationRequired",
      ErrorResponseTypes.AUTHENTICATION_ERROR,
    );
  }

  // Step 1: Validate credits
  const modelCost = getModelCost(data.model);
  let validationResult;
  let effectiveLeadId = leadId;

  if (userId) {
    // Authenticated user
    validationResult = await creditValidator.validateUserCredits(
      userId,
      data.model,
      logger,
    );
  } else if (leadId) {
    // Known lead
    validationResult = await creditValidator.validateLeadCredits(
      leadId,
      data.model,
      logger,
    );
  } else if (ipAddress) {
    // New visitor - get or create lead by IP
    const leadByIpResult = await creditValidator.validateLeadByIp(
      ipAddress,
      data.model,
      locale,
      logger,
    );

    if (!leadByIpResult.success) {
      return createErrorResponse(
        "app.api.v1.core.agent.chat.aiStream.route.errors.creditValidationFailed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }

    effectiveLeadId = leadByIpResult.data.leadId;
    validationResult = {
      success: true,
      data: leadByIpResult.data.validation,
    };
  } else {
    // No identifier - should not happen
    logger.error("No user, lead, or IP address provided");
    return createErrorResponse(
      "app.api.v1.core.agent.chat.aiStream.route.errors.noIdentifier",
      ErrorResponseTypes.UNAUTHORIZED,
    );
  }

  if (!validationResult.success) {
    return createErrorResponse(
      "app.api.v1.core.agent.chat.aiStream.route.errors.creditValidationFailed",
      ErrorResponseTypes.INTERNAL_ERROR,
    );
  }

  // Step 2: Check if user has enough credits (unless free model)
  if (!validationResult.data.canUseModel) {
    logger.warn("Insufficient credits", {
      userId,
      leadId: effectiveLeadId,
      model: data.model,
      cost: modelCost,
      balance: validationResult.data.balance,
    });

    return createErrorResponse(
      "app.api.v1.core.agent.chat.aiStream.route.errors.insufficientCredits",
      ErrorResponseTypes.FORBIDDEN,
      {
        cost: modelCost.toString(),
        balance: validationResult.data.balance.toString(),
      },
    );
  }

  logger.info("Credit validation passed", {
    userId,
    leadId: effectiveLeadId,
    cost: modelCost,
    balance: validationResult.data.balance,
  });

  // Step 3: Handle operation-specific logic
  let effectiveThreadId = data.threadId;
  let effectiveParentMessageId = data.parentMessageId;
  let effectiveContent = data.content;
  let effectiveRole = data.role;

  switch (data.operation) {
    case "send":
      // Normal send - use data as-is
      break;

    case "retry": {
      // Retry: Re-generate AI response for the same user message
      // parentMessageId should point to the user message to retry
      // The new AI message will be a sibling of existing AI messages (both children of the user message)
      if (!data.parentMessageId) {
        logger.error("Retry operation requires parentMessageId");
        return createErrorResponse(
          "app.api.v1.core.agent.chat.aiStream.route.errors.invalidRequestData",
          ErrorResponseTypes.VALIDATION_ERROR,
        );
      }

      if (isIncognito) {
        // For incognito, client provides the context
        logger.info("Retry operation in incognito mode", {
          parentMessageId: data.parentMessageId,
        });
      } else if (userId) {
        // For server mode, fetch the user message
        const userMessage = await getParentMessage(
          data.parentMessageId,
          userId,
          logger,
        );

        if (!userMessage) {
          return createErrorResponse(
            "app.api.v1.core.agent.chat.aiStream.post.errors.notFound.title",
            ErrorResponseTypes.NOT_FOUND,
          );
        }

        effectiveThreadId = userMessage.threadId;
        effectiveContent = userMessage.content;
        effectiveRole = userMessage.role.toLowerCase() as
          | "user"
          | "assistant"
          | "system";
        // For retry, the new AI message should be a child of the user message
        // NOT a child of the user message's parent
        effectiveParentMessageId = data.parentMessageId;

        logger.info("Retry operation - using user message", {
          userMessageId: data.parentMessageId,
          threadId: effectiveThreadId,
        });
      }
      break;
    }

    case "edit": {
      // Edit: Create a branch with edited content
      // parentMessageId should point to the message being edited
      if (!data.parentMessageId) {
        logger.error("Edit operation requires parentMessageId");
        return createErrorResponse(
          "app.api.v1.core.agent.chat.aiStream.route.errors.invalidRequestData",
          ErrorResponseTypes.VALIDATION_ERROR,
        );
      }

      if (!isIncognito && userId) {
        const parentMessage = await getParentMessage(
          data.parentMessageId,
          userId,
          logger,
        );

        if (!parentMessage) {
          return createErrorResponse(
            "app.api.v1.core.agent.chat.aiStream.post.errors.notFound.title",
            ErrorResponseTypes.NOT_FOUND,
          );
        }

        effectiveThreadId = parentMessage.threadId;
        // Use the parent's parent as the new parent (branching at same level)
        effectiveParentMessageId = parentMessage.parentId;

        logger.info("Edit operation - creating branch", {
          originalMessageId: data.parentMessageId,
          threadId: effectiveThreadId,
          newParentId: effectiveParentMessageId,
        });
      }
      // Content and role come from data (edited values)
      break;
    }

    case "answer-as-ai": {
      // Answer as AI: User provides AI response content
      // This creates an AI message without calling the AI model
      logger.info("Answer-as-AI operation", {
        threadId: data.threadId,
        parentMessageId: data.parentMessageId,
      });
      // For this operation, we'll skip the AI streaming and just create the message
      // This will be handled later in the flow
      break;
    }
  }

  // Step 4: Ensure thread exists (create if needed)
  let threadResult;
  try {
    threadResult = await ensureThread({
      threadId: effectiveThreadId,
      rootFolderId: data.rootFolderId,
      subFolderId: data.subFolderId,
      userId,
      content: effectiveContent,
      isIncognito,
      logger,
    });
  } catch (error) {
    logger.error("Failed to ensure thread", { error });
    return createErrorResponse(
      "app.api.v1.core.agent.chat.aiStream.post.errors.notFound.title",
      ErrorResponseTypes.NOT_FOUND,
    );
  }

  // Step 5: Calculate message depth
  const messageDepth = await calculateMessageDepth(
    effectiveParentMessageId,
    isIncognito,
  );

  // Step 6: Create user message (skip for answer-as-ai and retry operations)
  const userMessageId = crypto.randomUUID();
  if (data.operation !== "answer-as-ai" && data.operation !== "retry") {
    if (!isIncognito && userId) {
      await db.insert(chatMessages).values({
        id: userMessageId,
        threadId: threadResult.threadId,
        role: effectiveRole as (typeof ChatMessageRole)[keyof typeof ChatMessageRole],
        content: effectiveContent,
        parentId: effectiveParentMessageId || null,
        depth: messageDepth,
        authorId: userId,
        isAI: false,
      } as typeof chatMessages.$inferInsert);

      logger.info("Created user message", {
        messageId: userMessageId,
        threadId: threadResult.threadId,
        operation: data.operation,
      });
    } else {
      logger.info("Generated incognito user message ID", {
        messageId: userMessageId,
        operation: data.operation,
      });
    }
  }

  // Step 7: Prepare AI message context
  let messages: Array<{
    role: "user" | "assistant" | "system";
    content: string;
  }>;

  // Prepare system prompt with search instructions if needed
  let systemPrompt = data.systemPrompt || "";
  if (data.enableSearch) {
    const searchInstructions =
      "You have access to a web search tool. When the user asks about current events, recent information, or anything that requires up-to-date knowledge, use the search tool to find relevant information. After receiving search results, provide a comprehensive answer based on those results. Always cite your sources when using search results.";
    systemPrompt = systemPrompt
      ? `${systemPrompt}\n\n${searchInstructions}`
      : searchInstructions;
  }

  if (data.operation === "answer-as-ai") {
    // For answer-as-ai, we need the full conversation context up to the parent message
    // so the AI understands what it's responding to
    if (!isIncognito && userId && effectiveThreadId && data.parentMessageId) {
      // Fetch ALL messages in thread up to and including the parent message
      const allMessages = await db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.threadId, effectiveThreadId))
        .orderBy(chatMessages.createdAt);

      // Find the parent message index
      const parentIndex = allMessages.findIndex(
        (msg) => msg.id === data.parentMessageId,
      );

      if (parentIndex !== -1) {
        // Get all messages up to and including the parent message
        const contextMessages = allMessages.slice(0, parentIndex + 1);

        messages = contextMessages.map((msg) => ({
          role: msg.role.toLowerCase() as "user" | "assistant" | "system",
          content: msg.content,
        }));

        // Add a user message to prompt the AI to respond
        // This ensures the AI understands it should generate a response to the previous AI message
        if (effectiveContent.trim()) {
          // User provided custom prompt
          messages.push({ role: "user" as const, content: effectiveContent });
        } else {
          // No custom prompt - ask AI to continue/elaborate
          messages.push({
            role: "user" as const,
            content:
              "Continue the conversation by elaborating on or providing additional information about your previous response.",
          });
        }
      } else {
        logger.error("Parent message not found in thread", {
          parentMessageId: data.parentMessageId,
          threadId: effectiveThreadId,
        });
        // Fallback: just use the custom prompt
        messages = effectiveContent.trim()
          ? [{ role: "user" as const, content: effectiveContent }]
          : [];
      }
    } else if (effectiveContent.trim()) {
      // Incognito mode or no parent - just use the custom prompt
      messages = [{ role: "user" as const, content: effectiveContent }];
    } else {
      // No context and no custom prompt - use empty context
      messages = [];
    }
  } else if (!isIncognito && userId && effectiveThreadId) {
    // Fetch full thread history for context
    messages = await fetchMessageHistory(effectiveThreadId, userId, logger);

    // Add system prompt if provided
    if (systemPrompt) {
      messages.unshift({ role: "system", content: systemPrompt });
    }

    // Add current message
    messages.push({ role: effectiveRole, content: effectiveContent });
  } else {
    // Incognito mode - use only current message
    messages = systemPrompt
      ? [
          { role: "system" as const, content: systemPrompt },
          { role: effectiveRole, content: effectiveContent },
        ]
      : [{ role: effectiveRole, content: effectiveContent }];
  }

  // Step 8: Create AI message placeholder
  const aiMessageId = crypto.randomUUID();
  const parentForAiMessage =
    data.operation === "answer-as-ai" || data.operation === "retry"
      ? effectiveParentMessageId
      : userMessageId;

  if (!isIncognito && userId) {
    await db.insert(chatMessages).values({
      id: aiMessageId,
      threadId: threadResult.threadId,
      role: ChatMessageRole.ASSISTANT,
      content: "", // Always start with empty content - will be filled by AI streaming
      parentId: parentForAiMessage,
      depth:
        data.operation === "answer-as-ai" || data.operation === "retry"
          ? messageDepth
          : messageDepth + 1,
      isAI: true,
      model: data.model,
      persona: data.persona || null,
    } as typeof chatMessages.$inferInsert);

    logger.info("Created AI message placeholder", {
      messageId: aiMessageId,
      threadId: threadResult.threadId,
      operation: data.operation,
    });
  } else {
    logger.info("Generated incognito AI message ID", {
      messageId: aiMessageId,
      operation: data.operation,
    });
  }

  // Step 9: Start AI streaming (for all operations including answer-as-ai)
  try {
    // Special handling for Uncensored.ai - doesn't support streaming
    if (isUncensoredAIModel(data.model)) {
      if (!env.UNCENSORED_AI_API_KEY) {
        logger.error("Uncensored.ai API key not configured");
        return {
          success: false,
          message:
            "app.api.v1.core.agent.chat.aiStream.route.errors.uncensoredApiKeyMissing",
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        };
      }

      const response = await handleUncensoredAI(
        env.UNCENSORED_AI_API_KEY,
        messages,
        data.temperature,
        data.maxTokens,
        locale,
      );

      // Incognito mode: messages are not persisted, streaming handled client-side
      return createStreamingResponse(response);
    }

    const provider = createOpenRouter({
      apiKey: env.OPENROUTER_API_KEY,
    });

    logger.info("Starting OpenRouter stream", {
      model: data.model,
      enableSearch: data.enableSearch,
    });

    // Build tools object conditionally
    // Register the tool with the name "search" so the AI model can call it
    const tools = data.enableSearch ? { search: braveSearch } : undefined;

    // Create SSE stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller): Promise<void> {
        try {
          // Emit thread-created event if new thread
          if (threadResult.isNew) {
            logger.info("[DEBUG] Emitting THREAD_CREATED event", {
              threadId: threadResult.threadId,
              rootFolderId: data.rootFolderId,
            });
            const threadEvent = createStreamEvent.threadCreated({
              threadId: threadResult.threadId,
              title: generateThreadTitle(data.content),
              rootFolderId: data.rootFolderId,
              subFolderId: data.subFolderId || null,
            });
            controller.enqueue(encoder.encode(formatSSEEvent(threadEvent)));
            logger.info("[DEBUG] THREAD_CREATED event emitted", {
              threadId: threadResult.threadId,
            });
          } else {
            logger.info(
              "[DEBUG] Thread already exists, not emitting THREAD_CREATED",
              {
                threadId: threadResult.threadId,
                isNew: threadResult.isNew,
              },
            );
          }

          // For answer-as-ai, skip user message event and only emit AI message
          // For regular operations, emit both user and AI message events
          if (data.operation !== "answer-as-ai") {
            // Emit user message-created event
            logger.info("[DEBUG] Emitting USER MESSAGE_CREATED event", {
              messageId: userMessageId,
              threadId: threadResult.threadId,
              parentId: data.parentMessageId || null,
            });
            const userMessageEvent = createStreamEvent.messageCreated({
              messageId: userMessageId,
              threadId: threadResult.threadId,
              role: data.role,
              parentId: data.parentMessageId || null,
              depth: messageDepth,
              content: data.content,
            });
            const userMessageEventString = formatSSEEvent(userMessageEvent);
            logger.info("[DEBUG] USER MESSAGE_CREATED event formatted", {
              messageId: userMessageId,
              eventString: userMessageEventString.substring(0, 200),
            });
            controller.enqueue(encoder.encode(userMessageEventString));
            logger.info("[DEBUG] USER MESSAGE_CREATED event emitted", {
              messageId: userMessageId,
            });
          } else {
            logger.info(
              "[DEBUG] Skipping USER MESSAGE_CREATED event for answer-as-ai operation",
              {
                messageId: userMessageId,
              },
            );
          }

          // Emit AI message-created event
          // For answer-as-ai, parent is the message we're responding to
          // For regular operations, parent is the user message we just created
          const aiParentId =
            data.operation === "answer-as-ai"
              ? data.parentMessageId
              : userMessageId;
          const aiDepth =
            data.operation === "answer-as-ai" ? messageDepth : messageDepth + 1;

          logger.info("[DEBUG] Emitting AI MESSAGE_CREATED event", {
            messageId: aiMessageId,
            threadId: threadResult.threadId,
            parentId: aiParentId,
            operation: data.operation,
          });
          const aiMessageEvent = createStreamEvent.messageCreated({
            messageId: aiMessageId,
            threadId: threadResult.threadId,
            role: "assistant",
            parentId: aiParentId,
            depth: aiDepth,
            content: "",
            model: data.model,
            persona: data.persona || undefined,
          });
          controller.enqueue(encoder.encode(formatSSEEvent(aiMessageEvent)));
          logger.info("[DEBUG] AI MESSAGE_CREATED event emitted", {
            messageId: aiMessageId,
          });

          // Start streaming
          let fullContent = "";

          // Get the OpenRouter model ID (use openRouterModel if available, otherwise use model ID directly)
          const modelConfig = getModelById(data.model as ModelId);
          const openRouterModelId = modelConfig?.openRouterModel || data.model;

          const streamResult = streamText({
            model: provider(openRouterModelId),
            messages,
            temperature: data.temperature,
            abortSignal: AbortSignal.timeout(maxDuration * 1000),
            ...(tools && { tools, maxSteps: 5 }),
          });

          // Stream all parts including text after tool calls
          // Use fullStream to get all text parts across all steps
          let partCount = 0;
          let textDeltaCount = 0;
          let toolCallCount = 0;

          for await (const part of streamResult.fullStream) {
            partCount++;
            if (part.type === "text-delta") {
              textDeltaCount++;
              // The AI SDK uses 'text' property, not 'textDelta'
              const deltaText = part.text;

              // Only concatenate if text is defined and not empty
              if (
                deltaText !== undefined &&
                deltaText !== null &&
                deltaText !== ""
              ) {
                fullContent += deltaText;

                // Emit content-delta event
                const deltaEvent = createStreamEvent.contentDelta({
                  messageId: aiMessageId,
                  delta: deltaText,
                });
                controller.enqueue(encoder.encode(formatSSEEvent(deltaEvent)));
              }
            } else if (part.type === "tool-call") {
              toolCallCount++;
              // Log tool call with full details
              logger.info("[DEBUG] Tool call detected", {
                toolName: part.toolName,
                toolCallId: part.toolCallId,
                args: part.args,
                argsStringified: JSON.stringify(part.args),
              });

              // Emit tool-call event to frontend
              const toolCallEvent = createStreamEvent.toolCall({
                messageId: aiMessageId,
                toolName: part.toolName,
                args: part.args,
              });
              controller.enqueue(encoder.encode(formatSSEEvent(toolCallEvent)));
            } else if (part.type === "tool-result") {
              logger.info("[DEBUG] Tool result received", {
                toolName: part.toolName,
                resultType: typeof part.result,
                resultKeys:
                  typeof part.result === "object" && part.result !== null
                    ? Object.keys(part.result)
                    : undefined,
                result:
                  typeof part.result === "string"
                    ? part.result.substring(0, 200)
                    : typeof part.result === "object" && part.result !== null
                      ? JSON.stringify(part.result).substring(0, 500)
                      : part.result,
              });
            } else if (part.type === "tool-error") {
              logger.error("[DEBUG] Tool error occurred", {
                toolName: part.toolName,
                error: part.error,
              });
            }
          }

          logger.info("[DEBUG] fullStream iteration complete", {
            totalParts: partCount,
            textDeltaParts: textDeltaCount,
            toolCallsCount: toolCallCount,
            fullContentLength: fullContent.length,
          });

          // Wait for completion
          const [finalToolCalls, finishReason, usage] = await Promise.all([
            streamResult.toolCalls,
            streamResult.finishReason,
            streamResult.usage,
          ]);

          logger.info("Stream completed [FIXED]", {
            fullContentLength: fullContent.length,
            finishReason,
            toolCallsCount: finalToolCalls?.length || 0,
            isIncognito,
          });

          // Update AI message with final content (if not incognito)
          if (!isIncognito && userId) {
            await db
              .update(chatMessages)
              .set({
                content: fullContent,
                tokens: usage.totalTokens,
                metadata: {
                  totalTokens: usage.totalTokens,
                  finishReason: finishReason || "unknown",
                },
                updatedAt: new Date(),
              })
              .where(eq(chatMessages.id, aiMessageId));

            logger.info("Updated AI message with final content", {
              messageId: aiMessageId,
              contentLength: fullContent.length,
              tokens: usage.totalTokens,
            });
          }

          // Emit content-done event
          const doneEvent = createStreamEvent.contentDone({
            messageId: aiMessageId,
            content: fullContent,
            totalTokens: usage.totalTokens ?? null,
            finishReason: finishReason || null,
          });
          controller.enqueue(encoder.encode(formatSSEEvent(doneEvent)));

          // Deduct credits AFTER successful completion (not optimistically)
          if (modelCost > 0) {
            const creditMessageId = crypto.randomUUID();

            // Determine correct credit identifier based on subscription status
            let creditIdentifier: { userId?: string; leadId?: string };
            if (userId) {
              const identifierResult =
                await creditRepository.getCreditIdentifier(
                  userId,
                  effectiveLeadId,
                  logger,
                );
              if (!identifierResult.success) {
                logger.error("Failed to get credit identifier", {
                  userId,
                  leadId: effectiveLeadId,
                });
                creditIdentifier = { leadId: effectiveLeadId }; // Fallback to lead credits
              } else {
                creditIdentifier = {
                  userId: identifierResult.data.userId,
                  leadId: identifierResult.data.leadId,
                };
                logger.debug("Using credit identifier", {
                  creditType: identifierResult.data.creditType,
                  identifier: creditIdentifier,
                });
              }
            } else {
              creditIdentifier = { leadId: effectiveLeadId };
            }

            const deductResult = await creditRepository.deductCredits(
              creditIdentifier,
              modelCost,
              data.model,
              creditMessageId,
            );

            if (!deductResult.success) {
              logger.error("Failed to deduct credits", {
                userId,
                leadId: effectiveLeadId,
                cost: modelCost,
              });
            } else {
              logger.info("Credits deducted successfully", {
                userId,
                leadId: effectiveLeadId,
                cost: modelCost,
                messageId: creditMessageId,
                creditIdentifier,
              });
            }
          }

          // Track search usage for credit deduction
          if (
            finalToolCalls &&
            Array.isArray(finalToolCalls) &&
            finalToolCalls.length > 0
          ) {
            const searchCalls = finalToolCalls.filter(
              (call: { toolName: string }) => call.toolName === "braveSearch",
            );

            if (searchCalls.length > 0) {
              logger.info("Brave search tools called", {
                searchCount: searchCalls.length,
                userId,
                leadId: effectiveLeadId,
              });

              // Determine correct credit identifier for search deductions
              let searchCreditIdentifier: { userId?: string; leadId?: string };
              if (userId) {
                const identifierResult =
                  await creditRepository.getCreditIdentifier(
                    userId,
                    effectiveLeadId,
                    logger,
                  );
                if (!identifierResult.success) {
                  searchCreditIdentifier = { leadId: effectiveLeadId };
                } else {
                  searchCreditIdentifier = {
                    userId: identifierResult.data.userId,
                    leadId: identifierResult.data.leadId,
                  };
                }
              } else {
                searchCreditIdentifier = { leadId: effectiveLeadId };
              }

              // Deduct credits for all search calls
              for (let i = 0; i < searchCalls.length; i++) {
                const messageId = crypto.randomUUID();
                const deductResult = await creditRepository.deductCredits(
                  searchCreditIdentifier,
                  FEATURE_COSTS.BRAVE_SEARCH, // Use constant for search cost
                  "brave-search", // Use "brave-search" as the model ID
                  messageId,
                );

                if (!deductResult.success) {
                  logger.error("Failed to deduct search credits", {
                    userId,
                    leadId: effectiveLeadId,
                    cost: FEATURE_COSTS.BRAVE_SEARCH,
                  });
                } else {
                  logger.info("Credits deducted successfully for search", {
                    userId,
                    leadId: effectiveLeadId,
                    cost: FEATURE_COSTS.BRAVE_SEARCH,
                    messageId,
                  });
                }
              }
            }
          }

          controller.close();
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          logger.error("Stream error", { error: errorMessage });

          // Emit error event
          const errorEvent = createStreamEvent.error({
            code: "STREAM_ERROR",
            message: errorMessage,
          });
          controller.enqueue(encoder.encode(formatSSEEvent(errorEvent)));
          controller.close();
        }
      },
    });

    return createStreamingResponse(
      new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
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
      message:
        "app.api.v1.core.agent.chat.aiStream.route.errors.streamCreationFailed",
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      messageParams: {
        error: errorMessage,
      },
    };
  }
}
