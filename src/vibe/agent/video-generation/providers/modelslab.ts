import "server-only";

import { agentEnv } from "../../env";
import { pollDelay } from "../../shared/poll-delay";
import { scopedTranslation } from "../i18n";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";

interface ModelsLabVideoResponse {
  status: "success" | "processing" | "error";
  id?: number;
  output?: string[];
  proxy_links?: string[];
  fetch_result?: string;
  future_links?: string[];
  eta?: number;
  generationTime?: number;
  message?: string;
}

// Real interval ALWAYS — never a test-only shortcut. pollDelay() collapses to
// 10ms on REPLAY (via the fixture-replay header), so replays stay fast; a
// RECORDING run must actually wait the real cadence or it times out before the
// job finishes and records a bogus future_links fallback.
// Video routinely takes several minutes (VEO ~1-5 min). 3s × 90 = 4.5 min.
const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 90;

export async function generateVideoWithModelsLab(params: {
  providerModel: string;
  prompt: string;
  durationSeconds: number;
  logger: EndpointLogger;
  locale: CountryLanguage;
  signal?: AbortSignal;
  isUltra?: boolean;
  aspectRatio?: string;
  resolution?: string;
  inputImageUrl?: string;
  /** Fixture-aware fetch bound once per generation (see createFixtureFetch). */
  fetchImpl: typeof globalThis.fetch;
}): Promise<ResponseType<{ videoUrl: string }>> {
  const {
    providerModel,
    prompt,
    durationSeconds,
    logger,
    locale,
    signal,
    isUltra,
    aspectRatio,
    resolution,
    inputImageUrl,
    fetchImpl,
  } = params;
  const { t } = scopedTranslation.scopedT(locale);

  if (!agentEnv.MODELSLAB_API_KEY) {
    return fail({
      message: t("post.errors.notConfigured", {
        label: "ModelsLab",
        envKey: "MODELSLAB_API_KEY",
        url: "https://modelslab.com",
      }),
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }

  // Determine which endpoint to use
  const isUltraModel =
    isUltra ?? (providerModel === "wan2.1" || providerModel === "wan2.2");
  const endpoint = inputImageUrl
    ? "https://modelslab.com/api/v6/video/img2video"
    : isUltraModel
      ? "https://modelslab.com/api/v6/video/text2video_ultra"
      : "https://modelslab.com/api/v6/video/text2video";

  logger.debug("[ModelsLab Video] Submitting generation request", {
    providerModel,
    endpoint,
    durationSeconds,
    promptLength: prompt.length,
  });

  try {
    // ModelsLab fetches init_image itself and rejects URLs that redirect
    // ("The init_image is invalid. Make sure init_image is accessible without
    // redirecting"). CDN-backed sources (Unsplash etc.) routinely 30x to their
    // final asset — resolve redirects here and hand the provider the final
    // direct URL. Resolution failure is non-fatal: submit the original URL
    // and let the provider report its own error. (Our own storage URLs are
    // already inlined to data URIs by the repository before this call.)
    let resolvedInitImage = inputImageUrl;
    if (inputImageUrl && inputImageUrl.startsWith("http")) {
      try {
        const probe = await fetchImpl(inputImageUrl, {
          method: "HEAD",
          redirect: "follow",
          signal,
        });
        if (probe.url && probe.url !== inputImageUrl) {
          logger.debug("[ModelsLab Video] Resolved init_image redirect", {
            from: inputImageUrl,
            to: probe.url,
          });
          resolvedInitImage = probe.url;
        }
      } catch {
        // Keep the original URL.
      }
    }
    const submitResponse = await fetchImpl(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: agentEnv.MODELSLAB_API_KEY,
        model_id: providerModel,
        prompt,
        // eslint-disable-next-line i18next/no-literal-string
        output_type: "mp4",
        num_frames: Math.min(Math.round(durationSeconds * 8), 25),
        ...(resolvedInitImage ? { init_image: resolvedInitImage } : {}),
        ...(aspectRatio ? { aspect_ratio: aspectRatio } : {}),
        ...(resolution ? { resolution } : {}),
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
        message: t("post.errors.providerError", { error: errorText }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const result = (await submitResponse.json()) as ModelsLabVideoResponse;

    // Immediate success
    if (result.status === "success") {
      const videoUrl = result.output?.[0] ?? result.proxy_links?.[0];
      if (videoUrl) {
        logger.debug("[ModelsLab Video] Video generated immediately");
        return success({ videoUrl });
      }
    }

    // Async processing - poll fetch_result URL
    if (result.status === "processing" && result.fetch_result) {
      const fetchUrl = result.fetch_result;
      const futureUrl = result.future_links?.[0];
      logger.debug("[ModelsLab Video] Request queued, polling", {
        fetchUrl,
        futureUrl,
        eta: result.eta,
      });

      // After ~ETA seconds the asset is usually ready even if the poll `status`
      // stays "processing" (a ModelsLab video quirk); from that point we HEAD the
      // future_links URL each poll. Guarded so a tiny/absent ETA still waits at
      // least a couple polls before hammering HEAD.
      const etaAttempts = Math.max(
        2,
        Math.ceil((result.eta ?? 60) / (POLL_INTERVAL_MS / 1000)),
      );

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
          body: JSON.stringify({ key: agentEnv.MODELSLAB_API_KEY }),
        });
        lastResponse = pollResponse;

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
            logger.debug("[ModelsLab Video] Video generated successfully");
            return success({ videoUrl });
          }
        }

        if (pollResult.status === "error") {
          return fail({
            message: pollResult.message
              ? t("post.errors.generationFailed", { error: pollResult.message })
              : t("post.errors.generationFailedUnknown"),
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          });
        }

        // ModelsLab's /fetch endpoint sometimes NEVER flips `status` to "success"
        // for video jobs — it stays "processing" indefinitely even after the asset
        // is fully generated and live at future_links. Relying on `status` alone
        // then burns the whole poll budget and fails a video that actually exists.
        // So once we're past the provider's ETA, HEAD the future_links URL each
        // poll: the moment the file is really there (200), return it as success.
        if (futureUrl && attempt + 1 >= etaAttempts) {
          try {
            const head = await fetchImpl(futureUrl, { method: "HEAD", signal });
            lastResponse = head;
            if (head.ok) {
              logger.debug(
                "[ModelsLab Video] future_links ready mid-poll (status stuck on processing)",
                { futureUrl, attempt: attempt + 1 },
              );
              return success({ videoUrl: futureUrl });
            }
          } catch {
            // File not ready yet — keep polling.
          }
        }

        logger.debug("[ModelsLab Video] Still processing", {
          attempt: attempt + 1,
          eta: pollResult.eta,
        });
      }

      // Poll budget exhausted. future_links is the URL the finished asset WILL
      // live at — but returning it blind is a silent failure: if the job never
      // finished, that URL 404s and we ship a dead video link. Only accept it
      // if the file is ACTUALLY there now (HEAD via the fixture-aware fetch);
      // otherwise fail loudly.
      if (futureUrl) {
        let ready = false;
        try {
          const head = await fetchImpl(futureUrl, { method: "HEAD", signal });
          ready = head.ok;
          if (!ready) {
            logger.error(
              "[ModelsLab Video] Poll timed out; future_links URL not ready",
              { futureUrl, status: head.status },
            );
          }
        } catch (headErr) {
          logger.error(
            "[ModelsLab Video] Poll timed out; future_links HEAD check failed",
            { futureUrl, error: parseError(headErr).message },
          );
        }
        if (ready) {
          logger.debug(
            "[ModelsLab Video] Poll timed out but future_links file is ready",
            { futureUrl },
          );
          return success({ videoUrl: futureUrl });
        }
      }

      return fail({
        message: t("post.errors.requestTimedOut"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    // Error response. init_image rejections are misleading as-is (the URL is
    // fine — the model/endpoint combination doesn't support image-to-video),
    // so translate them into an actionable hint the AI can act on.
    const rawError = result.message;
    if (inputImageUrl && rawError && /init_image/i.test(rawError)) {
      return fail({
        message: t("post.errors.imageInputUnsupported", {
          model: providerModel,
        }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    return fail({
      message: rawError
        ? t("post.errors.providerError", { error: rawError })
        : t("post.errors.providerErrorUnknown"),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  } catch (error) {
    const errorMessage = parseError(error).message;
    logger.error("[ModelsLab Video] Request failed", { error: errorMessage });
    return fail({
      message: t("post.errors.generationFailed", { error: errorMessage }),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
}
