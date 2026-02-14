/**
 * AbortErrorHandler - Handles graceful stream abort errors
 */

import "server-only";

import type { ModelMessage } from "ai";
import { eq } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";

import { chatMessages } from "@/app/api/[locale]/agent/chat/db";
import { ChatMessageRole } from "@/app/api/[locale]/agent/chat/enum";
import type { ModelId } from "@/app/api/[locale]/agent/models/models";
import { getModelById } from "@/app/api/[locale]/agent/models/models";
import { CreditRepository } from "@/app/api/[locale]/credits/repository";
import { db } from "@/app/api/[locale]/system/db";
import type { CoreTool } from "@/app/api/[locale]/system/unified-interface/ai/tools-loader";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import { createStreamEvent, formatSSEEvent } from "../../events";
import type { StreamContext } from "../core/stream-context";

/**
 * Estimate token count based on full context
 * Includes: system prompt + tools + message history + AI response
 * Rough approximation: ~3.5 characters per token for English text
 */
function estimateTokensFromContext(params: {
  systemPrompt?: string;
  messages?: ModelMessage[];
  tools?: Record<string, CoreTool>;
  aiResponse: string;
}): {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
} {
  const { systemPrompt, messages, tools, aiResponse } = params;

  // Estimate system prompt tokens
  const systemPromptTokens = systemPrompt
    ? Math.ceil(systemPrompt.length / 3.5)
    : 0;

  // Estimate tools tokens (tools are typically JSON-ified)
  const toolsTokens = tools ? Math.ceil(JSON.stringify(tools).length / 3.5) : 0;

  // Estimate message history tokens
  const messagesTokens = messages
    ? Math.ceil(JSON.stringify(messages).length / 3.5)
    : 0;

  // Estimate AI response tokens
  const completionTokens = aiResponse ? Math.ceil(aiResponse.length / 3.5) : 0;

  const promptTokens = systemPromptTokens + toolsTokens + messagesTokens;
  const totalTokens = promptTokens + completionTokens;

  return {
    promptTokens,
    completionTokens,
    totalTokens,
  };
}

export class AbortErrorHandler {
  /**
   * Handle graceful abort errors (client disconnect, tool confirmation)
   */
  static async handleAbortError(params: {
    error: Error;
    ctx: StreamContext;
    controller: ReadableStreamDefaultController<Uint8Array>;
    encoder: TextEncoder;
    logger: EndpointLogger;
    threadId: string;
    isIncognito: boolean;
    userId: string | undefined;
    model: ModelId;
    systemPrompt?: string;
    messages?: ModelMessage[];
    tools?: Record<string, CoreTool>;
    user: JwtPayloadType;
  }): Promise<{ wasHandled: boolean }> {
    const {
      error,
      ctx,
      controller,
      encoder,
      logger,
      threadId,
      isIncognito,
      userId,
      model,
      systemPrompt,
      messages,
      tools,
      user,
    } = params;

    // Check if this is a graceful abort
    if (
      !(
        error.name === "AbortError" ||
        error.message === "Client disconnected" ||
        error.message === "Tool requires user confirmation"
      )
    ) {
      return { wasHandled: false };
    }

    logger.info("[AI Stream] Stream aborted", {
      message: error.message,
      errorName: error.name,
      reason:
        error.message === "Tool requires user confirmation"
          ? "waiting_for_tool_confirmation"
          : "client_disconnected",
      hasPartialContent: !!ctx.currentAssistantContent,
      contentLength: ctx.currentAssistantContent.length,
    });

    // Save partial content and pending tools to database (for non-incognito, non-tool-confirmation cases)
    if (!isIncognito && error.message !== "Tool requires user confirmation") {
      try {
        let totalCredits = 0;

        // Save assistant message if there's partial content
        if (ctx.currentAssistantMessageId && ctx.currentAssistantContent) {
          logger.info("[AI Stream] Saving partial content to database", {
            messageId: ctx.currentAssistantMessageId,
            contentLength: ctx.currentAssistantContent.length,
          });

          // Estimate tokens with full context (system + tools + messages + AI response)
          const tokenEstimate = estimateTokensFromContext({
            systemPrompt,
            messages,
            tools,
            aiResponse: ctx.currentAssistantContent,
          });

          // Get model pricing and calculate credits
          const modelInfo = getModelById(model);
          let modelCreditCost = 0;
          if (modelInfo) {
            if (typeof modelInfo.creditCost === "function") {
              // Token-based model - use the function to calculate credits
              modelCreditCost = modelInfo.creditCost(
                modelInfo,
                tokenEstimate.promptTokens,
                tokenEstimate.completionTokens,
              );
            } else if (typeof modelInfo.creditCost === "number") {
              // Credit-based model - use fixed cost
              modelCreditCost = modelInfo.creditCost;
            }
          }

          totalCredits += modelCreditCost;

          logger.info("[AI Stream] Estimated usage for aborted stream", {
            messageId: ctx.currentAssistantMessageId,
            promptTokens: tokenEstimate.promptTokens,
            completionTokens: tokenEstimate.completionTokens,
            totalTokens: tokenEstimate.totalTokens,
            modelCreditCost,
            hasSystemPrompt: !!systemPrompt,
            hasMessages: !!messages,
            hasTools: !!tools,
          });

          // Update the message with partial content and estimated tokens
          await db
            .update(chatMessages)
            .set({
              content: ctx.currentAssistantContent,
              tokens: tokenEstimate.totalTokens,
              updatedAt: new Date(),
            })
            .where(eq(chatMessages.id, ctx.currentAssistantMessageId));

          logger.info("[AI Stream] Saved partial content to database", {
            messageId: ctx.currentAssistantMessageId,
            totalTokens: tokenEstimate.totalTokens,
          });

          // Emit TOKENS_UPDATED event for credit accounting
          const tokensEvent = createStreamEvent.tokensUpdated({
            messageId: ctx.currentAssistantMessageId,
            promptTokens: tokenEstimate.promptTokens,
            completionTokens: tokenEstimate.completionTokens,
            totalTokens: tokenEstimate.totalTokens,
            finishReason: "stop",
            creditCost: modelCreditCost,
          });
          controller.enqueue(encoder.encode(formatSSEEvent(tokensEvent)));

          // Actually deduct model credits from database (for both token-based and credit-based models)
          if (userId && modelCreditCost > 0) {
            const deductResult =
              await CreditRepository.deductCreditsForModelUsage(
                user,
                modelCreditCost,
                model,
                logger,
              );

            if (deductResult.success) {
              // Emit CREDITS_DEDUCTED event for frontend
              const modelCreditsEvent = createStreamEvent.creditsDeducted({
                amount: modelCreditCost,
                feature: `model:${model}`,
                type: "model",
                partial: deductResult.partialDeduction,
              });
              controller.enqueue(
                encoder.encode(formatSSEEvent(modelCreditsEvent)),
              );

              logger.info("[AI Stream] Deducted and emitted model credits", {
                amount: modelCreditCost,
                model,
                partial: deductResult.partialDeduction,
              });
            } else {
              logger.error("[AI Stream] Failed to deduct model credits", {
                amount: modelCreditCost,
                model,
              });
            }
          }

          // Emit CONTENT_DONE with the partial content
          const contentDoneEvent = createStreamEvent.contentDone({
            messageId: ctx.currentAssistantMessageId,
            content: ctx.currentAssistantContent,
            totalTokens: tokenEstimate.totalTokens,
            finishReason: "stop",
          });
          controller.enqueue(encoder.encode(formatSSEEvent(contentDoneEvent)));
        }

        // Save pending tool messages to database
        if (ctx.pendingToolMessages.size > 0) {
          logger.info("[AI Stream] Saving pending tool messages to database", {
            count: ctx.pendingToolMessages.size,
          });

          for (const [, pendingTool] of ctx.pendingToolMessages) {
            const { messageId, toolCallData } = pendingTool;
            const { toolCall, parentId, depth } = toolCallData;

            // Save tool message to database
            await db.insert(chatMessages).values({
              id: messageId,
              threadId: threadId,
              role: ChatMessageRole.TOOL,
              content: null,
              parentId: parentId,
              depth: depth,
              sequenceId: ctx.sequenceId,
              authorId: userId ?? null,
              isAI: true, // Tool executions are part of AI flow
              model: model,
              character: null,
              metadata: {
                toolCall: toolCall,
              },
            });

            // Add tool execution credits if the tool had creditsUsed
            if (toolCall.creditsUsed && toolCall.creditsUsed > 0) {
              totalCredits += toolCall.creditsUsed;

              // Actually deduct credits from database for this tool
              const deductResult =
                await CreditRepository.deductCreditsForFeature(
                  user,
                  toolCall.creditsUsed,
                  toolCall.toolName,
                  logger,
                );

              if (deductResult.success) {
                // Emit CREDITS_DEDUCTED event for this tool
                const toolCreditsEvent = createStreamEvent.creditsDeducted({
                  amount: toolCall.creditsUsed,
                  feature: toolCall.toolName,
                  type: "tool",
                });
                controller.enqueue(
                  encoder.encode(formatSSEEvent(toolCreditsEvent)),
                );

                logger.info("[AI Stream] Deducted and emitted tool credits", {
                  toolName: toolCall.toolName,
                  amount: toolCall.creditsUsed,
                  messageId: deductResult.messageId,
                });
              } else {
                logger.error("[AI Stream] Failed to deduct tool credits", {
                  toolName: toolCall.toolName,
                  amount: toolCall.creditsUsed,
                });
              }
            }

            logger.info("[AI Stream] Saved pending tool message", {
              messageId,
              toolName: toolCall.toolName,
            });
          }
        }

        // Emit total CREDITS_DEDUCTED event for model usage
        if (userId && totalCredits > 0) {
          logger.info("[AI Stream] Total credits for aborted stream", {
            totalCredits,
          });
        }

        // Emit error message to inform user about interruption
        const errorResponse = fail({
          message:
            "app.api.agent.chat.aiStream.info.streamInterrupted" as const,
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
        const errorEvent = createStreamEvent.error(errorResponse);
        controller.enqueue(encoder.encode(formatSSEEvent(errorEvent)));

        logger.info("[AI Stream] Emitted interruption notification to user", {
          hasPartialContent: !!ctx.currentAssistantMessageId,
          pendingToolsCount: ctx.pendingToolMessages.size,
        });
      } catch (saveError) {
        logger.error("[AI Stream] Failed to save partial content/tools", {
          error:
            saveError instanceof Error ? saveError.message : String(saveError),
          messageId: ctx.currentAssistantMessageId,
        });
      }
    }

    // For tool confirmation, controller is already closed in processToolCall
    // For user abort, we DON'T close the controller here - let the normal flow handle it
    // This allows all events to be properly sent to the client
    if (error.message !== "Tool requires user confirmation") {
      // Only emit a fallback stopped event if we have no message content
      // (this handles cases where stream was aborted before any content was generated)
      if (!ctx.currentAssistantMessageId || !ctx.currentAssistantContent) {
        const stoppedEvent = createStreamEvent.contentDone({
          messageId: ctx.lastSequenceId ?? "",
          content: "",
          totalTokens: null,
          finishReason: "stop",
        });
        controller.enqueue(encoder.encode(formatSSEEvent(stoppedEvent)));
      }

      // DON'T close controller here - it will be closed by the caller
      // This ensures all enqueued events are actually sent
    }

    // Cleanup on abort
    ctx.cleanup();

    return { wasHandled: true };
  }
}
