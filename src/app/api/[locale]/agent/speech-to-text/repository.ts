/**
 * Speech-to-Text Repository
 * Routes transcription requests to the correct provider based on the STT model's ApiProvider.
 */

import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { getLanguageFromLocale } from "next-vibe/core/i18n/core/language-utils";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { agentEnv } from "../env";
import {
  buildMissingKeyMessage,
  getEnvAvailability,
  getInstanceAvailability,
  PROVIDER_SETUP_INSTRUCTIONS,
} from "../env-availability";
import { ApiProvider } from "@/app/api/[locale]/agent/models/models";
import { DEFAULT_STT_MODEL_SELECTION } from "./constants";
import type { SttModelId } from "./models";
import { getBestSttModel, type SttModelSelection } from "./models";
import { scopedTranslation as creditsScopedTranslation } from "@/app/api/[locale]/credits/i18n";

import { CreditRepository } from "../../credits/repository";
import {
  CREDIT_VALUE_USD,
  STANDARD_MARKUP_PERCENTAGE,
  STT_COST_PER_SECOND,
  STT_MINIMUM_BALANCE,
} from "../../products/repository-client";
import { ModelSelectionType } from "../skills/enum";
import type { SpeechToTextPostResponseOutput } from "./definition";
import {
  scopedTranslation as sttScopedTranslation,
  type SpeechToTextT,
} from "./i18n";
/**
 * Map from MIME type to file extension for Eden AI filename hints.
 * Eden AI uses the filename extension as an additional format signal on top of Content-Type.
 */
const MIME_TO_EXT: Record<string, string> = {
  "audio/webm": "webm",
  "audio/ogg": "ogg",
  "audio/mp4": "mp4",
  "audio/mpeg": "mp3",
  "audio/mp3": "mp3",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
  "audio/flac": "flac",
  "audio/x-flac": "flac",
  "audio/aac": "aac",
  "audio/m4a": "m4a",
  "audio/x-m4a": "m4a",
  "video/webm": "webm",
  "video/ogg": "ogg",
  "video/mp4": "mp4",
};

/**
 * Speech-to-Text Repository
 */
export class SpeechToTextRepository {
  private static readonly MAX_POLLING_ATTEMPTS = 30;
  private static readonly POLLING_INTERVAL_MS = 1000;

  /** Timeout for a single external fetch (ms) */
  private static readonly FETCH_TIMEOUT_MS = 120_000;
  /** Timeout for each Eden AI poll fetch (ms) */
  private static readonly POLL_FETCH_TIMEOUT_MS = 15_000;

  /** Max parallel transcription requests per user request */
  private static readonly CHUNK_CONCURRENCY = 4;

  /**
   * Transcribe one chunk using the resolved provider
   */
  private static async transcribeChunk(
    file: File,
    modelOption: ReturnType<typeof getBestSttModel>,
    language: string,
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
    if (!modelOption) {
      return fail({
        message: t("post.errors.transcriptionFailed", {
          error: "No STT provider available",
        }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    switch (modelOption.apiProvider) {
      case ApiProvider.OPENAI_STT:
        return SpeechToTextRepository.transcribeWithOpenAI(
          file,
          modelOption.providerModel,
          language,
          logger,
          t,
        );
      case ApiProvider.EDEN_AI_STT:
        return SpeechToTextRepository.transcribeWithEdenAI(
          file,
          modelOption.providerModel,
          language,
          logger,
          t,
        );
      case ApiProvider.DEEPGRAM:
        return SpeechToTextRepository.transcribeWithDeepgram(
          file,
          modelOption.providerModel,
          language,
          logger,
          t,
        );
      default:
        logger.error("[STT] Unsupported STT provider", {
          apiProvider: modelOption.apiProvider,
          sttModelId: modelOption.id,
        });
        return fail({
          message: t("post.errors.transcriptionFailed", {
            error: `Unsupported provider: ${modelOption.apiProvider}`,
          }),
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
    }
  }

  /**
   * Transcribe audio to text using model-based provider routing.
   * Accepts one or more chunks - fans out up to 4 in parallel, concatenates in order.
   */
  static async transcribeAudio(
    files: File[],
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    sttModelSelection: SttModelSelection | SttModelId | null,
  ): Promise<ResponseType<SpeechToTextPostResponseOutput>> {
    const t = sttScopedTranslation.scopedT(locale).t;
    const language = getLanguageFromLocale(locale);

    // Accept raw SttModelId string or full selection object; fall back to default
    const selection: SttModelSelection =
      typeof sttModelSelection === "string"
        ? {
            selectionType: ModelSelectionType.MANUAL,
            manualModelId: sttModelSelection,
          }
        : (sttModelSelection ?? DEFAULT_STT_MODEL_SELECTION);
    const _sttAvailability = await getInstanceAvailability();
    const modelOption = getBestSttModel(selection, user, _sttAvailability);

    if (!modelOption) {
      logger.error("[STT] No STT provider available", {
        selection,
      });
      return fail({
        message: t("post.errors.transcriptionFailed", {
          error:
            "No speech-to-text provider is configured. Add OPENAI_API_KEY, EDEN_AI_API_KEY, DEEPGRAM_API_KEY, or UNBOTTLED_CLOUD_CREDENTIALS.",
        }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    logger.debug("[STT] Starting audio transcription", {
      sttModelId: modelOption.id,
      apiProvider: modelOption.apiProvider,
      providerModel: modelOption.providerModel,
      language,
      chunkCount: files.length,
      totalSizeBytes: files.reduce((s, f) => s + f.size, 0),
      chunks: files.map((f, i) => ({
        index: i,
        name: f.name,
        type: f.type,
        sizeBytes: f.size,
      })),
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
      logger.error("[STT] Failed to check balance", {
        error: balanceResult.message,
      });
      return fail({
        message: t("post.errors.balanceCheckFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    if (balanceResult.data.total < STT_MINIMUM_BALANCE) {
      logger.warn("[STT] Insufficient credits", {
        balance: balanceResult.data.total,
        minimum: STT_MINIMUM_BALANCE,
      });
      return fail({
        message: t("post.errors.insufficientCredits", {
          balance: balanceResult.data.total.toString(),
          minimum: STT_MINIMUM_BALANCE.toString(),
        }),
        errorType: ErrorResponseTypes.PAYMENT_REQUIRED,
      });
    }

    try {
      // Fan out chunks up to CHUNK_CONCURRENCY in parallel, preserve order
      const results: Array<
        ResponseType<{
          text: string;
          confidence: number | undefined;
          duration: number;
          edenAiCostUsd: number | undefined;
        }>
      > = Array.from({ length: files.length });

      let idx = 0;
      const runNext = async (): Promise<void> => {
        while (idx < files.length) {
          const i = idx++;
          results[i] = await SpeechToTextRepository.transcribeChunk(
            files[i],
            modelOption,
            language,
            logger,
            t,
          );
          if (!results[i].success) {
            return;
          }
        }
      };

      const workers = Array.from(
        {
          length: Math.min(
            SpeechToTextRepository.CHUNK_CONCURRENCY,
            files.length,
          ),
        },
        runNext,
      );
      await Promise.all(workers);

      // Return first error if any chunk failed
      const failed = results.find((r) => !r.success);
      if (failed) {
        return failed;
      }

      // Aggregate results
      const transcriptionResult = {
        success: true as const,
        text: results
          .map((r) => (r.success ? r.data.text : ""))
          .join(" ")
          .trim(),
        confidence: ((): number | undefined => {
          const withConf = results.filter(
            (r) =>
              r.success &&
              r.data.confidence !== null &&
              r.data.confidence !== undefined,
          );
          if (withConf.length === 0) {
            return undefined;
          }
          return (
            withConf.reduce(
              (sum, r) => sum + (r.success ? (r.data.confidence ?? 0) : 0),
              0,
            ) / withConf.length
          );
        })(),
        duration: results.reduce(
          (sum, r) => sum + (r.success ? r.data.duration : 0),
          0,
        ),
        edenAiCostUsd: results.reduce(
          (sum, r) =>
            sum +
            (r.success &&
            r.data.edenAiCostUsd !== null &&
            r.data.edenAiCostUsd !== undefined
              ? r.data.edenAiCostUsd
              : 0),
          0,
        ),
      };

      const { text, confidence, duration, edenAiCostUsd } = transcriptionResult;

      // Calculate credits
      let creditsNeeded: number;
      if (
        edenAiCostUsd !== null &&
        edenAiCostUsd !== undefined &&
        edenAiCostUsd > 0
      ) {
        creditsNeeded =
          (edenAiCostUsd * (1 + STANDARD_MARKUP_PERCENTAGE)) / CREDIT_VALUE_USD;
        logger.debug("[STT] Using actual cost for credit calculation", {
          edenAiCostUsd,
          creditsNeeded,
        });
      } else if (duration > 0) {
        creditsNeeded = duration * STT_COST_PER_SECOND;
      } else {
        logger.error(
          "[STT] Provider did not return cost or duration - charging 1-second minimum",
          { sttModelId: modelOption.id },
        );
        creditsNeeded = STT_COST_PER_SECOND;
      }

      logger.debug("[STT] Transcription successful", {
        textLength: text.length,
        sttModelId: modelOption.id,
        apiProvider: modelOption.apiProvider,
        duration,
        creditsNeeded,
      });

      // Deduct credits AFTER successful completion
      const deductResult = await CreditRepository.deductCreditsForSTT(
        user,
        creditsNeeded,
        logger,
        tCredits,
        locale,
      );

      if (!deductResult.success) {
        logger.error("[STT] Failed to deduct credits", {
          creditsNeeded,
          duration,
        });
        return fail({
          message: t("post.errors.creditsFailed", {
            error: deductResult.message,
          }),
          errorType: ErrorResponseTypes.PAYMENT_ERROR,
        });
      }

      if (deductResult.data.partialDeduction) {
        logger.debug("[STT] Partial credit deduction (insufficient funds)", {
          requestedCost: creditsNeeded,
          duration,
        });
      }

      return success({
        creditCost: creditsNeeded,
        response: {
          success: true,
          text,
          provider: modelOption.apiProvider,
          confidence,
        },
      });
    } catch (error) {
      const errorMessage = parseError(error).message;
      logger.error("[STT] Failed to transcribe audio", {
        error: errorMessage,
        sttModelId: modelOption.id,
        apiProvider: modelOption.apiProvider,
      });

      return fail({
        message: t("post.errors.transcriptionFailed", { error: errorMessage }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
  }

  /**
   * Transcribe using OpenAI Whisper API directly
   */
  private static async transcribeWithOpenAI(
    file: File,
    providerModel: string,
    language: string,
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
    if (!agentEnv.OPENAI_API_KEY) {
      const { envKey, url, label } = PROVIDER_SETUP_INSTRUCTIONS.openAiImages;
      logger.error("[STT] OpenAI API key not configured");
      return fail({
        message: t("post.errors.transcriptionFailed", {
          error: `${label} key (${envKey}) not configured. Get yours at ${url}`,
        }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    // Strip codec suffix and normalize MIME type for OpenAI Whisper compatibility
    const baseType = file.type.split(";")[0].trim();
    const normalizedMime =
      baseType === "video/webm"
        ? "audio/webm"
        : baseType === "video/ogg"
          ? "audio/ogg"
          : baseType;
    const normalizedFile =
      normalizedMime === file.type
        ? file
        : new File([await file.arrayBuffer()], file.name, {
            type: normalizedMime,
          });

    const formData = new FormData();
    formData.append("file", normalizedFile, normalizedFile.name);
    formData.append("model", providerModel);
    formData.append("language", language);
    formData.append("response_format", "verbose_json");

    logger.debug("[STT] Calling OpenAI Whisper API", {
      model: providerModel,
      language,
      originalMime: file.type,
      normalizedMime,
      originalFileName: file.name,
      fileSize: file.size,
    });

    const response = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          // eslint-disable-next-line i18next/no-literal-string
          Authorization: `Bearer ${agentEnv.OPENAI_API_KEY}`,
        },
        body: formData,
        signal: AbortSignal.timeout(SpeechToTextRepository.FETCH_TIMEOUT_MS),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      logger.error("[STT] OpenAI Whisper API error", {
        status: response.status,
        error: errorText,
        normalizedMime,
        fileSize: file.size,
        model: providerModel,
      });
      return fail({
        message: t("post.errors.transcriptionFailed", { error: errorText }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const data = (await response.json()) as {
      text?: string;
      duration?: number;
      segments?: Array<{ avg_logprob?: number }>;
    };

    const text = data.text ?? "";
    const duration = data.duration ?? 0;
    // OpenAI doesn't return a confidence score directly, approximate from log prob
    const confidence =
      data.segments && data.segments.length > 0
        ? Math.exp(
            data.segments.reduce((sum, s) => sum + (s.avg_logprob ?? 0), 0) /
              data.segments.length,
          )
        : undefined;

    return success({ text, confidence, duration, edenAiCostUsd: undefined });
  }

  /**
   * Transcribe using Eden AI (async polling flow).
   */
  private static async transcribeWithEdenAI(
    file: File,
    providerModel: string,
    language: string,
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
    if (!getEnvAvailability().voice) {
      logger.error(
        "[STT] Eden AI not configured",
        buildMissingKeyMessage("voice"),
      );
      return fail({
        message: t("post.errors.apiKeyMissing"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    if (file.size < 5000) {
      logger.error("[STT] File too small to contain audio", {
        fileSize: file.size,
        fileName: file.name,
      });
      return fail({
        message: t("post.errors.audioTooShort"),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    const baseType = file.type.split(";")[0].trim();
    const mimeType =
      baseType === "video/webm"
        ? "audio/webm"
        : baseType === "video/ogg"
          ? "audio/ogg"
          : baseType;

    const ext = MIME_TO_EXT[mimeType] ?? mimeType.split("/")[1] ?? "webm";
    const normalizedFileName = `audio.${ext}`;
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: mimeType });

    const headerBytes = new Uint8Array(arrayBuffer.slice(0, 12));
    const fileHeader = [...headerBytes]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(" ");

    logger.debug("[STT] Starting Eden AI transcription", {
      originalFileName: file.name,
      normalizedFileName,
      originalMime: file.type,
      normalizedMime: mimeType,
      fileSize: file.size,
      language,
      edenProvider: providerModel,
      fileHeader,
    });

    return SpeechToTextRepository.tryEdenAIProvider(
      blob,
      normalizedFileName,
      mimeType,
      providerModel,
      language,
      logger,
      t,
    );
  }

  /**
   * Attempt transcription with a single Eden AI provider.
   * Returns success or a typed failure - never throws.
   */
  private static async tryEdenAIProvider(
    blob: Blob,
    fileName: string,
    mimeType: string,
    edenProvider: string,
    language: string,
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
    const formData = new FormData();
    formData.append("file", blob, fileName);
    formData.append("providers", edenProvider);
    formData.append("language", language);

    logger.debug("[STT] Sending to Eden AI", {
      edenProvider,
      fileName,
      mimeType,
      fileSize: blob.size,
      language,
    });

    const response = await fetch(
      "https://api.edenai.run/v2/audio/speech_to_text_async",
      {
        method: "POST",
        headers: {
          // eslint-disable-next-line i18next/no-literal-string
          Authorization: `Bearer ${agentEnv.EDEN_AI_API_KEY}`,
        },
        body: formData,
        signal: AbortSignal.timeout(SpeechToTextRepository.FETCH_TIMEOUT_MS),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      logger.error("[STT] Eden AI API error", {
        status: response.status,
        error: errorText,
        edenProvider,
        mimeType,
        language,
      });
      return fail({
        message: t("post.errors.transcriptionFailed", { error: errorText }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const responseData = (await response.json()) as { public_id?: string };
    const publicId = responseData.public_id;

    if (!publicId) {
      logger.error("[STT] No public ID from Eden AI", {
        edenProvider,
        responseData: JSON.stringify(responseData),
      });
      return fail({
        message: t("post.errors.noPublicId"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    return SpeechToTextRepository.pollForResults(
      publicId,
      edenProvider,
      logger,
      t,
    );
  }

  /**
   * Transcribe using Deepgram API
   */
  private static async transcribeWithDeepgram(
    file: File,
    providerModel: string,
    language: string,
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
    if (!agentEnv.DEEPGRAM_API_KEY) {
      logger.error("[STT] Deepgram API key not configured");
      return fail({
        message: t("post.errors.transcriptionFailed", {
          error:
            "DEEPGRAM_API_KEY not configured. Get yours at https://console.deepgram.com",
        }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const arrayBuffer = await file.arrayBuffer();

    logger.debug("[STT] Calling Deepgram API", {
      model: providerModel,
      language,
      fileSize: file.size,
    });

    const url = new URL("https://api.deepgram.com/v1/listen");
    url.searchParams.set("model", providerModel);
    url.searchParams.set("language", language);

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        // eslint-disable-next-line i18next/no-literal-string
        Authorization: `Token ${agentEnv.DEEPGRAM_API_KEY}`,
        "Content-Type": file.type || "audio/mpeg",
      },
      body: arrayBuffer,
      signal: AbortSignal.timeout(SpeechToTextRepository.FETCH_TIMEOUT_MS),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error("[STT] Deepgram API error", {
        status: response.status,
        error: errorText,
      });
      return fail({
        message: t("post.errors.transcriptionFailed", { error: errorText }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const data = (await response.json()) as {
      results?: {
        channels?: Array<{
          alternatives?: Array<{
            transcript?: string;
            confidence?: number;
          }>;
        }>;
      };
      metadata?: {
        duration?: number;
      };
    };

    const alt = data.results?.channels?.[0]?.alternatives?.[0];
    const text = alt?.transcript ?? "";
    const confidence = alt?.confidence;
    const duration = data.metadata?.duration ?? 0;

    return success({ text, confidence, duration, edenAiCostUsd: undefined });
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
            signal: AbortSignal.timeout(
              SpeechToTextRepository.POLL_FETCH_TIMEOUT_MS,
            ),
          },
        );

        if (!response.ok) {
          logger.error("[STT] Failed to poll transcription results", {
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
            [providerKey: string]: {
              id?: string;
              text?: string;
              confidence?: number;
              diarization?: { total_speakers?: number };
              audio_duration?: number;
              error?: string | { message?: string; type?: string };
              final_status?: string;
              cost?: number;
            };
          };
        };

        logger.debug("[STT] Polling response received", {
          status: resultData.status,
          hasResults: !!resultData.results,
          provider,
          providerResultKeys: resultData.results?.[provider]
            ? Object.keys(resultData.results[provider])
            : [],
        });

        if (resultData.status === "finished") {
          const providerResult = resultData.results[provider];

          if (!providerResult) {
            logger.error("[STT] Provider result not found in response", {
              provider,
              availableProviders: Object.keys(resultData.results || {}),
            });
            return fail({
              message: t("post.errors.transcriptionFailed", {
                error: `Provider ${provider} not found in results`,
              }),
              errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
            });
          }

          if (
            providerResult.error ||
            providerResult.final_status === "failed"
          ) {
            const errorMessage =
              typeof providerResult.error === "string"
                ? providerResult.error
                : providerResult.error?.message || "Unknown provider error";

            logger.error("[STT] Provider returned error", {
              provider,
              error: errorMessage,
              finalStatus: providerResult.final_status,
            });

            return fail({
              message: t("post.errors.providerError"),
              errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
            });
          }

          const transcription = providerResult?.text ?? "";
          const confidence = providerResult?.confidence;
          const duration = providerResult?.audio_duration ?? 0;
          const edenAiCostUsd = providerResult?.cost;

          logger.debug("[STT] Transcription completed", {
            textLength: transcription.length,
            attempts,
            confidence,
            duration,
            edenAiCostUsd,
          });

          if (!transcription || transcription.length === 0) {
            logger.warn("[STT] Empty transcription received", { duration });
          }

          return success({
            text: transcription,
            confidence,
            duration,
            edenAiCostUsd,
          });
        } else if (resultData.status === "failed") {
          logger.error("[STT] Transcription failed", { publicId, provider });
          return fail({
            message: t("post.errors.failed"),
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          });
        }

        attempts++;
        logger.debug("[STT] Polling for transcription results", {
          attempts,
          publicId,
          status: resultData.status,
        });
      } catch (error) {
        const errorMessage = parseError(error).message;
        logger.error("[STT] Error while polling", {
          error: errorMessage,
          attempts,
        });
        return fail({
          message: t("post.errors.transcriptionFailed", {
            error: errorMessage,
          }),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }
    }

    logger.error("[STT] Transcription timeout", { publicId, provider });
    return fail({
      message: t("post.errors.timeout"),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
}
