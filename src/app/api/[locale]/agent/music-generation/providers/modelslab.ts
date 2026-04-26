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

interface ModelsLabMusicResponse {
  status: "success" | "processing" | "error";
  id?: number;
  output?: string[];
  fetch_result?: string;
  future_links?: string[];
  eta?: number;
  generationTime?: number;
  message?: string;
}

const POLL_INTERVAL_MS = process.env.NODE_ENV === "test" ? 50 : 3000;
const MAX_POLL_ATTEMPTS = 80;

export async function generateMusicWithModelsLab(params: {
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

  if (!agentEnv.MODELSLAB_API_KEY) {
    return fail({
      message: t("post.errors.apiKeyNotConfigured"),
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }

  logger.debug("[ModelsLab Music] Submitting generation request", {
    providerModel,
    durationSeconds,
    promptLength: prompt.length,
  });

  try {
    const submitResponse = await fetch(
      "https://modelslab.com/api/v7/voice/music-gen",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: agentEnv.MODELSLAB_API_KEY,
          // eslint-disable-next-line i18next/no-literal-string
          model_id: providerModel,
          prompt,
          duration: durationSeconds,
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
        message: t("post.errors.externalServiceError", { message: errorText }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const result = (await submitResponse.json()) as ModelsLabMusicResponse;

    // Immediate success
    if (result.status === "success" && result.output?.[0]) {
      logger.debug("[ModelsLab Music] Music generated immediately");
      return success({ audioUrl: result.output[0] });
    }

    // Async processing - poll fetch_result URL
    if (result.status === "processing" && result.fetch_result) {
      const fetchUrl = result.fetch_result;
      const futureUrl = result.future_links?.[0];
      logger.debug("[ModelsLab Music] Request queued, polling", {
        fetchUrl,
        futureUrl,
        eta: result.eta,
      });

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

        const audioUrl = pollResult.output?.[0] ?? pollResult.future_links?.[0];
        if (pollResult.status === "success" && audioUrl) {
          logger.debug("[ModelsLab Music] Music generated successfully");
          return success({ audioUrl });
        }

        if (pollResult.status === "error") {
          return fail({
            message: t("post.errors.generationFailed"),
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          });
        }

        logger.debug("[ModelsLab Music] Still processing", {
          attempt: attempt + 1,
          eta: pollResult.eta,
        });
      }

      // Timed out polling - if we have a future_links URL from the initial response, use it.
      // ModelsLab provides this pre-known URL where the file will be written once ready.
      if (futureUrl) {
        logger.error(
          "[ModelsLab Music] Poll timed out, using future_links URL",
          { futureUrl },
        );
        return success({ audioUrl: futureUrl });
      }

      logger.error("[ModelsLab Music] Poll timed out, no future_links");
      return fail({
        message: t("post.errors.requestTimedOut"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    // Error response
    return fail({
      message: t("post.errors.externalServiceError", {
        message: result.message ?? "Unknown error",
      }),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  } catch (error) {
    const errorMessage = parseError(error).message;
    logger.error("[ModelsLab Music] Request failed", { error: errorMessage });
    return fail({
      message: t("post.errors.requestFailed", { message: errorMessage }),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
}
