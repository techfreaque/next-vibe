/**
 * AI Stream Repository
 * Handles AI streaming chat functionality with thread/message creation
 */

import "server-only";

import type { JSONValue } from "ai";
import type { NextRequest } from "next/server";
import {
  createStreamingResponse,
  ErrorResponseTypes,
  fail,
  type ResponseType,
  type StreamingResponse,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import type {
  AiStreamPostRequestOutput,
  AiStreamPostResponseOutput,
} from "../definition";
import { StreamErrorCatchHandler } from "./handlers/stream-error-catch-handler";
import { StreamExecutionHandler } from "./handlers/stream-execution-handler";
import { StreamStartHandler } from "./handlers/stream-start-handler";
import { setupAiStream } from "./stream-setup";

/**
 * Maximum duration for streaming responses (in seconds)
 */
export const maxDuration = 300; // 5 minutes for multi-step tool calling

/**
 * Extract user identifiers from request
 */
function extractUserIdentifiers(
  user: JwtPayloadType,
  request: NextRequest | undefined,
): {
  userId?: string;
  leadId?: string;
  ipAddress?: string;
} {
  const userId = !user.isPublic && "id" in user ? user.id : undefined;
  const leadId =
    "leadId" in user && typeof user.leadId === "string"
      ? user.leadId
      : undefined;
  const ipAddress = request
    ? request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      undefined
    : "cli";

  return { userId, leadId, ipAddress };
}

/**
 * AI Stream Repository Implementation
 */
export class AiStreamRepository {
  /**
   * Create AI streaming response with SSE events
   * Returns StreamingResponse for SSE stream or error ResponseType
   */
  static async createAiStream({
    data,
    t,
    locale,
    logger,
    user,
    request,
  }: {
    data: AiStreamPostRequestOutput;
    t: TFunction;
    locale: CountryLanguage;
    logger: EndpointLogger;
    user: JwtPayloadType;
    request: NextRequest | undefined;
  }): Promise<ResponseType<AiStreamPostResponseOutput> | StreamingResponse> {
    const { userId, leadId, ipAddress } = extractUserIdentifiers(user, request);

    const setupResult = await setupAiStream({
      data,
      locale,
      logger,
      user,
      userId,
      leadId,
      ipAddress,
      t,
      maxDuration,
      request,
    });

    if (!setupResult.success) {
      return setupResult;
    }

    const {
      isIncognito,
      modelCost,
      effectiveParentMessageId,
      effectiveContent,
      effectiveRole,
      threadId: threadResultThreadId,
      isNewThread,
      messageDepth,
      userMessageId,
      messages,
      systemPrompt,
      toolConfirmationResults,
      voiceMode,
      voiceTranscription,
      userMessageMetadata,
      fileUploadPromise,
      modelConfig,
      tools,
      toolsConfig,
      provider,
      encoder,
      streamAbortController,
    } = setupResult.data;

    // Step 9: Start AI streaming (for all operations including answer-as-ai)
    try {
      const stream = new ReadableStream({
        async start(controller): Promise<void> {
          // Initialize stream context, TTS handler, and emit initial events
          const { ctx, ttsHandler, emittedToolResultIds } =
            StreamStartHandler.initializeStream({
              userMessageId,
              effectiveParentMessageId,
              messageDepth,
              toolConfirmationResults,
              voiceMode,
              voiceTranscription,
              userMessageMetadata,
              fileUploadPromise,
              isNewThread,
              threadId: threadResultThreadId,
              rootFolderId: data.rootFolderId,
              subFolderId: data.subFolderId,
              effectiveContent,
              operation: data.operation,
              effectiveRole,
              messages,
              controller,
              encoder,
              locale,
              userId,
              logger,
            });

          try {
            await StreamExecutionHandler.executeStream({
              provider,
              modelConfig,
              messages,
              temperature: data.temperature,
              streamAbortController,
              systemPrompt,
              tools,
              toolsConfig,
              ctx,
              threadId: threadResultThreadId,
              model: data.model,
              character: data.character,
              isIncognito,
              userId,
              emittedToolResultIds,
              ttsHandler,
              user,
              modelCost,
              controller,
              encoder,
              logger,
            });
          } catch (error) {
            await StreamErrorCatchHandler.handleError({
              error: error as Error | JSONValue,
              ctx,
              maxDuration,
              model: data.model,
              threadId: threadResultThreadId,
              isIncognito,
              userId,
              controller,
              encoder,
              logger,
            });
          }
        },

        // Handle client disconnect - abort the stream
        cancel(reason): void {
          logger.info("[AI Stream] Stream cancelled by client", {
            reason: String(reason),
          });
          streamAbortController.abort(new Error("Client disconnected"));
        },
      });

      return createStreamingResponse(
        new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        }),
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error("Failed to create AI stream", {
        error: errorMessage,
        model: data.model,
      });

      return fail({
        message:
          "app.api.agent.chat.aiStream.route.errors.streamCreationFailed",
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        messageParams: {
          error: errorMessage,
        },
      });
    }
  }
}
