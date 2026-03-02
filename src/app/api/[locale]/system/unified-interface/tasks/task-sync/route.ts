/**
 * Task Sync Route Handler
 * Validates API key, returns user-created cron tasks for remote sync.
 */

import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { env } from "@/config/env";

import { endpoints } from "./definition";
import type { SyncedCronTask, SyncedMemory } from "./repository";
import {
  getSharedMemories,
  getUserCreatedTasks,
  upsertRemoteTasks,
  upsertSharedMemories,
} from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: async (props) => {
      const { data, logger, t } = props;
      // Validate API key — return 404 to hide endpoint existence
      if (!env.THEA_REMOTE_API_KEY || data.apiKey !== env.THEA_REMOTE_API_KEY) {
        return {
          success: false as const,
          message: t("taskSync.post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        };
      }

      // Process incoming tasks from remote — only accept tasks for this instance
      let synced = 0;
      if (data.completionsJson) {
        try {
          const remoteTasks = JSON.parse(
            data.completionsJson,
          ) as SyncedCronTask[];
          const instanceId = env.INSTANCE_ID;
          const relevantTasks = remoteTasks.filter(
            (t) => t.targetInstance !== null && t.targetInstance === instanceId,
          );
          const result = await upsertRemoteTasks({
            tasks: relevantTasks,
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

      // Process incoming shared memories
      let memoriesSynced = 0;
      if (data.memoriesJson) {
        try {
          const remoteMemories = JSON.parse(
            data.memoriesJson,
          ) as SyncedMemory[];
          // Get admin user to attach memories to (first admin found)
          const { users, userRoles } =
            await import("@/app/api/[locale]/user/db");
          const { UserPermissionRole } =
            await import("@/app/api/[locale]/user/user-roles/enum");
          const { eq: eqOp } = await import("drizzle-orm");
          const [adminUser] = await (
            await import("@/app/api/[locale]/system/db")
          ).db
            .select({ id: users.id })
            .from(users)
            .innerJoin(userRoles, eqOp(userRoles.userId, users.id))
            .where(eqOp(userRoles.role, UserPermissionRole.ADMIN))
            .limit(1);

          if (adminUser && remoteMemories.length > 0) {
            const memResult = await upsertSharedMemories({
              remoteMemories,
              localUserId: adminUser.id,
              logger,
            });
            memoriesSynced = memResult.success ? memResult.data.synced : 0;
          }
        } catch (error) {
          logger.error("Failed to parse incoming memories JSON", {
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }

      // Return our user-created tasks and shared memories for the remote to sync
      const localResult = await getUserCreatedTasks({ logger, t });
      const tasks = localResult.success ? localResult.data.tasks : [];
      const memResult = await getSharedMemories({ logger });
      const sharedMemories = memResult.success ? memResult.data.memories : [];

      return {
        success: true as const,
        data: {
          tasksJson: JSON.stringify(tasks),
          synced: tasks.length,
          completionsProcessed: synced,
          memoriesSynced,
          sharedMemoriesJson: JSON.stringify(sharedMemories),
        },
      };
    },
  },
});
