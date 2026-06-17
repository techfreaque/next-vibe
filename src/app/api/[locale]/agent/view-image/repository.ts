import "server-only";

import type { HandlerResponse } from "next-vibe/shared/types/response.schema";
import {
  createContentResponse,
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";

import { fetchStorageFileAsBase64 } from "@/app/api/[locale]/agent/chat/storage/url-utils";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import type { ViewImagePostRequestInput } from "./definition";
import type { ViewImageT } from "./i18n";

export class ViewImageRepository {
  static async viewImage(
    data: ViewImagePostRequestInput,
    user: JwtPayloadType,
    t: ViewImageT,
    logger: EndpointLogger,
  ): Promise<HandlerResponse<never>> {
    const { url } = data;

    logger.debug("[ViewImage] Fetching image", { url });

    const base64 = await fetchStorageFileAsBase64(url, user);

    if (!base64) {
      logger.warn("[ViewImage] Image not found or fetch failed", { url });
      return fail({
        message: t("post.errors.not_found.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    // Detect mime type from URL extension, default to image/png
    const ext = url.split(".").pop()?.toLowerCase() ?? "png";
    const mimeMap: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      gif: "image/gif",
    };
    const mimeType = mimeMap[ext] ?? "image/png";

    return createContentResponse([
      { type: "text", text: `Image: ${url}` },
      { type: "image", data: base64, mimeType },
    ]);
  }
}
