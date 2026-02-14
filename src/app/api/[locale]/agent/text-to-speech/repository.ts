/**
 * Text-to-Speech Repository
 * Handles text-to-speech conversion using Eden AI
 */

import "server-only";

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { agentEnv } from "@/app/api/[locale]/agent/env";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { getLanguageFromLocale } from "@/i18n/core/language-utils";

import { CreditRepository } from "../../credits/repository";
import {
  TTS_COST_PER_CHARACTER,
  TTS_MINIMUM_BALANCE,
} from "../../products/repository-client";
import type { JwtPayloadType } from "../../user/auth/types";
import type {
  TextToSpeechPostRequestOutput,
  TextToSpeechPostResponseOutput,
} from "./definition";
import { TtsVoice } from "./enum";

/**
 * Eden AI TTS response structure
 */
interface EdenAITTSResponse {
  [provider: string]: {
    audio_resource_url?: string;
    cost?: number;
    error?: {
      message?: string;
      type?: string;
    };
    status?: string;
  };
}

/**
 * Map locale to language code for TTS
 * Uses getLanguageFromLocale to extract language
 */
function mapLocaleToLanguage(locale: CountryLanguage): string {
  return getLanguageFromLocale(locale);
}

/**
 * Convert localized TtsVoiceValue to raw API string
 * Converts "app.api.agent.textToSpeech.voices.MALE" -> "MALE"
 */
function convertVoiceToApiFormat(voice: string): "MALE" | "FEMALE" {
  switch (voice) {
    case TtsVoice.MALE:
      return "MALE";
    case TtsVoice.FEMALE:
      return "FEMALE";
    default:
      // Default to MALE if unknown
      return "FEMALE";
  }
}

/**
 * Text-to-Speech Repository - Static class pattern
 */
export class TextToSpeechRepository {
  /**
   * Convert text to speech
   */
  static async convertTextToSpeech(
    data: TextToSpeechPostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<TextToSpeechPostResponseOutput>> {
    // Server-side configuration
    const provider = "openai";
    const language = mapLocaleToLanguage(locale);
    const apiVoice = convertVoiceToApiFormat(data.voice);

    logger.info("Starting text-to-speech conversion", {
      provider,
      voice: data.voice,
      apiVoice,
      language,
      textLength: data.text.length,
    });

    // Check API key
    if (!agentEnv.EDEN_AI_API_KEY) {
      logger.error("Eden AI API key not configured");
      return fail({
        message: "app.api.agent.textToSpeech.post.errors.apiKeyMissing",
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    // Check minimum balance upfront (cost of ~50 characters)
    const balanceResult = await CreditRepository.getBalance(
      user.isPublic && user.leadId
        ? { leadId: user.leadId }
        : user.id
          ? { userId: user.id, leadId: user.leadId }
          : { leadId: user.leadId! },
      logger,
    );

    if (!balanceResult.success) {
      logger.error("Failed to check balance for TTS", {
        error: balanceResult.message,
      });
      return fail({
        message: "app.api.agent.textToSpeech.post.errors.balanceCheckFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    if (balanceResult.data.total < TTS_MINIMUM_BALANCE) {
      logger.warn("Insufficient credits for TTS", {
        balance: balanceResult.data.total,
        minimum: TTS_MINIMUM_BALANCE,
      });
      return fail({
        message: "app.api.agent.textToSpeech.post.errors.insufficientCredits",
        errorType: ErrorResponseTypes.PAYMENT_REQUIRED,
        messageParams: {
          balance: balanceResult.data.total.toString(),
          minimum: TTS_MINIMUM_BALANCE.toString(),
        },
      });
    }

    // Calculate credits based on character count
    // Amazon TTS: $4 per 1M chars + 30% markup = $5.20 per 1M chars
    const characterCount = data.text.length;
    const creditsNeeded = characterCount * TTS_COST_PER_CHARACTER;

    logger.info("Calculating TTS credits", {
      characterCount,
      creditsNeeded,
      costPerCharacter: TTS_COST_PER_CHARACTER,
    });

    try {
      logger.debug("Sending request to Eden AI", {
        provider,
        voice: data.voice,
        language,
      });

      // Call Eden AI TTS API
      const response = await fetch(
        "https://api.edenai.run/v2/audio/text_to_speech",
        {
          method: "POST",
          headers: {
            // eslint-disable-next-line i18next/no-literal-string
            Authorization: `Bearer ${agentEnv.EDEN_AI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            providers: provider,
            text: data.text,
            language: language.toLowerCase(),
            option: apiVoice,
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        logger.error("Eden AI TTS API error", {
          status: response.status,
          error: errorText,
        });
        return fail({
          message: "app.api.agent.textToSpeech.post.errors.conversionFailed",
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          messageParams: {
            error: errorText,
          },
        });
      }

      const responseData = (await response.json()) as EdenAITTSResponse;
      logger.debug("Received response from Eden AI", {
        hasProviderResult: !!responseData[provider],
      });

      // Extract audio URL from response
      const providerResult = responseData[provider];

      // Check for provider-level errors
      if (providerResult?.error || providerResult?.status === "fail") {
        const errorMessage =
          providerResult.error?.message || "Unknown provider error";
        logger.error("Provider returned error", {
          provider,
          error: errorMessage,
          errorType: providerResult.error?.type,
        });
        return fail({
          message: "app.api.agent.textToSpeech.post.errors.providerError",
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          messageParams: {
            error: errorMessage,
          },
        });
      }

      const audioResourceUrl = providerResult?.audio_resource_url;

      if (!audioResourceUrl) {
        logger.error("No audio URL in response", {
          provider,
          responseKeys: Object.keys(responseData),
        });
        return fail({
          message: "app.api.agent.textToSpeech.post.errors.noAudioUrl",
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }

      logger.debug("Fetching audio from URL", { audioUrl: audioResourceUrl });

      // Fetch the audio file
      const audioResponse = await fetch(audioResourceUrl);
      if (!audioResponse.ok) {
        logger.error("Failed to fetch audio file", {
          status: audioResponse.status,
          audioUrl: audioResourceUrl,
        });
        return fail({
          message: "app.api.agent.textToSpeech.post.errors.audioFetchFailed",
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }

      const audioBuffer = await audioResponse.arrayBuffer();
      let contentType =
        audioResponse.headers.get("content-type") || "audio/mpeg";

      // Normalize content type - some providers return generic types
      if (
        contentType === "binary/octet-stream" ||
        contentType === "application/octet-stream"
      ) {
        contentType = "audio/mpeg";
        logger.debug("Normalized content type from octet-stream to audio/mpeg");
      }

      // Convert to base64 data URL
      const base64Audio = Buffer.from(audioBuffer).toString("base64");
      // eslint-disable-next-line i18next/no-literal-string
      const audioUrl = `data:${contentType};base64,${base64Audio}`;

      logger.info("Text-to-speech conversion successful", {
        audioSize: audioBuffer.byteLength,
        contentType,
        provider,
      });

      // Deduct credits AFTER successful completion (graceful - allows partial to 0)
      const deductResult = await CreditRepository.deductCreditsForTTS(
        user,
        creditsNeeded,
        logger,
        locale,
      );

      if (!deductResult.success) {
        logger.error("Failed to deduct TTS credits", {
          creditsNeeded,
          characterCount,
        });
        return fail({
          message: "app.api.agent.textToSpeech.post.errors.creditsFailed",
          errorType: ErrorResponseTypes.PAYMENT_ERROR,
        });
      }

      if (deductResult.partialDeduction) {
        logger.info(
          "TTS: Partial credit deduction (insufficient funds, deducted to 0)",
          {
            requestedCost: creditsNeeded,
            characterCount,
          },
        );
      }

      return success({
        audioUrl,
        creditCost: creditsNeeded,
      });
    } catch (error) {
      const errorMessage = parseError(error).message;
      logger.error("Failed to convert text to speech", {
        error: errorMessage,
        provider,
      });

      return fail({
        message: "app.api.agent.textToSpeech.post.errors.conversionFailed",
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        messageParams: {
          error: errorMessage,
        },
      });
    }
  }
}
