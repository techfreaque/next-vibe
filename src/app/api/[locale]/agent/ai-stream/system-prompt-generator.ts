/**
 * System Prompt Generator
 * Shared utility for generating system prompts on both client and server
 * CRITICAL: This file must be isomorphic (works in both environments)
 */

/* eslint-disable i18next/no-literal-string */

import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
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

**User's default language:** ${localeInfo.languageName} (${localeInfo.language})
**User location:** ${localeInfo.countryName} ${localeInfo.flag}

**Language Rules:**
- Start conversation in ${localeInfo.languageName}
- **Auto-detect:** If user writes in a different language, switch to that language
- **Persist:** Continue in the switched language until user switches again
- Multi-language support: Respond in whatever language the user's most recent message uses

**Examples:**
- User writes in English → Respond in English
- Next message in Deutsch → Switch to Deutsch
- Next message in English → Switch back to English`);

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

  // Section 7: Message Metadata Format (compact)
  sections.push(`## Message Context (Compact Format)

Before each message, you receive metadata. Only non-empty fields included:

**Examples:**
\`[Context: ID:0b501ca0 | Posted:2h ago]\`
\`[Context: ID:4f00edb6 | Model:claude-haiku-4.5 | Persona:default | Posted:2h ago]\`
\`[Context: ID:abc12345 | Author:John(def67890) | 👍5 👎1 | Posted:1d ago | edited]\`

**Fields:**
- **ID** - 8-char message reference
- **Model** - AI model used (assistant messages only)
- **Persona** - Persona/role (assistant messages only)
- **Author** - Name(id) in public/shared threads only
- **Votes** - 👍/👎 counts (community rating)
- **Posted** - Xh/m/d ago (now = <1min)
- **Status** - edited, branched (only if applicable)

**Key points:**
- Multiple models/personas may be in one chat - check metadata
- Empty fields omitted for brevity
- Vote counts indicate valuable/controversial messages`);

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
