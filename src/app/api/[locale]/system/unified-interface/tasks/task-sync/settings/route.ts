/**
 * Task Sync Settings Route Handler
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { getTaskSyncSettings, updateTaskSyncSettings } from "./repository";

export const { GET, PATCH, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    email: undefined,
    handler: ({ logger }) => getTaskSyncSettings(logger),
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: ({ data, logger }) =>
      updateTaskSyncSettings(data.syncEnabled, logger),
  },
});
