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
    modelCost: number;
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
      modelCost,
      controller,
      encoder,
      logger,
    } = params;

    const streamResult = aiStreamText({
      model: provider.chat(modelConfig.openRouterModel),
      messages,
      temperature: DEFAULT_TEMPERATURE,
      abortSignal: streamAbortController.signal,
      system: systemPrompt || undefined,
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

    // Handle stream completion - finalize message, flush TTS, deduct credits, cleanup
    await StreamCompletionHandler.handleCompletion({
      ctx,
      streamResult: {
        usage: streamResult.usage,
        finishReason: streamResult.finishReason,
      },
      ttsHandler,
      user,
      modelCost,
      model,
      isIncognito,
      controller,
      encoder,
      logger,
    });
  }
}
