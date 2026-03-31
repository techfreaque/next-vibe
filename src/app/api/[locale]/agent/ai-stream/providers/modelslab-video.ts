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
  type ModelOptionVideoBased,
} from "@/app/api/[locale]/agent/models/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "./i18n";
import { createMediaProvider } from "./shared/media-provider-factory";

interface ModelsLabVideoResponse {
  status: "success" | "processing" | "error";
  id?: number;
  output?: string[];
  proxy_links?: string[];
  fetch_result?: string;
  eta?: number;
  generationTime?: number;
  message?: string;
}

const POLL_INTERVAL_MS = 5000;
const MAX_POLL_ATTEMPTS = 40;

export async function generateVideoWithModelsLab(params: {
  providerModel: string;
  prompt: string;
  durationSeconds: number;
  logger: EndpointLogger;
  locale: CountryLanguage;
  signal?: AbortSignal;
  isUltra?: boolean;
}): Promise<ResponseType<{ videoUrl: string }>> {
  const {
    providerModel,
    prompt,
    durationSeconds,
    logger,
    locale,
    signal,
    isUltra,
  } = params;
  const { t } = scopedTranslation.scopedT(locale);

  if (!agentEnv.MODELSLAB_API_KEY) {
    return fail({
      message: t("errors.apiKeyNotConfigured"),
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }

  // Determine which endpoint to use
  const isUltraModel =
    isUltra ?? (providerModel === "wan2.1" || providerModel === "wan2.2");
  const endpoint = isUltraModel
    ? "https://modelslab.com/api/v6/video/text2video_ultra"
    : "https://modelslab.com/api/v6/video/text2video";

  logger.info("[ModelsLab Video] Submitting generation request", {
    providerModel,
    endpoint,
    durationSeconds,
    promptLength: prompt.length,
  });

  try {
    const submitResponse = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: agentEnv.MODELSLAB_API_KEY,
        model_id: providerModel,
        prompt,
        // eslint-disable-next-line i18next/no-literal-string
        output_type: "mp4",
        num_frames: Math.min(Math.round(durationSeconds * 8), 25),
      }),
      signal,
    });

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text();
      logger.error("[ModelsLab Video] Failed to submit request", {
        status: submitResponse.status,
        error: errorText,
      });
      return fail({
        message: t("errors.externalServiceError", { message: errorText }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const result = (await submitResponse.json()) as ModelsLabVideoResponse;

    // Immediate success
    if (result.status === "success") {
      const videoUrl = result.output?.[0] ?? result.proxy_links?.[0];
      if (videoUrl) {
        logger.info("[ModelsLab Video] Video generated immediately");
        return success({ videoUrl });
      }
    }

    // Async processing - poll fetch_result URL
    if (result.status === "processing" && result.fetch_result) {
      const fetchUrl = result.fetch_result;
      logger.info("[ModelsLab Video] Request queued, polling", {
        fetchUrl,
        eta: result.eta,
      });

      for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
        if (signal?.aborted) {
          return fail({
            message: t("errors.requestAborted"),
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          });
        }
        await new Promise<void>((resolve) => {
          setTimeout(resolve, POLL_INTERVAL_MS);
        });

        const pollResponse = await fetch(fetchUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: agentEnv.MODELSLAB_API_KEY }),
        });

        if (!pollResponse.ok) {
          logger.debug("[ModelsLab Video] Poll request failed, retrying", {
            status: pollResponse.status,
            attempt: attempt + 1,
          });
          continue;
        }

        const pollResult =
          (await pollResponse.json()) as ModelsLabVideoResponse;

        if (pollResult.status === "success") {
          const videoUrl =
            pollResult.output?.[0] ?? pollResult.proxy_links?.[0];
          if (videoUrl) {
            logger.info("[ModelsLab Video] Video generated successfully");
            return success({ videoUrl });
          }
        }

        if (pollResult.status === "error") {
          return fail({
            message: t("errors.generationFailed"),
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          });
        }

        logger.debug("[ModelsLab Video] Still processing", {
          attempt: attempt + 1,
          eta: pollResult.eta,
        });
      }

      return fail({
        message: t("errors.requestTimedOut"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    // Error response
    return fail({
      message: t("errors.externalServiceError", {
        message: result.message ?? "Unknown error",
      }),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  } catch (error) {
    const errorMessage = parseError(error).message;
    logger.error("[ModelsLab Video] Request failed", { error: errorMessage });
    return fail({
      message: t("errors.requestFailed", { message: errorMessage }),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
}

export function createModelsLabVideo(
  logger: EndpointLogger,
  modelConfig: ModelOptionVideoBased,
  locale: CountryLanguage,
): { chat: (modelId: string) => LanguageModelV2 } {
  return createMediaProvider(logger, {
    provider: ApiProvider.MODELSLAB,
    logPrefix: "ModelsLab Video Provider",
    defaultMediaType: "video/mp4",
    urlKey: "videoUrl",
    generate: (options, prompt, modelId) => {
      return generateVideoWithModelsLab({
        providerModel: modelId,
        prompt,
        durationSeconds: modelConfig.defaultDurationSeconds,
        logger,
        locale,
        signal: options.abortSignal,
      });
    },
  });
}
