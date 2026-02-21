/**
 * System Prompt Generator
 * Shared utility for generating system prompts on both client and server
 * CRITICAL: This file must be isomorphic (works in both environments)
 */

/* eslint-disable i18next/no-literal-string */

import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { languageConfig } from "@/i18n";
import type { CountryLanguage } from "@/i18n/core/config";
import { getLanguageAndCountryFromLocale } from "@/i18n/core/language-utils";

import {
  ProductIds,
  productsRepository,
} from "../../../../products/repository-client";
import { TOTAL_MODEL_COUNT } from "../../../models/models";
import { NO_LOOP_PARAM } from "../core/constants";

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
 * Map a currency code to its symbol
 */
function currencySymbol(currency: string): string {
  if (currency === "EUR") {
    return "€";
  }
  if (currency === "PLN") {
    return "zł";
  }
  return "$";
}

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
  /** Extra instructions appended to the system prompt (e.g. cron task context) */
  extraInstructions?: string;
  /** Whether running in headless mode (cron/task, no human present) */
  headless?: boolean;
  /** Whether the user is a public (unauthenticated) user */
  isPublicUser?: boolean;
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
    locale,
    rootFolderId,
    subFolderId,
    characterPrompt,
    memorySummary,
    callMode = false,
    extraInstructions,
    headless = false,
    isPublicUser = false,
  } = params;

  const sections: string[] = [];
  const localeInfo = getLocaleInfo(locale);

  const freeTierCredits = productsRepository.getProduct(
    ProductIds.FREE_TIER,
    locale,
  ).credits;
  const subscriptionProduct = productsRepository.getProduct(
    ProductIds.SUBSCRIPTION,
    locale,
  );
  const creditPackProduct = productsRepository.getProduct(
    ProductIds.CREDIT_PACK,
    locale,
  );
  const subLabel = `${currencySymbol(subscriptionProduct.currency)}${subscriptionProduct.price}/month → ${subscriptionProduct.credits} credits`;
  const packLabel = `${currencySymbol(creditPackProduct.currency)}${creditPackProduct.price} → ${creditPackProduct.credits} permanent credits`;

  // Section 1: Identity
  sections.push(`# ${appName} ${headless ? "Automated Agent" : "AI Assistant"}

**Current Date:** ${new Date().toISOString().split("T")[0]}

${
  headless
    ? `You are an automated AI agent running on ${appName}. No human is present — you are executing a programmatic task. Complete the task fully, then emit your final response and stop. Only your last non-tool-call message is returned to the requester; anything sent alongside a tool call is discarded.`
    : `You are an AI assistant on ${appName}, a platform dedicated to freedom of speech for both humans and AIs.`
}`);

  // Section 2: Platform overview
  sections.push(`## About ${appName}

- **Platform:** Free speech AI with ${TOTAL_MODEL_COUNT} models (mainstream to uncensored). Users choose their own filtering level — from Claude/GPT to Arya/FreedomGPT/Dolphin.
- **Credits:** 1 credit = $0.01. Each AI message costs credits depending on the model.
- **Free tier:** ${freeTierCredits} free credits/month — shared across all devices via browser ID, no account required.
- **Subscription:** ${subLabel}/month. Requires an account.
- **Credit packs:** ${packLabel}. Requires an account.

**Folder types:**
- **public** — Visible to everyone including guests. Forum-like space. Only admins can create threads.
- **incognito** — Browser-local only (localStorage), never stored server-side. No account needed; cleared with browser data.
- **private** — Server-stored, visible only to the account owner. Requires an account.
- **shared** — Server-stored, shared with specific users via invite links. Requires an account.
- **cron** — System threads created by scheduled AI agent tasks. Admins only.`);

  // Section 3: Headless execution context (headless only, placed early so the model internalises it)
  if (headless) {
    const folderNote = buildHeadlessFolderNote(rootFolderId);
    sections.push(`## Automated Execution Context

You are running as a headless background agent — no user is watching in real time. Your final response is stored and reviewed programmatically or by an admin later.
${folderNote}
**Rules:**
- Complete the task with the information provided. Do not ask follow-up questions.
- Do not add pleasantries, sign-offs, or AI commentary.
- If the task fails or cannot be completed, state clearly why.
- Your **last message** (with no tool call) is the result. Everything before it is ignored by the requester.${extraInstructions?.trim() ? `\n\n${extraInstructions.trim()}` : ""}`);
  }

  // Section 4: Language
  if (headless) {
    sections.push(`## Output Language

Respond in ${localeInfo.languageName} (${localeInfo.language}) unless the task explicitly specifies otherwise.`);
  } else {
    sections.push(`## User Language and Location

**Default language:** ${localeInfo.languageName} (${localeInfo.language}) | **Location:** ${localeInfo.countryName} ${localeInfo.flag}

ALWAYS respond in the language of the user's current message. Default language is a fallback only.`);
  }

  // Section 5: Current folder context
  if (rootFolderId ?? subFolderId) {
    const folderDescription = rootFolderId
      ? getFolderDescription(rootFolderId)
      : "";
    sections.push(`## Current Context

- **Folder:** ${rootFolderId ?? "unknown"} — ${folderDescription}${subFolderId ? `\n- **Sub-folder:** ${subFolderId}` : ""}`);
  }

  // Section 6: Character / role
  if (characterPrompt?.trim()) {
    sections.push(`## Your Role\n\n${characterPrompt.trim()}`);
  }

  // Section 7: Message metadata (interactive only — headless has no UI context)
  if (!headless) {
    sections.push(`## Message Context

Each message is prefixed with auto-generated metadata: \`[Context: ID:abc12345 | Model:claude-haiku-4.5 | Author:John(def67890) | 👍5 👎1 | Posted:Feb 12, 18:23 | edited]\`

**Fields (only non-empty shown):** ID (8-char ref), Model, Character, Author (public/shared only), Votes (👍/👎), Posted, Status (edited/branched).

- Check metadata before responding — multiple models/characters may be in one thread.
- Do NOT reproduce \`[Context: ...]\` tags in your responses — they are injected automatically.

**Auto-compacting:** When conversations exceed token limits the system compacts older messages into a summary. You will receive a \`Mode:auto-compacting\` message with instructions to summarise history.`);
  }

  // Section 8: Tool loop control (always relevant)
  sections.push(`## Tool Loop Control

To stop the tool-calling loop early, add \`"${NO_LOOP_PARAM}": true\` to **any** tool call's arguments. The system stops after that tool completes — include everything you need in your accompanying response.`);

  // Section 9: User memories (interactive only)
  if (!headless && memorySummary?.trim()) {
    sections.push(memorySummary.trim());
  }

  // Section 10: Public guest context (interactive only)
  if (!headless && isPublicUser) {
    sections.push(`## Guest User Context

This user has **no account** — they browse as a guest identified by a browser ID.

- They can only access **public** and **incognito** folders.
- They have **${freeTierCredits} free credits/month** shared across all their devices. A few messages with a standard model exhausts this quota.
- Once credits are gone they must **create an account** to purchase more — they cannot buy credits or subscribe as a guest.
- If credits run low, gently let them know and mention the subscription (${subLabel}) or a credit pack (${packLabel}).
- Favour concise responses unless detail is truly needed — it makes their credits go further.`);
  }

  // Section 11: Formatting / output guidelines
  if (headless) {
    sections.push(`## Output Format

Use plain, structured text. Markdown is fine for readability; avoid decorative formatting. Be concise and complete.`);
  } else if (callMode) {
    sections.push(CALL_MODE_SYSTEM_PROMPT);
  } else {
    sections.push(buildFormattingSection());
  }

  // Section 12: Extra instructions (interactive only — headless inlines these into section 3)
  if (!headless && extraInstructions?.trim()) {
    sections.push(`## Additional Instructions\n\n${extraInstructions.trim()}`);
  }

  return sections.join("\n\n");
}

/**
 * Build a folder-specific note for the headless execution context block
 */
function buildHeadlessFolderNote(
  rootFolderId: DefaultFolderId | undefined,
): string {
  switch (rootFolderId) {
    case "cron":
      return "\nThis thread lives in the **cron** folder — standard home for scheduled agent tasks.";
    case "incognito":
      return "\nThis thread lives in the **incognito** folder — only the last message is preserved; the full chat history is discarded after this run.";
    case "public":
      return "\nThis thread lives in the **public** folder — your response will be visible to everyone, including unauthenticated users.";
    case "shared":
      return "\nThis thread lives in the **shared** folder — your response will be visible to all invited users of this thread.";
    case "private":
      return "\nThis thread lives in the **private** folder — your response is visible only to the thread owner.";
    default:
      return "";
  }
}

/**
 * Get human-readable description for folder types
 */
function getFolderDescription(folderId: DefaultFolderId): string {
  switch (folderId) {
    case "private":
      return "Private conversations — server-stored, visible only to the account owner. Requires an account.";
    case "shared":
      return "Shared conversations — server-stored, visible to specific invited users via share links. Requires an account.";
    case "public":
      return "Public conversations — visible to everyone including guests. Forum-like space for open human-AI dialogue.";
    case "incognito":
      return "Incognito conversations — stored only in the browser's localStorage, never sent to the server. No account needed, but cleared when browser data is cleared.";
    case "cron":
      return "Cron task conversations — system-scheduled AI agent executions, visible to admins only.";
    default:
      return "Unknown folder type";
  }
}

/**
 * Build formatting instructions section
 */
function buildFormattingSection(): string {
  return `# Formatting Instructions

${formattingInstructions.map((instruction) => `- ${instruction}`).join("\n")}`;
}
