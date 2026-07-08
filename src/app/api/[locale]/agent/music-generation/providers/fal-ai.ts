import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";

import { agentEnv } from "@/app/api/[locale]/agent/env";
import { scopedTranslation } from "@/app/api/[locale]/agent/music-generation/i18n";
import { pollDelay } from "@/app/api/[locale]/agent/shared/poll-delay";

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

const POLL_INTERVAL_MS = process.env.NODE_ENV === "test" ? 50 : 3000;
const MAX_POLL_ATTEMPTS = 30;

export async function generateMusicWithFalAi(params: {
  providerModel: string;
  prompt: string;
  durationSeconds: number;
  logger: EndpointLogger;
  locale: CountryLanguage;
  signal?: AbortSignal;
  inputMediaUrl?: string;
  /** Fixture-aware fetch bound once per generation (see createFixtureFetch). */
  fetchImpl: typeof globalThis.fetch;
}): Promise<ResponseType<{ audioUrl: string }>> {
  const {
    providerModel,
    prompt,
    durationSeconds,
    logger,
    locale,
    signal,
    inputMediaUrl,
    fetchImpl,
  } = params;
  const { t } = scopedTranslation.scopedT(locale);

  if (!agentEnv.FAL_AI_API_KEY) {
    return fail({
      message: t("post.errors.apiKeyNotConfigured"),
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }

  logger.debug("[Fal.ai Music] Submitting generation request", {
    model: providerModel,
    durationSeconds,
    promptLength: prompt.length,
  });

  try {
    const submitResponse = await fetchImpl(
      `https://queue.fal.run/${providerModel}`,
      {
        method: "POST",
        headers: {
          // eslint-disable-next-line i18next/no-literal-string
          Authorization: `Key ${agentEnv.FAL_AI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          duration: durationSeconds,
          ...(inputMediaUrl ? { audio_url: inputMediaUrl } : {}),
        }),
      },
    );

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text();
      logger.error("[Fal.ai Music] Failed to submit request", {
        status: submitResponse.status,
        error: errorText,
      });
      return fail({
        message: t("post.errors.externalServiceError", { message: errorText }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const queueResult = (await submitResponse.json()) as FalAiQueueResponse;
    const requestId = queueResult.request_id;
    logger.debug("[Fal.ai Music] Request queued, polling", { requestId });

    let lastResponse: Response = submitResponse;
    for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
      if (signal?.aborted) {
        return fail({
          message: t("post.errors.requestAborted"),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }
      await pollDelay(POLL_INTERVAL_MS, lastResponse);

      const statusResponse = await fetchImpl(
        `https://queue.fal.run/${providerModel}/requests/${requestId}/status`,
        {
          // eslint-disable-next-line i18next/no-literal-string
          headers: { Authorization: `Key ${agentEnv.FAL_AI_API_KEY}` },
        },
      );
      lastResponse = statusResponse;
      if (!statusResponse.ok) {
        continue;
      }

      const statusData = (await statusResponse.json()) as FalAiStatusResponse;

      if (statusData.status === "COMPLETED") {
        const resultResponse = await fetchImpl(
          `https://queue.fal.run/${providerModel}/requests/${requestId}`,
          {
            // eslint-disable-next-line i18next/no-literal-string
            headers: { Authorization: `Key ${agentEnv.FAL_AI_API_KEY}` },
          },
        );
        if (!resultResponse.ok) {
          return fail({
            message: t("post.errors.requestFailed", {
              message: String(resultResponse.status),
            }),
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          });
        }
        const result = (await resultResponse.json()) as FalAiAudioResponse;
        const audioUrl = result.audio?.url;
        if (!audioUrl) {
          return fail({
            message: t("post.errors.noAudioUrl"),
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          });
        }
        logger.debug("[Fal.ai Music] Music generated successfully");
        return success({ audioUrl });
      }

      if (statusData.status === "FAILED") {
        return fail({
          message: t("post.errors.generationFailed"),
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
      message: t("post.errors.requestTimedOut"),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  } catch (error) {
    const errorMessage = parseError(error).message;
    logger.error("[Fal.ai Music] Request failed", { error: errorMessage });
    return fail({
      message: t("post.errors.requestFailed", { message: errorMessage }),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
}
