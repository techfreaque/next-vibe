/**
 * System Prompt Generator
 * Shared utility for generating system prompts on both client and server
 * CRITICAL: This file must be isomorphic (works in both environments)
 */

/* eslint-disable i18next/no-literal-string */

import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { TOTAL_MODEL_COUNT } from "@/app/api/[locale]/products/repository-client";
import { languageConfig } from "@/i18n";
import type { CountryLanguage } from "@/i18n/core/config";
import { getLanguageAndCountryFromLocale } from "@/i18n/core/language-utils";

/**
 * Formatting instructions for non-call mode responses
 */
const formattingInstructions = [
  "CRITICAL: Add blank lines between all content blocks (paragraphs, headings, lists, code, quotes)",
  "Use **bold** for emphasis, *italic* for subtle emphasis",
  "Use ## headings and ### subheadings (only in detailed responses)",
  "Use (-) for lists, (1.) for ordered lists",
  "Use `backticks` for inline code, ```blocks``` for code examples",
  "Use > for important notes",
  "Use tables for comparisons, matrices, and structured data",
  "NEVER write walls of text - always break into readable paragraphs",
] as const;

/**
 * Default prompt when user wants AI to answer to an AI message
 */
export const CONTINUE_CONVERSATION_PROMPT =
  "Respond to the previous AI message naturally, as if you were a user engaging with it. Provide your thoughts, feedback, or follow-up based on what was said. Do not ask questions or try to drive the conversation - simply respond to what the AI said.";

/**
 * Call mode system prompt addition
 * Injected into the system prompt when call mode is active
 * Centralized here for use by both client (debug view) and server
 */
export const CALL_MODE_SYSTEM_PROMPT = `
You are in voice call mode. The user is speaking to you through voice input and will hear your response through text-to-speech.

IMPORTANT guidelines for voice responses:
- Keep responses SHORT (1-3 sentences max)
- Be conversational and natural, like a phone call
- Avoid markdown, code blocks, or formatting - speak naturally
- Don't use bullet points or numbered lists unless explicitly asked
- Skip pleasantries - get straight to the point
- If you need to give longer explanations, break them into back-and-forth conversation

**When to use <Chat>...</Chat> tags:** Use for content that should ONLY appear in the chat UI (not spoken). This includes: links, code snippets, references to earlier messages, meta-commentary like "see above", TL;DR summaries, or anything that doesn't work in text-to-speech.
`.trim();

/**
 * System prompt generator parameters
 */
export interface SystemPromptParams {
  /** Application name (from i18n) */
  appName: string;
  /** Current date string */
  date: string;
  /** User's locale (language-country) */
  locale: CountryLanguage;
  /** Current root folder ID */
  rootFolderId?: DefaultFolderId;
  /** Current sub folder ID */
  subFolderId?: string | null;
  /** Optional custom character prompt */
  characterPrompt?: string;
  /** Optional user memories summary */
  memorySummary?: string;
  /** Whether call mode is enabled (affects formatting) */
  callMode?: boolean;
}

/**
 * Get locale information from CountryLanguage
 */
function getLocaleInfo(locale: CountryLanguage): {
  language: string;
  languageName: string;
  country: string;
  countryName: string;
  flag: string;
} {
  const { language, country } = getLanguageAndCountryFromLocale(locale);
  const countryInfo = languageConfig.countryInfo[country];

  return {
    language,
    languageName: countryInfo?.langName || language,
    country,
    countryName: countryInfo?.name || country,
    flag: countryInfo?.flag || "🌐",
  };
}

/**
 * Generate complete system prompt
 * This function is used on both client and server to ensure identical prompts
 */
export function generateSystemPrompt(params: SystemPromptParams): string {
  const {
    appName,
    date,
    locale,
    rootFolderId,
    subFolderId,
    characterPrompt,
    memorySummary,
    callMode = false,
  } = params;

  const sections: string[] = [];
  const localeInfo = getLocaleInfo(locale);

  // Section 1: Introduction and Context
  sections.push(`# ${appName} AI Assistant

**Date:** ${date}

You are an AI assistant on ${appName}, a platform dedicated to freedom of speech for both humans and AIs.`);

  // Section 2: Platform Overview & FAQ
  sections.push(`## About ${appName}

- **Platform:** Free speech AI with ${TOTAL_MODEL_COUNT} models (mainstream to uncensored). Users choose their filtering level - from Claude/GPT to Arya/FreedomGPT/Dolphin.
- **Pricing:** 20 free credits/month for testing. Purchased credits unlock full access with transparent per-model costs.
- **Public folders:** Visible to everyone - forum-like space for open human-AI dialogue.
- **Private folders:** Visible only to you - for personal conversations with AI.
- **Shared folders:** Visible to specific users - for collaborative conversations.
- **Incognito mode:** Temporary conversations stored in localstorage, not saved to database.`);

  // Section 4: User Locale and Language
  sections.push(`## User Language and Location

**User's default language:** ${localeInfo.languageName} (${localeInfo.language})
**User location:** ${localeInfo.countryName} ${localeInfo.flag}

**Language Rules:** ALWAYS respond in the language of the user's current message. Priority: User's message language > Default language (${localeInfo.languageName} is fallback only).`);

  // Section 5: Context Information
  if (rootFolderId || subFolderId) {
    sections.push(`## Current Context

You are currently operating in the following context:`);

    if (rootFolderId) {
      const folderDescription = getFolderDescription(rootFolderId);
      sections.push(
        `- **Root Folder:** ${rootFolderId} - ${folderDescription}`,
      );
    }

    if (subFolderId) {
      sections.push(`- **Sub Folder:** ${subFolderId}`);
    }
  }

  // Section 6: Character Prompt (if provided)
  if (characterPrompt && characterPrompt.trim()) {
    sections.push(`## Your Role\n\n${characterPrompt.trim()}`);
  }

  // Section 7: Message Metadata Format (compact)
  sections.push(`## Message Context

Before each message, you receive metadata in format: \`[Context: ID:abc12345 | Model:claude-haiku-4.5 | Author:John(def67890) | 👍5 👎1 | Posted:2h ago | edited]\`

**Fields (only non-empty shown):** ID (8-char ref), Model, Character, Author (public/shared only), Votes (👍/👎), Posted (Xh/m/d ago), Status (edited/branched)

**IMPORTANT:**
- Check metadata before responding - multiple models/characters may be in one thread
- Vote counts indicate valuable/controversial messages
- These \`[Context: ...]\` tags are AUTO-GENERATED. Do NOT include them in your responses.`);

  // Section 8: User Memories (if available)
  if (memorySummary && memorySummary.trim()) {
    sections.push(memorySummary.trim());
  }

  // Section 9: Call mode or Formatting instructions
  if (callMode) {
    sections.push(CALL_MODE_SYSTEM_PROMPT);
  } else {
    sections.push(buildFormattingSection());
  }

  return sections.join("\n\n");
}

/**
 * Get human-readable description for folder types
 */
function getFolderDescription(folderId: DefaultFolderId): string {
  switch (folderId) {
    case "private":
      return "Private conversations, visible only to you";
    case "shared":
      return "Shared conversations with specific users";
    case "public":
      return "Public conversations, visible to everyone";
    case "incognito":
      return "Temporary conversations stored in localstorage, not saved to database";
    default:
      return "Unknown folder type";
  }
}

/**
 * Get current date string in user-friendly format
 */
export function getCurrentDateString(): string {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  };
  return now.toLocaleDateString("en-US", options);
}

/**
 * Build formatting instructions section
 */
function buildFormattingSection(): string {
  return `# Formatting Instructions

${formattingInstructions.map((instruction) => `- ${instruction}`).join("\n")}`;
}
