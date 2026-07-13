/**
 * Chat Thread Share Links API Route Handler
 * Handles GET, POST, PATCH, DELETE requests for thread share links
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { ShareLinksRepository } from "./repository";

export const { GET, POST, PATCH, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, user, t, logger }) =>
      ShareLinksRepository.list(urlPathParams, user, t, logger),
  },
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, urlPathParams, user, t, logger }) =>
      ShareLinksRepository.create(data, urlPathParams, user, t, logger),
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: ({ data, user, t, logger }) =>
      ShareLinksRepository.update(data, user, t, logger),
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ data, user, t, logger }) =>
      ShareLinksRepository.revoke(data, user, t, logger),
  },
});
