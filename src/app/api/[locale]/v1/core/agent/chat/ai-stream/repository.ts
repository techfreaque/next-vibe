/**
 * AI Stream Repository
 * Data access layer for AI streaming functionality using OpenAI GPT-4o
 */

import "server-only";

import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { z } from "zod";

import type { EndpointLogger } from "../../../system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type {
  AiStreamPostRequestTypeOutput,
  chatMessageSchema,
} from "./definition";
import { JwtPayloadType } from "../../../user/auth/definition";
import { createUncensoredAI, isUncensoredAIModel } from "./providers/uncensored-ai";

type ChatMessage = z.infer<typeof chatMessageSchema>;

/**
 * Environment validation schema
 */
const envSchema = z.object({
  OPENROUTER_API_KEY: z.string().min(1),
});

/**
 * AI Stream Repository Interface
 */
export interface AiStreamRepository {
  streamChat(
    data: AiStreamPostRequestTypeOutput,
    logger: EndpointLogger,
    user: JwtPayloadType,
  ): Response;

  validateEnvironment(logger: EndpointLogger): ResponseType<boolean>;
}

/**
 * AI Stream Repository Implementation
 */
class AiStreamRepositoryImpl implements AiStreamRepository {
  /**
   * Validate environment variables
   */
  validateEnvironment(logger: EndpointLogger): ResponseType<boolean> {
    try {
      // eslint-disable-next-line node/no-process-env -- Required for environment validation
      const env = envSchema.parse(process.env);

      if (!env.OPENROUTER_API_KEY) {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.aiStream.streamingErrors.aiStream.error.apiKey.missing",
          ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        );
      }

      return createSuccessResponse(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(
        error,
      );
      logger.error("Environment validation failed", { error: errorMessage });
      return createErrorResponse(
        "app.api.v1.core.agent.chat.aiStream.streamingErrors.aiStream.error.apiKey.invalid",
        ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      );
    }
  }

  /**
   * Stream chat responses using OpenAI GPT-4o
   */
  streamChat(
    data: AiStreamPostRequestTypeOutput,
    logger: EndpointLogger,
    user: JwtPayloadType,
  ): Response {
    try {
      logger.debug("Starting AI stream request", {
        messageCount: data.messages.length,
        model: data.model,
        user,
      });

      // Validate environment
      const envValidation = this.validateEnvironment(logger);
      if (!envValidation.success) {
        // Return a streaming error response
        return new Response(
          JSON.stringify({
            error:
              "app.api.v1.core.agent.chat.aiStream.streamingErrors.aiStream.error.configuration",
            success: false,
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
      }

      // Prepare messages for OpenAI - convert roles to lowercase
      // Build ModelMessage[] with content parts expected by AI SDK
      const messages = (
        data.systemPrompt
          ? [
              {
                role: "system" as const,
                content: data.systemPrompt, // system expects plain string
              },
              ...data.messages.map((msg: ChatMessage) => ({
                role: (msg.role as "user" | "assistant"),
                content: [{ type: "text" as const, text: msg.content }],
              })),
            ]
          : data.messages.map((msg: ChatMessage) => ({
              role: (msg.role as "user" | "assistant"),
              content: [{ type: "text" as const, text: msg.content }],
            }))
      );

      logger.debug("Prepared messages for AI stream", {
        messageCount: messages.length,
        hasSystemPrompt: !!data.systemPrompt,
      });

      // Determine which provider to use based on model
      // eslint-disable-next-line node/no-process-env -- Required for API key
      let provider;
      let modelId = data.model || "openai/gpt-5-nano";

      if (isUncensoredAIModel(modelId)) {
        // Use Uncensored.ai provider
        if (!process.env.UNCENSORED_AI_API_KEY) {
          logger.error("Uncensored.ai API key not configured");
          return new Response(
            JSON.stringify({
              error: "Uncensored.ai API key not configured",
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
        provider = createUncensoredAI({
          apiKey: process.env.UNCENSORED_AI_API_KEY,
        });
        modelId = "uncensored-lm"; // Normalize model ID for Uncensored.ai
        logger.debug("Using Uncensored.ai provider");
      } else {
        // Use OpenRouter provider
        provider = createOpenRouter({
          apiKey: process.env.OPENROUTER_API_KEY,
        });
        logger.debug("Using OpenRouter provider", { model: modelId });
      }

      // Create streaming response
      const result = streamText({
        model: provider(modelId),
        messages,
        temperature: data.temperature,
      });

      logger.debug("AI stream setup successful");

      // Return the streaming response
      return result.toTextStreamResponse();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(
        error,
      );
      logger.error("AI stream processing failed", { error: errorMessage });

      // Return error as streaming response
      return new Response(
        JSON.stringify({
          error:
            "app.api.v1.core.agent.chat.aiStream.streamingErrors.aiStream.error.processing",
          success: false,
          message: error instanceof Error ? error.message : String(error),
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
  }
}

/**
 * Repository instance
 */
export const aiStreamRepository = new AiStreamRepositoryImpl();
