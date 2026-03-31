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
import type { CountryLanguage } from "@/i18n/core/config";

import { MUSIC_DURATION_SECONDS } from "../../music-generation/enum";
import { scopedTranslation } from "./i18n";
import {
  createMediaProvider,
  readStringOption,
} from "./shared/media-provider-factory";

interface ModelsLabMusicResponse {
  status: "success" | "processing" | "error";
  id?: number;
  output?: string[];
  fetch_result?: string;
  eta?: number;
  generationTime?: number;
  message?: string;
}

const POLL_INTERVAL_MS = 5000;
const MAX_POLL_ATTEMPTS = 30;

export async function generateMusicWithModelsLab(params: {
  prompt: string;
  durationSeconds: number;
  logger: EndpointLogger;
  locale: CountryLanguage;
  signal?: AbortSignal;
}): Promise<ResponseType<{ audioUrl: string }>> {
  const { prompt, durationSeconds, logger, locale, signal } = params;
  const { t } = scopedTranslation.scopedT(locale);

  if (!agentEnv.MODELSLAB_API_KEY) {
    return fail({
      message: t("errors.apiKeyNotConfigured"),
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }

  // ModelsLab requires duration >= 30 seconds
  const MIN_DURATION = 30;
  const effectiveDuration = Math.max(durationSeconds, MIN_DURATION);

  logger.info("[ModelsLab Music] Submitting generation request", {
    durationSeconds: effectiveDuration,
    requestedDuration: durationSeconds,
    promptLength: prompt.length,
  });

  try {
    const submitResponse = await fetch(
      "https://modelslab.com/api/v6/voice/music_gen",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: agentEnv.MODELSLAB_API_KEY,
          prompt,
          duration: effectiveDuration,
          // eslint-disable-next-line i18next/no-literal-string
          output_format: "mp3",
        }),
        signal,
      },
    );

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text();
      logger.error("[ModelsLab Music] Failed to submit request", {
        status: submitResponse.status,
        error: errorText,
      });
      return fail({
        message: t("errors.externalServiceError", { message: errorText }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const result = (await submitResponse.json()) as ModelsLabMusicResponse;

    // Immediate success
    if (result.status === "success" && result.output?.[0]) {
      logger.info("[ModelsLab Music] Music generated immediately");
      return success({ audioUrl: result.output[0] });
    }

    // Async processing - poll fetch_result URL
    if (result.status === "processing" && result.fetch_result) {
      const fetchUrl = result.fetch_result;
      logger.info("[ModelsLab Music] Request queued, polling", {
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
          logger.debug("[ModelsLab Music] Poll request failed, retrying", {
            status: pollResponse.status,
            attempt: attempt + 1,
          });
          continue;
        }

        const pollResult =
          (await pollResponse.json()) as ModelsLabMusicResponse;

        if (pollResult.status === "success" && pollResult.output?.[0]) {
          logger.info("[ModelsLab Music] Music generated successfully");
          return success({ audioUrl: pollResult.output[0] });
        }

        if (pollResult.status === "error") {
          return fail({
            message: t("errors.generationFailed"),
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          });
        }

        logger.debug("[ModelsLab Music] Still processing", {
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
    logger.error("[ModelsLab Music] Request failed", { error: errorMessage });
    return fail({
      message: t("errors.requestFailed", { message: errorMessage }),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
}

export function createModelsLabAudio(
  logger: EndpointLogger,
  modelConfig: ModelOptionAudioBased,
  locale: CountryLanguage,
): { chat: (modelId: string) => LanguageModelV2 } {
  return createMediaProvider(logger, {
    provider: ApiProvider.MODELSLAB,
    logPrefix: "ModelsLab Audio Provider",
    defaultMediaType: "audio/mpeg",
    urlKey: "audioUrl",
    generate: (options, prompt) => {
      const musicDurationKey = readStringOption(
        options.providerOptions,
        "musicDuration",
      );
      const durationSeconds =
        (musicDurationKey
          ? MUSIC_DURATION_SECONDS[musicDurationKey]
          : undefined) ?? modelConfig.defaultDurationSeconds;
      return generateMusicWithModelsLab({
        prompt,
        durationSeconds,
        logger,
        locale,
        signal: options.abortSignal,
      });
    },
  });
}
