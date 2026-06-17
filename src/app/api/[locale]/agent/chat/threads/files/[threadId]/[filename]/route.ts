/**
 * Chat File Serving Route Handler
 * Serves uploaded files from filesystem storage
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { ChatFileRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger, t, locale }) =>
      ChatFileRepository.getFileResponse(
        urlPathParams,
        user,
        logger,
        t,
        locale,
      ),
  },
});
