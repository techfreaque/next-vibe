/**
 * Messages Client-Side Route Handler
 * Mirrors server route.ts structure but uses client repository (localStorage)
 * Handles GET (list) and POST (create) requests for incognito threads
 */

import { Methods } from "next-vibe/core/definition/enums";
import { clientEndpointsHandler } from "next-vibe/core/route/client-multi";

import definitions from "./definition";
import { ChatMessagesRepositoryClient } from "./repository-client";

/**
 * Client-side handlers - mirrors server route structure exactly
 */
export const { GET, POST } = clientEndpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ urlPathParams, logger, locale }) =>
      ChatMessagesRepositoryClient.listMessages(
        urlPathParams.threadId,
        logger,
        locale,
      ),
  },
  [Methods.POST]: {
    handler: ({ data, urlPathParams, logger, locale }) =>
      ChatMessagesRepositoryClient.createMessage(
        urlPathParams.threadId,
        data,
        logger,
        locale,
      ),
  },
});
