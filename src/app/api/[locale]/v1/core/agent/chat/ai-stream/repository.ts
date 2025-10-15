/**
 * AI Stream Repository
 * Handles AI streaming chat functionality using OpenAI GPT-4o and Uncensored.ai
 */

import "server-only";

import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import {
  createStreamingResponse,
  ErrorResponseTypes,
  type ResponseType,
  type StreamingResponse,
} from "next-vibe/shared/types/response.schema";

import { braveSearch } from "@/app/api/[locale]/v1/core/agent/chat/tools/brave-search/repository";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import type { EndpointLogger } from "../../../system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type {
  AiStreamPostRequestOutput,
  AiStreamPostResponseOutput,
} from "./definition";
import { isUncensoredAIModel } from "./providers/uncensored-ai";
import { handleUncensoredAI } from "./providers/uncensored-handler";

/**
 * Maximum duration for streaming responses (in seconds)
 */
export const maxDuration = 30;

/**
 * Create AI streaming response
 * Returns either a StreamingResponse for streaming endpoints or ResponseType for errors
 */
export async function createAiStream({
  data,
  locale,
  logger,
}: {
  data: AiStreamPostRequestOutput;
  t: TFunction;
  locale: CountryLanguage;
  logger: EndpointLogger;
}): Promise<ResponseType<AiStreamPostResponseOutput> | StreamingResponse> {
  logger.info("Creating AI stream", {
    model: data.model,
    messageCount: data.messages.length,
    temperature: data.temperature,
    maxTokens: data.maxTokens,
  });

  // Prepare messages with optional system prompt
  const messages = data.systemPrompt
    ? [
        { role: "system" as const, content: data.systemPrompt },
        ...data.messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      ]
    : data.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

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

    const result = streamText({
      model: provider(data.model),
      messages,
      temperature: data.temperature,
      abortSignal: AbortSignal.timeout(maxDuration * 1000),
      ...(tools && { tools, maxSteps: 5 }),
    });

    const streamResponse = result.toTextStreamResponse();

    logger.info("Stream created successfully");

    return createStreamingResponse(streamResponse);
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
