/**
 * Sync Trigger-Pull Route
 * Admin-only: runs pullFromRemote in-process.
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { TaskSyncRepository } from "../repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ logger, locale }) =>
      TaskSyncRepository.pullFromRemote(logger, locale),
  },
});
