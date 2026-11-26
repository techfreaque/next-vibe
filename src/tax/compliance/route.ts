import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definition from "./definition";
import { TaxComplianceRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definition,
  [Methods.GET]: {
    handler: ({ data, user, logger, locale }) =>
      TaxComplianceRepository.review(data, user.id, logger, locale),
  },
});
