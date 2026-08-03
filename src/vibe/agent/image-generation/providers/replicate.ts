import "server-only";

import { agentEnv } from "../../env";
import { scopedTranslation } from "../i18n";
import { pollDelay } from "../../shared/poll-delay";
import { coreEnv } from "next-vibe/core/env";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { Environment } from "next-vibe/env/env-util";
import type { EndpointLogger } from "next-vibe/logger/types";

interface ReplicatePrediction {
  id: string;
  status: "starting" | "processing" | "succeeded" | "failed" | "canceled";
  output?: string | string[];
  error?: string;
}

const POLL_INTERVAL_MS = coreEnv.NODE_ENV === Environment.TEST ? 50 : 2000;
const MAX_POLL_ATTEMPTS = 30;

async function pollPrediction(
  predictionId: string,
  logger: EndpointLogger,
  locale: CountryLanguage,
  fetchImpl: typeof globalThis.fetch,
  submitResponse: Response,
  signal?: AbortSignal,
): Promise<ResponseType<{ imageUrl: string }>> {
  const { t } = scopedTranslation.scopedT(locale);

  let lastResponse: Response = submitResponse;
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
    if (signal?.aborted) {
      return fail({
        message: t("post.errors.requestAborted"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    await pollDelay(POLL_INTERVAL_MS, lastResponse);

    const response = await fetchImpl(
      `https://api.replicate.com/v1/predictions/${predictionId}`,
      {
        // eslint-disable-next-line i18next/no-literal-string
        headers: { Authorization: `Token ${agentEnv.REPLICATE_API_TOKEN}` },
      },
    );
    lastResponse = response;
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
      const imageUrl = Array.isArray(output) ? output[0] : output;
      if (!imageUrl) {
        return fail({
          message: t("post.errors.noImageUrl"),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }
      return success({ imageUrl });
    }
    if (prediction.status === "failed" || prediction.status === "canceled") {
      return fail({
        message: prediction.error
          ? t("post.errors.externalServiceError", { message: prediction.error })
          : t("post.errors.generationFailed"),
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
    message: t("post.errors.requestTimedOut"),
    errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
  });
}

export async function generateWithReplicate(params: {
  providerModel: string;
  prompt: string;
  size: string;
  logger: EndpointLogger;
  locale: CountryLanguage;
  signal?: AbortSignal;
  inputMediaUrl?: string;
  /** Fixture-aware fetch bound once per generation (see createFixtureFetch). */
  fetchImpl: typeof globalThis.fetch;
}): Promise<ResponseType<{ imageUrl: string }>> {
  const {
    providerModel,
    prompt,
    size,
    logger,
    locale,
    signal,
    inputMediaUrl,
    fetchImpl,
  } = params;
  const { t } = scopedTranslation.scopedT(locale);

  if (!agentEnv.REPLICATE_API_TOKEN) {
    return fail({
      message: t("post.errors.apiKeyNotConfigured"),
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

  logger.debug("[Replicate] Creating prediction", {
    model: providerModel,
    width,
    height,
    promptLength: prompt.length,
  });

  try {
    const response = await fetchImpl(
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
            width,
            height,
            num_outputs: 1,
            ...(inputMediaUrl ? { image: inputMediaUrl } : {}),
          },
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
        message: t("post.errors.externalServiceError", { message: errorText }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const prediction = (await response.json()) as ReplicatePrediction;
    logger.debug("[Replicate] Prediction created, polling", {
      predictionId: prediction.id,
    });
    return pollPrediction(
      prediction.id,
      logger,
      locale,
      fetchImpl,
      response,
      signal,
    );
  } catch (error) {
    const errorMessage = parseError(error).message;
    logger.error("[Replicate] Request failed", { error: errorMessage });
    return fail({
      message: t("post.errors.requestFailed", { message: errorMessage }),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
}
