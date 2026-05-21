import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { DeviceLicensesRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, logger, locale }) =>
      DeviceLicensesRepository.list(data, logger, locale),
  },
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, logger, locale }) =>
      DeviceLicensesRepository.create(data, logger, locale),
  },
});
