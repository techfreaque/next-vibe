import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { CorvinaUserByIdRepository } from "./repository";

export const { GET, PUT, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, logger, locale }) =>
      CorvinaUserByIdRepository.getById(urlPathParams, logger, locale),
  },
  [Methods.PUT]: {
    email: undefined,
    handler: ({ data, urlPathParams, logger, locale }) =>
      CorvinaUserByIdRepository.update(urlPathParams, data, logger, locale),
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ urlPathParams, logger, locale }) =>
      CorvinaUserByIdRepository.deleteUser(urlPathParams, logger, locale),
  },
});
