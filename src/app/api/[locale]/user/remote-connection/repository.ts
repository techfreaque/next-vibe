/**
 * User Remote Connection Repository
 * DB operations for per-user remote connection config
 */

import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";

import { and, eq, or, sql } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { env } from "@/config/env";

import type { RemoteConnectionByIdT } from "./[instanceId]/i18n";
import type { RemoteToolCapability } from "./db";
import { userRemoteConnections } from "./db";

/**
 * AES-256-GCM token encryption for remote connection JWTs stored in the DB.
 *
 * The encryption key is derived from JWT_SECRET_KEY via SHA-256, so no extra
 * env var is needed — if you have a valid JWT secret you can also decrypt tokens.
 *
 * Encrypted format: "enc:<iv_hex>:<tag_hex>:<ciphertext_hex>"
 * Plain tokens (legacy rows written before encryption was added) are detected by
 * absence of the "enc:" prefix and returned as-is for backwards compatibility.
 */
const ALGORITHM = "aes-256-gcm";
const ENC_PREFIX = "enc:";

function getEncryptionKey(): Buffer {
  // SHA-256 of the JWT secret gives a stable 32-byte AES-256 key.
  // Using a domain-separation prefix prevents key reuse between JWT signing and AES.
  return createHash("sha256")
    .update("remote-token-aes:")
    .update(env.JWT_SECRET_KEY)
    .digest();
}

function encryptToken(token: string): string {
  const key = getEncryptionKey();
  const iv = randomBytes(12); // 96-bit IV for GCM
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(token, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return `${ENC_PREFIX}${iv.toString("hex")}:${tag.toString("hex")}:${ciphertext.toString("hex")}`;
}

function decryptToken(stored: string): string {
  if (!stored.startsWith(ENC_PREFIX)) {
    return stored; // legacy plaintext — backwards compatible
  }
  const key = getEncryptionKey();
  const parts = stored.slice(ENC_PREFIX.length).split(":");
  if (parts.length !== 3) {
    return stored; // malformed — return as-is
  }
  const [ivHex, tagHex, ctHex] = parts as [string, string, string];
  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const ciphertext = Buffer.from(ctHex, "hex");
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  return decipher.update(ciphertext).toString("utf8") + decipher.final("utf8");
}

/**
 * Get the current remote connection status for a user (no token in response).
 * Returns the first active connection if no instanceId specified.
 */
export async function getRemoteConnection(
  user: JwtPrivatePayloadType,
  logger: EndpointLogger,
  instanceId?: string,
): Promise<
  ResponseType<{
    isConnected: boolean;
    remoteUrl: string | null;
    isActive: boolean | null;
    lastSyncedAt: string | null;
    instanceId: string | null;
    friendlyName: string | null;
  }>
> {
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
  remoteInstanceId?: string;
  logger: EndpointLogger;
}): Promise<ResponseType<{ remoteUrl: string; isConnected: boolean }>> {
  const {
    userId,
    remoteUrl,
    token,
    leadId,
    instanceId = "hermes",
    friendlyName,
    remoteInstanceId,
    logger,
  } = params;

  const encryptedToken = encryptToken(token);

  await db
    .insert(userRemoteConnections)
    .values({
      userId,
      remoteUrl,
      token: encryptedToken,
      leadId: leadId ?? null,
      instanceId,
      friendlyName: friendlyName ?? instanceId,
      remoteInstanceId: remoteInstanceId ?? null,
      isActive: true,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [userRemoteConnections.userId, userRemoteConnections.instanceId],
      set: {
        remoteUrl,
        token: encryptedToken,
        leadId: leadId ?? null,
        friendlyName: friendlyName ?? instanceId,
        remoteInstanceId: remoteInstanceId ?? null,
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
  t: RemoteConnectionByIdT,
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
      message: t("delete.errors.notFound.title"),
      errorType: ErrorResponseTypes.NOT_FOUND,
    });
  }

  // Invalidate cache so subsequent reads reflect the disconnected state
  invalidateInstanceIdCache();

  logger.info("Cleared remote connection", { userId: user.id, instanceId });
  return success({ disconnected: true });
}

/**
 * Compute a cheap SHA256 hash of all shared memories for a user.
 * Input: sorted "id:updatedAt" pairs — no content, just identity + freshness.
 * This is stored on the connection row so sync never needs a full table scan.
 */
export async function computeAndStoreMemoriesHash(
  userId: string,
): Promise<string> {
  const { memories } =
    await import("@/app/api/[locale]/agent/chat/memories/db");
  const rows = await db
    .select({ id: memories.id, updatedAt: memories.updatedAt })
    .from(memories)
    .where(
      and(
        eq(memories.userId, userId),
        eq(memories.isShared, true),
        eq(memories.isArchived, false),
      ),
    );

  // Also include tombstones (unshared but still have syncId — need to propagate deletion)
  const tombstones = await db
    .select({ id: memories.id, updatedAt: memories.updatedAt })
    .from(memories)
    .where(
      sql`${memories.userId} = ${userId} AND ${memories.isShared} = false AND ${memories.metadata}->>'syncId' IS NOT NULL`,
    );

  const allRows = [...rows, ...tombstones];
  const sorted = allRows
    .map((r) => `${r.id}:${r.updatedAt.toISOString()}`)
    .toSorted();

  const hash = createHash("sha256").update(sorted.join(",")).digest("hex");

  // Store on all active connections for this user
  await db
    .update(userRemoteConnections)
    .set({ memoriesHash: hash, updatedAt: new Date() })
    .where(
      and(
        eq(userRemoteConnections.userId, userId),
        eq(userRemoteConnections.isActive, true),
      ),
    );

  return hash;
}

/**
 * Get all active connections across all users — for system-level task sync iteration.
 */
export async function getAllActiveConnectionsForSync(): Promise<
  Array<{
    userId: string;
    remoteUrl: string;
    token: string;
    leadId: string;
    instanceId: string;
    friendlyName: string;
    memoriesHash: string | null;
    remoteMemoriesHash: string | null;
    capabilitiesVersion: string | null;
    taskCursor: string | null;
    remoteInstanceId: string | null;
  }>
> {
  const rows = await db
    .select()
    .from(userRemoteConnections)
    .where(eq(userRemoteConnections.isActive, true));

  return rows
    .filter(
      (r): r is typeof r & { token: string } => !!r.token && r.token !== "self",
    )
    .map((r) => ({
      userId: r.userId,
      remoteUrl: r.remoteUrl,
      token: decryptToken(r.token),
      leadId: r.leadId ?? "",
      instanceId: r.instanceId,
      friendlyName: r.friendlyName,
      memoriesHash: r.memoriesHash ?? null,
      remoteMemoriesHash: r.remoteMemoriesHash ?? null,
      capabilitiesVersion: r.capabilitiesVersion ?? null,
      taskCursor: r.taskCursor ?? null,
      remoteInstanceId: r.remoteInstanceId ?? null,
    }));
}

/**
 * Get all active connections for a user — for task sync iteration and system prompt.
 * remoteInstanceId: the instanceId the remote uses to identify itself (from its self-record).
 * The AI should pass remoteInstanceId to execute-tool/help so tasks target the right instance.
 */
export async function getAllActiveConnections(userId: string): Promise<
  Array<{
    remoteUrl: string;
    token: string;
    leadId: string;
    instanceId: string;
    friendlyName: string;
    remoteInstanceId: string | null;
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
    .filter(
      // Exclude self-identity records (token="self") — these are not real remotes.
      // Only include rows with actual JWT tokens (real remote connections).
      (r): r is typeof r & { token: string } => !!r.token && r.token !== "self",
    )
    .map((r) => ({
      remoteUrl: r.remoteUrl,
      token: decryptToken(r.token),
      leadId: r.leadId ?? "",
      instanceId: r.instanceId,
      friendlyName: r.friendlyName,
      remoteInstanceId: r.remoteInstanceId ?? null,
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

  if (!row || !row.isActive || !row.token || row.token === "self") {
    return null;
  }

  return {
    remoteUrl: row.remoteUrl,
    token: decryptToken(row.token),
    leadId: row.leadId ?? "",
    instanceId: row.instanceId,
  };
}

/**
 * Update lastSyncedAt + capabilities snapshot for a connection.
 * Also stores the remote's memoriesHash so future syncs can diff.
 */
export async function touchLastSynced(
  userId: string,
  instanceId: string,
  opts?: {
    capabilities?: RemoteToolCapability[];
    capabilitiesVersion?: string;
    remoteMemoriesHash?: string;
    taskCursor?: string;
    isActive?: boolean;
  },
): Promise<void> {
  await db
    .update(userRemoteConnections)
    .set({
      lastSyncedAt: new Date(),
      updatedAt: new Date(),
      ...(opts?.capabilities !== undefined
        ? { capabilities: opts.capabilities }
        : {}),
      ...(opts?.capabilitiesVersion !== undefined
        ? { capabilitiesVersion: opts.capabilitiesVersion }
        : {}),
      ...(opts?.remoteMemoriesHash !== undefined
        ? { remoteMemoriesHash: opts.remoteMemoriesHash }
        : {}),
      ...(opts?.taskCursor !== undefined
        ? { taskCursor: opts.taskCursor }
        : {}),
      ...(opts?.isActive !== undefined ? { isActive: opts.isActive } : {}),
    })
    .where(
      and(
        eq(userRemoteConnections.userId, userId),
        eq(userRemoteConnections.instanceId, instanceId),
      ),
    );
}

/**
 * Get this instance's own ID from the DB.
 * Self-identity row has token="self". This is the canonical record created by
 * the register endpoint when a remote connects to us. Falls back to the first
 * outbound connection row (token IS NOT NULL AND != 'self') when no self-record
 * exists yet (e.g. the instance connected out but no remote has registered here).
 */
let cachedInstanceId: string | null | undefined = undefined;

export async function getLocalInstanceId(): Promise<string | null> {
  // Cache only when we have a value — don't cache null so the next pulse
  // retries after a connection is established (e.g. after dev seeds run).
  if (cachedInstanceId !== undefined) {
    return cachedInstanceId;
  }

  // Prefer the explicit self-record (token="self") — this is the authoritative
  // identity set when a remote instance registers here.
  const [selfRow] = await db
    .select({ instanceId: userRemoteConnections.instanceId })
    .from(userRemoteConnections)
    .where(
      and(
        eq(userRemoteConnections.isActive, true),
        eq(userRemoteConnections.token, "self"),
      ),
    )
    .limit(1);

  if (selfRow) {
    cachedInstanceId = selfRow.instanceId;
    return selfRow.instanceId;
  }

  // Fallback: use the instanceId from the first outbound connection row.
  // This covers the case where we've connected out but haven't been registered by a remote yet.
  const [connRow] = await db
    .select({ instanceId: userRemoteConnections.instanceId })
    .from(userRemoteConnections)
    .where(
      and(
        eq(userRemoteConnections.isActive, true),
        sql`${userRemoteConnections.token} IS NOT NULL AND ${userRemoteConnections.token} != '' AND ${userRemoteConnections.token} != 'self'`,
      ),
    )
    .limit(1);

  const id = connRow?.instanceId ?? null;
  if (id !== null) {
    cachedInstanceId = id; // Only cache when found — retry on next call if null
  }
  return id;
}

/**
 * Invalidate the cached instance ID (call after connect/disconnect).
 */
export function invalidateInstanceIdCache(): void {
  cachedInstanceId = undefined;
}

/**
 * Get capabilities snapshot for a connection identified by instanceId or remoteInstanceId.
 * - Cloud looking up dev: matches by instanceId ("hermes") on cloud's connection row
 * - Dev looking up cloud: matches by remoteInstanceId ("thea") on dev's connection row
 */
export async function getCapabilities(
  userId: string,
  instanceId: string,
): Promise<RemoteToolCapability[] | null> {
  const conn = await getConnectionForInstance(userId, instanceId);
  return conn?.capabilities ?? null;
}

/**
 * Get the connection row (capabilities + remoteInstanceId) for a given instanceId label.
 * Matches by either instanceId (local label) or remoteInstanceId (what remote calls itself).
 */
export async function getConnectionForInstance(
  userId: string,
  instanceId: string,
): Promise<{
  capabilities: RemoteToolCapability[] | null;
  remoteInstanceId: string | null;
} | null> {
  const [row] = await db
    .select({
      capabilities: userRemoteConnections.capabilities,
      remoteInstanceId: userRemoteConnections.remoteInstanceId,
    })
    .from(userRemoteConnections)
    .where(
      and(
        eq(userRemoteConnections.userId, userId),
        eq(userRemoteConnections.isActive, true),
        or(
          eq(userRemoteConnections.instanceId, instanceId),
          eq(userRemoteConnections.remoteInstanceId, instanceId),
        ),
      ),
    );

  if (!row) {
    return null;
  }
  return {
    capabilities: row.capabilities,
    remoteInstanceId: row.remoteInstanceId,
  };
}
