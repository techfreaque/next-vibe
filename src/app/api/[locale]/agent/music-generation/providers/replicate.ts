import "server-only";

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { agentEnv } from "@/app/api/[locale]/agent/env";
import { scopedTranslation } from "@/app/api/[locale]/agent/music-generation/i18n";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

interface ReplicatePrediction {
  id: string;
  status: "starting" | "processing" | "succeeded" | "failed" | "canceled";
  output?: string | string[];
  error?: string;
}

const POLL_INTERVAL_MS = process.env.NODE_ENV === "test" ? 50 : 3000;
const MAX_POLL_ATTEMPTS = 80;

async function pollPrediction(
  predictionId: string,
  logger: EndpointLogger,
  locale: CountryLanguage,
  signal?: AbortSignal,
): Promise<ResponseType<{ audioUrl: string }>> {
  const { t } = scopedTranslation.scopedT(locale);

  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
    if (signal?.aborted) {
      return fail({
        message: t("post.errors.requestAborted"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    await new Promise<void>((resolve) => {
      setTimeout(resolve, POLL_INTERVAL_MS);
    });

    const response = await fetch(
      `https://api.replicate.com/v1/predictions/${predictionId}`,
      {
        // eslint-disable-next-line i18next/no-literal-string
        headers: { Authorization: `Token ${agentEnv.REPLICATE_API_TOKEN}` },
      },
    );
    if (!response.ok) {
      return fail({
        message: t("post.errors.pollFailed", {
          status: String(response.status),
        }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const prediction = (await response.json()) as ReplicatePrediction;
    if (prediction.status === "succeeded") {
      const output = prediction.output;
      const audioUrl = Array.isArray(output) ? output[0] : output;
      if (!audioUrl) {
        return fail({
          message: t("post.errors.noAudioUrl"),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }
      return success({ audioUrl });
    }
    if (prediction.status === "failed" || prediction.status === "canceled") {
      return fail({
        message: prediction.error
          ? t("post.errors.externalServiceError", { message: prediction.error })
          : t("post.errors.generationFailed"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    logger.debug("[Replicate Music] Still processing", {
      predictionId,
      attempt: attempt + 1,
      status: prediction.status,
    });
  }
  return fail({
    message: t("post.errors.requestTimedOut"),
    errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
  });
}

export async function generateMusicWithReplicate(params: {
  providerModel: string;
  prompt: string;
  durationSeconds: number;
  logger: EndpointLogger;
  locale: CountryLanguage;
  signal?: AbortSignal;
  inputMediaUrl?: string;
}): Promise<ResponseType<{ audioUrl: string }>> {
  const {
    providerModel,
    prompt,
    durationSeconds,
    logger,
    locale,
    signal,
    inputMediaUrl,
  } = params;
  const { t } = scopedTranslation.scopedT(locale);

  if (!agentEnv.REPLICATE_API_TOKEN) {
    return fail({
      message: t("post.errors.apiKeyNotConfigured"),
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }

  logger.debug("[Replicate Music] Creating prediction", {
    model: providerModel,
    durationSeconds,
    promptLength: prompt.length,
  });

  try {
    const response = await fetch(
      `https://api.replicate.com/v1/models/${providerModel}/predictions`,
      {
        method: "POST",
        headers: {
          // eslint-disable-next-line i18next/no-literal-string
          Authorization: `Token ${agentEnv.REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: {
            prompt,
            duration: durationSeconds,
            model_version: "stereo-large",
            output_format: "mp3",
            normalization_strategy: "peak",
            ...(inputMediaUrl ? { input_audio: inputMediaUrl } : {}),
          },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      logger.error("[Replicate Music] Failed to create prediction", {
        status: response.status,
        error: errorText,
      });
      return fail({
        message: t("post.errors.externalServiceError", { message: errorText }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const prediction = (await response.json()) as ReplicatePrediction;
    logger.debug("[Replicate Music] Prediction created, polling", {
      predictionId: prediction.id,
    });
    return pollPrediction(prediction.id, logger, locale, signal);
  } catch (error) {
    const errorMessage = parseError(error).message;
    logger.error("[Replicate Music] Request failed", { error: errorMessage });
    return fail({
      message: t("post.errors.requestFailed", { message: errorMessage }),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
}
