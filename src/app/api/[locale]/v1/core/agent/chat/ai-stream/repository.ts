/**
 * AI Stream Repository
 * Handles AI streaming chat functionality using OpenAI GPT-4o and Uncensored.ai
 */

import "server-only";

import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import {
  createErrorResponse,
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
import { creditRepository } from "../credits/repository";
import { creditValidator } from "../credits/validator";
import { getModelCost } from "../model-access/costs";
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
  logger.info("Creating AI stream", {
    model: data.model,
    messageCount: data.messages.length,
    temperature: data.temperature,
    maxTokens: data.maxTokens,
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
      onFinish: async ({ toolCalls }) => {
        // Track search usage for credit deduction
        if (toolCalls && toolCalls.length > 0) {
          const searchCalls = toolCalls.filter(
            (call) => call.toolName === "braveSearch",
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
              } else {
                logger.info("Search credits deducted", {
                  userId,
                  leadId: effectiveLeadId,
                  messageId,
                });
              }
            }
          }
        }
      },
    });

    const streamResponse = result.toTextStreamResponse();

    logger.info("Stream created successfully");

    // Step 3: Deduct credits (optimistic - deduct before stream completes)
    if (modelCost > 0) {
      const messageId = crypto.randomUUID(); // Generate message ID for tracking
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
