/**
 * UserMessageHandler - Handles user message creation in setup
 */

import "server-only";

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { UserRepository } from "@/app/api/[locale]/user/repository";

import type { ChatMessageRole } from "../../../chat/enum";
import { createUserMessage } from "../../../chat/threads/[threadId]/messages/repository";
import { FileAttachmentHandler } from "./file-attachment-handler";

export class UserMessageHandler {
  /**
   * Create user message with optional file attachments
   */
  static async createUserMessageWithAttachments(params: {
    userMessageId: string | null;
    operation: "send" | "retry" | "edit" | "answer-as-ai";
    hasToolConfirmations: boolean;
    isIncognito: boolean;
    threadId: string;
    effectiveRole: ChatMessageRole;
    effectiveContent: string;
    effectiveParentMessageId: string | null | undefined;
    messageDepth: number;
    userId: string | undefined;
    attachments?: File[];
    logger: EndpointLogger;
  }): Promise<
    ResponseType<{
      userMessageId: string | null;
      fileUploadPromise?: Promise<{
        success: boolean;
        userMessageId: string;
        attachments?: Array<{
          id: string;
          url: string;
          filename: string;
          mimeType: string;
          size: number;
        }>;
      }>;
      attachmentMetadata?: Array<{
        id: string;
        url: string;
        filename: string;
        mimeType: string;
        size: number;
        data?: string;
      }>;
    }>
  > {
    const {
      userMessageId,
      operation,
      hasToolConfirmations,
      isIncognito,
      threadId,
      effectiveRole,
      effectiveContent,
      effectiveParentMessageId,
      messageDepth,
      userId,
      attachments,
      logger,
    } = params;

    // For "answer-as-ai", we don't create a user message
    if (operation === "answer-as-ai") {
      logger.debug("[Setup] ✅ SKIPPING user message creation", {
        operation,
        reason: "answer-as-ai operation",
      });
      return success({ userMessageId: null });
    }

    // For tool confirmations, we don't create a user message
    if (hasToolConfirmations) {
      logger.debug("[Setup] ✅ SKIPPING user message creation for tool confirmations", {
        count: hasToolConfirmations,
        operation,
      });
      return success({ userMessageId });
    }

    logger.debug("[Setup] Creating user message", {
      messageId: userMessageId,
      operation,
      threadId,
    });

    // User message should NOT be in messageHistory for incognito - client creates it with loading state
    // Both modes: API processes voice/attachments and emits events to update the loading message

    // At this point, userMessageId should not be null
    if (!userMessageId) {
      logger.error("userMessageId is required for user message creation");
      return fail({
        message: "app.api.agent.chat.aiStream.route.errors.invalidJson",
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    const authorName = isIncognito ? null : await UserRepository.getUserPublicName(userId, logger);

    let fileUploadPromise:
      | Promise<{
          success: boolean;
          userMessageId: string;
          attachments?: Array<{
            id: string;
            url: string;
            filename: string;
            mimeType: string;
            size: number;
          }>;
        }>
      | undefined;

    let attachmentMetadata: Array<{
      id: string;
      url: string;
      filename: string;
      mimeType: string;
      size: number;
      data?: string;
    }> = [];

    // Process attachments (both modes)
    if (attachments && attachments.length > 0) {
      logger.debug("[File Processing] Processing file attachments", {
        fileCount: attachments.length,
        isIncognito,
      });

      // Convert to base64 immediately for AI (both modes)
      attachmentMetadata = await Promise.all(
        attachments.map(async (file) => {
          const buffer = Buffer.from(await file.arrayBuffer());
          return {
            id: "", // Will be updated after upload for server mode
            url: "", // Will be updated after upload for server mode
            filename: file.name,
            mimeType: file.type,
            size: file.size,
            data: buffer.toString("base64"), // For immediate AI use
          };
        }),
      );

      // Server mode: Upload to storage in background
      if (!isIncognito) {
        fileUploadPromise = FileAttachmentHandler.processFileAttachments({
          attachments,
          threadId,
          userMessageId,
          userId,
          logger,
        }).then(async (result) => {
          if (result.success) {
            // Update message with permanent URLs only (no base64 in DB)
            await FileAttachmentHandler.updateMessageWithAttachments({
              userMessageId,
              attachments: result.data,
              logger,
            });

            return {
              success: true,
              userMessageId,
              attachments: result.data,
            };
          } else {
            logger.error("[File Processing] Failed to upload attachments to storage", {
              messageId: userMessageId,
              errorMessage: result.message,
            });

            return {
              success: false,
              userMessageId,
            };
          }
        });
      }
    }

    // Create user message in DB (server mode only - incognito stores in localStorage)
    if (!isIncognito) {
      await createUserMessage({
        messageId: userMessageId,
        threadId,
        role: effectiveRole,
        content: effectiveContent,
        parentId: effectiveParentMessageId ?? null,
        depth: messageDepth,
        userId,
        authorName,
        logger,
        attachments: attachmentMetadata.length > 0 ? attachmentMetadata : undefined,
      });
    }

    return success({
      userMessageId,
      fileUploadPromise,
      attachmentMetadata: attachmentMetadata.length > 0 ? attachmentMetadata : undefined,
    });
  }
}
