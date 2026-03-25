/**
 * Shared utility for extracting the last user prompt from LanguageModelV2 messages.
 * Used by media generation providers (image, audio) that need the text prompt.
 */

import type { LanguageModelV2Prompt } from "@ai-sdk/provider";

/**
 * Extract the text of the last user message from an AI SDK prompt.
 * Falls back to empty string if no user message is found.
 */
export function extractLastUserPrompt(prompt: LanguageModelV2Prompt): string {
  // Walk backwards to find last user message
  for (let i = prompt.length - 1; i >= 0; i--) {
    const msg = prompt[i];
    if (msg?.role === "user") {
      const parts = msg.content;
      // Collect all text parts
      const text = parts
        .filter((p) => p.type === "text")
        .map((p) => ("text" in p ? p.text : ""))
        .join(" ")
        .trim();
      if (text) {
        return text;
      }
    }
  }
  return "";
}
