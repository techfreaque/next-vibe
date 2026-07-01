import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { CoaLedgerRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ data, urlPathParams, user, logger, locale }) =>
      CoaLedgerRepository.getLedger(
        urlPathParams.accountId,
        data,
        user.id,
        logger,
        locale,
      ),
  },
});
