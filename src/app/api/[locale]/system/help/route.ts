import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import helpEndpoints from "./definition";
import { helpRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: helpEndpoints,
  [Methods.POST]: {
    handler: ({ data, user, logger, platform }) => {
      return helpRepository.execute(data, user, logger, platform);
    },
  },
});
