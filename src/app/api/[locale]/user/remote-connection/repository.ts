/**
 * Remote Connection Repository
 *
 * DB operations for the two-table schema:
 * - `instance_identities` — self-identity (who am I?)
 * - `remote_connections`  — outbound connections (who do I talk to?)
 */

import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";

import { and, desc, eq, or, sql } from "drizzle-orm";
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
import { envClient } from "@/config/env-client";

import type { RemoteConnectionDisconnectT } from "./[instanceId]/disconnect/i18n";
import type { RemoteToolCapability } from "./db";
import { instanceIdentities, remoteConnections } from "./db";

type ConnectionHealth = "healthy" | "warning" | "critical" | "disconnected";

interface ConnectToRemoteResult {
  remoteUrl: string;
  isConnected: boolean;
}
interface ClearRemoteConnectionResult {
  disconnected: boolean;
}

export class RemoteConnectionRepository {
  // ─── Token Encryption ─────────────────────────────────────────────────────────

  private static readonly ALGORITHM = "aes-256-gcm";
  private static readonly ENC_PREFIX = "enc:";

  private static getEncryptionKey(): Buffer {
    return createHash("sha256")
      .update("remote-token-aes:")
      .update(env.JWT_SECRET_KEY)
      .digest();
  }

  static encryptToken(token: string): string {
    const key = RemoteConnectionRepository.getEncryptionKey();
    const iv = randomBytes(12);
    const cipher = createCipheriv(
      RemoteConnectionRepository.ALGORITHM,
      key,
      iv,
    );
    const ciphertext = Buffer.concat([
      cipher.update(token, "utf8"),
      cipher.final(),
    ]);
    const tag = cipher.getAuthTag();
    return `${RemoteConnectionRepository.ENC_PREFIX}${iv.toString("hex")}:${tag.toString("hex")}:${ciphertext.toString("hex")}`;
  }

  static decryptToken(stored: string): string {
    if (!stored.startsWith(RemoteConnectionRepository.ENC_PREFIX)) {
      return stored; // legacy plaintext
    }
    const key = RemoteConnectionRepository.getEncryptionKey();
    const parts = stored
      .slice(RemoteConnectionRepository.ENC_PREFIX.length)
      .split(":");
    if (parts.length !== 3) {
      return stored; // malformed
    }
    const [ivHex, tagHex, ctHex] = parts as [string, string, string];
    const iv = Buffer.from(ivHex, "hex");
    const tag = Buffer.from(tagHex, "hex");
    const ciphertext = Buffer.from(ctHex, "hex");
    const decipher = createDecipheriv(
      RemoteConnectionRepository.ALGORITHM,
      key,
      iv,
    );
    decipher.setAuthTag(tag);
    return (
      decipher.update(ciphertext).toString("utf8") + decipher.final("utf8")
    );
  }

  // ─── Connection Health ────────────────────────────────────────────────────────

  static getConnectionHealth(conn: {
    isActive: boolean;
    lastSyncedAt: Date | null;
  }): ConnectionHealth {
    if (!conn.isActive) {
      return "disconnected";
    }
    if (!conn.lastSyncedAt) {
      return "critical";
    }
    const ageMs = Date.now() - conn.lastSyncedAt.getTime();
    if (ageMs < 3 * 60_000) {
      return "healthy";
    }
    if (ageMs < 10 * 60_000) {
      return "warning";
    }
    return "critical";
  }

  // ─── Instance Identities ──────────────────────────────────────────────────────

  /**
   * Derive a default instanceId for this host from its runtime context.
   * - Preview mode (IS_PREVIEW_MODE=true, vibe start) → "hermes"
   * - Production (non-localhost URL) → "thea"
   * - Local dev (vibe dev, localhost) → "hermes-dev"
   *
   * Used by register (cloud-side) and connect (local-side) to set self-identity,
   * and by getLocalInstanceId as a fallback when no DB record exists.
   */
  static deriveDefaultSelfInstanceId(): string {
    if (process.env["IS_PREVIEW_MODE"] === "true") {
      return "hermes";
    }

    try {
      const parsed = new URL(envClient.NEXT_PUBLIC_APP_URL);
      const hostname = parsed.hostname;
      if (hostname !== "localhost" && hostname !== "127.0.0.1") {
        return "thea";
      }
    } catch {
      // ignore
    }

    return "hermes-dev";
  }

  /**
   * Upsert a self-identity record for this instance.
   */
  static async upsertInstanceIdentity(params: {
    userId: string;
    instanceId: string;
    friendlyName: string;
    isDefault?: boolean;
  }): Promise<void> {
    const { userId, instanceId, friendlyName, isDefault = false } = params;

    if (isDefault) {
      await db
        .update(instanceIdentities)
        .set({ isDefault: false, updatedAt: new Date() })
        .where(
          and(
            eq(instanceIdentities.userId, userId),
            eq(instanceIdentities.isDefault, true),
          ),
        );
    }

    await db
      .insert(instanceIdentities)
      .values({
        userId,
        instanceId,
        friendlyName,
        isDefault,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [instanceIdentities.userId, instanceIdentities.instanceId],
        set: {
          friendlyName,
          isDefault,
          updatedAt: new Date(),
        },
      });
  }

  /**
   * Get the instance identity for a specific user.
   * Looks up the user's default identity from instance_identities.
   * Falls back to deriveDefaultSelfInstanceId() if no DB record exists.
   *
   * For system-level code without a user (pulse, task-sync), use
   * deriveDefaultSelfInstanceId() directly instead.
   */
  private static userInstanceIdCache = new Map<string, string>();

  static async getLocalInstanceId(userId: string): Promise<string> {
    const cached = RemoteConnectionRepository.userInstanceIdCache.get(userId);
    if (cached) {
      return cached;
    }

    const [row] = await db
      .select({ instanceId: instanceIdentities.instanceId })
      .from(instanceIdentities)
      .where(
        and(
          eq(instanceIdentities.userId, userId),
          eq(instanceIdentities.isDefault, true),
        ),
      )
      .limit(1);

    const result =
      row?.instanceId ??
      RemoteConnectionRepository.deriveDefaultSelfInstanceId();
    RemoteConnectionRepository.userInstanceIdCache.set(userId, result);
    return result;
  }

  static invalidateInstanceIdCache(userId?: string): void {
    if (userId) {
      RemoteConnectionRepository.userInstanceIdCache.delete(userId);
    } else {
      RemoteConnectionRepository.userInstanceIdCache.clear();
    }
  }

  // ─── Remote Connections ───────────────────────────────────────────────────────

  /**
   * Get the current remote connection status for a user (no token in response).
   */
  static async getRemoteConnection(
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
      remoteFriendlyName: string | null;
      healthStatus: ConnectionHealth | null;
    }>
  > {
    const conditions = [eq(remoteConnections.userId, user.id)];
    if (instanceId) {
      conditions.push(eq(remoteConnections.instanceId, instanceId));
    }

    const [row] = await db
      .select()
      .from(remoteConnections)
      .where(and(...conditions))
      .orderBy(
        desc(remoteConnections.isDefault),
        desc(remoteConnections.updatedAt),
      )
      .limit(1);

    if (!row || !row.isActive) {
      logger.debug("No active remote connection for user", { userId: user.id });
      return success({
        isConnected: false,
        remoteUrl: null,
        isActive: null,
        lastSyncedAt: null,
        instanceId: null,
        friendlyName: null,
        remoteFriendlyName: null,
        healthStatus: null,
      });
    }

    return success({
      isConnected: true,
      remoteUrl: row.remoteUrl,
      isActive: row.isActive,
      lastSyncedAt: row.lastSyncedAt?.toISOString() ?? null,
      instanceId: row.instanceId,
      friendlyName: row.friendlyName,
      remoteFriendlyName: row.remoteFriendlyName,
      healthStatus: RemoteConnectionRepository.getConnectionHealth(row),
    });
  }

  /**
   * Store or update a remote connection (upsert on userId + instanceId).
   * Also ensures a self-identity record exists.
   */
  static async upsertRemoteConnection(params: {
    userId: string;
    remoteUrl: string;
    token: string;
    leadId?: string;
    instanceId?: string;
    friendlyName?: string;
    remoteInstanceId?: string;
    remoteFriendlyName?: string;
    isDefault?: boolean;
    logger: EndpointLogger;
  }): Promise<ResponseType<ConnectToRemoteResult>> {
    const {
      userId,
      remoteUrl,
      token,
      leadId,
      instanceId: rawInstanceId,
      friendlyName,
      remoteInstanceId,
      remoteFriendlyName,
      isDefault = false,
      logger,
    } = params;

    // Derive instanceId from remote URL hostname if not explicitly provided
    let instanceId = rawInstanceId;
    if (!instanceId) {
      try {
        const parsed = new URL(remoteUrl);
        const hostname = parsed.hostname;
        if (hostname === "localhost" || hostname === "127.0.0.1") {
          instanceId = `local-${parsed.port || "3000"}`;
        } else {
          instanceId = hostname.split(".")[0] ?? "remote";
        }
      } catch {
        instanceId = "remote";
      }
    }

    const encryptedToken = RemoteConnectionRepository.encryptToken(token);

    // Unmark previous default if setting this as default
    if (isDefault) {
      await db
        .update(remoteConnections)
        .set({ isDefault: false, updatedAt: new Date() })
        .where(
          and(
            eq(remoteConnections.userId, userId),
            eq(remoteConnections.isDefault, true),
          ),
        );
    }

    await db
      .insert(remoteConnections)
      .values({
        userId,
        remoteUrl,
        token: encryptedToken,
        leadId: leadId ?? null,
        instanceId,
        friendlyName: friendlyName ?? instanceId,
        remoteInstanceId: remoteInstanceId ?? null,
        remoteFriendlyName: remoteFriendlyName ?? null,
        isActive: true,
        isDefault,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [remoteConnections.userId, remoteConnections.instanceId],
        set: {
          remoteUrl,
          token: encryptedToken,
          leadId: leadId ?? null,
          friendlyName: friendlyName ?? instanceId,
          remoteInstanceId: remoteInstanceId ?? null,
          remoteFriendlyName: remoteFriendlyName ?? null,
          isActive: true,
          isDefault,
          updatedAt: new Date(),
        },
      });

    logger.info("Stored remote connection", { userId, remoteUrl, instanceId });
    return success({ remoteUrl, isConnected: true });
  }

  /**
   * Clear a remote connection (by instanceId, or all if not specified).
   * Does NOT delete instance identities — those persist across reconnects.
   */
  static async clearRemoteConnection(
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    t: RemoteConnectionDisconnectT,
    instanceId?: string,
  ): Promise<ResponseType<ClearRemoteConnectionResult>> {
    const conditions = [eq(remoteConnections.userId, user.id)];
    if (instanceId) {
      conditions.push(eq(remoteConnections.instanceId, instanceId));
    }

    const result = await db
      .delete(remoteConnections)
      .where(and(...conditions))
      .returning();

    if (result.length === 0) {
      return fail({
        message: t("delete.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    RemoteConnectionRepository.invalidateInstanceIdCache();
    logger.info("Cleared remote connection", { userId: user.id, instanceId });
    return success({ disconnected: true });
  }

  /**
   * Compute SHA256 hash of all shared memories and store on active connections.
   */
  static async computeAndStoreMemoriesHash(userId: string): Promise<string> {
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

    await db
      .update(remoteConnections)
      .set({ memoriesHash: hash, updatedAt: new Date() })
      .where(
        and(
          eq(remoteConnections.userId, userId),
          eq(remoteConnections.isActive, true),
        ),
      );

    return hash;
  }

  /**
   * Get all active connections across all users — for system-level task sync.
   */
  static async getAllActiveConnectionsForSync(): Promise<
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
      localUrl: string | null;
      isDirectlyAccessible: boolean;
    }>
  > {
    const rows = await db
      .select()
      .from(remoteConnections)
      .where(eq(remoteConnections.isActive, true));

    return rows
      .filter((r): r is typeof r & { token: string } => !!r.token)
      .map((r) => ({
        userId: r.userId,
        remoteUrl: r.remoteUrl,
        token: RemoteConnectionRepository.decryptToken(r.token),
        leadId: r.leadId ?? "",
        instanceId: r.instanceId,
        friendlyName: r.friendlyName,
        memoriesHash: r.memoriesHash ?? null,
        remoteMemoriesHash: r.remoteMemoriesHash ?? null,
        capabilitiesVersion: r.capabilitiesVersion ?? null,
        taskCursor: r.taskCursor ?? null,
        remoteInstanceId: r.remoteInstanceId ?? null,
        localUrl: r.localUrl ?? null,
        isDirectlyAccessible: r.isDirectlyAccessible,
      }));
  }

  /**
   * Get all active connections for a user — for task sync and system prompt.
   */
  static async getAllActiveConnections(userId: string): Promise<
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
      .from(remoteConnections)
      .where(
        and(
          eq(remoteConnections.userId, userId),
          eq(remoteConnections.isActive, true),
        ),
      );

    return rows
      .filter((r): r is typeof r & { token: string } => !!r.token)
      .map((r) => ({
        remoteUrl: r.remoteUrl,
        token: RemoteConnectionRepository.decryptToken(r.token),
        leadId: r.leadId ?? "",
        instanceId: r.instanceId,
        friendlyName: r.friendlyName,
        remoteInstanceId: r.remoteInstanceId ?? null,
      }));
  }

  /**
   * Get the full connection record (with decrypted token) for a specific user.
   * Prefers isDefault=true, then most recently updated.
   */
  static async getRemoteConnectionRecord(
    userId: string,
    instanceId?: string,
  ): Promise<{
    remoteUrl: string;
    token: string;
    leadId: string;
    instanceId: string;
  } | null> {
    const conditions = [eq(remoteConnections.userId, userId)];
    if (instanceId) {
      conditions.push(eq(remoteConnections.instanceId, instanceId));
    }

    const rows = await db
      .select()
      .from(remoteConnections)
      .where(and(...conditions))
      .orderBy(
        sql`${remoteConnections.isDefault} DESC`,
        sql`${remoteConnections.updatedAt} DESC`,
      )
      .limit(1);

    const row = rows[0];
    if (!row || !row.isActive || !row.token) {
      return null;
    }

    return {
      remoteUrl: row.remoteUrl,
      token: RemoteConnectionRepository.decryptToken(row.token),
      leadId: row.leadId ?? "",
      instanceId: row.instanceId,
    };
  }

  /**
   * Update lastSyncedAt + capabilities snapshot for a connection.
   */
  static async touchLastSynced(
    userId: string,
    instanceId: string,
    opts?: {
      capabilities?: RemoteToolCapability[];
      capabilitiesVersion?: string;
      remoteMemoriesHash?: string;
      remoteFriendlyName?: string;
      taskCursor?: string;
      isActive?: boolean;
    },
  ): Promise<void> {
    await db
      .update(remoteConnections)
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
        ...(opts?.remoteFriendlyName !== undefined
          ? { remoteFriendlyName: opts.remoteFriendlyName }
          : {}),
        ...(opts?.taskCursor !== undefined
          ? { taskCursor: opts.taskCursor }
          : {}),
        ...(opts?.isActive !== undefined ? { isActive: opts.isActive } : {}),
      })
      .where(
        and(
          eq(remoteConnections.userId, userId),
          eq(remoteConnections.instanceId, instanceId),
        ),
      );
  }

  /**
   * Get capabilities snapshot for a connection by instanceId or remoteInstanceId.
   */
  static async getCapabilities(
    userId: string,
    instanceId: string,
  ): Promise<RemoteToolCapability[] | null> {
    const conn = await RemoteConnectionRepository.getConnectionForInstance(
      userId,
      instanceId,
    );
    return conn?.capabilities ?? null;
  }

  /**
   * Get connection row (capabilities + remoteInstanceId) by instanceId label.
   * Matches by either instanceId (local label) or remoteInstanceId (remote's name).
   */
  static async getConnectionForInstance(
    userId: string,
    instanceId: string,
  ): Promise<{
    capabilities: RemoteToolCapability[] | null;
    remoteInstanceId: string | null;
    isDirectlyAccessible: boolean;
    remoteUrl: string;
    /** Local instance URL — set on cloud-side records to push tasks/memories directly. */
    localUrl: string | null;
    token: string | null;
  } | null> {
    const [row] = await db
      .select({
        capabilities: remoteConnections.capabilities,
        remoteInstanceId: remoteConnections.remoteInstanceId,
        isDirectlyAccessible: remoteConnections.isDirectlyAccessible,
        remoteUrl: remoteConnections.remoteUrl,
        localUrl: remoteConnections.localUrl,
        token: remoteConnections.token,
      })
      .from(remoteConnections)
      .where(
        and(
          eq(remoteConnections.userId, userId),
          eq(remoteConnections.isActive, true),
          or(
            eq(remoteConnections.instanceId, instanceId),
            eq(remoteConnections.remoteInstanceId, instanceId),
          ),
        ),
      );

    if (!row) {
      return null;
    }
    return {
      capabilities: row.capabilities,
      remoteInstanceId: row.remoteInstanceId,
      isDirectlyAccessible: row.isDirectlyAccessible,
      remoteUrl: row.remoteUrl,
      localUrl: row.localUrl,
      token: row.token
        ? RemoteConnectionRepository.decryptToken(row.token)
        : null,
    };
  }

  /**
   * Get capabilities for a remote instance without requiring a specific userId.
   * Used by CLI_AUTH_BYPASS / public contexts where userId is unavailable.
   * Read-only metadata — safe for unauthenticated discovery.
   */
  static async getCapabilitiesAnyUser(
    instanceId: string,
  ): Promise<RemoteToolCapability[] | null> {
    const [row] = await db
      .select({
        capabilities: remoteConnections.capabilities,
      })
      .from(remoteConnections)
      .where(
        and(
          eq(remoteConnections.isActive, true),
          or(
            eq(remoteConnections.instanceId, instanceId),
            eq(remoteConnections.remoteInstanceId, instanceId),
          ),
        ),
      )
      .limit(1);

    return row?.capabilities ?? null;
  }
}

// Type for native repository type checking
export type RemoteConnectionRepositoryType = Pick<
  typeof RemoteConnectionRepository,
  keyof typeof RemoteConnectionRepository
>;
