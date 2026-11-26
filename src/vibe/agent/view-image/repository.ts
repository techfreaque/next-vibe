import "server-only";

import type { ToolExecutionContext } from "next-vibe/core/execution-context";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { HandlerResponse } from "next-vibe/core/route/response.schema";
import {
  createContentResponse,
  ErrorResponseTypes,
  fail,
} from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { resolveImageMediaType } from "../ai-stream/repository/context/image-media-type";
import { createFixtureFetch } from "../ai-stream/testing/fetch-cache";
import {
  fetchStorageFileAsBase64,
  mimeFromUrl,
} from "../chat/storage/url-utils";
import {
  parseBase64DataUri,
  resolveMediaReference,
} from "../shared/media-generation";
import type { ViewImagePostRequestInput } from "./definition";
import type { ViewImageT } from "./i18n";

export class ViewImageRepository {
  static async viewImage(
    data: ViewImagePostRequestInput,
    user: JwtPayloadType,
    t: ViewImageT,
    locale: CountryLanguage,
    logger: EndpointLogger,
    /** External URLs are fetched through the fixture chain (record/replay in dev/test). */
    toolExecutionContext: ToolExecutionContext,
  ): Promise<HandlerResponse<never>> {
    const { url } = data;

    const source = url.startsWith("data:") ? "inline image" : url;
    const resolved = await resolveMediaReference(url, user, logger, locale);
    const inline = resolved ? parseBase64DataUri(resolved) : null;
    const base64 = inline
      ? inline.mimeType.startsWith("image/") && inline.base64
      : resolved &&
        (await fetchStorageFileAsBase64(
          resolved,
          user,
          createFixtureFetch(toolExecutionContext, logger),
        ));

    if (!base64) {
      logger.warn("[ViewImage] Image not found or fetch failed", {
        url: source,
      });
      return fail({
        message: t("post.errors.not_found.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    const mimeType = resolveImageMediaType(
      base64,
      inline?.mimeType ?? mimeFromUrl(resolved ?? url),
    );
    return createContentResponse([
      { type: "text", text: `Image: ${source}` },
      { type: "image", data: base64, mimeType },
    ]);
  }
}
