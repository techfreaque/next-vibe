import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { BankReconciliationRepository } from "../repository";
import definition from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definition,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, user, logger, locale }) =>
      BankReconciliationRepository.listOpen(user.id, data, logger, locale),
  },
});
