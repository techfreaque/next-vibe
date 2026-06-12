import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import sessionsEndpoints from "./definition";
import { SessionManagementRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: sessionsEndpoints,

  [Methods.GET]: {
    email: undefined,
    handler: ({ user, logger, request, t }) =>
      SessionManagementRepository.listWithTokenResolution(
        user,
        logger,
        request,
        t,
      ),
  },

  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger, locale, t }) =>
      SessionManagementRepository.create(user, data.name, logger, locale, t),
  },
});
