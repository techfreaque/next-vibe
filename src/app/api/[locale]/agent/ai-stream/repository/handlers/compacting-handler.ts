/**
 * Compacting Handler
 * Executes history compacting as a sub-stream operation
 */

import "server-only";

import { streamText } from "ai";
import { eq } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";
import { v4 as uuidv4 } from "uuid";

import {
  calculateCreditCost,
  getModelById,
  type ModelId,
} from "@/app/api/[locale]/agent/models/models";
import { CreditRepository } from "@/app/api/[locale]/credits/repository";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import type { DefaultFolderId } from "../../../chat/config";
import { type ChatMessage, chatMessages } from "../../../chat/db";
import { ChatMessageRole } from "../../../chat/enum";
import { updateMessageContent } from "../../../chat/threads/[threadId]/messages/repository";
import { createStreamEvent, formatSSEEvent } from "../../events";
import type { StreamContext } from "../core/stream-context";
import { MessageConverter } from "./message-converter";

/**
 * Build compacting instructions (without conversation text)
 */
function buildCompactingInstructions(): string {
  return `You are now in compacting mode. Your task is to compact the conversation history above to save tokens while preserving essential context.

**Instructions:**
1. Summarize the key points, decisions, and important information from the conversation
2. Maintain chronological flow and preserve critical context
3. Focus on facts, decisions, user preferences, and important details mentioned
4. Remove redundant greetings, small talk, and repetitive content
5. Keep technical details, code snippets, and specific instructions
6. Preserve any important tool usage and results
7. Output ONLY the summary in a clear, organized format - no meta-commentary`;
}

/**
 * Compacting Handler
 * Manages the compacting sub-stream operation
 */
export class CompactingHandler {
  /**
   * Execute compacting operation as a sub-stream
   * Similar to tool loop but for history compacting
   */
  static async executeCompacting(params: {
    messagesToCompact: ChatMessage[];
    branchMessages: ChatMessage[];
    currentUserMessage: ChatMessage | null;
    threadId: string;
    parentId: string | null;
    depth: number;
    sequenceId: string;
    ctx: StreamContext;
    controller: ReadableStreamDefaultController;
    isIncognito: boolean;
    userId: string | undefined;
    user: JwtPayloadType;
    model: ModelId;
    character: string | null;
    systemPrompt: string;
    tools: Parameters<typeof streamText>[0]["tools"];
    providerModel: Parameters<typeof streamText>[0]["model"];
    abortSignal: AbortSignal;
    logger: EndpointLogger;
    timezone: string;
    rootFolderId?: DefaultFolderId;
    compactingMessageCreatedAt: Date;
  }): Promise<
    | {
        success: true;
        compactedSummary: string;
        compactingMessageId: string;
        newParentId: string;
        newDepth: number;
      }
    | {
        success: false;
        compactingMessageId: string;
      }
  > {
    const {
      messagesToCompact,
      branchMessages,
      threadId,
      parentId,
      depth,
      sequenceId,
      controller,
      isIncognito,
      userId,
      user,
      model,
      character,
      systemPrompt,
      tools,
      providerModel,
      abortSignal,
      logger,
      timezone,
      rootFolderId,
      compactingMessageCreatedAt,
    } = params;

    // 1. Create compacting message ID upfront
    const compactingMessageId = uuidv4();

    // 2. Convert branch messages to AI SDK format with context messages for cache hits
    const historyMessages = await MessageConverter.toAiSdkMessages(
      branchMessages,
      logger,
      timezone,
      rootFolderId,
    );

    // 3. Build compacting mode context and instruction messages
    const { formatAbsoluteTimestamp } =
      await import("../system-prompt/message-metadata");
    const shortId = compactingMessageId.slice(-8);
    const timestamp = formatAbsoluteTimestamp(
      compactingMessageCreatedAt,
      timezone,
    );

    // Context system message announcing compacting mode
    const compactingModeContext = `[Context: ID:${shortId} | Posted:${timestamp} | Mode:auto-compacting]`;

    // User message with compacting instructions
    const compactingInstructions = buildCompactingInstructions();

    // Final context system message with full metadata
    const metadataParts: string[] = [`ID:${shortId}`];
    metadataParts.push(`Model:${model}`);
    if (character) {
      metadataParts.push(`Character:${character}`);
    }
    metadataParts.push(`Mode:compacting`);
    metadataParts.push(`Posted:${timestamp}`);
    const finalContextMessage = `[Context: ${metadataParts.join(" | ")}]`;

    const compactingMessages: Parameters<typeof streamText>[0]["messages"] = [
      ...historyMessages,
      {
        role: "system" as const,
        content: compactingModeContext,
      },
      {
        role: "user" as const,
        content: compactingInstructions,
      },
      {
        role: "system" as const,
        content: finalContextMessage,
      },
    ];

    // 5. Insert compacting message placeholder in DB (server threads only)
    if (!isIncognito) {
      await db.insert(chatMessages).values({
        id: compactingMessageId,
        threadId,
        role: ChatMessageRole.ASSISTANT,
        content: null, // Will be filled during streaming
        parentId,
        depth,
        sequenceId,
        authorId: userId ?? null,
        model,
        character: character ?? null,
        isAI: true,
        metadata: {
          isCompacting: true,
          compactedMessageCount: messagesToCompact.length,
          compactedTimeRange: {
            start: messagesToCompact[0]?.createdAt.toISOString() || "",
            end:
              messagesToCompact[
                messagesToCompact.length - 1
              ]?.createdAt.toISOString() || "",
          },
          originalMessageIds: messagesToCompact.map((m) => m.id),
        },
        createdAt: compactingMessageCreatedAt,
      });
    }

    // 6. Emit MESSAGE_CREATED event
    const compactingCreatedEvent = createStreamEvent.messageCreated({
      messageId: compactingMessageId,
      threadId,
      role: ChatMessageRole.ASSISTANT,
      content: "",
      parentId,
      depth,
      sequenceId,
      model,
      character,
      metadata: {
        isCompacting: true,
        compactedMessageCount: messagesToCompact.length,
      },
    });
    controller.enqueue(formatSSEEvent(compactingCreatedEvent));

    // 7. Stream compacting operation
    let compactedSummary = "";

    try {
      const streamResult = await streamText({
        model: providerModel,
        system: systemPrompt, // Same system prompt as main stream for caching
        messages: compactingMessages,
        tools, // Same tools as main stream for caching
        temperature: 0.3, // Lower temperature for consistent summaries
        abortSignal,
      });

      // 8. Process stream parts
      for await (const part of streamResult.fullStream) {
        if (part.type === "text-delta") {
          compactedSummary += part.text;

          // Emit COMPACTING_DELTA event
          const deltaEvent = createStreamEvent.compactingDelta({
            messageId: compactingMessageId,
            delta: part.text,
          });
          controller.enqueue(formatSSEEvent(deltaEvent));
        }

        if (part.type === "finish") {
          // Get usage data for token/credit tracking
          const usageData = await streamResult.usage;
          const inputTokens = usageData.inputTokens ?? 0;
          const outputTokens = usageData.outputTokens ?? 0;
          const totalTokens = usageData.totalTokens ?? 0;

          // Calculate cached vs uncached tokens
          const cachedInputTokens =
            usageData.cachedInputTokens ??
            usageData.inputTokenDetails?.cacheReadTokens ??
            0;
          const uncachedInputTokens = inputTokens - cachedInputTokens;

          // Get model config and calculate credit cost
          const modelConfig = getModelById(model);
          const creditCost = calculateCreditCost(
            modelConfig,
            uncachedInputTokens,
            outputTokens,
          );

          // Update DB with final compacted content and token metadata (server threads only)
          if (!isIncognito) {
            await updateMessageContent({
              messageId: compactingMessageId,
              content: compactedSummary,
              logger,
            });

            // Update message with token metadata
            await db
              .update(chatMessages)
              .set({
                tokens: totalTokens,
                metadata: {
                  isCompacting: true,
                  compactedMessageCount: messagesToCompact.length,
                  promptTokens: inputTokens,
                  completionTokens: outputTokens,
                  compactedTimeRange: {
                    start: messagesToCompact[0]?.createdAt.toISOString() || "",
                    end:
                      messagesToCompact[
                        messagesToCompact.length - 1
                      ]?.createdAt.toISOString() || "",
                  },
                  originalMessageIds: messagesToCompact.map((m) => m.id),
                },
              })
              .where(eq(chatMessages.id, compactingMessageId));
          }

          // Emit TOKENS_UPDATED event for frontend
          const tokensEvent = createStreamEvent.tokensUpdated({
            messageId: compactingMessageId,
            promptTokens: inputTokens,
            completionTokens: outputTokens,
            totalTokens,
            finishReason: "stop",
            creditCost,
          });
          controller.enqueue(formatSSEEvent(tokensEvent));

          // Deduct credits (incognito gets free compacting)
          if (!isIncognito && userId) {
            const deductResult =
              await CreditRepository.deductCreditsForModelUsage(
                user,
                creditCost,
                model,
                logger,
              );

            if (deductResult.success) {
              // Emit CREDITS_DEDUCTED event for optimistic credit update
              const creditEvent = createStreamEvent.creditsDeducted({
                amount: creditCost,
                feature: `compacting-${model}`,
                type: "model",
                partial: deductResult.partialDeduction,
              });
              controller.enqueue(formatSSEEvent(creditEvent));
            }
          }

          // Emit COMPACTING_DONE event
          const doneEvent = createStreamEvent.compactingDone({
            messageId: compactingMessageId,
            content: compactedSummary,
            metadata: {
              isCompacting: true,
              compactedMessageCount: messagesToCompact.length,
            },
          });
          controller.enqueue(formatSSEEvent(doneEvent));
        }

        if (part.type === "error") {
          const errorObj =
            part.error instanceof Error
              ? part.error
              : new Error(String(part.error));
          logger.error("[Compacting] Stream error", errorObj);

          // Emit error event
          const errorResponse = fail({
            message:
              "app.api.agent.chat.aiStream.errors.compactingStreamError" as const,
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
            messageParams: { error: errorObj.message },
          });
          const errorEvent = createStreamEvent.error(errorResponse);
          controller.enqueue(formatSSEEvent(errorEvent));

          // Return failure - don't continue with AI response
          return {
            success: false,
            compactingMessageId,
          };
        }
      }
    } catch (error) {
      const errorObj =
        error instanceof Error ? error : new Error(String(error));
      logger.error("[Compacting] Failed to compact history", errorObj);

      // Emit error event
      const errorResponse = fail({
        message:
          "app.api.agent.chat.aiStream.errors.compactingException" as const,
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        messageParams: { error: errorObj.message },
      });
      const errorEvent = createStreamEvent.error(errorResponse);
      controller.enqueue(formatSSEEvent(errorEvent));

      // Return failure - don't continue with AI response
      return {
        success: false,
        compactingMessageId,
      };
    }

    // 9. Return compacting success
    return {
      success: true,
      compactedSummary,
      compactingMessageId,
      newParentId: compactingMessageId,
      newDepth: depth + 1,
    };
  }
}
