/**
 * Chat Thread by ID API Route Handler
 * Handles GET, PATCH, and DELETE requests for individual threads
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

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
    handler: ({ data, urlPathParams, user, locale, logger }) =>
      ThreadByIdRepository.updateThread(
        data,
        urlPathParams.threadId,
        user,
        locale,
        logger,
        false,
      ),
    onRemoteEvent: {
      "thread-updated": (props) =>
        ThreadByIdRepository.applyRemoteThreadUpdate(props),
    },
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ urlPathParams, user, locale, logger }) =>
      ThreadByIdRepository.deleteThread(
        urlPathParams.threadId,
        user,
        locale,
        logger,
        false,
      ),
    onRemoteEvent: {
      "thread-deleted": (props) =>
        ThreadByIdRepository.applyRemoteThreadDelete(props),
    },
  },
});
