/**
 * Remote connection ROUTING — where should a call (or a whole AI loop) run?
 *
 * Resolution order for resolveTarget (first match wins):
 *   1. explicit instanceId
 *   2. loopInstanceId — the stream/thread's explicit loop location
 *   3. null → run locally
 *
 * resolveInferenceProvider handles the ws-provider concerns
 * (forceSystemProvider / isInferenceProvider) — checked by ai-stream's relay
 * branch AFTER resolveTarget returns null.
 */

import "server-only";

import { and, desc, eq } from "drizzle-orm";
import { db } from "next-vibe/database";

import type { TransportMode } from "./db";
import { remoteConnections } from "./db";
import { RemoteConnectionRepository } from "./repository";
import type {
  RemoteConnectionRow,
  RemoteTarget,
  ResolveInferenceProviderParams,
  ResolveTargetParams,
} from "./types";

export class ExecuteToolRouting {
  /**
   * Unbottled availability cache — instance-global: tracks whether any active
   * connection provides inference. Invalidated on connection mutations;
   * refreshes after 30s TTL otherwise.
   */
  private static unbottledCache: {
    value: { hasSystem: boolean; forceSystem: boolean };
    expiresAt: number;
  } | null = null;

  /** Call after any connection create/update/delete. */
  static invalidateUnbottledCache(): void {
    ExecuteToolRouting.unbottledCache = null;
  }

  /**
   * Resolve the remote target for a request. Returns null if no target matches
   * (caller should run locally).
   *
   * Priority (first match wins):
   * 1. explicit instanceId parameter (tool-call routing — local context)
   * 2. loopInstanceId — the stream/thread's explicit loop location (remote
   *    context: the loop, tools and persistence conventions move there)
   * 3. null → run locally
   */
  static async resolveTarget(
    params: ResolveTargetParams,
  ): Promise<RemoteTarget | null> {
    const { userId, instanceId, loopInstanceId, logger } = params;

    const activeRows = await ExecuteToolRouting.loadActiveConnections(userId);
    if (activeRows.length === 0) {
      return null;
    }

    // 1. Explicit instanceId override
    if (instanceId) {
      const match = activeRows.find((r) => r.instanceId === instanceId);
      if (match) {
        logger.debug("[Routing] resolved target via explicit instanceId", {
          instanceId,
        });
        return ExecuteToolRouting.toTarget(match);
      }
      logger.warn("[Routing] explicit instanceId not found or inactive", {
        instanceId,
        userId,
      });
      return null;
    }

    // 2. Explicit loop location. The loop, tools and system prompt move to the
    //    named instance (still client-owned: the caller ships prompt + tool
    //    schemas); the thread's placement stays wherever the user put it —
    //    placement never routes.
    if (loopInstanceId) {
      const match = activeRows.find((r) => r.instanceId === loopInstanceId);
      if (match) {
        logger.debug("[Routing] resolved target via loopInstanceId", {
          loopInstanceId,
        });
        return ExecuteToolRouting.toTarget(match, true);
      }
      logger.warn(
        "[Routing] loopInstanceId not found or inactive — running locally",
        {
          loopInstanceId,
          userId,
        },
      );
      return null;
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

    // Inference-provider routing considers only FORWARD connections — a
    // client's reverse entry on the provider must never route the provider's
    // own streams back down to that client.
    const activeRows = (
      await ExecuteToolRouting.loadActiveConnections(userId)
    ).filter((r) => !r.isReverseEntry);
    if (activeRows.length === 0) {
      return null;
    }

    // 1. forceSystemProvider — admin override, routes all streams here. The
    //    provider is a pure MODEL PIPE: the caller keeps its own system prompt
    //    and tool catalog (useRemoteContext=false), tools round-trip back.
    const forcedMatch = activeRows.find((r) => r.forceSystemProvider);
    if (forcedMatch) {
      logger.debug(
        "[Routing] resolved inference provider via forceSystemProvider",
        {
          instanceId: forcedMatch.instanceId,
        },
      );
      return ExecuteToolRouting.toTarget(forcedMatch);
    }

    // 2. isInferenceProvider — FULL provider: the remote runs the AI loop with
    //    its OWN system prompt and tool catalog (useRemoteContext=true); only
    //    the thread storage stays with the caller.
    const inferenceMatch = activeRows.find((r) => r.isInferenceProvider);
    if (inferenceMatch) {
      logger.debug(
        "[Routing] resolved inference provider via isInferenceProvider",
        {
          instanceId: inferenceMatch.instanceId,
        },
      );
      return ExecuteToolRouting.toTarget(inferenceMatch, true);
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
    const cached = ExecuteToolRouting.unbottledCache;
    if (cached !== null && now < cached.expiresAt) {
      return cached.value;
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
    ExecuteToolRouting.unbottledCache = { value, expiresAt: now + 30_000 };
    return value;
  }

  private static async loadActiveConnections(
    userId: string,
  ): Promise<RemoteConnectionRow[]> {
    const rows = await db
      .select()
      .from(remoteConnections)
      .where(
        and(
          eq(remoteConnections.userId, userId),
          eq(remoteConnections.isActive, true),
        ),
      )
      // Deterministic pick when multiple rows match a routing step
      .orderBy(desc(remoteConnections.updatedAt));
    // REVERSE entries (the peer connected TO us) are routable too — that is how
    // the serving side originates work on a client (loop-on-client relays via
    // REMOTE/<clientId> folders). They qualify when a leg exists: a token+URL
    // for direct-http, or a reverse-ws transport riding the peer's standing
    // connector socket (no token needed — hub emit by remoteUserId).
    return rows.filter(
      (r) => r.token || (r.isReverseEntry && r.transportMode === "reverse-ws"),
    );
  }

  private static toTarget(
    row: RemoteConnectionRow,
    useRemoteContext = false,
  ): RemoteTarget {
    return {
      instanceId: row.instanceId,
      remoteUrl: row.remoteUrl,
      token: RemoteConnectionRepository.decryptToken(row.token),
      leadId: row.leadId,
      transportMode: row.transportMode as TransportMode,
      useRemoteContext,
      isReverseEntry: row.isReverseEntry,
    };
  }
}
