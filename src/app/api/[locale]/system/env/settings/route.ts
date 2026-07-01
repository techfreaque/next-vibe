/**
 * System Settings Route Handler
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

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
    handler: ({ data, logger, t, locale }) =>
      SystemSettingsRepository.unbottledLogin(data, locale, logger, t),
  },
});
