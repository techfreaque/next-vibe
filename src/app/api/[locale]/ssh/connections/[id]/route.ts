import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoints from "./definition";
import { ConnectionDetailRepository } from "./repository";

export const { GET, PATCH, DELETE, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: ({ logger, user, urlPathParams, t }) =>
      ConnectionDetailRepository.get(logger, user, urlPathParams.id, t),
  },
  [Methods.PATCH]: {
    handler: ({ logger, user, urlPathParams, data, t }) =>
      ConnectionDetailRepository.update(
        logger,
        user,
        urlPathParams.id,
        data,
        t,
      ),
  },
  [Methods.DELETE]: {
    handler: ({ logger, user, urlPathParams, t }) =>
      ConnectionDetailRepository.delete(logger, user, urlPathParams.id, t),
  },
});
