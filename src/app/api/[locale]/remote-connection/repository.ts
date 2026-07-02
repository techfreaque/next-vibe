/**
 * Remote Connection Repository
 *
 * DB operations for the two-table schema:
 * - `instance_identities` - self-identity (who am I?)
 * - `remote_connections`  - outbound connections (who do I talk to?)
 */

import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";

import { and, eq, or, sql } from "drizzle-orm";
import {
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { env } from "@/config/env";
import { envClient } from "@/config/env-client";

import type {
  ConnectionHealth,
  RemoteToolCapability,
  SyncCursor,
  SyncScope,
  TransportMode,
} from "./db";
import { instanceIdentities, remoteConnections } from "./db";

interface ConnectToRemoteResult {
  remoteUrl: string;
  isConnected: boolean;
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
      return stored; // stored before encryption was introduced
    }
    const key = RemoteConnectionRepository.getEncryptionKey();
    const parts = stored
      .slice(RemoteConnectionRepository.ENC_PREFIX.length)
      .split(":");
    if (parts.length !== 3) {
      return stored; // malformed
    }
    const ivHex = parts[0];
    const tagHex = parts[1];
    const ctHex = parts[2];
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
   * - Local dev (vibe dev, localhost) → "atlas"
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

    return "atlas";
  }

  /**
   * Upsert a self-identity record for this instance.
   */
  static async upsertInstanceIdentity(params: {
    userId: string;
    instanceId: string;
    isDefault?: boolean;
  }): Promise<void> {
    const { userId, instanceId, isDefault = false } = params;

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
        isDefault,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [instanceIdentities.userId, instanceIdentities.instanceId],
        set: {
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
  static async getLocalInstanceId(userId: string): Promise<string> {
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

    return (
      row?.instanceId ??
      RemoteConnectionRepository.deriveDefaultSelfInstanceId()
    );
  }

  // ─── Remote Connections ───────────────────────────────────────────────────────

  /**
   * Store or update a remote connection (upsert on userId + instanceId).
   * Also ensures a self-identity record exists.
   */
  static async upsertRemoteConnection(params: {
    userId: string;
    remoteUrl: string;
    token: string;
    leadId: string;
    instanceId?: string;
    remoteInstanceId?: string;
    remoteUserId?: string;
    isReverseEntry?: boolean;
    transportMode?: TransportMode;
    isInferenceProvider?: boolean;
    syncScope?: SyncScope;
    logger: EndpointLogger;
  }): Promise<ResponseType<ConnectToRemoteResult>> {
    const {
      userId,
      remoteUrl,
      token,
      leadId,
      instanceId: rawInstanceId,
      remoteInstanceId,
      remoteUserId,
      isReverseEntry = false,
      transportMode,
      isInferenceProvider,
      syncScope,
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

    await db
      .insert(remoteConnections)
      .values({
        userId,
        remoteUrl,
        token: encryptedToken,
        leadId,
        instanceId,
        remoteInstanceId: remoteInstanceId ?? null,
        remoteUserId: remoteUserId ?? null,
        isActive: true,
        isReverseEntry,
        // Mirror threads on both sides by default so local and remote folders
        // both show conversation history without extra configuration.
        threadMirrorMode: "both",
        ...(transportMode ? { transportMode } : {}),
        ...(isInferenceProvider !== undefined ? { isInferenceProvider } : {}),
        ...(syncScope ? { syncScope } : {}),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [remoteConnections.userId, remoteConnections.instanceId],
        set: {
          remoteUrl,
          token: encryptedToken,
          leadId,
          remoteInstanceId: remoteInstanceId ?? null,
          // Only overwrite the stored peer userId when we actually learned one,
          // so a reconnect that omits it doesn't null out a known value.
          ...(remoteUserId ? { remoteUserId } : {}),
          isActive: true,
          isReverseEntry,
          ...(transportMode ? { transportMode } : {}),
          ...(isInferenceProvider !== undefined ? { isInferenceProvider } : {}),
          ...(syncScope ? { syncScope } : {}),
          updatedAt: new Date(),
        },
      });

    logger.debug("Stored remote connection", { userId, remoteUrl, instanceId });
    return success({ remoteUrl, isConnected: true });
  }

  /**
   * Mark a connection as synced right now, optionally storing an updated
   * capability snapshot in the same write.
   *
   * Called unconditionally at the start of every sync exchange (sync/repository)
   * so lastSyncedAt is a reliable "a sync completed" signal that tests and the
   * connection-health indicator can poll. Capabilities are only included when
   * the sender's capabilitiesVersion changed (once per change, never per exchange).
   */
  static async touchLastSynced(
    userId: string,
    instanceId: string,
    capabilityOpts?: {
      capabilities: RemoteToolCapability[];
      capabilitiesVersion?: string;
    },
  ): Promise<void> {
    await db
      .update(remoteConnections)
      .set({
        lastSyncedAt: new Date(),
        updatedAt: new Date(),
        ...(capabilityOpts
          ? {
              capabilities: capabilityOpts.capabilities,
              ...(capabilityOpts.capabilitiesVersion
                ? { capabilitiesVersion: capabilityOpts.capabilitiesVersion }
                : {}),
            }
          : {}),
      })
      .where(
        and(
          eq(remoteConnections.userId, userId),
          eq(remoteConnections.instanceId, instanceId),
        ),
      );
  }

  /**
   * Get all active connections across all users - for system-level task sync.
   */
  static async getAllActiveConnectionsForSync(): Promise<
    Array<{
      userId: string;
      remoteUrl: string;
      token: string;
      leadId: string;
      instanceId: string;
      syncCursors: Record<string, SyncCursor> | null;
      capabilitiesVersion: string | null;
      sentCapabilitiesVersion: string | null;
      remoteInstanceId: string | null;
      remoteUserId: string | null;
      localUrl: string | null;
      transportMode: "reverse-ws" | "direct-http" | "cloud-only";
      syncScope: SyncScope | null;
      isReverseEntry: boolean;
    }>
  > {
    const rows = await db
      .select()
      .from(remoteConnections)
      .where(
        and(
          eq(remoteConnections.isActive, true),
          eq(remoteConnections.isReverseEntry, false),
        ),
      );

    return rows
      .filter((r): r is typeof r & { token: string } => !!r.token)
      .map((r) => ({
        userId: r.userId,
        remoteUrl: r.remoteUrl,
        token: RemoteConnectionRepository.decryptToken(r.token),
        leadId: r.leadId,
        instanceId: r.instanceId,
        syncCursors: r.syncCursors ?? null,
        capabilitiesVersion: r.capabilitiesVersion ?? null,
        sentCapabilitiesVersion: r.sentCapabilitiesVersion ?? null,
        remoteInstanceId: r.remoteInstanceId ?? null,
        remoteUserId: r.remoteUserId ?? null,
        localUrl: r.localUrl ?? null,
        transportMode: r.transportMode,
        syncScope: r.syncScope ?? null,
        isReverseEntry: r.isReverseEntry,
      }));
  }

  /**
   * Get all active connections for a user - for task sync and system prompt.
   */
  static async getAllActiveConnections(userId: string): Promise<
    Array<{
      remoteUrl: string;
      token: string;
      leadId: string;
      instanceId: string;
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
        leadId: r.leadId,
        instanceId: r.instanceId,
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
      .orderBy(sql`${remoteConnections.updatedAt} DESC`)
      .limit(1);

    const row = rows[0];
    if (!row || !row.isActive || !row.token) {
      return null;
    }

    return {
      remoteUrl: row.remoteUrl,
      token: RemoteConnectionRepository.decryptToken(row.token),
      leadId: row.leadId,
      instanceId: row.instanceId,
    };
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
    transportMode: "reverse-ws" | "direct-http" | "cloud-only";
    remoteUrl: string;
    /** Local instance URL - set on cloud-side records to push tasks/memories directly. */
    localUrl: string | null;
    token: string | null;
    leadId: string;
    /**
     * True when this row is a reverse entry — the peer initiated the connection
     * to US and we hold THEIR url+token. We can always reach them via direct-http
     * to their bridge (e.g. to return a tool result), regardless of transportMode.
     */
    isReverseEntry: boolean;
  } | null> {
    const [row] = await db
      .select({
        capabilities: remoteConnections.capabilities,
        remoteInstanceId: remoteConnections.remoteInstanceId,
        transportMode: remoteConnections.transportMode,
        remoteUrl: remoteConnections.remoteUrl,
        localUrl: remoteConnections.localUrl,
        token: remoteConnections.token,
        leadId: remoteConnections.leadId,
        isReverseEntry: remoteConnections.isReverseEntry,
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
      transportMode: row.transportMode,
      remoteUrl: row.remoteUrl,
      localUrl: row.localUrl,
      leadId: row.leadId,
      isReverseEntry: row.isReverseEntry,
      token: row.token
        ? RemoteConnectionRepository.decryptToken(row.token)
        : null,
    };
  }

  /**
   * How the PEER reaches this side over the given connection (the mirror of the
   * peer's own transportMode). Drives whether this side runs the reverse-ws
   * connector: open one exactly when this returns "reverse-ws". Null if no row.
   */
  static async getRemoteTransportMode(
    userId: string,
    instanceId: string,
  ): Promise<"reverse-ws" | "direct-http" | "cloud-only" | null> {
    const [row] = await db
      .select({ remoteTransportMode: remoteConnections.remoteTransportMode })
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
    return row?.remoteTransportMode ?? null;
  }

  /**
   * Get connection info for a remote instance without requiring a specific userId.
   * Used by CLI_AUTH_BYPASS / public contexts where userId is unavailable.
   */
  static async getConnectionAnyUser(instanceId: string): Promise<{
    capabilities: RemoteToolCapability[] | null;
    remoteUrl: string;
    token: string | null;
    leadId: string;
  } | null> {
    const [row] = await db
      .select({
        capabilities: remoteConnections.capabilities,
        remoteUrl: remoteConnections.remoteUrl,
        token: remoteConnections.token,
        leadId: remoteConnections.leadId,
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

    if (!row) {
      return null;
    }
    return {
      capabilities: row.capabilities,
      remoteUrl: row.remoteUrl,
      leadId: row.leadId,
      token: row.token
        ? RemoteConnectionRepository.decryptToken(row.token)
        : null,
    };
  }
}
