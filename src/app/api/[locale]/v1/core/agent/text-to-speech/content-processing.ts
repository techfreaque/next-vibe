/**
 * Content Processing for TTS
 * Utilities for preparing message content for text-to-speech
 */

import type { ChatMessage } from "@/app/api/[locale]/v1/core/agent/chat/db";
import { definitionLoader } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/definition/loader";
import { Platform } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/platform";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

/**
 * Strip <think> tags from content
 * Handles both closed tags <think>...</think> and unclosed tags <think>...
 */
export function stripThinkTags(content: string): string {
  const originalLength = content.length;

  // Remove closed think tags: <think>...</think>
  let processed = content.replace(/<think>[\s\S]*?<\/think>/gi, "");

  // Remove unclosed think tags: <think>... (everything after <think>)
  processed = processed.replace(/<think>[\s\S]*$/gi, "");

  // Trim whitespace
  const result = processed.trim();

  // Log if we stripped anything
  if (result.length !== originalLength) {
    // eslint-disable-next-line no-console
    console.log("[TTS Content] Stripped think tags", {
      originalLength,
      processedLength: result.length,
      removed: originalLength - result.length,
    });
  }

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
  // eslint-disable-next-line no-console
  console.log("[TTS Content] Preparing text for TTS", {
    originalLength: content.length,
    preview: content.substring(0, 100),
  });

  // 1. Strip markdown formatting
  let text = stripMarkdown(content);

  // 2. Convert line breaks to pauses
  text = convertLineBreaksToPauses(text);

  // 3. Clean up extra whitespace
  text = text.replace(/\s+/g, " ").trim();

  // eslint-disable-next-line no-console
  console.log("[TTS Content] Text prepared for TTS", {
    originalLength: content.length,
    processedLength: text.length,
    preview: text.substring(0, 100),
  });

  return text;
}

/**
 * Extract readable text from a tool call for TTS
 * Returns just the tool title/name - same as displayed in the UI
 */
export async function extractToolCallText(
  toolName: string,
  locale: CountryLanguage,
): Promise<string> {
  const { t } = simpleT(locale);

  // Load the definition using the same loader as ToolCallRenderer
  // This ensures we get the exact same title that's displayed in the UI
  try {
    const { createPublicUser } =
      await import("@/app/api/[locale]/v1/core/user/auth/helpers");
    const { createEndpointLogger } =
      await import("@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint");

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
      // eslint-disable-next-line no-console
      console.log("[TTS Content] Loaded tool title from definition", {
        toolName,
        title,
      });
      return title;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("[TTS Content] Failed to load tool definition", {
      toolName,
      error,
    });
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

  // eslint-disable-next-line no-console
  console.log("[TTS Content] Using fallback tool title", {
    toolName,
    fallbackTitle,
  });

  return fallbackTitle;
}

/**
 * Process a single message for TTS
 * Strips think tags, markdown, and handles tool calls
 */
export async function processMessageForTTS(
  message: ChatMessage,
  locale: CountryLanguage,
): Promise<string> {
  // TOOL message - extract tool title
  if (message.role === "tool" && message.metadata?.toolCall) {
    const toolName = message.metadata.toolCall.toolName;
    return await extractToolCallText(toolName, locale);
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
): Promise<string> {
  // eslint-disable-next-line no-console
  console.log("[TTS Content] Processing message group", {
    messageCount: messages.length,
    roles: messages.map((m) => m.role),
  });

  // Process all messages in parallel
  const processedMessages = await Promise.all(
    messages.map((msg) => processMessageForTTS(msg, locale)),
  );

  // Filter out empty messages
  const nonEmptyMessages = processedMessages.filter(
    (text) => text.trim().length > 0,
  );

  // eslint-disable-next-line no-console
  console.log("[TTS Content] Processed message group", {
    originalCount: messages.length,
    processedCount: nonEmptyMessages.length,
    totalLength: nonEmptyMessages.join("\n\n").length,
  });

  // Join with double newline for clear separation
  return nonEmptyMessages.join("\n\n");
}
