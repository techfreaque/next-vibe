/**
 * Message by ID Route Handler
 * Handles GET, PATCH, and DELETE requests for individual messages
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { MessageRepository } from "./repository";

/**
 * Export route handlers
 */
export const { GET, PATCH, DELETE, tools } = endpointsHandler({
  endpoint: definitions,

  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, user, t, logger, locale }) =>
      MessageRepository.getMessage(urlPathParams, user, t, logger, locale),
  },

  [Methods.PATCH]: {
    email: undefined,
    handler: ({ data, urlPathParams, user, t, logger, locale }) =>
      MessageRepository.updateMessage(
        data,
        urlPathParams,
        user,
        t,
        logger,
        locale,
      ),
  },

  [Methods.DELETE]: {
    email: undefined,
    handler: ({ urlPathParams, user, t, logger, locale }) =>
      MessageRepository.deleteMessage(urlPathParams, user, t, logger, locale),
  },
});
