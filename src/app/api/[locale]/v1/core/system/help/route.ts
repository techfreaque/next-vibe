import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

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
