import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import logoutEndpoints from "./definition";
import { logoutRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: logoutEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ user, logger, platform }) => {
      return await logoutRepository.logout(user, logger, platform);
    },
  },
});
