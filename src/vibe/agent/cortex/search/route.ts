import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { CortexSearchRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ data, user, logger, t, locale, streamContext }) =>
      CortexSearchRepository.search({
        userId: user.id,
        user,
        query: data.query,
        path: data.path,
        maxResults: data.maxResults,
        logger,
        t,
        locale,
        streamContext: streamContext,
      }),
  },
});
