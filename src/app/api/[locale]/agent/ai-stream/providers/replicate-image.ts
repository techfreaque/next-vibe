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
import { ApiProvider } from "@/app/api/[locale]/agent/models/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { TranslationKey } from "@/i18n/core/static-types";

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

const POLL_INTERVAL_MS = 2000;
const MAX_POLL_ATTEMPTS = 30;

async function pollPrediction(
  predictionId: string,
  logger: EndpointLogger,
  signal?: AbortSignal,
): Promise<ResponseType<{ imageUrl: string }>> {
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
      const imageUrl = Array.isArray(output) ? output[0] : output;
      if (!imageUrl) {
        return fail({
          // eslint-disable-next-line i18next/no-literal-string
          message: "No image URL in Replicate output" as TranslationKey,
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }
      return success({ imageUrl });
    }
    if (prediction.status === "failed" || prediction.status === "canceled") {
      return fail({
        message: (prediction.error ??
          `Prediction ${prediction.status}`) as TranslationKey,
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    logger.debug("[Replicate] Still processing", {
      predictionId,
      attempt: attempt + 1,
      status: prediction.status,
    });
  }
  return fail({
    // eslint-disable-next-line i18next/no-literal-string
    message:
      "Replicate prediction timed out after 60 seconds" as TranslationKey,
    errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
  });
}

export async function generateWithReplicate(params: {
  providerModel: string;
  prompt: string;
  size: string;
  logger: EndpointLogger;
  signal?: AbortSignal;
}): Promise<ResponseType<{ imageUrl: string }>> {
  const { providerModel, prompt, size, logger, signal } = params;

  if (!agentEnv.REPLICATE_API_TOKEN) {
    return fail({
      // eslint-disable-next-line i18next/no-literal-string
      message: "Replicate API token not configured" as TranslationKey,
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }

  let width = 1024,
    height = 1024;
  if (size === "post.size.landscape1792") {
    width = 1792;
    height = 1024;
  } else if (size === "post.size.portrait1792") {
    width = 1024;
    height = 1792;
  }

  logger.info("[Replicate] Creating prediction", {
    model: providerModel,
    width,
    height,
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
          input: { prompt, width, height, num_outputs: 1 },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      logger.error("[Replicate] Failed to create prediction", {
        status: response.status,
        error: errorText,
      });
      return fail({
        message: `Replicate error: ${errorText}` as TranslationKey,
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const prediction = (await response.json()) as ReplicatePrediction;
    logger.info("[Replicate] Prediction created, polling", {
      predictionId: prediction.id,
    });
    return pollPrediction(prediction.id, logger, signal);
  } catch (error) {
    const errorMessage = parseError(error).message;
    logger.error("[Replicate] Request failed", { error: errorMessage });
    return fail({
      message: errorMessage as TranslationKey,
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
}

export function createReplicateImage(logger: EndpointLogger): {
  chat: (modelId: string) => LanguageModelV2;
} {
  return createMediaProvider(logger, {
    provider: ApiProvider.REPLICATE,
    logPrefix: "Replicate Image Provider",
    defaultMediaType: "image/png",
    urlKey: "imageUrl",
    generate: (options, prompt, modelId) => {
      const size =
        readStringOption(options.providerOptions, "imageSize") ??
        "post.size.square1024";
      return generateWithReplicate({
        providerModel: modelId,
        prompt,
        size,
        logger,
        signal: options.abortSignal,
      });
    },
  });
}
