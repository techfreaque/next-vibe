import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definition from "./definition";
import { CompanyPaymentSettingsRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definition,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, user, logger, locale }) =>
      CompanyPaymentSettingsRepository.getSettings(
        user.id,
        data,
        logger,
        locale,
      ),
  },
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger, locale }) =>
      CompanyPaymentSettingsRepository.saveSettings(
        user.id,
        data,
        logger,
        locale,
      ),
  },
});
