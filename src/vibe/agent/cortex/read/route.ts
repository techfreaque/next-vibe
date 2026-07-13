import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { CortexReadRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ data, user, locale, logger, t }) =>
      CortexReadRepository.readFile({
        userId: user.id,
        user,
        locale,
        path: data.path,
        maxLines: data.maxLines,
        logger,
        t,
      }),
  },
});
