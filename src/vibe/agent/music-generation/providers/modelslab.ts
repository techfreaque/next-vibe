import "server-only";

import { agentEnv } from "next-vibe/agent/env";
import { scopedTranslation } from "next-vibe/agent/music-generation/i18n";
import { pollDelay } from "next-vibe/agent/shared/poll-delay";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";

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

// Real interval ALWAYS — never a test-only shortcut. pollDelay() collapses to
// 10ms on REPLAY (via the fixture-replay response header), so replays stay
// fast; a RECORDING run must actually wait the real cadence or it times out
// before the generation finishes and records a bogus future_links fallback.
// 3s × 60 = 3 min budget — music gen routinely takes a couple of minutes.
const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 60;

export async function generateMusicWithModelsLab(params: {
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
    const submitResponse = await fetchImpl(
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
          ...(inputMediaUrl ? { init_audio: inputMediaUrl } : {}),
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

      // Timed out polling. ModelsLab gives a `future_links` URL where the file
      // WILL be written once ready — but blindly returning success with it is a
      // silent failure: if generation never finished, that URL 404s and the
      // caller ships a dead audio link. Only accept it if the file is ACTUALLY
      // there now (HEAD via the same fixture-aware fetch). Otherwise fail loudly.
      if (futureUrl) {
        let ready = false;
        try {
          const head = await fetchImpl(futureUrl, { method: "HEAD", signal });
          ready = head.ok;
          if (!ready) {
            logger.error(
              "[ModelsLab Music] Poll timed out; future_links URL not ready",
              { futureUrl, status: head.status },
            );
          }
        } catch (headErr) {
          logger.error(
            "[ModelsLab Music] Poll timed out; future_links HEAD check failed",
            { futureUrl, error: parseError(headErr).message },
          );
        }
        if (ready) {
          logger.debug(
            "[ModelsLab Music] Poll timed out but future_links file is ready",
            { futureUrl },
          );
          return success({ audioUrl: futureUrl });
        }
        return fail({
          message: t("post.errors.requestTimedOut"),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
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
