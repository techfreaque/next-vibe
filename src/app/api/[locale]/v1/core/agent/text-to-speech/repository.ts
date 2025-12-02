/**
 * Text-to-Speech Repository
 * Handles text-to-speech conversion using Eden AI
 */

import "server-only";

import {
  success,
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";
import { getLanguageFromLocale } from "@/i18n/core/language-utils";

import type { JwtPayloadType } from "../../user/auth/types";
import { creditRepository } from "../../credits/repository";
import { TTS_COST_PER_CHARACTER } from "../../products/repository-client";
import type { TextToSpeechPostRequestOutput } from "./definition";

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
 * Text-to-Speech Repository Interface
 */
export interface TextToSpeechRepository {
  /**
   * Convert text to speech
   * @param data - TTS request data
   * @param user - User information
   * @param locale - User locale
   * @param logger - Logger instance
   * @returns Audio data URL and metadata
   */
  convertTextToSpeech(
    data: TextToSpeechPostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      response: { success: boolean; audioUrl: string; provider: string };
    }>
  >;
}

/**
 * Text-to-Speech Repository Implementation
 */
export class TextToSpeechRepositoryImpl implements TextToSpeechRepository {
  /**
   * Convert text to speech
   */
  async convertTextToSpeech(
    data: TextToSpeechPostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      response: { success: boolean; audioUrl: string; provider: string };
    }>
  > {
    // Server-side configuration
    const provider = "amazon";
    const language = mapLocaleToLanguage(locale);

    logger.info("Starting text-to-speech conversion", {
      provider,
      voice: data.voice,
      language,
      textLength: data.text.length,
    });

    // Check API key
    if (!env.EDEN_AI_API_KEY) {
      logger.error("Eden AI API key not configured");
      return fail({
        message: "app.api.v1.core.agent.textToSpeech.post.errors.apiKeyMissing",
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
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

    // Deduct credits BEFORE making the API call
    // This ensures credits are deducted even if the request is interrupted
    try {
      await creditRepository.deductCreditsForFeature(
        user,
        creditsNeeded,
        "tts",
        logger,
      );
    } catch (error) {
      const errorMessage = parseError(error).message;
      logger.error("Failed to deduct credits", {
        error: errorMessage,
        creditsNeeded,
        characterCount,
      });
      return fail({
        message: "app.api.v1.core.agent.textToSpeech.post.errors.creditsFailed",
        errorType: ErrorResponseTypes.PAYMENT_ERROR,
        messageParams: {
          error: errorMessage,
        },
      });
    }

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
            Authorization: `Bearer ${env.EDEN_AI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            providers: provider,
            text: data.text,
            language: language.toLowerCase(),
            option: data.voice,
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
          message:
            "app.api.v1.core.agent.textToSpeech.post.errors.conversionFailed",
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
          message:
            "app.api.v1.core.agent.textToSpeech.post.errors.providerError",
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
          message: "app.api.v1.core.agent.textToSpeech.post.errors.noAudioUrl",
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
          message:
            "app.api.v1.core.agent.textToSpeech.post.errors.audioFetchFailed",
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

      return success({
        response: {
          success: true,
          audioUrl,
          provider,
        },
      });
    } catch (error) {
      const errorMessage = parseError(error).message;
      logger.error("Failed to convert text to speech", {
        error: errorMessage,
        provider,
      });

      return fail({
        message:
          "app.api.v1.core.agent.textToSpeech.post.errors.conversionFailed",
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        messageParams: {
          error: errorMessage,
        },
      });
    }
  }
}

// Export singleton instance
export const textToSpeechRepository = new TextToSpeechRepositoryImpl();
