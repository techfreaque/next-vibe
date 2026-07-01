/**
 * RemoteTransport — Unified routing + dispatch entry point.
 *
 * Single class that all callers use to resolveTarget() — find the right
 * connection for a request. Tool dispatch goes through RouteExecuteRepository.runInProcess().
 *
 * Resolution order (first match wins):
 *   1. explicit instanceId
 *   2. REMOTE root folder → connection whose instance folder is an ancestor (deterministic)
 *   3. null → run locally
 *
 * Note: forceSystemProvider and isInferenceProvider are ws-provider concerns.
 * They are checked in ai-stream routing, not here.
 */

import "server-only";

import { and, desc, eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { chatFolders } from "@/app/api/[locale]/agent/chat/db";
import type { TransportMode } from "@/app/api/[locale]/remote-connection/db";
import { remoteConnections } from "@/app/api/[locale]/remote-connection/db";
import { RemoteConnectionRepository } from "@/app/api/[locale]/remote-connection/repository";

// ─── Unbottled availability cache ─────────────────────────────────────────────
// Instance-global: tracks whether any active connection provides inference.
// Invalidated on connection mutations; refreshes after 30s TTL otherwise.
let _unbottledCache: {
  value: { hasSystem: boolean; forceSystem: boolean };
  expiresAt: number;
} | null = null;

export function invalidateUnbottledCache(): void {
  _unbottledCache = null;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RemoteTarget {
  /** The name this side uses for the remote (e.g. "hermes" on atlas). */
  instanceId: string;
  /**
   * The name the remote uses for this side (e.g. "atlas" as seen from hermes).
   * Used when relaying streams so the remote can place the thread in the correct
   * subfolder (remote/<remoteInstanceId>) and set up routing on its side.
   */
  remoteInstanceId: string | null;
  remoteUrl: string;
  token: string;
  leadId: string;
  transportMode: TransportMode;
  /**
   * When true, the remote should use its own tools and system prompt for streams.
   * Derived from call context: REMOTE folder or UNBOTTLED model → true, else false.
   */
  useRemoteContext: boolean;
}

export interface ResolveTargetParams {
  userId: string;
  /** Explicit override — skips all routing matching */
  instanceId?: string;
  /** Request's subfolder ID (UUID) — used for REMOTE root folder detection */
  folderId?: string;
  /** Root folder ID (system constant, e.g. DefaultFolderId.REMOTE) */
  rootFolderId?: string;
  /** Model API provider (e.g. "openai", "anthropic") — used for provider-based routing */
  modelProvider?: string;
  locale: CountryLanguage;
  logger: EndpointLogger;
}

export interface ResolveInferenceProviderParams {
  userId: string;
  /** Model API provider (e.g. "openai", "anthropic") — used for inference provider routing */
  modelProvider?: string;
  logger: EndpointLogger;
}

// ─── RemoteTransport ──────────────────────────────────────────────────────────

export class RemoteTransport {
  /**
   * Resolve the remote target for a request. Returns null if no target matches
   * (caller should run locally).
   *
   * Priority (first match wins):
   * 1. explicit instanceId parameter
   * 2. REMOTE root folder — thread under REMOTE/<instanceId> (native, no DB setting)
   * 3. null → run locally
   */
  static async resolveTarget(
    params: ResolveTargetParams,
  ): Promise<RemoteTarget | null> {
    const { userId, instanceId, folderId, rootFolderId, logger } = params;

    const rows = await db
      .select()
      .from(remoteConnections)
      .where(
        and(
          eq(remoteConnections.userId, userId),
          eq(remoteConnections.isActive, true),
          eq(remoteConnections.isReverseEntry, false),
        ),
      )
      // Deterministic pick when multiple rows match a routing step
      .orderBy(desc(remoteConnections.updatedAt));

    const activeRows = rows.filter((r) => r.token);

    if (activeRows.length === 0) {
      return null;
    }

    const toTarget = (
      row: (typeof activeRows)[number],
      useRemoteContext = false,
    ): RemoteTarget => ({
      instanceId: row.instanceId,
      remoteInstanceId: row.remoteInstanceId ?? null,
      remoteUrl: row.remoteUrl,
      token: RemoteConnectionRepository.decryptToken(row.token),
      leadId: row.leadId,
      transportMode: row.transportMode as TransportMode,
      useRemoteContext,
    });

    // 1. Explicit instanceId override
    if (instanceId) {
      const match = activeRows.find((r) => r.instanceId === instanceId);
      if (match) {
        logger.debug("[Transport] resolved target via explicit instanceId", {
          instanceId,
        });
        return toTarget(match);
      }
      logger.warn("[Transport] explicit instanceId not found or inactive", {
        instanceId,
        userId,
      });
      return null;
    }

    // 2. REMOTE root folder — native routing, no rules needed. A thread in
    //    REMOTE → <instanceId> (at any nesting depth, e.g. tests/<case>) runs
    //    on that instance by default; events mirror back per threadMirrorMode.
    if (rootFolderId === DefaultFolderId.REMOTE && folderId) {
      let cursor: string | null = folderId;
      let topName: string | null = null;
      for (let depth = 0; cursor !== null && depth < 10; depth++) {
        const [folder] = await db
          .select({ name: chatFolders.name, parentId: chatFolders.parentId })
          .from(chatFolders)
          .where(eq(chatFolders.id, cursor))
          .limit(1);
        if (!folder) {
          break;
        }
        topName = folder.name;
        cursor = folder.parentId;
      }
      const match = topName
        ? activeRows.find((r) => r.instanceId === topName)
        : undefined;
      if (match) {
        logger.debug("[Transport] resolved target via REMOTE instance folder", {
          instanceId: match.instanceId,
          folderId,
        });
        // REMOTE-folder threads execute fully ON the remote instance: its own
        // system prompt, its own tool belt, tools run there natively. The
        // caller only supplies the user content and mirrors events back.
        return toTarget(match, true);
      }
    }

    return null;
  }

  /**
   * Resolve a ws-provider connection for AI inference routing.
   *
   * Called after resolveTarget() returns null. Handles ws-provider-specific rules:
   * 1. forceSystemProvider = true → use regardless (admin override, beats everything)
   * 2. isInferenceProvider = true → use as inference fallback
   *
   * Returns null if no qualifying connection exists.
   */
  static async resolveInferenceProvider(
    params: ResolveInferenceProviderParams,
  ): Promise<RemoteTarget | null> {
    const { userId, logger } = params;

    const rows = await db
      .select()
      .from(remoteConnections)
      .where(
        and(
          eq(remoteConnections.userId, userId),
          eq(remoteConnections.isActive, true),
          eq(remoteConnections.isReverseEntry, false),
        ),
      )
      // Deterministic pick when multiple rows match a routing step
      .orderBy(desc(remoteConnections.updatedAt));

    const activeRows = rows.filter((r) => r.token);

    if (activeRows.length === 0) {
      return null;
    }

    const toTarget = (
      row: (typeof activeRows)[number],
      useRemoteContext = false,
    ): RemoteTarget => ({
      instanceId: row.instanceId,
      remoteInstanceId: row.remoteInstanceId ?? null,
      remoteUrl: row.remoteUrl,
      token: RemoteConnectionRepository.decryptToken(row.token),
      leadId: row.leadId,
      transportMode: row.transportMode as TransportMode,
      useRemoteContext,
    });

    // 1. forceSystemProvider — admin override, routes all streams here
    const forcedMatch = activeRows.find((r) => r.forceSystemProvider);
    if (forcedMatch) {
      logger.debug(
        "[Transport] resolved inference provider via forceSystemProvider",
        { instanceId: forcedMatch.instanceId },
      );
      return toTarget(forcedMatch);
    }

    // 2. isInferenceProvider — use as fallback for AI inference
    const inferenceMatch = activeRows.find((r) => r.isInferenceProvider);
    if (inferenceMatch) {
      logger.debug(
        "[Transport] resolved inference provider via isInferenceProvider",
        { instanceId: inferenceMatch.instanceId },
      );
      return toTarget(inferenceMatch);
    }

    return null;
  }

  /**
   * Returns { hasSystem, forceSystem } for all active non-reverse connections.
   * hasSystem — any connection has isInferenceProvider or forceSystemProvider.
   * forceSystem — any connection has forceSystemProvider (overrides all user model choices).
   * Instance-global cache with 30s TTL — invalidated on connection mutations.
   * Use invalidateUnbottledCache() after any connection create/update/delete.
   */
  static async getInstanceInferenceState(): Promise<{
    hasSystem: boolean;
    forceSystem: boolean;
  }> {
    const now = Date.now();
    if (_unbottledCache !== null && now < _unbottledCache.expiresAt) {
      return _unbottledCache.value;
    }
    const rows = await db
      .select({
        forceSystemProvider: remoteConnections.forceSystemProvider,
        isInferenceProvider: remoteConnections.isInferenceProvider,
      })
      .from(remoteConnections)
      .where(
        and(
          eq(remoteConnections.isActive, true),
          eq(remoteConnections.isReverseEntry, false),
        ),
      );
    const value = {
      hasSystem: rows.some(
        (r) => r.forceSystemProvider || r.isInferenceProvider,
      ),
      forceSystem: rows.some((r) => r.forceSystemProvider),
    };
    _unbottledCache = { value, expiresAt: now + 30_000 };
    return value;
  }
}
