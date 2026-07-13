/**
 * Shared factory for OpenAI-compatible providers that emulate tool calling via
 * prompt engineering (FreedomGPT, Gab AI, Venice.ai). Each such provider wraps
 * OpenAI's internal chat model with a custom fetch that:
 *   1. converts developer→system and tool→user messages,
 *   2. injects tool instructions into the prompt (native tool calling unsupported),
 *   3. strips tools/tool_choice from the outgoing body,
 *   4. routes streaming responses through the shared tool-call processor.
 *
 * Providers differ only in name/url/key, log tags, whether to wait for usage
 * data, and an optional request-body transform (Venice adds venice_parameters).
 */

import "server-only";

import { OpenAIChatLanguageModel } from "@ai-sdk/openai/internal";

import type { EndpointLogger } from "../../../../logger/types";
import { logProviderRequest } from "./debug-file-logger";
import { processStreamingResponseWithToolCalls } from "./streaming-tool-call-processor";
import {
  convertDeveloperToSystemMessages,
  convertToolMessagesToUserMessages,
  injectToolInstructions,
  type OpenAIMessage,
  type OpenAITool,
} from "./tool-calling-prompt-engineering";

export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

export interface OpenAIRequestBody {
  model: string;
  messages: OpenAIMessage[];
  tools?: OpenAITool[];
  tool_choice?: string | JSONValue;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface PromptEngineeredProviderConfig {
  /** Human-readable label used in error/log messages (e.g. "Venice.ai"). */
  label: string;
  /** Provider slug passed to OpenAIChatLanguageModel + the AI SDK. */
  provider: string;
  /** API key for the Authorization header. */
  apiKey: string | undefined;
  /** Tag passed to logProviderRequest (e.g. "venice-ai"). */
  logTag: string;
  /** Builds the request URL from the SDK-provided path. */
  url: (params: { path: string }) => string;
  /** Whether the streaming processor should wait for usage data (token-billed). */
  waitForUsage: boolean;
  /**
   * Optional extra fields merged into the outgoing request body (after the base
   * `{ ...restBody, messages }`). Receives the parsed request for context.
   */
  extraBodyFields?: (
    parsedBody: OpenAIRequestBody,
  ) => Record<string, JSONValue>;
}

/**
 * Create an OpenAI-compatible provider that emulates tool calling via prompt
 * engineering. Returns the `{ chat }` shape the ProviderFactory expects.
 */
export function createPromptEngineeredProvider(
  logger: EndpointLogger,
  // Explicit fetch — the fixture engine binds record/replay per execution
  // chain (createFixtureFetch); plain live fetch otherwise. Never global.
  fetchImpl: typeof globalThis.fetch,
  config: PromptEngineeredProviderConfig,
): { chat: (modelId: string) => OpenAIChatLanguageModel } {
  const customFetch = async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    if (!init?.body) {
      logger.error(`[${config.label}] No request body provided`);
      return new Response(
        JSON.stringify({ error: "No request body provided" }),
        { status: 400 },
      );
    }

    const parsedBody = JSON.parse(init.body as string) as OpenAIRequestBody;
    // Strip tools/tool_choice — these models don't support native tool calling.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { tools, tool_choice, messages, ...restBody } = parsedBody;

    // Convert developer→system, tool→user, then inject tool instructions.
    let modifiedMessages = convertDeveloperToSystemMessages(messages);
    modifiedMessages = convertToolMessagesToUserMessages(modifiedMessages);
    if (tools && tools.length > 0) {
      modifiedMessages = injectToolInstructions(modifiedMessages, tools);
    }

    const requestBody = {
      ...restBody,
      messages: modifiedMessages,
      ...(config.extraBodyFields?.(parsedBody) ?? {}),
    };

    const bodyString = JSON.stringify(requestBody);
    logProviderRequest(config.logTag, bodyString);

    const response = await fetchImpl(input, { ...init, body: bodyString });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error(`[${config.label}] API Error`, {
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

    if (parsedBody.stream !== true) {
      // Non-streaming: pass the JSON body through unchanged.
      const jsonResponse = await response.json();
      return new Response(JSON.stringify(jsonResponse), {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    }

    return processStreamingResponseWithToolCalls(
      response,
      logger,
      config.label,
      config.waitForUsage,
    );
  };

  return {
    chat: (modelId: string): OpenAIChatLanguageModel =>
      new OpenAIChatLanguageModel(modelId, {
        provider: config.provider,
        headers: (): Record<string, string> => ({
          "Content-Type": "application/json",
          // eslint-disable-next-line i18next/no-literal-string
          Authorization: `Bearer ${config.apiKey}`,
        }),
        url: config.url,
        fetch: customFetch as typeof fetch,
      }),
  };
}
