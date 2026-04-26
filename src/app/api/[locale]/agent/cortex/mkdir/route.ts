import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { CortexMkdirRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, logger, t }) => {
      return CortexMkdirRepository.createDirectory({
        userId: user.id,
        user,
        path: data.path,
        viewType: data.viewType,
        createParents: data.createParents,
        logger,
        t,
      });
    },
  },
});
