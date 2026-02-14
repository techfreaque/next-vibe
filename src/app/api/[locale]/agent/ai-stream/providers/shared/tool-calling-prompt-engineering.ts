/**
 * Shared utility functions for tool calling via prompt engineering
 * Used by providers that don't support native tool calling (Venice.ai, Uncensored.ai, etc.)
 */

import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import {
  MEMORY_DELETE_ALIAS,
  MEMORY_UPDATE_ALIAS,
} from "../../../chat/memories/[id]/definition";
import MEMORY_ADD_DEFINITION, {
  MEMORY_ADD_ALIAS,
} from "../../../chat/memories/create/definition";
import FETCH_URL_DEFINITION, {
  FETCH_URL_ALIAS,
} from "../../../fetch-url-content/definition";
import SEARCH_DEFINITION, {
  SEARCH_ALIAS,
} from "../../../search/brave/definition";

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
  const toolDescriptions = tools
    .map((tool) => {
      const func = tool.function;
      return `- ${func.name}: ${func.description || "No description"}
  Parameters: ${JSON.stringify(func.parameters || {}, null, 2)}`;
    })
    .join("\n\n");

  // Use actual examples from endpoint definitions
  const searchExample = SEARCH_DEFINITION.GET.examples.requests.default;
  const memoryExample = MEMORY_ADD_DEFINITION.POST.examples.requests.add;
  const fetchExample = FETCH_URL_DEFINITION.GET.examples.requests.default;

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
   - Example: "I'll search for that information.\\n<tool_calls>[{...}]</tool_calls>"

4. IMPORTANT: The <tool_calls> block must contain valid JSON array. Do not add any text inside the tags except the JSON.

5. After tools are executed, you'll receive their results. Use them to provide your final answer IF NEEDED.

6. If you don't need to call any tools, just respond normally without the <tool_calls> block.

7. CRITICAL: When you don't need a follow-up response after a tool executes, add "noLoop": true to the arguments.
   - Use this for tools like ${MEMORY_ADD_ALIAS}, ${MEMORY_UPDATE_ALIAS}, ${MEMORY_DELETE_ALIAS}
   - Example: {"name": "${MEMORY_ADD_ALIAS}", "arguments": {"content": "...", "noLoop": true}}

Examples:
- Single tool: <tool_calls>[{"name": "${SEARCH_ALIAS}", "arguments": ${JSON.stringify(searchExample)}}]</tool_calls>
- Multiple tools: <tool_calls>[{"name": "${SEARCH_ALIAS}", "arguments": ${JSON.stringify(searchExample)}}, {"name": "${FETCH_URL_ALIAS}", "arguments": ${JSON.stringify(fetchExample)}}]</tool_calls>
- With text: Let me search for that.\\n<tool_calls>[{"name": "${SEARCH_ALIAS}", "arguments": ${JSON.stringify(searchExample)}}]</tool_calls>
- With noLoop: I'll remember that.\\n<tool_calls>[{"name": "${MEMORY_ADD_ALIAS}", "arguments": ${JSON.stringify({ ...memoryExample, noLoop: true })}}]</tool_calls>`;
}

/**
 * Parse tool calls from model response
 * Returns { textContent, toolCalls }
 * Note: noLoop is handled via tool arguments, not a separate flag
 */
export function parseToolCalls(
  content: string,
  logger: EndpointLogger,
): {
  textContent: string;
  toolCalls: ParsedToolCall[] | null;
} {
  // Match <tool_calls>[...]</tool_calls>
  const toolCallsRegex = /<tool_calls>\s*(\[[\s\S]*?\])\s*<\/tool_calls>/;
  const match = content.match(toolCallsRegex);

  if (!match) {
    return { textContent: content, toolCalls: null };
  }

  // Extract text before tool calls
  const textContent = content.substring(0, match.index).trim();

  // Parse JSON array of tool calls
  try {
    // Clean up the JSON string - remove trailing commas and fix formatting
    let jsonStr = match[1].trim();

    // Remove trailing commas before closing brackets/braces
    jsonStr = jsonStr.replace(/,(\s*[}\]])/g, "$1");

    // Try to parse
    const parsed = JSON.parse(jsonStr) as ParsedToolCall[];
    if (!Array.isArray(parsed)) {
      logger.error("Tool calls parsed but not an array", {
        rawMatch: match[1],
      });
      return { textContent: content, toolCalls: null };
    }
    return { textContent, toolCalls: parsed };
  } catch (error) {
    // Log the exact position of the error
    const errorMsg = parseError(error);
    const errorPosMatch = errorMsg.message?.match(/position (\d+)/);
    const errorPos = errorPosMatch ? parseInt(errorPosMatch[1], 10) : -1;

    logger.error("Failed to parse tool calls JSON", errorMsg, {
      rawMatch: match[1],
      rawMatchLength: match[1].length,
      errorPosition: errorPos,
      // Show context around error
      errorContext:
        errorPos >= 0
          ? match[1].substring(Math.max(0, errorPos - 50), errorPos + 50)
          : "N/A",
      charAtError: errorPos >= 0 ? match[1][errorPos] : "N/A",
    });

    // Try one more time with aggressive cleanup
    try {
      let jsonStr = match[1].trim();
      // Remove all newlines and extra whitespace
      jsonStr = jsonStr.replace(/\s+/g, " ");
      // Remove trailing commas
      jsonStr = jsonStr.replace(/,(\s*[}\]])/g, "$1");

      // Fix missing closing braces for tool objects
      // Pattern: }"  }] should be }}]
      // This fixes when AI closes arguments object but forgets to close the tool object
      jsonStr = jsonStr.replace(/}\s*}\s*]/g, "}}]");

      // If we have pattern like }] without double brace, it means missing a brace
      // Count braces to detect imbalance
      const openBraces = (jsonStr.match(/{/g) || []).length;
      const closeBraces = (jsonStr.match(/}/g) || []).length;

      if (openBraces > closeBraces) {
        // Add missing closing braces before the final ]
        const missing = openBraces - closeBraces;
        jsonStr = jsonStr.replace(/]$/, `${"}".repeat(missing)}]`);
      }

      const parsed = JSON.parse(jsonStr) as ParsedToolCall[];
      if (Array.isArray(parsed)) {
        logger.info("Successfully parsed tool calls after cleanup");
        return { textContent, toolCalls: parsed };
      }
    } catch (retryError) {
      logger.error(
        "Failed to parse tool calls even after cleanup",
        parseError(retryError),
      );
    }

    return { textContent: content, toolCalls: null };
  }
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
      // Format: Tool result for call_id: {result}
      const toolCallId = msg.tool_call_id || "unknown";
      const result = msg.content || "Tool execution completed";

      return {
        role: "user",
        content: `Tool result for ${toolCallId}:\n${result}`,
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
