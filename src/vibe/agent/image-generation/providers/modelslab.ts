import "server-only";

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
import { z } from "zod";

import { agentEnv } from "../../env";
import { pollDelay } from "../../shared/poll-delay";
import { modelsLabImageDimensions, snapAspectRatio } from "../aspect-ratio";
import { scopedTranslation } from "../i18n";

const modelsLabImageResponse = z.object({
  status: z.string(),
  id: z.union([z.number(), z.string()]).nullish(),
  output: z
    .union([
      z.array(z.string()),
      z.string().transform((url) => (url ? [url] : [])),
    ])
    .nullish(),
  proxy_links: z.union([z.array(z.string()), z.string()]).nullish(),
  generationTime: z.number().nullish(),
  message: z.string().nullish().catch(null),
  code: z.string().nullish(),
  meta: z
    .object({
      model_id: z.string().nullish(),
      width: z.union([z.number(), z.string()]).nullish(),
      height: z.union([z.number(), z.string()]).nullish(),
    })
    .nullish()
    .catch(null),
});

type ModelsLabImageResponse = z.infer<typeof modelsLabImageResponse>;

interface ModelsLabImageModel {
  text: string;
  edit?: string;
  size?: "pixels" | "ratio";
  version?: "v6";
  resolution?: "1K";
  editRatios?: readonly string[];
}

const MODELSLAB_IMAGE_API = "https://modelslab.com/api";
// The model catalog's per-model API examples specify each route and payload.
// V6 remains the documented route for the Z Image and Flux 1.1 models.
export const MODELSLAB_IMAGE_MODELS: ReadonlyMap<string, ModelsLabImageModel> =
  new Map([
    ["flux-pro-1.1", { text: "flux-pro-1.1", version: "v6", size: "pixels" }],
    [
      "flux-pro-1.1-ultra",
      { text: "flux-pro-1.1-ultra", version: "v6", size: "pixels" },
    ],
    ["z-image-base", { text: "z-image-base", version: "v6", size: "pixels" }],
    ["z-image-turbo", { text: "z-image-turbo", version: "v6", size: "pixels" }],
    ["flux-2-max", { text: "flux-2-max", edit: "flux-2-max", size: "pixels" }],
    ["flux-2-pro", { text: "flux-2-pro", edit: "flux-2-pro", size: "pixels" }],
    [
      "seedream-4.5",
      {
        text: "seedream-4.5",
        edit: "seedream-4.5-i2i",
        size: "ratio",
        editRatios: ["1:1", "4:3", "16:9", "9:16", "3:2", "2:3", "21:9"],
      },
    ],
    ["gen4_image", { text: "gen4_image", size: "ratio" }],
    ["wan-2.7-t2i", { text: "wan-2.7-t2i" }],
    [
      "gemini-3.1-t2i",
      {
        text: "gemini-3.1-t2i",
        edit: "gemini-3.1-i2i",
        size: "ratio",
        resolution: "1K",
      },
    ],
    [
      "nano-banana-pro",
      {
        text: "nano-banana-pro",
        edit: "nano-banana-pro",
        size: "ratio",
        resolution: "1K",
      },
    ],
  ]);

const POLL_INTERVAL_MS = coreEnv.NODE_ENV === Environment.TEST ? 50 : 3000;
const MAX_POLL_ATTEMPTS = 40;

export async function generateImageWithModelsLab(params: {
  providerModel: string;
  prompt: string;
  logger: EndpointLogger;
  locale: CountryLanguage;
  signal?: AbortSignal;
  aspectRatio?: string;
  inputMediaUrl?: string;
  /** Fixture-aware fetch bound once per generation (see createFixtureFetch). */
  fetchImpl: typeof globalThis.fetch;
}): Promise<ResponseType<{ imageUrl: string }>> {
  const {
    providerModel,
    prompt,
    logger,
    locale,
    signal,
    aspectRatio,
    inputMediaUrl,
    fetchImpl,
  } = params;
  const { t } = scopedTranslation.scopedT(locale);

  const key = agentEnv.MODELSLAB_API_KEY;
  if (!key) {
    return fail({
      message: t("post.errors.apiKeyNotConfigured"),
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }

  const spec = MODELSLAB_IMAGE_MODELS.get(providerModel);
  if (!spec) {
    logger.error("[ModelsLab Image] No API route configured", {
      providerModel,
    });
    return fail({
      message: t("post.errors.generationFailed"),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
  const modelId = inputMediaUrl ? spec.edit : spec.text;
  if (!modelId) {
    return fail({
      message: t("post.errors.modelNoReferenceImage", { model: providerModel }),
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }

  const apiBase = `${MODELSLAB_IMAGE_API}/${spec.version ?? "v7"}/images`;
  const endpoint = `${apiBase}/${spec.version === "v6" ? "text2img" : inputMediaUrl ? "image-to-image" : "text-to-image"}`;
  const ratio = inputMediaUrl
    ? snapAspectRatio(aspectRatio ?? "1:1", spec.editRatios)
    : (aspectRatio ?? "1:1");
  const dimensions = modelsLabImageDimensions(ratio, 512) ?? {
    width: 1024,
    height: 1024,
  };
  const startedAt = performance.now();

  logger.debug("[ModelsLab Image] Submitting generation request", {
    providerModel,
    modelId,
    endpoint,
    promptLength: prompt.length,
  });

  const completed = (
    response: ModelsLabImageResponse,
  ): ResponseType<{ imageUrl: string }> => {
    const reportedModel = response.meta?.model_id;
    if (reportedModel && reportedModel !== modelId) {
      logger.warn("[ModelsLab Image] Provider reported a different model", {
        requestedModel: modelId,
        reportedModel,
      });
      return fail({
        message: t("post.errors.generationFailed"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    const proxy = response.proxy_links;
    const proxyUrl = typeof proxy === "string" ? proxy : proxy?.[0];
    const imageUrl = proxyUrl || response.output?.[0];
    if (!imageUrl) {
      return fail({
        message: t("post.errors.noImageUrl"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    logger.debug("[ModelsLab Image] Image generated successfully", {
      requestedModel: modelId,
      reportedModel: reportedModel ?? null,
      generationTime: response.generationTime ?? null,
      width: response.meta?.width ?? null,
      height: response.meta?.height ?? null,
      latencyMs: Math.round(performance.now() - startedAt),
    });
    return success({ imageUrl });
  };

  try {
    let referenceUrl = inputMediaUrl;
    if (referenceUrl?.startsWith("data:")) {
      // V7 validates each init_image entry as a URL. Stage browser uploads
      // and private attachment bytes with ModelsLab's temporary upload API.
      const uploadResponse = await fetchImpl(
        `${MODELSLAB_IMAGE_API}/v6/base64_to_url`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, base64_string: referenceUrl }),
          signal,
        },
      );
      const uploaded = uploadResponse.ok
        ? modelsLabImageResponse.safeParse(await uploadResponse.json())
        : undefined;
      const url =
        uploaded?.success && uploaded.data.status === "success"
          ? uploaded.data.output?.[0]
          : undefined;
      if (!url || !/^https?:\/\//.test(url)) {
        logger.warn("[ModelsLab Image] Reference upload failed", {
          status: uploadResponse.status,
        });
        return fail({
          message: t("post.errors.referenceUnavailable"),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }
      referenceUrl = url;
    }

    const submitResponse = await fetchImpl(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key,
        model_id: modelId,
        prompt,
        ...(spec.version === "v6"
          ? { num_inference_steps: 30, samples: 1 }
          : {}),
        ...(spec.size === "pixels" ? dimensions : {}),
        ...(spec.size === "ratio" ? { aspect_ratio: ratio } : {}),
        ...(spec.resolution ? { resolution: spec.resolution } : {}),
        ...(referenceUrl ? { init_image: [referenceUrl] } : {}),
      }),
      signal,
    });

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

    const result = modelsLabImageResponse.parse(await submitResponse.json());

    if (result.status === "success") {
      return completed(result);
    }

    if (
      result.status === "processing" &&
      (typeof result.id === "number" || result.id)
    ) {
      const fetchUrl = `${apiBase}/fetch/${encodeURIComponent(result.id)}`;
      logger.debug("[ModelsLab Image] Request queued, polling", {
        id: result.id,
      });

      let lastResponse: Response = submitResponse;
      for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
        if (signal?.aborted) {
          return fail({
            message: t("post.errors.requestAborted"),
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          });
        }
        await pollDelay(POLL_INTERVAL_MS, lastResponse);

        const pollResponse = await fetchImpl(fetchUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key }),
          signal,
        });
        lastResponse = pollResponse;

        if (!pollResponse.ok) {
          logger.debug("[ModelsLab Image] Poll request failed, retrying", {
            status: pollResponse.status,
            attempt: attempt + 1,
          });
          continue;
        }

        const pollResult = modelsLabImageResponse.parse(
          await pollResponse.json(),
        );

        if (pollResult.status === "success") {
          return completed(pollResult);
        }

        if (pollResult.status !== "processing") {
          logger.warn("[ModelsLab Image] Generation failed while polling", {
            providerModel,
            status: pollResult.status,
            code: pollResult.code ?? null,
            message: pollResult.message ?? null,
            attempt: attempt + 1,
          });
          return fail({
            message: pollResult.message
              ? t("post.errors.externalServiceError", {
                  message: pollResult.message,
                })
              : t("post.errors.generationFailed"),
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          });
        }
      }

      return fail({
        message: t("post.errors.requestTimedOut"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    // Error response
    logger.warn("[ModelsLab Image] Provider rejected the request", {
      providerModel,
      status: result.status,
      code: result.code ?? null,
      message: result.message ?? null,
    });
    return fail({
      message: result.message
        ? t("post.errors.externalServiceError", { message: result.message })
        : t("post.errors.generationFailed"),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  } catch (error) {
    if (signal?.aborted) {
      return fail({
        message: t("post.errors.requestAborted"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    const errorMessage = parseError(error).message;
    logger.error("[ModelsLab Image] Request failed", { error: errorMessage });
    return fail({
      message: t("post.errors.requestFailed", { message: errorMessage }),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
}
