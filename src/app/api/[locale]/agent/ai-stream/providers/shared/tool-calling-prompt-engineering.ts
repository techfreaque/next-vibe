/**
 * Shared utility functions for tool calling via prompt engineering
 * Used by providers that don't support native tool calling (Venice.ai, Uncensored.ai, etc.)
 */

import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import {
  CORTEX_DELETE_ALIAS,
  CORTEX_EDIT_ALIAS,
  CORTEX_WRITE_ALIAS,
} from "../../../cortex/constants";
import { FETCH_URL_ALIAS } from "../../../fetch-url-content/constants";
import FETCH_URL_DEFINITION from "../../../fetch-url-content/definition";
import { WEB_SEARCH_ALIAS } from "../../../search/web-search/constants";
import SEARCH_DEFINITION from "../../../search/web-search/definition";

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

export interface OpenAIMessage {
  role: string;
  content: string | null;
  tool_calls?: OpenAIToolCall[];
  tool_call_id?: string;
  name?: string;
}

export interface OpenAIToolCall {
  index?: number;
  id: string;
  type: string;
  function: {
    name: string;
    arguments: string;
  };
}

export interface OpenAITool {
  type: string;
  function: {
    name: string;
    description?: string;
    parameters?: Record<string, JSONValue>;
  };
}

export interface ParsedToolCall {
  name: string;
  arguments: Record<string, JSONValue>;
}

/**
 * Generate system prompt for tool calling instructions
 */
export function generateToolSystemPrompt(tools: OpenAITool[]): string {
  const toolNames = tools.map((t) => `"${t.function.name}"`).join(", ");
  const toolDescriptions = tools
    .map((tool) => {
      const func = tool.function;
      return `- ${func.name}: ${func.description || "No description"}
  Parameters: ${JSON.stringify(func.parameters || {}, null, 2)}`;
    })
    .join("\n\n");

  // Use actual examples from endpoint definitions
  const searchExample = SEARCH_DEFINITION.GET.examples.requests.default;
  const fetchExample = FETCH_URL_DEFINITION.GET.examples.requests.default;
  const cortexWriteExample = {
    path: "/memories/note.md",
    content: "User prefers dark mode.",
  };

  return `You have access to the following tools (use EXACT names: ${toolNames}):

${toolDescriptions}

TOOL CALLING FORMAT:
To call tools, output this EXACT format (no extra text inside the tags):
<tool_calls>
[{"name": "tool_name", "arguments": {"param": "value"}}]
</tool_calls>

RULES:
1. The <tool_calls> block must contain a valid JSON array. No text inside the tags.
2. You may call MULTIPLE tools at once by adding more objects to the array.
3. You may write text BEFORE the <tool_calls> block (e.g. "Let me look that up.").
4. If you don't need tools, respond normally without <tool_calls>.

MULTI-STEP WORKFLOW:
- You will receive tool results as follow-up messages. Read them carefully.
- After receiving results, decide: do you have enough information to answer? If yes, write your final answer as plain text (no <tool_calls>). If no, call more tools.
- You may call the same tool again with DIFFERENT arguments (e.g. a refined search query, a different URL). Do NOT repeat the exact same call.
- When your task requires multiple steps (search → read → summarize), work through each step. Call tools as needed, then write your final answer once you have all the information.

STOP LOOP - callbackMode endLoop:
When a tool call needs no follow-up response (e.g. saving a memory), add "callbackMode": "endLoop" to the arguments. The system stops after that tool completes.
- Use for: ${CORTEX_WRITE_ALIAS}, ${CORTEX_EDIT_ALIAS}, ${CORTEX_DELETE_ALIAS}
- Example: {"name": "${CORTEX_WRITE_ALIAS}", "arguments": {"path": "/memories/note.md", "content": "...", "callbackMode": "endLoop"}}

EXAMPLES:
- Search: <tool_calls>[{"name": "${WEB_SEARCH_ALIAS}", "arguments": ${JSON.stringify(searchExample)}}]</tool_calls>
- Multiple: <tool_calls>[{"name": "${WEB_SEARCH_ALIAS}", "arguments": ${JSON.stringify(searchExample)}}, {"name": "${FETCH_URL_ALIAS}", "arguments": ${JSON.stringify(fetchExample)}}]</tool_calls>
- With text: Let me search for that.\n<tool_calls>[{"name": "${WEB_SEARCH_ALIAS}", "arguments": ${JSON.stringify(searchExample)}}]</tool_calls>
- With endLoop: I'll remember that.\n<tool_calls>[{"name": "${CORTEX_WRITE_ALIAS}", "arguments": ${JSON.stringify({ ...cortexWriteExample, callbackMode: "endLoop" })}}]</tool_calls>`;
}

/**
 * Parse tool calls from model response
 * Returns { textContent, toolCalls }
 * Note: callbackMode endLoop is handled via tool arguments, not a separate flag
 */
export function parseToolCalls(
  content: string,
  logger: EndpointLogger,
): {
  textContent: string;
  toolCalls: ParsedToolCall[] | null;
} {
  // Tolerant regex: matches <tool_calls>...</tool_calls>, </tool_call>, or unclosed blocks
  const toolCallsRegex =
    /<tool_calls>\s*(\[[\s\S]*?\])\s*(?:<\/tool_calls?\s*>|$)/g;

  const allToolCalls: ParsedToolCall[] = [];
  let firstMatchIndex = -1;

  let match: RegExpExecArray | null;
  while ((match = toolCallsRegex.exec(content)) !== null) {
    if (firstMatchIndex === -1) {
      firstMatchIndex = match.index ?? 0;
    }

    const parsed = tryParseToolCallsJson(match[1], logger);
    if (parsed) {
      allToolCalls.push(...parsed);
    }
  }

  if (allToolCalls.length === 0) {
    return { textContent: content, toolCalls: null };
  }

  // Extract text before the first <tool_calls> block
  const textContent = content.substring(0, firstMatchIndex).trim();
  return { textContent, toolCalls: allToolCalls };
}

/**
 * Try to parse a JSON array string from a tool_calls block.
 * Applies progressive cleanup on failure.
 */
function tryParseToolCallsJson(
  raw: string,
  logger: EndpointLogger,
): ParsedToolCall[] | null {
  // First attempt: minimal cleanup
  let jsonStr = raw.trim();
  jsonStr = jsonStr.replace(/,(\s*[}\]])/g, "$1");

  try {
    const parsed = JSON.parse(jsonStr) as ParsedToolCall[];
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // Continue to aggressive cleanup
  }

  // Second attempt: aggressive cleanup
  try {
    jsonStr = raw.trim().replace(/\s+/g, " ");
    jsonStr = jsonStr.replace(/,(\s*[}\]])/g, "$1");

    // Fix missing closing braces
    const openBraces = (jsonStr.match(/{/g) || []).length;
    const closeBraces = (jsonStr.match(/}/g) || []).length;
    if (openBraces > closeBraces) {
      const missing = openBraces - closeBraces;
      jsonStr = jsonStr.replace(/]$/, `${"}".repeat(missing)}]`);
    }

    const parsed = JSON.parse(jsonStr) as ParsedToolCall[];
    if (Array.isArray(parsed)) {
      logger.info("Parsed tool calls after cleanup");
      return parsed;
    }
  } catch (error) {
    logger.error("Failed to parse tool calls JSON", parseError(error), {
      rawSnippet: raw.substring(0, 200),
    });
  }

  return null;
}

/**
 * Convert "developer" role messages to "system" role for API compatibility
 */
export function convertDeveloperToSystemMessages(
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
 * Convert "tool" role messages to "user" role for API compatibility
 * Also converts assistant tool_calls from OpenAI format to prompt engineering format
 * Used by APIs that only support user, system, and assistant roles
 */
export function convertToolMessagesToUserMessages(
  messages: OpenAIMessage[],
): OpenAIMessage[] {
  return messages.map((msg) => {
    if (
      msg.role === "assistant" &&
      msg.tool_calls &&
      msg.tool_calls.length > 0
    ) {
      // Convert OpenAI tool_calls format back to our <tool_calls> prompt format
      const toolCallsArray = msg.tool_calls.map((tc) => ({
        id: tc.id,
        name: tc.function.name,
        arguments: JSON.parse(tc.function.arguments),
      }));

      const toolCallsJson = JSON.stringify(toolCallsArray, null, 2);
      const content = msg.content || "";

      return {
        role: "assistant",
        content: `${content}\n<tool_calls>\n${toolCallsJson}\n</tool_calls>`,
      };
    }

    if (msg.role === "tool") {
      const toolCallId = msg.tool_call_id || "unknown";
      const result = msg.content || "Tool execution completed";

      return {
        role: "user",
        content: `[Tool Result for ${toolCallId}]\n${result}`,
      };
    }

    return msg;
  });
}

/**
 * Inject tool calling instructions into the first system message
 */
export function injectToolInstructions(
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
