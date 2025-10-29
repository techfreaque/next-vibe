import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import helpEndpoints from "./definition";
import { helpRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: helpEndpoints,
  [Methods.POST]: {
    handler: ({ data, locale, logger }) => {
      return helpRepository.execute(data, locale, logger);
    },
  },
});
