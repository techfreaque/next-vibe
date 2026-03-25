import "server-only";

import type { LanguageModelV2 } from "@ai-sdk/provider";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { agentEnv } from "@/app/api/[locale]/agent/env";
import {
  ApiProvider,
  type ModelOptionAudioBased,
} from "@/app/api/[locale]/agent/models/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { TranslationKey } from "@/i18n/core/static-types";

import { MUSIC_DURATION_SECONDS } from "../../music-generation/enum";
import {
  createMediaProvider,
  readStringOption,
} from "./shared/media-provider-factory";

interface ReplicatePrediction {
  id: string;
  status: "starting" | "processing" | "succeeded" | "failed" | "canceled";
  output?: string | string[];
  error?: string;
}

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 30;

async function pollPrediction(
  predictionId: string,
  logger: EndpointLogger,
  signal?: AbortSignal,
): Promise<ResponseType<{ audioUrl: string }>> {
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
    if (signal?.aborted) {
      return fail({
        // eslint-disable-next-line i18next/no-literal-string
        message: "Request aborted" as TranslationKey,
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
        message:
          `Replicate poll failed: HTTP ${response.status}` as TranslationKey,
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const prediction = (await response.json()) as ReplicatePrediction;
    if (prediction.status === "succeeded") {
      const output = prediction.output;
      const audioUrl = Array.isArray(output) ? output[0] : output;
      if (!audioUrl) {
        return fail({
          // eslint-disable-next-line i18next/no-literal-string
          message: "No audio URL in Replicate output" as TranslationKey,
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }
      return success({ audioUrl });
    }
    if (prediction.status === "failed" || prediction.status === "canceled") {
      return fail({
        message: (prediction.error ??
          `Prediction ${prediction.status}`) as TranslationKey,
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
    // eslint-disable-next-line i18next/no-literal-string
    message:
      "Replicate prediction timed out after 90 seconds" as TranslationKey,
    errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
  });
}

export async function generateMusicWithReplicate(params: {
  providerModel: string;
  prompt: string;
  durationSeconds: number;
  logger: EndpointLogger;
  signal?: AbortSignal;
}): Promise<ResponseType<{ audioUrl: string }>> {
  const { providerModel, prompt, durationSeconds, logger, signal } = params;

  if (!agentEnv.REPLICATE_API_TOKEN) {
    return fail({
      // eslint-disable-next-line i18next/no-literal-string
      message: "Replicate API token not configured" as TranslationKey,
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }

  logger.info("[Replicate Music] Creating prediction", {
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
        message: `Replicate error: ${errorText}` as TranslationKey,
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const prediction = (await response.json()) as ReplicatePrediction;
    logger.info("[Replicate Music] Prediction created, polling", {
      predictionId: prediction.id,
    });
    return pollPrediction(prediction.id, logger, signal);
  } catch (error) {
    const errorMessage = parseError(error).message;
    logger.error("[Replicate Music] Request failed", { error: errorMessage });
    return fail({
      message: errorMessage as TranslationKey,
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
}

export function createReplicateAudio(
  logger: EndpointLogger,
  modelConfig: ModelOptionAudioBased,
): { chat: (modelId: string) => LanguageModelV2 } {
  return createMediaProvider(logger, {
    provider: ApiProvider.REPLICATE,
    logPrefix: "Replicate Audio Provider",
    defaultMediaType: "audio/mpeg",
    urlKey: "audioUrl",
    generate: (options, prompt, modelId) => {
      const musicDurationKey = readStringOption(
        options.providerOptions,
        "musicDuration",
      );
      const durationSeconds =
        (musicDurationKey
          ? MUSIC_DURATION_SECONDS[musicDurationKey]
          : undefined) ?? modelConfig.defaultDurationSeconds;
      return generateMusicWithReplicate({
        providerModel: modelId,
        prompt,
        durationSeconds,
        logger,
        signal: options.abortSignal,
      });
    },
  });
}
