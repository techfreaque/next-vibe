import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { PreauthorizedTransactionsRepository } from "./repository";

export const { GET, POST, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, logger, locale }) =>
      PreauthorizedTransactionsRepository.list(data, logger, locale),
  },
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, logger, locale }) =>
      PreauthorizedTransactionsRepository.bulkCreate(data, logger, locale),
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ data, logger, locale }) =>
      PreauthorizedTransactionsRepository.bulkRevoke(data, logger, locale),
  },
});
