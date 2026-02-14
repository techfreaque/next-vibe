/**
 * Venice.ai Provider
 * Extends OpenAI's implementation with custom fetch to handle tool calling via prompt engineering
 * The API doesn't support native tool calling for uncensored models, so we emulate it
 *
 * Tool Calling: Since these models don't support native tool calling, we use prompt engineering
 * to instruct the model to output tool calls in a specific JSON format that we then parse.
 */

import "server-only";

import { OpenAIChatLanguageModel } from "@ai-sdk/openai/internal";

import { agentEnv } from "@/app/api/[locale]/agent/env";
import { ApiProvider } from "@/app/api/[locale]/agent/models/models";

import type { EndpointLogger } from "../../../system/unified-interface/shared/logger/endpoint";
import { processStreamingResponseWithToolCalls } from "./shared/streaming-tool-call-processor";
import {
  convertDeveloperToSystemMessages,
  convertToolMessagesToUserMessages,
  injectToolInstructions,
  type OpenAIMessage,
  type OpenAITool,
  type OpenAIToolCall,
} from "./shared/tool-calling-prompt-engineering";

/**
 * Create a Venice.ai provider compatible with AI SDK V2
 * Uses OpenAI's internal implementation with custom fetch override
 * This keeps all message conversion and tool handling from OpenAI while adapting the response format
 *
 * @param logger - Endpoint logger for debugging
 * @returns Provider object with chat() method
 */
export function createVeniceAI(logger: EndpointLogger): {
  chat: (modelId: string) => OpenAIChatLanguageModel;
} {
  const apiKey = agentEnv.VENICE_AI_API_KEY;

  const customFetch = async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    if (!init?.body) {
      logger.error("No request body provided to Venice.ai fetch override");
      return new Response(
        JSON.stringify({ error: "No request body provided" }),
        {
          status: 400,
        },
      );
    }

    const parsedBody = JSON.parse(init.body as string) as OpenAIRequestBody;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { tools, tool_choice, messages, ...restBody } = parsedBody;

    // Convert developer messages to system and inject tool instructions
    let modifiedMessages = convertDeveloperToSystemMessages(messages);
    // Convert tool messages to user messages (Venice.ai only supports user, system, assistant)
    modifiedMessages = convertToolMessagesToUserMessages(modifiedMessages);
    if (tools && tools.length > 0) {
      modifiedMessages = injectToolInstructions(modifiedMessages, tools);
    }

    // Prepare request body
    const requestBody = {
      ...restBody,
      messages: modifiedMessages,
      // Remove tools and tool_choice from request since models don't support native tool calling
      // Request usage data in streaming responses
      stream_options: parsedBody.stream ? { include_usage: true } : undefined,
      // Disable Venice.ai system prompts and web search - use our own tools
      venice_parameters: {
        include_venice_system_prompt: false,
        enable_web_search: "off",
      },
    };

    const bodyString = JSON.stringify(requestBody);

    // Update request body
    const modifiedInit: RequestInit = {
      ...init,
      body: bodyString,
    };

    // Make the actual request to Venice.ai API
    const response = await fetch(input, modifiedInit);

    if (!response.ok) {
      const errorBody = await response.text();
      logger.error("[Venice.ai] API Error", {
        status: response.status,
        statusText: response.statusText,
        body: errorBody,
      });
      // Return error responses as-is for OpenAI's error handling
      return new Response(errorBody, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    }

    // Check if this is a streaming request
    const isStreamRequest = parsedBody.stream === true;

    if (!isStreamRequest) {
      // Non-streaming request - get JSON and process it
      const jsonResponse = (await response.json()) as OpenAIResponse;

      return new Response(JSON.stringify(jsonResponse), {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    }

    // Streaming request - process the SSE stream with tool call detection
    return processStreamingResponseWithToolCalls(
      response,
      logger,
      "Venice.ai",
      true, // Wait for usage data (token-based model)
    );
  };

  return {
    chat: (modelId: string) => {
      return new OpenAIChatLanguageModel(modelId, {
        provider: ApiProvider.VENICE_AI,
        headers: () => ({
          "Content-Type": "application/json",
          // eslint-disable-next-line i18next/no-literal-string
          Authorization: `Bearer ${apiKey}`,
        }),
        url: ({ path }) => `https://api.venice.ai/api/v1${path}`,
        fetch: customFetch as typeof fetch,
      });
    },
  };
}

/**
 * Venice.ai specific types
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
  delta?: {
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
