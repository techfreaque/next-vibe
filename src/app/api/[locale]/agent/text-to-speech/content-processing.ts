/**
 * Content Processing for TTS
 * Utilities for preparing message content for text-to-speech
 */

import type {
  ChatMessage,
  ToolCallResult,
} from "@/app/api/[locale]/agent/chat/db";
import { definitionLoader } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/loader";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { parseError } from "../../shared/utils";

/**
 * Strip <think> tags from content
 * Handles both closed tags <think>...</think> and unclosed tags <think>...
 */
export function stripThinkTags(content: string): string {
  // Remove closed think tags: <think>...</think>
  let processed = content.replace(/<think>[\s\S]*?<\/think>/gi, "");

  // Remove unclosed think tags: <think>... (everything after <think>)
  processed = processed.replace(/<think>[\s\S]*$/gi, "");

  // Trim whitespace
  const result = processed.trim();

  return result;
}

/**
 * Strip markdown formatting from text
 * Removes markdown syntax while keeping the actual content
 */
function stripMarkdown(text: string): string {
  let result = text;

  // Remove code blocks (```...```)
  result = result.replace(/```[\s\S]*?```/g, "");

  // Remove inline code (`...`)
  result = result.replace(/`([^`]+)`/g, "$1");

  // Remove bold/italic (**text**, __text__, *text*, _text_)
  result = result.replace(/(\*\*|__)(.*?)\1/g, "$2");
  result = result.replace(/(\*|_)(.*?)\1/g, "$2");

  // Remove headings (# ## ### etc)
  result = result.replace(/^#{1,6}\s+/gm, "");

  // Remove blockquotes (>)
  result = result.replace(/^>\s+/gm, "");

  // Remove list markers (-, *, +, 1.)
  result = result.replace(/^[\s]*[-*+]\s+/gm, "");
  result = result.replace(/^[\s]*\d+\.\s+/gm, "");

  // Remove links [text](url) -> text
  result = result.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // Remove images ![alt](url) -> alt
  result = result.replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1");

  // Remove horizontal rules (---, ***, ___)
  result = result.replace(/^[\s]*[-*_]{3,}[\s]*$/gm, "");

  return result;
}

/**
 * Convert line breaks to natural pauses for TTS
 * Adds punctuation to create pauses in speech
 */
function convertLineBreaksToPauses(text: string): string {
  let result = text;

  // Replace paragraph breaks (double newline) with period + space
  // This creates a longer pause
  result = result.replace(/\n\n+/g, ". ");

  // Replace single newlines with period if the line doesn't end with punctuation
  // This creates a short pause between lines
  result = result.replace(/([^.!?,;:])\n/g, "$1. ");

  // Clean up multiple periods
  result = result.replace(/\.{2,}/g, ".");

  // Clean up period before existing punctuation
  result = result.replace(/\.\s*([.!?,;:])/g, "$1");

  return result;
}

/**
 * Prepare text for TTS by stripping markdown and converting line breaks to pauses
 */
export function prepareTextForTTS(content: string): string {
  // 1. Strip markdown formatting
  let text = stripMarkdown(content);

  // 2. Convert line breaks to pauses
  text = convertLineBreaksToPauses(text);

  // 3. Clean up extra whitespace
  text = text.replace(/\s+/g, " ").trim();

  return text;
}

/**
 * Extract readable text from a tool call for TTS
 * Returns just the tool title/name - same as displayed in the UI
 */
export async function extractToolCallText(
  toolName: string,
  locale: CountryLanguage,
  logger: EndpointLogger,
): Promise<string> {
  const { t } = simpleT(locale);

  // Load the definition using the same loader as ToolCallRenderer
  // This ensures we get the exact same title that's displayed in the UI
  try {
    const { createPublicUser } =
      await import("@/app/api/[locale]/user/auth/helpers");
    const { createEndpointLogger } =
      await import("@/app/api/[locale]/system/unified-interface/shared/logger/endpoint");

    const user = createPublicUser(crypto.randomUUID());
    const logger = createEndpointLogger(true, Date.now(), locale);

    const result = await definitionLoader.load({
      identifier: toolName,
      platform: Platform.NEXT_PAGE,
      user,
      logger,
    });

    if (result.success && result.data?.title) {
      // Use the same translation logic as ToolCallRenderer
      const title = t(result.data.title);

      return title;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    logger.warn(
      "[TTS Content] Failed to load tool definition",
      parseError(error),
      {
        toolName,
      },
    );
  }

  // Fallback: use the tool name (last part after the last dot)
  const parts = toolName.split(".");
  const lastPart = parts[parts.length - 1] ?? toolName;

  // Convert camelCase/PascalCase to readable text
  // e.g., "textToSpeech" -> "Text To Speech"
  const fallbackTitle = lastPart
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();

  return fallbackTitle;
}

/**
 * Process a single message for TTS
 * Strips think tags, markdown, and handles tool calls
 */
export async function processMessageForTTS(
  message: ChatMessage,
  locale: CountryLanguage,
  logger: EndpointLogger,
): Promise<string> {
  // TOOL message - extract tool title
  if (message.role === "tool" && message.metadata?.toolCall) {
    const toolName = message.metadata.toolCall.toolName;
    return await extractToolCallText(toolName, locale, logger);
  }

  // Regular message - strip think tags, then prepare for TTS
  if (message.content) {
    const withoutThinkTags = stripThinkTags(message.content);
    return prepareTextForTTS(withoutThinkTags);
  }

  return "";
}

/**
 * Process multiple messages in a group for sequential TTS
 * Combines all messages with proper spacing
 */
export async function processMessageGroupForTTS(
  messages: ChatMessage[],
  locale: CountryLanguage,
  logger: EndpointLogger,
): Promise<string> {
  // Process all messages in parallel
  const processedMessages = await Promise.all(
    messages.map((msg) => processMessageForTTS(msg, locale, logger)),
  );

  // Filter out empty messages
  const nonEmptyMessages = processedMessages.filter(
    (text) => text.trim().length > 0,
  );

  // Join with double newline for clear separation
  return nonEmptyMessages.join("\n\n");
}

/**
 * Format tool call for copying
 * Returns a formatted string representation of a tool call
 */
async function formatToolCallForCopy(
  toolName: string,
  args: ToolCallResult,
  result: ToolCallResult | undefined,
  locale: CountryLanguage,
  asMarkdown: boolean,
  logger: EndpointLogger,
): Promise<string> {
  const toolTitle = await extractToolCallText(toolName, locale, logger);
  const parts: string[] = [];

  if (asMarkdown) {
    // Markdown format with code blocks
    parts.push(`## ${toolTitle}`);
    parts.push("");

    if (args && typeof args === "object" && Object.keys(args).length > 0) {
      parts.push("**Arguments:**");
      parts.push("```json");
      parts.push(JSON.stringify(args, null, 2));
      parts.push("```");
      parts.push("");
    }

    if (result) {
      parts.push("**Result:**");
      parts.push("```json");
      parts.push(JSON.stringify(result, null, 2));
      parts.push("```");
    }
  } else {
    // Plain text format
    parts.push(`${toolTitle}`);

    if (args && typeof args === "object" && Object.keys(args).length > 0) {
      parts.push("");
      parts.push("Arguments:");
      parts.push(JSON.stringify(args, null, 2));
    }

    if (result) {
      parts.push("");
      parts.push("Result:");
      parts.push(JSON.stringify(result, null, 2));
    }
  }

  return parts.join("\n");
}

/**
 * Process a message group for copying
 * Extracts content including tool calls with both markdown and plain text options
 * ALWAYS strips think tags (both closed and unclosed) for both formats
 */
export async function processMessageGroupForCopy(
  messages: ChatMessage[],
  locale: CountryLanguage,
  asMarkdown: boolean,
  logger: EndpointLogger,
): Promise<string> {
  const parts: string[] = [];

  for (const message of messages) {
    if (message.role === "tool" && message.metadata?.toolCall) {
      // Format tool call with args and results
      const toolCall = message.metadata.toolCall;
      const formatted = await formatToolCallForCopy(
        toolCall.toolName,
        toolCall.args,
        toolCall.result,
        locale,
        asMarkdown,
        logger,
      );
      parts.push(formatted);
    } else if (message.content) {
      // ALWAYS strip think tags first (both closed <think>...</think> and unclosed <think>...)
      const withoutThinkTags = stripThinkTags(message.content);

      if (asMarkdown) {
        // Keep markdown formatting, but think tags are already stripped
        parts.push(withoutThinkTags);
      } else {
        // Plain text: also strip markdown
        const plainText = stripMarkdown(withoutThinkTags);
        parts.push(plainText);
      }
    }
  }

  // Join with appropriate separators
  const separator = asMarkdown ? "\n\n---\n\n" : "\n\n";
  return parts.join(separator);
}
