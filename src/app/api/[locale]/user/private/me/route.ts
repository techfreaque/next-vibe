/**
 * User Profile (Me) Route Handlers
 * Production-ready route handlers following new pattern
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

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
    handler: ({ data, logger, locale, t }) =>
      UserProfileRepository.deleteAccount(data, locale, logger, t),
  },
});
