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
import type { ToolExecutionContext } from "../../../chat/config";
import type { ChatMessage, ToolCall } from "../../../chat/db";
import { chatMessages } from "../../../chat/db";
import type { AiStreamT } from "../../stream/i18n";
import { ToolConfirmationHandler } from "./tool-confirmation-handler";

export class ToolConfirmationProcessor {
  /**
   * Process all tool confirmations and collect results
   */
  static async processAll(params: {
    toolConfirmations: Array<{ messageId: string; confirmed: boolean }>;
    messageHistory: ChatMessage[] | undefined;
    isIncognito: boolean;
    locale: CountryLanguage;
    logger: EndpointLogger;
    user: JwtPayloadType;
    t: AiStreamT;
    streamContext: ToolExecutionContext;
  }): Promise<
    ResponseType<
      Array<{
        messageId: string;
        sequenceId: string;
        toolCall: ToolCall;
      }>
    >
  > {
    const {
      toolConfirmations,
      messageHistory,
      isIncognito,
      locale,
      logger,
      user,
      t,
    } = params;

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
      const confirmResult =
        await ToolConfirmationHandler.handleToolConfirmation({
          toolConfirmation,
          messageHistory,
          isIncognito,
          locale,
          logger,
          user,
          t,
          streamContext: params.streamContext,
        });

      if (!confirmResult.success) {
        return confirmResult;
      }

      // wakeUpPending=true means the goroutine is still running - resume-stream handles
      // the deferred insertion and revival. Still include the updated tool message so
      // the AI can reason about it (sees wakeUp pending state, responds naturally).
      // The tool message has waitingForConfirmation=false and callbackMode=wakeUp so
      // message-converter emits the standard wakeUp placeholder result for the AI.
      if (confirmResult.data.wakeUpPending) {
        logger.debug(
          "[Setup] wakeUpPending tool - including in confirm stream so AI can reason",
          {
            messageId: confirmResult.data.toolMessageId,
          },
        );
        // Fall through to the standard result-push below - same path as non-wakeUp.
      }

      // toolMessageId is either the original (updated in-place) or a new deferred row.
      const toolMessageId = confirmResult.data.toolMessageId;
      const updatedMessage = await db.query.chatMessages.findFirst({
        where: eq(chatMessages.id, toolMessageId),
      });

      if (updatedMessage?.metadata?.toolCall) {
        results.push({
          messageId: toolMessageId,
          sequenceId: updatedMessage.sequenceId ?? crypto.randomUUID(),
          toolCall: updatedMessage.metadata.toolCall,
        });
      }
    }

    logger.debug(
      "[Setup] All tools executed - continuing with AI stream to process results",
      {
        resultsCount: results.length,
      },
    );

    return {
      success: true,
      data: results,
    };
  }
}
