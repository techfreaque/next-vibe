import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { CortexListRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ data, user, logger, t }) => {
      return CortexListRepository.listDirectory({
        userId: user.id,
        user,
        path: data.path ?? "/",
        logger,
        t,
      });
    },
  },
});
