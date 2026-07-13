/**
 * Public Creator Profile Route Handler
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoints from "./definition";
import { CreatorProfileRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: ({ urlPathParams, locale, logger, t, user }) =>
      CreatorProfileRepository.getCreatorProfile(
        urlPathParams,
        locale,
        logger,
        t,
        user,
      ),
  },
});
