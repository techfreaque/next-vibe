/**
 * User Profile (Me) Route Handlers
 * Production-ready route handlers following new pattern
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import meEndpoints from "./definition";
import { UserProfileRepository } from "./repository";

export const { GET, POST, DELETE, tools } = endpointsHandler({
  endpoint: meEndpoints,
  [Methods.GET]: {
    handler: ({ user, logger, locale, t }) =>
      UserProfileRepository.getProfile(user, locale, logger, t),
  },
  [Methods.POST]: {
    handler: ({ data, user, logger, locale, t }) =>
      UserProfileRepository.updateProfile(data, user, locale, logger, t),
  },
  [Methods.DELETE]: {
    handler: ({ user, logger, locale, t }) =>
      UserProfileRepository.deleteAccount(user, locale, logger, t),
  },
});
