/**
 * Shared utility functions for tool calling via prompt engineering
 * Used by providers that don't support native tool calling (Venice.ai, Uncensored.ai, etc.)
 */

import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";
import { z } from "zod";

import { CORTEX_WRITE_ALIAS } from "../../../cortex/constants";
import { FETCH_URL_ALIAS } from "../../../fetch-url-content/constants";
import FETCH_URL_DEFINITION from "../../../fetch-url-content/definition";
import { WEB_SEARCH_ALIAS } from "../../../web-search/constants";
import SEARCH_DEFINITION from "../../../web-search/definition";
import type { CacheControl } from "./prompt-cache";

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
  content:
    | string
    | Array<{
        type: string;
        text?: string;
        cache_control?: CacheControl;
        [key: string]: JSONValue | undefined;
      }>
    | null;
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

const adjacentToolCallArrays = z
  .array(
    z.array(
      z.object({
        name: z.string().min(1),
        arguments: z.record(z.string(), z.json()),
      }),
    ),
  )
  .min(2);

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

  const offered = new Set(tools.map((tool) => tool.function.name));
  const examples = [
    {
      name: WEB_SEARCH_ALIAS,
      arguments: SEARCH_DEFINITION.GET.examples.requests.default,
    },
    {
      name: FETCH_URL_ALIAS,
      arguments: FETCH_URL_DEFINITION.GET.examples.requests.default,
    },
    {
      name: CORTEX_WRITE_ALIAS,
      arguments: {
        path: "/memories/note.md",
        content: "User prefers dark mode.",
        callbackMode: "endLoop",
      },
    },
  ]
    .filter((example) => offered.has(example.name))
    .map(
      (example) =>
        `\nExample: <tool_calls>${JSON.stringify([example])}</tool_calls>`,
    )
    .join("");
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
5. Tool results only exist once a "[Tool Result for ...]" message arrives. Before that, never describe results ("according to the results..."): output the <tool_calls> block and stop.

MULTI-STEP WORKFLOW:
- You will receive tool results as follow-up messages. Read them carefully.
- After receiving results, decide: do you have enough information to answer? If yes, write your final answer as plain text (no <tool_calls>). If no, call more tools.
- You may call the same tool again with DIFFERENT arguments (e.g. a refined search query, a different URL). Do NOT repeat the exact same call.
- When your task requires multiple steps (search → read → summarize), work through each step. Call tools as needed, then write your final answer once you have all the information.

Use only the listed tool names and their declared parameters. When the selected tool accepts callbackMode, use "endLoop" for a call that needs no follow-up response.${examples}`;
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
 * Strip ASCII control characters (0x00–0x1F) that are invalid inside JSON strings,
 * except for the three whitespace escapes JSON allows (\t \n \r).
 * Models occasionally emit CAN/NAK/etc. inside tool-call IDs, which breaks JSON.parse.
 */
function stripControlChars(s: string): string {
  // eslint-disable-next-line no-control-regex
  return s.replaceAll(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");
}

/**
 * Try to parse a JSON array string from a tool_calls block.
 * Applies progressive cleanup on failure.
 */
function tryParseToolCallsJson(
  raw: string,
  logger: EndpointLogger,
): ParsedToolCall[] | null {
  // First attempt: minimal cleanup (strip invalid control chars, trailing commas)
  let jsonStr = stripControlChars(raw.trim());
  jsonStr = jsonStr.replaceAll(/,(\s*[}\]])/g, "$1");

  try {
    const parsed = JSON.parse(jsonStr) as ParsedToolCall[];
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // Continue to aggressive cleanup
  }

  // Some models repeat the array wrapper instead of adding calls to the
  // existing array. Join complete arrays without changing argument strings.
  const adjacentArrays = raw
    .trim()
    .replaceAll(/"(?:[^"\\]|\\[\s\S])*"|\]\s*\[/g, (part) =>
      part.startsWith('"') ? part : "],[",
    );
  try {
    const parsed = adjacentToolCallArrays.safeParse(
      JSON.parse(`[${adjacentArrays}]`),
    );
    if (parsed.success) {
      const toolCalls = parsed.data.flat();
      logger.info("Parsed adjacent tool-call arrays", {
        arrayCount: parsed.data.length,
        toolCallCount: toolCalls.length,
      });
      return toolCalls;
    }
  } catch {
    // Continue to aggressive cleanup
  }

  // Second attempt: aggressive cleanup
  try {
    jsonStr = stripControlChars(raw.trim()).replaceAll(/\s+/g, " ");
    jsonStr = jsonStr.replaceAll(/,(\s*[}\]])/g, "$1");

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
  } catch {
    // Continue to truncation attempt
  }

  // Third attempt: truncate trailing garbage after the last closing bracket
  try {
    const truncated = jsonStr.slice(0, jsonStr.lastIndexOf("]") + 1);
    if (truncated) {
      const parsed = JSON.parse(truncated) as ParsedToolCall[];
      if (Array.isArray(parsed)) {
        logger.info("Parsed tool calls after truncation");
        return parsed;
      }
    }
  } catch {
    // Continue to structural repair
  }

  // Fourth attempt: repair unescaped quotes / raw newlines inside strings and
  // close anything a truncated generation left open.
  let repairedLength: number | null = null;
  try {
    const repaired = repairToolCallsJson(stripControlChars(raw.trim()));
    repairedLength = repaired.length;
    const parsed = JSON.parse(repaired) as ParsedToolCall[];
    if (Array.isArray(parsed)) {
      logger.info("Parsed tool calls after structural repair");
      return parsed;
    }
  } catch (error) {
    const parsedError = parseError(error);
    const message = parsedError.message;
    const position = Number(/position (\d+)/.exec(message)?.[1] ?? -1);
    logger.error("Failed to parse tool calls JSON", parsedError, {
      rawLength: raw.length,
      repairedLength,
      parserStage: "structural-repair",
      parserFailureKind: /unterminated string/i.test(message)
        ? "unterminated-string"
        : /unexpected end|end of (data|input)/i.test(message)
          ? "unexpected-end"
          : /expected|unexpected/i.test(message)
            ? "unexpected-token"
            : "other",
      parserErrorOffset: position >= 0 ? position : null,
      startsWithArray: raw.trimStart().startsWith("["),
      endsWithArray: raw.trimEnd().endsWith("]"),
      rawSnippet: raw.slice(0, 200),
      // Where JSON.parse choked - the head alone rarely shows the real cause
      aroundError:
        position >= 0
          ? raw.slice(Math.max(0, position - 80), position + 80)
          : undefined,
      rawTail: raw.slice(-120),
    });
  }

  return null;
}

const VALID_JSON_ESCAPES = '"\\/bfnrtu';

/**
 * Best-effort structural repair of LLM-emitted JSON:
 * - raw newlines/tabs inside strings are escaped
 * - a `"` inside a string that isn't followed by a JSON delimiter is a literal quote
 * - an unterminated string and unclosed `{`/`[` (truncated output) are closed
 * - invalid escapes (`\'`) lose their backslash
 */
function repairToolCallsJson(input: string): string {
  const closers: string[] = [];
  let out = "";
  let inString = false;
  let escaped = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];

    if (inString) {
      if (escaped) {
        // An escape JSON doesn't know (models write `\'`, prod 2026-11-16):
        // drop the backslash, keep the character.
        out = VALID_JSON_ESCAPES.includes(ch)
          ? out + ch
          : out.slice(0, -1) + ch;
        escaped = false;
      } else if (ch === "\\") {
        out += ch;
        escaped = true;
      } else if (ch === '"') {
        const next = input.slice(i + 1).trimStart()[0];
        if (next === undefined || ",}]:".includes(next)) {
          out += ch;
          inString = false;
        } else {
          out += '\\"';
        }
      } else if (ch === "\n") {
        out += "\\n";
      } else if (ch === "\r") {
        out += "\\r";
      } else if (ch === "\t") {
        out += "\\t";
      } else {
        out += ch;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
    } else if (ch === "{") {
      closers.push("}");
    } else if (ch === "[") {
      closers.push("]");
    } else if (ch === "}" || ch === "]") {
      closers.pop();
    }
    out += ch;
  }

  if (inString) {
    out += '"';
  }
  out = out.replaceAll(/,(\s*)$/g, "$1");
  return out + closers.toReversed().join("");
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
        content: Array.isArray(content)
          ? [
              ...content,
              {
                type: "text",
                text: `\n<tool_calls>\n${toolCallsJson}\n</tool_calls>`,
              },
            ]
          : `${content}\n<tool_calls>\n${toolCallsJson}\n</tool_calls>`,
      };
    }

    if (msg.role === "tool") {
      const toolCallId = msg.tool_call_id || "unknown";
      const result = msg.content || "Tool execution completed";

      return {
        role: "user",
        content: Array.isArray(result)
          ? [
              { type: "text", text: `[Tool Result for ${toolCallId}]\n` },
              ...result,
            ]
          : `[Tool Result for ${toolCallId}]\n${result}`,
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
  cacheTools?: ReadonlyMap<string, CacheControl>,
): OpenAIMessage[] {
  const toolSystemPrompt = generateToolSystemPrompt(tools);
  // These models receive tool definitions as text. Preserve a client breakpoint
  // on the last marked definition inside that synthetic system message.
  const marked = tools.filter((tool) => cacheTools?.has(tool.function.name));
  const toolParts: Exclude<OpenAIMessage["content"], string | null> = [];
  let cursor = 0;
  for (const tool of marked) {
    const start = toolSystemPrompt.indexOf(`- ${tool.function.name}: `, cursor);
    if (start < 0) {
      continue;
    }
    const params = JSON.stringify(tool.function.parameters || {}, null, 2);
    const paramStart = toolSystemPrompt.indexOf(`Parameters: ${params}`, start);
    if (paramStart < 0) {
      continue;
    }
    const end = paramStart + "Parameters: ".length + params.length;
    toolParts.push({
      type: "text",
      text: toolSystemPrompt.slice(cursor, end),
      cache_control: cacheTools?.get(tool.function.name),
    });
    cursor = end;
  }
  toolParts.push({ type: "text", text: toolSystemPrompt.slice(cursor) });
  const firstSystemIdx = messages.findIndex((msg) => msg.role === "system");

  if (firstSystemIdx !== -1) {
    // Append to existing system message
    const existingContent = messages[firstSystemIdx].content;
    const contentStr =
      typeof existingContent === "string" ? existingContent : "";
    const updatedMessages = [...messages];
    updatedMessages[firstSystemIdx] = {
      ...messages[firstSystemIdx],
      content:
        Array.isArray(existingContent) || marked.length
          ? [
              ...(Array.isArray(existingContent)
                ? existingContent
                : [{ type: "text", text: contentStr }]),
              { type: "text", text: "\n\n" },
              ...toolParts,
            ]
          : `${contentStr}\n\n${toolSystemPrompt}`,
    };
    return updatedMessages;
  }

  // No system message found, add one at the beginning
  return [
    {
      role: "system",
      content: marked.length ? toolParts : toolSystemPrompt,
    },
    ...messages,
  ];
}
