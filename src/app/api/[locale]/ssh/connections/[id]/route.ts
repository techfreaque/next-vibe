import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

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
