/**
 * Speech-to-Text Repository
 * Routes transcription requests to the correct provider based on the STT model's ApiProvider.
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
import {
  agentEnvAvailability,
  buildMissingKeyMessage,
  PROVIDER_SETUP_INSTRUCTIONS,
} from "@/app/api/[locale]/agent/env-availability";
import { ApiProvider } from "@/app/api/[locale]/agent/models/models";
import { getSttModelById } from "@/app/api/[locale]/agent/speech-to-text/models";
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
import { DEFAULT_STT_MODEL_ID } from "@/app/api/[locale]/agent/speech-to-text/constants";
import type { SpeechToTextPostResponseOutput } from "./definition";
import {
  scopedTranslation as sttScopedTranslation,
  type SpeechToTextT,
} from "./i18n";
import type { SttModelId } from "./models";

/**
 * Speech-to-Text Repository
 */
export class SpeechToTextRepository {
  private static readonly MAX_POLLING_ATTEMPTS = 30;
  private static readonly POLLING_INTERVAL_MS = 1000;

  /**
   * Transcribe audio to text using model-based provider routing
   */
  static async transcribeAudio(
    file: File,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    sttModelId?: SttModelId,
  ): Promise<ResponseType<SpeechToTextPostResponseOutput>> {
    const t = sttScopedTranslation.scopedT(locale).t;
    const resolvedModelId = sttModelId ?? DEFAULT_STT_MODEL_ID;
    const modelOption = getSttModelById(resolvedModelId);
    const language = getLanguageFromLocale(locale);

    logger.debug("[STT] Starting audio transcription", {
      sttModelId: resolvedModelId,
      apiProvider: modelOption.apiProvider,
      providerModel: modelOption.providerModel,
      language,
      fileSize: file.size,
      fileName: file.name,
      mimeType: file.type,
    });

    const tCredits = creditsScopedTranslation.scopedT(locale).t;

    // Check minimum balance upfront
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
        message: t("post.errors.insufficientCredits"),
        errorType: ErrorResponseTypes.PAYMENT_REQUIRED,
        messageParams: {
          balance: balanceResult.data.total.toString(),
          minimum: STT_MINIMUM_BALANCE.toString(),
        },
      });
    }

    try {
      let transcriptionResult: ResponseType<{
        text: string;
        confidence: number | undefined;
        duration: number;
        edenAiCostUsd: number | undefined;
      }>;

      switch (modelOption.apiProvider) {
        case ApiProvider.OPENAI_STT:
          transcriptionResult =
            await SpeechToTextRepository.transcribeWithOpenAI(
              file,
              modelOption.providerModel,
              language,
              logger,
              t,
            );
          break;

        case ApiProvider.EDEN_AI_STT:
          transcriptionResult =
            await SpeechToTextRepository.transcribeWithEdenAI(
              file,
              modelOption.providerModel,
              language,
              logger,
              t,
            );
          break;

        case ApiProvider.DEEPGRAM:
          transcriptionResult =
            await SpeechToTextRepository.transcribeWithDeepgram(
              file,
              modelOption.providerModel,
              language,
              logger,
              t,
            );
          break;

        default:
          logger.error("[STT] Unsupported STT provider", {
            apiProvider: modelOption.apiProvider,
            sttModelId: resolvedModelId,
          });
          return fail({
            message: t("post.errors.transcriptionFailed"),
            errorType: ErrorResponseTypes.BAD_REQUEST,
          });
      }

      if (!transcriptionResult.success) {
        return transcriptionResult;
      }

      const { text, confidence, duration, edenAiCostUsd } =
        transcriptionResult.data;

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
          { sttModelId: resolvedModelId },
        );
        creditsNeeded = STT_COST_PER_SECOND;
      }

      logger.debug("[STT] Transcription successful", {
        textLength: text.length,
        sttModelId: resolvedModelId,
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
          message: t("post.errors.creditsFailed"),
          errorType: ErrorResponseTypes.PAYMENT_ERROR,
        });
      }

      if (deductResult.data.partialDeduction) {
        logger.info("[STT] Partial credit deduction (insufficient funds)", {
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
        sttModelId: resolvedModelId,
        apiProvider: modelOption.apiProvider,
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
        message: t("post.errors.transcriptionFailed"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        messageParams: {
          error: `${label} key (${envKey}) not configured. Get yours at ${url}`,
        },
      });
    }

    const formData = new FormData();
    formData.append("file", file, file.name);
    formData.append("model", providerModel);
    formData.append("language", language);
    formData.append("response_format", "verbose_json");

    logger.debug("[STT] Calling OpenAI Whisper API", {
      model: providerModel,
      language,
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
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      logger.error("[STT] OpenAI Whisper API error", {
        status: response.status,
        error: errorText,
      });
      return fail({
        message: t("post.errors.transcriptionFailed"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        messageParams: { error: errorText },
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
   * Transcribe using Eden AI (async polling flow)
   * providerModel = Eden AI provider name, e.g. "openai"
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
    if (!agentEnvAvailability.voice) {
      logger.error(
        "[STT] Eden AI not configured",
        buildMissingKeyMessage("voice"),
      );
      return fail({
        message: t("post.errors.transcriptionFailed"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const formData = new FormData();
    const blob = new Blob([buffer], { type: file.type });
    formData.append("file", blob, file.name);
    formData.append("providers", providerModel);
    formData.append("language", language);

    logger.debug("[STT] Sending request to Eden AI", {
      provider: providerModel,
      language,
      fileSize: file.size,
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
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      logger.error("[STT] Eden AI API error", {
        status: response.status,
        error: errorText,
        provider: providerModel,
        language,
      });
      return fail({
        message: t("post.errors.transcriptionFailed"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        messageParams: { error: errorText },
      });
    }

    const responseData = (await response.json()) as { public_id?: string };
    const publicId = responseData.public_id;

    if (!publicId) {
      logger.error("[STT] No public ID from Eden AI", {
        responseData: JSON.stringify(responseData),
      });
      return fail({
        message: t("post.errors.noPublicId"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    return SpeechToTextRepository.pollForResults(
      publicId,
      providerModel,
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
        message: t("post.errors.transcriptionFailed"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        messageParams: {
          error:
            "DEEPGRAM_API_KEY not configured. Get yours at https://console.deepgram.com",
        },
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
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error("[STT] Deepgram API error", {
        status: response.status,
        error: errorText,
      });
      return fail({
        message: t("post.errors.transcriptionFailed"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        messageParams: { error: errorText },
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
              message: t("post.errors.transcriptionFailed"),
              errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
              messageParams: {
                error: `Provider ${provider} not found in results`,
              },
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
          message: t("post.errors.transcriptionFailed"),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          messageParams: { error: errorMessage },
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
