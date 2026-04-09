/**
 * StreamExecutionHandler - Handles AI SDK streamText execution and processing
 */

import "server-only";

import type { JSONValue, LanguageModel, ModelMessage } from "ai";
import {
  streamText as aiStreamText,
  stepCountIs,
  type StopCondition,
} from "ai";

const DEFAULT_TEMPERATURE = 0.7;

import type { ToolExecutionContext } from "@/app/api/[locale]/agent/chat/config";
import { calculateCreditCost } from "@/app/api/[locale]/agent/models/models";
import type { CoreTool } from "@/app/api/[locale]/system/unified-interface/ai/tools-loader";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { ChatModelId, ChatModelOption } from "../../models";
import type { AiStreamT } from "../../stream/i18n";
import {
  AbortReason,
  MAX_TOOL_CALLS,
  StreamAbortError,
} from "../core/constants";
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
    modelConfig: ChatModelOption;
    messages: ModelMessage[];
    streamAbortController: AbortController;
    systemPrompt: string;
    trailingSystemMessage?: string;
    tools: Record<string, CoreTool> | undefined;
    toolsConfig: Map<
      string,
      { requiresConfirmation: boolean; credits: number }
    >;
    /** Set of tool names the model is allowed to execute. null = all allowed. */
    activeToolNames: Set<string> | null;
    ctx: StreamContext;
    threadId: string;
    model: ChatModelId;
    skill: string;
    isIncognito: boolean;
    userId: string | undefined;
    emittedToolResultIds: Set<string> | undefined;
    ttsHandler: StreamingTTSHandler | null;
    user: JwtPayloadType;
    locale: CountryLanguage;
    logger: EndpointLogger;
    t: AiStreamT;
    streamContext: ToolExecutionContext;
    imageSize?: string;
    imageQuality?: string;
    musicDuration?: string;
  }): Promise<void> {
    const {
      provider,
      modelConfig,
      messages,
      streamAbortController,
      systemPrompt,
      trailingSystemMessage,
      tools,
      toolsConfig,
      activeToolNames,
      ctx,
      threadId,
      model,
      skill,
      isIncognito,
      userId,
      emittedToolResultIds,
      ttsHandler,
      user,
      locale,
      logger,
      t,
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

    // Context window guard for tool loops: abort when real token usage from
    // the API approaches the model's hard context limit. This prevents
    // "238K tokens to a 131K model" errors that occur when tool call results
    // accumulate across many steps. We abort at 90% to leave headroom.
    const contextGuardThreshold = Math.floor(modelConfig.contextWindow * 0.9);

    // Build generation settings for custom media providers.
    // providerOptions must be Record<string, JSONObject> (provider-keyed objects).
    // We use the "generation" key; custom providers read options.providerOptions?.["generation"].
    const { imageSize, imageQuality, musicDuration } = params;
    const generationSettings: Record<string, string> = {};
    if (imageSize) {
      generationSettings["imageSize"] = imageSize;
    }
    if (imageQuality) {
      generationSettings["imageQuality"] = imageQuality;
    }
    if (musicDuration) {
      generationSettings["musicDuration"] = musicDuration;
    }
    const hasGenerationSettings = Object.keys(generationSettings).length > 0;

    // Extract user prompt for generated media metadata (image/audio models).
    // Walk messages backwards to find the last user text part.
    let mediaPrompt = "";
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg?.role === "user") {
        const content = msg.content;
        if (typeof content === "string") {
          mediaPrompt = content.trim();
        } else if (Array.isArray(content)) {
          mediaPrompt = content
            .filter(
              (p): p is { type: "text"; text: string } => p.type === "text",
            )
            .map((p) => p.text)
            .join(" ")
            .trim();
        }
        if (mediaPrompt) {
          break;
        }
      }
    }

    const mediaCreditCost = calculateCreditCost(modelConfig, 0, 0, 0, 0);

    const providerOptions: Record<string, Record<string, JSONValue>> = {};
    if (hasGenerationSettings) {
      providerOptions["generation"] = generationSettings;
    }
    if (modelConfig.outputs?.includes("image")) {
      providerOptions["openrouter"] = {
        modalities: ["text", "image"] as JSONValue,
      };
    }

    const streamResult = aiStreamText({
      model: provider.chat(modelConfig.providerModel) as LanguageModel,
      messages,
      temperature: DEFAULT_TEMPERATURE,
      abortSignal: streamAbortController.signal,
      system: systemWithCacheControl,
      ...(Object.keys(providerOptions).length > 0 ? { providerOptions } : {}),
      ...(tools
        ? {
            tools,
            stopWhen: [
              stepCountIs(MAX_TOOL_CALLS),
              // endLoop / approve / wait: stop before the next AI turn starts.
              // The current step (tool calls + results) finishes naturally;
              // this predicate prevents the AI SDK from making another API request.
              // wakeUp: also yield when a wake-up-ready pub/sub signal has arrived.
              (
                (): StopCondition<typeof tools> => () =>
                  ctx.shouldStopLoop ||
                  ctx.stepHasToolsAwaitingConfirmation ||
                  ctx.shouldYieldForWakeUp ||
                  params.streamContext.waitingForRemoteResult === true
              )(),
            ],
            onStepFinish: (stepResult): void => {
              // Tool arguments are already sent via tool-call stream events.
              // Additionally: check real input token usage and abort if we are
              // approaching the model's context window.
              const inputTokens = stepResult.usage.inputTokens ?? 0;
              if (inputTokens > 0 && inputTokens >= contextGuardThreshold) {
                logger.warn(
                  "[ToolLoop] Context window guard triggered - aborting tool loop",
                  {
                    inputTokens,
                    contextGuardThreshold,
                    modelContextWindow: modelConfig.contextWindow,
                    model,
                  },
                );
                streamAbortController.abort(
                  new StreamAbortError(AbortReason.CONTEXT_WINDOW_GUARD),
                );
              }
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
          skill,
          isIncognito,
          userId,
          user,
          locale,
          toolsConfig,
          activeToolNames,
          streamAbortController,
          emittedToolResultIds,
          ttsHandler,
          logger,
          t,
          streamContext: params.streamContext,
          mediaPrompt,
          mediaCreditCost,
        });

        if (shouldAbort) {
          // Stream was intentionally aborted (e.g. REMOTE_TOOL_WAIT, endLoop).
          // Run AbortErrorHandler now - the stream loop exited via 'return', not
          // via an exception, so the catch block below will NOT fire.
          // AbortErrorHandler sets thread → "waiting" for REMOTE_TOOL_WAIT so
          // clearStreamingState (in the finally block) sees the state and skips.
          if (streamAbortController.signal.aborted && !ctx.abortHandled) {
            const reason = streamAbortController.signal.reason;
            const abortError =
              reason instanceof Error
                ? reason
                : new Error(String(reason ?? "Stream aborted"));
            const { AbortErrorHandler } = await import("./abort-error-handler");
            await AbortErrorHandler.handleAbortError({
              error: abortError,
              ctx,
              logger,
              threadId,
              isIncognito,
              userId,
              model,
              systemPrompt,
              trailingSystemMessage,
              messages,
              tools,
              user,
              t,
            });
            ctx.abortHandled = true;
          }
          return;
        }
      }
    } catch (streamError) {
      // Cancel TTS generation immediately to avoid wasting API calls + credits
      if (ttsHandler) {
        ttsHandler.cancel();
      }

      // If stream was intentionally aborted, run AbortErrorHandler for cleanup
      // (save partial content, deduct credits, emit interruption message).
      // The handler is idempotent via ctx.abortHandled flag.
      if (streamAbortController.signal.aborted) {
        const reason = streamAbortController.signal.reason;
        const abortError =
          reason instanceof Error
            ? reason
            : new Error(String(reason ?? "Stream aborted"));

        if (!ctx.abortHandled) {
          const { AbortErrorHandler } = await import("./abort-error-handler");
          await AbortErrorHandler.handleAbortError({
            error: abortError,
            ctx,
            logger,
            threadId,
            isIncognito,
            userId,
            model,
            systemPrompt,
            trailingSystemMessage,
            messages,
            tools,
            user,
            t,
          });
          ctx.abortHandled = true;
        } else {
          logger.debug(
            "[AI Stream] Swallowing post-abort error (already handled)",
            {
              abortReason: abortError.message,
              errorName:
                streamError instanceof Error ? streamError.name : "unknown",
              errorMessage:
                streamError instanceof Error
                  ? streamError.message
                  : String(streamError),
            },
          );
        }
        return;
      }

      // Non-abort error: try AbortErrorHandler (handles e.g. "Client disconnected")
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
          trailingSystemMessage,
          messages,
          tools,
          user,
          t,
        });

        if (wasHandled) {
          ctx.abortHandled = true;
          return;
        }
      }

      // Not an abort error, re-throw to outer StreamErrorCatchHandler
      // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Re-throw is necessary here to propagate to StreamErrorCatchHandler
      throw streamError;
    }

    const [usageData, providerMeta] = await Promise.all([
      streamResult.usage,
      streamResult.providerMetadata,
    ]);
    const inputTokens = usageData.inputTokens ?? 0;
    const outputTokens = usageData.outputTokens ?? 0;
    const cachedInputTokens =
      usageData.cachedInputTokens ??
      usageData.inputTokenDetails?.cacheReadTokens ??
      0;
    // cacheWriteTokens: prefer inputTokenDetails (OpenRouter/Anthropic native),
    // fall back to providerMetadata for claude-code provider which emits it there
    const cacheWriteTokens =
      usageData.inputTokenDetails?.cacheWriteTokens ??
      (
        providerMeta?.["claude-code"] as
          | { cacheWriteTokens?: number }
          | undefined
      )?.cacheWriteTokens ??
      0;
    const reasoningTokens =
      usageData.reasoningTokens ??
      usageData.outputTokenDetails?.reasoningTokens ??
      0;
    const uncachedInputTokens = inputTokens - cachedInputTokens;

    const actualCreditCost = calculateCreditCost(
      modelConfig,
      inputTokens,
      outputTokens,
      cachedInputTokens,
      cacheWriteTokens,
    );

    const cachePercentage =
      inputTokens > 0 ? Math.round((cachedInputTokens / inputTokens) * 100) : 0;

    logger.debug("[CACHE DEBUG] Token usage from AI response", {
      cachePercentage: `${cachePercentage}%`,
      cachedInputTokens,
      cacheWriteTokens,
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
        cachedInputTokens,
        cacheWriteTokens,
      },
      finishReason: finishReason ?? null,
      ttsHandler,
      user,
      modelCost: actualCreditCost,
      model,
      threadId,
      logger,
    });
  }
}
