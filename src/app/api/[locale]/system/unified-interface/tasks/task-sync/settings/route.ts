/**
 * Task Sync Settings Route Handler
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { TaskSyncSettingsRepository } from "./repository";

export const { GET, PATCH, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    email: undefined,
    handler: ({ logger }) =>
      TaskSyncSettingsRepository.getTaskSyncSettings(logger),
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: ({ data, logger }) =>
      TaskSyncSettingsRepository.updateTaskSyncSettings(
        data.syncEnabled,
        logger,
      ),
  },
});
