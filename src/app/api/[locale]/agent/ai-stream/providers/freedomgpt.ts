/**
 * FreedomGPT Provider
 * Extends OpenAI's implementation with custom fetch to handle tool calling via prompt engineering
 * Similar to Venice.ai - supports streaming but uses prompt engineering for tool calls
 */

import "server-only";

import { OpenAIChatLanguageModel } from "@ai-sdk/openai/internal";

import { agentEnv } from "@/app/api/[locale]/agent/env";

import type { EndpointLogger } from "../../../system/unified-interface/shared/logger/endpoint";
import { processStreamingResponseWithToolCalls } from "./shared/streaming-tool-call-processor";
import {
  convertDeveloperToSystemMessages,
  convertToolMessagesToUserMessages,
  injectToolInstructions,
  type OpenAIMessage,
  type OpenAITool,
} from "./shared/tool-calling-prompt-engineering";

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

/**
 * Create a FreedomGPT provider with tool calling support via prompt engineering
 */
export function createFreedomGPT(logger: EndpointLogger): {
  chat: (modelId: string) => OpenAIChatLanguageModel;
} {
  const apiKey = agentEnv.FREEDOMGPT_API_KEY;

  const customFetch = async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    if (!init?.body) {
      logger.error("[FreedomGPT] No request body provided");
      return new Response(
        JSON.stringify({ error: "No request body provided" }),
        { status: 400 },
      );
    }

    const parsedBody = JSON.parse(init.body as string) as OpenAIRequestBody;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { tools, tool_choice, messages, ...restBody } = parsedBody;

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
    };

    const bodyString = JSON.stringify(requestBody);

    // Update request body
    const modifiedInit: RequestInit = {
      ...init,
      body: bodyString,
    };

    // Make the actual request
    const response = await fetch(input, modifiedInit);

    if (!response.ok) {
      const errorText = await response.text();
      logger.error("[FreedomGPT] API Error", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      return new Response(errorText, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    }

    // Check if this is a streaming request
    const isStreamRequest = parsedBody.stream === true;

    if (!isStreamRequest) {
      // Non-streaming request
      const jsonResponse = await response.json();
      return new Response(JSON.stringify(jsonResponse), {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    }

    // Streaming request - process with tool call detection
    return processStreamingResponseWithToolCalls(
      response,
      logger,
      "FreedomGPT",
      false, // Don't wait for usage (fixed-cost model)
    );
  };

  return {
    chat: (modelId: string) => {
      return new OpenAIChatLanguageModel(modelId, {
        provider: "freedomgpt",
        headers: () => ({
          "Content-Type": "application/json",
          // eslint-disable-next-line i18next/no-literal-string
          Authorization: `Bearer ${apiKey}`,
        }),
        url: ({ path }) => `https://chat.freedomgpt.com/api/v1${path}`,
        fetch: customFetch as typeof fetch,
      });
    },
  };
}
