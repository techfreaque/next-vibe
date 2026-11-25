/**
 * GET /v1/{videos|music}/{id} and GET /v1/{videos|music}/{id}/content: job
 * status and the finished file, for the key's own account only. Polling does
 * not spend the per-minute rate budget (it is a cheap read clients repeat).
 */

import "server-only";

import { serveStoredFile } from "next-vibe/agent/chat/storage/file-response";
import { parseStorageFileRef } from "next-vibe/agent/chat/storage/storage-url";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  createStreamingResponse,
  type StreamingResponse,
} from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { V1MediaJobKind } from "../db";
import type { V1T } from "../i18n";
import { v1Error } from "./errors";
import { gateApiKeyRequest } from "./gate";
import { getStoredMediaSource } from "./media";
import { findMediaJob, mediaJobObject } from "./media-jobs";
import { openAiErrorResponse, openAiJson } from "./openai";

export interface V1MediaJobParams {
  kind: V1MediaJobKind;
  id: string;
  user: JwtPayloadType;
  locale: CountryLanguage;
  logger: EndpointLogger;
  request: Request | undefined;
  t: V1T;
}

export class V1MediaJobsRepository {
  static async get(params: V1MediaJobParams): Promise<StreamingResponse> {
    const { kind, id, user, locale, logger, request, t } = params;
    const gate = await gateApiKeyRequest(user, request, locale, t, logger, {
      consumeRateLimit: false,
    });
    if (!gate.ok) {
      return openAiErrorResponse(gate.error);
    }
    const job = await findMediaJob(id, kind, gate.user.id, t);
    if (!job) {
      return openAiErrorResponse(
        v1Error(
          404,
          t("media.errors.jobNotFound", { kind, id }),
          "not_found_error",
          "not_found",
          "id",
        ),
      );
    }
    return openAiJson(mediaJobObject(job, request));
  }

  static async content(params: V1MediaJobParams): Promise<StreamingResponse> {
    const { kind, id, user, locale, logger, request, t } = params;
    const gate = await gateApiKeyRequest(user, request, locale, t, logger, {
      consumeRateLimit: false,
    });
    if (!gate.ok) {
      return openAiErrorResponse(gate.error);
    }
    const job = await findMediaJob(id, kind, gate.user.id, t);
    if (!job) {
      return openAiErrorResponse(
        v1Error(
          404,
          t("media.errors.jobNotFound", { kind, id }),
          "not_found_error",
          "not_found",
          "id",
        ),
      );
    }
    if (job.status !== "completed" || !job.resultUrl) {
      return openAiErrorResponse(
        v1Error(
          409,
          t("media.errors.jobNotReady", { kind, id, status: job.status }),
          "invalid_request_error",
          `${kind}_not_ready`,
          "id",
        ),
      );
    }
    const ref = parseStorageFileRef(job.resultUrl);
    const source =
      ref && (await getStoredMediaSource(ref.threadId, ref.filename));
    const mimeSubtype = source?.contentType.split("/")[1];
    const response =
      source &&
      (await serveStoredFile(source, request, {
        "Content-Disposition": `attachment; filename="${job.id}.${mimeSubtype === "mpeg" ? "mp3" : (mimeSubtype ?? "bin")}"`,
      }));
    if (!response && /^https?:\/\//.test(job.resultUrl)) {
      // Generated on a remote instance: its own URL serves the file.
      return createStreamingResponse(
        new Response(null, {
          status: 302,
          headers: { Location: job.resultUrl },
        }),
      );
    }
    if (!response) {
      logger.error("[v1/media-jobs] Finished file missing from storage", {
        jobId: job.id,
        resultUrl: job.resultUrl,
      });
      return openAiErrorResponse(
        v1Error(
          404,
          t("media.errors.mediaNotFound"),
          "not_found_error",
          "file_not_found",
        ),
      );
    }
    return createStreamingResponse(response);
  }
}
