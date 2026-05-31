import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { CoaLedgerRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ data, urlPathParams, user, logger, locale }) => {
      return await CoaLedgerRepository.getLedger(
        urlPathParams.accountId,
        data,
        user.id,
        logger,
        locale,
      );
    },
  },
});
