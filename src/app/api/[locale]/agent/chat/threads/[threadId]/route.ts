/**
 * Chat Thread by ID API Route Handler
 * Handles GET, PATCH, and DELETE requests for individual threads
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { ThreadByIdRepository } from "./repository";

export const { GET, PATCH, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, user, locale, logger }) =>
      ThreadByIdRepository.getThreadById(
        urlPathParams.threadId,
        user,
        locale,
        logger,
      ),
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: ({ data, urlPathParams, user, logger }) =>
      ThreadByIdRepository.updateThread(
        data,
        urlPathParams.threadId,
        user,
        logger,
      ),
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger }) =>
      ThreadByIdRepository.deleteThread(urlPathParams.threadId, user, logger),
  },
});
