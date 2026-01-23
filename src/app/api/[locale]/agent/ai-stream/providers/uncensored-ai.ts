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
import { parseError } from "next-vibe/shared/utils/parse-error";

import { agentEnv } from "@/app/api/[locale]/agent/env";

import type { EndpointLogger } from "../../../system/unified-interface/shared/logger/endpoint";

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

    // Convert JSON response to SSE streaming format
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

interface OpenAIMessage {
  role: string;
  content: string | null;
  tool_calls?: OpenAIToolCall[];
}

interface OpenAIToolCall {
  id: string;
  type: string;
  function: {
    name: string;
    arguments: string;
  };
}

interface OpenAITool {
  type: string;
  function: {
    name: string;
    description?: string;
    parameters?: Record<string, JSONValue>;
  };
}

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

interface ParsedToolCall {
  name: string;
  arguments: Record<string, JSONValue>;
}

/**
 * Generate system prompt for tool calling instructions
 */
function generateToolSystemPrompt(tools: OpenAITool[]): string {
  const toolDescriptions = tools
    .map((tool) => {
      const func = tool.function;
      return `- ${func.name}: ${func.description || "No description"}
  Parameters: ${JSON.stringify(func.parameters || {}, null, 2)}`;
    })
    .join("\n\n");

  return `You have access to the following tools:

${toolDescriptions}

CRITICAL INSTRUCTIONS FOR TOOL USAGE:
1. To call tools, you MUST use this EXACT format:
   <tool_calls>
   [
     {"name": "tool_name", "arguments": {"param": "value"}}
   ]
   </tool_calls>

2. You can call MULTIPLE tools in a single response by including multiple objects in the array.

3. You can combine tool calls with a text response:
   - Put your explanation/thinking BEFORE the <tool_calls> block
   - Example: "I'll search for that information.\n<tool_calls>[{...}]</tool_calls>"

4. IMPORTANT: The <tool_calls> block must contain valid JSON array. Do not add any text inside the tags except the JSON.

5. After tools are executed, you'll receive their results. Use them to provide your final answer IF NEEDED.

6. If you don't need to call any tools, just respond normally without the <tool_calls> block.

7. IMPORTANT: For tools that don't require a follow-up response (like store_memory, update_settings, etc.):
   - You can include a brief confirmation in your text BEFORE the tool call
   - Example: "I'll remember that for you.\n<tool_calls>[{"name": "store_memory", ...}]</tool_calls>"
   - After the tool executes, you DON'T need to respond again unless the user asks something else
   - To signal no further response needed, add "DONE" after your text
   - Example: "Got it, I've saved that.\nDONE\n<tool_calls>[{"name": "store_memory", ...}]</tool_calls>"

8. For tools that DO require results (like search, calculator):
   - Call the tool without DONE
   - Wait for results
   - Provide your answer based on the results

Examples:
- Single tool: <tool_calls>[{"name": "search", "arguments": {"query": "weather in NYC"}}]</tool_calls>
- Multiple tools: <tool_calls>[{"name": "search", "arguments": {"query": "Paris"}}, {"name": "calculator", "arguments": {"expr": "2+2"}}]</tool_calls>
- With text: Let me search for that.\n<tool_calls>[{"name": "search", "arguments": {"query": "AI"}}]</tool_calls>
- Memory (no follow-up): I'll remember that.\nDONE\n<tool_calls>[{"name": "store_memory", "arguments": {"content": "..."}}]</tool_calls>`;
}

/**
 * Parse tool calls from model response
 * Returns { textContent, toolCalls, isDone }
 */
function parseToolCalls(
  content: string,
  logger: EndpointLogger,
): {
  textContent: string;
  toolCalls: ParsedToolCall[] | null;
  isDone: boolean;
} {
  // Match <tool_calls>[...]</tool_calls>
  const toolCallsRegex = /<tool_calls>\s*(\[[\s\S]*?\])\s*<\/tool_calls>/;
  const match = content.match(toolCallsRegex);

  if (!match) {
    return { textContent: content, toolCalls: null, isDone: false };
  }

  // Extract text before tool calls
  let textContent = content.substring(0, match.index).trim();

  // Check for DONE marker (indicates no follow-up response needed)
  const isDone = /\bDONE\b/.test(textContent);
  if (isDone) {
    // Remove DONE marker from text content
    textContent = textContent.replace(/\s*DONE\s*/g, "").trim();
  }

  // Parse JSON array of tool calls
  try {
    const parsed = JSON.parse(match[1]) as ParsedToolCall[];
    if (!Array.isArray(parsed)) {
      logger.error("Tool calls parsed but not an array", {
        rawMatch: match[1],
      });
      return { textContent: content, toolCalls: null, isDone: false };
    }
    return { textContent, toolCalls: parsed, isDone };
  } catch (error) {
    logger.error("Failed to parse tool calls JSON", parseError(error), {
      rawMatch: match[1],
    });
    return { textContent: content, toolCalls: null, isDone: false };
  }
}

/**
 * Convert "developer" role messages to "system" role for API compatibility
 */
function convertDeveloperToSystemMessages(
  messages: OpenAIMessage[],
): OpenAIMessage[] {
  return messages.map((msg) => {
    if (msg.role === "developer") {
      return { ...msg, role: "system" };
    }
    return msg;
  });
}

/**
 * Inject tool calling instructions into the first system message
 */
function injectToolInstructions(
  messages: OpenAIMessage[],
  tools: OpenAITool[],
): OpenAIMessage[] {
  const toolSystemPrompt = generateToolSystemPrompt(tools);
  const firstSystemIdx = messages.findIndex((msg) => msg.role === "system");

  if (firstSystemIdx !== -1) {
    // Append to existing system message
    const existingContent = messages[firstSystemIdx].content;
    const contentStr =
      typeof existingContent === "string" ? existingContent : "";
    const updatedMessages = [...messages];
    updatedMessages[firstSystemIdx] = {
      ...messages[firstSystemIdx],
      content: `${contentStr}\n\n${toolSystemPrompt}`,
    };
    return updatedMessages;
  }

  // No system message found, add one at the beginning
  return [
    {
      role: "system",
      content: toolSystemPrompt,
    },
    ...messages,
  ];
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
        const { textContent, toolCalls, isDone } = parseToolCalls(
          content,
          logger,
        );

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

          finalFinishReason = isDone ? "stop" : "tool_calls";
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
