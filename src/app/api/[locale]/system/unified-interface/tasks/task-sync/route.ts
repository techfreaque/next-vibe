/**
 * Task Sync Route Handler
 * Validates API key, returns user-created cron tasks for remote sync.
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { endpoints } from "./definition";
import { syncTasks } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, logger, locale, user }) =>
      syncTasks(data, logger, locale, user),
  },
});
