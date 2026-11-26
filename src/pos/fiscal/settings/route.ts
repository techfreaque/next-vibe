/**
 * POS fiscal settings API route handler
 */
import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { PosFiscalSettingsRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ data, user, logger, locale }) =>
      PosFiscalSettingsRepository.getSettings(
        user.id,
        logger,
        locale,
        data.companyId,
      ),
  },
  [Methods.POST]: {
    handler: ({ data, user, logger, locale }) =>
      PosFiscalSettingsRepository.saveSettings(data, user.id, logger, locale),
  },
});
