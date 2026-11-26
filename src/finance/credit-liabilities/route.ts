import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoint from "./definition";
import { CreditLiabilityRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint,
  [Methods.GET]: {
    handler: ({ data, user, locale, logger }) =>
      CreditLiabilityRepository.get(data, user.id, locale, logger),
  },
});
