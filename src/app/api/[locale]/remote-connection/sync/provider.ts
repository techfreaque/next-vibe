import "server-only";

/**
 * Unified Sync Provider Framework
 *
 * Any data type (memories, documents, skills, favorites, threads) joins the
 * cross-instance sync protocol by implementing the SyncProvider interface
 * and registering with `registerSyncProvider()`.
 *
 * The framework handles:
 *  - Per-provider cursor tracking (high-water mark)
 *  - Cursor-first protocol: local sends cursors → remote returns only newer records
 *  - Orchestrating serialize/upsert across all providers
 */
import type { EndpointLogger } from "next-vibe/logger/types";

import type { StandardSyncCursor, SyncCursor, ThreadsSyncCursor } from "../db";

// ─── Interface ───────────────────────────────────────────────────────────────

/**
 * Result of serializing one provider's records for a sync exchange.
 *
 * Every record newer than the peer's cursor is served — sync is complete per
 * exchange. `cursor` is derived from the served items, which therefore equals
 * the provider's current high-water mark. The peer stores this cursor and
 * resumes after the served batch on the next exchange.
 */
interface SyncSerializeResult {
  /** JSON array string of the served records (wire format per provider). */
  json: string;
  /** High-water mark of the served items. */
  cursor: SyncCursor;
}

/**
 * Implement this interface to register a data type for cross-instance sync.
 *
 * Each provider:
 *  - Owns its own Zod schemas internally (no type erasure, no `as X`)
 *  - Handles its own DB queries in getCursor / serializeFromCursor / upsertFromJson
 *  - Is responsible for tombstone handling in upsertFromJson
 */
export interface SyncProvider {
  /** Unique key: "memories", "documents", "skills", "favorites", "threads" */
  readonly key: string;

  /**
   * Label key suffix used to look up the provider name in the remote-connection
   * scoped translations: `widget.syncScope.<labelKey>`.
   * Must match a key in `[instanceId]/i18n/en/index.ts` → `widget.syncScope`.
   */
  readonly labelKey: string;

  /**
   * Maps this provider to a sync.domain declared on event definitions.
   * When set, live events with matching sync.domain are relayed when this
   * provider's key is enabled in the connection's syncScope.
   * Pull-only providers (those without live events) may omit this.
   */
  readonly domain?: string;

  /** Return the current local high-water mark for this domain. */
  getCursor(userId: string): Promise<SyncCursor>;

  /**
   * Serialize ALL records newer than cursor as a JSON string. Pass null to
   * start a full sync from the beginning.
   *
   * Returns the payload together with the cursor derived from the served
   * items (see SyncSerializeResult).
   */
  serializeFromCursor(
    userId: string,
    cursor: SyncCursor | null,
    logger: EndpointLogger,
  ): Promise<SyncSerializeResult>;

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

// ─── Cursor Narrowing ────────────────────────────────────────────────────────

/**
 * Narrow a SyncCursor union to the standard `{ updatedAt }` shape.
 * Returns null for null input or a threads-shaped cursor.
 */
export function toStandardCursor(
  cursor: SyncCursor | null,
): StandardSyncCursor | null {
  return cursor !== null && "updatedAt" in cursor ? cursor : null;
}

/**
 * Narrow a SyncCursor union to the threads `{ threadsCursor, messageCursors }`
 * shape. Returns null for null input or a standard-shaped cursor.
 */
export function toThreadsCursor(
  cursor: SyncCursor | null,
): ThreadsSyncCursor | null {
  return cursor !== null && "threadsCursor" in cursor ? cursor : null;
}

// ─── Cursor Framework ─────────────────────────────────────────────────────────

/**
 * Collect current cursors for all registered providers.
 */
export async function collectCursors(
  userId: string,
): Promise<Record<string, SyncCursor>> {
  await ensureProvidersRegistered();

  const cursors: Record<string, SyncCursor> = {};
  for (const [key, provider] of providers) {
    try {
      cursors[key] = await provider.getCursor(userId);
    } catch {
      // Skip providers that fail to return a cursor
    }
  }
  return cursors;
}

/**
 * Build sync payloads from incoming cursors.
 * For each provider where a cursor is supplied, serialize records newer than that cursor.
 * For providers not in incomingCursors, serialize all records (null cursor = full sync).
 *
 * Returns payloads + the cursors to send back. Each payload contains every
 * record newer than the supplied cursor; the returned cursor is derived from
 * the served items and equals the provider's current high-water mark.
 */
export async function buildSyncPayloads(
  incomingCursors: Record<string, SyncCursor | string>,
  userId: string,
  logger: EndpointLogger,
): Promise<{
  syncPayloads: Record<string, string>;
  syncCounts: Record<string, number>;
  ourCursors: Record<string, SyncCursor>;
}> {
  await ensureProvidersRegistered();

  const syncPayloads: Record<string, string> = {};
  const syncCounts: Record<string, number> = {};
  const ourCursors: Record<string, SyncCursor> = {};

  for (const [key, provider] of providers) {
    try {
      const raw = incomingCursors[key] ?? null;
      const theirCursor: SyncCursor | null =
        typeof raw === "string" ? null : raw;
      const { json, cursor } = await provider.serializeFromCursor(
        userId,
        theirCursor,
        logger,
      );
      syncPayloads[key] = json;
      syncCounts[key] = countJsonArrayItems(json);
      ourCursors[key] = cursor;
    } catch (error) {
      logger.error(`Sync provider "${key}" serialize failed`, {
        error: String(error),
      });
    }
  }

  return { syncPayloads, syncCounts, ourCursors };
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
    const [cortexModule, skillsModule, favoritesModule, threadsModule] =
      await Promise.all([
        import("@/app/api/[locale]/agent/cortex/sync-provider"),
        import("@/app/api/[locale]/agent/skills/sync-provider"),
        import("@/app/api/[locale]/agent/skills/favorites/sync-provider"),
        import("@/app/api/[locale]/agent/chat/threads/sync-provider"),
      ]);

    registerSyncProvider(cortexModule.documentsSyncProvider);
    registerSyncProvider(cortexModule.memoriesSyncProvider);
    registerSyncProvider(skillsModule.skillsSyncProvider);
    registerSyncProvider(favoritesModule.favoritesSyncProvider);
    registerSyncProvider(threadsModule.threadsSyncProvider);
    registered = true;
  })().catch((): void => {
    // A rejected registration must NOT be cached — that would permanently
    // block all future syncs in this process. Clear so the next sync call
    // retries the imports (sync/spec.md → SyncProvider Interface). The
    // degraded state surfaces downstream as "provider not found" log lines.
    registrationPromise = null;
  });

  return registrationPromise;
}
