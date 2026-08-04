/**
 * System Settings Route Handler
 */

import "server-only";

import { Methods } from "../../core/definition/enums";
import { endpointsHandler } from "../../core/route/multi";
import endpoints from "./definition";
import { SystemSettingsRepository } from "./repository";

export const { GET, PATCH, POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: ({ logger, t }) => SystemSettingsRepository.getSettings(logger, t),
  },
  [Methods.PATCH]: {
    handler: ({ data, logger, t }) =>
      SystemSettingsRepository.patchSettings(data, logger, t),
  },
  [Methods.POST]: {
    handler: ({ data, user, logger, t, locale }) =>
      SystemSettingsRepository.unbottledLogin(data, user, locale, logger, t),
  },
});
