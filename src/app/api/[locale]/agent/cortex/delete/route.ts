import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { CortexDeleteRepository } from "./repository";

export const { DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.DELETE]: {
    email: undefined,
    handler: async ({ data, user, locale, logger, t }) => {
      return CortexDeleteRepository.deleteNode({
        userId: user.id,
        user,
        locale,
        path: data.path,
        recursive: data.recursive,
        logger,
        t,
      });
    },
  },
});
