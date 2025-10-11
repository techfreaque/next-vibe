import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/types";

import logoutEndpoints from "./definition";
import { logoutRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: logoutEndpoints,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ data, user, logger }) => {
      return await logoutRepository.logout(data, user, logger);
    },
  },
});
