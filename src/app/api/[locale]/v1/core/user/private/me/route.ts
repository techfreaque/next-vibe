/**
 * User Profile (Me) Route Handlers
 * Production-ready route handlers following new pattern
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import meEndpoints from "./definition";
import { userProfileRepository } from "./repository";

export const { GET, POST, DELETE, tools } = endpointsHandler({
  endpoint: meEndpoints,
  [Methods.GET]: {
    handler: ({ data, user, locale, logger }) =>
      userProfileRepository.getProfile(data, user, locale, logger),
  },
  [Methods.POST]: {
    handler: ({ data, user, locale, logger }) =>
      userProfileRepository.updateProfile(data, user, locale, logger),
  },
  [Methods.DELETE]: {
    handler: ({ data, user, locale, logger }) =>
      userProfileRepository.deleteAccount(data, user, locale, logger),
  },
});
