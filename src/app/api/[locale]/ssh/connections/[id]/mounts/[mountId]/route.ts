import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

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
