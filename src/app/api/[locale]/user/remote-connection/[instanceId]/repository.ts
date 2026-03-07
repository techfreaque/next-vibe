/**
 * Remote Connection by Instance ID Repository
 * GET — status, PATCH — rename, DELETE — disconnect
 */

import "server-only";

import { and, eq, ne } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { defaultLocale } from "@/i18n/core/config";

import { userRemoteConnections } from "../db";
import { invalidateInstanceIdCache } from "../repository";
import type { RemoteConnectionByIdGetResponseOutput } from "./definition";
import type { RemoteConnectionByIdT } from "./i18n";

export async function getConnectionById(
  user: JwtPrivatePayloadType,
  logger: EndpointLogger,
  instanceId: string,
): Promise<ResponseType<RemoteConnectionByIdGetResponseOutput>> {
  const [row] = await db
    .select()
    .from(userRemoteConnections)
    .where(
      and(
        eq(userRemoteConnections.userId, user.id),
        eq(userRemoteConnections.instanceId, instanceId),
        ne(userRemoteConnections.token, "self"),
      ),
    );

  if (!row || !row.isActive) {
    logger.debug("No active remote connection for user+instance", {
      userId: user.id,
      instanceId,
    });
    return success({
      isConnected: false,
      friendlyName: null,
      remoteUrl: null,
      isActive: null,
      lastSyncedAt: null,
    });
  }

  return success({
    isConnected: true,
    friendlyName: row.friendlyName,
    remoteUrl: row.remoteUrl,
    isActive: row.isActive,
    lastSyncedAt: row.lastSyncedAt?.toISOString() ?? null,
  });
}

export async function renameConnection(
  user: JwtPrivatePayloadType,
  logger: EndpointLogger,
  t: RemoteConnectionByIdT,
  instanceId: string,
  friendlyName: string,
): Promise<ResponseType<{ updated: boolean }>> {
  const result = await db
    .update(userRemoteConnections)
    .set({ friendlyName, updatedAt: new Date() })
    .where(
      and(
        eq(userRemoteConnections.userId, user.id),
        eq(userRemoteConnections.instanceId, instanceId),
      ),
    )
    .returning({ instanceId: userRemoteConnections.instanceId });

  if (result.length === 0) {
    return fail({
      message: t("patch.errors.notFound.title"),
      errorType: ErrorResponseTypes.NOT_FOUND,
    });
  }

  logger.info("Renamed remote connection", {
    userId: user.id,
    instanceId,
    friendlyName,
  });
  return success({ updated: true });
}

export async function disconnectConnection(
  user: JwtPrivatePayloadType,
  logger: EndpointLogger,
  t: RemoteConnectionByIdT,
  instanceId: string,
): Promise<ResponseType<{ disconnected: boolean }>> {
  // Fetch full record before deleting — need remoteUrl + token to notify cloud
  const [row] = await db
    .select()
    .from(userRemoteConnections)
    .where(
      and(
        eq(userRemoteConnections.userId, user.id),
        eq(userRemoteConnections.instanceId, instanceId),
      ),
    );

  if (!row) {
    return fail({
      message: t("delete.errors.notFound.title"),
      errorType: ErrorResponseTypes.NOT_FOUND,
    });
  }

  await db
    .delete(userRemoteConnections)
    .where(
      and(
        eq(userRemoteConnections.userId, user.id),
        eq(userRemoteConnections.instanceId, instanceId),
      ),
    );

  invalidateInstanceIdCache();
  logger.info("Disconnected remote connection locally", {
    userId: user.id,
    instanceId,
  });

  // Fire-and-forget: notify cloud to remove the registration record too
  if (row.token && row.remoteUrl) {
    const remoteDeleteUrl = `${row.remoteUrl}/api/${defaultLocale}/user/remote-connection/${instanceId}`;
    fetch(remoteDeleteUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${row.token}`,
        ...(row.leadId ? { Cookie: `lead_id=${row.leadId}` } : {}),
      },
      signal: AbortSignal.timeout(10000),
    })
      .then((res) => {
        if (!res.ok) {
          logger.warn("Remote disconnect failed — cloud record may remain", {
            instanceId,
            status: res.status,
          });
        } else {
          logger.info("Remote disconnect acknowledged by cloud", {
            instanceId,
          });
        }
        return undefined;
      })
      .catch((err) => {
        logger.warn(
          "Remote disconnect request errored — cloud record may remain",
          {
            instanceId,
            error: String(err),
          },
        );
      });
  }

  return success({ disconnected: true });
}
