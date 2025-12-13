/**
 * User Profile (Me) Route Handlers
 * Production-ready route handlers following new pattern
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import meEndpoints from "./definition";
import { userProfileRepository } from "./repository";

export const { GET, POST, DELETE, tools } = endpointsHandler({
  endpoint: meEndpoints,
  [Methods.GET]: {
    handler: ({ user, logger, locale }) =>
      userProfileRepository.getProfile(user, locale, logger),
  },
  [Methods.POST]: {
    handler: ({ data, user, logger, locale }) =>
      userProfileRepository.updateProfile(data, user, locale, logger),
  },
  [Methods.DELETE]: {
    handler: ({ data, logger, locale }) =>
      userProfileRepository.deleteAccount(data, locale, logger),
  },
});
