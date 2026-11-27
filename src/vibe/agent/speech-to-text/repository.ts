/**
 * Speech-to-Text Repository
 * Routes transcription requests to the correct provider based on the STT model's ApiProvider.
 */

import "server-only";

import type { ToolExecutionContext } from "next-vibe/core/execution-context";
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
import { z } from "zod";

import { protectedBalance } from "@/credits/anti-farming/spending";
import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";
import { CreditRepository } from "@/credits/repository";
import { formatCreditAmount } from "@/products/credit-money";

import { createFixtureFetch } from "../ai-stream/testing/fetch-cache";
import { agentEnv } from "../env";
import {
  buildMissingKeyMessage,
  PROVIDER_SETUP_INSTRUCTIONS,
} from "../env-availability";
import { getEnvAvailability } from "../env-availability";
import {
  MediaStudioRepository,
  type ProviderJobIdRecorder,
} from "../media-studio/repository";
import { toStudioSettings } from "../media-studio/settings";
import {
  EDEN_AI_URLS,
  edenAiErrorMessage,
  type EdenAiSttJob,
  edenAiSttJobSchema,
  edenAiSttModel,
  edenAiUploadResponseSchema,
  parseEdenAiCost,
} from "../models/eden-ai";
import { ApiProvider, calculateSttCreditCost } from "../models/models";
import { pollDelay } from "../shared/poll-delay";
import {
  extractHeaderRequestId,
  mergeProviderJobIds,
  normalizeProviderJobId,
} from "../shared/provider-job-id";
import { ModelSelectionType } from "../skills/enum";
import { DEFAULT_STT_MODEL_SELECTION, STT_AUTO_LANGUAGE } from "./constants";
import type {
  SpeechToTextPostRequestOutput,
  SpeechToTextPostResponseOutput,
} from "./definition";
import {
  scopedTranslation as sttScopedTranslation,
  type SpeechToTextT,
} from "./i18n";
import type { SttModelId } from "./models";
import {
  calculateSttCharge,
  getBestSttModel,
  type SttModelSelection,
} from "./models";
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

/** One timed piece of a transcript (seconds from the start of the audio). */
export interface SttSegment {
  start: number;
  end: number;
  text: string;
}

/**
 * Per-call options (the /v1/audio API). Absent = the chat tool's behaviour:
 * transcribe in the caller's locale language.
 */
export interface SttCallOptions {
  /** ISO-639-1 language of the audio; default: the request locale's */
  language?: string;
  /** "translate" = English translation (Whisper on OpenAI only) */
  task?: "transcribe" | "translate";
}

/** A finished transcription with everything a caller may render. */
export interface SttTranscription {
  text: string;
  creditCost: number;
  provider: ApiProvider;
  sttModelId: SttModelId;
  confidence: number | undefined;
  /** seconds of audio, when the provider reports it (else 0) */
  duration: number;
  language: string;
  /** timed segments where the provider returns them (OpenAI Whisper) */
  segments: SttSegment[] | undefined;
}

interface SttChunkResult {
  text: string;
  confidence: number | undefined;
  duration: number;
  providerCostUsd: number | undefined;
  providerJobId?: string;
  segments?: SttSegment[];
}

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

  /**
   * Below this a recording holds no audio: an empty mp4/webm container is
   * ~0.7 KB (iOS Safari sent 772 bytes and 0 bytes, prod 2026-11-17, both
   * rejected by Eden as "too short" / "failed to extract media metadata").
   */
  static readonly MIN_AUDIO_BYTES = 1024;

  /** Provider wording for an empty or sub-0.1 s recording. */
  private static readonly TOO_SHORT_PATTERN =
    /audio_too_short|too short|failed to extract media metadata/i;

  /** Max parallel transcription requests per user request */
  private static readonly CHUNK_CONCURRENCY = 4;

  /** Pre-flight: the balance must cover this many seconds at the model's rate */
  private static readonly MINIMUM_BALANCE_SECONDS = 5;

  private static readonly compatibleTranscriptSchema = z.object({
    id: z.string().optional(),
    text: z.string().optional(),
    duration: z.number().optional(),
    segments: z
      .array(
        z.object({
          avg_logprob: z.number().optional(),
          start: z.number().optional(),
          end: z.number().optional(),
          text: z.string().optional(),
        }),
      )
      .optional(),
    usage: z
      .object({
        cost: z.number().optional(),
        currency: z.string().optional(),
        seconds: z.number().optional(),
      })
      .optional(),
  });

  /**
   * Transcribe one chunk using the resolved provider
   */
  private static async transcribeChunk(
    file: File,
    modelOption: ReturnType<typeof getBestSttModel>,
    /** ISO-639-1; undefined = the provider detects it */
    language: string | undefined,
    logger: EndpointLogger,
    t: SpeechToTextT,
    fetchImpl: typeof globalThis.fetch,
    task: SttCallOptions["task"],
    onProviderJobId?: ProviderJobIdRecorder,
  ): Promise<ResponseType<SttChunkResult>> {
    if (!modelOption) {
      return fail({
        message: t("post.errors.noSttProvider"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    if (
      task === "translate" &&
      modelOption.apiProvider !== ApiProvider.OPENAI_STT
    ) {
      return fail({
        message: t("post.errors.unsupportedProvider", {
          provider: modelOption.apiProvider,
        }),
        errorType: ErrorResponseTypes.BAD_REQUEST,
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
          fetchImpl,
          "openAiStt",
          task,
        );
      case ApiProvider.NANO_GPT:
      case ApiProvider.OPENROUTER:
        return SpeechToTextRepository.transcribeWithOpenAI(
          file,
          modelOption.providerModel,
          language,
          logger,
          t,
          fetchImpl,
          modelOption.apiProvider === ApiProvider.OPENROUTER
            ? "openRouter"
            : "nanoGPT",
        );
      case ApiProvider.EDEN_AI_STT:
        return SpeechToTextRepository.transcribeWithEdenAI(
          file,
          modelOption.providerModel,
          language,
          logger,
          t,
          fetchImpl,
          onProviderJobId,
        );
      case ApiProvider.DEEPGRAM:
        return SpeechToTextRepository.transcribeWithDeepgram(
          file,
          modelOption.providerModel,
          language,
          logger,
          t,
          fetchImpl,
        );
      default:
        logger.error("[STT] Unsupported STT provider", {
          apiProvider: modelOption.apiProvider,
          sttModelId: modelOption.id,
        });
        return fail({
          message: t("post.errors.unsupportedProvider", {
            provider: modelOption.apiProvider,
          }),
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
    }
  }

  /**
   * Transcribe audio to text using model-based provider routing.
   * Accepts one or more chunks - fans out up to 4 in parallel, concatenates in order.
   */
  static submit(
    data: SpeechToTextPostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    toolExecutionContext: ToolExecutionContext,
  ): Promise<ResponseType<SpeechToTextPostResponseOutput>> {
    return MediaStudioRepository.run({
      save: !toolExecutionContext.threadId && data.saveToStudio,
      kind: "transcribe",
      model: data.modelId,
      title: data.fileUpload.files[0]?.name ?? "",
      settings: toStudioSettings({
        modelId: data.modelId,
        language: data.language,
      }),
      user,
      locale,
      logger,
      generate: ({ recordProviderJobId }) =>
        SpeechToTextRepository.transcribeAudio(
          data.fileUpload.files,
          user,
          locale,
          logger,
          data.modelId,
          toolExecutionContext,
          data.language,
          recordProviderJobId,
        ),
    });
  }

  static async transcribeAudio(
    files: File[],
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    sttModelSelection: SttModelSelection | SttModelId | null,
    /** Fixture chain of the calling stream — provider calls bind it. */
    toolExecutionContext: ToolExecutionContext,
    language?: string,
    onProviderJobId?: ProviderJobIdRecorder,
  ): Promise<ResponseType<SpeechToTextPostResponseOutput>> {
    const result = await SpeechToTextRepository.transcribe(
      files,
      user,
      locale,
      logger,
      sttModelSelection,
      toolExecutionContext,
      { language },
      onProviderJobId,
    );
    if (!result.success) {
      return result;
    }
    return success({
      creditCost: result.data.creditCost,
      response: {
        success: true,
        text: result.data.text,
        provider: result.data.provider,
        confidence: result.data.confidence,
      },
    });
  }

  /**
   * transcribeAudio with the full result (duration, timed segments) and
   * per-call options. Same routing, credit check and billing.
   */
  static async transcribe(
    files: File[],
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    sttModelSelection: SttModelSelection | SttModelId | null,
    /** Fixture chain of the calling stream — provider calls bind it. */
    toolExecutionContext: ToolExecutionContext,
    options: SttCallOptions = {},
    onProviderJobId?: ProviderJobIdRecorder,
  ): Promise<ResponseType<SttTranscription>> {
    const t = sttScopedTranslation.scopedT(locale).t;
    // "auto" lets the model detect the spoken language (Studio default):
    // forcing the UI language garbles audio in any other language.
    const language =
      options.language === STT_AUTO_LANGUAGE
        ? undefined
        : (options.language ?? getLanguageFromLocale(locale));

    // Accept raw SttModelId string or full selection object; fall back to default
    const selection: SttModelSelection =
      typeof sttModelSelection === "string"
        ? {
            selectionType: ModelSelectionType.MANUAL,
            manualModelId: sttModelSelection,
          }
        : (sttModelSelection ?? DEFAULT_STT_MODEL_SELECTION);
    const _sttAvailability = await getEnvAvailability();
    const modelOption = getBestSttModel(selection, user, _sttAvailability);

    if (!modelOption) {
      logger.error("[STT] No STT provider available", {
        selection,
      });
      return fail({
        message: t("post.errors.noSttProviderConfigured"),
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

    // An empty / near-empty recording (tap instead of hold, mic permission
    // race) has nothing to transcribe: tell the user, don't bill a provider
    // call that can only fail.
    const largestFileBytes = files.reduce((max, f) => Math.max(max, f.size), 0);
    if (largestFileBytes < SpeechToTextRepository.MIN_AUDIO_BYTES) {
      logger.warn("[STT] Recording empty or too short - not sent to provider", {
        chunkCount: files.length,
        largestFileBytes,
        mimeTypes: files.map((f) => f.type).join(","),
        sttModelId: modelOption.id,
      });
      return fail({
        message: t("post.errors.audioTooShort"),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

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

    // Duration is only known after transcription: require at least the
    // selected model's price for a short clip at its own per-second rate.
    const minimumCredits = calculateSttCreditCost(
      modelOption,
      SpeechToTextRepository.MINIMUM_BALANCE_SECONDS,
    );
    const eligible = await protectedBalance(
      user.id,
      user.leadId,
      modelOption.id,
      balanceResult.data.total,
      minimumCredits,
      tCredits,
      locale,
    );
    if (!eligible.success) {
      return eligible;
    }
    if (balanceResult.data.total < minimumCredits) {
      logger.warn("[STT] Insufficient credits", {
        balance: balanceResult.data.total,
        minimum: minimumCredits,
        sttModelId: modelOption.id,
        apiProvider: modelOption.apiProvider,
      });
      return fail({
        message: t("post.errors.insufficientCredits", {
          balance: formatCreditAmount(balanceResult.data.total, locale),
          minimum: formatCreditAmount(minimumCredits, locale),
        }),
        errorType: ErrorResponseTypes.PAYMENT_REQUIRED,
      });
    }

    // One fixture-aware fetch per transcription - carries the repeat counter
    // for poll loops, so it must not be recreated per call.
    const fetchImpl = createFixtureFetch(toolExecutionContext, logger);

    try {
      // Fan out chunks up to CHUNK_CONCURRENCY in parallel, preserve order
      const results: Array<ResponseType<SttChunkResult>> = Array.from({
        length: files.length,
      });

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
            fetchImpl,
            options.task,
            onProviderJobId,
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
      };

      const { text, confidence, duration } = transcriptionResult;

      // Bill per chunk: the provider's reported cost when it gave one, else
      // the model's own per-second rate x duration. One markup + rounding.
      const charge = calculateSttCharge(
        modelOption,
        results.flatMap((r) =>
          r.success
            ? [
                {
                  duration: r.data.duration,
                  providerCostUsd: r.data.providerCostUsd,
                },
              ]
            : [],
        ),
      );
      const creditsNeeded = charge.credits;
      if (charge.minimumChunks > 0) {
        logger.error(
          "[STT] Provider did not return cost or duration - charging 1-second minimum",
          {
            sttModelId: modelOption.id,
            apiProvider: modelOption.apiProvider,
            chunks: charge.minimumChunks,
          },
        );
      }

      logger.debug("[STT] Transcription successful", {
        textLength: text.length,
        sttModelId: modelOption.id,
        apiProvider: modelOption.apiProvider,
        duration,
        creditsNeeded,
        providerCostChunks: charge.providerCostChunks,
        creditCostPerSecond: modelOption.creditCostPerSecond,
      });

      const providerJobs = mergeProviderJobIds(
        results.map((r) => (r.success ? r.data.providerJobId : undefined)),
      );
      if (providerJobs.providerJobId) {
        onProviderJobId?.(providerJobs.providerJobId);
      }

      // Deduct credits AFTER successful completion
      const deductResult = await CreditRepository.deductCreditsForSTT(
        user,
        creditsNeeded,
        logger,
        tCredits,
        locale,
        {
          modelId: modelOption.id,
          apiProvider: modelOption.apiProvider,
          ...providerJobs,
        },
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

      // Segments of later chunks start where the earlier chunks ended.
      let offset = 0;
      let segments: SttSegment[] | undefined = [];
      for (const r of results) {
        if (!r.success) {
          continue;
        }
        if (!r.data.segments) {
          segments = undefined;
          break;
        }
        for (const segment of r.data.segments) {
          segments.push({
            start: segment.start + offset,
            end: segment.end + offset,
            text: segment.text,
          });
        }
        offset += r.data.duration;
      }

      return success({
        creditCost: creditsNeeded,
        text,
        provider: modelOption.apiProvider,
        sttModelId: modelOption.id,
        confidence,
        duration,
        language: language ?? STT_AUTO_LANGUAGE,
        segments,
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
    /** ISO-639-1; undefined = the provider detects it */
    language: string | undefined,
    logger: EndpointLogger,
    t: SpeechToTextT,
    fetchImpl: typeof globalThis.fetch,
    target: "openAiStt" | "nanoGPT" | "openRouter",
    task: SttCallOptions["task"] = "transcribe",
  ): Promise<ResponseType<SttChunkResult>> {
    const { envKey, url, label } = PROVIDER_SETUP_INSTRUCTIONS[target];
    const apiKey = agentEnv[envKey];
    const baseUrl = {
      nanoGPT: "https://api.nano-gpt.com/api/v1",
      openAiStt: "https://api.openai.com/v1",
      openRouter: "https://openrouter.ai/api/v1",
    }[target];
    const endpoint = `${baseUrl}/audio/${task === "translate" ? "translations" : "transcriptions"}`;
    if (!apiKey) {
      logger.error("[STT] API key not configured", { target });
      return fail({
        message: t("post.errors.notConfigured", { label, envKey, url }),
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
    // Translations always produce English; the endpoint takes no language.
    if (task !== "translate" && language) {
      formData.append("language", language);
    }
    // Plain JSON works across gateway models whose timing support varies.
    formData.append(
      "response_format",
      target === "openAiStt" ? "verbose_json" : "json",
    );

    logger.debug("[STT] Calling transcription API", {
      target,
      model: providerModel,
      language,
      originalMime: file.type,
      normalizedMime,
      originalFileName: file.name,
      fileSize: file.size,
    });

    const response = await fetchImpl(endpoint, {
      method: "POST",
      headers: {
        // eslint-disable-next-line i18next/no-literal-string
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
      signal: AbortSignal.timeout(SpeechToTextRepository.FETCH_TIMEOUT_MS),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error("[STT] Transcription API error", {
        target,
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

    const parsed = SpeechToTextRepository.compatibleTranscriptSchema.safeParse(
      await response.json(),
    );
    if (!parsed.success) {
      return fail({
        message: t("post.errors.transcriptionFailed", {
          error: parsed.error.message,
        }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    const data = parsed.data;

    const text = data.text ?? "";
    const duration = data.duration ?? data.usage?.seconds ?? 0;
    // OpenAI doesn't return a confidence score directly, approximate from log prob
    const confidence =
      data.segments && data.segments.length > 0
        ? Math.exp(
            data.segments.reduce((sum, s) => sum + (s.avg_logprob ?? 0), 0) /
              data.segments.length,
          )
        : undefined;

    const providerCostUsd =
      data.usage?.cost !== undefined &&
      (data.usage.currency === undefined || data.usage.currency === "USD")
        ? data.usage.cost
        : undefined;

    const segments = data.segments?.every(
      (s) => typeof s.start === "number" && typeof s.end === "number",
    )
      ? data.segments.map((s) => ({
          start: s.start ?? 0,
          end: s.end ?? 0,
          text: (s.text ?? "").trim(),
        }))
      : undefined;

    const providerJobId =
      extractHeaderRequestId(response.headers, [
        "x-generation-id",
        "x-request-id",
        "request-id",
      ]) ?? normalizeProviderJobId(data.id);

    return success({
      text,
      confidence,
      duration,
      providerCostUsd,
      providerJobId,
      segments,
    });
  }

  /**
   * Transcribe using Eden AI (async polling flow).
   */
  private static async transcribeWithEdenAI(
    file: File,
    providerModel: string,
    /** ISO-639-1; undefined = the provider detects it */
    language: string | undefined,
    logger: EndpointLogger,
    t: SpeechToTextT,
    fetchImpl: typeof globalThis.fetch,
    onProviderJobId?: ProviderJobIdRecorder,
  ): Promise<ResponseType<SttChunkResult>> {
    if (!(await getEnvAvailability()).voice) {
      logger.error(
        "[STT] Eden AI not configured",
        buildMissingKeyMessage("voice"),
      );
      return fail({
        message: t("post.errors.apiKeyMissing"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
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
      fetchImpl,
      onProviderJobId,
    );
  }

  /**
   * Transcribe with one Eden AI provider (API v3): upload the audio
   * (POST /v3/upload), start the job (POST /v3/universal-ai/async), and poll
   * it when it did not finish inline. Returns success or a typed failure -
   * never throws.
   */
  private static async tryEdenAIProvider(
    blob: Blob,
    fileName: string,
    mimeType: string,
    edenProvider: string,
    /** ISO-639-1; undefined = the provider detects it */
    language: string | undefined,
    logger: EndpointLogger,
    t: SpeechToTextT,
    fetchImpl: typeof globalThis.fetch,
    onProviderJobId?: ProviderJobIdRecorder,
  ): Promise<ResponseType<SttChunkResult>> {
    const model = edenAiSttModel(edenProvider);
    const formData = new FormData();
    formData.append("file", blob, fileName);
    // Only kept until the job ran; 1 day is the shortest Eden allows.
    formData.append("expires_in_days", "1");
    // eslint-disable-next-line i18next/no-literal-string
    formData.append("purpose", "speech-to-text");

    logger.debug("[STT] Uploading to Eden AI", {
      model,
      fileName,
      mimeType,
      fileSize: blob.size,
      language,
    });

    const uploadResponse = await fetchImpl(EDEN_AI_URLS.upload, {
      method: "POST",
      headers: {
        // eslint-disable-next-line i18next/no-literal-string
        Authorization: `Bearer ${agentEnv.EDEN_AI_API_KEY}`,
      },
      body: formData,
      signal: AbortSignal.timeout(SpeechToTextRepository.FETCH_TIMEOUT_MS),
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      logger.error("[STT] Eden AI upload error", {
        status: uploadResponse.status,
        error: errorText,
        model,
        mimeType,
        fileSize: blob.size,
      });
      if (SpeechToTextRepository.TOO_SHORT_PATTERN.test(errorText)) {
        return fail({
          message: t("post.errors.audioTooShort"),
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }
      return fail({
        message: t("post.errors.transcriptionFailed", { error: errorText }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const upload = edenAiUploadResponseSchema.safeParse(
      await uploadResponse.json(),
    );
    if (!upload.success) {
      logger.error("[STT] Unexpected Eden AI upload response", {
        model,
        error: upload.error.message,
      });
      return fail({
        message: t("post.errors.transcriptionFailed", {
          error: upload.error.message,
        }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    const fileId = upload.data.file_id;
    /** Eden measures the audio on upload; the STT output has no duration. */
    const uploadDuration = upload.data.metadata?.duration ?? undefined;

    const response = await fetchImpl(EDEN_AI_URLS.universalAiAsync, {
      method: "POST",
      headers: {
        // eslint-disable-next-line i18next/no-literal-string
        Authorization: `Bearer ${agentEnv.EDEN_AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model, input: { file: fileId, language } }),
      signal: AbortSignal.timeout(SpeechToTextRepository.FETCH_TIMEOUT_MS),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error("[STT] Eden AI API error", {
        status: response.status,
        error: errorText,
        model,
        fileId,
        mimeType,
        language,
      });
      return fail({
        message: t("post.errors.transcriptionFailed", { error: errorText }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const created = edenAiSttJobSchema.safeParse(await response.json());
    if (!created.success || !created.data.public_id) {
      logger.error("[STT] No public ID from Eden AI", {
        model,
        fileId,
        error: created.success ? undefined : created.error.message,
      });
      return fail({
        message: t("post.errors.noPublicId"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    const publicId = created.data.public_id;
    onProviderJobId?.(publicId);

    // Short audio usually finishes inline: the create response already holds
    // the result. Poll only while the job is still processing.
    const result =
      created.data.status === "processing"
        ? await SpeechToTextRepository.pollForResults(
            publicId,
            model,
            uploadDuration,
            logger,
            t,
            fetchImpl,
            response,
          )
        : SpeechToTextRepository.edenAiJobResult(
            created.data,
            publicId,
            model,
            uploadDuration,
            logger,
            t,
          );
    if (!result.success) {
      // Job errors don't know the input - attach it so format problems
      // (e.g. Safari mp4) are diagnosable from the error log alone.
      logger.error("[STT] Eden AI transcription failed for input", {
        model,
        publicId,
        fileId,
        fileName,
        mimeType,
        fileSize: blob.size,
        language,
        message: result.message,
      });
    }
    return result;
  }

  /**
   * Turn a settled (non-processing) Eden AI v3 STT job into our result.
   */
  private static edenAiJobResult(
    job: EdenAiSttJob,
    publicId: string,
    model: string,
    uploadDuration: number | undefined,
    logger: EndpointLogger,
    t: SpeechToTextT,
  ): ResponseType<SttChunkResult> {
    if (job.status !== "success") {
      const jobError = edenAiErrorMessage(job.error);
      logger.error("[STT] Provider returned error", {
        model,
        publicId,
        status: job.status,
        error: jobError,
      });
      if (SpeechToTextRepository.TOO_SHORT_PATTERN.test(jobError ?? "")) {
        return fail({
          message: t("post.errors.audioTooShort"),
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }
      return fail({
        message: t("post.errors.providerError"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const transcription = job.output?.text ?? "";
    const entries = job.output?.diarization?.entries ?? [];
    const confidences = entries.flatMap((e) =>
      typeof e.confidence === "number" ? [e.confidence] : [],
    );
    const confidence =
      confidences.length > 0
        ? confidences.reduce((sum, c) => sum + c, 0) / confidences.length
        : undefined;
    // Duration: measured on upload; else the last diarized segment's end.
    const lastEnd = entries.reduce((max, e) => {
      const end =
        typeof e.end_time === "number"
          ? e.end_time
          : Number.parseFloat(e.end_time ?? "");
      return Number.isFinite(end) && end > max ? end : max;
    }, 0);
    const duration = uploadDuration ?? lastEnd;
    const providerCostUsd = parseEdenAiCost(job.cost);

    logger.debug("[STT] Transcription completed", {
      textLength: transcription.length,
      confidence,
      duration,
      providerCostUsd,
    });

    if (!transcription) {
      logger.warn("[STT] Empty transcription received", { duration });
    }

    return success({
      text: transcription,
      confidence,
      duration,
      providerCostUsd,
      providerJobId: normalizeProviderJobId(publicId),
    });
  }

  /**
   * Transcribe using Deepgram API
   */
  private static async transcribeWithDeepgram(
    file: File,
    providerModel: string,
    /** ISO-639-1; undefined = the provider detects it */
    language: string | undefined,
    logger: EndpointLogger,
    t: SpeechToTextT,
    fetchImpl: typeof globalThis.fetch,
  ): Promise<ResponseType<SttChunkResult>> {
    if (!agentEnv.DEEPGRAM_API_KEY) {
      const { envKey, url, label } = PROVIDER_SETUP_INSTRUCTIONS.deepgram;
      logger.error("[STT] Deepgram API key not configured");
      return fail({
        message: t("post.errors.notConfigured", { label, envKey, url }),
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
    if (language) {
      url.searchParams.set("language", language);
    } else {
      url.searchParams.set("detect_language", "true");
    }

    const response = await fetchImpl(url.toString(), {
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
        request_id?: string;
        duration?: number;
      };
    };

    const alt = data.results?.channels?.[0]?.alternatives?.[0];
    const text = alt?.transcript ?? "";
    const confidence = alt?.confidence;
    const duration = data.metadata?.duration ?? 0;
    const providerJobId =
      normalizeProviderJobId(data.metadata?.request_id) ??
      extractHeaderRequestId(response.headers, [
        "dg-request-id",
        "x-request-id",
        "request-id",
      ]);

    return success({
      text,
      confidence,
      duration,
      providerCostUsd: undefined,
      providerJobId,
    });
  }

  /**
   * Poll an Eden AI v3 async job (GET /v3/universal-ai/async/{public_id})
   * until it leaves "processing".
   */
  private static async pollForResults(
    publicId: string,
    model: string,
    uploadDuration: number | undefined,
    logger: EndpointLogger,
    t: SpeechToTextT,
    fetchImpl: typeof globalThis.fetch,
    submitResponse: Response,
  ): Promise<ResponseType<SttChunkResult>> {
    let attempts = 0;
    let lastResponse: Response = submitResponse;

    while (attempts < this.MAX_POLLING_ATTEMPTS) {
      await pollDelay(this.POLLING_INTERVAL_MS, lastResponse);

      try {
        const response = await fetchImpl(
          `${EDEN_AI_URLS.universalAiAsync}/${publicId}`,
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
        lastResponse = response;

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

        const parsed = edenAiSttJobSchema.safeParse(await response.json());
        if (!parsed.success) {
          logger.error("[STT] Unexpected Eden AI poll response", {
            publicId,
            error: parsed.error.message,
          });
          return fail({
            message: t("post.errors.pollFailed"),
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          });
        }

        logger.debug("[STT] Polling response received", {
          status: parsed.data.status,
          model,
          attempts,
        });

        if (parsed.data.status !== "processing") {
          return SpeechToTextRepository.edenAiJobResult(
            parsed.data,
            publicId,
            model,
            uploadDuration,
            logger,
            t,
          );
        }

        attempts++;
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

    logger.error("[STT] Transcription timeout", { publicId, model });
    return fail({
      message: t("post.errors.timeout"),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
}
