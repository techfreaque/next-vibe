/**
 * User Remote Connection Repository
 * DB operations for per-user remote connection config
 */

import { and, eq } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";

import type { RemoteToolCapability } from "./db";
import { userRemoteConnections } from "./db";
import type { RemoteConnectionGetResponseOutput } from "./definition";
import type { RemoteDisconnectT } from "./disconnect/i18n";

/**
 * Get the current remote connection status for a user (no token in response).
 * Returns the first active connection if no instanceId specified.
 */
export async function getRemoteConnection(
  user: JwtPrivatePayloadType,
  logger: EndpointLogger,
  instanceId?: string,
): Promise<ResponseType<RemoteConnectionGetResponseOutput>> {
  const conditions = [eq(userRemoteConnections.userId, user.id)];
  if (instanceId) {
    conditions.push(eq(userRemoteConnections.instanceId, instanceId));
  }

  const [row] = await db
    .select()
    .from(userRemoteConnections)
    .where(and(...conditions));

  if (!row || !row.isActive) {
    logger.debug("No active remote connection for user", { userId: user.id });
    return success({
      isConnected: false,
      remoteUrl: null,
      isActive: null,
      lastSyncedAt: null,
      instanceId: null,
      friendlyName: null,
    });
  }

  logger.debug("Retrieved remote connection", {
    userId: user.id,
    remoteUrl: row.remoteUrl,
    instanceId: row.instanceId,
  });

  return success({
    isConnected: true,
    remoteUrl: row.remoteUrl,
    isActive: row.isActive,
    lastSyncedAt: row.lastSyncedAt?.toISOString() ?? null,
    instanceId: row.instanceId,
    friendlyName: row.friendlyName,
  });
}

/**
 * Store or update a remote connection for a user (upsert on userId + instanceId)
 */
export async function upsertRemoteConnection(params: {
  userId: string;
  remoteUrl: string;
  token: string;
  leadId?: string;
  instanceId?: string;
  friendlyName?: string;
  logger: EndpointLogger;
}): Promise<ResponseType<{ remoteUrl: string; isConnected: boolean }>> {
  const {
    userId,
    remoteUrl,
    token,
    leadId,
    instanceId = "hermes",
    friendlyName,
    logger,
  } = params;

  await db
    .insert(userRemoteConnections)
    .values({
      userId,
      remoteUrl,
      token,
      leadId: leadId ?? null,
      instanceId,
      friendlyName: friendlyName ?? instanceId,
      isActive: true,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [userRemoteConnections.userId, userRemoteConnections.instanceId],
      set: {
        remoteUrl,
        token,
        leadId: leadId ?? null,
        friendlyName: friendlyName ?? instanceId,
        isActive: true,
        updatedAt: new Date(),
      },
    });

  logger.info("Stored remote connection", { userId, remoteUrl, instanceId });
  return success({ remoteUrl, isConnected: true });
}

/**
 * Clear the remote connection for a user (by instanceId, or all if not specified)
 */
export async function clearRemoteConnection(
  user: JwtPrivatePayloadType,
  logger: EndpointLogger,
  t: RemoteDisconnectT,
  instanceId?: string,
): Promise<ResponseType<{ disconnected: boolean }>> {
  const conditions = [eq(userRemoteConnections.userId, user.id)];
  if (instanceId) {
    conditions.push(eq(userRemoteConnections.instanceId, instanceId));
  }

  const result = await db
    .delete(userRemoteConnections)
    .where(and(...conditions))
    .returning();

  if (result.length === 0) {
    return fail({
      message: t("post.errors.notFound.title"),
      errorType: ErrorResponseTypes.NOT_FOUND,
    });
  }

  logger.info("Cleared remote connection", { userId: user.id, instanceId });
  return success({ disconnected: true });
}

/**
 * Get all active connections across all users — for system-level task sync iteration.
 * Includes capabilitiesHash for diff checking.
 */
export async function getAllActiveConnectionsForSync(): Promise<
  Array<{
    userId: string;
    remoteUrl: string;
    token: string;
    leadId: string;
    instanceId: string;
    friendlyName: string;
    capabilitiesHash: string | null;
  }>
> {
  const rows = await db
    .select()
    .from(userRemoteConnections)
    .where(eq(userRemoteConnections.isActive, true));

  return rows
    .filter((r) => r.token)
    .map((r) => ({
      userId: r.userId,
      remoteUrl: r.remoteUrl,
      token: r.token,
      leadId: r.leadId ?? "",
      instanceId: r.instanceId,
      friendlyName: r.friendlyName,
      capabilitiesHash: r.capabilitiesHash ?? null,
    }));
}

/**
 * Get all active connections for a user — for task sync iteration
 */
export async function getAllActiveConnections(userId: string): Promise<
  Array<{
    remoteUrl: string;
    token: string;
    leadId: string;
    instanceId: string;
    friendlyName: string;
  }>
> {
  const rows = await db
    .select()
    .from(userRemoteConnections)
    .where(
      and(
        eq(userRemoteConnections.userId, userId),
        eq(userRemoteConnections.isActive, true),
      ),
    );

  return rows
    .filter((r) => r.token)
    .map((r) => ({
      remoteUrl: r.remoteUrl,
      token: r.token,
      leadId: r.leadId ?? "",
      instanceId: r.instanceId,
      friendlyName: r.friendlyName,
    }));
}

/**
 * Get the full connection record (with token) for a specific user+instance
 */
export async function getRemoteConnectionRecord(
  userId: string,
  instanceId?: string,
): Promise<{
  remoteUrl: string;
  token: string;
  leadId: string;
  instanceId: string;
} | null> {
  const conditions = [eq(userRemoteConnections.userId, userId)];
  if (instanceId) {
    conditions.push(eq(userRemoteConnections.instanceId, instanceId));
  }

  const [row] = await db
    .select()
    .from(userRemoteConnections)
    .where(and(...conditions));

  if (!row || !row.isActive || !row.token) {
    return null;
  }

  return {
    remoteUrl: row.remoteUrl,
    token: row.token,
    leadId: row.leadId ?? "",
    instanceId: row.instanceId,
  };
}

/**
 * Update lastSyncedAt + capabilities snapshot for a connection
 */
export async function touchLastSynced(
  userId: string,
  instanceId: string,
  capabilities?: RemoteToolCapability[],
  capabilitiesHash?: string,
): Promise<void> {
  await db
    .update(userRemoteConnections)
    .set({
      lastSyncedAt: new Date(),
      updatedAt: new Date(),
      ...(capabilities !== undefined ? { capabilities } : {}),
      ...(capabilitiesHash !== undefined ? { capabilitiesHash } : {}),
    })
    .where(
      and(
        eq(userRemoteConnections.userId, userId),
        eq(userRemoteConnections.instanceId, instanceId),
      ),
    );
}

/**
 * Get capabilities snapshot for a specific connection (for help endpoint)
 */
export async function getCapabilities(
  userId: string,
  instanceId: string,
): Promise<RemoteToolCapability[] | null> {
  const [row] = await db
    .select({ capabilities: userRemoteConnections.capabilities })
    .from(userRemoteConnections)
    .where(
      and(
        eq(userRemoteConnections.userId, userId),
        eq(userRemoteConnections.instanceId, instanceId),
        eq(userRemoteConnections.isActive, true),
      ),
    );

  return row?.capabilities ?? null;
}
