/**
 * Remote Connection List Repository
 * Returns all connections for the logged-in user.
 * For admins, also includes the task-sync enabled state.
 */

import { and, eq, isNull, ne, or } from "drizzle-orm";
import {
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { cronTasks } from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import { userRemoteConnections } from "../db";
import type { RemoteConnectionsListResponseOutput } from "./definition";

const TASK_SYNC_PULL_ID = "task-sync-pull";

export async function listRemoteConnections(
  user: JwtPrivatePayloadType,
  logger: EndpointLogger,
): Promise<ResponseType<RemoteConnectionsListResponseOutput>> {
  const isAdmin = user.roles.includes(UserPermissionRole.ADMIN);

  const [rows, syncRow] = await Promise.all([
    db
      .select()
      .from(userRemoteConnections)
      .where(
        and(
          eq(userRemoteConnections.userId, user.id),
          or(
            isNull(userRemoteConnections.token),
            ne(userRemoteConnections.token, "self"),
          ),
        ),
      )
      .orderBy(userRemoteConnections.updatedAt),
    isAdmin
      ? db
          .select({ id: cronTasks.id })
          .from(cronTasks)
          .where(eq(cronTasks.id, TASK_SYNC_PULL_ID))
          .limit(1)
      : Promise.resolve(null),
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
      friendlyName: r.friendlyName,
      remoteUrl: r.remoteUrl,
      isActive: r.isActive,
      lastSyncedAt: r.lastSyncedAt?.toISOString() ?? null,
      hasToken: !!r.token && r.token !== "self",
    })),
    syncEnabled,
  });
}
