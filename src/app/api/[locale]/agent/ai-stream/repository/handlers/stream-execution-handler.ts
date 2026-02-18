/**
 * StreamExecutionHandler - Handles AI SDK streamText execution and processing
 */

import "server-only";

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
          return;
        }
      }

      // Not an abort error, re-throw to outer StreamErrorCatchHandler
      // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Re-throw is necessary here to propagate to StreamErrorCatchHandler
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

    const finishReason = await streamResult.finishReason;

    await StreamCompletionHandler.handleCompletion({
      ctx,
      usage: {
        inputTokens,
        outputTokens,
        totalTokens: usageData.totalTokens ?? 0,
      },
      finishReason: finishReason ?? null,
      ttsHandler,
      user,
      modelCost: actualCreditCost,
      model,
      logger,
    });
  }
}
