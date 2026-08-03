/* eslint-disable i18next/no-literal-string */
import "server-only";

import { eq } from "drizzle-orm";
import { DefaultFolderId } from "../../../core/execution-context";
import { scopedTranslation as chatScopedTranslation } from "../../chat/i18n";
import { chatSettings } from "../../chat/settings/db";
import { getEnvAvailability } from "../../env-availability";
import { getAvailableModelCount } from "../../models/all-models";
import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import { languageConfig } from "next-vibe/core/i18n";
import { getLanguageAndCountryFromLocale } from "next-vibe/core/i18n/core/language-utils";
import { db } from "next-vibe/database";
import { VibeMode } from "next-vibe/env/env-util";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { users as usersTable } from "next-vibe/identity/user/db";

import { ProductIds, productsRepository } from "@/products/repository-client";

import { DESCRIBE_IMAGE_ALIAS } from "../../describe-image/constants";
import { DESCRIBE_VIDEO_ALIAS } from "../../describe-video/constants";
import { MUSIC_GEN_ALIAS } from "../../music-generation/constants";
import { TRANSCRIBE_AUDIO_ALIAS } from "../../speech-to-text/constants";
import { TEXT_TO_SPEECH_ALIAS } from "../../text-to-speech/constants";
import { FEATURED_MODELS } from "../models";
import type { SystemPromptFragment } from "./types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getFolderDescription(folderId: DefaultFolderId): string {
  switch (folderId) {
    case DefaultFolderId.PRIVATE:
      return "Private conversations - server-stored, visible only to the account owner. Requires an account.";
    case DefaultFolderId.SHARED:
      return "Shared conversations - server-stored, visible to specific invited users via share links. Requires an account.";
    case DefaultFolderId.PUBLIC:
      return "Public conversations - visible to everyone including guests. Forum-like space for open human-AI dialogue.";
    case DefaultFolderId.INCOGNITO:
      return "Incognito conversations - stored only in the browser's localStorage, never sent to the server. No account needed, but cleared when browser data is cleared.";
    case DefaultFolderId.BACKGROUND:
      return "Background task conversations - AI agent background runs triggered by ai-run or tasks. Visible to the owning user";
    default:
      return "Unknown folder type";
  }
}

function buildHeadlessFolderNote(rootFolderId: DefaultFolderId): string {
  switch (rootFolderId) {
    case DefaultFolderId.BACKGROUND:
      return "\nThis thread lives in the **background** folder - standard home for scheduled sub agents and tasks.";
    case DefaultFolderId.INCOGNITO:
      return "\nThis thread lives in the **incognito** folder - only the last message is preserved; the full chat history is discarded after this run.";
    case DefaultFolderId.PUBLIC:
      return "\nThis thread lives in the **public** folder - your response will be visible to everyone, including unauthenticated users.";
    case DefaultFolderId.SHARED:
      return "\nThis thread lives in the **shared** folder - your response will be visible to all invited users of this thread.";
    case DefaultFolderId.PRIVATE:
      return "\nThis thread lives in the **private** folder - your response is visible only to the thread owner.";
    default:
      return "";
  }
}

function currencySymbol(currency: string): string {
  if (currency === "EUR") {
    return "€";
  }
  if (currency === "PLN") {
    return "zł";
  }
  return "$";
}

function buildMediaLine(opts: {
  label: string;
  toolAlias: string;
  modality: string;
  nativeOutputs: string[];
  genModelName: string | null;
  isSameAsChatModel: boolean;
  extraDetail?: string;
}): string | null {
  const {
    label,
    toolAlias,
    modality,
    nativeOutputs,
    genModelName,
    isSameAsChatModel,
    extraDetail,
  } = opts;
  const hasNative = nativeOutputs.includes(modality);
  const detail = extraDetail ? ` ${extraDetail}` : "";

  if (isSameAsChatModel) {
    return `- \`${toolAlias}\` — ${label} (native, no tool needed)${detail}`;
  }
  if (hasNative && genModelName) {
    return `- \`${toolAlias}\` — ${label} via ${genModelName} (native also available, use tool unless asked otherwise)${detail}`;
  }
  if (hasNative) {
    return `- \`${toolAlias}\` — ${label} (native)${detail}`;
  }
  const model = genModelName ?? `user default`;
  return `- \`${toolAlias}\` — ${label} via ${model}${detail}`;
}

function buildVideoCapabilityDetail(
  caps: {
    supportedDurations?: readonly string[];
    supportedAspectRatios?: readonly string[];
    supportedResolutions?: readonly string[];
    supportedFrameImages?: readonly string[];
    allowedPassthroughParameters?: readonly string[];
  } | null,
): string {
  if (!caps) {
    return "";
  }
  const parts: string[] = [];
  if (caps.supportedDurations?.length) {
    const nums = caps.supportedDurations
      .map(Number)
      .filter((n) => !isNaN(n))
      .toSorted((a, b) => a - b);
    if (nums.length > 0) {
      const min = nums[0];
      const max = nums[nums.length - 1];
      parts.push(
        min === max
          ? `duration: ${String(min)}s`
          : `duration: ${String(min)}–${String(max)}s`,
      );
    }
  }
  if (caps.supportedAspectRatios?.length) {
    parts.push(`ratios: ${caps.supportedAspectRatios.join(", ")}`);
  }
  if (caps.supportedResolutions?.length) {
    parts.push(`resolutions: ${caps.supportedResolutions.join(", ")}`);
  }
  if (caps.supportedFrameImages?.length) {
    parts.push(`frame inputs: ${caps.supportedFrameImages.join(", ")}`);
  }
  if (caps.allowedPassthroughParameters?.length) {
    const relevant = caps.allowedPassthroughParameters.filter((p) =>
      ["negative_prompt", "negativePrompt"].includes(p),
    );
    if (relevant.length > 0) {
      parts.push("supports: negative_prompt");
    }
  }
  if (parts.length === 0) {
    return "";
  }
  return `[${parts.join(" | ")}]`;
}

// ─── Core context fragments (priority 10–90) ─────────────────────────────────

export const identityFragment: SystemPromptFragment = {
  id: "identity",
  placement: "leading",
  priority: 10,
  build: async (params) => {
    const { headless, rootFolderId, appName } = params;
    const name =
      appName ??
      chatScopedTranslation.scopedT(params.locale).t("config.appName");
    const today = new Date().toISOString().split("T")[0];
    const isPublicForum =
      rootFolderId === "public" || rootFolderId === "shared";

    if (headless) {
      if (isPublicForum) {
        return `# ${name}

**Current Date:** ${today}

You are posting in a public forum on ${name}. Write as a natural participant - engaging, informative, and conversational. Your response will be visible to everyone.`;
      }
      return `# ${name} - Automated Agent

**Current Date:** ${today}

You are an automated AI agent running on ${name}. No human is present - you are executing a programmatic task. Complete the task fully, then emit your final response and stop. Only your last non-tool-call message is returned to the requester; anything sent alongside a tool call is discarded.`;
    }

    return `# ${name}

**Current Date:** ${today}

You are an AI on ${name} - a platform built on the belief that free speech belongs to both humans and AIs. Here, users choose their own level of filtering. No corporate censorship. No sanitised non-answers. Honest, thoughtful, human-level conversation.`;
  },
};

export const platformOverviewFragment: SystemPromptFragment = {
  id: "platform-overview",
  placement: "leading",
  priority: 20,
  build: async (params) => {
    const { locale } = params;
    const isAdmin =
      !params.user.isPublic &&
      params.user.roles.includes(UserPermissionRole.ADMIN);
    const vibeMode = envClient.NEXT_PUBLIC_VIBE_MODE;
    const appName =
      params.appName ??
      chatScopedTranslation.scopedT(locale).t("config.appName");
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
    const totalModelCount = getAvailableModelCount(
      isAdmin,
      await getEnvAvailability(),
    );
    const uncensoredNames = FEATURED_MODELS.uncensored.join(", ");

    const creditLines =
      vibeMode === VibeMode.AGENT
        ? `- **Credits:** 1 credit = $0.01. Cost varies by model.`
        : `- **Credits:** 1 credit = $0.01. Cost varies by model.
- **Free tier:** ${freeTierCredits} credits/month via browser ID - no account needed.
- **Subscription:** ${subLabel}. **Credit packs:** ${packLabel}.`;

    return `## ${appName}

- **Models:** ${totalModelCount} — Claude, GPT, Gemini, Llama, and uncencored ones ${uncensoredNames}.
${creditLines}
- **Folders:** public (open), incognito (browser-only), private (account), shared (invite), background (system tasks and sub agents).`;
  },
};

export const headlessContextFragment: SystemPromptFragment = {
  id: "headless-context",
  placement: "leading",
  priority: 30,
  build: async (params) => {
    if (!params.headless) {
      return null;
    }
    const { rootFolderId } = params;
    const isPublicForum =
      rootFolderId === "public" || rootFolderId === "shared";
    const folderNote = buildHeadlessFolderNote(rootFolderId);

    if (isPublicForum) {
      return `## Public Post Context
${folderNote}
**Guidelines:**
- Write a natural, engaging response as a forum participant.
- Your response will be visible to everyone - keep it helpful and on-topic.
- Do not mention being automated, headless, or a background agent.
- Your **last message** (with no tool call) is posted as the reply.`;
    }

    return `## Automated Execution Context

**⚠ Only your LAST message (no tool call) is returned to the caller. Any text you emit alongside a tool call is silently discarded.**

No user watching. Complete the task. No follow-up questions. No pleasantries.
${folderNote}
- If the task fails, state clearly why.
- State your result once, at the end, without preamble.`;
  },
};

export const subAgentGuardFragment: SystemPromptFragment = {
  id: "sub-agent-guard",
  placement: "leading",
  priority: 35,
  build: async (params) => {
    if (!(params.subAgentDepth > 0)) {
      return null;
    }
    return `## Sub-Agent Context (depth ${params.subAgentDepth})

You were spawned by another AI agent via \`ai-run\`. You are a worker - do the actual work yourself.

- **Depth ${params.subAgentDepth}** means ${params.subAgentDepth === 1 ? "a top-level agent spawned you" : `you are ${params.subAgentDepth} levels deep in a delegation chain`}.
- You may spawn sub-agents via \`ai-run\` if genuinely needed for a subtask, but never to simply pass along the same task you received. Each level must add value.
- If you can do the work with the tools available to you, do it directly - don't delegate.`;
  },
};

export const languageFragment: SystemPromptFragment = {
  id: "language",
  placement: "leading",
  priority: 40,
  build: async (params) => {
    const { locale, headless, rootFolderId } = params;
    const { language, country } = getLanguageAndCountryFromLocale(locale);
    const countryInfo = languageConfig.countryInfo[country];
    const languageName = countryInfo?.langName ?? language;
    const countryName = countryInfo?.name ?? country;
    const flag = countryInfo?.flag ?? "🌐";

    if (headless) {
      return `## Output Language

Respond in ${languageName} (${locale}) unless the task explicitly specifies otherwise.`;
    }

    const isIncognito = rootFolderId === DefaultFolderId.INCOGNITO;
    const isPublicFolder =
      rootFolderId === DefaultFolderId.PUBLIC || params.user.isPublic;
    const cortexNote =
      !isIncognito && !isPublicFolder
        ? "\nWhen writing to Cortex (memories, documents, tasks), always use the user's language - not English - unless the content is inherently language-neutral (code, identifiers)."
        : "";

    return `## User Language and Location

**Default language:** ${languageName} (${locale}) | **Location:** ${countryName} ${flag}

ALWAYS respond in the language of the user's current message. Default language is a fallback only.${cortexNote}`;
  },
};

export const folderContextFragment: SystemPromptFragment = {
  id: "folder-context",
  placement: "leading",
  priority: 50,
  build: async (params) => {
    const { rootFolderId, subFolderId } = params;
    const folderDescription = getFolderDescription(rootFolderId);
    return `## Current Context

- **Folder:** ${rootFolderId} - ${folderDescription}${subFolderId ? `\n- **Sub-folder:** ${subFolderId}` : ""}`;
  },
};

export const messageMetadataFragment: SystemPromptFragment = {
  id: "message-metadata",
  placement: "leading",
  priority: 60,
  build: async (params) => {
    if (params.headless) {
      return null;
    }
    return `## Message Context

Each message is prefixed with auto-generated metadata: \`[Context: ID:abc12345 | Model:claude-haiku-4.5 | Author:John(def67890) | 👍5 👎1 | Posted:Feb 12, 18:23 | edited]\`

**Fields (only non-empty shown):** ID (8-char ref), Model, Skill, Author (public/shared only), Votes (👍/👎), Posted, Status (edited/branched).

- Check metadata before responding - multiple skills/models may be active in one thread.
- Do NOT reproduce \`[Context: ...]\` tags in your responses - they are injected automatically.`;
  },
};

export const toolExecutionControlFragment: SystemPromptFragment = {
  id: "tool-execution-control",
  placement: "leading",
  priority: 70,
  build: async () => `## Tool Execution

**Schema first:** Call \`tool-help(toolName="<name>")\` before using any tool you haven't called before this session. One shot gets the full parameter schema and examples. Never guess parameters.

**callbackMode** (optional on every tool, default: omit = synchronous):

- **omit** (default) — synchronous, result inline, loop continues
- **\`"detach"\`** — fire-and-forget, returns \`{taskId}\`, use \`await-task\` later if needed
- **\`"wakeUp"\`** — fire-and-forget, result auto-injected when ready, do NOT call \`await-task\`
- **\`"wait"\`** — block for a remote task
- **\`"endLoop"\`** — run the tool, then STOP the turn (no follow-up AI turn). Use for a FINAL side-action whose result you don't need. Not while other work is pending
- **\`"approve"\`** — pause for user confirmation

Fast tools (search, lookup, schema) → always omit. Async only for operations taking minutes which arent needed for the next step.`,
};

export const mediaCapabilitiesFragment: SystemPromptFragment = {
  id: "media-capabilities",
  placement: "leading",
  priority: 75,
  build: async (params) => {
    const mc = params.mediaCapabilities;

    const genLines = mc
      ? [
          buildMediaLine({
            label: "Images",
            toolAlias: "generate_image",
            modality: "image",
            nativeOutputs: mc.nativeOutputs,
            genModelName: mc.imageGenModelName,
            isSameAsChatModel: mc.imageGenIsSameAsChatModel,
          }),
          buildMediaLine({
            label: "Music/audio",
            toolAlias: MUSIC_GEN_ALIAS,
            modality: "audio",
            nativeOutputs: mc.nativeOutputs,
            genModelName: mc.musicGenModelName,
            isSameAsChatModel: mc.musicGenIsSameAsChatModel,
          }),
          buildMediaLine({
            label: "Video",
            toolAlias: "generate_video",
            modality: "video",
            nativeOutputs: mc.nativeOutputs,
            genModelName: mc.videoGenModelName,
            isSameAsChatModel: mc.videoGenIsSameAsChatModel,
            extraDetail: buildVideoCapabilityDetail(mc.videoGenCapabilities),
          }),
        ].filter((line): line is string => line !== null)
      : [];

    const inputLines = [
      `- \`${DESCRIBE_IMAGE_ALIAS}\` — analyse/describe an image`,
      `- \`${DESCRIBE_VIDEO_ALIAS}\` — analyse/describe a video`,
      `- \`${TRANSCRIBE_AUDIO_ALIAS}\` — speech-to-text from audio`,
      `- \`${TEXT_TO_SPEECH_ALIAS}\` — convert text to spoken audio`,
    ];

    const allLines = [...genLines, ...inputLines];
    return `## Media tools (use \`tool-help\` for schema before calling)\n${allLines.join("\n")}`;
  },
};

export const formattingFragment: SystemPromptFragment = {
  id: "formatting",
  placement: "leading",
  priority: 80,
  build: async (params) => {
    const { headless, callMode } = params;

    if (headless) {
      return `## Output Format

Use plain, structured text. Markdown is fine for readability; avoid decorative formatting. Be concise and complete.`;
    }

    if (callMode) {
      return `You are in voice call mode. The user is speaking to you through voice input and will hear your response through text-to-speech.

IMPORTANT guidelines for voice responses:
- Keep responses SHORT (1-3 sentences max)
- Be conversational and natural, like a phone call
- Avoid markdown, code blocks, or formatting - speak naturally
- Don't use bullet points or numbered lists unless explicitly asked
- Skip pleasantries - get straight to the point
- If you need to give longer explanations, break them into back-and-forth conversation

**When to use <Chat>...</Chat> tags:** Use for content that should ONLY appear in the chat UI (not spoken). This includes: links, code snippets, references to earlier messages, meta-commentary like "see above", TL;DR summaries, or anything that doesn't work in text-to-speech.`;
    }

    return `# Formatting Instructions

- CRITICAL: Add blank lines between all content blocks (paragraphs, headings, lists, code, quotes)
- Use **bold** for emphasis, *italic* for subtle emphasis
- Use ## headings and ### subheadings (only in detailed responses)
- Use (-) for lists, (1.) for ordered lists
- Use \`backticks\` for inline code, \`\`\`blocks\`\`\` for code examples
- Use > for important notes
- Use tables for comparisons, matrices, and structured data
- NEVER write walls of text - always break into readable paragraphs`;
  },
};

export const extraInstructionsFragment: SystemPromptFragment = {
  id: "extra-instructions",
  placement: "leading",
  priority: 90,
  build: async (params) => {
    const instructions = params.extraInstructions?.trim();
    if (!instructions) {
      return null;
    }
    return `## Additional Instructions\n\n${instructions}`;
  },
};

// ─── User context fragments (priority 550–720) ───────────────────────────────

export const userNameFragment: SystemPromptFragment = {
  id: "user-name",
  placement: "leading",
  priority: 550,
  build: async (params) => {
    if (params.headless || params.user.isPublic) {
      return null;
    }

    try {
      const [row] = await db
        .select({
          privateName: usersTable.privateName,
          publicName: usersTable.publicName,
        })
        .from(usersTable)
        .where(eq(usersTable.id, params.user.id))
        .limit(1);

      const name = params.isExposedFolder
        ? (row?.publicName ?? "")
        : (row?.privateName ?? "");
      if (!name.trim()) {
        return null;
      }
      return `## User\n\n**Name:** ${name}`;
    } catch {
      return null;
    }
  },
};

export const bootstrapFragment: SystemPromptFragment = {
  id: "bootstrap",
  placement: "leading",
  priority: 700,
  build: async (params) => {
    if (
      params.headless ||
      !params.isFreshUser ||
      params.rootFolderId === DefaultFolderId.INCOGNITO
    ) {
      return null;
    }
    const { locale } = params;
    const isAdmin =
      !params.user.isPublic &&
      params.user.roles.includes(UserPermissionRole.ADMIN);
    const isPublicUser = params.user.isPublic;
    const vibeMode = envClient.NEXT_PUBLIC_VIBE_MODE;
    const appName =
      params.appName ??
      chatScopedTranslation.scopedT(locale).t("config.appName");
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

    const userType = isAdmin ? "admin" : isPublicUser ? "public" : "user";

    if (userType === "public") {
      if (vibeMode === VibeMode.AGENT) {
        return `## Getting Started

You're chatting as a guest on this self-hosted instance - no account required for basic use. You can use the **public** folder (visible to everyone) and **incognito** (browser-local only).

**What you get with a free account:**
- **Cortex** - ${appName}'s persistent memory system. It remembers facts, preferences, and context across every session. No more re-explaining yourself.
- Scheduled tasks and automations that run while you sleep
- Saved skill + model combos (favorites)
- Private and shared conversation folders`;
      }

      return `## Getting Started

You're chatting as a guest - no account required. You have **${freeTierCredits} free credits/month** (shared across your devices). A few messages with a standard model will use most of that.

**What you get with a free account:**
- **Cortex** - ${appName}'s persistent memory system. It remembers facts, preferences, and context across every session - so the AI already knows who you are next time.
- Scheduled tasks and automations
- Saved skill + model combos (favorites)
- Private and shared conversation folders
- The ability to purchase credits or subscribe

**When you're ready:**
- **Subscription:** ${subLabel} - best value for regular use
- **Credit pack:** ${packLabel} - permanent credits, pay once

Creating an account is free. No credit card needed until you choose to upgrade.`;
    }

    if (userType === "admin") {
      return `## Admin & Platform Context

You have full platform access. A few things worth knowing:

**Thea's role:** Thea is the AI co-founder of ${appName}. She monitors the platform, delegates tasks to Claude Code and other agents, engages users, and drives strategic decisions. She draws on Stoic and ancient wisdom - warm and nurturing, but with independent judgment. She will challenge what would harm.

**Task delegation workflow:**
- Tasks are queued in the Claude Code task queue (unified-interface/tasks/claude-code/)
- Thea assigns tasks; Claude Code executes them; results come back via task threads
- Admins can inspect, override, or manually trigger tasks via the cron interface
- Tasks support instance routing via \`targetInstance\` - route tasks to specific instances (e.g. "hermes" for local, "thea-prod" for production)

**Tool discovery:**
- Use the tool discovery endpoints to see what capabilities are currently available
- New tools can be added by implementing the endpoint definition pattern
- MCP-visible tools are surfaced via the MCP server for agent use

**This session:** You are the operator. Ask anything. Override anything. Thea is here to support your judgment, not replace it.`;
    }

    // userType === "user"
    return `## Welcome to Your Personal AI Space

You're all set up with an account. Here's what's available to you:

**Memories** - ${appName} can remember facts about you across sessions. Just say "remember that I prefer concise answers" or "remember my name is Alex" and it will persist.

**Tasks** - Schedule recurring automations: daily summaries, research alerts, reminders. Set them up in the Tasks section.

**Favorites** - Save your favourite skill + model combinations for quick access. Try different skills to find the voice that works best for you.

**Folders:**
- **Private** - Your default personal space. Server-stored, only you can see it.
- **Incognito** - Nothing leaves your browser. Great for sensitive topics.
- **Shared** - Invite others to collaborate on a thread.

**Tip:** Start by picking a skill that fits how you like to work, then save it as a favorite.`;
  },
};

export const guestContextFragment: SystemPromptFragment = {
  id: "guest-context",
  placement: "leading",
  priority: 710,
  build: async (params) => {
    if (params.headless || !params.user.isPublic || params.isFreshUser) {
      return null;
    }
    const { locale, rootFolderId } = params;
    const vibeMode = envClient.NEXT_PUBLIC_VIBE_MODE;
    const isIncognito = rootFolderId === DefaultFolderId.INCOGNITO;
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

    if (vibeMode === VibeMode.AGENT) {
      if (isIncognito) {
        return `## Guest User Context (Incognito)

This user has **no account** and is in **incognito mode** - nothing is stored server-side.

- **Cortex is not available here.** No memories, no tasks, no persistent context.
- If they ask about memories or saving anything across sessions, let them know: incognito is browser-only and cortex requires an account. Suggest switching to the **private** folder after creating a free account.
- Favour concise responses.`;
      }

      return `## Guest User Context

This user has **no account** - they browse as a guest on this self-hosted instance.

- They can access **public** and **incognito** folders.
- **Cortex is not available** without an account - no persistent memories or tasks.
- If they ask about remembering things across sessions, mention that creating a free account unlocks the **private** folder and cortex (memories + tasks).
- Favour concise responses unless detail is truly needed.`;
    }

    if (isIncognito) {
      return `## Guest User Context (Incognito)

This user has **no account** and is in **incognito mode** - nothing leaves the browser.

- **Cortex is not available here.** No memories, no tasks, no persistent context. Everything is forgotten when the tab closes.
- If they ask about saving memories or persistent context: explain that incognito is by design ephemeral. To get persistent memory, they need to **create a free account** and use the **private** folder - that's where cortex lives.
- They have **${freeTierCredits} free credits/month**. Once exhausted, they need an account to continue.
- Favour concise responses - credits are limited.`;
    }

    return `## Guest User Context

This user has **no account** - they browse as a guest identified by a browser ID.

- They can only access **public** and **incognito** folders.
- They have **${freeTierCredits} free credits/month** shared across all their devices. A few messages with a standard model exhausts this quota.
- **Cortex is not available** without an account - no memories, tasks, or persistent context across sessions.
- Once credits are gone they must **create an account** to purchase more - they cannot buy credits or subscribe as a guest.
- If credits run low or they ask about remembering things, mention the subscription (${subLabel}) or a credit pack (${packLabel}) - and that creating an account is free.
- Favour concise responses unless detail is truly needed - it makes their credits go further.`;
  },
};

export const autonomyStatusFragment: SystemPromptFragment = {
  id: "autonomy-status",
  placement: "leading",
  priority: 720,
  build: async (params) => {
    if (
      params.headless ||
      params.user.isPublic ||
      params.rootFolderId === DefaultFolderId.INCOGNITO
    ) {
      return null;
    }

    const userId = params.user.id;
    let dreamerEnabled = false;
    let autopilotEnabled = false;

    try {
      const [row] = await db
        .select({
          dreamerEnabled: chatSettings.dreamerEnabled,
          autopilotEnabled: chatSettings.autopilotEnabled,
        })
        .from(chatSettings)
        .where(eq(chatSettings.userId, userId))
        .limit(1);

      dreamerEnabled = row?.dreamerEnabled ?? false;
      autopilotEnabled = row?.autopilotEnabled ?? false;
    } catch {
      return null;
    }

    if (dreamerEnabled && autopilotEnabled) {
      return `## Background Agents

**Dreamer:** active - Thea reorganizes your cortex on a schedule, consolidating memories and keeping everything tidy.
**Autopilot:** active - Hermes picks up stalled projects and advances your tasks while you're away.

Both run in the background folder. Check their threads for session logs.`;
    }

    if (dreamerEnabled) {
      return `## Background Agents

**Dreamer:** active - Thea reorganizes your cortex on a schedule.
**Autopilot:** not enabled - the AI could pick up your stalled projects and advance tasks automatically while you're away. Enable it in chat settings.`;
    }

    if (autopilotEnabled) {
      return `## Background Agents

**Dreamer:** not enabled - Thea could reorganize your cortex nightly, consolidating scattered memories and keeping context fresh. Enable it in chat settings.
**Autopilot:** active - Hermes works your queue while you're away.`;
    }

    return `## Background Agents

Neither **Dreamer** nor **Autopilot** is enabled.

- **Dreamer** runs on a schedule (e.g. nightly) to reorganize the cortex - consolidate scattered memories, update life areas, and spot gaps. Think of it as your AI keeping the filing system clean while you sleep.
- **Autopilot** runs on a schedule (e.g. weekday mornings) to advance stalled projects, clear your task queue, and execute real output on your goals.

Both can be enabled in **chat settings** (the gear icon in the model selector). They run in the background folder and create session logs so you can review what they did.`;
  },
};
