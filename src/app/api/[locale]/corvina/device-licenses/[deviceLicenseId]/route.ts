import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { DeviceLicenseByIdRepository } from "./repository";

export const { PUT, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.PUT]: {
    email: undefined,
    handler: ({ urlPathParams, data, logger, locale }) =>
      DeviceLicenseByIdRepository.update(urlPathParams, data, logger, locale),
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ urlPathParams, data, logger, locale }) =>
      DeviceLicenseByIdRepository.remove(urlPathParams, data, logger, locale),
  },
});
