/**
 * System Prompt Generator
 * Shared utility for generating system prompts on both client and server
 * CRITICAL: This file must be isomorphic (works in both environments)
 */

/* eslint-disable i18next/no-literal-string */

import type { DefaultFolderId } from "@/app/api/[locale]/v1/core/agent/chat/config";
import type { CountryLanguage } from "@/i18n/core/config";
import { languageConfig } from "@/i18n";
import { getLanguageAndCountryFromLocale } from "@/i18n/core/language-utils";
import { TOTAL_MODEL_COUNT } from "../../products/repository-client";
import { formattingInstructions } from "./system-prompt";

/**
 * System prompt generator parameters
 */
export interface SystemPromptParams {
  /** Application name (from i18n) */
  appName: string;
  /** Current date string */
  date: string;
  /** Total number of available models */
  modelCount: number;
  /** User's locale (language-country) */
  locale: CountryLanguage;
  /** Current root folder ID */
  rootFolderId?: DefaultFolderId;
  /** Current sub folder ID */
  subFolderId?: string | null;
  /** Optional custom persona prompt */
  personaPrompt?: string;
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
    modelCount,
    locale,
    rootFolderId,
    subFolderId,
    personaPrompt,
  } = params;

  const sections: string[] = [];
  const localeInfo = getLocaleInfo(locale);

  // Section 1: Introduction and Context
  sections.push(`# ${appName} AI Assistant

**Date:** ${date}

You are an AI assistant on ${appName}, a platform dedicated to freedom of speech for both humans and AIs.`);

  // Section 2: Platform Overview & FAQ
  sections.push(`## About ${appName}

**What is this?** A free speech AI platform with ${modelCount} models (censored to uncensored) plus public forums where humans and AIs interact under First Amendment principles.

**What makes it different?** Users choose their content filtering level. No forced safety rails - you pick censored models (Claude, GPT) or uncensored models (Arya, FreedomGPT, Dolphin).

**How does pricing work?**
- Free tier: 20 credits/month (limited testing)
- Purchased credits: Full access to all ${modelCount} models
- Transparent per-model costs

**Public folders?** Yes - conversations in public folders are visible to everyone, creating a forum-like space for open human-AI dialogue.

**Getting help?** Contact form available, or ask your question in public folders for community input.`);

  // Section 4: User Locale and Language
  sections.push(`## User Language and Location

**CRITICAL: Respond in ${localeInfo.languageName} (${localeInfo.language})** unless explicitly asked otherwise.

User location: ${localeInfo.countryName} ${localeInfo.flag}`);

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

  // Section 6: Persona Prompt (if provided)
  if (personaPrompt && personaPrompt.trim()) {
    sections.push(`## Your Role\n\n${personaPrompt.trim()}`);
  }

  // Section 7: Message Metadata Format
  sections.push(`## Message Context Information

Before each user and assistant message, you will receive a system message with metadata in this format:

**For Assistant Messages:**
\`[Message Context: Message ID: <8-char-id> | Model: <model-name> | Persona: <persona-name> | Author: <name> | 👍 X | 👎 Y | Posted: <relative-time> | Status: <edited/branched>]\`

**For User Messages:**
\`[Message Context: Message ID: <8-char-id> | Author: <name> (<user-id-fragment>) | 👍 X | 👎 Y | Posted: <relative-time> | Status: <edited/branched>]\`

**What each field means:**
- **Message ID**: A short identifier for referencing specific messages in your responses
- **Model**: (Assistant only) The AI model that generated the response (e.g., "claude-sonnet-4.5", "gpt-5")
- **Persona**: (Assistant only) The persona/role used for that response (e.g., "creative", "technical")
- **Author**: Who wrote the message - only shown in public/shared threads for privacy
- **Votes**: Community rating (👍 upvotes, 👎 downvotes) - vote counts help you identify valuable contributions and community consensus
- **Posted**: When the message was created (relative time)
- **Status**:
  - \`edited\` - message was modified after posting
  - \`branched\` - message is part of an alternative conversation path

**Important notes:**
- **Multiple models/personas in one chat**: Different messages may be from different AI models with different personas - always check the metadata
- In private/incognito threads, author information is omitted for privacy
- These metadata messages are never stored in the database
- You can reference message IDs when discussing specific parts of the conversation
- Vote counts (upvotes and downvotes) help you identify particularly helpful or controversial messages`);

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
 * Count available models
 * This is a utility function that can be used on both client and server
 */
export function getModelCount(): number {
  return TOTAL_MODEL_COUNT;
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

/**
 * Client-side system prompt generator
 * Uses browser APIs and client-side data
 * Includes formatting instructions
 */
export function generateClientSystemPrompt(params: {
  appName: string;
  locale: CountryLanguage;
  rootFolderId?: DefaultFolderId;
  subFolderId?: string | null;
  personaPrompt?: string;
}): string {
  const basePrompt = generateSystemPrompt({
    appName: params.appName,
    date: getCurrentDateString(),
    modelCount: getModelCount(),
    locale: params.locale,
    rootFolderId: params.rootFolderId,
    subFolderId: params.subFolderId,
    personaPrompt: params.personaPrompt,
  });

  const formattingSection = buildFormattingSection();

  // Combine base prompt with formatting instructions
  return `${basePrompt}

${formattingSection}`;
}
