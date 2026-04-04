import "server-only";

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { agentEnv } from "@/app/api/[locale]/agent/env";
import { scopedTranslation } from "@/app/api/[locale]/agent/image-generation/i18n";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

interface ModelsLabImageResponse {
  status: "success" | "processing" | "error";
  id?: number;
  output?: string[];
  proxy_links?: string[];
  fetch_result?: string;
  eta?: number;
  generationTime?: number;
  message?: string;
}

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 20;

export async function generateImageWithModelsLab(params: {
  providerModel: string;
  prompt: string;
  logger: EndpointLogger;
  locale: CountryLanguage;
  signal?: AbortSignal;
  aspectRatio?: string;
}): Promise<ResponseType<{ imageUrl: string }>> {
  const { providerModel, prompt, logger, locale, signal, aspectRatio } = params;
  const { t } = scopedTranslation.scopedT(locale);

  if (!agentEnv.MODELSLAB_API_KEY) {
    return fail({
      message: t("post.errors.apiKeyNotConfigured"),
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }

  logger.info("[ModelsLab Image] Submitting generation request", {
    providerModel,
    promptLength: prompt.length,
  });

  try {
    const submitResponse = await fetch(
      "https://modelslab.com/api/v6/images/text2img",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: agentEnv.MODELSLAB_API_KEY,
          // eslint-disable-next-line i18next/no-literal-string
          model_id: providerModel,
          prompt,
          num_inference_steps: 30,
          samples: 1,
          ...(aspectRatio ? { aspect_ratio: aspectRatio } : {}),
        }),
        signal,
      },
    );

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text();
      logger.error("[ModelsLab Image] Failed to submit request", {
        status: submitResponse.status,
        error: errorText,
      });
      return fail({
        message: t("post.errors.externalServiceError", { message: errorText }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const result = (await submitResponse.json()) as ModelsLabImageResponse;

    // Immediate success
    const immediateUrl = result.proxy_links?.[0] ?? result.output?.[0];
    if (result.status === "success" && immediateUrl) {
      logger.info("[ModelsLab Image] Image generated immediately");
      return success({ imageUrl: immediateUrl });
    }

    // Async processing - poll fetch_result URL
    if (result.status === "processing" && result.fetch_result) {
      const fetchUrl = result.fetch_result;
      logger.info("[ModelsLab Image] Request queued, polling", {
        fetchUrl,
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
          logger.debug("[ModelsLab Image] Poll request failed, retrying", {
            status: pollResponse.status,
            attempt: attempt + 1,
          });
          continue;
        }

        const pollResult =
          (await pollResponse.json()) as ModelsLabImageResponse;

        const pollUrl = pollResult.proxy_links?.[0] ?? pollResult.output?.[0];
        if (pollResult.status === "success" && pollUrl) {
          logger.info("[ModelsLab Image] Image generated successfully");
          return success({ imageUrl: pollUrl });
        }

        if (pollResult.status === "error") {
          return fail({
            message: t("post.errors.generationFailed"),
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          });
        }

        logger.debug("[ModelsLab Image] Still processing", {
          attempt: attempt + 1,
          eta: pollResult.eta,
        });
      }

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
    logger.error("[ModelsLab Image] Request failed", { error: errorMessage });
    return fail({
      message: t("post.errors.requestFailed", { message: errorMessage }),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
}
