import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { ProductByIdRepository } from "./repository";

export const { GET, PUT, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, logger, locale }) =>
      ProductByIdRepository.getById(urlPathParams, logger, locale),
  },
  [Methods.PUT]: {
    email: undefined,
    handler: ({ urlPathParams, data, logger, locale }) =>
      ProductByIdRepository.update(urlPathParams, data, logger, locale),
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ urlPathParams, logger, locale }) =>
      ProductByIdRepository.remove(urlPathParams, logger, locale),
  },
});
