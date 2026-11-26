import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definition from "./definition";
import { CompanyTaxRegimeRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definition,
  [Methods.GET]: {
    handler: ({ data, user, logger, locale }) =>
      CompanyTaxRegimeRepository.review(data, user.id, logger, locale),
  },
  [Methods.POST]: {
    handler: ({ data, user, logger, locale }) =>
      CompanyTaxRegimeRepository.set(data, user.id, logger, locale),
  },
});
