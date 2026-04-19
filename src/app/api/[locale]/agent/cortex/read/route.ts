import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { CortexReadRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ data, user, logger, t }) => {
      return CortexReadRepository.readFile({
        userId: user.id,
        user,
        path: data.path,
        maxLines: data.maxLines,
        logger,
        t,
      });
    },
  },
});
