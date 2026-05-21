import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { LimitsRepository } from "./repository";

export const { GET, POST, PUT, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, logger, locale }) =>
      LimitsRepository.list(data, logger, locale),
  },
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, logger, locale }) =>
      LimitsRepository.create(data, logger, locale),
  },
  [Methods.PUT]: {
    email: undefined,
    handler: ({ data, logger, locale }) =>
      LimitsRepository.update(data, logger, locale),
  },
});
