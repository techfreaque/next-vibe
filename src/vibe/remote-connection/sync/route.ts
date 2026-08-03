/**
 * Task Sync Route Handler
 * Validates API key, returns user-created cron tasks for remote sync.
 */

import "server-only";

import { Methods } from "../../core/definition/enums";
import { endpointsHandler } from "../../core/route/multi";

import { endpoints } from "./definition";
import { TaskSyncRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, logger, locale, user }) =>
      TaskSyncRepository.syncTasks(data, logger, locale, user),
  },
});
