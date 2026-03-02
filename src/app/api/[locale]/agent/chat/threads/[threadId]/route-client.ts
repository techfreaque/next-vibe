/**
 * Thread by ID Client-Side Route Handler
 * Mirrors server route.ts structure but uses client repository (localStorage)
 * Handles GET, PATCH, DELETE requests for incognito threads
 */

import { clientEndpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/client-multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { ChatThreadByIdRepositoryClient } from "./repository-client";

/**
 * Client-side handlers - mirrors server route structure exactly
 */
export const { GET, PATCH, DELETE } = clientEndpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ urlPathParams, logger, locale }) =>
      ChatThreadByIdRepositoryClient.getThread(
        urlPathParams.threadId,
        logger,
        locale,
      ),
  },
  [Methods.PATCH]: {
    handler: ({ data, urlPathParams, logger, locale }) =>
      ChatThreadByIdRepositoryClient.updateThread(
        urlPathParams.threadId,
        data,
        logger,
        locale,
      ),
  },
  [Methods.DELETE]: {
    handler: ({ urlPathParams, logger, locale }) =>
      ChatThreadByIdRepositoryClient.deleteThread(
        urlPathParams.threadId,
        logger,
        locale,
      ),
  },
});
