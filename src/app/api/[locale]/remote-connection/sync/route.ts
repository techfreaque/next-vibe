/**
 * Task Sync Route Handler
 * Validates API key, returns user-created cron tasks for remote sync.
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { endpoints } from "./definition";
import { TaskSyncRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, logger, locale, user }) =>
      TaskSyncRepository.syncTasks(data, logger, locale, user),
    onRemoteEvent: {
      "sync-event": async (payload, ctx) =>
        TaskSyncRepository.handleSyncEvent(
          { syncPayloads: payload.syncPayloads ?? {} },
          "id" in ctx.user && typeof ctx.user.id === "string"
            ? ctx.user.id
            : null,
          ctx.logger,
        ),
    },
  },
});
