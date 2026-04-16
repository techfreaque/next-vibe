/**
 * Text-to-Speech Repository
 * Routes TTS requests to the correct provider based on the voice model's ApiProvider.
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
import { PROVIDER_SETUP_INSTRUCTIONS } from "@/app/api/[locale]/agent/env-availability";
import { ApiProvider } from "@/app/api/[locale]/agent/models/models";
import { getBestTtsModel } from "@/app/api/[locale]/agent/text-to-speech/models";
import { ModelSelectionType } from "@/app/api/[locale]/agent/chat/skills/enum";
import { scopedTranslation as creditsScopedTranslation } from "@/app/api/[locale]/credits/i18n";
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
import type { TextToSpeechT } from "./i18n";

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
 * Text-to-Speech Repository - Static class pattern
 */
export class TextToSpeechRepository {
  /**
   * Map locale to language code for TTS
   */
  private static mapLocaleToLanguage(locale: CountryLanguage): string {
    return getLanguageFromLocale(locale);
  }

  /**
   * Fetch and convert audio URL to base64 data URL
   */
  private static async fetchAndConvertAudio(
    audioResourceUrl: string,
    logger: EndpointLogger,
    t: TextToSpeechT,
  ): Promise<ResponseType<string>> {
    const audioResponse = await fetch(audioResourceUrl);
    if (!audioResponse.ok) {
      logger.error("Failed to fetch audio file", {
        status: audioResponse.status,
        audioUrl: audioResourceUrl,
      });
      return fail({
        message: t("post.errors.audioFetchFailed"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const audioBuffer = await audioResponse.arrayBuffer();
    let contentType = audioResponse.headers.get("content-type") || "audio/mpeg";

    if (
      contentType === "binary/octet-stream" ||
      contentType === "application/octet-stream"
    ) {
      contentType = "audio/mpeg";
    }

    const base64Audio = Buffer.from(audioBuffer).toString("base64");
    // eslint-disable-next-line i18next/no-literal-string
    return success(`data:${contentType};base64,${base64Audio}`);
  }

  /**
   * Convert text to speech via OpenAI TTS API directly
   */
  /**
   * `providerModel` is the voice name (e.g. "nova", "alloy").
   * The OpenAI TTS model ("tts-1") is the same for all voices and hardcoded.
   */
  private static async callOpenAITTS(
    text: string,
    providerModel: string,
    language: string,
    logger: EndpointLogger,
    t: TextToSpeechT,
  ): Promise<ResponseType<string>> {
    if (!agentEnv.OPENAI_API_KEY) {
      const { envKey, url, label } = PROVIDER_SETUP_INSTRUCTIONS.openAiImages;
      return fail({
        message: t("post.errors.notConfigured", { label, envKey, url }),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    logger.debug("[TTS] Calling OpenAI TTS API", {
      voice: providerModel,
      language,
    });

    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        // eslint-disable-next-line i18next/no-literal-string
        Authorization: `Bearer ${agentEnv.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // eslint-disable-next-line i18next/no-literal-string
        model: "tts-1",
        input: text,
        voice: providerModel,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error("[TTS] OpenAI TTS API error", {
        status: response.status,
        error: errorText,
      });
      return fail({
        message: t("post.errors.conversionFailed", { error: errorText }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const audioBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "audio/mpeg";
    const base64Audio = Buffer.from(audioBuffer).toString("base64");
    // eslint-disable-next-line i18next/no-literal-string
    return success(`data:${contentType};base64,${base64Audio}`);
  }

  /**
   * Convert text to speech via Eden AI TTS API
   * providerModel = "openai" (the Eden AI provider name)
   * voiceGender = "MALE" | "FEMALE" based on voiceMeta
   */
  private static async callEdenAITTS(
    text: string,
    providerModel: string,
    voiceGender: "MALE" | "FEMALE",
    language: string,
    logger: EndpointLogger,
    t: TextToSpeechT,
  ): Promise<ResponseType<string>> {
    if (!agentEnv.EDEN_AI_API_KEY) {
      const { envKey, url, label } = PROVIDER_SETUP_INSTRUCTIONS.voice;
      return fail({
        message: t("post.errors.notConfigured", { label, envKey, url }),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    logger.debug("[TTS] Calling Eden AI TTS API", {
      provider: providerModel,
      gender: voiceGender,
      language,
    });

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
          providers: providerModel,
          text,
          language: language.toLowerCase(),
          option: voiceGender,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      logger.error("[TTS] Eden AI TTS API error", {
        status: response.status,
        error: errorText,
      });
      return fail({
        message: t("post.errors.conversionFailed", { error: errorText }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const responseData = (await response.json()) as EdenAITTSResponse;
    const providerResult = responseData[providerModel];

    if (providerResult?.error || providerResult?.status === "fail") {
      const errorMessage =
        providerResult?.error?.message ?? "Unknown provider error";
      logger.error("[TTS] Eden AI provider error", {
        provider: providerModel,
        error: errorMessage,
      });
      return fail({
        message: t("post.errors.providerError", { error: errorMessage }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const audioResourceUrl = providerResult?.audio_resource_url;
    if (!audioResourceUrl) {
      logger.error("[TTS] No audio URL in Eden AI response", { providerModel });
      return fail({
        message: t("post.errors.noAudioUrl"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    return TextToSpeechRepository.fetchAndConvertAudio(
      audioResourceUrl,
      logger,
      t,
    );
  }

  /**
   * Convert text to speech via ElevenLabs API
   * providerModel = voice ID (e.g., "21m00Tcm4TlvDq8ikWAM")
   */
  private static async callElevenLabsTTS(
    text: string,
    providerModel: string,
    logger: EndpointLogger,
    t: TextToSpeechT,
  ): Promise<ResponseType<string>> {
    if (!agentEnv.ELEVENLABS_API_KEY) {
      return fail({
        message: t("post.errors.notConfigured", {
          label: "ElevenLabs",
          envKey: "ELEVENLABS_API_KEY",
          url: "https://elevenlabs.io/app/settings/api-keys",
        }),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    logger.debug("[TTS] Calling ElevenLabs TTS API", {
      voiceId: providerModel,
    });

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${providerModel}`,
      {
        method: "POST",
        headers: {
          // eslint-disable-next-line i18next/no-literal-string
          "xi-api-key": agentEnv.ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      logger.error("[TTS] ElevenLabs TTS API error", {
        status: response.status,
        error: errorText,
      });
      return fail({
        message: t("post.errors.conversionFailed", { error: errorText }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const audioBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "audio/mpeg";
    const base64Audio = Buffer.from(audioBuffer).toString("base64");
    // eslint-disable-next-line i18next/no-literal-string
    return success(`data:${contentType};base64,${base64Audio}`);
  }

  /**
   * Convert text to speech using model-based provider routing
   */
  static async convertTextToSpeech(
    data: TextToSpeechPostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: TextToSpeechT,
  ): Promise<ResponseType<TextToSpeechPostResponseOutput>> {
    const modelOption = getBestTtsModel(
      { selectionType: ModelSelectionType.MANUAL, manualModelId: data.voiceId },
      user,
    );
    if (!modelOption) {
      return fail({
        message: t("post.errors.not_found.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }
    const language = TextToSpeechRepository.mapLocaleToLanguage(locale);

    logger.debug("[TTS] Starting text-to-speech conversion", {
      voiceId: data.voiceId,
      provider: modelOption.apiProvider,
      language,
      textLength: data.text.length,
    });

    const tCredits = creditsScopedTranslation.scopedT(locale).t;

    // Check minimum balance upfront
    const balanceResult = await CreditRepository.getBalance(
      user,
      logger,
      tCredits,
      locale,
    );

    if (!balanceResult.success) {
      logger.error("[TTS] Failed to check balance", {
        error: balanceResult.message,
      });
      return fail({
        message: t("post.errors.balanceCheckFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    if (balanceResult.data.total < TTS_MINIMUM_BALANCE) {
      logger.warn("[TTS] Insufficient credits", {
        balance: balanceResult.data.total,
        minimum: TTS_MINIMUM_BALANCE,
      });
      return fail({
        message: t("post.errors.insufficientCredits"),
        errorType: ErrorResponseTypes.PAYMENT_REQUIRED,
        messageParams: {
          balance: balanceResult.data.total.toString(),
          minimum: TTS_MINIMUM_BALANCE.toString(),
        },
      });
    }

    const characterCount = data.text.length;
    const creditsNeeded = characterCount * TTS_COST_PER_CHARACTER;

    logger.debug("[TTS] Calculating TTS credits", {
      characterCount,
      creditsNeeded,
    });

    try {
      let audioResult: ResponseType<string>;

      switch (modelOption.apiProvider) {
        case ApiProvider.OPENAI_TTS:
          audioResult = await TextToSpeechRepository.callOpenAITTS(
            data.text,
            modelOption.providerModel,
            language,
            logger,
            t,
          );
          break;

        case ApiProvider.EDEN_AI_TTS: {
          const gender =
            modelOption.voiceMeta?.gender === "male" ? "MALE" : "FEMALE";
          audioResult = await TextToSpeechRepository.callEdenAITTS(
            data.text,
            modelOption.providerModel,
            gender,
            language,
            logger,
            t,
          );
          break;
        }

        case ApiProvider.ELEVENLABS:
          audioResult = await TextToSpeechRepository.callElevenLabsTTS(
            data.text,
            modelOption.providerModel,
            logger,
            t,
          );
          break;

        default:
          return fail({
            message: t("post.errors.unsupportedProvider", {
              voiceId: data.voiceId,
            }),
            errorType: ErrorResponseTypes.BAD_REQUEST,
          });
      }

      if (!audioResult.success) {
        return audioResult;
      }

      const audioUrl = audioResult.data;

      logger.debug("[TTS] Text-to-speech conversion successful", {
        audioSize: audioUrl.length,
        provider: modelOption.apiProvider,
      });

      // Deduct credits AFTER successful completion
      const deductResult = await CreditRepository.deductCreditsForTTS(
        user,
        creditsNeeded,
        logger,
        locale,
        tCredits,
      );

      if (!deductResult.success) {
        logger.error("[TTS] Failed to deduct credits", { creditsNeeded });
        return fail({
          message: t("post.errors.creditsFailed", {
            error: deductResult.message,
          }),
          errorType: ErrorResponseTypes.PAYMENT_ERROR,
        });
      }

      if (deductResult.data.partialDeduction) {
        logger.debug("[TTS] Partial credit deduction (insufficient funds)", {
          requestedCost: creditsNeeded,
          characterCount,
        });
      }

      return success({
        audioUrl,
        creditCost: creditsNeeded,
      });
    } catch (error) {
      const errorMessage = parseError(error).message;
      logger.error("[TTS] Failed to convert text to speech", {
        error: errorMessage,
        voiceId: data.voiceId,
      });

      return fail({
        message: t("post.errors.conversionFailed", { error: errorMessage }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
  }
}
