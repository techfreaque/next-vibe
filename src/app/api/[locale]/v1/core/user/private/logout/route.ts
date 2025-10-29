import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import logoutEndpoints from "./definition";
import { logoutRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: logoutEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, request, logger }) => {
      return await logoutRepository.logout(data, user, request, logger);
    },
  },
});
