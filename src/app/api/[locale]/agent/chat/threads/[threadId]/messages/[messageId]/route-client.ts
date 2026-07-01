/**
 * Message by ID Client-Side Route Handler
 * Mirrors server route.ts structure but uses client repository (localStorage)
 * Handles GET, PATCH, DELETE requests for incognito messages
 */

import { Methods } from "next-vibe/core/definition/enums";
import { clientEndpointsHandler } from "next-vibe/core/route/client-multi";

import definitions from "./definition";
import { ChatMessageByIdRepositoryClient } from "./repository-client";

/**
 * Client-side handlers - mirrors server route structure exactly
 */
export const { GET, PATCH, DELETE } = clientEndpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ urlPathParams, logger, locale }) =>
      ChatMessageByIdRepositoryClient.getMessage(
        urlPathParams.threadId,
        urlPathParams.messageId,
        logger,
        locale,
      ),
  },
  [Methods.PATCH]: {
    handler: ({ data, urlPathParams, logger, locale }) =>
      ChatMessageByIdRepositoryClient.updateMessage(
        urlPathParams.threadId,
        urlPathParams.messageId,
        data,
        logger,
        locale,
      ),
  },
  [Methods.DELETE]: {
    handler: ({ urlPathParams, logger, locale }) =>
      ChatMessageByIdRepositoryClient.deleteMessage(
        urlPathParams.threadId,
        urlPathParams.messageId,
        logger,
        locale,
      ),
  },
});
