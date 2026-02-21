import "server-only";

import type { ModelMessage, streamText } from "ai";
import { asc, eq } from "drizzle-orm";

import {
  getModelById,
  type ModelId,
  type ModelOption,
} from "@/app/api/[locale]/agent/models/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { db } from "../../../../system/db";
import type { DefaultFolderId } from "../../../chat/config";
import type { ChatMessage, MessageMetadata, ToolCall } from "../../../chat/db";
import { chatMessages } from "../../../chat/db";
import { ChatMessageRole } from "../../../chat/enum";
import { fetchMessageHistory } from "../../../chat/threads/[threadId]/messages/repository";
import { COMPACT_TRIGGER, COMPACT_TRIGGER_PERCENTAGE } from "../core/constants";
import { formatAbsoluteTimestamp } from "../system-prompt/message-metadata";
import { MessageConverter } from "./message-converter";

/**
 * Result of compacting check
 */
export interface CompactingCheckResult {
  shouldCompact: boolean;
  totalTokens: number;
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
  private static stripAttachmentsFromMessages(
    messages: ChatMessage[],
    modelName: string,
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

      const originalCount = message.metadata.attachments.length;

      // Filter out image and file attachments
      message.metadata.attachments = message.metadata.attachments.filter(
        (attachment) => {
          const mimeType = attachment.mimeType?.toLowerCase() || "";
          const isImage = mimeType.startsWith("image/");
          const isFile =
            mimeType.startsWith("application/") || mimeType.startsWith("text/");

          if (isImage || isFile) {
            totalRemoved++;
            formatSet.add(isImage ? "image" : "file");
            return false;
          }

          return true;
        },
      );

      // If all attachments were removed, remove the attachments array
      if (message.metadata.attachments.length === 0) {
        delete message.metadata.attachments;
      }

      const removedCount =
        originalCount - (message.metadata.attachments?.length || 0);
      if (removedCount > 0) {
        // Optionally clear content if it was only describing the attachment
        // For now, we keep the text content even if attachments are removed
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
    operation: "send" | "retry" | "edit" | "answer-as-ai";
    threadId: string | null | undefined;
    parentMessageId: string | null | undefined;
    content: string;
    role: ChatMessageRole;
    userId: string | undefined;
    isIncognito: boolean;
    rootFolderId?: DefaultFolderId;
    messageHistory?: ChatMessage[];
    logger: EndpointLogger;
    timezone: string;
    upcomingResponseContext?: { model: ModelId; character: string | null };
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
    modelConfig?: ModelOption;
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
      // Incognito: use passed message history
      history = params.messageHistory;
      params.logger.debug(
        "[BuildMessageContext] Using passed message history (incognito)",
        {
          operation: params.operation,
          historyLength: history.length,
        },
      );
    } else if (!params.isIncognito && params.threadId) {
      // Server: fetch message history from database
      if (params.operation === "answer-as-ai" && params.parentMessageId) {
        // For answer-as-ai: get all messages up to parent (not just branch)
        const allMessages = await db
          .select()
          .from(chatMessages)
          .where(eq(chatMessages.threadId, params.threadId))
          .orderBy(chatMessages.createdAt);

        const parentIndex = allMessages.findIndex(
          (msg) => msg.id === params.parentMessageId,
        );

        if (parentIndex !== -1) {
          history = allMessages.slice(0, parentIndex + 1);
        } else {
          params.logger.error("Parent message not found in thread", {
            parentMessageId: params.parentMessageId,
            threadId: params.threadId,
          });
        }
      } else {
        // For other operations: fetch history filtered by branch
        history = await fetchMessageHistory(
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

    // Add current user message to context (unless it's answer-as-ai or tool confirmations)
    const shouldAddCurrentMessage =
      params.operation !== "answer-as-ai" &&
      !params.hasToolConfirmations &&
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
        depth: 0,
        sequenceId: userMessageId,
        role: params.role,
        content: params.content,
        metadata: params.userMessageMetadata || null,
        model: null,
        character: null,
        upvotes: 0,
        downvotes: 0,
        authorId: params.userId || null,
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

    params.logger.debug("[BuildMessageContext] Built message context", {
      totalMessages: contextMessages.length,
      isIncognito: params.isIncognito,
    });

    let visionWarningMessage: string | null = null;

    if (params.upcomingResponseContext?.model) {
      const modelConfig =
        params.modelConfig ??
        getModelById(params.upcomingResponseContext.model);

      if (!modelConfig.features.imageInput) {
        const result = this.stripAttachmentsFromMessages(
          contextMessages,
          modelConfig.name,
        );

        if (result.totalRemoved > 0) {
          visionWarningMessage = result.warningMessage;
          params.logger.info(
            "[BuildMessageContext] Removed attachments for non-vision model",
            {
              model: modelConfig.name,
              attachmentsRemoved: result.totalRemoved,
              formats: result.formats.join(", "),
            },
          );
        }
      }
    }

    const messages =
      contextMessages.length > 0
        ? await MessageConverter.toAiSdkMessages(
            contextMessages,
            params.logger,
            params.timezone,
            params.rootFolderId,
          )
        : [];

    params.logger.debug("[BuildMessageContext] Converted to AI SDK format", {
      convertedMessages: messages.length,
    });

    // Add vision warning as system message if needed
    if (visionWarningMessage) {
      messages.push({
        role: "system",
        content: visionWarningMessage,
      });
    }

    if (params.hasToolConfirmations && params.toolConfirmationResults?.length) {
      params.logger.debug(
        "[BuildMessageContext] Adding tool confirmation results",
        {
          count: params.toolConfirmationResults.length,
        },
      );

      const { simpleT } = await import("@/i18n/core/shared");
      const { defaultLocale } = await import("@/i18n/core/config");

      for (const result of params.toolConfirmationResults) {
        const toolCall = result.toolCall;

        // Convert to AI SDK format - BOTH assistant tool-call AND tool result
        // Translate error messages for AI (using default locale for consistency)
        const output = toolCall.error
          ? {
              type: "error-text" as const,
              value:
                toolCall.error.message ===
                "app.api.agent.chat.aiStream.errors.userDeclinedTool"
                  ? simpleT(defaultLocale).t(toolCall.error.message)
                  : JSON.stringify({
                      message: toolCall.error.message,
                      params: toolCall.error.messageParams,
                    }),
            }
          : { type: "json" as const, value: toolCall.result ?? null };

        // Add ASSISTANT message with tool-call
        messages.push({
          role: "assistant",
          content: [
            {
              type: "tool-call",
              toolCallId: toolCall.toolCallId,
              toolName: toolCall.toolName,
              input: toolCall.args,
            },
          ],
        });

        // Add TOOL message with tool-result
        messages.push({
          role: "tool",
          content: [
            {
              type: "tool-result",
              toolCallId: toolCall.toolCallId,
              toolName: toolCall.toolName,
              output,
            },
          ],
        });
      }

      params.logger.debug(
        "[BuildMessageContext] Added tool confirmation results",
        {
          totalMessages: messages.length,
        },
      );
    }

    if (params.operation === "answer-as-ai") {
      const { CONTINUE_CONVERSATION_PROMPT } =
        await import("../system-prompt/generator");
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

    if (params.upcomingResponseContext) {
      const shortId = params.upcomingAssistantMessageId.slice(-8);
      const metadataParts: string[] = [`ID:${shortId}`];
      metadataParts.push(`Model:${params.upcomingResponseContext.model}`);
      if (params.upcomingResponseContext.character) {
        metadataParts.push(
          `Character:${params.upcomingResponseContext.character}`,
        );
      }

      const timestamp = formatAbsoluteTimestamp(
        params.upcomingAssistantMessageCreatedAt,
        params.timezone,
      );
      metadataParts.push(`Posted:${timestamp}`);

      messages.push({
        role: "system",
        content: `[Context: ${metadataParts.join(" | ")}]`,
      });
    }

    const messageHashes = messages.map((msg, idx) => {
      const content = JSON.stringify(msg);
      const hash = Buffer.from(content).toString("base64").slice(0, 16);
      const hasCacheControl = !!msg.providerOptions?.openrouter?.cacheControl;
      return {
        idx,
        role: msg.role,
        hash,
        contentLength: content.length,
        hasCacheControl,
        preview:
          msg.role === "user" ||
          msg.role === "assistant" ||
          msg.role === "system"
            ? typeof msg.content === "string"
              ? msg.content.slice(0, 100)
              : "[complex content]"
            : "[tool content]",
      };
    });

    const cacheBreakpoints = messageHashes
      .filter((m: { hasCacheControl: boolean }) => m.hasCacheControl)
      .map((m: { idx: number; role: string }) => `${m.idx}:${m.role}`);

    let lastAssistantIdx = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i]?.role === "assistant") {
        lastAssistantIdx = i;
        break;
      }
    }
    if (lastAssistantIdx >= 0) {
      cacheBreakpoints.push(`${lastAssistantIdx}:assistant (auto)`);
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
      const content = msg.content || "";

      // Tool messages with JSON results - use char/2.5
      if (msg.role === "tool" && content.includes("{")) {
        return sum + Math.ceil(content.length / 2.5);
      }

      // Regular messages - use char/4
      return sum + Math.ceil(content.length / 4);
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
      logger.info("[fetchBranchMessages] Incognito branch messages fetched", {
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

      logger.info("[fetchBranchMessages] Fetched all thread messages", {
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
      logger.info("[fetchBranchMessages] Server branch messages filtered", {
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
    model: ModelId;
    logger: EndpointLogger;
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
    } = params;

    // Step 1: Get branch messages (server DB or incognito storage)
    const branchMessages = await this.fetchBranchMessages({
      threadId,
      parentMessageId,
      isIncognito,
      messageHistory,
      logger,
    });

    logger.info("[Compacting] Fetched branch messages", {
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
    // If the last compacting failed, treat it as if it doesn't exist — use the previous successful one.
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
            depth: 0,
            sequenceId: currentUserMessageId,
            role: currentUserRole ?? ChatMessageRole.USER,
            content: currentUserContent,
            metadata: currentUserMetadata || null,
            model: null,
            character: null,
            upvotes: 0,
            downvotes: 0,
            authorId: userId || null,
            isAI: false,
            errorType: null,
            errorMessage: null,
            errorCode: null,
            searchVector: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          } satisfies ChatMessage)
        : null;

    logger.info("[Compacting] Created current user message", {
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
    const modelConfig = getModelById(model);
    const modelContextLimit = Math.floor(
      modelConfig.contextWindow * COMPACT_TRIGGER_PERCENTAGE,
    );
    const effectiveTrigger = Math.min(COMPACT_TRIGGER, modelContextLimit);

    const shouldCompact = totalTokens >= effectiveTrigger;

    logger.info("[Compacting] Token calculation", {
      totalTokens,
      compactTriggerAbsolute: COMPACT_TRIGGER,
      compactTriggerPercentage: COMPACT_TRIGGER_PERCENTAGE,
      modelContextWindow: modelConfig.contextWindow,
      modelContextLimit,
      effectiveTrigger,
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
      totalTokens,
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
    model: ModelId;
    character: string | null;
    timezone: string;
    rootFolderId?: DefaultFolderId;
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

    logger.info("[Compacting] Rebuilding history", {
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
      );
      messages.push(...converted);
    }

    // Add context system message for upcoming AI response
    const shortId = params.upcomingAssistantMessageId.slice(-8);
    const metadataParts: string[] = [`ID:${shortId}`];
    metadataParts.push(`Model:${params.model}`);
    if (params.character) {
      metadataParts.push(`Character:${params.character}`);
    }
    const timestamp = formatAbsoluteTimestamp(
      params.upcomingAssistantMessageCreatedAt,
      params.timezone,
    );
    metadataParts.push(`Posted:${timestamp}`);

    messages.push({
      role: "system",
      content: `[Context: ${metadataParts.join(" | ")}]`,
    });

    return messages.filter(Boolean);
  }
}
