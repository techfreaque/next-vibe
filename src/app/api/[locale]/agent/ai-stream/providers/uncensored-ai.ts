/**
 * Uncensored AI Provider
 * Extends OpenAI's implementation with custom fetch to handle tool calling
 *
 * Two modes controlled by USE_NATIVE_TOOLS:
 * - true:  Pass tools array natively to the API (if they now support it)
 * - false: Prompt engineering approach - inject tool instructions into system message,
 *          parse <tool_calls> markup from responses
 */

import "server-only";

import { OpenAIChatLanguageModel } from "@ai-sdk/openai/internal";

import { agentEnv } from "@/app/api/[locale]/agent/env";

import type { EndpointLogger } from "../../../system/unified-interface/shared/logger/endpoint";
import { logProviderRequest } from "./shared/debug-file-logger";
import { processStreamingResponseWithToolCalls } from "./shared/streaming-tool-call-processor";
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
 * Toggle: try native tool calling vs prompt engineering
 * Set to true to test if Uncensored AI now supports OpenAI-compatible tools array
 */
// eslint-disable-next-line i18next/no-literal-string
const USE_NATIVE_TOOLS = false;

/**
 * Create an Uncensored AI provider compatible with AI SDK V2
 * Uses OpenAI's internal implementation with custom fetch override
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

    let bodyString: string;

    if (USE_NATIVE_TOOLS) {
      // Native mode: pass tools directly, only convert developer→system messages
      const { messages, ...restBody } = parsedBody;
      let modifiedMessages = convertDeveloperToSystemMessages(messages);
      modifiedMessages = flattenArrayContent(modifiedMessages);

      bodyString = JSON.stringify(
        {
          ...restBody,
          messages: modifiedMessages,
          stream_options: parsedBody.stream
            ? { include_usage: true }
            : undefined,
        },
        null,
        2,
      );
    } else {
      // Prompt engineering mode: strip tools, inject instructions into system prompt
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { tools, tool_choice, messages, ...restBody } = parsedBody;

      let modifiedMessages = convertDeveloperToSystemMessages(messages);
      modifiedMessages = convertToolMessagesToUserMessages(modifiedMessages);
      if (tools && tools.length > 0) {
        modifiedMessages = injectToolInstructions(modifiedMessages, tools);
      }
      modifiedMessages = flattenArrayContent(modifiedMessages);

      bodyString = JSON.stringify(
        {
          ...restBody,
          messages: modifiedMessages,
          stream_options: parsedBody.stream
            ? { include_usage: true }
            : undefined,
        },
        null,
        2,
      );
    }

    // Debug: log the full request payload
    // eslint-disable-next-line i18next/no-literal-string
    logProviderRequest(
      `uncensored-ai-${USE_NATIVE_TOOLS ? "native" : "prompt"}`,
      bodyString,
    );

    // Update request body
    const modifiedInit: RequestInit = {
      ...init,
      body: bodyString,
    };

    // Make the actual request to uncensored AI API
    const response = await fetch(input, modifiedInit);

    if (!response.ok) {
      return response;
    }

    const isStreamRequest = parsedBody.stream === true;
    const contentType = response.headers.get("content-type") ?? "";

    if (USE_NATIVE_TOOLS) {
      // Native mode: pass response through as-is (API handles tool calls natively)
      return response;
    }

    // Prompt engineering mode: process responses for <tool_calls> markup
    if (isStreamRequest && contentType.includes("text/event-stream")) {
      logger.debug(
        "Uncensored AI: API returned native SSE stream, processing with tool call detection",
      );
      return processStreamingResponseWithToolCalls(
        response,
        logger,
        "UncensoredAI",
        false,
      );
    }

    // Get the complete JSON response (legacy non-streaming API behavior)
    const jsonResponse = (await response.json()) as OpenAIResponse;

    if (!isStreamRequest) {
      return new Response(JSON.stringify(jsonResponse), {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    }

    // For streaming request with JSON response, convert to SSE format
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

type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

/**
 * Flatten array message content to a plain string.
 * Uncensored AI API only accepts string content - passing an array causes
 * "query.trim is not a function" errors server-side.
 * After gap-fill, image parts become text descriptions - but the content is still
 * an array of text parts. We concatenate them into a single string here.
 */
function flattenArrayContent(messages: OpenAIMessage[]): OpenAIMessage[] {
  return messages.map((msg) => {
    if (!Array.isArray(msg.content)) {
      return msg;
    }
    const text = (msg.content as Array<{ type: string; text?: string }>)
      .map((p) => (p.type === "text" && p.text ? p.text : ""))
      .filter(Boolean)
      .join("\n");
    return { ...msg, content: text || null };
  });
}

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
}

/**
 * Convert JSON response to Server-Sent Events (SSE) streaming format
 * Used only in prompt engineering mode for non-streaming API responses
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
