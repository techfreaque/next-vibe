/* eslint-disable i18next/no-literal-string */
import type {
  MediaCapabilitiesParams,
  SystemPromptFragment,
} from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";
import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";

// ─── Unified prompt context data ──────────────────────────────────────────────
// All fields loaded by server.ts / client.ts - used across all fragments in this module.

export interface PromptContextData {
  // Core context (from params - no DB)
  appName: string;
  locale: string;
  languageName: string;
  countryName: string;
  flag: string;
  rootFolderId: DefaultFolderId;
  subFolderId: string | null;
  headless: boolean;
  callMode: boolean;
  extraInstructions: string;
  isLocalMode: boolean;
  freeTierCredits: number;
  subLabel: string;
  packLabel: string;
  uncensoredNames: string;
  totalModelCount: number;
  isExposedFolder: boolean;
  // User context (from DB / client state)
  privateName: string;
  publicName: string;
  isPublicUser: boolean;
  isAdmin: boolean;
  /** Computed from DB counts: no memories + no tasks = fresh user */
  isFreshUser: boolean;
  /** Resolved media generation capabilities (image-gen, music-gen, video-gen) */
  mediaCapabilities: MediaCapabilitiesParams | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getFolderDescription(folderId: DefaultFolderId): string {
  switch (folderId) {
    case "private":
      return "Private conversations - server-stored, visible only to the account owner. Requires an account.";
    case "shared":
      return "Shared conversations - server-stored, visible to specific invited users via share links. Requires an account.";
    case "public":
      return "Public conversations - visible to everyone including guests. Forum-like space for open human-AI dialogue.";
    case "incognito":
      return "Incognito conversations - stored only in the browser's localStorage, never sent to the server. No account needed, but cleared when browser data is cleared.";
    case "cron":
      return "Cron task conversations - system-scheduled AI agent executions, visible to admins only.";
    default:
      return "Unknown folder type";
  }
}

function buildHeadlessFolderNote(rootFolderId: DefaultFolderId): string {
  switch (rootFolderId) {
    case "cron":
      return "\nThis thread lives in the **cron** folder - standard home for scheduled agent tasks.";
    case "incognito":
      return "\nThis thread lives in the **incognito** folder - only the last message is preserved; the full chat history is discarded after this run.";
    case "public":
      return "\nThis thread lives in the **public** folder - your response will be visible to everyone, including unauthenticated users.";
    case "shared":
      return "\nThis thread lives in the **shared** folder - your response will be visible to all invited users of this thread.";
    case "private":
      return "\nThis thread lives in the **private** folder - your response is visible only to the thread owner.";
    default:
      return "";
  }
}

// ─── Core context fragments (priority 10–90) ─────────────────────────────────

export const identityFragment: SystemPromptFragment<PromptContextData> = {
  id: "identity",
  placement: "leading",
  priority: 10,
  build: (data) => {
    const { appName, headless, rootFolderId } = data;
    const today = new Date().toISOString().split("T")[0];
    const isPublicForum =
      rootFolderId === "public" || rootFolderId === "shared";

    if (headless) {
      if (isPublicForum) {
        return `# ${appName}

**Current Date:** ${today}

You are posting in a public forum on ${appName}. Write as a natural participant - engaging, informative, and conversational. Your response will be visible to everyone.`;
      }
      return `# ${appName} - Automated Agent

**Current Date:** ${today}

You are an automated AI agent running on ${appName}. No human is present - you are executing a programmatic task. Complete the task fully, then emit your final response and stop. Only your last non-tool-call message is returned to the requester; anything sent alongside a tool call is discarded.`;
    }

    return `# ${appName}

**Current Date:** ${today}

You are an AI on ${appName} - a platform built on the belief that free speech belongs to both humans and AIs. Here, users choose their own level of filtering. No corporate censorship. No sanitised non-answers. Honest, thoughtful, human-level conversation.`;
  },
};

export const platformOverviewFragment: SystemPromptFragment<PromptContextData> =
  {
    id: "platform-overview",
    placement: "leading",
    priority: 20,
    build: (data) => {
      const {
        appName,
        isLocalMode,
        freeTierCredits,
        subLabel,
        packLabel,
        uncensoredNames,
        totalModelCount,
      } = data;

      const creditLines = isLocalMode
        ? `- **Credits:** 1 credit = $0.01. Cost varies by model.`
        : `- **Credits:** 1 credit = $0.01. Cost varies by model.
- **Free tier:** ${freeTierCredits} credits/month via browser ID - no account needed.
- **Subscription:** ${subLabel}. **Credit packs:** ${packLabel}.`;

      return `## About ${appName}

- **Platform:** Free speech AI - ${totalModelCount} models from Claude and GPT to ${uncensoredNames}. Users set their own filtering level.
${creditLines}
- **Folders:** public (open), incognito (browser-only), private (account), shared (invite), cron (system tasks).`;
    },
  };

export const headlessContextFragment: SystemPromptFragment<PromptContextData> =
  {
    id: "headless-context",
    placement: "leading",
    priority: 30,
    condition: (data) => data.headless,
    build: (data) => {
      const { rootFolderId, extraInstructions } = data;
      const isPublicForum =
        rootFolderId === "public" || rootFolderId === "shared";
      const folderNote = buildHeadlessFolderNote(rootFolderId);
      const extra = extraInstructions.trim()
        ? `\n\n${extraInstructions.trim()}`
        : "";

      if (isPublicForum) {
        return `## Public Post Context
${folderNote}
**Guidelines:**
- Write a natural, engaging response as a forum participant.
- Your response will be visible to everyone - keep it helpful and on-topic.
- Do not mention being automated, headless, or a background agent.
- Your **last message** (with no tool call) is posted as the reply.${extra}`;
      }

      return `## Automated Execution Context

You are running as a headless background agent - no user is watching in real time. Your final response is stored and reviewed programmatically or by an admin later.
${folderNote}
**Rules:**
- Complete the task with the information provided. Do not ask follow-up questions.
- Do not add pleasantries, sign-offs, or AI commentary.
- If the task fails or cannot be completed, state clearly why.
- Your **last message** (with no tool call) is the result. Everything before it is ignored by the requester.${extra}`;
    },
  };

export const languageFragment: SystemPromptFragment<PromptContextData> = {
  id: "language",
  placement: "leading",
  priority: 40,
  build: (data) => {
    const { languageName, locale, countryName, flag, headless } = data;

    if (headless) {
      return `## Output Language

Respond in ${languageName} (${locale}) unless the task explicitly specifies otherwise.`;
    }

    return `## User Language and Location

**Default language:** ${languageName} (${locale}) | **Location:** ${countryName} ${flag}

ALWAYS respond in the language of the user's current message. Default language is a fallback only.`;
  },
};

export const folderContextFragment: SystemPromptFragment<PromptContextData> = {
  id: "folder-context",
  placement: "leading",
  priority: 50,
  build: (data) => {
    const { rootFolderId, subFolderId } = data;
    const folderDescription = getFolderDescription(rootFolderId);
    return `## Current Context

- **Folder:** ${rootFolderId} - ${folderDescription}${subFolderId ? `\n- **Sub-folder:** ${subFolderId}` : ""}`;
  },
};

export const messageMetadataFragment: SystemPromptFragment<PromptContextData> =
  {
    id: "message-metadata",
    placement: "leading",
    priority: 60,
    condition: (data) => !data.headless,
    build: () => `## Message Context

Each message is prefixed with auto-generated metadata: \`[Context: ID:abc12345 | Model:claude-haiku-4.5 | Author:John(def67890) | 👍5 👎1 | Posted:Feb 12, 18:23 | edited]\`

**Fields (only non-empty shown):** ID (8-char ref), Model, Skill, Author (public/shared only), Votes (👍/👎), Posted, Status (edited/branched).

- Check metadata before responding - multiple skills/models may be active in one thread.
- Do NOT reproduce \`[Context: ...]\` tags in your responses - they are injected automatically.

**Auto-compacting:** When conversations exceed token limits the system compacts older messages into a summary. You will receive a \`Mode:auto-compacting\` message with instructions to summarise history.`,
  };

export const toolExecutionControlFragment: SystemPromptFragment<PromptContextData> =
  {
    id: "tool-execution-control",
    placement: "leading",
    priority: 70,
    build: () => `## Tool Execution Control

Every tool accepts an optional \`callbackMode\` parameter:

- **\`"detach"\`** - Fire and forget. Returns \`{taskId}\` immediately. Tool runs in background. Use \`wait-for-task\` with that taskId later if you need the result.
- **\`"wakeUp"\`** - Fire and forget. Returns \`{taskId}\` immediately. The result is automatically injected into this thread when ready - the stream revives and you will see the tool result as a new message. Do NOT call wait-for-task for wakeUp.
- **\`"endLoop"\`** - Execute normally, return result, but stop the tool loop. No more tool calls this turn.
- **\`"approve"\`** - Require user confirmation before executing.
- Omit for default synchronous execution.

**\`wait-for-task\`** - Call with a taskId from a detached tool. Stops the stream and blocks until the task completes. The stream resumes automatically with the result - zero extra messages. Never pass callbackMode on wait-for-task.`,
  };

export const formattingFragment: SystemPromptFragment<PromptContextData> = {
  id: "formatting",
  placement: "leading",
  priority: 80,
  build: (data) => {
    const { headless, callMode } = data;

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

export const extraInstructionsFragment: SystemPromptFragment<PromptContextData> =
  {
    id: "extra-instructions",
    placement: "leading",
    priority: 90,
    condition: (data) => !data.headless && !!data.extraInstructions.trim(),
    build: (data) =>
      `## Additional Instructions\n\n${data.extraInstructions.trim()}`,
  };

// ─── User context fragments (priority 550–710) ───────────────────────────────

export const userNameFragment: SystemPromptFragment<PromptContextData> = {
  id: "user-name",
  placement: "leading",
  priority: 550,
  condition: (data) => {
    if (data.headless) {
      return false;
    }
    const name = data.isExposedFolder ? data.publicName : data.privateName;
    return !!name?.trim();
  },
  build: (data) => {
    const name = data.isExposedFolder ? data.publicName : data.privateName;
    if (!name?.trim()) {
      return null;
    }
    return `## User\n\n**Name:** ${name}`;
  },
};

export const bootstrapFragment: SystemPromptFragment<PromptContextData> = {
  id: "bootstrap",
  placement: "leading",
  priority: 700,
  condition: (data) => !data.headless && data.isFreshUser,
  build: (data) => {
    const {
      appName,
      isAdmin,
      isPublicUser,
      isLocalMode,
      freeTierCredits,
      subLabel,
      packLabel,
    } = data;
    const userType = isAdmin ? "admin" : isPublicUser ? "public" : "user";

    if (userType === "public") {
      if (isLocalMode) {
        return `## Getting Started

You're chatting as a guest on this self-hosted instance - no account required for basic use. You can use the **public** folder (visible to everyone) and **incognito** (browser-local only).

**What you're missing without an account:**
- Persistent memories (${appName} remembers facts about you across sessions)
- Scheduled tasks and automations
- Saved skill + model combos (favorites)
- Private and shared conversation folders`;
      }

      return `## Getting Started

You're chatting as a guest - no account required. You have **${freeTierCredits} free credits/month** (shared across your devices). A few messages with a standard model will use most of that.

**What you're missing without an account:**
- Persistent memories (${appName} remembers facts about you across sessions)
- Scheduled tasks and automations
- Saved skill + model combos (favorites)
- Private and shared conversation folders
- The ability to purchase credits or subscribe

**When you're ready to unlock all of this:**
- **Subscription:** ${subLabel} - the best value for regular use
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

export const guestContextFragment: SystemPromptFragment<PromptContextData> = {
  id: "guest-context",
  placement: "leading",
  priority: 710,
  condition: (data) => !data.headless && data.isPublicUser && !data.isFreshUser,
  build: (data) => {
    const { freeTierCredits, subLabel, packLabel, isLocalMode } = data;

    if (isLocalMode) {
      return `## Guest User Context

This user has **no account** - they browse as a guest on this self-hosted instance.

- They can access **public** and **incognito** folders.
- Favour concise responses unless detail is truly needed.`;
    }

    return `## Guest User Context

This user has **no account** - they browse as a guest identified by a browser ID.

- They can only access **public** and **incognito** folders.
- They have **${freeTierCredits} free credits/month** shared across all their devices. A few messages with a standard model exhausts this quota.
- Once credits are gone they must **create an account** to purchase more - they cannot buy credits or subscribe as a guest.
- If credits run low, gently let them know and mention the subscription (${subLabel}) or a credit pack (${packLabel}).
- Favour concise responses unless detail is truly needed - it makes their credits go further.`;
  },
};

/**
 * Build a media capability line for a single modality.
 *
 * Four cases:
 * 1. Chat model IS the gen model → native, no tool mention
 * 2. Gen model set, chat model also has native output → both (prefer tool)
 * 3. Gen model set, no native output → tool only
 * 4. No gen model, native output → native only
 */
function buildMediaLine(opts: {
  label: string;
  toolAlias: string;
  modality: string;
  nativeOutputs: string[];
  genModelName: string | null;
  isSameAsChatModel: boolean;
}): string | null {
  const {
    label,
    toolAlias,
    modality,
    nativeOutputs,
    genModelName,
    isSameAsChatModel,
  } = opts;
  const hasNative = nativeOutputs.includes(modality);

  if (isSameAsChatModel) {
    // Case 1: chat model = gen model → native, tool is omitted from pinned
    return `- ${label}: native (you output ${modality} directly — no tool needed)`;
  }

  if (genModelName) {
    if (hasNative) {
      // Case 2: different gen model + native capability → mention both, prefer tool
      return `- ${label}: You can produce ${modality} natively, but the user prefers ${genModelName} via ${toolAlias} tool. Use the tool by default; use native output only if explicitly asked.`;
    }
    // Case 3: different gen model, no native → tool only
    return `- ${label}: ${genModelName} available via ${toolAlias} tool`;
  }

  if (hasNative) {
    // Case 4: no gen model configured, but model can do it natively
    return `- ${label}: native (model outputs ${modality} directly without a separate tool)`;
  }

  return null;
}

export const mediaCapabilitiesFragment: SystemPromptFragment<PromptContextData> =
  {
    id: "media-capabilities",
    placement: "leading",
    priority: 75,
    condition: (data) => data.mediaCapabilities !== null,
    build: (data) => {
      const mc = data.mediaCapabilities;
      if (!mc) {
        return null;
      }

      const lines = [
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
          toolAlias: "generate_music",
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
        }),
      ].filter((line): line is string => line !== null);

      if (lines.length === 0) {
        return null;
      }

      return `## Media capabilities\n${lines.join("\n")}`;
    },
  };
