/**
 * System Settings Route Handler
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

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
