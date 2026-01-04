/**
 * OperationHandler - Handles operation processing and audio transcription
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { ChatMessageRole } from "../../../chat/enum";
import { SpeechToTextRepository } from "../../../speech-to-text/repository";
import type { AiStreamPostRequestOutput } from "../../definition";

export class OperationHandler {
  /**
   * Process operation and handle audio transcription if present
   */
  static async processOperation(params: {
    operation: AiStreamPostRequestOutput["operation"];
    data: AiStreamPostRequestOutput;
    user: JwtPayloadType;
    locale: CountryLanguage;
    logger: EndpointLogger;
  }): Promise<
    ResponseType<{
      threadId: string;
      parentMessageId: string | null | undefined;
      content: string;
      role: ChatMessageRole;
      voiceTranscription: {
        wasTranscribed: boolean;
        confidence: number | null;
        durationSeconds: number | null;
      } | null;
    }>
  > {
    const { operation, data, user, locale, logger } = params;

    let voiceTranscription: {
      wasTranscribed: boolean;
      confidence: number | null;
      durationSeconds: number | null;
    } | null = null;

    let operationResult: {
      threadId: string;
      parentMessageId: string | null | undefined;
      content: string;
      role: ChatMessageRole;
    };

    switch (operation) {
      case "send":
      case "retry":
      case "edit":
        // Audio input transcription
        if (data.audioInput?.file) {
          logger.debug("[Setup] Audio input detected, transcribing...", {
            operation,
            fileSize: data.audioInput.file.size,
            fileType: data.audioInput.file.type,
          });

          const transcriptionResult = await SpeechToTextRepository.transcribeAudio(
            data.audioInput.file,
            user,
            locale,
            logger,
          );

          if (!transcriptionResult.success) {
            logger.error("[Setup] Audio transcription failed", {
              error: transcriptionResult.message,
            });
            return transcriptionResult;
          }

          const transcribedText = transcriptionResult.data.response.text;
          const confidence = transcriptionResult.data.response.confidence ?? null;
          logger.debug("[Setup] Audio transcription successful", {
            textLength: transcribedText.length,
            confidence,
          });

          // Store transcription metadata for VOICE_TRANSCRIBED event
          voiceTranscription = {
            wasTranscribed: true,
            confidence,
            durationSeconds: null, // STT response doesn't expose duration here
          };

          // Use transcribed text as content
          operationResult = {
            threadId: data.threadId,
            parentMessageId: data.parentMessageId,
            content: transcribedText,
            role: data.role,
          };
        } else {
          // No audio - use provided content
          operationResult = {
            threadId: data.threadId,
            parentMessageId: data.parentMessageId,
            content: data.content,
            role: data.role,
          };
        }
        break;

      case "answer-as-ai":
        operationResult = data;
        logger.debug("Answer-as-AI operation", {
          threadId: data.threadId,
          parentMessageId: data.parentMessageId,
        });
        break;
    }

    return {
      success: true,
      data: {
        threadId: operationResult.threadId,
        parentMessageId: operationResult.parentMessageId,
        content: operationResult.content,
        role: operationResult.role,
        voiceTranscription,
      },
    };
  }
}
