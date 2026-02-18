/**
 * AbortErrorHandler - Handles graceful stream abort errors
 */

import "server-only";

import type { ModelMessage } from "ai";
import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";

import { chatMessages } from "@/app/api/[locale]/agent/chat/db";
import { ChatMessageRole } from "@/app/api/[locale]/agent/chat/enum";
import type { ModelId } from "@/app/api/[locale]/agent/models/models";
import { getModelById } from "@/app/api/[locale]/agent/models/models";
import { db } from "@/app/api/[locale]/system/db";
import type { CoreTool } from "@/app/api/[locale]/system/unified-interface/ai/tools-loader";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import type { StreamContext } from "../core/stream-context";

/**
 * Flatten a ModelMessage into a plain string the way the model actually sees it.
 * Handles text, tool-call, tool-result, and image content parts.
 * ~3.5 characters per token for English text.
 */
function flattenMessage(msg: ModelMessage): string {
  const parts: string[] = [];

  // role prefix adds a small overhead
  parts.push(String(msg.role));

  const { content } = msg;

  if (typeof content === "string") {
    parts.push(content);
  } else if (Array.isArray(content)) {
    for (const part of content as Array<
      Record<string, string | number | boolean | null | undefined>
    >) {
      if (part.type === "text" && typeof part.text === "string") {
        parts.push(part.text);
      } else if (part.type === "tool-call") {
        // tool name + serialized args
        parts.push(String(part.toolName ?? ""));
        if (part.args !== undefined) {
          parts.push(
            typeof part.args === "string"
              ? part.args
              : JSON.stringify(part.args),
          );
        }
      } else if (part.type === "tool-result") {
        parts.push(String(part.toolName ?? ""));
        if (part.result !== undefined) {
          parts.push(
            typeof part.result === "string"
              ? part.result
              : JSON.stringify(part.result),
          );
        }
      } else if (part.type === "image") {
        // images count as tokens but we can't measure them well — use a fixed overhead
        parts.push("[image]");
      } else if (part.type === "reasoning" && typeof part.text === "string") {
        parts.push(part.text);
      }
    }
  }

  return parts.join(" ");
}

/**
 * Flatten tool definitions to the text a model sees (name + description).
 * The AI SDK stores parameters as a jsonSchema() wrapper, not a plain object,
 * so we only extract the string fields we can reliably access.
 */
function flattenTools(tools: Record<string, CoreTool>): string {
  const parts: string[] = [];
  for (const [name, tool] of Object.entries(tools)) {
    parts.push(name);
    const t = tool as { description?: string };
    if (t.description) {
      parts.push(t.description);
    }
  }
  return parts.join(" ");
}

/**
 * Estimate token count based on full context.
 * Flattens everything to plain text before measuring, mirroring what the model tokenises.
 * Includes: system prompt + tool definitions (names/descriptions/params) +
 *           full message history (all content parts) + partial AI response so far.
 * Rough approximation: ~3.5 characters per token for English text.
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

  const systemPromptTokens = systemPrompt
    ? Math.ceil(systemPrompt.length / 3.5)
    : 0;

  const toolsText = tools ? flattenTools(tools) : "";
  const toolsTokens = toolsText ? Math.ceil(toolsText.length / 3.5) : 0;

  const messagesText = messages ? messages.map(flattenMessage).join(" ") : "";
  const messagesTokens = messagesText
    ? Math.ceil(messagesText.length / 3.5)
    : 0;

  const completionTokens = aiResponse ? Math.ceil(aiResponse.length / 3.5) : 0;

  const promptTokens = systemPromptTokens + toolsTokens + messagesTokens;
  const totalTokens = promptTokens + completionTokens;

  return { promptTokens, completionTokens, totalTokens };
}

export class AbortErrorHandler {
  /**
   * Handle graceful abort errors (client disconnect, tool confirmation)
   */
  static async handleAbortError(params: {
    error: Error;
    ctx: StreamContext;
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
        error.message === "Tool requires user confirmation" ||
        error.message === "Model requested loop stop"
      )
    ) {
      return { wasHandled: false };
    }

    const isToolConfirmation =
      error.message === "Tool requires user confirmation";
    const isLoopStop = error.message === "Model requested loop stop";

    logger.info("[AI Stream] Stream aborted", {
      message: error.message,
      errorName: error.name,
      reason: isToolConfirmation
        ? "waiting_for_tool_confirmation"
        : isLoopStop
          ? "model_requested_loop_stop"
          : "client_disconnected",
      hasPartialContent: !!ctx.currentAssistantContent,
      contentLength: ctx.currentAssistantContent.length,
    });

    // Save partial content and pending tools to database (non-incognito, non-tool-confirmation, non-loop-stop)
    // Tool confirmation and loop stop both close the controller early in finish-step-handler,
    // so SSE emission would panic. Only client-disconnect warrants partial content save + notification.
    if (!isIncognito && !isToolConfirmation && !isLoopStop) {
      try {
        let totalCredits = 0;

        if (ctx.currentAssistantMessageId && ctx.currentAssistantContent) {
          logger.info("[AI Stream] Saving partial content to database", {
            messageId: ctx.currentAssistantMessageId,
            contentLength: ctx.currentAssistantContent.length,
          });

          const tokenEstimate = estimateTokensFromContext({
            systemPrompt,
            messages,
            tools,
            aiResponse: ctx.currentAssistantContent,
          });

          const modelInfo = getModelById(model);
          let modelCreditCost = 0;
          if (modelInfo) {
            if (typeof modelInfo.creditCost === "function") {
              modelCreditCost = modelInfo.creditCost(
                modelInfo,
                tokenEstimate.promptTokens,
                tokenEstimate.completionTokens,
              );
            } else if (typeof modelInfo.creditCost === "number") {
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
          });

          // Flush + write final partial content to DB, emit CONTENT_DONE SSE
          await ctx.dbWriter.emitContentDone({
            messageId: ctx.currentAssistantMessageId,
            content: ctx.currentAssistantContent,
            finishReason: "stop",
            totalTokens: tokenEstimate.totalTokens,
            promptTokens: tokenEstimate.promptTokens,
            completionTokens: tokenEstimate.completionTokens,
          });

          logger.info("[AI Stream] Saved partial content to database", {
            messageId: ctx.currentAssistantMessageId,
            totalTokens: tokenEstimate.totalTokens,
          });

          // Emit TOKENS_UPDATED for credit accounting
          ctx.dbWriter.emitTokensUpdated({
            messageId: ctx.currentAssistantMessageId,
            promptTokens: tokenEstimate.promptTokens,
            completionTokens: tokenEstimate.completionTokens,
            totalTokens: tokenEstimate.totalTokens,
            finishReason: "stop",
            creditCost: modelCreditCost,
          });

          // Deduct model credits and emit CREDITS_DEDUCTED
          if (userId && modelCreditCost > 0) {
            await ctx.dbWriter.deductAndEmitCredits({
              user,
              amount: modelCreditCost,
              feature: `model:${model}`,
              type: "model",
              model,
            });

            logger.info("[AI Stream] Deducted and emitted model credits", {
              amount: modelCreditCost,
              model,
            });
          }
        }

        // Save pending tool messages to database
        if (ctx.pendingToolMessages.size > 0) {
          logger.info("[AI Stream] Saving pending tool messages to database", {
            count: ctx.pendingToolMessages.size,
          });

          for (const [, pendingTool] of ctx.pendingToolMessages) {
            const { messageId, toolCallData } = pendingTool;
            const { toolCall, parentId, depth } = toolCallData;

            await db.insert(chatMessages).values({
              id: messageId,
              threadId: threadId,
              role: ChatMessageRole.TOOL,
              content: null,
              parentId: parentId,
              depth: depth,
              sequenceId: ctx.sequenceId,
              authorId: userId ?? null,
              isAI: true,
              model: model,
              character: null,
              metadata: { toolCall: toolCall },
            });

            if (toolCall.creditsUsed && toolCall.creditsUsed > 0) {
              totalCredits += toolCall.creditsUsed;

              await ctx.dbWriter.deductAndEmitCredits({
                user,
                amount: toolCall.creditsUsed,
                feature: toolCall.toolName,
                type: "tool",
              });

              logger.info("[AI Stream] Deducted and emitted tool credits", {
                toolName: toolCall.toolName,
                amount: toolCall.creditsUsed,
              });
            }

            logger.info("[AI Stream] Saved pending tool message", {
              messageId,
              toolName: toolCall.toolName,
            });
          }
        }

        if (userId && totalCredits > 0) {
          logger.info("[AI Stream] Total credits for aborted stream", {
            totalCredits,
          });
        }

        // Write interruption error message to DB + emit SSE (SSE may not reach client
        // since the connection is dropped, but the DB write always happens).
        // Store the plain translation key as content so the bubble renders it without
        // an error type label or error code — it's an informational stop, not an error.
        await ctx.dbWriter.emitErrorMessage({
          threadId,
          errorType: "STREAM_ERROR",
          error: fail({
            message:
              "app.api.agent.chat.aiStream.info.streamInterrupted" as const,
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          }),
          content: "app.api.agent.chat.aiStream.info.streamInterrupted",
          parentId: ctx.lastParentId,
          depth: ctx.lastDepth,
          sequenceId: ctx.sequenceId,
          userId,
        });

        logger.info("[AI Stream] Saved interruption error message to DB", {
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

    // For tool confirmation and loop stop, controller is already closed in finish-step-handler.
    // For client disconnect, emit a fallback stopped event if there was no content yet,
    // then close the controller.
    if (!isToolConfirmation && !isLoopStop) {
      if (!ctx.currentAssistantMessageId || !ctx.currentAssistantContent) {
        // Stream aborted before any content was generated - emit an empty CONTENT_DONE
        // using the pre-generated assistant message ID so the frontend can close the slot.
        ctx.dbWriter.emitContentDoneRaw({
          messageId: ctx.preGeneratedAssistantMessageId,
          content: "",
          totalTokens: null,
          finishReason: "stop",
        });
      }
      ctx.dbWriter.closeController();
    }

    ctx.cleanup();

    return { wasHandled: true };
  }
}
