/**
 * Text-to-Speech Repository
 * Handles text-to-speech conversion using Eden AI
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";

import type { EndpointLogger } from "../../system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { TextToSpeechPostRequestOutput } from "./definition";

/**
 * Eden AI TTS response structure
 */
interface EdenAITTSResponse {
  [provider: string]: {
    audio_resource_url?: string;
    cost?: number;
  };
}

/**
 * Text-to-Speech Repository Interface
 */
export interface TextToSpeechRepository {
  /**
   * Convert text to speech
   * @param data - TTS request data
   * @param locale - User locale
   * @param logger - Logger instance
   * @returns Audio data URL and metadata
   */
  convertTextToSpeech(
    data: TextToSpeechPostRequestOutput,
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
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      response: { success: boolean; audioUrl: string; provider: string };
    }>
  > {
    logger.info("Starting text-to-speech conversion", {
      provider: data.provider,
      voice: data.voice,
      language: data.language,
      textLength: data.text.length,
    });

    // Check API key
    if (!env.EDEN_AI_API_KEY) {
      logger.error("Eden AI API key not configured");
      return createErrorResponse(
        "app.api.v1.core.agent.textToSpeech.post.errors.apiKeyMissing",
        ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      );
    }

    try {
      logger.debug("Sending request to Eden AI", {
        provider: data.provider,
        voice: data.voice,
        language: data.language,
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
            providers: data.provider,
            text: data.text,
            language: data.language,
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
        return createErrorResponse(
          "app.api.v1.core.agent.textToSpeech.post.errors.conversionFailed",
          ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          {
            error: errorText,
          },
        );
      }

      const responseData = (await response.json()) as EdenAITTSResponse;
      logger.debug("Received response from Eden AI", {
        hasProviderResult: !!responseData[data.provider],
      });

      // Extract audio URL from response
      const providerResult = responseData[data.provider];
      const audioResourceUrl = providerResult?.audio_resource_url;

      if (!audioResourceUrl) {
        logger.error("No audio URL in response", {
          provider: data.provider,
          responseKeys: Object.keys(responseData),
        });
        return createErrorResponse(
          "app.api.v1.core.agent.textToSpeech.post.errors.noAudioUrl",
          ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        );
      }

      logger.debug("Fetching audio from URL", { audioUrl: audioResourceUrl });

      // Fetch the audio file
      const audioResponse = await fetch(audioResourceUrl);
      if (!audioResponse.ok) {
        logger.error("Failed to fetch audio file", {
          status: audioResponse.status,
          audioUrl: audioResourceUrl,
        });
        return createErrorResponse(
          "app.api.v1.core.agent.textToSpeech.post.errors.audioFetchFailed",
          ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        );
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
        provider: data.provider,
      });

      return createSuccessResponse({
        response: {
          success: true,
          audioUrl,
          provider: data.provider,
        },
      });
    } catch (error) {
      const errorMessage = parseError(error).message;
      logger.error("Failed to convert text to speech", {
        error: errorMessage,
        provider: data.provider,
      });

      return createErrorResponse(
        "app.api.v1.core.agent.textToSpeech.post.errors.conversionFailed",
        ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        {
          error: errorMessage,
        },
      );
    }
  }
}

// Export singleton instance
export const textToSpeechRepository = new TextToSpeechRepositoryImpl();
