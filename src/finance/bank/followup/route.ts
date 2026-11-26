import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definition from "./definition";
import { BankFollowupRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definition,
  [Methods.POST]: {
    handler: ({ data, user, logger, locale }) =>
      BankFollowupRepository.run(data, user.id, logger, locale),
  },
});
