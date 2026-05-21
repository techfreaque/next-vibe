import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { PreauthorizedTransactionByIdRepository } from "./repository";

export const { GET, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, logger, locale }) =>
      PreauthorizedTransactionByIdRepository.get(urlPathParams, logger, locale),
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ urlPathParams, logger, locale }) =>
      PreauthorizedTransactionByIdRepository.revoke(
        urlPathParams,
        logger,
        locale,
      ),
  },
});
