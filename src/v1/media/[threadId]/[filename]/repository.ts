/**
 * GET /v1/media/{threadId}/{filename} - the bytes of a file a /v1 media call
 * stored. A valid unexpired signature (the URL the API returned) is the
 * credential on its own; without one, the caller's API key must own the file.
 */

import "server-only";

import { ChatFileRepository } from "next-vibe/agent/chat/threads/files/[threadId]/[filename]/repository";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  createStreamingResponse,
  type StreamingResponse,
} from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { V1T } from "../../../i18n";
import { v1Error } from "../../../shared/errors";
import { gateApiKeyRequest } from "../../../shared/gate";
import { readStoredMedia, verifyMediaSignature } from "../../../shared/media";
import { openAiErrorResponse } from "../../../shared/openai";

export class V1MediaFileRepository {
  static async download(params: {
    threadId: string;
    filename: string;
    expires: number | undefined;
    sig: string | undefined;
    user: JwtPayloadType;
    locale: CountryLanguage;
    logger: EndpointLogger;
    request: Request | undefined;
    t: V1T;
  }): Promise<StreamingResponse> {
    const { threadId, filename, expires, sig, user, locale, logger, request, t } =
      params;
    const notFound = (): StreamingResponse =>
      openAiErrorResponse(
        v1Error(404, t("media.errors.mediaNotFound"), "not_found_error", "file_not_found"),
      );

    let file: { buffer: Buffer; mimeType: string } | null = null;
    if (expires !== undefined && sig) {
      if (!verifyMediaSignature(threadId, filename, expires, sig)) {
        return notFound();
      }
      file = await readStoredMedia(threadId, filename);
    } else {
      const gate = await gateApiKeyRequest(user, request, locale, t, logger, {
        consumeRateLimit: false,
      });
      if (!gate.ok) {
        return openAiErrorResponse(gate.error);
      }
      // Same ownership rule as the chat file route.
      const owned = await ChatFileRepository.getFile(
        { threadId, filename },
        gate.user,
        logger,
        locale,
      );
      file =
        owned.buffer.length > 0
          ? { buffer: owned.buffer, mimeType: owned.contentType }
          : null;
    }
    if (!file) {
      return notFound();
    }
    return createStreamingResponse(
      new Response(new Uint8Array(file.buffer), {
        status: 200,
        headers: {
          "Content-Type": file.mimeType,
          "Content-Length": String(file.buffer.length),
          "Cache-Control": "private, max-age=86400",
        },
      }),
    );
  }
}
