/**
 * Chat File Serving Route Handler
 * Serves uploaded files from filesystem storage
 */

import {
  createFileResponse,
  ErrorResponseTypes,
  fail,
} from "@/app/api/[locale]/shared/types/response.schema";
import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ urlPathParams, user, logger, t, locale }) => {
      const { ChatFileRepository } = await import("./repository");
      const result = await ChatFileRepository.getFile(
        urlPathParams,
        user,
        logger,
        locale,
      );

      if (result.buffer.length === 0) {
        return fail({
          message: t("get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return createFileResponse(result.buffer, result.contentType, {
        "Cache-Control": "public, max-age=31536000, immutable",
      });
    },
  },
});
