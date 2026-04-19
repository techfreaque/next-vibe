import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { CortexWriteRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, locale, logger, t }) => {
      return CortexWriteRepository.writeFile({
        userId: user.id,
        user,
        locale,
        path: data.path,
        content: data.content,
        createParents: data.createParents,
        logger,
        t,
      });
    },
  },
});
