/**
 * StreamExecutionHandler - Handles AI SDK streamText execution and processing
 */

import "server-only";

import type { ReadableStreamDefaultController } from "node:stream/web";

import type { ModelMessage } from "ai";
import { stepCountIs, streamText as aiStreamText } from "ai";

const DEFAULT_TEMPERATURE = 0.7;

import type {
  ModelId,
  ModelOption,
} from "@/app/api/[locale]/agent/models/models";
import { calculateCreditCost } from "@/app/api/[locale]/agent/models/models";
import type { CoreTool } from "@/app/api/[locale]/system/unified-interface/ai/tools-loader";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import { createStreamEvent, formatSSEEvent } from "../../events";
import { MAX_TOOL_CALLS } from "../core/constants";
import type { ProviderFactory } from "../core/provider-factory";
import type { StreamContext } from "../core/stream-context";
import type { StreamingTTSHandler } from "../streaming-tts";
import { StreamCompletionHandler } from "./stream-completion-handler";
import { StreamPartHandler } from "./stream-part-handler";

export class StreamExecutionHandler {
  /**
   * Execute AI streaming and process all parts
   */
  static async executeStream(params: {
    provider: ReturnType<typeof ProviderFactory.getProviderForModel>;
    modelConfig: ModelOption;
    messages: ModelMessage[];
    streamAbortController: AbortController;
    systemPrompt: string;
    tools: Record<string, CoreTool> | undefined;
    toolsConfig: Map<string, { requiresConfirmation: boolean }>;
    ctx: StreamContext;
    threadId: string;
    model: ModelId;
    character: string;
    isIncognito: boolean;
    userId: string | undefined;
    emittedToolResultIds: Set<string> | undefined;
    ttsHandler: StreamingTTSHandler | null;
    user: JwtPayloadType;
    controller: ReadableStreamDefaultController<Uint8Array>;
    encoder: TextEncoder;
    logger: EndpointLogger;
  }): Promise<void> {
    const {
      provider,
      modelConfig,
      messages,
      streamAbortController,
      systemPrompt,
      tools,
      toolsConfig,
      ctx,
      threadId,
      model,
      character,
      isIncognito,
      userId,
      emittedToolResultIds,
      ttsHandler,
      user,
      controller,
      encoder,
      logger,
    } = params;

    const systemWithCacheControl = systemPrompt
      ? [
          {
            role: "system" as const,
            content: systemPrompt,
            providerOptions: {
              openrouter: {
                cacheControl: { type: "ephemeral" as const, ttl: "1h" },
              },
            },
          },
        ]
      : undefined;

    const streamResult = aiStreamText({
      model: provider.chat(modelConfig.openRouterModel),
      messages,
      temperature: DEFAULT_TEMPERATURE,
      abortSignal: streamAbortController.signal,
      system: systemWithCacheControl,
      ...(tools
        ? {
            tools,
            // Enable multi-step tool calling loop - AI can call tools up to MAX_TOOL_CALLS times
            stopWhen: stepCountIs(MAX_TOOL_CALLS),
            onStepFinish: (): void => {
              // Tool arguments are already sent via tool-call stream events
            },
          }
        : {}),
    });

    try {
      for await (const part of streamResult.fullStream) {
        const { shouldAbort } = await StreamPartHandler.processPart({
          part,
          ctx,
          streamResult: {
            usage: streamResult.usage,
            finishReason: streamResult.finishReason,
          },
          threadId,
          model,
          character,
          isIncognito,
          userId,
          user,
          toolsConfig,
          streamAbortController,
          emittedToolResultIds,
          ttsHandler,
          controller,
          encoder,
          logger,
        });

        if (shouldAbort) {
          return;
        }
      }
    } catch (streamError) {
      // If stream was aborted, handle it inline and emit all events NOW
      // (before the ReadableStream's cancel() closes the controller)
      if (streamError instanceof Error) {
        const { AbortErrorHandler } = await import("./abort-error-handler");
        const { wasHandled } = await AbortErrorHandler.handleAbortError({
          error: streamError,
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
        });

        if (wasHandled) {
          // Abort was handled, return cleanly
          return;
        }
      }

      // Not an abort error, re-throw
      throw streamError;
    }

    const usageData = await streamResult.usage;
    const inputTokens = usageData.inputTokens ?? 0;
    const outputTokens = usageData.outputTokens ?? 0;
    const cachedInputTokens =
      usageData.cachedInputTokens ??
      usageData.inputTokenDetails?.cacheReadTokens ??
      0;
    const reasoningTokens =
      usageData.reasoningTokens ??
      usageData.outputTokenDetails?.reasoningTokens ??
      0;
    const uncachedInputTokens = inputTokens - cachedInputTokens;

    const actualCreditCost = calculateCreditCost(
      modelConfig,
      uncachedInputTokens,
      outputTokens,
    );

    const cachePercentage =
      inputTokens > 0 ? Math.round((cachedInputTokens / inputTokens) * 100) : 0;

    logger.info("[CACHE DEBUG] Token usage from AI response", {
      cachePercentage: `${cachePercentage}%`,
      cachedInputTokens,
      uncachedInputTokens,
      inputTokens,
      outputTokens,
      reasoningTokens,
      totalTokens: usageData.totalTokens,
      actualCreditCost,
      model,
      threadId,
      rawUsageData: JSON.stringify(usageData),
    });

    const messageIdForTokens =
      ctx.lastAssistantMessageId || ctx.currentAssistantMessageId;

    if (messageIdForTokens) {
      const finishReason = await streamResult.finishReason;

      const tokensEvent = createStreamEvent.tokensUpdated({
        messageId: messageIdForTokens,
        promptTokens: inputTokens,
        completionTokens: outputTokens,
        totalTokens: usageData.totalTokens ?? 0,
        finishReason: finishReason || null,
        creditCost: actualCreditCost,
      });
      controller.enqueue(encoder.encode(formatSSEEvent(tokensEvent)));
    } else {
      logger.warn(
        "Cannot emit TOKENS_UPDATED: no assistant message ID available",
      );
    }

    await StreamCompletionHandler.handleCompletion({
      ctx,
      streamResult: {
        usage: streamResult.usage,
        finishReason: streamResult.finishReason,
      },
      ttsHandler,
      user,
      modelCost: actualCreditCost,
      model,
      isIncognito,
      controller,
      encoder,
      logger,
    });
  }
}
