import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { LicenseByIdRepository } from "./repository";

export const { GET, PUT, DELETE, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, logger, locale }) =>
      LicenseByIdRepository.getById(urlPathParams, logger, locale),
  },
  [Methods.PUT]: {
    email: undefined,
    handler: ({ urlPathParams, data, logger, locale }) =>
      LicenseByIdRepository.update(urlPathParams, data, logger, locale),
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ urlPathParams, logger, locale }) =>
      LicenseByIdRepository.remove(urlPathParams, logger, locale),
  },
  [Methods.POST]: {
    email: undefined,
    handler: ({ urlPathParams, logger, locale }) =>
      LicenseByIdRepository.renew(urlPathParams, logger, locale),
  },
});
