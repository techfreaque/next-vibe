/**
 * Shared factory for creating providers that:
 * 1. Don't support native streaming (return complete JSON responses)
 * 2. Use tool calling via prompt engineering
 * 3. Have fixed credit costs per message
 *
 * Used by: Uncensored.ai, FreedomGPT, Gab AI
 */

import "server-only";

import { OpenAIChatLanguageModel } from "@ai-sdk/openai/internal";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import {
  convertDeveloperToSystemMessages,
  injectToolInstructions,
  type OpenAIMessage,
  type OpenAITool,
  type OpenAIToolCall,
  parseToolCalls,
} from "./tool-calling-prompt-engineering";

/**
 * Configuration for creating a non-streaming tool-calling provider
 */
export interface NonStreamingProviderConfig {
  /** Provider name for logging and identification */
  providerName: string;
  /** API key for authentication */
  apiKey: string;
  /** Base URL for the API */
  apiUrl: string;
  /** Model ID to use in requests */
  modelId: string;
  /** Endpoint logger */
  logger: EndpointLogger;
}

/**
 * OpenAI API Types
 */

type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

interface OpenAIRequestBody {
  model: string;
  messages: OpenAIMessage[];
  tools?: OpenAITool[];
  tool_choice?: string | JSONValue;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

interface OpenAIChoice {
  index: number;
  message?: {
    role?: string;
    content?: string;
    tool_calls?: OpenAIToolCall[];
  };
  finish_reason?: string;
}

interface OpenAIResponse {
  id?: string;
  object?: string;
  created?: number;
  model?: string;
  choices?: OpenAIChoice[];
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}

/**
 * Create a provider that converts non-streaming responses to streaming format
 * and handles tool calling via prompt engineering
 */
export function createNonStreamingToolCallingProvider(
  config: NonStreamingProviderConfig,
): {
  chat: (modelId: string) => OpenAIChatLanguageModel;
} {
  const { providerName, apiKey, apiUrl, modelId, logger } = config;

  const customFetch = async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    if (!init?.body) {
      logger.error(`[${providerName}] No request body provided`);
      return new Response(
        JSON.stringify({ error: "No request body provided" }),
        {
          status: 400,
        },
      );
    }

    const parsedBody = JSON.parse(init.body as string) as OpenAIRequestBody;
    const { tools, messages, ...restBody } = parsedBody;

    logger.info(`[${providerName}] Request`, {
      messageCount: messages.length,
      hasTools: !!tools,
      toolCount: tools?.length || 0,
    });

    // Convert developer messages to system and inject tool instructions
    let modifiedMessages = convertDeveloperToSystemMessages(messages);
    if (tools && tools.length > 0) {
      modifiedMessages = injectToolInstructions(modifiedMessages, tools);
    }

    // Update request body - remove tools field since model doesn't support it natively
    const modifiedInit: RequestInit = {
      ...init,
      body: JSON.stringify({
        ...restBody,
        messages: modifiedMessages,
        // Remove tools from request
      }),
    };

    // Make the actual request
    const response = await fetch(input, modifiedInit);

    if (!response.ok) {
      const errorText = await response.text();
      logger.error(`[${providerName}] API Error`, {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      // Return error responses as-is for OpenAI's error handling
      return new Response(errorText, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    }

    // Get the complete JSON response
    const jsonResponse = (await response.json()) as OpenAIResponse;

    logger.info(`[${providerName}] Response received`, {
      hasChoices: !!jsonResponse.choices,
      choicesCount: jsonResponse.choices?.length || 0,
    });

    // Check if this is a streaming request
    const isStreamRequest = parsedBody.stream === true;

    if (!isStreamRequest) {
      // Non-streaming request - return the JSON as-is
      return new Response(JSON.stringify(jsonResponse), {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    }

    // Convert JSON response to SSE streaming format
    return createStreamingResponse(jsonResponse, logger, providerName, modelId);
  };

  return {
    chat: () => {
      return new OpenAIChatLanguageModel(modelId, {
        provider: providerName,
        headers: () => ({
          "Content-Type": "application/json",
          // eslint-disable-next-line i18next/no-literal-string
          Authorization: `Bearer ${apiKey}`,
        }),
        url: () => apiUrl,
        fetch: customFetch as typeof fetch,
      });
    },
  };
}

/**
 * Convert a complete JSON response to Server-Sent Events (SSE) streaming format
 * This emulates streaming for APIs that only return complete responses
 */
function createStreamingResponse(
  jsonResponse: OpenAIResponse,
  logger: EndpointLogger,
  providerName: string,
  modelId: string,
): Response {
  const encoder = new TextEncoder();

  // Extract response data
  const choice = jsonResponse.choices?.[0];
  const content = choice?.message?.content || "";
  const finish_reason = choice?.finish_reason || "stop";

  logger.info(`[${providerName}] Creating streaming response`, {
    contentLength: content.length,
    finishReason: finish_reason,
  });

  // Parse tool calls from content
  const { textContent, toolCalls } = parseToolCalls(content, logger);

  logger.info(`[${providerName}] Parsed content`, {
    hasTextContent: !!textContent,
    hasToolCalls: !!toolCalls,
    toolCallCount: toolCalls?.length || 0,
  });

  const stream = new ReadableStream({
    start(controller): void {
      try {
        // 1. Send role chunk
        const roleChunk: OpenAIResponse = {
          id: jsonResponse.id || `${providerName}-${Date.now()}`,
          object: "chat.completion.chunk",
          created: jsonResponse.created || Math.floor(Date.now() / 1000),
          model: jsonResponse.model || modelId,
          choices: [
            {
              index: 0,
              message: { role: "assistant" },
              finish_reason: undefined,
            },
          ],
        };
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(roleChunk)}\n\n`),
        );

        // 2. Send text content if present (stripped of tool calls)
        if (textContent) {
          const contentChunk: OpenAIResponse = {
            id: roleChunk.id,
            object: "chat.completion.chunk",
            created: roleChunk.created,
            model: roleChunk.model,
            choices: [
              {
                index: 0,
                message: { content: textContent },
                finish_reason: undefined,
              },
            ],
          };
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(contentChunk)}\n\n`),
          );
        }

        // 3. Send tool calls if present
        if (toolCalls && toolCalls.length > 0) {
          toolCalls.forEach((tc, idx) => {
            const toolCallChunk: OpenAIResponse = {
              id: roleChunk.id,
              object: "chat.completion.chunk",
              created: roleChunk.created,
              model: roleChunk.model,
              choices: [
                {
                  index: 0,
                  message: {
                    tool_calls: [
                      {
                        index: idx,
                        id: `call_${roleChunk.id}_${idx}`,
                        type: "function",
                        function: {
                          name: tc.name,
                          arguments: JSON.stringify(tc.arguments),
                        },
                      },
                    ],
                  },
                  finish_reason: undefined,
                },
              ],
            };
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(toolCallChunk)}\n\n`),
            );
          });
        }

        // 4. Send finish chunk (no usage data for fixed-cost models)
        const finishChunk: OpenAIResponse = {
          id: roleChunk.id,
          object: "chat.completion.chunk",
          created: roleChunk.created,
          model: roleChunk.model,
          choices: [
            {
              index: 0,
              message: {},
              finish_reason,
            },
          ],
          // Fixed-cost models don't return token usage
          usage: undefined,
        };
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(finishChunk)}\n\n`),
        );

        // 5. Send [DONE]
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));

        logger.info(`[${providerName}] Streaming response completed`);
      } catch (error) {
        logger.error(
          `[${providerName}] Error creating streaming response`,
          parseError(error),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
