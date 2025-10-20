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
import { getModelCost } from "../model-access/costs";
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
  const [message] = await db
    .select()
    .from(chatMessages)
    .where(
      and(eq(chatMessages.id, messageId), eq(chatMessages.authorId, userId)),
    )
    .limit(1);

  if (!message) {
    logger.error("Parent message not found", { messageId, userId });
    return null;
  }

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
        // For server mode, fetch the parent message
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
        effectiveContent = parentMessage.content;
        effectiveRole = parentMessage.role.toLowerCase() as
          | "user"
          | "assistant"
          | "system";
        effectiveParentMessageId = parentMessage.parentId;

        logger.info("Retry operation - using parent message", {
          parentMessageId: data.parentMessageId,
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

  // Step 6: Create user message (skip for answer-as-ai operation)
  const userMessageId = crypto.randomUUID();
  if (data.operation !== "answer-as-ai") {
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

  if (data.operation === "answer-as-ai") {
    // For answer-as-ai, no AI context needed - user provides the content
    messages = [];
  } else if (!isIncognito && userId && effectiveThreadId) {
    // Fetch full thread history for context
    messages = await fetchMessageHistory(effectiveThreadId, userId, logger);

    // Add system prompt if provided
    if (data.systemPrompt) {
      messages.unshift({ role: "system", content: data.systemPrompt });
    }

    // Add current message
    messages.push({ role: effectiveRole, content: effectiveContent });
  } else {
    // Incognito mode - use only current message
    messages = data.systemPrompt
      ? [
          { role: "system" as const, content: data.systemPrompt },
          { role: effectiveRole, content: effectiveContent },
        ]
      : [{ role: effectiveRole, content: effectiveContent }];
  }

  // Step 8: Create AI message placeholder
  const aiMessageId = crypto.randomUUID();
  const parentForAiMessage =
    data.operation === "answer-as-ai"
      ? effectiveParentMessageId
      : userMessageId;

  if (!isIncognito && userId) {
    await db.insert(chatMessages).values({
      id: aiMessageId,
      threadId: threadResult.threadId,
      role: ChatMessageRole.ASSISTANT,
      content: data.operation === "answer-as-ai" ? data.content : "", // For answer-as-ai, use content directly
      parentId: parentForAiMessage,
      depth:
        data.operation === "answer-as-ai" ? messageDepth : messageDepth + 1,
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

  // Step 9: Handle answer-as-ai operation (no AI streaming needed)
  if (data.operation === "answer-as-ai") {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller): void {
        try {
          // Emit thread-created event if new thread
          if (threadResult.isNew) {
            const threadEvent = createStreamEvent.threadCreated({
              threadId: threadResult.threadId,
              title: generateThreadTitle(data.content),
              rootFolderId: data.rootFolderId,
              subFolderId: data.subFolderId || null,
            });
            controller.enqueue(encoder.encode(formatSSEEvent(threadEvent)));
          }

          // Emit AI message-created event
          const aiMessageEvent = createStreamEvent.messageCreated({
            messageId: aiMessageId,
            threadId: threadResult.threadId,
            role: "assistant",
            parentId: parentForAiMessage || null,
            depth: messageDepth,
            content: data.content,
            model: data.model,
            persona: data.persona || undefined,
          });
          controller.enqueue(encoder.encode(formatSSEEvent(aiMessageEvent)));

          // Emit content-done event immediately (no streaming)
          const doneEvent = createStreamEvent.contentDone({
            messageId: aiMessageId,
            content: data.content,
            totalTokens: null,
            finishReason: "user-provided",
          });
          controller.enqueue(encoder.encode(formatSSEEvent(doneEvent)));

          controller.close();
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          logger.error("Answer-as-AI error", { error: errorMessage });

          const errorEvent = createStreamEvent.error({
            code: "ANSWER_AS_AI_ERROR",
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
          Connection: "keep-alive",
        },
      }),
    );
  }

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
    const tools = data.enableSearch ? { braveSearch } : undefined;

    // Create SSE stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller): Promise<void> {
        try {
          // Emit thread-created event if new thread
          if (threadResult.isNew) {
            const threadEvent = createStreamEvent.threadCreated({
              threadId: threadResult.threadId,
              title: generateThreadTitle(data.content),
              rootFolderId: data.rootFolderId,
              subFolderId: data.subFolderId || null,
            });
            controller.enqueue(encoder.encode(formatSSEEvent(threadEvent)));
          }

          // Emit user message-created event
          const userMessageEvent = createStreamEvent.messageCreated({
            messageId: userMessageId,
            threadId: threadResult.threadId,
            role: data.role,
            parentId: data.parentMessageId || null,
            depth: messageDepth,
            content: data.content,
          });
          controller.enqueue(encoder.encode(formatSSEEvent(userMessageEvent)));

          // Emit AI message-created event
          const aiMessageEvent = createStreamEvent.messageCreated({
            messageId: aiMessageId,
            threadId: threadResult.threadId,
            role: "assistant",
            parentId: userMessageId,
            depth: messageDepth + 1,
            content: "",
            model: data.model,
            persona: data.persona || undefined,
          });
          controller.enqueue(encoder.encode(formatSSEEvent(aiMessageEvent)));

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

          // Stream text deltas
          for await (const chunk of streamResult.textStream) {
            fullContent += chunk;

            // Emit content-delta event
            const deltaEvent = createStreamEvent.contentDelta({
              messageId: aiMessageId,
              delta: chunk,
            });
            controller.enqueue(encoder.encode(formatSSEEvent(deltaEvent)));
          }

          // Wait for completion
          const [toolCalls, finishReason, usage] = await Promise.all([
            streamResult.toolCalls,
            streamResult.finishReason,
            streamResult.usage,
          ]);

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

          // Track search usage for credit deduction
          if (toolCalls && Array.isArray(toolCalls) && toolCalls.length > 0) {
            const searchCalls = toolCalls.filter(
              (call: { toolName: string }) => call.toolName === "braveSearch",
            );

            if (searchCalls.length > 0) {
              logger.info("Brave search tools called", {
                searchCount: searchCalls.length,
                userId,
                leadId: effectiveLeadId,
              });

              // Deduct credits for all search calls
              for (let i = 0; i < searchCalls.length; i++) {
                const messageId = crypto.randomUUID();
                const deductResult = await creditRepository.deductCredits(
                  userId ? { userId } : { leadId: effectiveLeadId },
                  1, // 1 credit per search
                  data.model,
                  messageId,
                );

                if (!deductResult.success) {
                  logger.error("Failed to deduct search credits", {
                    userId,
                    leadId: effectiveLeadId,
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

    // Deduct credits (optimistic - deduct before stream completes)
    if (modelCost > 0) {
      const messageId = crypto.randomUUID();
      const deductResult = await creditRepository.deductCredits(
        userId ? { userId } : { leadId: effectiveLeadId },
        modelCost,
        data.model,
        messageId,
      );

      if (!deductResult.success) {
        logger.error("Failed to deduct credits", {
          userId,
          leadId: effectiveLeadId,
          cost: modelCost,
        });
        // Continue anyway - stream already started
      } else {
        logger.info("Credits deducted successfully", {
          userId,
          leadId: effectiveLeadId,
          cost: modelCost,
          messageId,
        });
      }
    }

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
      message:
        "app.api.v1.core.agent.chat.aiStream.route.errors.streamCreationFailed",
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      messageParams: {
        error: errorMessage,
      },
    };
  }
}
