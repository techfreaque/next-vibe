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
import { ChatFileRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async (props) => {
      const result = await ChatFileRepository.getFile(
        props.data,
        props.user,
        props.logger,
      );

      if (result.buffer.length === 0) {
        return fail({
          message: "app.api.agent.chat.files.errors.fileNotFound",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return createFileResponse(result.buffer, result.contentType, {
        "Cache-Control": "public, max-age=31536000, immutable",
      });
    },
  },
});
