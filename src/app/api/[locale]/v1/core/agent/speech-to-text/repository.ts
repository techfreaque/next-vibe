/**
 * Speech-to-Text Repository
 * Handles audio transcription using Eden AI
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/logger-types";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";

import type { JwtPayloadType } from "../../user/auth/definition";
import { FEATURE_COSTS } from "../chat/model-access/costs";
import { deductCredits } from "../shared/credit-deduction";
import type {
  SpeechToTextPostRequestOutput,
  SpeechToTextPostResponseOutput,
} from "./definition";

/**
 * Maximum polling attempts for async transcription
 */
const MAX_POLLING_ATTEMPTS = 30;
const POLLING_INTERVAL_MS = 1000;

/**
 * Eden AI transcription result structure
 */
interface EdenAITranscriptionResult {
  status: "pending" | "processing" | "finished" | "failed";
  results: {
    [provider: string]: {
      text?: string;
      confidence?: number;
    };
  };
}

/**
 * Speech-to-Text Repository Interface
 */
export interface SpeechToTextRepository {
  /**
   * Transcribe audio to text
   * @param file - Audio file to transcribe
   * @param data - Transcription request data
   * @param user - User information
   * @param locale - User locale
   * @param logger - Logger instance
   * @returns Transcription response
   */
  transcribeAudio(
    file: File,
    data: SpeechToTextPostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SpeechToTextPostResponseOutput>>;
}

/**
 * Speech-to-Text Repository Implementation
 */
export class SpeechToTextRepositoryImpl implements SpeechToTextRepository {
  /**
   * Transcribe audio to text
   */
  async transcribeAudio(
    file: File,
    data: SpeechToTextPostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SpeechToTextPostResponseOutput>> {
    logger.info("Starting audio transcription", {
      provider: data.provider,
      language: data.language,
      fileSize: file.size,
      fileName: file.name,
      mimeType: file.type,
    });

    try {
      // Convert File to Buffer for Eden AI
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Create form data for Eden AI
      const formData = new FormData();
      const blob = new Blob([buffer], { type: file.type });
      formData.append("file", blob, file.name);
      formData.append("providers", data.provider);
      formData.append("language", data.language);

      logger.debug("Sending request to Eden AI", {
        provider: data.provider,
        language: data.language,
      });

      // Call Eden AI API
      const response = await fetch(
        "https://api.edenai.run/v2/audio/speech_to_text_async",
        {
          method: "POST",
          headers: {
            // eslint-disable-next-line i18next/no-literal-string
            Authorization: `Bearer ${env.EDEN_AI_API_KEY}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        logger.error("Eden AI API error", {
          status: response.status,
          error: errorText,
        });
        return createErrorResponse(
          "app.api.v1.core.agent.speechToText.post.errors.transcriptionFailed",
          ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          {
            error: errorText,
          },
        );
      }

      const responseData = (await response.json()) as {
        public_id?: string;
      };
      const publicId = responseData.public_id;

      if (!publicId) {
        logger.error("No public ID received from Eden AI");
        return createErrorResponse(
          "app.api.v1.core.agent.speechToText.post.errors.noPublicId",
          ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        );
      }

      logger.debug("Received public ID from Eden AI", { publicId });

      // Poll for results
      const pollResult = await this.pollForResults(
        publicId,
        data.provider,
        logger,
      );

      if (!pollResult.success) {
        return pollResult;
      }

      logger.info("Transcription successful", {
        textLength: pollResult.data.text.length,
        provider: data.provider,
      });

      // Deduct credits AFTER successful completion
      await deductCredits({
        user,
        cost: FEATURE_COSTS.STT,
        feature: "stt",
        logger,
      });

      return createSuccessResponse({
        response: {
          success: true,
          text: pollResult.data.text,
          provider: data.provider,
          confidence: pollResult.data.confidence,
        },
      });
    } catch (error) {
      const errorMessage = parseError(error).message;
      logger.error("Failed to transcribe audio", {
        error: errorMessage,
        provider: data.provider,
      });

      return createErrorResponse(
        "app.api.v1.core.agent.speechToText.post.errors.transcriptionFailed",
        ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        {
          error: errorMessage,
        },
      );
    }
  }

  /**
   * Poll for transcription results from Eden AI
   */
  private async pollForResults(
    publicId: string,
    provider: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ text: string; confidence: number | undefined }>> {
    let attempts = 0;

    while (attempts < MAX_POLLING_ATTEMPTS) {
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), POLLING_INTERVAL_MS);
      });

      try {
        const response = await fetch(
          `https://api.edenai.run/v2/audio/speech_to_text_async/${publicId}`,
          {
            headers: {
              // eslint-disable-next-line i18next/no-literal-string
              Authorization: `Bearer ${env.EDEN_AI_API_KEY}`,
            },
          },
        );

        if (!response.ok) {
          logger.error("Failed to poll transcription results", {
            status: response.status,
            publicId,
          });
          return createErrorResponse(
            "app.api.v1.core.agent.speechToText.post.errors.pollFailed",
            ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          );
        }

        const resultData = (await response.json()) as EdenAITranscriptionResult;

        if (resultData.status === "finished") {
          const providerResult = resultData.results[provider];
          const transcription = providerResult?.text || "";
          const confidence = providerResult?.confidence;

          logger.info("Transcription completed", {
            textLength: transcription.length,
            attempts,
            confidence,
          });

          return createSuccessResponse({
            text: transcription,
            confidence,
          });
        } else if (resultData.status === "failed") {
          logger.error("Transcription failed", { publicId, provider });
          return createErrorResponse(
            "app.api.v1.core.agent.speechToText.post.errors.failed",
            ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          );
        }

        attempts++;
        logger.debug("Polling for transcription results", {
          attempts,
          publicId,
          status: resultData.status,
        });
      } catch (error) {
        const errorMessage = parseError(error).message;
        logger.error("Error while polling", {
          error: errorMessage,
          attempts,
        });
        return createErrorResponse(
          "app.api.v1.core.agent.speechToText.post.errors.transcriptionFailed",
          ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          {
            error: errorMessage,
          },
        );
      }
    }

    logger.error("Transcription timeout", { publicId, provider });
    return createErrorResponse(
      "app.api.v1.core.agent.speechToText.post.errors.timeout",
      ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    );
  }
}

// Export singleton instance
export const speechToTextRepository = new SpeechToTextRepositoryImpl();
