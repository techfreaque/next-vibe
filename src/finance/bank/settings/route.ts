import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definition from "./definition";
import { BankSettingsRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definition,
  [Methods.POST]: {
    handler: ({ data, user, logger, locale }) =>
      BankSettingsRepository.save(data, user.id, logger, locale),
  },
});
