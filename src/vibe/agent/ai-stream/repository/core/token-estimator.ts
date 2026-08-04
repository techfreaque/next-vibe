/** Token estimation heuristics for context budgeting. */

import "server-only";

import type { JSONValue, ModelMessage, streamText } from "ai";
import type { CoreTool } from "next-vibe/platforms/ai/tools-loader";

import type { ChatMessage } from "../../../chat/db";

/**
 * Token estimation heuristics - the single home for all char-divisor token
 * estimators in ai-stream. Divisors intentionally differ per entry point:
 * each one was tuned for its call site's content mix, and the exact math is
 * preserved so counts don't shift.
 *
 * - estimateChatMessageTokens:   DB ChatMessage[] (pre-conversion) - 3.5/2.5/4 mix
 * - estimateModelMessageTokens:  AI SDK ModelMessage[] - char/4 with media overheads
 * - estimateInputTokens:         ModelMessage[] + system + tools - 3.5/2.5 mix
 * - estimateTokensFromContext:   aborted-stream billing - flatten all to text, /3.5
 */

/**
 * Calculate total tokens that will be sent in the next request from DB rows.
 * Counts: system prompt + tools + all messages in the chain.
 */
export function estimateChatMessageTokens(
  messages: ChatMessage[],
  systemPrompt: string,
  tools: Parameters<typeof streamText>[0]["tools"],
): number {
  // System prompt tokens - use char/3.5 for structured text (more accurate than char/4)
  const systemTokens = Math.ceil(systemPrompt.length / 3.5);

  // Tools JSON tokens - JSON is dense, use char/2.5 (tools can be VERY large)
  const toolsTokens = tools ? Math.ceil(JSON.stringify(tools).length / 2.5) : 0;

  // Message tokens - different calculation based on content type
  const messageTokens = messages.reduce((sum, msg) => {
    // Text content (may be null for tool messages and some assistant messages)
    const textContent = msg.content ?? "";

    // Tool messages: content is null - actual data is in metadata.toolCall
    // Count both the args and result as JSON (dense, use char/2.5)
    if (msg.role === "tool") {
      const toolCall = msg.metadata?.toolCall;
      if (toolCall) {
        const toolJson = JSON.stringify({
          args: toolCall.args,
          result: toolCall.result,
        });
        return sum + Math.ceil(toolJson.length / 2.5);
      }
      // Fallback: if content was somehow stored as text
      return sum + Math.ceil(textContent.length / 2.5);
    }

    // Assistant messages may have tool calls in metadata even when content is null
    // (pure tool-call messages with no text)
    if (msg.role === "assistant" && msg.metadata?.toolCall) {
      const toolJson = JSON.stringify(msg.metadata.toolCall);
      return (
        sum +
        Math.ceil(textContent.length / 4) +
        Math.ceil(toolJson.length / 2.5)
      );
    }

    // Regular messages (user, assistant text, system, compacting summary)
    return sum + Math.ceil(textContent.length / 4);
  }, 0);

  return systemTokens + toolsTokens + messageTokens;
}

/**
 * Estimate token count for a ModelMessage[] array.
 * Uses char/4 heuristic - good enough for truncation decisions.
 */
export function estimateModelMessageTokens(msgs: ModelMessage[]): number {
  return msgs.reduce((sum, m) => {
    if (typeof m.content === "string") {
      return sum + Math.ceil(m.content.length / 4);
    }
    if (Array.isArray(m.content)) {
      return (
        sum +
        Math.ceil(
          m.content
            .map((part) => {
              if (typeof part === "object") {
                // Binary file parts (audio/video): count as fixed ~300 token overhead,
                // not the raw bytes (Uint8Array JSON.stringify produces massive output)
                if ("type" in part && part.type === "file") {
                  return " ".repeat(300 * 4);
                }
                if ("text" in part) {
                  return (part as { text: string }).text;
                }
                if ("image" in part) {
                  // Images: fixed ~400 token overhead
                  return " ".repeat(400 * 4);
                }
                // Tool-result parts may contain file-data (base64 images) in their
                // output.value array. JSON.stringify would include the raw base64 string
                // (~1MB+) causing wildly inflated token estimates and aggressive truncation.
                // Detect these and count each file-data entry as ~400 tokens (same as images).
                if (
                  "type" in part &&
                  part.type === "tool-result" &&
                  "output" in part
                ) {
                  const output = (
                    part as {
                      output?: {
                        type?: string;
                        value?: JSONValue;
                      };
                    }
                  ).output;
                  if (
                    output?.type === "content" &&
                    Array.isArray(output.value)
                  ) {
                    let tokens = 0;
                    for (const entry of output.value as Array<{
                      type?: string;
                      text?: string;
                    }>) {
                      if (
                        entry.type === "file-data" ||
                        entry.type === "media" ||
                        entry.type === "image-data"
                      ) {
                        tokens += 400 * 4; // same as image overhead
                      } else if (entry.text) {
                        tokens += entry.text.length;
                      } else {
                        tokens += 50; // small overhead for other parts
                      }
                    }
                    return " ".repeat(tokens);
                  }
                  // json output: count the serialized value, not the full part wrapper
                  return JSON.stringify(output?.value ?? null);
                }
              }
              return JSON.stringify(part);
            })
            .join("").length / 4,
        )
      );
    }
    return sum;
  }, 0);
}

/**
 * Estimate input token count from a ModelMessage[] array plus system prompt and tools.
 * Used as a fallback when the provider doesn't report real usage in streaming mode
 * (e.g. kimi-k2.6 via Fireworks returns 0 inputTokens in SSE chunks).
 * Uses char/3.5 approximation for text, char/2.5 for dense JSON.
 */
export function estimateInputTokens(
  messages: ModelMessage[],
  systemPrompt: string,
  tools: Record<string, CoreTool> | undefined,
): number {
  const systemTokens = Math.ceil(systemPrompt.length / 3.5);
  const toolsTokens = tools ? Math.ceil(JSON.stringify(tools).length / 2.5) : 0;
  const messagesTokens = messages.reduce((sum, msg) => {
    const { content } = msg;
    if (typeof content === "string") {
      return sum + Math.ceil(content.length / 3.5);
    }
    if (Array.isArray(content)) {
      const text = content
        .map((p) =>
          p.type === "text"
            ? (p.text ?? "")
            : p.type === "tool-call" || p.type === "tool-result"
              ? JSON.stringify(p)
              : "",
        )
        .join(" ");
      return sum + Math.ceil(text.length / 2.5);
    }
    return sum;
  }, 0);
  return systemTokens + toolsTokens + messagesTokens;
}

/**
 * Flatten a ModelMessage into a plain string the way the model actually sees it.
 * Handles text, tool-call, tool-result, and image content parts.
 * ~3.5 skills per token for English text.
 */
function flattenMessage(msg: ModelMessage): string {
  const parts: string[] = [];

  // role prefix adds a small overhead
  parts.push(String(msg.role));

  const { content } = msg;

  if (typeof content === "string") {
    parts.push(content);
  } else if (Array.isArray(content)) {
    for (const part of content as Array<
      Record<string, string | number | boolean | null | undefined>
    >) {
      if (part.type === "text" && typeof part.text === "string") {
        parts.push(part.text);
      } else if (part.type === "tool-call") {
        // tool name + serialized args
        parts.push(String(part.toolName ?? ""));
        if (part.args !== undefined) {
          parts.push(
            typeof part.args === "string"
              ? part.args
              : JSON.stringify(part.args),
          );
        }
      } else if (part.type === "tool-result") {
        parts.push(String(part.toolName ?? ""));
        if (part.result !== undefined) {
          parts.push(
            typeof part.result === "string"
              ? part.result
              : JSON.stringify(part.result),
          );
        }
      } else if (part.type === "image") {
        // images count as tokens but we can't measure them well - use a fixed overhead
        parts.push("[image]");
      } else if (part.type === "reasoning" && typeof part.text === "string") {
        parts.push(part.text);
      }
    }
  }

  return parts.join(" ");
}

/**
 * Flatten tool definitions to the text a model sees (name + description).
 * The AI SDK stores parameters as a jsonSchema() wrapper, not a plain object,
 * so we only extract the string fields we can reliably access.
 */
function flattenTools(tools: Record<string, CoreTool>): string {
  const parts: string[] = [];
  for (const [name, tool] of Object.entries(tools)) {
    parts.push(name);
    const t = tool as { description?: string };
    if (t.description) {
      parts.push(t.description);
    }
  }
  return parts.join(" ");
}

/**
 * Estimate token count based on full context.
 * Flattens everything to plain text before measuring, mirroring what the model tokenises.
 * Includes: system prompt + tool definitions (names/descriptions/params) +
 *           full message history (all content parts) + partial AI response so far.
 * Rough approximation: ~3.5 skills per token for English text.
 */
export function estimateTokensFromContext(params: {
  systemPrompt?: string;
  messages?: ModelMessage[];
  tools?: Record<string, CoreTool>;
  aiResponse: string;
}): {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
} {
  const { systemPrompt, messages, tools, aiResponse } = params;

  const systemPromptTokens = systemPrompt
    ? Math.ceil(systemPrompt.length / 3.5)
    : 0;

  const toolsText = tools ? flattenTools(tools) : "";
  const toolsTokens = toolsText ? Math.ceil(toolsText.length / 3.5) : 0;

  const messagesText = messages ? messages.map(flattenMessage).join(" ") : "";
  const messagesTokens = messagesText
    ? Math.ceil(messagesText.length / 3.5)
    : 0;

  const completionTokens = aiResponse ? Math.ceil(aiResponse.length / 3.5) : 0;

  const promptTokens = systemPromptTokens + toolsTokens + messagesTokens;
  const totalTokens = promptTokens + completionTokens;

  return { promptTokens, completionTokens, totalTokens };
}
