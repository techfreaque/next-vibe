import "server-only";

/**
 * Unified Sync Provider Framework
 *
 * Any data type (memories, documents, skills, threads, ...) can join the
 * cross-instance sync protocol by implementing the SyncProvider interface
 * and registering with `registerSyncProvider()`.
 *
 * The framework handles:
 *  - Per-provider SHA256 hash computation
 *  - Root hash for fast "nothing changed" short-circuit
 *  - Diffing incoming hashes against local state
 *  - Orchestrating serialize/upsert across all providers
 */

import { createHash } from "node:crypto";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

// ─── Interface ───────────────────────────────────────────────────────────────

export interface SyncHashEntry {
  syncId: string;
  updatedAt: Date;
}

/**
 * Implement this interface to register a data type for cross-instance sync.
 *
 * Each provider:
 *  - Owns its own Zod schemas internally (no type erasure, no `as X`)
 *  - Handles its own DB queries in getHashEntries / serializeToJson / upsertFromJson
 *  - Is responsible for disk write-through in upsertFromJson (via fs-sync helpers)
 *  - Is responsible for tombstone handling in upsertFromJson
 */
export interface SyncProvider {
  /** Unique key: "memories", "documents", "skills", "threads", ... */
  readonly key: string;

  /** Return {syncId, updatedAt} pairs - framework computes SHA256 hash from these */
  getHashEntries(userId: string): Promise<SyncHashEntry[]>;

  /** Serialize all syncable items as JSON string. Only called when hash differs. */
  serializeToJson(userId: string, logger: EndpointLogger): Promise<string>;

  /** Parse JSON + upsert into native table. Returns count of items synced. */
  upsertFromJson(
    json: string,
    userId: string,
    logger: EndpointLogger,
  ): Promise<number>;
}

// ─── Registry ────────────────────────────────────────────────────────────────

const providers = new Map<string, SyncProvider>();
let registered = false;

export function registerSyncProvider(provider: SyncProvider): void {
  providers.set(provider.key, provider);
}

export function getSyncProviders(): ReadonlyMap<string, SyncProvider> {
  return providers;
}

// ─── Hash Engine ─────────────────────────────────────────────────────────────

/**
 * Compute SHA256 of sorted "syncId:updatedAt" pairs for a single provider.
 * Returns empty string hash for empty entry lists.
 */
export function computeProviderHash(entries: SyncHashEntry[]): string {
  if (entries.length === 0) {
    return createHash("sha256").update("").digest("hex");
  }
  const sorted = entries
    .map((e) => `${e.syncId}:${e.updatedAt.toISOString()}`)
    .toSorted();
  return createHash("sha256").update(sorted.join(",")).digest("hex");
}

/**
 * Compute per-provider hashes + combined root hash for all registered providers.
 */
export async function computeSyncHashes(userId: string): Promise<{
  perProvider: Record<string, string>;
  rootHash: string;
}> {
  await ensureProvidersRegistered();

  const perProvider: Record<string, string> = {};
  const hashParts: string[] = [];

  for (const [key, provider] of providers) {
    const entries = await provider.getHashEntries(userId);
    const hash = computeProviderHash(entries);
    perProvider[key] = hash;
    hashParts.push(`${key}:${hash}`);
  }

  const rootHash = createHash("sha256")
    .update(hashParts.toSorted().join("|"))
    .digest("hex");

  return { perProvider, rootHash };
}

// ─── Orchestration ───────────────────────────────────────────────────────────

/**
 * Diff incoming hashes against our local state.
 * For each provider where the hash differs, serialize its data.
 * Returns the response payload for the sync endpoint.
 */
export async function buildSyncPayloads(
  incomingHashes: Record<string, string>,
  userId: string,
  logger: EndpointLogger,
): Promise<{
  remoteSyncHashes: Record<string, string>;
  syncPayloads: Record<string, string>;
  syncCounts: Record<string, number>;
}> {
  const { perProvider: ourHashes } = await computeSyncHashes(userId);
  const syncPayloads: Record<string, string> = {};
  const syncCounts: Record<string, number> = {};

  for (const [key, provider] of providers) {
    const theirHash = incomingHashes[key] ?? "";
    const ourHash = ourHashes[key] ?? "";

    if (theirHash !== ourHash) {
      try {
        const json = await provider.serializeToJson(userId, logger);
        syncPayloads[key] = json;
        // Count items via lightweight bracket scan (avoids re-parsing)
        syncCounts[key] = countJsonArrayItems(json);
      } catch (error) {
        logger.error(`Sync provider "${key}" serialize failed`, {
          error: String(error),
        });
      }
    }
  }

  return { remoteSyncHashes: ourHashes, syncPayloads, syncCounts };
}

/**
 * Apply sync payloads received from a remote instance.
 * Each key in the payloads map is dispatched to the matching provider.
 */
export async function applySyncPayloads(
  payloads: Record<string, string>,
  userId: string,
  logger: EndpointLogger,
): Promise<Record<string, number>> {
  await ensureProvidersRegistered();

  const results: Record<string, number> = {};

  for (const [key, json] of Object.entries(payloads)) {
    const provider = providers.get(key);
    if (!provider) {
      logger.warn(`No sync provider registered for key "${key}"`);
      continue;
    }
    try {
      const synced = await provider.upsertFromJson(json, userId, logger);
      results[key] = synced;
      if (synced > 0) {
        logger.info(`Sync provider "${key}": imported/updated ${synced} items`);
      }
    } catch (error) {
      logger.error(`Sync provider "${key}" upsert failed`, {
        error: String(error),
      });
    }
  }

  return results;
}

/**
 * Count top-level items in a JSON array string without full parsing.
 * Tracks bracket/brace depth so nested objects don't create false positives.
 */
function countJsonArrayItems(json: string): number {
  if (json === "[]") {
    return 0;
  }
  let depth = 0;
  let count = 0;
  let inString = false;
  let escape = false;
  for (let i = 0; i < json.length; i++) {
    const ch = json[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (ch === "\\") {
      escape = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) {
      continue;
    }
    if (ch === "[" || ch === "{") {
      if (depth === 1 && ch === "{") {
        count++;
      }
      depth++;
    } else if (ch === "]" || ch === "}") {
      depth--;
    }
  }
  return count;
}

// ─── Lazy Registration ───────────────────────────────────────────────────────

/**
 * Lazily register all sync providers via dynamic imports.
 * Called before any sync operation. Providers are only imported once.
 */
let registrationPromise: Promise<void> | null = null;

export async function ensureProvidersRegistered(): Promise<void> {
  if (registered) {
    return;
  }
  if (registrationPromise) {
    return registrationPromise;
  }

  registrationPromise = (async (): Promise<void> => {
    const [documentsModule, skillsModule] = await Promise.all([
      import("@/app/api/[locale]/agent/cortex/sync-provider"),
      import("@/app/api/[locale]/agent/chat/skills/sync-provider"),
    ]);

    registerSyncProvider(documentsModule.documentsSyncProvider);
    registerSyncProvider(skillsModule.skillsSyncProvider);
    registered = true;
  })();

  return registrationPromise;
}
