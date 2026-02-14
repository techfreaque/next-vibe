/**
 * Speech-to-Text Repository
 * Handles audio transcription using Eden AI
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { agentEnv } from "@/app/api/[locale]/agent/env";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { getLanguageFromLocale } from "@/i18n/core/language-utils";

import { CreditRepository } from "../../credits/repository";
import {
  STT_COST_PER_SECOND,
  STT_MINIMUM_BALANCE,
} from "../../products/repository-client";
import type { JwtPayloadType } from "../../user/auth/types";
import type { SpeechToTextPostResponseOutput } from "./definition";

/**
 * Server-side provider configuration
 * Hardcoded to use OpenAI Whisper via Eden AI
 */
const STT_PROVIDER = "openai";
const STT_MODEL = "whisper-1";
const STT_PROVIDER_KEY = STT_PROVIDER; // Eden AI expects "openai" for Whisper

/**
 * Maximum polling attempts for async transcription
 */
const MAX_POLLING_ATTEMPTS = 30;
const POLLING_INTERVAL_MS = 1000;

/**
 * Speech-to-Text Repository
 */
export class SpeechToTextRepository {
  /**
   * Transcribe audio to text
   */
  static async transcribeAudio(
    file: File,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SpeechToTextPostResponseOutput>> {
    // Server-side language configuration - ignore client input
    const language = getLanguageFromLocale(locale);

    logger.info("Starting audio transcription", {
      provider: STT_PROVIDER,
      model: STT_MODEL,
      language,
      fileSize: file.size,
      fileName: file.name,
      mimeType: file.type,
    });

    // Check minimum balance upfront (cost of ~5 seconds)
    const balanceResult = await CreditRepository.getBalance(
      user.isPublic && user.leadId
        ? { leadId: user.leadId }
        : user.id
          ? { userId: user.id, leadId: user.leadId }
          : { leadId: user.leadId! },
      logger,
    );

    if (!balanceResult.success) {
      logger.error("Failed to check balance for STT", {
        error: balanceResult.message,
      });
      return fail({
        message: "app.api.agent.speechToText.post.errors.balanceCheckFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    if (balanceResult.data.total < STT_MINIMUM_BALANCE) {
      logger.warn("Insufficient credits for STT", {
        balance: balanceResult.data.total,
        minimum: STT_MINIMUM_BALANCE,
      });
      return fail({
        message: "app.api.agent.speechToText.post.errors.insufficientCredits",
        errorType: ErrorResponseTypes.PAYMENT_REQUIRED,
        messageParams: {
          balance: balanceResult.data.total.toString(),
          minimum: STT_MINIMUM_BALANCE.toString(),
        },
      });
    }

    try {
      // Convert File to Buffer for Eden AI
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Create form data for Eden AI
      const formData = new FormData();
      const blob = new Blob([buffer], { type: file.type });
      formData.append("file", blob, file.name);
      formData.append("providers", STT_PROVIDER_KEY); // Use provider/model format
      formData.append("language", language);

      logger.debug("Sending request to Eden AI", {
        provider: STT_PROVIDER,
        model: STT_MODEL,
        language,
        fileType: file.type,
        fileSize: file.size,
      });

      // Call Eden AI API
      const response = await fetch(
        "https://api.edenai.run/v2/audio/speech_to_text_async",
        {
          method: "POST",
          headers: {
            // eslint-disable-next-line i18next/no-literal-string
            Authorization: `Bearer ${agentEnv.EDEN_AI_API_KEY}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        logger.error("Eden AI API error", {
          status: response.status,
          error: errorText,
          provider: STT_PROVIDER,
          language,
        });
        return fail({
          message: "app.api.agent.speechToText.post.errors.transcriptionFailed",
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          messageParams: {
            error: errorText,
          },
        });
      }

      const responseData = (await response.json()) as {
        public_id?: string;
      };
      const publicId = responseData.public_id;

      logger.debug("Received response from Eden AI", {
        publicId,
        responseKeys: Object.keys(responseData),
        fullResponse: JSON.stringify(responseData),
      });

      if (!publicId) {
        logger.error("No public ID received from Eden AI", {
          responseData: JSON.stringify(responseData),
        });
        return fail({
          message: "app.api.agent.speechToText.post.errors.noPublicId",
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }

      logger.debug("Starting polling for transcription results", { publicId });

      // Poll for results
      const pollResult = await SpeechToTextRepository.pollForResults(
        publicId,
        STT_PROVIDER_KEY, // Use provider/model format to match Eden AI response
        logger,
      );

      if (!pollResult.success) {
        return pollResult;
      }

      // Calculate credits based on audio duration
      const audioDurationSeconds = pollResult.data.duration;
      const creditsNeeded = audioDurationSeconds * STT_COST_PER_SECOND;

      logger.info("Transcription successful", {
        textLength: pollResult.data.text.length,
        provider: STT_PROVIDER,
        model: STT_MODEL,
        audioDurationSeconds,
        creditsNeeded,
        costPerSecond: STT_COST_PER_SECOND,
      });

      // Deduct credits AFTER successful completion based on actual duration (graceful - allows partial to 0)
      const deductResult = await CreditRepository.deductCreditsForSTT(
        user,
        creditsNeeded,
        logger,
        locale,
      );

      if (!deductResult.success) {
        logger.error("Failed to deduct STT credits", {
          creditsNeeded,
          audioDurationSeconds,
        });
        return fail({
          message: "app.api.agent.speechToText.post.errors.creditsFailed",
          errorType: ErrorResponseTypes.PAYMENT_ERROR,
        });
      }

      if (deductResult.partialDeduction) {
        logger.info(
          "STT: Partial credit deduction (insufficient funds, deducted to 0)",
          {
            requestedCost: creditsNeeded,
            audioDurationSeconds,
          },
        );
      }

      return success({
        creditCost: creditsNeeded,
        response: {
          success: true,
          text: pollResult.data.text,
          provider: STT_PROVIDER,
          confidence: pollResult.data.confidence,
        },
      });
    } catch (error) {
      const errorMessage = parseError(error).message;
      logger.error("Failed to transcribe audio", {
        error: errorMessage,
        provider: STT_PROVIDER,
        model: STT_MODEL,
      });

      return fail({
        message: "app.api.agent.speechToText.post.errors.transcriptionFailed",
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        messageParams: {
          error: errorMessage,
        },
      });
    }
  }

  /**
   * Poll for transcription results from Eden AI
   */
  private static async pollForResults(
    publicId: string,
    provider: string,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      text: string;
      confidence: number | undefined;
      duration: number;
    }>
  > {
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
              Authorization: `Bearer ${agentEnv.EDEN_AI_API_KEY}`,
            },
          },
        );

        if (!response.ok) {
          logger.error("Failed to poll transcription results", {
            status: response.status,
            publicId,
          });
          return fail({
            message: "app.api.agent.speechToText.post.errors.pollFailed",
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          });
        }

        const resultData = (await response.json()) as {
          status: "pending" | "processing" | "finished" | "failed";
          results: {
            [provider: string]: {
              id?: string;
              text?: string;
              confidence?: number;
              diarization?: {
                total_speakers?: number;
              };
              audio_duration?: number;
              error?: string | { message?: string; type?: string };
              final_status?: string;
              cost?: number;
            };
          };
        };

        logger.debug("Polling response received", {
          status: resultData.status,
          hasResults: !!resultData.results,
          provider,
          providerResultKeys: resultData.results?.[provider]
            ? Object.keys(resultData.results[provider])
            : [],
          fullResults: JSON.stringify(resultData.results),
        });

        if (resultData.status === "finished") {
          const providerResult = resultData.results[provider];

          if (!providerResult) {
            logger.error("Provider result not found in response", {
              provider,
              availableProviders: Object.keys(resultData.results || {}),
              fullResponse: JSON.stringify(resultData),
            });
            return fail({
              message:
                "app.api.agent.speechToText.post.errors.transcriptionFailed",
              errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
              messageParams: {
                error: `Provider ${provider} not found in results`,
              },
            });
          }

          // Check for provider-level errors
          if (
            providerResult.error ||
            providerResult.final_status === "failed"
          ) {
            // Handle both string and object error formats
            const errorMessage =
              typeof providerResult.error === "string"
                ? providerResult.error
                : providerResult.error?.message || "Unknown provider error";

            logger.error("Provider returned error", {
              provider,
              error: errorMessage,
              errorType:
                typeof providerResult.error === "object"
                  ? providerResult.error?.type
                  : undefined,
              finalStatus: providerResult.final_status,
              fullProviderResult: JSON.stringify(providerResult),
            });

            // Return user-friendly error message instead of exposing raw API error
            return fail({
              message: "app.api.agent.speechToText.post.errors.providerError",
              errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
            });
          }

          const transcription = providerResult?.text || "";
          const confidence = providerResult?.confidence;
          const duration = providerResult?.audio_duration || 0;

          logger.info("Transcription completed", {
            textLength: transcription.length,
            attempts,
            confidence,
            duration,
            hasText: !!providerResult?.text,
            providerResultStructure: JSON.stringify(providerResult),
          });

          if (!transcription || transcription.length === 0) {
            logger.warn("Empty transcription received", {
              providerResult: JSON.stringify(providerResult),
              duration,
            });
          }

          return success({
            text: transcription,
            confidence,
            duration,
          });
        } else if (resultData.status === "failed") {
          logger.error("Transcription failed", { publicId, provider });
          return fail({
            message: "app.api.agent.speechToText.post.errors.failed",
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          });
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
        return fail({
          message: "app.api.agent.speechToText.post.errors.transcriptionFailed",
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          messageParams: {
            error: errorMessage,
          },
        });
      }
    }

    logger.error("Transcription timeout", { publicId, provider });
    return fail({
      message: "app.api.agent.speechToText.post.errors.timeout",
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
}
