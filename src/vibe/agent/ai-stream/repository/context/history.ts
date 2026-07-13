/**
 * Message context pipeline — fetch/hydrate/assemble/decorate stages plus the
 * buildMessageContext / rebuildWithCompactedHistory orchestrators.
 */

import "server-only";

import type { ModelMessage } from "ai";
import type { ToolExecutionContext } from "next-vibe/agent/chat/config";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { DefaultFolderId } from "../../../chat/config";
import type { ChatMessage, ToolCall } from "../../../chat/db";
import { ChatMessageRole } from "../../../chat/enum";
import { MessagesRepository } from "../../../chat/threads/[threadId]/messages/repository";
import {
  type ChatModelId,
  type ChatModelOption,
  getChatModelById,
} from "../../models";
import {
  CONTEXT_LINE_PREFIX,
  formatAbsoluteTimestamp,
} from "../../system-prompt/builder";
import { fetchAncestorBranch } from "../core/tree-walk";
import { stripAttachmentsFromMessages } from "./attachments";
import { toAiSdkMessages } from "./convert";

// ─── Stage: fetch (history DB/incognito, branch walk) ───
// Full-history fetch (DB via MessagesRepository / passed incognito history) lives
// inline in buildMessageContext below. This stage owns the branch walk used by
// the compacting decision.

/**
 * Fetch branch messages by walking up parent chain
 * Works for both server (DB) and incognito (localStorage)
 * Server: Fetches ALL thread messages in ONE query, then filters branch
 */
export async function fetchBranchMessages(params: {
  threadId: string;
  parentMessageId: string | null | undefined;
  isIncognito: boolean;
  messageHistory?: ChatMessage[];
  logger: EndpointLogger;
}): Promise<ChatMessage[]> {
  const { threadId, parentMessageId, isIncognito, messageHistory, logger } =
    params;

  if (!parentMessageId) {
    return [];
  }

  if (isIncognito && messageHistory) {
    // For incognito: walk up parent chain in messageHistory array
    const branchMessages: ChatMessage[] = [];
    const messageMap = new Map(messageHistory.map((m) => [m.id, m]));

    // Start from parentMessageId (the message the new user message will reply to)
    // Walk up the chain INCLUDING this message
    let currentId: string | null = parentMessageId;

    while (currentId) {
      const msg = messageMap.get(currentId);
      if (!msg) {
        break;
      }
      branchMessages.push(msg);

      // Stop if we hit a compacting message (include it, then stop)
      if (msg.metadata?.isCompacting) {
        break;
      }

      currentId = msg.parentId;
    }

    branchMessages.reverse(); // Oldest first
    logger.debug("[fetchBranchMessages] Incognito branch messages fetched", {
      count: branchMessages.length,
      parentMessageId,
    });
    return branchMessages;
  } else {
    const branchMessages = await fetchAncestorBranch(
      threadId,
      parentMessageId,
      logger,
    );
    logger.debug("[fetchBranchMessages] Server branch messages fetched", {
      count: branchMessages.length,
      parentMessageId,
      stoppedAtCompacting: branchMessages[0]?.metadata?.isCompacting
        ? branchMessages[0]?.id
        : null,
    });
    return branchMessages;
  }
}

// ─── Stage: hydrate (attachment base64) ───
// Server-mode attachment hydration (storage.readFileAsBase64 → attachment.data)
// happens inline in buildMessageContext: it MUTATES the history ChatMessage
// attachment objects in place - callers rely on that identity, so it is not
// extracted here. Per-part attachment fetching during conversion lives in the
// convert stage (toAiSdkMessage).

// ─── Stage: assemble (synthesize current msg, waiting-confirmation strip) ───
// The waiting-for-confirmation strip operates inline in buildMessageContext
// (splices contextMessages in place). This stage owns the single synthetic
// current-user ChatMessage factory shared by buildMessageContext and
// shouldTriggerCompacting.

/**
 * Construct the synthetic current-user ChatMessage. The user message may not
 * exist in DB yet (compacting check) or is being appended to context
 * (buildMessageContext) - both sites build the identical shape.
 */
export function buildCurrentUserChatMessage(params: {
  id: string;
  threadId: string;
  parentId: string | null;
  role: ChatMessageRole;
  content: string;
  metadata: ChatMessage["metadata"];
  authorId: string | null;
}): ChatMessage {
  return {
    id: params.id,
    threadId: params.threadId,
    parentId: params.parentId,
    sequenceId: params.id,
    role: params.role,
    content: params.content,
    metadata: params.metadata,
    model: null,
    skill: null,
    upvotes: 0,
    downvotes: 0,
    authorId: params.authorId,
    authorName: null,
    isAI: false,
    errorType: null,
    errorMessage: null,
    errorCode: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  } satisfies ChatMessage;
}

// ─── Stage: decorate (vision warning, operation system messages, [Context:] line, trailing) ───
// Vision-warning and operation-specific system messages (answer-as-ai /
// wakeup-resume hints) plus the trailing system message are appended inline in
// buildMessageContext. This stage owns the single [Context:] line factory shared
// by buildMessageContext and rebuildWithCompactedHistory.

/**
 * Build the [Context:] line announcing the upcoming assistant message
 * (short ID, model, optional skill, posted timestamp). Always appended last.
 */
function buildContextLine(params: {
  upcomingAssistantMessageId: string;
  model: ChatModelId;
  skill: string | null;
  upcomingAssistantMessageCreatedAt: Date;
  timezone: string;
  logger: EndpointLogger;
}): string {
  const shortId = params.upcomingAssistantMessageId.slice(-8);
  const metadataParts: string[] = [`ID:${shortId}`];
  metadataParts.push(`Model:${params.model}`);
  if (params.skill) {
    metadataParts.push(`Skill:${params.skill}`);
  }
  const timestamp = formatAbsoluteTimestamp(
    params.upcomingAssistantMessageCreatedAt,
    params.timezone,
    params.logger,
  );
  metadataParts.push(`Posted:${timestamp}`);
  return `${CONTEXT_LINE_PREFIX}${metadataParts.join(" | ")}]`;
}

// ─── Orchestrators (buildMessageContext, rebuildWithCompactedHistory) ───

interface BuildMessageContextParams {
  operation: "send" | "retry" | "edit" | "answer-as-ai" | "wakeup-resume";
  threadId: string | null | undefined;
  parentMessageId: string | null | undefined;
  locale: CountryLanguage;
  content: string;
  role: ChatMessageRole;
  userId: string | undefined;
  isIncognito: boolean;
  rootFolderId: DefaultFolderId;
  messageHistory?: ChatMessage[];
  logger: EndpointLogger;
  timezone: string;
  upcomingResponseContext?: { model: ChatModelId; skill: string | null };
  userMessageMetadata?: {
    attachments?: Array<{
      id: string;
      url: string;
      filename: string;
      mimeType: string;
      size: number;
      data?: string;
    }>;
  };
  hasToolConfirmations?: boolean;
  toolConfirmationResults?: Array<{
    messageId: string;
    sequenceId: string;
    toolCall: ToolCall;
  }>;
  userMessageId: string | null;
  upcomingAssistantMessageId: string;
  upcomingAssistantMessageCreatedAt: Date;
  modelConfig: ChatModelOption;
  /** Pre-built trailing system message string (STT + tasks + memories + favorites), built in builder.ts via generator.ts */
  trailingSystemMessage: string;
  /** Fixture chain of the calling stream — attachment/media downloads bind it. */
  streamContext: ToolExecutionContext;
}

/**
 * Build complete message context for AI streaming
 * Includes: history, current message, and tool confirmation results
 * Force recompile: 2026-01-01
 */
export async function buildMessageContext(
  params: BuildMessageContextParams,
): Promise<ModelMessage[]> {
  params.logger.debug("[BuildMessageContext] === FUNCTION CALLED ===", {
    operation: params.operation,
    isIncognito: params.isIncognito,
    hasUserId: !!params.userId,
    hasThreadId: !!params.threadId,
    hasUserMessageMetadata: !!params.userMessageMetadata,
    attachmentCount: params.userMessageMetadata?.attachments?.length ?? 0,
  });
  // SECURITY: Reject non-empty messageHistory for non-incognito threads
  // Non-incognito threads must fetch history from database to prevent manipulation
  if (
    !params.isIncognito &&
    params.messageHistory &&
    params.messageHistory.length > 0
  ) {
    params.logger.error(
      "Security violation: messageHistory provided for non-incognito thread",
      {
        operation: params.operation,
        threadId: params.threadId,
        isIncognito: params.isIncognito,
        messageHistoryLength: params.messageHistory.length,
      },
    );
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Security violation should throw immediately
    throw new Error(
      "messageHistory is only allowed for incognito mode. Server-side threads fetch history from database.",
    );
  }

  // Get message history - source depends on mode (incognito: passed, server: DB)
  let history: ChatMessage[] = [];

  if (params.isIncognito && params.messageHistory) {
    // Incognito: use passed message history, but trim at the last successful
    // compacting message so we don't send the full uncompacted history
    // alongside the compacting summary.
    const lastSuccessfulCompactingIdx = params.messageHistory.findLastIndex(
      (m) =>
        m.metadata?.isCompacting === true &&
        m.metadata.compactingFailed !== true,
    );
    history =
      lastSuccessfulCompactingIdx >= 0
        ? params.messageHistory.slice(lastSuccessfulCompactingIdx)
        : params.messageHistory;
    params.logger.debug(
      "[BuildMessageContext] Using passed message history (incognito)",
      {
        operation: params.operation,
        historyLength: history.length,
        originalLength: params.messageHistory.length,
        trimmedAtCompacting: lastSuccessfulCompactingIdx >= 0,
      },
    );
  } else if (!params.isIncognito && params.threadId) {
    // Server: fetch message history from database
    if (
      (params.operation === "answer-as-ai" ||
        params.operation === "wakeup-resume") &&
      params.parentMessageId
    ) {
      // For answer-as-ai/wakeup-resume: walk up parent chain (same as fetchMessageHistory)
      // to respect compacting boundaries.
      history = await MessagesRepository.fetchMessageHistory(
        params.threadId,
        params.logger,
        params.parentMessageId,
      );
    } else {
      // For other operations: fetch history filtered by branch
      history = await MessagesRepository.fetchMessageHistory(
        params.threadId,
        params.logger,
        params.parentMessageId ?? null,
      );
    }

    // Fetch file data for attachments in server mode
    const { getStorageAdapter } = await import("../../../chat/storage");
    const storage = getStorageAdapter();

    for (const message of history) {
      if (message.metadata?.attachments) {
        for (const attachment of message.metadata.attachments) {
          if (attachment.url && !attachment.data) {
            const base64Data = await storage.readFileAsBase64(
              attachment.id,
              params.threadId,
            );
            if (base64Data) {
              attachment.data = base64Data;
              params.logger.debug(
                "[BuildMessageContext] Fetched file data for attachment",
                {
                  attachmentId: attachment.id,
                  filename: attachment.filename,
                },
              );
            }
          }
        }
      }
    }

    params.logger.debug(
      "[BuildMessageContext] Fetched message history from DB (server)",
      {
        operation: params.operation,
        historyLength: history.length,
      },
    );
  } else {
    params.logger.debug("[BuildMessageContext] No history (new conversation)", {
      operation: params.operation,
      hasThreadId: !!params.threadId,
    });
  }

  const contextMessages: ChatMessage[] = [...history];

  // Add current user message to context (unless it's answer-as-ai or wakeup-resume)
  const shouldAddCurrentMessage =
    params.operation !== "answer-as-ai" &&
    params.operation !== "wakeup-resume" &&
    params.content.trim();

  if (shouldAddCurrentMessage) {
    // userMessageId is guaranteed to be non-null here because:
    // - answer-as-ai sets shouldAddCurrentMessage = false
    // - all other operations require userMessageId (validated in stream-setup.ts)
    const userMessageId = params.userMessageId!;
    const currentMessage: ChatMessage = buildCurrentUserChatMessage({
      id: userMessageId,
      threadId: params.threadId || "",
      parentId: params.parentMessageId || null,
      role: params.role,
      content: params.content,
      metadata: params.userMessageMetadata || null,
      authorId: params.userId || null,
    });
    contextMessages.push(currentMessage);

    params.logger.debug(
      "[BuildMessageContext] Added current message to context",
      {
        role: params.role,
        hasMetadata: !!params.userMessageMetadata,
        attachmentCount: params.userMessageMetadata?.attachments?.length ?? 0,
      },
    );
  }

  // When processing tool confirmations, strip any waitingForConfirmation tool messages
  // from history - they'll be replaced by the confirmed results via toolConfirmationResults.
  // This ensures AI never sees the waiting_for_confirmation placeholder.
  if (params.hasToolConfirmations && contextMessages.length > 0) {
    const before = contextMessages.length;
    for (let i = contextMessages.length - 1; i >= 0; i--) {
      const msg = contextMessages[i];
      if (
        msg &&
        msg.role === ChatMessageRole.TOOL &&
        "metadata" in msg &&
        msg.metadata?.toolCall?.waitingForConfirmation === true
      ) {
        contextMessages.splice(i, 1);
      }
    }
    params.logger.debug(
      "[BuildMessageContext] Stripped waitingForConfirmation tool messages from confirm stream",
      { before, after: contextMessages.length },
    );
  }

  params.logger.debug("[BuildMessageContext] Built message context", {
    totalMessages: contextMessages.length,
    isIncognito: params.isIncognito,
  });

  let visionWarningMessage: string | null = null;

  if (params.upcomingResponseContext?.model) {
    const modelConfig =
      params.modelConfig ??
      getChatModelById(params.upcomingResponseContext.model);

    // Always run strip logic - it uses supportsAttachmentNatively per-attachment,
    // injects cached text variants, and keeps un-bridged attachments for GapFillExecutor.
    const result = stripAttachmentsFromMessages(
      contextMessages,
      modelConfig.name,
      modelConfig,
    );

    if (result.totalRemoved > 0) {
      visionWarningMessage = result.warningMessage;
      params.logger.debug(
        "[BuildMessageContext] Replaced attachments with cached variants",
        {
          model: modelConfig.name,
          attachmentsReplaced: result.totalRemoved,
          formats: result.formats.join(", "),
        },
      );
    }
  }

  const messages =
    contextMessages.length > 0
      ? await toAiSdkMessages(
          contextMessages,
          params.logger,
          params.timezone,
          params.rootFolderId,
          params.modelConfig,
          params.operation === "wakeup-resume",
          params.streamContext,
        )
      : [];

  params.logger.debug("[BuildMessageContext] Converted to AI SDK format", {
    convertedMessages: messages.length,
  });

  // Strip unsupported file/image parts from ASSISTANT messages in history.
  // Assistant messages can carry generated images (file parts) from previous turns.
  // If the active model doesn't support image input, drop those parts to avoid
  // API errors - GapFill only handles user messages, not assistant history.
  if (params.modelConfig && !params.modelConfig.inputs?.includes("image")) {
    for (const msg of messages) {
      if (msg.role === "assistant" && Array.isArray(msg.content)) {
        // MessageConverter may inject file parts for generated images.
        // The AI SDK types don't include "file" in AssistantContent but
        // the runtime value can have it - cast to access the type field.
        const parts = msg.content as Array<{ type: string }>;
        const filtered = parts.filter(
          (part) => part.type !== "file" && part.type !== "image",
        );
        if (filtered.length !== parts.length) {
          (msg as { content: typeof filtered }).content = filtered;
        }
      }
    }
  }

  // Add vision warning as system message if needed
  if (visionWarningMessage) {
    messages.push({
      role: "system",
      content: visionWarningMessage,
    });
  }

  if (params.operation === "answer-as-ai") {
    const { CONTINUE_CONVERSATION_PROMPT } =
      await import("../../system-prompt/builder");
    const systemContent = params.content.trim()
      ? `${CONTINUE_CONVERSATION_PROMPT}\n\nAdditional instructions: ${params.content}`
      : CONTINUE_CONVERSATION_PROMPT;

    messages.push({ role: "system", content: systemContent });
    params.logger.debug(
      "[BuildMessageContext] Added CONTINUE_CONVERSATION_PROMPT",
      {
        hasAdditionalContent: !!params.content.trim(),
      },
    );
  }
  if (params.operation === "wakeup-resume") {
    messages.push({
      role: "system",
      content:
        "The async background task dispatched earlier has finished. The tool result above is the final outcome. Resume the conversation naturally, following any instructions in the original user message.",
    });
    params.logger.debug(
      "[BuildMessageContext] Added wakeup-resume revival hint",
    );
  }

  // Build [Context:] line for the trailing messages
  let contextLine: string | null = null;
  if (params.upcomingResponseContext) {
    contextLine = buildContextLine({
      upcomingAssistantMessageId: params.upcomingAssistantMessageId,
      model: params.upcomingResponseContext.model,
      skill: params.upcomingResponseContext.skill,
      upcomingAssistantMessageCreatedAt:
        params.upcomingAssistantMessageCreatedAt,
      timezone: params.timezone,
      logger: params.logger,
    });
  }

  // Trailing system message (STT + tasks + memories + favorites), pre-built in builder.ts
  appendTrailingSystemMessages({
    messages,
    trailingSystemMessage: params.trailingSystemMessage,
    contextLine,
    modelConfig: params.modelConfig,
  });

  return messages;
}

/**
 * Append the trailing system message + [Context:] line.
 *
 * Text models get them at the very end (state reminders closest to
 * generation). Native image-output models are far more literal: when the
 * conversation ends in system state dumps instead of the user's generation
 * instruction, they reason about the state instead of producing image tokens.
 * For those models the trailing block is inserted BEFORE the final user
 * message so the instruction stays last.
 */
function appendTrailingSystemMessages(params: {
  messages: ModelMessage[];
  trailingSystemMessage: string;
  contextLine: string | null;
  modelConfig?: ChatModelOption;
}): void {
  const { messages, trailingSystemMessage, contextLine, modelConfig } = params;
  const tail: ModelMessage[] = [];
  if (trailingSystemMessage.trim()) {
    tail.push({ role: "system", content: trailingSystemMessage });
  }
  if (contextLine) {
    tail.push({ role: "system", content: contextLine });
  }
  if (tail.length === 0) {
    return;
  }

  if (modelConfig?.outputs?.includes("image")) {
    const lastUserIdx = messages.findLastIndex((m) => m.role === "user");
    if (lastUserIdx >= 0) {
      messages.splice(lastUserIdx, 0, ...tail);
      return;
    }
  }
  messages.push(...tail);
}

interface RebuildWithCompactedHistoryParams {
  compactedSummary: string;
  compactingMessageId: string;
  currentUserMessage: ChatMessage | null;
  threadId: string;
  isIncognito: boolean;
  messageHistory?: ChatMessage[]; // For incognito mode
  logger: EndpointLogger;
  upcomingAssistantMessageId: string;
  upcomingAssistantMessageCreatedAt: Date;
  model: ChatModelId;
  skill: string | null;
  timezone: string;
  rootFolderId: DefaultFolderId;
  /** Pre-built trailing system message string, built in builder.ts via generator.ts */
  trailingSystemMessage: string;
  locale: CountryLanguage;
  modelConfig?: ChatModelOption;
  /** Fixture chain of the calling stream — attachment/media downloads bind it. */
  streamContext: ToolExecutionContext;
}

/**
 * Rebuild message history with compacted summary
 * Replaces old messages with compacted summary as system message
 */
export async function rebuildWithCompactedHistory(
  params: RebuildWithCompactedHistoryParams,
): Promise<ModelMessage[] | null> {
  const { compactedSummary, compactingMessageId, currentUserMessage, logger } =
    params;

  // We just compacted everything up to (but not including) the current user message
  // The compacting operation summarized all parent messages in the chain
  // There are no messages "after compacting" - we go straight to the current user message
  const messagesAfterCompacting: ChatMessage[] = [];

  logger.debug("[Compacting] No messages between summary and current message", {
    compactingMessageId,
    isIncognito: params.isIncognito,
  });

  logger.debug("[Compacting] Rebuilding history", {
    compactedSummaryLength: compactedSummary.length,
    messagesAfterCompacting: messagesAfterCompacting.length,
    hasCurrentUserMessage: !!currentUserMessage,
    currentUserMessageContent: currentUserMessage?.content?.slice(0, 100),
    currentUserMessageRole: currentUserMessage?.role,
  });

  // Build new message array for AI
  const messages: ModelMessage[] = [];

  // Add compacted history as system message
  messages.push({
    role: "system",
    content: `Previous conversation summary:\n\n${compactedSummary}`,
  });

  // Convert messages after compacting and current user message
  // Build array of ChatMessages, then convert all at once with context system messages
  const messagesToConvert: ChatMessage[] = [
    ...messagesAfterCompacting,
    ...(currentUserMessage ? [currentUserMessage] : []),
  ];

  if (messagesToConvert.length > 0) {
    const converted = await toAiSdkMessages(
      messagesToConvert,
      logger,
      params.timezone,
      params.rootFolderId,
      params.modelConfig,
      undefined,
      params.streamContext,
    );
    messages.push(...converted);
  }

  // Build [Context:] line
  const contextLine = buildContextLine({
    upcomingAssistantMessageId: params.upcomingAssistantMessageId,
    model: params.model,
    skill: params.skill,
    upcomingAssistantMessageCreatedAt: params.upcomingAssistantMessageCreatedAt,
    timezone: params.timezone,
    logger: params.logger,
  });

  const finalMessages = messages.filter(Boolean) as ModelMessage[];
  appendTrailingSystemMessages({
    messages: finalMessages,
    trailingSystemMessage: params.trailingSystemMessage,
    contextLine,
    modelConfig: params.modelConfig,
  });
  return finalMessages;
}
