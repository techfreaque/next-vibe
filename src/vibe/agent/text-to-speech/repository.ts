/**
 * Text-to-Speech Repository
 * Routes TTS requests to the correct provider based on the voice model's ApiProvider.
 */

import "server-only";

import { createFixtureFetch } from "next-vibe/agent/ai-stream/testing/fetch-cache";
import { getStorageAdapter } from "next-vibe/agent/chat/storage/index";
import { ApiProvider } from "next-vibe/agent/models/models";
import { ModelSelectionType } from "next-vibe/agent/skills/enum";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { getLanguageFromLocale } from "next-vibe/core/i18n/core/language-utils";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";
import { CreditRepository } from "@/credits/repository";
import {
  TTS_COST_PER_CHARACTER,
  TTS_MINIMUM_BALANCE,
} from "@/products/repository-client";

import { DefaultFolderId, type ToolExecutionContext } from "../chat/config";
import { agentEnv } from "../env";
import {
  getInstanceAvailability,
  PROVIDER_SETUP_INSTRUCTIONS,
} from "../env-availability";
import type {
  TextToSpeechPostRequestOutput,
  TextToSpeechPostResponseOutput,
} from "./definition";
import type { TextToSpeechT } from "./i18n";
import { getBestTtsModel } from "./models";

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
    fetchImpl: typeof globalThis.fetch,
  ): Promise<ResponseType<string>> {
    const audioResponse = await fetchImpl(audioResourceUrl);
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
    fetchImpl: typeof globalThis.fetch,
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

    const response = await fetchImpl("https://api.openai.com/v1/audio/speech", {
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
    fetchImpl: typeof globalThis.fetch,
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

    const response = await fetchImpl(
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
      fetchImpl,
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
    fetchImpl: typeof globalThis.fetch,
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

    const response = await fetchImpl(
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
    /** Fixture chain of the calling stream — provider calls bind it. */
    streamContext: ToolExecutionContext,
  ): Promise<ResponseType<TextToSpeechPostResponseOutput>> {
    // voiceId is resolved via fieldDefaults in route.ts (from favorites/skill config)
    if (!data.voiceId) {
      return fail({
        message: t("post.errors.not_found.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }
    const _ttsAvailability = await getInstanceAvailability();
    const modelOption = getBestTtsModel(
      { selectionType: ModelSelectionType.MANUAL, manualModelId: data.voiceId },
      user,
      _ttsAvailability,
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

    // One fixture-aware fetch per conversion - carries the repeat counter, so
    // it must not be recreated per call.
    const fetchImpl = createFixtureFetch(streamContext, logger);

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
            fetchImpl,
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
            fetchImpl,
          );
          break;
        }

        case ApiProvider.ELEVENLABS:
          audioResult = await TextToSpeechRepository.callElevenLabsTTS(
            data.text,
            modelOption.providerModel,
            logger,
            t,
            fetchImpl,
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

      let audioUrl = audioResult.data;

      // Upload to storage so message history only ever carries a URL — a data
      // URI in the tool result blows up the model context on later turns.
      // Incognito threads have no server-side thread row — the file is owned
      // by the caller's leadId and served only to that lead (browser).
      // Without a thread (standalone tool call) keep the data URI for
      // immediate playback.
      const scThreadId = streamContext.threadId;
      if (scThreadId && audioUrl.startsWith("data:")) {
        try {
          const commaIdx = audioUrl.indexOf(",");
          const mimeType =
            audioUrl.slice(5, commaIdx).split(";")[0] || "audio/mpeg";
          const audioBuffer = Buffer.from(
            audioUrl.slice(commaIdx + 1),
            "base64",
          );
          const isIncognito =
            streamContext.rootFolderId === DefaultFolderId.INCOGNITO;
          const ext =
            mimeType === "audio/mpeg"
              ? "mp3"
              : (mimeType.split("/")[1] ?? "mp3");
          const storage = getStorageAdapter();
          const uploadResult = await storage.uploadFile(audioBuffer, {
            filename: `generated-speech-${Date.now()}.${ext}`,
            mimeType,
            threadId: scThreadId,
            userId: isIncognito ? undefined : user.id,
            leadId: isIncognito ? user.leadId : undefined,
          });
          audioUrl = uploadResult.url;
        } catch (uploadErr) {
          logger.error(
            "[TTS] Failed to upload audio to storage, using data URI",
            {
              error:
                uploadErr instanceof Error
                  ? uploadErr.message
                  : String(uploadErr),
            },
          );
        }
      }

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
