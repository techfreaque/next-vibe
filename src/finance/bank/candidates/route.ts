import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { BankReconciliationRepository } from "../repository";
import definition from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definition,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, urlPathParams, user, logger, locale }) =>
      BankReconciliationRepository.findCandidates(
        user.id,
        data,
        urlPathParams,
        logger,
        locale,
      ),
  },
});
