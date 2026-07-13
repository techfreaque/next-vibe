/**
 * Chat File Serving Route Handler
 * Serves uploaded files from filesystem storage
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

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
