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
import { scopedTranslation as creditsScopedTranslation } from "@/app/api/[locale]/credits/i18n";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { getLanguageFromLocale } from "@/i18n/core/language-utils";

import { CreditRepository } from "../../credits/repository";
import {
  CREDIT_VALUE_USD,
  STANDARD_MARKUP_PERCENTAGE,
  STT_COST_PER_SECOND,
  STT_MINIMUM_BALANCE,
} from "../../products/repository-client";
import type { JwtPayloadType } from "../../user/auth/types";
import type { SpeechToTextPostResponseOutput } from "./definition";
import type { SpeechToTextT } from "./i18n";

/**
 * Speech-to-Text Repository
 */
export class SpeechToTextRepository {
  /** Server-side provider configuration — hardcoded to use OpenAI Whisper via Eden AI */
  private static readonly STT_PROVIDER = "openai"; // Eden AI expects "openai" for Whisper
  private static readonly STT_MODEL = "whisper-1";
  private static readonly MAX_POLLING_ATTEMPTS = 30;
  private static readonly POLLING_INTERVAL_MS = 1000;
  /**
   * Transcribe audio to text
   */
  static async transcribeAudio(
    file: File,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: SpeechToTextT,
  ): Promise<ResponseType<SpeechToTextPostResponseOutput>> {
    // Server-side language configuration - ignore client input
    const language = getLanguageFromLocale(locale);

    logger.info("Starting audio transcription", {
      provider: this.STT_PROVIDER,
      model: this.STT_MODEL,
      language,
      fileSize: file.size,
      fileName: file.name,
      mimeType: file.type,
    });

    const tCredits = creditsScopedTranslation.scopedT(locale).t;

    // Check minimum balance upfront (cost of ~5 seconds)
    const balanceResult = await CreditRepository.getBalance(
      user.isPublic && user.leadId
        ? { leadId: user.leadId }
        : user.id
          ? { userId: user.id, leadId: user.leadId }
          : { leadId: user.leadId! },
      logger,
      tCredits,
      locale,
    );

    if (!balanceResult.success) {
      logger.error("Failed to check balance for STT", {
        error: balanceResult.message,
      });
      return fail({
        message: t("post.errors.balanceCheckFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    if (balanceResult.data.total < STT_MINIMUM_BALANCE) {
      logger.warn("Insufficient credits for STT", {
        balance: balanceResult.data.total,
        minimum: STT_MINIMUM_BALANCE,
      });
      return fail({
        message: t("post.errors.insufficientCredits"),
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
      formData.append("providers", this.STT_PROVIDER); // Use provider/model format
      formData.append("language", language);

      logger.debug("Sending request to Eden AI", {
        provider: this.STT_PROVIDER,
        model: this.STT_MODEL,
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
          provider: this.STT_PROVIDER,
          language,
        });
        return fail({
          message: t("post.errors.transcriptionFailed"),
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
          message: t("post.errors.noPublicId"),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }

      logger.debug("Starting polling for transcription results", { publicId });

      // Poll for results
      const pollResult = await SpeechToTextRepository.pollForResults(
        publicId,
        this.STT_PROVIDER, // Use provider/model format to match Eden AI response
        logger,
        t,
      );

      if (!pollResult.success) {
        return pollResult;
      }

      // Calculate credits based on actual cost from Eden AI when available,
      // falling back to duration-based calculation.
      // Eden AI returns cost in USD — convert to credits using CREDIT_VALUE_USD with our markup.
      const audioDurationSeconds = pollResult.data.duration;
      const edenAiCostUsd = pollResult.data.edenAiCostUsd;

      let creditsNeeded: number;
      if (
        edenAiCostUsd !== null &&
        edenAiCostUsd !== undefined &&
        edenAiCostUsd > 0
      ) {
        // Use Eden AI's actual cost with our standard markup applied
        creditsNeeded =
          (edenAiCostUsd * (1 + STANDARD_MARKUP_PERCENTAGE)) / CREDIT_VALUE_USD;
        logger.debug("STT: Using Eden AI cost for credit calculation", {
          edenAiCostUsd,
          creditsNeeded,
        });
      } else if (audioDurationSeconds > 0) {
        creditsNeeded = audioDurationSeconds * STT_COST_PER_SECOND;
      } else {
        // Eden AI returned neither cost nor duration — charge minimum (1 second)
        logger.error(
          "STT: Eden AI did not return cost or audio_duration — charging 1-second minimum",
          {
            pollResult: JSON.stringify(pollResult.data),
            provider: this.STT_PROVIDER,
          },
        );
        creditsNeeded = STT_COST_PER_SECOND;
      }

      logger.info("Transcription successful", {
        textLength: pollResult.data.text.length,
        provider: this.STT_PROVIDER,
        model: this.STT_MODEL,
        audioDurationSeconds,
        creditsNeeded,
        costPerSecond: STT_COST_PER_SECOND,
      });

      // Deduct credits AFTER successful completion based on actual duration (graceful - allows partial to 0)
      const deductResult = await CreditRepository.deductCreditsForSTT(
        user,
        creditsNeeded,
        logger,
        tCredits,
        locale,
      );

      if (!deductResult.success) {
        logger.error("Failed to deduct STT credits", {
          creditsNeeded,
          audioDurationSeconds,
        });
        return fail({
          message: t("post.errors.creditsFailed"),
          errorType: ErrorResponseTypes.PAYMENT_ERROR,
        });
      }

      if (deductResult.data.partialDeduction) {
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
          provider: this.STT_PROVIDER,
          confidence: pollResult.data.confidence,
        },
      });
    } catch (error) {
      const errorMessage = parseError(error).message;
      logger.error("Failed to transcribe audio", {
        error: errorMessage,
        provider: this.STT_PROVIDER,
        model: this.STT_MODEL,
      });

      return fail({
        message: t("post.errors.transcriptionFailed"),
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
    t: SpeechToTextT,
  ): Promise<
    ResponseType<{
      text: string;
      confidence: number | undefined;
      duration: number;
      edenAiCostUsd: number | undefined;
    }>
  > {
    let attempts = 0;

    while (attempts < this.MAX_POLLING_ATTEMPTS) {
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), this.POLLING_INTERVAL_MS);
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
            message: t("post.errors.pollFailed"),
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
              message: t("post.errors.transcriptionFailed"),
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
              message: t("post.errors.providerError"),
              errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
            });
          }

          const transcription = providerResult?.text || "";
          const confidence = providerResult?.confidence;
          const duration = providerResult?.audio_duration || 0;
          const edenAiCostUsd = providerResult?.cost;

          logger.info("Transcription completed", {
            textLength: transcription.length,
            attempts,
            confidence,
            duration,
            edenAiCostUsd,
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
            edenAiCostUsd,
          });
        } else if (resultData.status === "failed") {
          logger.error("Transcription failed", { publicId, provider });
          return fail({
            message: t("post.errors.failed"),
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
          message: t("post.errors.transcriptionFailed"),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          messageParams: {
            error: errorMessage,
          },
        });
      }
    }

    logger.error("Transcription timeout", { publicId, provider });
    return fail({
      message: t("post.errors.timeout"),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
}
