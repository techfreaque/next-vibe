/**
 * System Prompt Builder — the runtime engine: assembly + data loading +
 * per-message metadata lines.
 *
 * Server-only data-loading layer. Loads all fragment data via the generated
 * combined loader, then assembles the final system prompt strings.
 *
 * All fragment logic lives in each module's system-prompt/prompt.ts + server.ts.
 * Import paths are centralized in generated/prompt-fragments/server.ts - no hardcoding here.
 *
 * Flow:
 *   Step 1 - Load all fragment data in parallel via generated combined loader
 *   Step 2 - Assemble system prompt from leading fragments (sorted by priority)
 *   Step 3 - Build trailing system message and return
 *
 * Sections: assembly (pure joiners) · builder (server loading) · message
 * metadata ([Context:] lines). types.ts stays separate (imported by generated
 * prompt-fragment modules); generator.ts is the CODEGEN for those modules,
 * not part of the runtime engine.
 */

import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { ToolExecutionContext } from "@/app/api/[locale]/agent/chat/config";
import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import { loadAllPromptFragments } from "@/generated/prompt-fragments/server";

import type {
  MediaCapabilitiesParams,
  SystemPromptServerParams,
} from "./types";

// ─── Assembly (pure joiners — no content lives here) ────────────────────────

export const CONTINUE_CONVERSATION_PROMPT =
  "Respond to the previous AI message naturally, as if you were a user engaging with it. Provide your thoughts, feedback, or follow-up based on what was said. Do not ask questions or try to drive the conversation - simply respond to what the AI said.";

function generateSystemPrompt(params: {
  leadingFragments: Array<{ priority: number; str: string }>;
}): string {
  const { leadingFragments } = params;
  return leadingFragments
    .toSorted((a, b) => a.priority - b.priority)
    .map((f) => f.str)
    .join("\n\n");
}

function buildTrailingSystemMessage(params: {
  trailingFragments?: string[];
  completedTasksSummary?: string | null;
  voiceTranscription?: {
    wasTranscribed: boolean;
    confidence: number | null;
  } | null;
}): string {
  const currentParts: string[] = [];

  if (params.voiceTranscription?.wasTranscribed) {
    const confidence = params.voiceTranscription.confidence;
    const confidenceNote =
      confidence !== null && confidence !== undefined
        ? ` (confidence: ${Math.round(confidence * 100)}%)`
        : "";
    currentParts.push(
      `[STT] The preceding user message was transcribed from speech${confidenceNote}. It may contain transcription errors - interpret with flexibility for homophones, mis-heard words, missing punctuation, and minor word substitutions.`,
    );
  }

  if (params.completedTasksSummary?.trim()) {
    currentParts.push(params.completedTasksSummary.trim());
  }

  const stateParts = (params.trailingFragments ?? []).filter((s) => s?.trim());
  const allParts = [...currentParts];

  if (stateParts.length > 0) {
    // This trailing block is REBUILT every turn from live state — it is CURRENT,
    // not a stale earlier-turn snapshot. Framing it as "captured before this turn"
    // made the model treat live duties here (e.g. the thread-rename requirement)
    // as ignorable old state. Present it as the current context + duties for THIS
    // turn so they are acted on, not dismissed.
    allParts.push(
      `[Current context and required actions for THIS turn — reflects live state right now]\n\n${stateParts.join("\n\n")}`,
    );
  }

  return allParts.join("\n\n");
}

export interface SystemPromptResult {
  systemPrompt: string;
  trailingSystemMessage: string;
}

export interface SystemPromptParams {
  /** Fixture thread id — cortex vector-search embeddings bind it. */
  streamContext: ToolExecutionContext;
  skillId: string | null | undefined;
  user: JwtPayloadType;
  logger: EndpointLogger;
  locale: CountryLanguage;
  rootFolderId: DefaultFolderId;
  subFolderId: string | null;
  callMode: boolean | null | undefined;
  extraInstructions?: string;
  /** Model-pipe relay receiver: the CALLER's relayed context is authoritative —
   *  suppress this instance's own identity fragment so the prompt names only
   *  the originator. */
  suppressSelfIdentity?: boolean;
  /** Relay receiver: caller instance that owns this thread — rename round-trips
   *  to it (see SystemPromptServerParams.relayCallerInstanceId). */
  relayCallerInstanceId?: string | null;
  headless?: boolean;
  subAgentDepth: number;
  excludeMemories?: boolean;
  memoryLimit?: number | null;
  mediaCapabilities?: MediaCapabilitiesParams;
  /** Fired user-message embed — awaited by the cortex search (see server params). */
  messageEmbedReady?: Promise<void>;
  threadId: string | null;
  /** Incognito only: client-sent current thread title/description (no DB row). */
  incognitoThreadTitle?: string | null;
  incognitoThreadDescription?: string | null;
  voiceTranscription?: {
    wasTranscribed: boolean;
    confidence: number | null;
  } | null;
}

export async function buildSystemPrompt(
  params: SystemPromptParams,
): Promise<SystemPromptResult> {
  const {
    skillId,
    user,
    logger,
    locale,
    rootFolderId,
    subFolderId,
    callMode,
    extraInstructions,
    headless,
    suppressSelfIdentity,
    subAgentDepth,
    excludeMemories,
    memoryLimit,
    mediaCapabilities,
    voiceTranscription,
  } = params;

  const isIncognito = rootFolderId === "incognito";
  const isExposedFolder =
    rootFolderId === "public" || rootFolderId === "shared";

  logger.debug("Building system prompt", {
    hasSkillId: !!skillId,
    hasUserId: !user.isPublic,
    rootFolderId,
    subFolderId,
    callMode,
  });

  const serverParams: SystemPromptServerParams = {
    streamContext: params.streamContext,
    user,
    logger,
    locale,
    rootFolderId,
    subFolderId,
    skillId,
    isIncognito,
    isExposedFolder,
    excludeMemories,
    headless: headless ?? false,
    suppressSelfIdentity: suppressSelfIdentity ?? false,
    relayCallerInstanceId: params.relayCallerInstanceId ?? null,
    subAgentDepth,
    callMode: callMode ?? false,
    extraInstructions: extraInstructions ?? "",
    memoryLimit: memoryLimit ?? null,
    mediaCapabilities,
    messageEmbedReady: params.messageEmbedReady,
    threadId: params.threadId ?? null,
    incognitoThreadTitle: params.incognitoThreadTitle ?? null,
    incognitoThreadDescription: params.incognitoThreadDescription ?? null,
  };

  const { leading, trailing } = await loadAllPromptFragments(serverParams);

  const systemPrompt = generateSystemPrompt({ leadingFragments: leading });

  const trailingSystemMessage = buildTrailingSystemMessage({
    trailingFragments: trailing.map((x) => x.str),
    voiceTranscription,
  });

  return { systemPrompt, trailingSystemMessage };
}

// ─── Message metadata ([Context:] lines) ─────────────────────────────────────

/**
 * Format absolute timestamp for message metadata
 * CACHE-STABLE: Returns absolute timestamp that never changes
 * Format: "Feb 12, 18:23" (localized to user's timezone)
 */
export function formatAbsoluteTimestamp(
  date: Date,
  timezone: string,
  logger: EndpointLogger,
): string {
  // Guard against invalid dates (NaN) which cause Intl.DateTimeFormat.format() to throw.
  // Invalid dates can occur when raw CTE results have missing/unparseable date columns.
  if (isNaN(date.getTime())) {
    logger.error(
      "[formatAbsoluteTimestamp] Invalid date encountered — this should never happen. Date value is NaN, which means a DB column returned null or an unparseable value.",
      { date, timezone },
    );
    return "unknown";
  }
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timezone,
  });
  return formatter.format(date);
}

/**
 * Create metadata string for a chat message (compact format)
 * Only includes non-empty fields
 * Context-aware: includes author info for public/shared threads
 */
function createMessageMetadata(
  message: ChatMessage,
  rootFolderId: DefaultFolderId,
  timezone: string,
  logger: EndpointLogger,
): string {
  const parts: string[] = [];

  // Message ID (short fragment for AI reference)
  const shortId = message.id.slice(-8);
  parts.push(`ID:${shortId}`);

  // Model and Skill (for assistant messages)
  if (message.role === "assistant" && message.model) {
    parts.push(`Model:${message.model}`);
    if (message.skill) {
      parts.push(`Skill:${message.skill}`);
    }
  }

  // Author information (public/shared threads only)
  if (
    (rootFolderId === "public" || rootFolderId === "shared") &&
    message.authorId
  ) {
    const authorShortId = message.authorId.slice(-8);
    const authorLabel = message.authorName
      ? `${message.authorName}(${authorShortId})`
      : authorShortId;
    parts.push(`Author:${authorLabel}`);
  }

  // Votes (show if either upvotes or downvotes > 0)
  if (message.upvotes > 0 || message.downvotes > 0) {
    const voteParts: string[] = [];
    if (message.upvotes > 0) {
      voteParts.push(`👍${message.upvotes}`);
    }
    if (message.downvotes > 0) {
      voteParts.push(`👎${message.downvotes}`);
    }
    parts.push(voteParts.join(" "));
  }

  // Timestamp (absolute, cache-stable)
  const timestamp = formatAbsoluteTimestamp(
    message.createdAt,
    timezone,
    logger,
  );
  parts.push(`Posted:${timestamp}`);

  return parts.join(" | ");
}

/**
 * Prefix for all context metadata lines injected into the messages array.
 * Used for constructing and identifying context lines - never match raw strings.
 */
export const CONTEXT_LINE_PREFIX = "[Context: ";

/**
 * Check whether a system message content string is a context metadata line.
 */
export function isContextLine(content: string): boolean {
  return content.startsWith(CONTEXT_LINE_PREFIX);
}

/**
 * Create metadata system message content (compact format)
 * Wraps metadata in standard format
 * Returns empty string if no metadata available
 */
export function createMetadataSystemMessage(
  message: ChatMessage,
  rootFolderId: DefaultFolderId,
  timezone: string,
  logger: EndpointLogger,
): string {
  const metadata = createMessageMetadata(
    message,
    rootFolderId,
    timezone,
    logger,
  );
  return `${CONTEXT_LINE_PREFIX}${metadata}]`;
}
