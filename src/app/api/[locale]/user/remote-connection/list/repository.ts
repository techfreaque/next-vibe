/**
 * Remote Connection List Repository
 * Returns all connections for the logged-in user.
 * For admins, also includes the task-sync enabled state.
 */

import { and, eq } from "drizzle-orm";
import {
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { cronTasks } from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import { remoteConnections } from "../db";
import { RemoteConnectionRepository } from "../repository";
import type { RemoteConnectionsListResponseOutput } from "./definition";

export class RemoteConnectionListRepository {
  private static readonly TASK_SYNC_PULL_ID = "task-sync-pull";
  static async listRemoteConnections(
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    activeOnly: boolean,
  ): Promise<ResponseType<RemoteConnectionsListResponseOutput>> {
    const isAdmin = user.roles.includes(UserPermissionRole.ADMIN);

    const [rows, syncRow, selfInstanceId] = await Promise.all([
      db
        .select()
        .from(remoteConnections)
        .where(
          activeOnly
            ? and(
                eq(remoteConnections.userId, user.id),
                eq(remoteConnections.isActive, true),
              )
            : eq(remoteConnections.userId, user.id),
        )
        .orderBy(remoteConnections.updatedAt),
      isAdmin
        ? db
            .select({ id: cronTasks.id })
            .from(cronTasks)
            .where(
              eq(
                cronTasks.id,
                RemoteConnectionListRepository.TASK_SYNC_PULL_ID,
              ),
            )
            .limit(1)
        : Promise.resolve(null),
      RemoteConnectionRepository.getLocalInstanceId(user.id),
    ]);

    logger.debug("Listed remote connections", {
      userId: user.id,
      count: rows.length,
      isAdmin,
    });

    // Row exists = task enabled; missing = disabled
    const syncEnabled = isAdmin && syncRow !== null ? syncRow.length > 0 : null;

    return success({
      connections: rows.map((r) => ({
        instanceId: r.instanceId,
        remoteUrl: r.remoteUrl,
        localUrl: r.localUrl ?? null,
        isActive: r.isActive,
        lastSyncedAt: r.lastSyncedAt?.toISOString() ?? null,
        hasToken: !!r.token,
        healthStatus: RemoteConnectionRepository.getConnectionHealth(r),
      })),
      selfInstanceId,
      syncEnabled,
    });
  }
}
