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

interface FalAiAudioResponse {
  audio?: { url: string; duration?: number };
  error?: { message: string };
}
interface FalAiQueueResponse {
  request_id: string;
  status?: string;
}
interface FalAiStatusResponse {
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
}

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 30;

export async function generateMusicWithFalAi(params: {
  providerModel: string;
  prompt: string;
  durationSeconds: number;
  logger: EndpointLogger;
  locale: CountryLanguage;
  signal?: AbortSignal;
}): Promise<ResponseType<{ audioUrl: string }>> {
  const { providerModel, prompt, durationSeconds, logger, locale, signal } =
    params;
  const { t } = scopedTranslation.scopedT(locale);

  if (!agentEnv.FAL_AI_API_KEY) {
    return fail({
      message: t("errors.apiKeyNotConfigured"),
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }

  logger.info("[Fal.ai Music] Submitting generation request", {
    model: providerModel,
    durationSeconds,
    promptLength: prompt.length,
  });

  try {
    const submitResponse = await fetch(
      `https://queue.fal.run/${providerModel}`,
      {
        method: "POST",
        headers: {
          // eslint-disable-next-line i18next/no-literal-string
          Authorization: `Key ${agentEnv.FAL_AI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, duration: durationSeconds }),
      },
    );

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text();
      logger.error("[Fal.ai Music] Failed to submit request", {
        status: submitResponse.status,
        error: errorText,
      });
      return fail({
        message: t("errors.externalServiceError", { message: errorText }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const queueResult = (await submitResponse.json()) as FalAiQueueResponse;
    const requestId = queueResult.request_id;
    logger.info("[Fal.ai Music] Request queued, polling", { requestId });

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

      const statusResponse = await fetch(
        `https://queue.fal.run/${providerModel}/requests/${requestId}/status`,
        {
          // eslint-disable-next-line i18next/no-literal-string
          headers: { Authorization: `Key ${agentEnv.FAL_AI_API_KEY}` },
        },
      );
      if (!statusResponse.ok) {
        continue;
      }

      const statusData = (await statusResponse.json()) as FalAiStatusResponse;

      if (statusData.status === "COMPLETED") {
        const resultResponse = await fetch(
          `https://queue.fal.run/${providerModel}/requests/${requestId}`,
          {
            // eslint-disable-next-line i18next/no-literal-string
            headers: { Authorization: `Key ${agentEnv.FAL_AI_API_KEY}` },
          },
        );
        if (!resultResponse.ok) {
          return fail({
            message: t("errors.requestFailed", {
              message: String(resultResponse.status),
            }),
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          });
        }
        const result = (await resultResponse.json()) as FalAiAudioResponse;
        const audioUrl = result.audio?.url;
        if (!audioUrl) {
          return fail({
            message: t("errors.noAudioUrl"),
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          });
        }
        logger.info("[Fal.ai Music] Music generated successfully");
        return success({ audioUrl });
      }

      if (statusData.status === "FAILED") {
        return fail({
          message: t("errors.generationFailed"),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }
      logger.debug("[Fal.ai Music] Still processing", {
        requestId,
        attempt: attempt + 1,
        status: statusData.status,
      });
    }

    return fail({
      message: t("errors.requestTimedOut"),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  } catch (error) {
    const errorMessage = parseError(error).message;
    logger.error("[Fal.ai Music] Request failed", { error: errorMessage });
    return fail({
      message: t("errors.requestFailed", { message: errorMessage }),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
}

export function createFalAiAudio(
  logger: EndpointLogger,
  modelConfig: ModelOptionAudioBased,
  locale: CountryLanguage,
): { chat: (modelId: string) => LanguageModelV2 } {
  return createMediaProvider(logger, {
    provider: ApiProvider.FAL_AI,
    logPrefix: "Fal.ai Audio Provider",
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
      return generateMusicWithFalAi({
        providerModel: modelId,
        prompt,
        durationSeconds,
        logger,
        locale,
        signal: options.abortSignal,
      });
    },
  });
}
