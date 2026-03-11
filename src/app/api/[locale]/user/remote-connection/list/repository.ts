/**
 * Remote Connection List Repository
 * Returns all connections for the logged-in user
 */

import { and, eq, isNull, ne, or } from "drizzle-orm";
import {
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";

import { userRemoteConnections } from "../db";
import type { RemoteConnectionsListResponseOutput } from "./definition";

export async function listRemoteConnections(
  user: JwtPrivatePayloadType,
  logger: EndpointLogger,
): Promise<ResponseType<RemoteConnectionsListResponseOutput>> {
  const rows = await db
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
    .orderBy(userRemoteConnections.updatedAt);

  logger.debug("Listed remote connections", {
    userId: user.id,
    count: rows.length,
  });

  return success({
    connections: rows.map((r) => ({
      instanceId: r.instanceId,
      friendlyName: r.friendlyName,
      remoteUrl: r.remoteUrl,
      isActive: r.isActive,
      lastSyncedAt: r.lastSyncedAt?.toISOString() ?? null,
      hasToken: !!r.token && r.token !== "self",
    })),
  });
}
