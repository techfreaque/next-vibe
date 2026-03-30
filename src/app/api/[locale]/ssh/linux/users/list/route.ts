/**
 * Linux Users List Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: async ({ data, logger, user, t }) => {
      const { LinuxUsersListRepository } = await import("./repository");
      return LinuxUsersListRepository.list(data, logger, user, t);
    },
  },
});
