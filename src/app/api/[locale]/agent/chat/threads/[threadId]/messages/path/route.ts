/**
 * Message Path Route Handler
 * Handles GET requests for getting message paths
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { definitions } from "./definition";
import { pathRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, data, user, t, logger, locale }) =>
      pathRepository.getPath(urlPathParams, data, user, t, logger, locale),
  },
});
