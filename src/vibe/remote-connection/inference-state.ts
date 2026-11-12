/**
 * Instance-wide inference state — does any active connection provide inference?
 *
 * Deliberately lean (db + table schema only). The root layout reads this on
 * every page render via getEnvAvailability(); importing the full routing module
 * there dragged repository → sync → execute-tool → the generated endpoint
 * registry into the RSC graph, and webpack then bundled every endpoint widget
 * (~12 MB) into the client entry of every public page.
 */

import "server-only";

import { and, eq } from "drizzle-orm";

import { db } from "../database";
import { remoteConnections } from "./db";

export interface InstanceInferenceState {
  hasSystem: boolean;
  forceSystem: boolean;
}

/**
 * Instance-global cache: invalidated on connection mutations, refreshes after
 * a 30s TTL otherwise.
 */
let inferenceStateCache: {
  value: InstanceInferenceState;
  expiresAt: number;
} | null = null;

/** Call after any connection create/update/delete. */
export function invalidateInstanceInferenceState(): void {
  inferenceStateCache = null;
}

/**
 * Returns { hasSystem, forceSystem } for all active non-reverse connections.
 * hasSystem — any connection has isInferenceProvider or forceSystemProvider.
 * forceSystem — any connection has forceSystemProvider (overrides all user model choices).
 */
export async function getInstanceInferenceState(): Promise<InstanceInferenceState> {
  const now = Date.now();
  const cached = inferenceStateCache;
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
  const value: InstanceInferenceState = {
    hasSystem: rows.some((r) => r.forceSystemProvider || r.isInferenceProvider),
    forceSystem: rows.some((r) => r.forceSystemProvider),
  };
  inferenceStateCache = { value, expiresAt: now + 30_000 };
  return value;
}
