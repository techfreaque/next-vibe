/**
 * Uncensored AI Provider
 * Extends OpenAI's implementation with custom fetch to handle non-streaming responses
 * The API returns complete JSON responses but we emulate streaming for compatibility
 *
 * Tool Calling: Since this model doesn't support native tool calling, we use prompt engineering
 * to instruct the model to output tool calls in a specific JSON format that we then parse.
 */

import "server-only";

import { OpenAIChatLanguageModel } from "@ai-sdk/openai/internal";

import { agentEnv } from "@/app/api/[locale]/agent/env";

import type { EndpointLogger } from "../../../system/unified-interface/shared/logger/endpoint";
import {
  convertDeveloperToSystemMessages,
  convertToolMessagesToUserMessages,
  injectToolInstructions,
  type OpenAIMessage,
  type OpenAITool,
  type OpenAIToolCall,
  parseToolCalls,
} from "./shared/tool-calling-prompt-engineering";

/**
 * Create an Uncensored AI provider compatible with AI SDK V2
 * Uses OpenAI's internal implementation with custom fetch override
 * This keeps all message conversion and tool handling from OpenAI while adapting the response format
 *
 * @returns Provider object with chat() method
 */
export function createUncensoredAI(logger: EndpointLogger): {
  chat: (modelId: string) => OpenAIChatLanguageModel;
} {
  const apiKey = agentEnv.UNCENSORED_AI_API_KEY;
  const provider = "uncensored-ai" as const;

  const customFetch = async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    if (!init?.body) {
      logger.error("No request body provided to Uncensored AI fetch override");
      return new Response(
        JSON.stringify({ error: "No request body provided" }),
        {
          status: 400,
        },
      );
    }

    const parsedBody = JSON.parse(init.body as string) as OpenAIRequestBody;
    const { tools, messages, ...restBody } = parsedBody;

    // Convert developer messages to system and inject tool instructions
    let modifiedMessages = convertDeveloperToSystemMessages(messages);
    modifiedMessages = convertToolMessagesToUserMessages(modifiedMessages);
    if (tools && tools.length > 0) {
      modifiedMessages = injectToolInstructions(modifiedMessages, tools);
    }

    // Prepare request body
    const requestBody = {
      ...restBody,
      messages: modifiedMessages,
      // Remove tools from request
    };

    const bodyString = JSON.stringify(requestBody);

    // Update request body
    const modifiedInit: RequestInit = {
      ...init,
      body: bodyString,
    };

    // Make the actual request to uncensored AI API
    const response = await fetch(input, modifiedInit);

    if (!response.ok) {
      // Return error responses as-is for OpenAI's error handling
      return response;
    }

    // Get the complete JSON response
    const jsonResponse = (await response.json()) as OpenAIResponse;

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

    // For non-streaming, convert JSON response to SSE streaming format
    return createStreamingResponse(jsonResponse, logger);
  };

  return {
    chat: () => {
      return new OpenAIChatLanguageModel("uncensored-lm", {
        provider: provider,
        headers: () => ({
          "Content-Type": "application/json",
          // eslint-disable-next-line i18next/no-literal-string
          Authorization: `Bearer ${apiKey}`,
        }),
        url: () =>
          "https://mkstqjtsujvcaobdksxs.functions.supabase.co/functions/v1/uncensoredlm-api",
        fetch: customFetch as typeof fetch,
      });
    },
  };
}

/**
 * OpenAI API Types
 */

interface OpenAIRequestBody {
  model: string;
  messages: OpenAIMessage[];
  tools?: OpenAITool[];
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
}

/**
 * Convert JSON response to Server-Sent Events (SSE) streaming format
 */
function createStreamingResponse(
  jsonResponse: OpenAIResponse,
  logger: EndpointLogger,
): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller): void {
      const baseId = jsonResponse.id || `chatcmpl-${Date.now()}`;
      const created = jsonResponse.created || Math.floor(Date.now() / 1000);
      const model = jsonResponse.model || "uncensored-lm";

      let finalFinishReason = "stop";

      for (const choice of jsonResponse.choices || []) {
        const content = choice.message?.content || "";
        const { textContent, toolCalls } = parseToolCalls(content, logger);

        // Send role chunk
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              id: baseId,
              object: "chat.completion.chunk",
              created,
              model,
              choices: [
                {
                  index: choice.index || 0,
                  delta: { role: "assistant" },
                  finish_reason: null,
                },
              ],
            })}\n\n`,
          ),
        );

        // Send text content if present
        if (textContent) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                id: baseId,
                object: "chat.completion.chunk",
                created,
                model,
                choices: [
                  {
                    index: choice.index || 0,
                    delta: { content: textContent },
                    finish_reason: null,
                  },
                ],
              })}\n\n`,
            ),
          );
        }

        // Send tool calls if present
        if (toolCalls && toolCalls.length > 0) {
          const formattedToolCalls = toolCalls.map((tc, idx) => ({
            index: idx,
            id: `call_${Date.now()}_${idx}`,
            type: "function",
            function: {
              name: tc.name,
              arguments: JSON.stringify(tc.arguments),
            },
          }));

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                id: baseId,
                object: "chat.completion.chunk",
                created,
                model,
                choices: [
                  {
                    index: choice.index || 0,
                    delta: { tool_calls: formattedToolCalls },
                    finish_reason: null,
                  },
                ],
              })}\n\n`,
            ),
          );

          finalFinishReason = "tool_calls";
        }
      }

      // Send finish chunk
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({
            id: baseId,
            object: "chat.completion.chunk",
            created,
            model,
            choices:
              jsonResponse.choices?.map((choice) => ({
                index: choice.index || 0,
                delta: {},
                finish_reason: finalFinishReason,
              })) || [],
          })}\n\n`,
        ),
      );
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
    },
  });
}

/**
 * Check if a model ID is an Uncensored.ai model
 */
export function isUncensoredAIModel(modelId: string): boolean {
  // eslint-disable-next-line i18next/no-literal-string
  return modelId === "uncensored-lm" || modelId.startsWith("uncensored-");
}
