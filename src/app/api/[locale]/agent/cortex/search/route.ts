import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { CortexSearchRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ data, user, logger, t, locale }) => {
      return CortexSearchRepository.search({
        userId: user.id,
        user,
        query: data.query,
        path: data.path,
        maxResults: data.maxResults,
        logger,
        t,
        locale,
      });
    },
  },
});
