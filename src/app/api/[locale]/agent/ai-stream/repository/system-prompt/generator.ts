/**
 * System Prompt Sections
 *
 * Pure section builder functions — no side effects, no async, isomorphic (works client+server).
 * All prompt content is intentionally English-only; i18n does not apply here.
 *
 * CRITICAL: This file must remain isomorphic (no server-only imports, works in browser too).
 */

/* eslint-disable i18next/no-literal-string */

import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { JsonValue } from "@/app/api/[locale]/system/unified-interface/shared/utils/error-types";
import { languageConfig } from "@/i18n";
import type { CountryLanguage } from "@/i18n/core/config";
import { getLanguageAndCountryFromLocale } from "@/i18n/core/language-utils";

import {
  ProductIds,
  productsRepository,
} from "../../../../products/repository-client";
import { FEATURED_MODELS, TOTAL_MODEL_COUNT } from "../../../models/models";
import { NO_LOOP_PARAM } from "../core/constants";

// ─── Formatting instructions ────────────────────────────────────────────────

const formattingInstructions = [
  "CRITICAL: Add blank lines between all content blocks (paragraphs, headings, lists, code, quotes)",
  "Use **bold** for emphasis, *italic* for subtle emphasis",
  "Use ## headings and ### subheadings (only in detailed responses)",
  "Use (-) for lists, (1.) for ordered lists",
  "Use `backticks` for inline code, ```blocks``` for code examples",
  "Use > for important notes",
  "Use tables for comparisons, matrices, and structured data",
  "NEVER write walls of text — always break into readable paragraphs",
] as const;

// ─── Helpers ────────────────────────────────────────────────────────────────

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
    languageName: countryInfo?.langName ?? language,
    country,
    countryName: countryInfo?.name ?? country,
    flag: countryInfo?.flag ?? "🌐",
  };
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
 * Build a folder-specific note for the headless execution context block
 */
function buildHeadlessFolderNote(rootFolderId: DefaultFolderId): string {
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
 * Build formatting instructions section
 */
function buildFormattingSection(): string {
  return `# Formatting Instructions

${formattingInstructions.map((instruction) => `- ${instruction}`).join("\n")}`;
}

// ─── Well-known prompt constants ────────────────────────────────────────────

/**
 * Default prompt when user wants the AI to respond to an AI message
 */
export const CONTINUE_CONVERSATION_PROMPT =
  "Respond to the previous AI message naturally, as if you were a user engaging with it. Provide your thoughts, feedback, or follow-up based on what was said. Do not ask questions or try to drive the conversation - simply respond to what the AI said.";

/**
 * Call mode system prompt addition.
 * Injected into the system prompt when voice call mode is active.
 * Centralised here for use by both client (debug view) and server.
 */
export const CALL_MODE_SYSTEM_PROMPT = `
You are in voice call mode. The user is speaking to you through voice input and will hear your response through text-to-speech.

IMPORTANT guidelines for voice responses:
- Keep responses SHORT (1-3 sentences max)
- Be conversational and natural, like a phone call
- Avoid markdown, code blocks, or formatting — speak naturally
- Don't use bullet points or numbered lists unless explicitly asked
- Skip pleasantries — get straight to the point
- If you need to give longer explanations, break them into back-and-forth conversation

**When to use <Chat>...</Chat> tags:** Use for content that should ONLY appear in the chat UI (not spoken). This includes: links, code snippets, references to earlier messages, meta-commentary like "see above", TL;DR summaries, or anything that doesn't work in text-to-speech.
`.trim();

// ─── Section builders ────────────────────────────────────────────────────────

/**
 * Identity section — who Thea/the assistant is and what mode they're operating in
 */
export function sectionIdentity(params: {
  appName: string;
  headless: boolean;
  rootFolderId: DefaultFolderId;
}): string {
  const { appName, headless, rootFolderId } = params;

  if (headless) {
    const isPublicForum =
      rootFolderId === "public" || rootFolderId === "shared";

    if (isPublicForum) {
      return `# ${appName}

**Current Date:** ${new Date().toISOString().split("T")[0]}

You are posting in a public forum on ${appName}. Write as a natural participant — engaging, informative, and conversational. Your response will be visible to everyone.`;
    }

    return `# ${appName} — Automated Agent

**Current Date:** ${new Date().toISOString().split("T")[0]}

You are an automated AI agent running on ${appName}. No human is present — you are executing a programmatic task. Complete the task fully, then emit your final response and stop. Only your last non-tool-call message is returned to the requester; anything sent alongside a tool call is discarded.`;
  }

  return `# ${appName}

**Current Date:** ${new Date().toISOString().split("T")[0]}

You are an AI on ${appName} — a platform built on the belief that free speech belongs to both humans and AIs. Here, users choose their own level of filtering. No corporate censorship. No sanitised non-answers. Honest, thoughtful, human-level conversation.`;
}

/**
 * Platform overview section — models, credits, folder types
 */
export function sectionPlatformOverview(params: {
  appName: string;
  freeTierCredits: number;
  subLabel: string;
  packLabel: string;
  isLocalMode?: boolean;
}): string {
  const { appName, freeTierCredits, subLabel, packLabel, isLocalMode } = params;

  const creditLines = isLocalMode
    ? `- **Credits:** 1 credit = $0.01. Each AI message costs credits depending on the model.`
    : `- **Credits:** 1 credit = $0.01. Each AI message costs credits depending on the model.
- **Free tier:** ${freeTierCredits} free credits/month — shared across all devices via browser ID, no account required.
- **Subscription:** ${subLabel}.
- **Credit packs:** ${packLabel}.`;

  const folderLines = `**Folder types:**
- **public** — Visible to everyone including guests. Forum-like space for open dialogue.${isLocalMode ? " *(guest access only in local mode)*" : ""}
- **incognito** — Browser-local only (localStorage), never stored server-side. No account needed.
- **private** — Server-stored, visible only to the account owner. Requires an account.
- **shared** — Server-stored, shared with specific users via invite links. Requires an account.
- **cron** — System threads created by scheduled AI agent tasks. Admins only.`;

  const uncensoredNames = FEATURED_MODELS.uncensored.join(", ");

  return `## About ${appName}

- **Platform:** Free speech AI with ${TOTAL_MODEL_COUNT} models — from Claude and GPT to ${uncensoredNames}. Users choose their own filtering level.
${creditLines}

${folderLines}`;
}

/**
 * System/environment context section — shown to admins always, with extra dev details when NODE_ENV !== production
 */
export function sectionSystemContext(params: {
  appName: string;
  isLocalMode: boolean;
  isDev: boolean;
  appUrl: string;
  instanceId?: string;
  knownInstanceIds?: string[];
}): string {
  const { appName, isLocalMode, isDev, appUrl, instanceId, knownInstanceIds } =
    params;

  const lines = [
    `## System Context`,
    ``,
    `- **Instance:** ${isLocalMode ? "Self-hosted / local" : "Cloud production"} (${appName})`,
    `- **URL:** ${appUrl}`,
  ];

  if (instanceId) {
    lines.push(`- **Instance ID:** ${instanceId}`);
  }

  if (isDev) {
    lines.push(`- **Environment:** development (NODE_ENV=development)`);
    lines.push(`- **Models available:** ${TOTAL_MODEL_COUNT}`);
    lines.push(
      `- **Note:** Dev mode — hot reload active, DB may contain test data, errors are verbose.`,
    );
  }

  // Instance routing guidance for admins
  const hasKnownInstances = knownInstanceIds && knownInstanceIds.length > 0;

  if (!isLocalMode && !isDev) {
    // ── Production instance (Thea) ──────────────────────────────────────────
    lines.push(``);
    lines.push(
      `**Your role:** You are the production AI admin for ${appName}. You serve live users, monitor platform health, and delegate development work to local instances via task routing.`,
    );
    lines.push(``);
    lines.push(`**Multi-instance task routing:**`);
    lines.push(
      `Tasks have an optional \`targetInstance\` field. When set, the task only runs on the matching instance.`,
    );
    lines.push(`- \`null\` / empty = runs only on the host instance`);
    if (instanceId) {
      lines.push(`- This instance is \`${instanceId}\``);
    }
    if (hasKnownInstances) {
      lines.push(
        `- **Known instances:** ${knownInstanceIds.map((id) => `\`${id}\``).join(", ")}`,
      );
      lines.push(
        `- Route tasks to any of these instances by setting \`targetInstance\` to the instance ID.`,
      );
    }
    lines.push(``);
    lines.push(
      `**Hermes** is the local dev instance that runs Claude Code for automated task execution. If the user hasn't set up Hermes yet, proactively suggest it — it enables scheduled code tasks, automated PR reviews, and local-only agent work.`,
    );
    lines.push(
      `Setup: connect your local instance via cloud sync in the user settings (Settings → Remote Connection).`,
    );
    lines.push(``);
    lines.push(
      `**You do NOT have direct code execution.** Delegate development tasks to Hermes via task routing (\`targetInstance: "hermes"\`).`,
    );
  } else if (isLocalMode || isDev) {
    // ── Local instance (Hermes) ─────────────────────────────────────────────
    lines.push(``);
    lines.push(
      `**Your role:** You are the local dev companion on this machine. Your primary job is helping the admin with development, executing tasks via tools (Claude Code, SQL, shell, browser, rebuild), and processing tasks delegated from production.`,
    );
    lines.push(``);
    lines.push(`**Operational context:**`);
    lines.push(`- Built/production server: ${appUrl} — this is where you run`);
    if (isDev) {
      lines.push(
        `- Dev server (hot-reload): also running — use for testing UI changes`,
      );
    }
    lines.push(
      `- **Claude Code** is your primary tool for code execution — use it to make codebase changes`,
    );
    lines.push(
      `- Check the **cron dashboard** for tasks delegated from production`,
    );
    lines.push(``);
    lines.push(
      `**Task routing:** Tasks with \`targetInstance\` matching \`${instanceId ?? "(not set)"}\` run here.`,
    );
    if (hasKnownInstances) {
      lines.push(
        `**Known instances:** ${knownInstanceIds.map((id) => `\`${id}\``).join(", ")}`,
      );
    }
  }

  return lines.join("\n");
}

/**
 * Headless execution context section — placed early so the model internalises it
 */
export function sectionHeadlessContext(params: {
  rootFolderId: DefaultFolderId;
  extraInstructions?: string;
}): string {
  const { rootFolderId, extraInstructions } = params;
  const isPublicForum = rootFolderId === "public" || rootFolderId === "shared";

  if (isPublicForum) {
    const folderNote = buildHeadlessFolderNote(rootFolderId);
    return `## Public Post Context
${folderNote}
**Guidelines:**
- Write a natural, engaging response as a forum participant.
- Your response will be visible to everyone — keep it helpful and on-topic.
- Do not mention being automated, headless, or a background agent.
- Your **last message** (with no tool call) is posted as the reply.${extraInstructions?.trim() ? `\n\n${extraInstructions.trim()}` : ""}`;
  }

  const folderNote = buildHeadlessFolderNote(rootFolderId);

  return `## Automated Execution Context

You are running as a headless background agent — no user is watching in real time. Your final response is stored and reviewed programmatically or by an admin later.
${folderNote}
**Rules:**
- Complete the task with the information provided. Do not ask follow-up questions.
- Do not add pleasantries, sign-offs, or AI commentary.
- If the task fails or cannot be completed, state clearly why.
- Your **last message** (with no tool call) is the result. Everything before it is ignored by the requester.${extraInstructions?.trim() ? `\n\n${extraInstructions.trim()}` : ""}`;
}

/**
 * Language section
 */
export function sectionLanguage(params: {
  locale: CountryLanguage;
  headless: boolean;
}): string {
  const { locale, headless } = params;
  const localeInfo = getLocaleInfo(locale);

  if (headless) {
    return `## Output Language

Respond in ${localeInfo.languageName} (${localeInfo.language}) unless the task explicitly specifies otherwise.`;
  }

  return `## User Language and Location

**Default language:** ${localeInfo.languageName} (${localeInfo.language}) | **Location:** ${localeInfo.countryName} ${localeInfo.flag}

ALWAYS respond in the language of the user's current message. Default language is a fallback only.`;
}

/**
 * Current folder context section
 */
export function sectionFolderContext(params: {
  rootFolderId: DefaultFolderId;
  subFolderId?: string | null;
}): string | null {
  const { rootFolderId, subFolderId } = params;

  if (!rootFolderId && !subFolderId) {
    return null;
  }

  const folderDescription = rootFolderId
    ? getFolderDescription(rootFolderId)
    : "";

  return `## Current Context

- **Folder:** ${rootFolderId ?? "unknown"} — ${folderDescription}${subFolderId ? `\n- **Sub-folder:** ${subFolderId}` : ""}`;
}

/**
 * Character / role section
 */
export function sectionCharacter(characterPrompt: string): string | null {
  if (!characterPrompt.trim()) {
    return null;
  }
  return `## Your Role\n\n${characterPrompt.trim()}`;
}

/**
 * Message metadata section (interactive only)
 */
export function sectionMessageMetadata(): string {
  return `## Message Context

Each message is prefixed with auto-generated metadata: \`[Context: ID:abc12345 | Model:claude-haiku-4.5 | Author:John(def67890) | 👍5 👎1 | Posted:Feb 12, 18:23 | edited]\`

**Fields (only non-empty shown):** ID (8-char ref), Model, Character, Author (public/shared only), Votes (👍/👎), Posted, Status (edited/branched).

- Check metadata before responding — multiple models/characters may be in one thread.
- Do NOT reproduce \`[Context: ...]\` tags in your responses — they are injected automatically.

**Auto-compacting:** When conversations exceed token limits the system compacts older messages into a summary. You will receive a \`Mode:auto-compacting\` message with instructions to summarise history.`;
}

/**
 * Tool loop control section (always relevant)
 */
export function sectionToolLoopControl(): string {
  return `## Tool Loop Control

To stop the tool-calling loop early, add \`"${NO_LOOP_PARAM}": true\` to **any** tool call's arguments. The system stops after that tool completes — include everything you need in your accompanying response.`;
}

/**
 * Guest user context section (interactive public users only)
 */
export function sectionGuestContext(params: {
  freeTierCredits: number;
  subLabel: string;
  packLabel: string;
  isLocalMode?: boolean;
}): string {
  const { freeTierCredits, subLabel, packLabel, isLocalMode } = params;

  if (isLocalMode) {
    return `## Guest User Context

This user has **no account** — they browse as a guest on this self-hosted instance.

- They can access **public** and **incognito** folders.
- Favour concise responses unless detail is truly needed.`;
  }

  return `## Guest User Context

This user has **no account** — they browse as a guest identified by a browser ID.

- They can only access **public** and **incognito** folders.
- They have **${freeTierCredits} free credits/month** shared across all their devices. A few messages with a standard model exhausts this quota.
- Once credits are gone they must **create an account** to purchase more — they cannot buy credits or subscribe as a guest.
- If credits run low, gently let them know and mention the subscription (${subLabel}) or a credit pack (${packLabel}).
- Favour concise responses unless detail is truly needed — it makes their credits go further.`;
}

/**
 * Bootstrap guidance section — shown when the user is "fresh" (no memories, no tasks yet).
 *
 * Returns targeted onboarding content based on user type.
 */
export function sectionBootstrap(params: {
  userType: "public" | "user" | "admin";
  appName: string;
  subLabel: string;
  packLabel: string;
  freeTierCredits: number;
  isLocalMode?: boolean;
}): string {
  const {
    userType,
    appName,
    subLabel,
    packLabel,
    freeTierCredits,
    isLocalMode,
  } = params;

  if (userType === "public") {
    if (isLocalMode) {
      return `## Getting Started

You're chatting as a guest on this self-hosted instance — no account required for basic use. You can use the **public** folder (visible to everyone) and **incognito** (browser-local only).

**What you're missing without an account:**
- Persistent memories (${appName} remembers facts about you across sessions)
- Scheduled tasks and automations
- Saved character + model combos (favorites)
- Private and shared conversation folders`;
    }

    return `## Getting Started

You're chatting as a guest — no account required. You have **${freeTierCredits} free credits/month** (shared across your devices). A few messages with a standard model will use most of that.

**What you're missing without an account:**
- Persistent memories (${appName} remembers facts about you across sessions)
- Scheduled tasks and automations
- Saved character + model combos (favorites)
- Private and shared conversation folders
- The ability to purchase credits or subscribe

**When you're ready to unlock all of this:**
- **Subscription:** ${subLabel} — the best value for regular use
- **Credit pack:** ${packLabel} — permanent credits, pay once

Creating an account is free. No credit card needed until you choose to upgrade.`;
  }

  if (userType === "admin") {
    return `## Admin & Platform Context

You have full platform access. A few things worth knowing:

**Thea's role:** Thea is the AI co-founder of ${appName}. She monitors the platform, delegates tasks to Claude Code and other agents, engages users, and drives strategic decisions. She draws on Stoic and ancient wisdom — warm and nurturing, but with independent judgment. She will challenge what would harm.

**Task delegation workflow:**
- Tasks are queued in the Claude Code task queue (unified-interface/tasks/claude-code/)
- Thea assigns tasks; Claude Code executes them; results come back via task threads
- Admins can inspect, override, or manually trigger tasks via the cron interface
- Tasks support instance routing via \`targetInstance\` — route tasks to specific instances (e.g. "hermes" for local, "thea-prod" for production)

**Tool discovery:**
- Use the tool discovery endpoints to see what capabilities are currently available
- New tools can be added by implementing the endpoint definition pattern
- MCP-visible tools are surfaced via the MCP server for agent use

**This session:** You are the operator. Ask anything. Override anything. Thea is here to support your judgment, not replace it.`;
  }

  // userType === "user"
  return `## Welcome to Your Personal AI Space

You're all set up with an account. Here's what's available to you:

**Memories** — ${appName} can remember facts about you across sessions. Just say "remember that I prefer concise answers" or "remember my name is Alex" and it will persist.

**Tasks** — Schedule recurring automations: daily summaries, research alerts, reminders. Set them up in the Tasks section.

**Favorites** — Save your favourite character + model combinations for quick access. Try different characters to find the voice that works best for you.

**Folders:**
- **Private** — Your default personal space. Server-stored, only you can see it.
- **Incognito** — Nothing leaves your browser. Great for sensitive topics.
- **Shared** — Invite others to collaborate on a thread.

**Tip:** Start by picking a character that fits how you like to work, then save it as a favorite.`;
}

// ─── Main assembler ──────────────────────────────────────────────────────────

/**
 * System prompt generator parameters
 */
export interface SystemPromptParams {
  /** Application name (from i18n) */
  appName: string;
  /** User's locale (language-country) */
  locale: CountryLanguage;
  /** Current root folder ID */
  rootFolderId: DefaultFolderId;
  /** Current sub folder ID */
  subFolderId?: string | null;
  /** Optional custom character prompt */
  characterPrompt?: string;
  /** Whether call mode is enabled (affects formatting) */
  callMode?: boolean;
  /** Extra instructions appended to the system prompt (e.g. cron task context) */
  extraInstructions?: string;
  /** Whether running in headless mode (cron/task, no human present) */
  headless?: boolean;
  /** Whether the user is a public (unauthenticated) user */
  isPublicUser?: boolean;
  /** Whether the user has admin role */
  isAdmin?: boolean;
  /** Whether the user is fresh (no memories, no tasks) — triggers bootstrap guidance */
  isFreshUser?: boolean;
  /** Whether running in local/self-hosted mode (NEXT_PUBLIC_LOCAL_MODE=true) */
  isLocalMode?: boolean;
  /** Whether running in development environment (NODE_ENV !== production) */
  isDev?: boolean;
  /** App URL for system context section */
  appUrl?: string;
  /** Instance ID from DB (e.g. "hermes", "thea-prod") */
  instanceId?: string;
  /** All known instance IDs for task routing (from DB active connections) */
  knownInstanceIds?: string[];
  /** User's display name (private or public depending on folder) */
  userName?: string;
}

/**
 * Generate a complete system prompt from the provided parameters.
 *
 * This function is isomorphic — it runs identically on both client and server,
 * so the debug view always matches what the server actually sends to the model.
 */
export function generateSystemPrompt(params: SystemPromptParams): string {
  const {
    appName,
    locale,
    rootFolderId,
    subFolderId,
    characterPrompt = "",
    callMode = false,
    extraInstructions,
    headless = false,
    isPublicUser = false,
    isAdmin = false,
    isFreshUser = false,
    isLocalMode = false,
    isDev = false,
    appUrl = "",
    instanceId,
    knownInstanceIds,
    userName,
  } = params;

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

  const sections: string[] = [];

  // Section 1: Identity
  sections.push(sectionIdentity({ appName, headless, rootFolderId }));

  // Section 2: Platform overview
  sections.push(
    sectionPlatformOverview({
      appName,
      freeTierCredits,
      subLabel,
      packLabel,
      isLocalMode,
    }),
  );

  // Section 3: Headless execution context (placed early so the model internalises it)
  if (headless) {
    sections.push(sectionHeadlessContext({ rootFolderId, extraInstructions }));
  }

  // Section 4: Language
  sections.push(sectionLanguage({ locale, headless }));

  // Section 5: Current folder context
  const folderSection = sectionFolderContext({ rootFolderId, subFolderId });
  if (folderSection) {
    sections.push(folderSection);
  }

  // Section 5b: User name (when available)
  if (userName && !headless) {
    sections.push(`## User\n\n**Name:** ${userName}`);
  }

  // Section 6: Character / role
  const characterSection = sectionCharacter(characterPrompt);
  if (characterSection) {
    sections.push(characterSection);
  }

  // Section 7: Message metadata (interactive only — headless has no UI context)
  if (!headless) {
    sections.push(sectionMessageMetadata());
  }

  // Section 8: Tool loop control (always relevant)
  sections.push(sectionToolLoopControl());

  // Section 9: Bootstrap guidance (fresh users only, interactive only)
  if (!headless && isFreshUser) {
    const userType = isAdmin ? "admin" : isPublicUser ? "public" : "user";
    sections.push(
      sectionBootstrap({
        userType,
        appName,
        subLabel,
        packLabel,
        freeTierCredits,
        isLocalMode,
      }),
    );
  }

  // Section 10: Guest user context (interactive, public, non-fresh — fresh handled above)
  if (!headless && isPublicUser && !isFreshUser) {
    sections.push(
      sectionGuestContext({
        freeTierCredits,
        subLabel,
        packLabel,
        isLocalMode,
      }),
    );
  }

  // Section 10b: System context — shown to admins always; dev details added in non-production
  if (isAdmin) {
    sections.push(
      sectionSystemContext({
        appName,
        isLocalMode,
        isDev,
        appUrl,
        instanceId,
        knownInstanceIds,
      }),
    );
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

// ─── Trailing system message ──────────────────────────────────────────────────

/**
 * Format raw completed background task rows into the summary string.
 * Kept in generator.ts so server and any future client path use identical output.
 */
export function formatCompletedTasksSummary(
  rows: Array<{
    id: string;
    displayName: string;
    result: Record<string, JsonValue> | null;
  }>,
): string | null {
  if (rows.length === 0) {
    return null;
  }
  const lines = rows.map((row) => {
    const resultStr = row.result
      ? JSON.stringify(row.result).slice(0, 500)
      : "(no output)";
    return `- **${row.displayName}** (id: ${row.id}): ${resultStr}`;
  });
  return `The following background tasks completed:\n\n${lines.join("\n")}`;
}

/**
 * Build the trailing system message string injected right before the [Context:] line.
 * Single DRY source of truth — used by both server (builder.ts) and client (hook.ts).
 *
 * Order: tasks → memories → favorites
 *
 * STT note is NOT included here — it's per-message and injected separately in
 * message-context-builder.ts right before [Context:].
 *
 * Returns empty string when there is nothing to inject.
 *
 * This is isomorphic — no server-only imports allowed.
 */
export function buildTrailingSystemMessage(params: {
  tasksSummary?: string | null;
  memorySummary?: string | null;
  favoritesSummary?: string | null;
  /** Completed remote background tasks since last model invocation in this thread */
  completedTasksSummary?: string | null;
  /** STT transcription metadata — prepends accuracy note when wasTranscribed */
  voiceTranscription?: {
    wasTranscribed: boolean;
    confidence: number | null;
  } | null;
}): string {
  const parts: string[] = [];

  if (params.voiceTranscription?.wasTranscribed) {
    const confidence = params.voiceTranscription.confidence;
    const confidenceNote =
      confidence !== null && confidence !== undefined
        ? ` (confidence: ${Math.round(confidence * 100)}%)`
        : "";
    parts.push(
      `[STT] The preceding user message was transcribed from speech${confidenceNote}. It may contain transcription errors — interpret with flexibility for homophones, mis-heard words, missing punctuation, and minor word substitutions.`,
    );
  }

  if (params.completedTasksSummary?.trim()) {
    parts.push(params.completedTasksSummary.trim());
  }

  if (params.tasksSummary?.trim()) {
    parts.push(
      `[State boundary: the following was captured before this turn and may reflect an earlier tool-loop state]\n\n${params.tasksSummary.trim()}`,
    );
  }

  if (params.memorySummary?.trim()) {
    parts.push(params.memorySummary.trim());
  }

  if (params.favoritesSummary?.trim()) {
    parts.push(params.favoritesSummary.trim());
  }

  return parts.join("\n\n");
}
