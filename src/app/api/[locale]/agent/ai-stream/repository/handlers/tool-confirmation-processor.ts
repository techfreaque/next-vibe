/**
 * ToolConfirmationProcessor - Processes all tool confirmations in batch
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { db } from "../../../../system/db";
import type { ChatMessage, ToolCall } from "../../../chat/db";
import { chatMessages } from "../../../chat/db";
import { ToolConfirmationHandler } from "./tool-confirmation-handler";

export class ToolConfirmationProcessor {
  /**
   * Process all tool confirmations and collect results
   */
  static async processAll(params: {
    toolConfirmations: Array<{ messageId: string; confirmed: boolean }>;
    messageHistory: ChatMessage[] | undefined;
    isIncognito: boolean;
    userId: string | undefined;
    locale: CountryLanguage;
    logger: EndpointLogger;
    user: JwtPayloadType;
  }): Promise<
    ResponseType<
      Array<{
        messageId: string;
        sequenceId: string;
        toolCall: ToolCall;
      }>
    >
  > {
    const { toolConfirmations, messageHistory, isIncognito, userId, locale, logger, user } = params;

    logger.debug("[Setup] Processing tool confirmations", {
      count: toolConfirmations.length,
      messageIds: toolConfirmations.map((tc) => tc.messageId),
    });

    const results: Array<{
      messageId: string;
      sequenceId: string;
      toolCall: ToolCall;
    }> = [];

    // Process all confirmations and collect results
    for (const toolConfirmation of toolConfirmations) {
      const confirmResult = await ToolConfirmationHandler.handleToolConfirmation({
        toolConfirmation,
        messageHistory,
        isIncognito,
        userId,
        locale,
        logger,
        user,
      });

      if (!confirmResult.success) {
        return confirmResult;
      }

      // Get the updated message from database to retrieve the full toolCall data
      const updatedMessage = await db.query.chatMessages.findFirst({
        where: eq(chatMessages.id, toolConfirmation.messageId),
      });

      if (updatedMessage?.metadata?.toolCall) {
        results.push({
          messageId: toolConfirmation.messageId,
          sequenceId: updatedMessage.sequenceId ?? crypto.randomUUID(),
          toolCall: updatedMessage.metadata.toolCall,
        });
      }
    }

    logger.debug("[Setup] All tools executed - continuing with AI stream to process results", {
      resultsCount: results.length,
    });

    return {
      success: true,
      data: results,
    };
  }
}
