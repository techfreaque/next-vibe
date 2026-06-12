import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { MountDetailRepository } from "./repository";

export const { GET, PATCH, DELETE, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: ({ logger, user, urlPathParams, t }) =>
      MountDetailRepository.get(logger, user, urlPathParams.mountId, t),
  },
  [Methods.PATCH]: {
    handler: ({ data, logger, user, urlPathParams, t }) =>
      MountDetailRepository.update(
        data,
        logger,
        user,
        urlPathParams.mountId,
        t,
      ),
  },
  [Methods.DELETE]: {
    handler: ({ logger, user, urlPathParams, t }) =>
      MountDetailRepository.delete(logger, user, urlPathParams.mountId, t),
  },
});
