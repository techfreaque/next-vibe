import "server-only";

import type { ModelMessage, streamText } from "ai";
import { asc, eq } from "drizzle-orm";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { db } from "../../../../system/db";
import type { DefaultFolderId } from "../../../chat/config";
import type { ChatMessage, MessageMetadata, ToolCall } from "../../../chat/db";
import { chatMessages } from "../../../chat/db";
import { ChatMessageRole } from "../../../chat/enum";
import { MessagesRepository } from "../../../chat/threads/[threadId]/messages/repository";
import {
  getChatModelById,
  type ChatModelId,
  type ChatModelOption,
} from "../../models";
import { COMPACT_TRIGGER, COMPACT_TRIGGER_PERCENTAGE } from "../core/constants";
import {
  CONTEXT_LINE_PREFIX,
  formatAbsoluteTimestamp,
} from "../system-prompt/message-metadata";
import { MessageConverter } from "./message-converter";

/**
 * Result of compacting check
 */
export interface CompactingCheckResult {
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

export class MessageContextBuilder {
  /**
   * Strip attachments from messages for non-vision models
   * Operates on ChatMessage objects BEFORE conversion to AI SDK format
   */
  /**
   * Check if model natively supports an attachment's modality.
   * Uses inputs[] array if available, falls back to legacy feature flags.
   */
  static supportsAttachmentNatively(
    attachment: { mimeType: string },
    model: ChatModelOption,
  ): boolean {
    const mimeType = attachment.mimeType.toLowerCase();

    // Use new inputs[] array if available
    if (model.inputs && model.inputs.length > 0) {
      if (mimeType.startsWith("image/")) {
        return model.inputs.includes("image");
      }
      if (mimeType.startsWith("video/")) {
        return model.inputs.includes("video");
      }
      if (mimeType.startsWith("audio/")) {
        return model.inputs.includes("audio");
      }
      if (mimeType.startsWith("application/pdf")) {
        return model.inputs.includes("text");
      }
      if (mimeType.startsWith("text/")) {
        return model.inputs.includes("text");
      }
      return false;
    }

    // Fallback: use inputs[] array
    if (mimeType.startsWith("image/")) {
      return model.inputs?.includes("image") ?? false;
    }
    if (mimeType.startsWith("application/pdf")) {
      return model.inputs?.includes("text") ?? false;
    }
    return false;
  }

  private static stripAttachmentsFromMessages(
    messages: ChatMessage[],
    modelName: string,
    model?: ChatModelOption,
  ): {
    totalRemoved: number;
    formats: string[];
    warningMessage: string;
  } {
    let totalRemoved = 0;
    const formatSet = new Set<string>();

    for (const message of messages) {
      if (!message.metadata?.attachments) {
        continue;
      }

      // Filter out image and file attachments that model cannot handle natively.
      // Exception: if a cached text variant exists for this message, inject it as
      // text content instead of dropping. If no variant exists, keep the attachment
      // so GapFillExecutor can bridge it after conversion.
      const cachedTextVariant = message.metadata.variants?.find(
        (v) => v.modality === "text" && v.content,
      );

      message.metadata.attachments = message.metadata.attachments.filter(
        (attachment) => {
          const mimeType = attachment.mimeType?.toLowerCase() || "";

          const nativelySupported = model
            ? this.supportsAttachmentNatively({ mimeType }, model)
            : false;

          if (nativelySupported) {
            return true;
          }

          const isImage = mimeType.startsWith("image/");
          const isFile =
            mimeType.startsWith("application/") || mimeType.startsWith("text/");

          if (!isImage && !isFile) {
            return true;
          }

          // Has cached text variant → inject into content, then drop the attachment
          if (cachedTextVariant) {
            const description = cachedTextVariant.content;
            message.content = message.content
              ? `${message.content}\n\n[Attachment description: ${description}]`
              : `[Attachment description: ${description}]`;
            totalRemoved++;
            formatSet.add(isImage ? "image" : "file");
            return false;
          }

          // No cached variant → keep attachment so GapFillExecutor can bridge it
          return true;
        },
      );

      // If all attachments were removed, remove the attachments array
      if (message.metadata.attachments.length === 0) {
        delete message.metadata.attachments;
      }
    }

    const formats = [...formatSet];
    const formatList = formats.join(", ");
    const warningMessage = `[IMPORTANT] ${totalRemoved} attachment(s) (${formatList}) were removed from the conversation history because the current model (${modelName}) does not support vision/file analysis. If the user references these attachments or asks questions about them, politely inform them that you cannot analyze ${formatList}s with this model. IMPORTANT: Suggest they switch to a vision-capable model (like Claude Sonnet 4.5, GPT-5, or Gemini) to analyze the attachments, then switch back to continue the conversation if needed.`;

    return {
      totalRemoved,
      formats,
      warningMessage,
    };
  }

  /**
   * Build complete message context for AI streaming
   * Includes: history, current message, and tool confirmation results
   * Force recompile: 2026-01-01
   */
  static async buildMessageContext(params: {
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
  }): Promise<ModelMessage[]> {
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
      params.logger.debug(
        "[BuildMessageContext] No history (new conversation)",
        {
          operation: params.operation,
          hasThreadId: !!params.threadId,
        },
      );
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
      const currentMessage: ChatMessage = {
        id: userMessageId,
        threadId: params.threadId || "",
        parentId: params.parentMessageId || null,
        sequenceId: userMessageId,
        role: params.role,
        content: params.content,
        metadata: params.userMessageMetadata || null,
        model: null,
        skill: null,
        upvotes: 0,
        downvotes: 0,
        authorId: params.userId || null,
        authorName: null,
        isAI: false,
        errorType: null,
        errorMessage: null,
        errorCode: null,
        searchVector: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
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
      const result = this.stripAttachmentsFromMessages(
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
        ? await MessageConverter.toAiSdkMessages(
            contextMessages,
            params.logger,
            params.timezone,
            params.rootFolderId,
            params.locale,
            params.modelConfig,
            params.operation === "wakeup-resume",
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
        await import("../system-prompt/assembler");
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
      const shortId = params.upcomingAssistantMessageId.slice(-8);
      const metadataParts: string[] = [`ID:${shortId}`];
      metadataParts.push(`Model:${params.upcomingResponseContext.model}`);
      if (params.upcomingResponseContext.skill) {
        metadataParts.push(`Skill:${params.upcomingResponseContext.skill}`);
      }
      const timestamp = formatAbsoluteTimestamp(
        params.upcomingAssistantMessageCreatedAt,
        params.timezone,
      );
      metadataParts.push(`Posted:${timestamp}`);
      contextLine = `${CONTEXT_LINE_PREFIX}${metadataParts.join(" | ")}]`;
    }

    // Trailing system message (STT + tasks + memories + favorites), pre-built in builder.ts
    if (params.trailingSystemMessage.trim()) {
      messages.push({ role: "system", content: params.trailingSystemMessage });
    }
    // [Context:] line - always last
    if (contextLine) {
      messages.push({ role: "system", content: contextLine });
    }

    return messages;
  }

  /**
   * Calculate total tokens that will be sent in the next request
   * Counts: system prompt + tools + all messages in the chain
   */
  static calculateTotalTokens(
    messages: ChatMessage[],
    systemPrompt: string,
    tools: Parameters<typeof streamText>[0]["tools"],
  ): number {
    // System prompt tokens - use char/3.5 for structured text (more accurate than char/4)
    const systemTokens = Math.ceil(systemPrompt.length / 3.5);

    // Tools JSON tokens - JSON is dense, use char/2.5 (tools can be VERY large)
    const toolsTokens = tools
      ? Math.ceil(JSON.stringify(tools).length / 2.5)
      : 0;

    // Message tokens - different calculation based on content type
    const messageTokens = messages.reduce((sum, msg) => {
      // Text content (may be null for tool messages and some assistant messages)
      const textContent = msg.content ?? "";

      // Tool messages: content is null - actual data is in metadata.toolCall
      // Count both the args and result as JSON (dense, use char/2.5)
      if (msg.role === "tool") {
        const toolCall = msg.metadata?.toolCall;
        if (toolCall) {
          const toolJson = JSON.stringify({
            args: toolCall.args,
            result: toolCall.result,
          });
          return sum + Math.ceil(toolJson.length / 2.5);
        }
        // Fallback: if content was somehow stored as text
        return sum + Math.ceil(textContent.length / 2.5);
      }

      // Assistant messages may have tool calls in metadata even when content is null
      // (pure tool-call messages with no text)
      if (msg.role === "assistant" && msg.metadata?.toolCall) {
        const toolJson = JSON.stringify(msg.metadata.toolCall);
        return (
          sum +
          Math.ceil(textContent.length / 4) +
          Math.ceil(toolJson.length / 2.5)
        );
      }

      // Regular messages (user, assistant text, system, compacting summary)
      return sum + Math.ceil(textContent.length / 4);
    }, 0);

    return systemTokens + toolsTokens + messageTokens;
  }

  /**
   * Fetch branch messages by walking up parent chain
   * Works for both server (DB) and incognito (localStorage)
   * Server: Fetches ALL thread messages in ONE query, then filters branch
   */
  private static async fetchBranchMessages(params: {
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
      // For server: fetch ALL thread messages in ONE query, then filter branch
      const allMessages = await db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.threadId, threadId))
        .orderBy(asc(chatMessages.createdAt));

      logger.debug("[fetchBranchMessages] Fetched all thread messages", {
        totalMessages: allMessages.length,
        threadId,
      });

      // Walk up parent chain
      const branchMessages: ChatMessage[] = [];
      const messageMap = new Map(allMessages.map((m) => [m.id, m]));

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
      logger.debug("[fetchBranchMessages] Server branch messages filtered", {
        count: branchMessages.length,
        parentMessageId,
        stoppedAtCompacting: branchMessages[branchMessages.length - 1]?.metadata
          ?.isCompacting
          ? branchMessages[branchMessages.length - 1]?.id
          : null,
      });
      return branchMessages;
    }
  }

  /**
   * Check if history compacting should be triggered
   * Fetches ONLY the branch messages (server DB or incognito storage)
   */
  static async shouldTriggerCompacting(params: {
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
    model: ChatModelId;
    logger: EndpointLogger;
    /** Per-user compact trigger override (cascade resolved in stream-setup). Falls back to COMPACT_TRIGGER. */
    compactTrigger?: number;
  }): Promise<CompactingCheckResult> {
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
      model,
      logger,
      compactTrigger,
    } = params;

    // Step 1: Get branch messages (server DB or incognito storage)
    const branchMessages = await this.fetchBranchMessages({
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
        ? ({
            id: currentUserMessageId,
            threadId,
            parentId: parentMessageId || null,
            sequenceId: currentUserMessageId,
            role: currentUserRole ?? ChatMessageRole.USER,
            content: currentUserContent,
            metadata: currentUserMetadata || null,
            model: null,
            skill: null,
            upvotes: 0,
            downvotes: 0,
            authorId: userId || null,
            authorName: null,
            isAI: false,
            errorType: null,
            errorMessage: null,
            errorCode: null,
            searchVector: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          } satisfies ChatMessage)
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

    const totalTokens = this.calculateTotalTokens(
      messagesForTokenCount,
      systemPrompt,
      tools,
    );

    // Calculate dynamic trigger based on model's context window
    const modelConfig = getChatModelById(model);
    const modelContextLimit = Math.floor(
      modelConfig.contextWindow * COMPACT_TRIGGER_PERCENTAGE,
    );
    const absoluteTrigger = compactTrigger ?? COMPACT_TRIGGER;
    const effectiveTrigger = Math.min(absoluteTrigger, modelContextLimit);

    // Emergency threshold: if we're already at/above 85% of the hard context window,
    // force compacting regardless of the user's effectiveTrigger setting.
    // This prevents the "238K tokens to a 131K model" class of API errors.
    const emergencyThreshold = Math.floor(modelConfig.contextWindow * 0.85);
    const isEmergencyCompact = totalTokens >= emergencyThreshold;

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

  /**
   * Rebuild message history with compacted summary
   * Replaces old messages with compacted summary as system message
   */
  static async rebuildWithCompactedHistory(params: {
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
  }): Promise<ModelMessage[] | null> {
    const {
      compactedSummary,
      compactingMessageId,
      currentUserMessage,
      logger,
    } = params;

    // We just compacted everything up to (but not including) the current user message
    // The compacting operation summarized all parent messages in the chain
    // There are no messages "after compacting" - we go straight to the current user message
    const messagesAfterCompacting: ChatMessage[] = [];

    logger.debug(
      "[Compacting] No messages between summary and current message",
      {
        compactingMessageId,
        isIncognito: params.isIncognito,
      },
    );

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
      const converted = await MessageConverter.toAiSdkMessages(
        messagesToConvert,
        logger,
        params.timezone,
        params.rootFolderId,
        params.locale,
        params.modelConfig,
      );
      messages.push(...converted);
    }

    // Build [Context:] line
    const shortId = params.upcomingAssistantMessageId.slice(-8);
    const metadataParts: string[] = [`ID:${shortId}`];
    metadataParts.push(`Model:${params.model}`);
    if (params.skill) {
      metadataParts.push(`Skill:${params.skill}`);
    }
    const timestamp = formatAbsoluteTimestamp(
      params.upcomingAssistantMessageCreatedAt,
      params.timezone,
    );
    metadataParts.push(`Posted:${timestamp}`);
    const contextLine = `${CONTEXT_LINE_PREFIX}${metadataParts.join(" | ")}]`;

    const finalMessages = messages.filter(Boolean) as ModelMessage[];
    if (params.trailingSystemMessage.trim()) {
      finalMessages.push({
        role: "system",
        content: params.trailingSystemMessage,
      });
    }
    finalMessages.push({ role: "system", content: contextLine });
    return finalMessages;
  }

  /**
   * Estimate token count for a ModelMessage[] array.
   * Uses char/4 heuristic - good enough for truncation decisions.
   */
  static estimateModelMessageTokens(msgs: ModelMessage[]): number {
    return msgs.reduce((sum, m) => {
      if (typeof m.content === "string") {
        return sum + Math.ceil(m.content.length / 4);
      }
      if (Array.isArray(m.content)) {
        return (
          sum +
          Math.ceil(
            m.content
              .map((part) => {
                if (typeof part === "object") {
                  // Binary file parts (audio/video): count as fixed ~300 token overhead,
                  // not the raw bytes (Uint8Array JSON.stringify produces massive output)
                  if ("type" in part && part.type === "file") {
                    return " ".repeat(300 * 4);
                  }
                  if ("text" in part) {
                    return (part as { text: string }).text;
                  }
                  if ("image" in part) {
                    // Images: fixed ~400 token overhead
                    return " ".repeat(400 * 4);
                  }
                }
                return JSON.stringify(part);
              })
              .join("").length / 4,
          )
        );
      }
      return sum;
    }, 0);
  }

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
  static truncateToContextWindow(
    messages: ModelMessage[],
    modelContextWindow: number,
    logger: EndpointLogger,
    systemPrompt: string,
    tools: Parameters<typeof streamText>[0]["tools"],
    /** Tokens to reserve for model output. Default 4096 leaves headroom for responses. */
    reservedOutputTokens = 4096,
  ): ModelMessage[] {
    // Compute overhead tokens (system prompt + tool schemas) using same divisors
    // as calculateTotalTokens so estimates are consistent across the codebase.
    const systemTokens = Math.ceil(systemPrompt.length / 3.5);
    const toolsTokens = tools
      ? Math.ceil(JSON.stringify(tools).length / 2.5)
      : 0;
    const overhead = systemTokens + toolsTokens + reservedOutputTokens;
    const limit = Math.max(modelContextWindow - overhead, 0);

    const currentTokens =
      MessageContextBuilder.estimateModelMessageTokens(messages);
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
      const msgTokens = MessageContextBuilder.estimateModelMessageTokens([msg]);
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
}
