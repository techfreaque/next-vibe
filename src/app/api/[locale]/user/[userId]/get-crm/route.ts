/**
 * User CRM Profile Get Route
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import userGetCrmEndpoints from "./definition";
import { UserGetCrmRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: userGetCrmEndpoints,
  [Methods.GET]: {
    handler: ({ urlPathParams, user, logger, t }) =>
      UserGetCrmRepository.getCrmProfile(urlPathParams.userId, user, logger, t),
  },
});
