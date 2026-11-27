import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { ExchangeRateSetRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ user, data, logger, locale }) =>
      ExchangeRateSetRepository.setManualRate(user.id, data, logger, locale),
  },
});
