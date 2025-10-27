import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import logoutEndpoints from "./definition";
import { logoutRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: logoutEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, logger }) => {
      return await logoutRepository.logout(data, user, logger);
    },
  },
});
