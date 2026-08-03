/**
 * Message context pipeline — budget stage (token estimation, compacting
 * decision/partition, last-resort truncation).
 */

import "server-only";

import type { ModelMessage, streamText } from "ai";
import type { ToolExecutionContext } from "../../../../core/execution-context";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { DefaultFolderId } from "../../../../core/execution-context";
import type { ChatMessage, MessageMetadata } from "../../../chat/db";
import { ChatMessageRole } from "../../../chat/enum";
import type { ChatModelOption } from "../../models";
import { COMPACT_TRIGGER, COMPACT_TRIGGER_PERCENTAGE } from "../core/constants";
import { estimateModelMessageTokens } from "../core/token-estimator";
import { toAiSdkMessages } from "./convert";
import { buildCurrentUserChatMessage, fetchBranchMessages } from "./history";

/**
 * Result of compacting check
 */
interface CompactingCheckResult {
  shouldCompact: boolean;
  /** True when totalTokens already exceeds the model's hard context window (emergency). */
  isEmergencyCompact: boolean;
  totalTokens: number;
  /** Model's hard context window (tokens). */
  modelContextWindow: number;
  branchMessages: ChatMessage[]; // All messages from parent up to (including) last compacting
  messagesToCompact: ChatMessage[]; // Messages after last compacting that need compacting
  currentUserMessage: ChatMessage | null;
  lastCompactingMessage: ChatMessage | null;
  /** Set when the most recent compacting message in the branch failed or was interrupted. */
  failedCompactingMessage: ChatMessage | null;
}

// ─── Stage: budget (token estimate, compacting decision/partition, truncate) ───
// Token estimation + compacting decision/partition live in shouldTriggerCompacting
// (orchestrator below). This stage owns the last-resort hard truncation.

/**
 * Hard-truncate a ModelMessage[] to fit within modelContextWindow.
 *
 * Strategy:
 * - System messages (role === "system") are always kept.
 * - The most recent user message is always kept.
 * - Oldest non-system messages are dropped first until the estimated
 *   token count fits inside (modelContextWindow - systemTokens - toolsTokens - reservedOutputTokens).
 *
 * systemPrompt and tools are included in the overhead calculation so the
 * message budget is accurate - without them the truncation underestimates
 * how many tokens will actually be sent to the API.
 *
 * This is a last-resort safety net - compacting should have prevented
 * overflow, but a single enormous conversation turn can still exceed limits.
 */
export function truncateToContextWindow(
  messages: ModelMessage[],
  modelContextWindow: number,
  logger: EndpointLogger,
  systemPrompt: string,
  tools: Parameters<typeof streamText>[0]["tools"],
  /** Tokens to reserve for model output. Default 4096 leaves headroom for responses. */
  reservedOutputTokens = 4096,
): ModelMessage[] {
  // Compute overhead tokens (system prompt + tool schemas) using same divisors
  // as estimateChatMessageTokens so estimates are consistent across the codebase.
  const systemTokens = Math.ceil(systemPrompt.length / 3.5);
  const toolsTokens = tools ? Math.ceil(JSON.stringify(tools).length / 2.5) : 0;
  const overhead = systemTokens + toolsTokens + reservedOutputTokens;
  const limit = Math.max(modelContextWindow - overhead, 0);

  const currentTokens = estimateModelMessageTokens(messages);
  if (currentTokens <= limit) {
    return messages;
  }

  logger.warn("[Truncation] Messages exceed context window - truncating", {
    estimatedTokens: currentTokens,
    systemTokens,
    toolsTokens,
    overhead,
    limit,
    modelContextWindow,
    reservedOutputTokens,
    messageCount: messages.length,
  });

  // Partition: system messages + last user message are protected
  const systemIndices = new Set<number>();
  let lastUserIndex = -1;
  for (let i = 0; i < messages.length; i++) {
    if (messages[i]?.role === "system") {
      systemIndices.add(i);
    } else if (messages[i]?.role === "user") {
      lastUserIndex = i;
    }
  }
  if (lastUserIndex >= 0) {
    systemIndices.add(lastUserIndex);
  }

  // Build mutable list of droppable indices (oldest non-system first)
  const droppable: number[] = [];
  for (let i = 0; i < messages.length; i++) {
    if (!systemIndices.has(i)) {
      droppable.push(i);
    }
  }

  const dropped = new Set<number>();
  let tokens = currentTokens;

  for (const idx of droppable) {
    if (tokens <= limit) {
      break;
    }
    const msg = messages[idx];
    if (!msg) {
      continue;
    }
    const msgTokens = estimateModelMessageTokens([msg]);
    dropped.add(idx);
    tokens -= msgTokens;
  }

  const truncated: ModelMessage[] = [];
  for (let i = 0; i < messages.length; i++) {
    if (!dropped.has(i) && messages[i]) {
      truncated.push(messages[i] as ModelMessage);
    }
  }

  logger.warn("[Truncation] Truncation complete", {
    droppedCount: dropped.size,
    remainingCount: truncated.length,
    estimatedTokensAfter: tokens,
  });

  return truncated;
}

interface ShouldTriggerCompactingParams {
  threadId: string;
  currentUserMessageId: string | null;
  currentUserContent?: string; // Content of the current user message
  currentUserRole?: ChatMessageRole; // Role of the current user message
  currentUserMetadata?: MessageMetadata | null; // Metadata of the current user message
  userId?: string; // User ID for the current message
  parentMessageId: string | null | undefined;
  isIncognito: boolean;
  messageHistory?: ChatMessage[]; // For incognito mode
  systemPrompt: string;
  tools: Parameters<typeof streamText>[0]["tools"];
  modelConfig: ChatModelOption;
  timezone: string;
  rootFolderId: DefaultFolderId;
  locale: CountryLanguage;
  logger: EndpointLogger;
  /** Per-user compact trigger override (cascade resolved in stream-setup). Falls back to COMPACT_TRIGGER. */
  compactTrigger?: number;
  /** Fixture chain of the stream — the estimation pass converts messages
   *  (attachment downloads) and must record/replay like every other call. */
  toolExecutionContext: ToolExecutionContext;
}

/**
 * Check if history compacting should be triggered
 * Fetches ONLY the branch messages (server DB or incognito storage)
 */
export async function shouldTriggerCompacting(
  params: ShouldTriggerCompactingParams,
): Promise<CompactingCheckResult> {
  const {
    threadId,
    currentUserMessageId,
    currentUserContent,
    currentUserRole,
    currentUserMetadata,
    userId,
    parentMessageId,
    isIncognito,
    messageHistory,
    systemPrompt,
    tools,
    modelConfig,
    timezone,
    rootFolderId,
    logger,
    compactTrigger,
    toolExecutionContext,
  } = params;

  // Step 1: Get branch messages (server DB or incognito storage)
  const branchMessages = await fetchBranchMessages({
    threadId,
    parentMessageId,
    isIncognito,
    messageHistory,
    logger,
  });

  logger.debug("[Compacting] Fetched branch messages", {
    branchMessageCount: branchMessages.length,
    isIncognito,
  });

  // Step 2: Find last compacting message in the branch (successful or failed)
  const lastCompactingMessage =
    branchMessages
      .toReversed()
      .find((m) => m.metadata?.isCompacting === true) ?? null;

  // Detect if the most recent compacting message failed (stream error or interruption).
  // A failed compacting has isCompacting=true but compactingFailed=true and no content.
  const failedCompactingMessage =
    lastCompactingMessage?.metadata?.compactingFailed === true
      ? lastCompactingMessage
      : null;

  // Step 3: Get messages to compact (everything after last SUCCESSFUL compacting, excluding current user message).
  // If the last compacting failed, treat it as if it doesn't exist - use the previous successful one.
  const lastSuccessfulCompactingMessage = failedCompactingMessage
    ? (branchMessages
        .toReversed()
        .find(
          (m) =>
            m.metadata?.isCompacting === true && !m.metadata.compactingFailed,
        ) ?? null)
    : lastCompactingMessage;

  let messagesToCompact: ChatMessage[];
  if (lastSuccessfulCompactingMessage) {
    messagesToCompact = branchMessages.filter(
      (m) =>
        m.createdAt > lastSuccessfulCompactingMessage.createdAt &&
        !m.metadata?.isCompacting &&
        m.id !== currentUserMessageId,
    );
  } else {
    messagesToCompact = branchMessages.filter(
      (m) => !m.metadata?.isCompacting && m.id !== currentUserMessageId,
    );
  }

  // Step 4: Create current user message from provided data
  // The user message hasn't been created in DB yet, so we construct it from the data
  const currentUserMessage =
    currentUserMessageId && currentUserContent
      ? buildCurrentUserChatMessage({
          id: currentUserMessageId,
          threadId,
          parentId: parentMessageId || null,
          role: currentUserRole ?? ChatMessageRole.USER,
          content: currentUserContent,
          metadata: currentUserMetadata || null,
          authorId: userId || null,
        })
      : null;

  logger.debug("[Compacting] Created current user message", {
    hasCurrentUserMessage: !!currentUserMessage,
    currentUserMessageId,
    currentUserContentLength: currentUserContent?.length ?? 0,
    currentUserRole,
  });

  // Step 5: Calculate tokens for FULL context that would be sent to API
  // This includes: system prompt + tools + last compacting message + messages to compact + current user message
  const messagesForTokenCount: ChatMessage[] = [];

  // Add last SUCCESSFUL compacting message (if exists) - this is the context baseline
  if (lastSuccessfulCompactingMessage) {
    messagesForTokenCount.push(lastSuccessfulCompactingMessage);
  }

  // Add messages to compact
  messagesForTokenCount.push(...messagesToCompact);

  // Add current user message
  if (currentUserMessage) {
    messagesForTokenCount.push(currentUserMessage);
  }

  // Convert DB ChatMessage[] → ModelMessage[] (same transformation MessageConverter
  // performs before sending to the AI) so token estimation matches actual API usage.
  const aiSdkMessages = await toAiSdkMessages(
    messagesForTokenCount,
    logger,
    timezone,
    rootFolderId,
    modelConfig,
    undefined,
    toolExecutionContext,
  );
  const systemTokens = Math.ceil(systemPrompt.length / 3.5);
  const toolsTokens = tools ? Math.ceil(JSON.stringify(tools).length / 2.5) : 0;
  const totalTokens =
    systemTokens + toolsTokens + estimateModelMessageTokens(aiSdkMessages);

  // Calculate dynamic trigger based on model's context window
  const modelContextLimit = Math.floor(
    modelConfig.contextWindow * COMPACT_TRIGGER_PERCENTAGE,
  );
  const absoluteTrigger = compactTrigger ?? COMPACT_TRIGGER;
  // MAX_SAFE_INTEGER is the sentinel for "compacting disabled" (revival streams,
  // disableCompacting flag). Skip both the regular trigger and the emergency threshold.
  const compactingDisabled = absoluteTrigger === Number.MAX_SAFE_INTEGER;
  const effectiveTrigger = compactingDisabled
    ? Number.MAX_SAFE_INTEGER
    : Math.min(absoluteTrigger, modelContextLimit);

  // Emergency threshold: if we're already at/above 85% of the hard context window,
  // force compacting regardless of the user's effectiveTrigger setting.
  // This prevents the "238K tokens to a 131K model" class of API errors.
  const emergencyThreshold = Math.floor(modelConfig.contextWindow * 0.85);
  const isEmergencyCompact =
    !compactingDisabled && totalTokens >= emergencyThreshold;

  const shouldCompact = isEmergencyCompact || totalTokens >= effectiveTrigger;

  logger.debug("[Compacting] Token calculation", {
    totalTokens,
    compactTriggerAbsolute: absoluteTrigger,
    compactTriggerPercentage: COMPACT_TRIGGER_PERCENTAGE,
    modelContextWindow: modelConfig.contextWindow,
    modelContextLimit,
    effectiveTrigger,
    emergencyThreshold,
    isEmergencyCompact,
    shouldCompact,
    messagesToCompactCount: messagesToCompact.length,
    lastCompactingMessageId: lastCompactingMessage?.id ?? null,
    lastCompactingTokens: lastCompactingMessage?.content?.length
      ? Math.ceil(lastCompactingMessage.content.length / 4)
      : 0,
    currentUserMessageTokens: currentUserMessage?.content?.length
      ? Math.ceil(currentUserMessage.content.length / 4)
      : 0,
    systemPromptTokens: Math.ceil(systemPrompt.length / 4),
    toolsTokens: tools ? Math.ceil(JSON.stringify(tools).length / 4) : 0,
  });

  return {
    shouldCompact,
    isEmergencyCompact,
    totalTokens,
    modelContextWindow: modelConfig.contextWindow,
    branchMessages,
    messagesToCompact,
    currentUserMessage,
    lastCompactingMessage: lastSuccessfulCompactingMessage,
    failedCompactingMessage,
  };
}
