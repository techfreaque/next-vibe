import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { CorvinaDeviceByIdRepository } from "./repository";

export const { GET, PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, logger, locale }) =>
      CorvinaDeviceByIdRepository.getById(urlPathParams, logger, locale),
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: ({ data, urlPathParams, logger, locale }) =>
      CorvinaDeviceByIdRepository.update(urlPathParams, data, logger, locale),
  },
});
