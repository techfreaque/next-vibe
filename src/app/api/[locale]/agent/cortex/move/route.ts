import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { CortexMoveRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, locale, logger, t }) => {
      return CortexMoveRepository.moveNode({
        userId: user.id,
        user,
        locale,
        from: data.from,
        to: data.to,
        logger,
        t,
      });
    },
  },
});
