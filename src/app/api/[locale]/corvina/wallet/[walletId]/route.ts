import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { WalletRepository } from "./repository";

export const { GET, PUT, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, logger, locale }) =>
      WalletRepository.get(urlPathParams, logger, locale),
  },
  [Methods.PUT]: {
    email: undefined,
    handler: ({ data, urlPathParams, logger, locale }) =>
      WalletRepository.update(urlPathParams, data, logger, locale),
  },
});
