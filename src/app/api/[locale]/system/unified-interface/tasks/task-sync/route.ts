/**
 * Task Sync Route Handler
 * Validates API key, returns user-created cron tasks for remote sync.
 */

import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { env } from "@/config/env";

import { endpoints } from "./definition";
import type { SyncedCronTask } from "./repository";
import { getUserCreatedTasks, upsertRemoteTasks } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: async ({ data, logger }) => {
      // Validate API key — return 404 to hide endpoint existence
      if (!env.THEA_REMOTE_API_KEY || data.apiKey !== env.THEA_REMOTE_API_KEY) {
        return {
          success: false as const,
          message:
            "app.api.system.unifiedInterface.tasks.taskSync.post.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        };
      }

      // Process incoming tasks from remote
      let synced = 0;
      if (data.completionsJson) {
        try {
          const remoteTasks = JSON.parse(
            data.completionsJson,
          ) as SyncedCronTask[];
          const result = await upsertRemoteTasks({
            tasks: remoteTasks,
            logger,
          });
          if (result.success) {
            synced = result.data.synced;
          }
        } catch (error) {
          logger.error("Failed to parse incoming tasks JSON", {
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }

      // Return our user-created tasks for the remote to sync
      const localResult = await getUserCreatedTasks({ logger });
      const tasks = localResult.success ? localResult.data.tasks : [];

      return {
        success: true as const,
        data: {
          tasksJson: JSON.stringify(tasks),
          synced: tasks.length,
          completionsProcessed: synced,
        },
      };
    },
  },
});
