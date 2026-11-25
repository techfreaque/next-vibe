import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { BankReconciliationRepository } from "../repository";
import definition from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: definition,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger, locale }) =>
      BankReconciliationRepository.importStatement(
        user.id,
        data,
        logger,
        locale,
      ),
  },
});
