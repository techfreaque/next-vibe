import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { CoaAccountUpdateRepository } from "./repository";

export const { PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.PATCH]: {
    email: undefined,
    handler: async ({ data, user, logger, locale }) =>
      CoaAccountUpdateRepository.updateAccount(data, user.id, logger, locale),
  },
});
