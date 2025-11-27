/**
 * AI Stream Setup
 * Handles validation, credit checks, and preparation before streaming
 */

import "server-only";

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { creditValidator } from "@/app/api/[locale]/v1/core/credits/validator";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import { getUserPublicName } from "@/app/api/[locale]/v1/core/user/repository";
import type { CountryLanguage } from "@/i18n/core/config";

import { ChatMessageRole } from "../../chat/enum";
import { getModelCost } from "../../chat/model-access/costs";
import { ensureThread } from "../../chat/threads/repository";
import {
  calculateMessageDepth,
  createUserMessage,
  fetchMessageHistory,
  handleEditOperation,
  handleRetryOperation,
} from "../../chat/threads/[threadId]/messages/repository";
import type { AiStreamPostRequestOutput } from "../definition";
import { buildSystemPrompt } from "../system-prompt-builder";
import { CONTINUE_CONVERSATION_PROMPT } from "../system-prompt";
import { chatMessages } from "../../chat/db";
import { eq } from "drizzle-orm";
import { db } from "../../../system/db";

export interface StreamSetupResult {
  userId: string | undefined;
  leadId: string | undefined;
  effectiveLeadId: string | undefined;
  isIncognito: boolean;
  modelCost: number;
  effectiveThreadId: string | null | undefined;
  effectiveParentMessageId: string | null | undefined;
  effectiveContent: string;
  effectiveRole: ChatMessageRole;
  threadId: string;
  isNewThread: boolean;
  messageDepth: number;
  userMessageId: string;
  aiMessageId: string;
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
  systemPrompt: string;
}

function toChatMessageRole(
  role: string,
): ChatMessageRole.USER | ChatMessageRole.ASSISTANT | ChatMessageRole.SYSTEM {
  const roleLower = role.toLowerCase();
  if (roleLower === "assistant") {
    return ChatMessageRole.ASSISTANT;
  }
  if (roleLower === "system") {
    return ChatMessageRole.SYSTEM;
  }
  return ChatMessageRole.USER;
}

export async function setupAiStream(params: {
  data: AiStreamPostRequestOutput;
  locale: CountryLanguage;
  logger: EndpointLogger;
  user: JwtPayloadType;
  userId: string | undefined;
  leadId: string | undefined;
  ipAddress: string | undefined;
}): Promise<
  | { success: false; error: ResponseType<never> }
  | { success: true; data: StreamSetupResult }
> {
  const { data, locale, logger, user, userId, leadId, ipAddress } = params;
  const isIncognito = data.rootFolderId === "incognito";

  logger.debug("Setting up AI stream", {
    operation: data.operation,
    model: data.model,
    rootFolderId: data.rootFolderId,
    isIncognito,
    userId,
    leadId,
  });

  if (!userId && !leadId && !isIncognito) {
    logger.error("User has neither userId nor leadId", {
      rootFolderId: data.rootFolderId,
    });
    return {
      success: false,
      error: fail({
        message:
          "app.api.v1.core.agent.chat.aiStream.route.errors.authenticationRequired",
        errorType: ErrorResponseTypes.AUTH_ERROR,
      }),
    };
  }

  const modelCost = getModelCost(data.model);
  let validationResult;
  let effectiveLeadId = leadId;

  if (userId) {
    validationResult = await creditValidator.validateUserCredits(
      userId,
      data.model,
      logger,
    );
  } else if (leadId) {
    validationResult = await creditValidator.validateLeadCredits(
      leadId,
      data.model,
      logger,
    );
  } else if (ipAddress) {
    const leadByIpResult = await creditValidator.validateLeadByIp(
      ipAddress,
      data.model,
      locale,
      logger,
    );

    if (!leadByIpResult.success) {
      return {
        success: false,
        error: fail({
          message:
            "app.api.v1.core.agent.chat.aiStream.route.errors.creditValidationFailed",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        }),
      };
    }

    effectiveLeadId = leadByIpResult.data.leadId;
    validationResult = {
      success: true,
      data: leadByIpResult.data.validation,
    };
  } else {
    logger.error("No user, lead, or IP address provided");
    return {
      success: false,
      error: fail({
        message:
          "app.api.v1.core.agent.chat.aiStream.route.errors.noIdentifier",
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      }),
    };
  }

  if (!validationResult.success) {
    return {
      success: false,
      error: fail({
        message:
          "app.api.v1.core.agent.chat.aiStream.route.errors.creditValidationFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      }),
    };
  }

  if (!validationResult.data.canUseModel) {
    logger.warn("Insufficient credits", {
      userId,
      leadId: effectiveLeadId,
      model: data.model,
      cost: modelCost,
      balance: validationResult.data.balance,
    });

    return {
      success: false,
      error: fail({
        message:
          "app.api.v1.core.agent.chat.aiStream.route.errors.insufficientCredits",
        errorType: ErrorResponseTypes.FORBIDDEN,
        messageParams: {
          cost: modelCost.toString(),
          balance: validationResult.data.balance.toString(),
        },
      }),
    };
  }

  logger.debug("Credit validation passed", {
    userId,
    leadId: effectiveLeadId,
    cost: modelCost,
    balance: validationResult.data.balance,
  });

  let operationResult: {
    threadId: string | null | undefined;
    parentMessageId: string | null | undefined;
    content: string;
    role: ChatMessageRole;
  };

  switch (data.operation) {
    case "send":
      operationResult = data;
      break;

    case "retry":
      if (isIncognito) {
        logger.info("Retry operation in incognito mode", {
          parentMessageId: data.parentMessageId,
        });
        operationResult = data;
      } else {
        const retryResult = await handleRetryOperation(data, userId, logger);
        if (!retryResult) {
          return {
            success: false,
            error: fail({
              message:
                "app.api.v1.core.agent.chat.aiStream.post.errors.notFound.title",
              errorType: ErrorResponseTypes.NOT_FOUND,
            }),
          };
        }
        operationResult = retryResult;
      }
      break;

    case "edit":
      if (isIncognito) {
        operationResult = {
          threadId: data.threadId,
          parentMessageId: data.parentMessageId,
          content: data.content,
          role: data.role,
        };
      } else {
        if (!userId) {
          logger.error("Edit operation requires user ID");
          return {
            success: false,
            error: fail({
              message:
                "app.api.v1.core.agent.chat.aiStream.post.errors.forbidden.title",
              errorType: ErrorResponseTypes.FORBIDDEN,
            }),
          };
        }
        const editResult = await handleEditOperation(data, userId, logger);
        if (!editResult) {
          return {
            success: false,
            error: fail({
              message:
                "app.api.v1.core.agent.chat.aiStream.post.errors.notFound.title",
              errorType: ErrorResponseTypes.NOT_FOUND,
            }),
          };
        }
        operationResult = editResult;
      }
      break;

    case "answer-as-ai":
      operationResult = data;
      logger.info("Answer-as-AI operation", {
        threadId: data.threadId,
        parentMessageId: data.parentMessageId,
      });
      break;
  }

  const effectiveThreadId = operationResult.threadId;
  const effectiveParentMessageId = operationResult.parentMessageId;
  const effectiveContent = operationResult.content;
  const effectiveRole = operationResult.role;

  let threadResult;
  try {
    threadResult = await ensureThread({
      threadId: effectiveThreadId,
      rootFolderId: data.rootFolderId,
      subFolderId: data.subFolderId,
      userId,
      leadId,
      content: effectiveContent,
      isIncognito,
      logger,
      user,
    });
  } catch (error) {
    logger.error("Failed to ensure thread - RAW ERROR", parseError(error), {
      errorType: typeof error,
      errorConstructor:
        error instanceof Error ? error.constructor.name : "unknown",
    });

    const errorMessage = parseError(error).message;
    logger.error("Failed to ensure thread - PARSED", {
      parsedMessage: errorMessage,
    });

    if (errorMessage === "PERMISSION_DENIED") {
      return {
        success: false,
        error: fail({
          message:
            "app.api.v1.core.agent.chat.aiStream.post.errors.forbidden.title",
          errorType: ErrorResponseTypes.FORBIDDEN,
        }),
      };
    }

    return {
      success: false,
      error: fail({
        message:
          "app.api.v1.core.agent.chat.aiStream.post.errors.notFound.title",
        errorType: ErrorResponseTypes.NOT_FOUND,
      }),
    };
  }

  const messageDepth = await calculateMessageDepth(
    effectiveParentMessageId,
    isIncognito,
  );

  const userMessageId = crypto.randomUUID();
  if (data.operation !== "answer-as-ai" && data.operation !== "retry") {
    if (!isIncognito) {
      const authorName = await getUserPublicName(userId, logger);

      await createUserMessage({
        messageId: userMessageId,
        threadId: threadResult.threadId,
        role: effectiveRole,
        content: effectiveContent,
        parentId: effectiveParentMessageId ?? null,
        depth: messageDepth,
        userId,
        authorName,
        logger,
      });
    } else {
      logger.debug("Generated incognito user message ID", {
        messageId: userMessageId,
        operation: data.operation,
      });
    }
  }

  // Build complete system prompt from persona and formatting instructions
  const systemPrompt = await buildSystemPrompt({
    personaId: data.persona,
    userId,
    logger,
  });

  logger.debug("System prompt built", {
    systemPromptLength: systemPrompt.length,
    hasPersona: !!data.persona,
  });

  const messages = await buildMessageContext({
    operation: data.operation,
    threadId: effectiveThreadId,
    parentMessageId: data.parentMessageId,
    content: effectiveContent,
    role: effectiveRole,
    userId,
    isIncognito,
    messageHistory: data.messageHistory
      ? data.messageHistory.map((msg) => ({
          role: toChatMessageRole(msg.role),
          content: msg.content,
        }))
      : null,
    logger,
  });

  if (
    !isIncognito &&
    systemPrompt &&
    messages.length > 0 &&
    messages[0].role !== "system"
  ) {
    messages.unshift({ role: "system", content: systemPrompt });
  }

  const aiMessageId = crypto.randomUUID();
  logger.debug("Generated AI message ID", {
    messageId: aiMessageId,
    operation: data.operation,
    isIncognito,
  });

  return {
    success: true,
    data: {
      userId,
      leadId,
      effectiveLeadId,
      isIncognito,
      modelCost,
      effectiveThreadId,
      effectiveParentMessageId,
      effectiveContent,
      effectiveRole,
      threadId: threadResult.threadId,
      isNewThread: threadResult.isNew,
      messageDepth,
      userMessageId,
      aiMessageId,
      messages,
      systemPrompt,
    },
  };
}

/**
 * Build message context for AI
 */
async function buildMessageContext(params: {
  operation: "send" | "retry" | "edit" | "answer-as-ai";
  threadId: string | null | undefined;
  parentMessageId: string | null | undefined;
  content: string;
  role: ChatMessageRole;
  userId: string | undefined;
  isIncognito: boolean;
  messageHistory?: Array<{
    role: ChatMessageRole;
    content: string;
  }> | null;
  logger: EndpointLogger;
}): Promise<Array<{ role: "user" | "assistant" | "system"; content: string }>> {
  // SECURITY: Reject messageHistory for non-incognito threads
  // Non-incognito threads must fetch history from database to prevent manipulation
  if (!params.isIncognito && params.messageHistory) {
    params.logger.error(
      "Security violation: messageHistory provided for non-incognito thread",
      {
        operation: params.operation,
        threadId: params.threadId,
        isIncognito: params.isIncognito,
      },
    );
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Security violation should throw immediately
    throw new Error(
      "messageHistory is only allowed for incognito mode. Server-side threads fetch history from database.",
    );
  }

  if (params.operation === "answer-as-ai") {
    // For incognito mode, use provided message history
    if (params.isIncognito && params.messageHistory) {
      const messages = toAiSdkMessages(params.messageHistory);
      if (params.content.trim()) {
        messages.push({ role: "user", content: params.content });
      } else {
        messages.push({
          role: "user",
          content: CONTINUE_CONVERSATION_PROMPT,
        });
      }
      return messages;
    }

    // For non-incognito mode, fetch from database
    if (
      !params.isIncognito &&
      params.userId &&
      params.threadId &&
      params.parentMessageId
    ) {
      const allMessages = await db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.threadId, params.threadId))
        .orderBy(chatMessages.createdAt);

      const parentIndex = allMessages.findIndex(
        (msg) => msg.id === params.parentMessageId,
      );

      if (parentIndex !== -1) {
        const contextMessages = allMessages.slice(0, parentIndex + 1);
        const messages = toAiSdkMessages(contextMessages);

        if (params.content.trim()) {
          messages.push({ role: "user", content: params.content });
        } else {
          messages.push({
            role: "user",
            content: CONTINUE_CONVERSATION_PROMPT,
          });
        }
        return messages;
      } else {
        params.logger.error("Parent message not found in thread", {
          parentMessageId: params.parentMessageId,
          threadId: params.threadId,
        });
        return params.content.trim()
          ? [{ role: "user", content: params.content }]
          : [];
      }
    } else if (params.content.trim()) {
      return [{ role: "user", content: params.content }];
    } else {
      return [];
    }
  } else if (!params.isIncognito && params.userId && params.threadId) {
    // Non-incognito mode: fetch history from database filtered by branch
    const history = await fetchMessageHistory(
      params.threadId,
      params.userId,
      params.logger,
      params.parentMessageId ?? null, // Pass parent message ID for branch filtering, convert undefined to null
    );
    const historyMessages = toAiSdkMessages(history);
    const currentMessage = toAiSdkMessage({
      role: params.role,
      content: params.content,
    });
    if (!currentMessage) {
      return historyMessages;
    }
    return [...historyMessages, currentMessage];
  } else if (params.isIncognito && params.messageHistory) {
    // Incognito mode with message history: use provided history from client
    params.logger.debug("Using provided message history for incognito mode", {
      operation: params.operation,
      historyLength: params.messageHistory.length,
    });
    const historyMessages = toAiSdkMessages(params.messageHistory);
    const currentMessage = toAiSdkMessage({
      role: params.role,
      content: params.content,
    });
    if (!currentMessage) {
      return historyMessages;
    }
    return [...historyMessages, currentMessage];
  } else {
    // Fallback: no thread or no history (new conversation)
    const currentMessage = toAiSdkMessage({
      role: params.role,
      content: params.content,
    });
    if (!currentMessage) {
      return [];
    }
    return [currentMessage];
  }
}

/**
 * Convert ChatMessageRole enum to AI SDK compatible role
 * Skips TOOL messages (they have empty content and are not needed in AI context)
 * Converts ERROR -> ASSISTANT (so errors stay in chain)
 */
function toAiSdkMessage(message: { role: ChatMessageRole; content: string }): {
  role: "user" | "assistant" | "system";
  content: string;
} | null {
  switch (message.role) {
    case ChatMessageRole.USER:
      return { content: message.content, role: "user" };
    case ChatMessageRole.ASSISTANT:
      return { content: message.content, role: "assistant" };
    case ChatMessageRole.SYSTEM:
      return { content: message.content, role: "system" };
    case ChatMessageRole.TOOL:
      // Skip TOOL messages - they have empty content and are not needed in AI context
      // The AI already knows about tool calls from the previous ASSISTANT message
      return null;
    case ChatMessageRole.ERROR:
      // Error messages become ASSISTANT messages so they stay in the chain
      return { content: message.content, role: "assistant" };
  }
}

function toAiSdkMessages(
  messages: Array<{ role: ChatMessageRole; content: string }>,
): Array<{ role: "user" | "assistant" | "system"; content: string }> {
  return messages
    .map((msg) => toAiSdkMessage(msg))
    .filter(
      (
        msg,
      ): msg is { role: "user" | "assistant" | "system"; content: string } =>
        msg !== null,
    );
}
