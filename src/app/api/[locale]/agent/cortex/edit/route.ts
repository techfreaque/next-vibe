import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { CortexEditRepository } from "./repository";

export const { PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.PATCH]: {
    email: undefined,
    handler: async ({ data, user, locale, logger, t }) => {
      return CortexEditRepository.editFile({
        userId: user.id,
        user,
        locale,
        path: data.path,
        find: data.find,
        replace: data.replace,
        startLine: data.startLine,
        endLine: data.endLine,
        newContent: data.newContent,
        logger,
        t,
      });
    },
  },
});
