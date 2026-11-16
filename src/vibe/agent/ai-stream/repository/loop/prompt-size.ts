/**
 * Prompt size breakdown for context-length overflows.
 *
 * A provider "context_length_exceeded" says only the total. When stored
 * messages are tiny, the culprit is whatever the converter inlined (media as
 * base64, a huge tool result, the system prompt), so log where the characters
 * are: per role, per part type, and the largest parts.
 */

import type { ModelMessage } from "ai";

const CONTEXT_OVERFLOW_PATTERN =
  /context[_ ]length|maximum context|context window|prompt is too long|too many (input )?tokens|reduce the length of/i;

/** Does a provider error text describe a context-length overflow? */
export function isContextOverflowText(errorText: string): boolean {
  return CONTEXT_OVERFLOW_PATTERN.test(errorText);
}

/** Characters a part costs once serialized for the provider. */
function partChars<T>(part: T): number {
  return JSON.stringify(part)?.length ?? 0;
}

export interface PromptSizeBreakdown {
  systemPromptChars: number;
  messageCount: number;
  totalChars: number;
  charsByRole: Record<string, number>;
  charsByPartType: Record<string, number>;
  largestParts: Array<{
    index: number;
    role: string;
    partType: string;
    chars: number;
    /** Tool name for tool-call / tool-result parts. */
    toolName?: string;
    /** Tool-result output kind (json / content / text ...). */
    outputType?: string;
  }>;
}

export function summarizePromptSize(
  systemPrompt: string | undefined,
  messages: readonly ModelMessage[],
): PromptSizeBreakdown {
  const charsByRole: Record<string, number> = {};
  const charsByPartType: Record<string, number> = {};
  const parts: PromptSizeBreakdown["largestParts"] = [];
  let totalChars = systemPrompt?.length ?? 0;

  messages.forEach((message, index) => {
    const add = (
      partType: string,
      chars: number,
      extra: { toolName?: string; outputType?: string } = {},
    ): void => {
      totalChars += chars;
      charsByRole[message.role] = (charsByRole[message.role] ?? 0) + chars;
      charsByPartType[partType] = (charsByPartType[partType] ?? 0) + chars;
      parts.push({ index, role: message.role, partType, chars, ...extra });
    };

    if (typeof message.content === "string") {
      add("text", message.content.length);
      return;
    }
    for (const part of message.content) {
      if (part.type === "tool-result") {
        add(`tool-result:${part.output.type}`, partChars(part.output), {
          toolName: part.toolName,
          outputType: part.output.type,
        });
      } else if (part.type === "tool-call") {
        add("tool-call", partChars(part), { toolName: part.toolName });
      } else {
        add(part.type, partChars(part));
      }
    }
  });

  return {
    systemPromptChars: systemPrompt?.length ?? 0,
    messageCount: messages.length,
    totalChars,
    charsByRole,
    charsByPartType,
    largestParts: parts.toSorted((a, b) => b.chars - a.chars).slice(0, 5),
  };
}
