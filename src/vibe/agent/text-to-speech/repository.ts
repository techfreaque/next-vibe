/**
 * Text-to-Speech Repository
 * Routes TTS requests to the correct provider based on the voice model's ApiProvider.
 */

import "server-only";

import {
  DefaultFolderId,
  type ToolExecutionContext,
} from "next-vibe/core/execution-context";
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
import { formatCreditAmount } from "@/products/credit-money";

import { createFixtureFetch } from "../ai-stream/testing/fetch-cache";
import { getStorageAdapter } from "../chat/storage/index";
import { agentEnv } from "../env";
import { PROVIDER_SETUP_INSTRUCTIONS } from "../env-availability";
import { getEnvAvailability } from "../env-availability";
import { MediaStudioRepository } from "../media-studio/repository";
import {
  EDEN_AI_URLS,
  edenAiErrorMessage,
  edenAiTtsResponseSchema,
  parseEdenAiCost,
  parseEdenAiTtsProviderModel,
} from "../models/eden-ai";
import { ApiProvider, calculateTtsCreditCost } from "../models/models";
import { UncensoredConsentRepository } from "../models/uncensored-consent/repository";
import { ModelSelectionType } from "../skills/enum";
import { TTS_OUTPUT_FORMATS, type TtsOutputFormat } from "./constants";
import type {
  TextToSpeechPostRequestOutput,
  TextToSpeechPostResponseOutput,
} from "./definition";
import { parseElevenLabsProviderModel } from "./elevenlabs";
import type { TextToSpeechT } from "./i18n";
import { calculateTtsCharge, getBestTtsModel } from "./models";

/**
 * Formats each TTS provider can deliver. OpenAI-compatible providers take
 * OpenAI's response_format; ElevenLabs maps a subset onto its output_format;
 * Eden AI always returns mp3.
 */
export const TTS_FORMATS_BY_PROVIDER: Partial<
  Record<ApiProvider, readonly TtsOutputFormat[]>
> = {
  [ApiProvider.OPENAI_TTS]: TTS_OUTPUT_FORMATS,
  [ApiProvider.NANO_GPT]: TTS_OUTPUT_FORMATS,
  [ApiProvider.ELEVENLABS]: ["mp3", "opus", "pcm"],
  [ApiProvider.EDEN_AI_TTS]: ["mp3"],
};

/** Providers that honour a speed multiplier. */
export const TTS_SPEED_PROVIDERS: readonly ApiProvider[] = [
  ApiProvider.OPENAI_TTS,
  ApiProvider.NANO_GPT,
  ApiProvider.ELEVENLABS,
];

/**
 * Output options of one TTS call (the /v1/audio/speech API). Absent = the
 * provider default (mp3, normal speed), which is what the chat tool uses.
 */
export interface TtsOutputOptions {
  format?: TtsOutputFormat;
  /** 0.25 - 4.0 (ElevenLabs clamps to its own 0.7 - 1.2) */
  speed?: number;
}

const ELEVENLABS_OUTPUT_FORMAT: Partial<Record<TtsOutputFormat, string>> = {
  mp3: "mp3_44100_128",
  opus: "opus_48000_64",
  pcm: "pcm_24000",
};

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
    output: TtsOutputOptions,
  ): Promise<ResponseType<string>> {
    if (!agentEnv.OPENAI_API_KEY) {
      const { envKey, url, label } = PROVIDER_SETUP_INSTRUCTIONS.openAiTts;
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
        response_format: output.format,
        speed: output.speed,
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
   * Convert text to speech via NanoGPT (OpenAI-compatible /audio/speech).
   * providerModel = "<nanoModelId>:<voice>" (e.g. "Kokoro-82m:af_bella").
   */
  private static async callNanoGptTTS(
    text: string,
    providerModel: string,
    logger: EndpointLogger,
    t: TextToSpeechT,
    fetchImpl: typeof globalThis.fetch,
    output: TtsOutputOptions,
  ): Promise<ResponseType<string>> {
    if (!agentEnv.NANO_GPT_API_KEY) {
      const { envKey, url, label } = PROVIDER_SETUP_INSTRUCTIONS.nanoGPT;
      return fail({
        message: t("post.errors.notConfigured", { label, envKey, url }),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    const sep = providerModel.indexOf(":");
    const model = sep === -1 ? providerModel : providerModel.slice(0, sep);
    const voice = sep === -1 ? undefined : providerModel.slice(sep + 1);

    logger.debug("[TTS] Calling NanoGPT TTS API", { model, voice });

    const response = await fetchImpl(
      "https://api.nano-gpt.com/api/v1/audio/speech",
      {
        method: "POST",
        headers: {
          // eslint-disable-next-line i18next/no-literal-string
          Authorization: `Bearer ${agentEnv.NANO_GPT_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          input: text,
          voice,
          response_format: output.format,
          speed: output.speed,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      logger.error("[TTS] NanoGPT TTS API error", {
        status: response.status,
        error: errorText,
        model,
        voice,
        format: output.format ?? "default",
        speed: output.speed ?? null,
        inputChars: text.length,
        providerRequestId: response.headers.get("x-request-id"),
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
   * Convert text to speech via Eden AI TTS (API v3, POST /v3/universal-ai).
   * providerModel = "<provider>/<model>:<voice>" (e.g. "openai/tts-1:nova").
   */
  private static async callEdenAITTS(
    text: string,
    providerModel: string,
    logger: EndpointLogger,
    t: TextToSpeechT,
    fetchImpl: typeof globalThis.fetch,
  ): Promise<ResponseType<{ audioUrl: string; costUsd: number | undefined }>> {
    if (!agentEnv.EDEN_AI_API_KEY) {
      const { envKey, url, label } = PROVIDER_SETUP_INSTRUCTIONS.edenAiTts;
      return fail({
        message: t("post.errors.notConfigured", { label, envKey, url }),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    const { model, voice } = parseEdenAiTtsProviderModel(providerModel);
    logger.debug("[TTS] Calling Eden AI TTS API", { model, voice });

    const response = await fetchImpl(EDEN_AI_URLS.universalAi, {
      method: "POST",
      headers: {
        // eslint-disable-next-line i18next/no-literal-string
        Authorization: `Bearer ${agentEnv.EDEN_AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model, input: { text, voice } }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error("[TTS] Eden AI TTS API error", {
        status: response.status,
        error: errorText,
        model,
      });
      return fail({
        message: t("post.errors.conversionFailed", { error: errorText }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const parsed = edenAiTtsResponseSchema.safeParse(await response.json());
    if (!parsed.success) {
      logger.error("[TTS] Unexpected Eden AI TTS response", {
        model,
        error: parsed.error.message,
      });
      return fail({
        message: t("post.errors.providerError", {
          error: parsed.error.message,
        }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    const result = parsed.data;

    if (result.status !== "success") {
      const errorMessage =
        edenAiErrorMessage(result.error) ?? "Unknown provider error";
      logger.error("[TTS] Eden AI provider error", {
        model,
        status: result.status,
        error: errorMessage,
      });
      return fail({
        message: t("post.errors.providerError", { error: errorMessage }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const audioResourceUrl = result.output?.audio_resource_url;
    if (!audioResourceUrl) {
      logger.error("[TTS] No audio URL in Eden AI response", { model });
      return fail({
        message: t("post.errors.noAudioUrl"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const audioResult = await TextToSpeechRepository.fetchAndConvertAudio(
      audioResourceUrl,
      logger,
      t,
      fetchImpl,
    );
    if (!audioResult.success) {
      return audioResult;
    }
    // Eden AI reports what it charged us; billing prefers it over the list rate.
    return success({
      audioUrl: audioResult.data,
      costUsd: parseEdenAiCost(result.cost),
    });
  }

  /**
   * Convert text to speech via ElevenLabs API
   * providerModel = "<model_id>:<voice_id>" (e.g. "eleven_v4:21m00Tcm4TlvDq8ikWAM")
   */
  private static async callElevenLabsTTS(
    text: string,
    providerModel: string,
    logger: EndpointLogger,
    t: TextToSpeechT,
    fetchImpl: typeof globalThis.fetch,
    output: TtsOutputOptions,
  ): Promise<ResponseType<string>> {
    if (!agentEnv.ELEVENLABS_API_KEY) {
      const { envKey, url, label } = PROVIDER_SETUP_INSTRUCTIONS.elevenlabs;
      return fail({
        message: t("post.errors.notConfigured", { label, envKey, url }),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    const { modelId, voiceId } = parseElevenLabsProviderModel(providerModel);
    logger.debug("[TTS] Calling ElevenLabs TTS API", { modelId, voiceId });

    const outputFormat = output.format
      ? ELEVENLABS_OUTPUT_FORMAT[output.format]
      : undefined;
    const query = outputFormat ? `?output_format=${outputFormat}` : "";
    const response = await fetchImpl(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}${query}`,
      {
        method: "POST",
        headers: {
          // eslint-disable-next-line i18next/no-literal-string
          "xi-api-key": agentEnv.ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: modelId,
          ...(output.speed === undefined
            ? {}
            : {
                voice_settings: {
                  speed: Math.min(1.2, Math.max(0.7, output.speed)),
                },
              }),
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
  static submit(
    data: TextToSpeechPostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: TextToSpeechT,
    toolExecutionContext: ToolExecutionContext,
  ): Promise<ResponseType<TextToSpeechPostResponseOutput>> {
    return MediaStudioRepository.run({
      save: !toolExecutionContext.threadId && data.saveToStudio,
      kind: "speech",
      model: data.voiceId,
      title: data.text,
      user,
      locale,
      logger,
      generate: () =>
        TextToSpeechRepository.convertTextToSpeech(
          data,
          user,
          locale,
          logger,
          t,
          toolExecutionContext,
        ),
    });
  }

  static async convertTextToSpeech(
    data: TextToSpeechPostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: TextToSpeechT,
    /** Fixture chain of the calling stream — provider calls bind it. */
    toolExecutionContext: ToolExecutionContext,
    /** Audio format + speed (the /v1/audio/speech API); default mp3, 1x. */
    output: TtsOutputOptions = {},
  ): Promise<ResponseType<TextToSpeechPostResponseOutput>> {
    // voiceId is resolved via fieldDefaults in route.ts (from favorites/skill config)
    if (!data.voiceId) {
      return fail({
        message: t("post.errors.not_found.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }
    const _ttsAvailability = await getEnvAvailability();
    const modelOption = getBestTtsModel(
      { selectionType: ModelSelectionType.MANUAL, manualModelId: data.voiceId },
      user,
      _ttsAvailability,
    );
    if (!modelOption) {
      // No voice of any configured provider can serve this request — say so
      // (and how to fix it) instead of a bare "Not Found".
      logger.warn("[TTS] No TTS provider available", {
        voiceId: data.voiceId,
      });
      return fail({
        message: t("post.errors.noTtsProviderConfigured"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    const consent = await UncensoredConsentRepository.gate({
      content: modelOption.content,
      modelName: modelOption.name,
      user,
      locale,
      logger,
    });
    if (!consent.success) {
      return consent;
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

    // Price of THIS request at the selected voice's own rate: the balance
    // must cover it (a deduction later only takes what is left).
    const characterCount = data.text.length;
    const estimatedCredits = calculateTtsCreditCost(
      modelOption,
      characterCount,
    );

    if (balanceResult.data.total < estimatedCredits) {
      logger.warn("[TTS] Insufficient credits", {
        balance: balanceResult.data.total,
        minimum: estimatedCredits,
        voiceId: modelOption.id,
        apiProvider: modelOption.apiProvider,
        characterCount,
      });
      return fail({
        message: t("post.errors.insufficientCredits", {
          balance: formatCreditAmount(balanceResult.data.total, locale),
          minimum: formatCreditAmount(estimatedCredits, locale),
        }),
        errorType: ErrorResponseTypes.PAYMENT_REQUIRED,
      });
    }

    logger.debug("[TTS] Calculating TTS credits", {
      characterCount,
      estimatedCredits,
      creditCostPerCharacter: modelOption.creditCostPerCharacter,
    });

    // One fixture-aware fetch per conversion - carries the repeat counter, so
    // it must not be recreated per call.
    const fetchImpl = createFixtureFetch(toolExecutionContext, logger);

    try {
      let audioResult: ResponseType<string>;
      /** Real upstream charge in USD, when the provider reports one. */
      let providerCostUsd: number | undefined;

      switch (modelOption.apiProvider) {
        case ApiProvider.OPENAI_TTS:
          audioResult = await TextToSpeechRepository.callOpenAITTS(
            data.text,
            modelOption.providerModel,
            language,
            logger,
            t,
            fetchImpl,
            output,
          );
          break;

        case ApiProvider.EDEN_AI_TTS: {
          const edenResult = await TextToSpeechRepository.callEdenAITTS(
            data.text,
            modelOption.providerModel,
            logger,
            t,
            fetchImpl,
          );
          if (!edenResult.success) {
            return edenResult;
          }
          audioResult = success(edenResult.data.audioUrl);
          providerCostUsd = edenResult.data.costUsd;
          break;
        }

        case ApiProvider.NANO_GPT:
          audioResult = await TextToSpeechRepository.callNanoGptTTS(
            data.text,
            modelOption.providerModel,
            logger,
            t,
            fetchImpl,
            output,
          );
          break;

        case ApiProvider.ELEVENLABS:
          audioResult = await TextToSpeechRepository.callElevenLabsTTS(
            data.text,
            modelOption.providerModel,
            logger,
            t,
            fetchImpl,
            output,
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
      const scThreadId =
        toolExecutionContext.threadId ??
        (data.saveToStudio ? crypto.randomUUID() : undefined);
      if (scThreadId && audioUrl.startsWith("data:")) {
        try {
          const commaIdx = audioUrl.indexOf(",");
          const mimeType =
            audioUrl.slice(5, commaIdx).split(";")[0] || "audio/mpeg";
          const audioBuffer = Buffer.from(
            audioUrl.slice(commaIdx + 1),
            "base64",
          );
          const isIncognito = toolExecutionContext.threadId
            ? toolExecutionContext.rootFolderId === DefaultFolderId.INCOGNITO
            : user.isPublic;
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

      if (data.saveToStudio && (!audioUrl || audioUrl.startsWith("data:"))) {
        return fail({
          message: t("post.errors.audioFetchFailed"),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }

      logger.debug("[TTS] Text-to-speech conversion successful", {
        audioSize: audioUrl.length,
        provider: modelOption.apiProvider,
      });

      // Bill the real upstream charge when the provider reported one,
      // otherwise the voice's own per-character rate. Same markup either way.
      const creditsNeeded = calculateTtsCharge(
        modelOption,
        characterCount,
        providerCostUsd,
      );

      logger.debug("[TTS] Billing TTS request", {
        characterCount,
        creditsNeeded,
        providerCostUsd,
        voiceId: modelOption.id,
        apiProvider: modelOption.apiProvider,
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
