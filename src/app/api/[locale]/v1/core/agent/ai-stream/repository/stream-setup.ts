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
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import { getUserPublicName } from "@/app/api/[locale]/v1/core/user/repository";
import type { CountryLanguage } from "@/i18n/core/config";

import { ChatMessageRole } from "../../chat/enum";
import { getModelCost } from "../../chat/model-access/costs";
import { ensureThread } from "../../chat/threads/repository";
import {
  calculateMessageDepth,
  createUserMessage,
  handleEditOperation,
  handleRetryOperation,
  handleAnswerAsAiOperation,
} from "../../chat/threads/[threadId]/messages/repository";
import type { AiStreamPostRequestOutput } from "../definition";
import { buildSystemPrompt } from "../system-prompt-builder";

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

interface HandleSendOperationResult {
  threadId: string | null | undefined;
  parentMessageId: string | null | undefined;
  content: string;
  role: ChatMessageRole;
}

function handleSendOperation(
  data: AiStreamPostRequestOutput,
): HandleSendOperationResult {
  return {
    threadId: data.threadId,
    parentMessageId: data.parentMessageId,
    content: data.content,
    role: data.role,
  };
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
  buildMessageContext: (contextParams: {
    operation: "send" | "retry" | "edit" | "answer-as-ai";
    threadId: string | null | undefined;
    parentMessageId: string | null | undefined;
    content: string;
    role: ChatMessageRole;
    userId: string | undefined;
    isIncognito: boolean;
    messageHistory: Array<{
      role: ChatMessageRole;
      content: string;
    }> | null;
    logger: EndpointLogger;
  }) => Promise<
    Array<{ role: "user" | "assistant" | "system"; content: string }>
  >;
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
      operationResult = handleSendOperation(data);
      break;

    case "retry":
      if (isIncognito) {
        logger.info("Retry operation in incognito mode", {
          parentMessageId: data.parentMessageId,
        });
        operationResult = handleSendOperation(data);
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
          threadId: data.threadId!,
          parentMessageId: data.parentMessageId,
          content: data.content,
          role: data.role,
        };
      } else {
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
      operationResult = handleAnswerAsAiOperation(data);
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

  const messages = await params.buildMessageContext({
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
