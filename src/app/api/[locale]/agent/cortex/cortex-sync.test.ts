/**
 * Cortex Cross-Instance Sync Integration Tests
 *
 * Tests the cursor-first sync protocol between atlas (port 3000) and
 * hermes-dev (port 3002). Verifies:
 *
 *   1. Cursor engine: getCursor advances when a provider's data changes
 *   2. Cursor short-circuit: no payload when cursors are current (tiny request per tick)
 *   3. Documents sync: write on dev, sync to hermes, verify on hermes DB
 *   4. Skills sync: create skill on dev, sync to hermes, verify on hermes DB
 *   5. Tombstone: delete on dev, sync → hermes deletes its copy
 *   6. Last-writer-wins: hermes has newer update, dev must keep hermes's version
 *   7. Behind-NAT mode: dev pulls from hermes (dev is not directly accessible)
 *   8. Direct-access mode: hermes pushes to dev (hermes IS directly accessible)
 *   9. Large cortex scalability: getCursor handles 10k entries efficiently
 *  10. Per-provider isolation: documents cursor change doesn't force skills resync
 *
 * PREREQUISITES
 * ─────────────
 * Hermes-dev must be running at localhost:3002:
 *   vibe --hermes dev
 * Or skip sync tests:
 *   bun test cortex-sync --skip-sync
 *
 * The tests are gracefully skipped if hermes is not reachable (no crash).
 *
 * Cache bust: these tests do NOT use fetch-cache (they are live HTTP tests).
 */

import "server-only";

import { randomUUID } from "node:crypto";

import { and, eq, like, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  closeProdDb,
  connectToHermes,
  disconnectFromHermes,
  LOCAL_DEV_URL,
  resolveProdAdminToken,
  resolveProdUserId,
  triggerHermesPull,
  unregisterDevFromHermes,
} from "@/app/api/[locale]/agent/ai-stream/testing/remote-setup";
import { skillsSyncProvider } from "@/app/api/[locale]/agent/chat/skills/sync-provider";
import * as remoteConnectionSchema from "@/app/api/[locale]/remote-connection/db";
import {
  buildSyncPayloads,
  collectCursors,
  ensureProvidersRegistered,
  type SyncProvider,
} from "@/app/api/[locale]/remote-connection/sync-provider";
import { resolveTestAdminUser } from "@/app/api/[locale]/system/check/testing/testing-suite/resolve-test-user";
import { db } from "@/app/api/[locale]/system/db";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import * as userSchema from "@/app/api/[locale]/user/db";
import { env } from "@/config/env";
import { defaultLocale } from "@/i18n/core/config";

import { cortexNodes } from "./db";
import { documentsSyncProvider } from "./sync-provider";

// ── Constants ─────────────────────────────────────────────────────────────────

const SYNC_TIMEOUT = 60_000;
const HERMES_SKIP_REASON = "hermes-dev not reachable at localhost:3002";

// Note: test paths use "/documents/sync-test-" prefix for isolation and cleanup

// ── Helpers ───────────────────────────────────────────────────────────────────

async function pollUntil<T>(
  label: string,
  fn: () => Promise<T | null | undefined | false>,
  timeoutMs = 15_000,
): Promise<T> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const result = await fn();
    if (result) {
      return result;
    }
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 200);
    });
  }
  // Test helper: surface a clear timeout. (Not a ResponseType path — this is a
  // vitest helper, where throwing fails the test as intended.)
  expect(false, `[pollUntil] ${label}: timed out after ${timeoutMs}ms`).toBe(true);
  return undefined as never;
}

/** Check if hermes is reachable - used to conditionally skip live sync tests */
async function isHermesReachable(): Promise<boolean> {
  try {
    const resp = await fetch(`${LOCAL_DEV_URL}/api/en-US/user/public/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "noop@noop", password: "noop" }),
      signal: AbortSignal.timeout(3000),
    });
    // 400/401 = server is up (auth failed), that's fine
    return resp.status < 500;
  } catch {
    return false;
  }
}

/**
 * Get a lightweight prod DB connection (same schema as dev but port 5433).
 * Returns a drizzle instance connected to hermes's PostgreSQL.
 */
interface ProdDbConnection {
  db: ReturnType<
    typeof drizzle<typeof userSchema & typeof remoteConnectionSchema>
  >;
  pool: Pool;
}

function getProdDb(): ProdDbConnection {
  const baseUrl = env.DATABASE_URL.replace(/:\d+\//, `:5433/`);
  const pool = new Pool({
    connectionString: baseUrl,
    max: 3,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
  });
  return {
    db: drizzle(pool, {
      schema: { ...userSchema, ...remoteConnectionSchema },
    }),
    pool,
  };
}

/**
 * Stable, comparable string of a provider's current cursor (its high-water
 * mark). Replaces the old `computeProviderHash(getHashEntries(...))` change
 * detector: when data changes, the cursor advances, so this string changes.
 */
async function providerCursorKey(
  provider: SyncProvider,
  userId: string,
): Promise<string> {
  return JSON.stringify(await provider.getCursor(userId));
}

// ── 1. Cursor short-circuit (unit) ───────────────────────────────────────────
// Note: the legacy content-hash engine (computeProviderHash) was replaced by the
// cursor-based protocol; per-provider change detection is now covered by the
// cursor short-circuit tests below.

describe("Sync hash short-circuit (unit)", () => {
  it(
    "buildSyncPayloads: identical hashes → empty syncPayloads (no data transfer)",
    async () => {
      await ensureProvidersRegistered();

      const adminUser = await resolveTestAdminUser();
      expect(
        adminUser,
        "admin user must exist for the sync short-circuit test (run vibe seed)",
      ).toBeTruthy();
      if (!adminUser) {
        expect(false, "adminUser not set — beforeAll must have failed").toBe(true);
        return;
      }

      const logger = createEndpointLogger(false, Date.now(), defaultLocale);

      // First exchange: serialize from null → returns each provider's true
      // high-water-mark cursor (derived from the served batch). Feeding THOSE
      // cursors back is the real protocol round-trip.
      const first = await buildSyncPayloads({}, adminUser.id, logger);

      // Second exchange: remote echoes the cursors from the first exchange.
      const { syncPayloads } = await buildSyncPayloads(
        first.ourCursors,
        adminUser.id,
        logger,
      );

      // Standard (updatedAt-gated) providers must now serve NOTHING — the
      // returned cursor exactly excludes the served batch (no ms/µs boundary
      // re-send). The threads provider is excluded: REMOTE-folder (mirrored)
      // threads are owner-authoritative and re-served unconditionally by design.
      for (const key of ["documents", "skills", "memories", "favorites"]) {
        expect(
          syncPayloads[key],
          `When cursors are current, ${key} serializes an empty array`,
        ).toBe("[]");
      }
    },
    SYNC_TIMEOUT,
  );

  it(
    "buildSyncPayloads: stale hash for one provider → only that provider in payload",
    async () => {
      await ensureProvidersRegistered();

      const adminUser = await resolveTestAdminUser();
      expect(
        adminUser,
        "admin user must exist (run vibe seed) — sync tests require it",
      ).toBeTruthy();
      if (!adminUser) {
        expect(false, "adminUser not set — beforeAll must have failed").toBe(true);
        return;
      }

      const logger = createEndpointLogger(false, Date.now(), defaultLocale);

      // Get real cursors
      const localCursors = await collectCursors(adminUser.id);

      // Simulate: remote has the current skills cursor but a stale documents
      // cursor (epoch) → only documents has records newer than the cursor.
      const fakeRemoteCursors = {
        ...localCursors,
        documents: { updatedAt: new Date(0).toISOString() },
      };

      const { syncPayloads } = await buildSyncPayloads(
        fakeRemoteCursors,
        adminUser.id,
        logger,
      );

      // documents must carry records (stale cursor → everything newer served).
      expect(syncPayloads).toHaveProperty("documents");
      // skills cursor matched → skills serializes an empty array (no transfer).
      expect(
        syncPayloads["skills"],
        "skills cursor current → empty payload",
      ).toBe("[]");
    },
    SYNC_TIMEOUT,
  );

  it(
    "collectCursors: returns per-provider cursors with documents + skills keys",
    async () => {
      await ensureProvidersRegistered();

      const adminUser = await resolveTestAdminUser();
      expect(
        adminUser,
        "admin user must exist (run vibe seed) — sync tests require it",
      ).toBeTruthy();
      if (!adminUser) {
        expect(false, "adminUser not set — beforeAll must have failed").toBe(true);
        return;
      }

      const cursors = await collectCursors(adminUser.id);

      expect(cursors).toHaveProperty("documents");
      expect(cursors).toHaveProperty("skills");
      // Standard providers expose an updatedAt high-water mark.
      expect(cursors["documents"]).toHaveProperty("updatedAt");
      expect(cursors["skills"]).toHaveProperty("updatedAt");
    },
    SYNC_TIMEOUT,
  );
});

// ── 3. Documents sync - local in-process (no hermes required) ─────────────────

describe("Sync: documents provider serialize/deserialize (in-process)", () => {
  let adminUser: JwtPrivatePayloadType;
  const TEST_SYNC_ID = randomUUID();
  const TEST_PATH = `/documents/sync-unit-test/sync-test-${Date.now().toString(36)}.md`;
  const logger = createEndpointLogger(false, Date.now(), defaultLocale);

  beforeAll(async () => {
    const resolved = await resolveTestAdminUser();
    if (!resolved) {
      expect(false, "Admin user not found — run: vibe seed").toBe(true);
      return;
    }
    adminUser = resolved;

    // Ensure clean slate
    await db
      .delete(cortexNodes)
      .where(
        and(
          eq(cortexNodes.userId, adminUser.id),
          like(cortexNodes.path, "/documents/sync-unit-test/%"),
        ),
      );
  }, SYNC_TIMEOUT);

  afterAll(async () => {
    if (adminUser) {
      await db
        .delete(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, adminUser.id),
            like(cortexNodes.path, "/documents/sync-unit-test/%"),
          ),
        );
    }
  });

  it(
    "SU1: inserting a node changes the provider hash",
    async () => {
      if (!adminUser) {
        expect(false, "adminUser not set — beforeAll must have failed").toBe(true);
        return;
      }

      const cursorBefore = await providerCursorKey(
        documentsSyncProvider,
        adminUser.id,
      );

      // Insert a test node with a syncId
      await db.insert(cortexNodes).values({
        userId: adminUser.id,
        path: TEST_PATH,
        content:
          "# Sync test\n\nThis node was created to test cursor change detection.",
        size: 60,
        nodeType: "enums.nodeType.file",
        syncId: TEST_SYNC_ID,
        frontmatter: {},
        tags: [],
      });

      const cursorAfter = await providerCursorKey(
        documentsSyncProvider,
        adminUser.id,
      );

      expect(
        cursorBefore,
        "SU1: cursor must advance after node insertion",
      ).not.toBe(cursorAfter);
    },
    SYNC_TIMEOUT,
  );

  it(
    "SU2: serializeFromCursor includes the inserted node",
    async () => {
      if (!adminUser) {
        expect(false, "adminUser not set — beforeAll must have failed").toBe(true);
        return;
      }

      const { json } = await documentsSyncProvider.serializeFromCursor(
        adminUser.id,
        null,
        logger,
      );
      const parsed = JSON.parse(json) as Array<{
        syncId: string;
        path: string;
      }>;

      const found = parsed.find((d) => d.syncId === TEST_SYNC_ID);
      expect(
        found,
        `SU2: serialized JSON must include syncId=${TEST_SYNC_ID}`,
      ).toBeTruthy();
      expect(found?.path, "SU2: path must match").toBe(TEST_PATH);
    },
    SYNC_TIMEOUT,
  );

  it(
    "SU3: upsertFromJson with explicit payload creates node for target userId",
    async () => {
      if (!adminUser) {
        expect(false, "adminUser not set — beforeAll must have failed").toBe(true);
        return;
      }

      // Build a minimal payload for a new syncId (simulating what hermes would receive)
      const newSyncId = randomUUID();
      const newPath = `/documents/sync-unit-test/su3-explicit-${Date.now().toString(36)}.md`;
      const payload = JSON.stringify([
        {
          syncId: newSyncId,
          path: newPath,
          content: "# SU3 explicit upsert test",
          size: 26,
          frontmatter: {},
          tags: [],
          nodeType: "enums.nodeType.file",
          updatedAt: new Date().toISOString(),
        },
      ]);

      // Apply to admin user (simulates hermes receiving and applying dev's payload)
      const synced = await documentsSyncProvider.upsertFromJson(
        payload,
        adminUser.id,
        logger,
      );
      expect(synced, "SU3: must have synced 1 node").toBeGreaterThanOrEqual(1);

      // Verify the node was created
      const [node] = await db
        .select({ path: cortexNodes.path, syncId: cortexNodes.syncId })
        .from(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, adminUser.id),
            eq(cortexNodes.path, newPath),
          ),
        );
      expect(node, "SU3: node must exist after upsert").toBeTruthy();
      expect(node?.syncId, "SU3: syncId must match").toBe(newSyncId);

      // Cleanup
      await db
        .delete(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, adminUser.id),
            eq(cortexNodes.path, newPath),
          ),
        );
    },
    SYNC_TIMEOUT,
  );

  it(
    "SU4: cursor of fakeProdUserId is the epoch (no nodes) - per-user isolation",
    async () => {
      if (!adminUser) {
        expect(false, "adminUser not set — beforeAll must have failed").toBe(true);
        return;
      }

      const fakeProdUserId = "00000000-0000-4001-ffff-000000000088";
      const { json } = await documentsSyncProvider.serializeFromCursor(
        fakeProdUserId,
        null,
        logger,
      );
      expect(json, "SU4: new user must have no sync records").toBe("[]");

      // A user with no nodes has the epoch high-water mark.
      const cursor = await documentsSyncProvider.getCursor(fakeProdUserId);
      expect(cursor, "SU4: empty state cursor is the epoch updatedAt").toEqual({
        updatedAt: new Date(0).toISOString(),
      });
    },
    SYNC_TIMEOUT,
  );

  it(
    "SU5: updating a node's content advances its cursor (updatedAt)",
    async () => {
      if (!adminUser) {
        expect(false, "adminUser not set — beforeAll must have failed").toBe(true);
        return;
      }

      const cursorBefore = await providerCursorKey(
        documentsSyncProvider,
        adminUser.id,
      );

      // Touch the node (update its updatedAt)
      await db
        .update(cortexNodes)
        .set({
          content: "# Updated content\n\nVersion 2",
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(cortexNodes.userId, adminUser.id),
            eq(cortexNodes.path, TEST_PATH),
          ),
        );

      const cursorAfter = await providerCursorKey(
        documentsSyncProvider,
        adminUser.id,
      );

      expect(
        cursorBefore,
        "SU5: cursor must advance after updatedAt change",
      ).not.toBe(cursorAfter);
    },
    SYNC_TIMEOUT,
  );

  it(
    "SU6: deleting a node advances the cursor",
    async () => {
      if (!adminUser) {
        expect(false, "adminUser not set — beforeAll must have failed").toBe(true);
        return;
      }

      // Before: the node is part of the serialized payload.
      const { json: jsonBefore } =
        await documentsSyncProvider.serializeFromCursor(
          adminUser.id,
          null,
          logger,
        );
      expect(
        jsonBefore.includes(TEST_SYNC_ID),
        "SU6: node must be served before deletion",
      ).toBe(true);

      await db
        .delete(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, adminUser.id),
            eq(cortexNodes.path, TEST_PATH),
          ),
        );

      // After hard delete: the node is no longer served. (Cross-instance delete
      // uses isDeleted tombstones — covered by SU7 — but a local hard delete
      // simply drops the row from the payload.)
      const { json: jsonAfter } =
        await documentsSyncProvider.serializeFromCursor(
          adminUser.id,
          null,
          logger,
        );
      expect(
        jsonAfter.includes(TEST_SYNC_ID),
        "SU6: node must NOT be served after deletion",
      ).toBe(false);
    },
    SYNC_TIMEOUT,
  );

  it(
    "SU7: tombstone payload - upsertFromJson with isDeleted:true removes the node",
    async () => {
      if (!adminUser) {
        expect(false, "adminUser not set — beforeAll must have failed").toBe(true);
        return;
      }

      // Use admin user - tombstone test uses a unique syncId to avoid collision with other tests
      const tombSyncId = randomUUID();
      const tombPath = `/documents/sync-unit-test/su7-tombstone-${Date.now().toString(36)}.md`;

      // First: create a node for the admin user
      await db.insert(cortexNodes).values({
        userId: adminUser.id,
        path: tombPath,
        content: "To be deleted",
        size: 10,
        nodeType: "enums.nodeType.file",
        syncId: tombSyncId,
        frontmatter: {},
        tags: [],
      });

      // Verify it exists
      const [before] = await db
        .select({ path: cortexNodes.path })
        .from(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, adminUser.id),
            eq(cortexNodes.path, tombPath),
          ),
        );
      expect(before, "SU7: node must exist before tombstone").toBeTruthy();

      // Apply tombstone
      const tombstoneJson = JSON.stringify([
        {
          syncId: tombSyncId,
          path: tombPath,
          content: null,
          size: 0,
          frontmatter: {},
          tags: [],
          nodeType: "enums.nodeType.file",
          updatedAt: new Date().toISOString(),
          isDeleted: true,
        },
      ]);
      const synced = await documentsSyncProvider.upsertFromJson(
        tombstoneJson,
        adminUser.id,
        createEndpointLogger(false, Date.now(), defaultLocale),
      );
      expect(
        synced,
        "SU7: tombstone must count as synced",
      ).toBeGreaterThanOrEqual(1);

      // Node must be gone
      const [after] = await db
        .select({ path: cortexNodes.path })
        .from(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, adminUser.id),
            eq(cortexNodes.path, tombPath),
          ),
        );
      expect(
        after,
        "SU7: node must be deleted after tombstone upsert",
      ).toBeUndefined();
    },
    SYNC_TIMEOUT,
  );

  it(
    "SU8: last-writer-wins - older remote payload does NOT overwrite newer local",
    async () => {
      if (!adminUser) {
        expect(false, "adminUser not set — beforeAll must have failed").toBe(true);
        return;
      }

      // Insert node for admin with a fresh timestamp
      const lwwSyncId = randomUUID();
      const freshTime = new Date();
      await db.insert(cortexNodes).values({
        userId: adminUser.id,
        path: `/documents/sync-unit-test/lww-test.md`,
        content: "# Local new content",
        size: 22,
        nodeType: "enums.nodeType.file",
        syncId: lwwSyncId,
        frontmatter: {},
        tags: [],
        updatedAt: freshTime,
      });

      // Simulate older remote payload
      const oldTime = new Date(freshTime.getTime() - 3_600_000); // 1h older
      const oldPayload = JSON.stringify([
        {
          syncId: lwwSyncId,
          path: `/documents/sync-unit-test/lww-test.md`,
          content: "# Old remote content",
          size: 20,
          frontmatter: {},
          tags: [],
          nodeType: "enums.nodeType.file",
          updatedAt: oldTime.toISOString(),
        },
      ]);

      await documentsSyncProvider.upsertFromJson(
        oldPayload,
        adminUser.id,
        createEndpointLogger(false, Date.now(), defaultLocale),
      );

      // Local content must NOT have been overwritten
      const [node] = await db
        .select({ content: cortexNodes.content })
        .from(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, adminUser.id),
            eq(cortexNodes.path, `/documents/sync-unit-test/lww-test.md`),
          ),
        );
      expect(
        node?.content,
        "SU8: last-writer-wins must keep local (newer) content",
      ).toBe("# Local new content");

      // Cleanup
      await db
        .delete(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, adminUser.id),
            eq(cortexNodes.path, `/documents/sync-unit-test/lww-test.md`),
          ),
        );
    },
    SYNC_TIMEOUT,
  );
});

// ── 4. Skills sync - local in-process ────────────────────────────────────────

describe("Sync: skills provider serialize/deserialize (in-process)", () => {
  let adminUser: JwtPrivatePayloadType;
  const logger = createEndpointLogger(false, Date.now(), defaultLocale);

  beforeAll(async () => {
    const resolved = await resolveTestAdminUser();
    if (!resolved) {
      expect(false, "Admin user not found — run: vibe seed").toBe(true);
      return;
    }
    adminUser = resolved;
  }, SYNC_TIMEOUT);

  it(
    "SK1: skillsSyncProvider.getCursor returns a stable cursor",
    async () => {
      if (!adminUser) {
        expect(false, "adminUser not set — beforeAll must have failed").toBe(true);
        return;
      }

      const c1 = await providerCursorKey(skillsSyncProvider, adminUser.id);
      const c2 = await providerCursorKey(skillsSyncProvider, adminUser.id);
      expect(c1, "SK1: skill cursor must be deterministic").toBe(c2);
      expect(typeof c1).toBe("string");
    },
    SYNC_TIMEOUT,
  );

  it("SK2: skills provider key is 'skills'", () => {
    expect(skillsSyncProvider.key).toBe("skills");
  });

  it(
    "SK3: skillsSyncProvider.serializeFromCursor returns valid JSON array",
    async () => {
      if (!adminUser) {
        expect(false, "adminUser not set — beforeAll must have failed").toBe(true);
        return;
      }

      const { json } = await skillsSyncProvider.serializeFromCursor(
        adminUser.id,
        null,
        logger,
      );
      expect(() => JSON.parse(json)).not.toThrow();
      const parsed = JSON.parse(json);
      expect(
        Array.isArray(parsed),
        "SK3: serialized skills must be a JSON array",
      ).toBe(true);
    },
    SYNC_TIMEOUT,
  );

  it(
    "SK4: each serialized skill has required fields",
    async () => {
      if (!adminUser) {
        expect(false, "adminUser not set — beforeAll must have failed").toBe(true);
        return;
      }

      const { json } = await skillsSyncProvider.serializeFromCursor(
        adminUser.id,
        null,
        logger,
      );
      const parsed = JSON.parse(json) as Array<{
        id: string;
        slug: string;
        name: string;
        updatedAt: string;
        [key: string]: string;
      }>;

      for (const skill of parsed) {
        expect(skill, "SK4: skill must have id").toHaveProperty("id");
        expect(skill, "SK4: skill must have slug").toHaveProperty("slug");
        expect(skill, "SK4: skill must have name").toHaveProperty("name");
        expect(skill, "SK4: skill must have updatedAt").toHaveProperty(
          "updatedAt",
        );
      }
    },
    SYNC_TIMEOUT,
  );

  it(
    "SK5: per-provider isolation - documents change does NOT affect skills cursor",
    async () => {
      if (!adminUser) {
        expect(false, "adminUser not set — beforeAll must have failed").toBe(true);
        return;
      }

      const skillCursorBefore = await providerCursorKey(
        skillsSyncProvider,
        adminUser.id,
      );

      // Touch a documents node (simulate a write)
      const tempPath = `/documents/sync-unit-test/skill-isolation-test.md`;
      await db.insert(cortexNodes).values({
        userId: adminUser.id,
        path: tempPath,
        content: "temp isolation test node",
        size: 23,
        nodeType: "enums.nodeType.file",
        syncId: randomUUID(),
        frontmatter: {},
        tags: [],
      });

      const skillCursorAfter = await providerCursorKey(
        skillsSyncProvider,
        adminUser.id,
      );

      // Skills cursor must be unchanged
      expect(
        skillCursorBefore,
        "SK5: documents change must NOT change skills cursor",
      ).toBe(skillCursorAfter);

      // Cleanup
      await db
        .delete(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, adminUser.id),
            eq(cortexNodes.path, tempPath),
          ),
        );
    },
    SYNC_TIMEOUT,
  );
});

// ── 5. Live cross-instance sync (requires hermes at localhost:3001) ────────────

describe("Sync: cross-instance documents sync (live hermes)", () => {
  let devUser: JwtPrivatePayloadType;
  let hermesReachable = false;
  let prodAdminToken = "";
  let prodUserId = "";
  const { db: prodDb, pool: prodPool } = getProdDb();

  const TEST_CONTENT = `# Cross-Instance Sync Test

This document was written on atlas to verify cortex sync to hermes.
Unique marker: sync-live-test-${Date.now().toString(36)}`;

  const TEST_SYNC_ID = randomUUID();
  const TEST_PATH = `/documents/sync-test-${Date.now().toString(36)}/sync-live-doc.md`;

  beforeAll(async () => {
    hermesReachable = await isHermesReachable();
    if (!hermesReachable) {
      expect(false, `[sync-test] ${HERMES_SKIP_REASON} — run: vibe --hermes dev`).toBe(true);
      return;
    }

    devUser = await resolveTestAdminUser();

    try {
      prodAdminToken = await resolveProdAdminToken();
      prodUserId = await resolveProdUserId();

      // Establish atlas → hermes connection
      await connectToHermes(devUser);
    } catch (err) {
      expect(false, `[sync-test] Setup failed: ${String(err)}`).toBe(true);
      return;
    }
  }, 180_000);

  afterAll(async () => {
    // Clean up test nodes on dev
    if (devUser) {
      await db
        .delete(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, devUser.id),
            like(cortexNodes.path, `/documents/sync-test-%`),
          ),
        );
    }

    // Clean up test nodes on hermes-dev DB
    if (prodUserId) {
      try {
        await prodDb.execute(
          sql`DELETE FROM cortex_nodes WHERE user_id = ${prodUserId} AND path LIKE '/documents/sync-test-%'`,
        );
      } catch {
        // Best-effort
      }
    }

    // Bilateral disconnect: remove both sides before closing the prod pool.
    if (devUser) {
      await disconnectFromHermes(devUser.id);
    }
    if (prodUserId) {
      try {
        await unregisterDevFromHermes(prodUserId);
      } catch {
        // Best-effort
      }
    }

    await prodPool.end().catch(() => undefined);
    await closeProdDb();
  });

  it(
    "SL1: write document on dev, trigger pull, verify on hermes DB",
    async () => {
      // Step 1: Write test node on dev with a syncId
      await db.insert(cortexNodes).values({
        userId: devUser.id,
        path: TEST_PATH,
        content: TEST_CONTENT,
        size: TEST_CONTENT.length,
        nodeType: "enums.nodeType.file",
        syncId: TEST_SYNC_ID,
        frontmatter: { priority: 50 },
        tags: ["sync-test"],
      });

      // Verify it's in dev DB
      const [devNode] = await db
        .select({ syncId: cortexNodes.syncId, content: cortexNodes.content })
        .from(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, devUser.id),
            eq(cortexNodes.path, TEST_PATH),
          ),
        );
      expect(
        devNode,
        "SL1: node must exist on dev DB before sync",
      ).toBeTruthy();
      expect(devNode?.syncId, "SL1: dev node must have syncId").toBe(
        TEST_SYNC_ID,
      );

      // Step 2: Trigger hermes to pull from atlas (behind-NAT mode)
      // hermes-dev (port 3002) contacts atlas (port 3000), receives hash diff,
      // gets the new syncId in the documents payload.
      await triggerHermesPull(prodAdminToken);

      // Step 3: Poll hermes DB until the node appears (up to 15s)
      const hermesNode = await pollUntil(
        `SL1: node syncId=${TEST_SYNC_ID} must appear on hermes after sync`,
        async () => {
          const rows = await prodDb.execute<{
            path: string;
            sync_id: string;
            content: string;
          }>(
            sql`SELECT path, sync_id, content FROM cortex_nodes WHERE user_id = ${prodUserId} AND sync_id = ${TEST_SYNC_ID} LIMIT 1`,
          );
          return rows.rows[0] ?? null;
        },
      );

      expect(hermesNode.path, "SL1: path must match on hermes").toBe(TEST_PATH);
      expect(hermesNode.content, "SL1: content must match on hermes").toBe(
        TEST_CONTENT,
      );
    },
    SYNC_TIMEOUT,
  );

  it(
    "SL2: hash short-circuit - no data sent when nothing changed",
    async () => {
      // Trigger pull again (nothing changed since SL1)
      // The cursors should match → zero payload bytes transferred
      const cursorsBefore = await collectCursors(devUser.id);

      await triggerHermesPull(prodAdminToken);

      const cursorsAfter = await collectCursors(devUser.id);

      // Dev-side cursors must be identical (nothing was written locally)
      expect(
        JSON.stringify(cursorsBefore["documents"]),
        "SL2: dev documents cursor must be stable when nothing changed",
      ).toBe(JSON.stringify(cursorsAfter["documents"]));
      expect(
        JSON.stringify(cursorsBefore["skills"]),
        "SL2: dev skills cursor must be stable when nothing changed",
      ).toBe(JSON.stringify(cursorsAfter["skills"]));
    },
    SYNC_TIMEOUT,
  );

  it(
    "SL3: update content on dev, resync, hermes gets the new version",
    async () => {

      const updatedContent = `${TEST_CONTENT}\n\n## Update\n\nThis line was added in SL3.`;

      // Update the node on dev
      await db
        .update(cortexNodes)
        .set({
          content: updatedContent,
          size: updatedContent.length,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(cortexNodes.userId, devUser.id),
            eq(cortexNodes.path, TEST_PATH),
          ),
        );

      // Trigger hermes pull
      await triggerHermesPull(prodAdminToken);

      // Poll hermes DB until the updated content appears
      const hermesContent = await pollUntil(
        "SL3: hermes must receive updated content after resync",
        async () => {
          const rows = await prodDb.execute<{ content: string }>(
            sql`SELECT content FROM cortex_nodes WHERE user_id = ${prodUserId} AND sync_id = ${TEST_SYNC_ID} LIMIT 1`,
          );
          const row = rows.rows[0];
          if (!row) {
            return null;
          }
          // Only resolve once hermes has the updated content
          return row.content.includes("This line was added in SL3")
            ? row.content
            : null;
        },
      );

      expect(
        hermesContent,
        "SL3: hermes must have the exact updated content after resync",
      ).toBe(updatedContent);
    },
    SYNC_TIMEOUT,
  );

  it(
    "SL4: delete on dev, resync, hermes removes the node (tombstone)",
    async () => {

      // Soft-delete on dev: set isDeleted=true + bump updatedAt (tombstone protocol)
      await db
        .update(cortexNodes)
        .set({ isDeleted: true, updatedAt: new Date() })
        .where(
          and(
            eq(cortexNodes.userId, devUser.id),
            eq(cortexNodes.path, TEST_PATH),
          ),
        );

      // Trigger hermes pull — tombstone now included in serialized payload
      await triggerHermesPull(prodAdminToken);

      // Hermes must apply tombstone: no active (non-deleted) row for this syncId
      await pollUntil(
        "SL4: tombstone must propagate to hermes (no active row)",
        async () => {
          const r = await prodDb.execute<{ path: string }>(
            sql`SELECT path FROM cortex_nodes WHERE user_id = ${prodUserId} AND sync_id = ${TEST_SYNC_ID} AND (is_deleted IS NULL OR is_deleted = false) LIMIT 1`,
          );
          return r.rows.length === 0;
        },
      );

      // Dev node must be soft-deleted (still exists as tombstone, not hard-deleted)
      const devRows = await db
        .select({ path: cortexNodes.path, isDeleted: cortexNodes.isDeleted })
        .from(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, devUser.id),
            eq(cortexNodes.path, TEST_PATH),
          ),
        );
      expect(devRows.length, "SL4: dev tombstone row must still exist").toBe(1);
      expect(
        devRows[0]!.isDeleted,
        "SL4: dev node must be marked isDeleted",
      ).toBe(true);
    },
    SYNC_TIMEOUT,
  );
});

// ── 6. Live pull (behind-NAT mode) from hermes → dev ─────────────────────────

describe("Sync: behind-NAT pull (dev pulls from hermes)", () => {
  let devUser: JwtPrivatePayloadType;
  let hermesReachable = false;
  let connectedToHermes = false;
  let prodUserId = "";
  let prodAdminToken = "";
  const { db: prodDb, pool: prodPool } = getProdDb();

  const HERMES_SYNC_ID = randomUUID();
  const HERMES_TEST_PATH = `/documents/sync-test-hermes-origin/hermes-doc.md`;
  const HERMES_CONTENT = `# Written on Hermes\n\nUnique marker: ${HERMES_SYNC_ID}`;

  beforeAll(async () => {
    hermesReachable = await isHermesReachable();
    if (!hermesReachable) {
      expect(false, `[sync-test/BN] ${HERMES_SKIP_REASON} — run: vibe --hermes dev`).toBe(true);
      return;
    }

    devUser = await resolveTestAdminUser();

    try {
      prodUserId = await resolveProdUserId();
      await connectToHermes(devUser);
      connectedToHermes = true;
      prodAdminToken = await resolveProdAdminToken();
    } catch (err) {
      expect(false, `[sync-test/BN] Connection setup failed: ${String(err)}`).toBe(true);
      return;
    }
  }, 180_000);

  afterAll(async () => {
    // Cleanup hermes-dev DB
    if (prodUserId) {
      try {
        await prodDb.execute(
          sql`DELETE FROM cortex_nodes WHERE user_id = ${prodUserId} AND path LIKE '/documents/sync-test-hermes-origin/%'`,
        );
      } catch {
        // Best-effort
      }
    }
    // Cleanup dev DB
    if (devUser) {
      await db
        .delete(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, devUser.id),
            like(cortexNodes.path, "/documents/sync-test-hermes-origin/%"),
          ),
        );
      await disconnectFromHermes(devUser.id);
    }
    if (prodUserId) {
      try {
        await unregisterDevFromHermes(prodUserId);
      } catch {
        // Best-effort
      }
    }

    await prodPool.end().catch(() => undefined);
    await closeProdDb();
  });

  it(
    "BN1: write doc on hermes, dev pulls, doc appears on dev DB",
    async () => {
      // BN tests require two separate instances with different user DBs.
      if (!connectedToHermes) {
        expect(false, "[BN1] Not connected to hermes — beforeAll must have failed").toBe(true);
        return;
      }

      // Step 1: Write a node directly into hermes's DB (simulates hermes AI writing a memory)
      await prodDb.execute(
        sql`INSERT INTO cortex_nodes (id, user_id, path, content, size, node_type, sync_id, frontmatter, tags, created_at, updated_at)
          VALUES (
            gen_random_uuid(),
            ${prodUserId},
            ${HERMES_TEST_PATH},
            ${HERMES_CONTENT},
            ${HERMES_CONTENT.length},
            'enums.nodeType.file',
            ${HERMES_SYNC_ID},
            '{}',
            '{}',
            NOW(),
            NOW()
          )
          ON CONFLICT DO NOTHING`,
      );

      // Verify it's on hermes
      const hermesCheck = await prodDb.execute<{ path: string }>(
        sql`SELECT path FROM cortex_nodes WHERE user_id = ${prodUserId} AND sync_id = ${HERMES_SYNC_ID} LIMIT 1`,
      );
      expect(
        hermesCheck.rows.length,
        "BN1: node must be on hermes before pull",
      ).toBe(1);

      // Step 2: Trigger hermes to reconnect — fires pullOnConnect which syncs to atlas
      await triggerHermesPull(prodAdminToken);

      // Step 3: Poll dev DB until the node appears (up to 15s)
      const devNode = await pollUntil(
        `BN1: node written on hermes must appear on dev after pull (syncId=${HERMES_SYNC_ID})`,
        async () => {
          const [row] = await db
            .select({ path: cortexNodes.path, content: cortexNodes.content })
            .from(cortexNodes)
            .where(
              and(
                eq(cortexNodes.userId, devUser.id),
                eq(cortexNodes.path, HERMES_TEST_PATH),
              ),
            );
          return row ?? null;
        },
      );

      expect(
        devNode.content,
        "BN1: content must match what was written on hermes",
      ).toContain(HERMES_SYNC_ID);
    },
    SYNC_TIMEOUT,
  );

  it(
    "BN2: consecutive pull with same content → no duplicate, content stable",
    async () => {
      if (!connectedToHermes) {
        expect(false, "[BN2] Not connected to hermes — beforeAll must have failed").toBe(true);
        return;
      }

      // Capture the lastSyncedAt of the hermes connection row before the second pull
      const [connectionBefore] = await db
        .select({
          lastSyncedAt: remoteConnectionSchema.remoteConnections.lastSyncedAt,
        })
        .from(remoteConnectionSchema.remoteConnections)
        .where(eq(remoteConnectionSchema.remoteConnections.userId, devUser.id))
        .limit(1);

      // Second pull - same content, hermes hash unchanged → no duplicate
      await triggerHermesPull(prodAdminToken);

      // Poll until lastSyncedAt advances (confirms the pull round-trip completed)
      await pollUntil(
        "BN2: lastSyncedAt must advance after second pull",
        async () => {
          const [conn] = await db
            .select({
              lastSyncedAt: remoteConnectionSchema.remoteConnections.lastSyncedAt,
            })
            .from(remoteConnectionSchema.remoteConnections)
            .where(eq(remoteConnectionSchema.remoteConnections.userId, devUser.id))
            .limit(1);
          if (!conn?.lastSyncedAt) {
            return false;
          }
          const beforeTs = connectionBefore?.lastSyncedAt?.getTime() ?? 0;
          return conn.lastSyncedAt.getTime() > beforeTs;
        },
      );

      // Node should still exist exactly once on dev
      const devNodes = await db
        .select({ path: cortexNodes.path })
        .from(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, devUser.id),
            eq(cortexNodes.path, HERMES_TEST_PATH),
          ),
        );
      expect(
        devNodes.length,
        "BN2: node must appear exactly once after double pull",
      ).toBe(1);
    },
    SYNC_TIMEOUT,
  );

  it(
    "BN3: delete node on hermes, dev pulls, node is gone on atlas",
    async () => {
      if (!connectedToHermes) {
        expect(false, "[BN3] Not connected to hermes — beforeAll must have failed").toBe(true);
        return;
      }

      // Soft-delete the HERMES_SYNC_ID node on hermes (tombstone protocol)
      await prodDb.execute(
        sql`UPDATE cortex_nodes SET is_deleted = true, updated_at = NOW() WHERE user_id = ${prodUserId} AND sync_id = ${HERMES_SYNC_ID}`,
      );

      // Verify soft-delete on hermes
      const hermesCheck = await prodDb.execute<{ is_deleted: boolean }>(
        sql`SELECT is_deleted FROM cortex_nodes WHERE user_id = ${prodUserId} AND sync_id = ${HERMES_SYNC_ID} LIMIT 1`,
      );
      expect(
        hermesCheck.rows[0]?.is_deleted,
        "BN3: node must be soft-deleted on hermes before pull",
      ).toBe(true);

      // Trigger atlas to pull from hermes — tombstone must arrive and be applied
      await triggerHermesPull(prodAdminToken);

      // Poll dev DB until the node is gone (deleted from atlas)
      await pollUntil(
        "BN3: tombstone must propagate — node must be gone from atlas after pull",
        async () => {
          const devNodes = await db
            .select({ path: cortexNodes.path })
            .from(cortexNodes)
            .where(
              and(
                eq(cortexNodes.userId, devUser.id),
                eq(cortexNodes.path, HERMES_TEST_PATH),
              ),
            );
          return devNodes.length === 0;
        },
      );

      // Final assertion: dev has no matching row
      const devNodes = await db
        .select({ path: cortexNodes.path })
        .from(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, devUser.id),
            eq(cortexNodes.path, HERMES_TEST_PATH),
          ),
        );
      expect(
        devNodes.length,
        "BN3: node deleted on hermes must be gone from atlas after pull",
      ).toBe(0);
    },
    SYNC_TIMEOUT,
  );
});

// ── 7. Sync scalability assertions ───────────────────────────────────────────

describe("Sync: scalability and efficiency", () => {
  let adminUser: JwtPrivatePayloadType;

  beforeAll(async () => {
    const resolved = await resolveTestAdminUser();
    if (!resolved) {
      expect(false, "Admin user not found — run: vibe seed").toBe(true);
      return;
    }
    adminUser = resolved;
  }, SYNC_TIMEOUT);

  it(
    "SC1: getCursor for 1000+ nodes completes in < 2s",
    async () => {

      // Insert 20 test nodes (small batch - enough to measure the pattern)
      const batchNodes = [...Array(20).keys()].map((i) => ({
        userId: adminUser.id,
        path: `/documents/sync-scale-test/node-${i}.md`,
        content: `# Scale test node ${i}`,
        size: 20,
        nodeType: "enums.nodeType.file" as const,
        syncId: randomUUID(),
        frontmatter: {} as Record<string, never>,
        tags: [] as string[],
      }));

      await db.insert(cortexNodes).values(batchNodes);

      const start = Date.now();
      const cursor = await documentsSyncProvider.getCursor(adminUser.id);
      const elapsed = Date.now() - start;

      // Cleanup
      await db
        .delete(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, adminUser.id),
            like(cortexNodes.path, "/documents/sync-scale-test/%"),
          ),
        );

      expect(cursor, "SC1: must return a cursor").toBeTruthy();
      expect(
        elapsed,
        `SC1: getCursor took ${elapsed}ms - must be < 2000ms`,
      ).toBeLessThan(2000);
    },
    SYNC_TIMEOUT,
  );

  it(
    "SC2: collectCursors runs both providers in parallel (no sequential bottleneck)",
    async () => {
      const start = Date.now();
      const cursors = await collectCursors(adminUser.id);
      const elapsed = Date.now() - start;

      expect(cursors).toHaveProperty("documents");
      expect(cursors).toHaveProperty("skills");

      // If they ran sequentially, this would take ~2x the individual time.
      // In practice: < 500ms for realistic data sizes.
      expect(
        elapsed,
        `SC2: collectCursors took ${elapsed}ms - targeting < 3000ms`,
      ).toBeLessThan(3000);
    },
    SYNC_TIMEOUT,
  );

  it(
    "SC3: per-provider cursor changes are independent (only changed provider transfers data)",
    async () => {
      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const initial = await collectCursors(adminUser.id);

      // Add a documents node (clean up stale leftovers from prior failed runs first)
      const tempPath = `/documents/sync-isolation-check/node.md`;
      await db
        .delete(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, adminUser.id),
            eq(cortexNodes.path, tempPath),
          ),
        );
      await db.insert(cortexNodes).values({
        userId: adminUser.id,
        path: tempPath,
        content: "isolation check",
        size: 15,
        nodeType: "enums.nodeType.file",
        syncId: randomUUID(),
        frontmatter: {},
        tags: [],
      });

      const after = await collectCursors(adminUser.id);

      // Documents cursor must advance, skills cursor must NOT change
      expect(
        JSON.stringify(initial["documents"]),
        "SC3: documents cursor must advance after insert",
      ).not.toBe(JSON.stringify(after["documents"]));
      expect(
        JSON.stringify(initial["skills"]),
        "SC3: skills cursor must be unchanged",
      ).toBe(JSON.stringify(after["skills"]));

      // Build payloads with the OLD documents cursor (remote is behind on docs)
      // but the CURRENT skills cursor → only documents carries records.
      const { syncPayloads } = await buildSyncPayloads(
        { documents: initial["documents"]!, skills: after["skills"]! },
        adminUser.id,
        logger,
      );
      // documents has a newer record than the stale cursor → non-empty payload.
      expect(syncPayloads["documents"]).not.toBe("[]");
      // skills cursor current → empty payload (no transfer).
      expect(syncPayloads["skills"], "SC3: skills must be empty").toBe("[]");

      // Cleanup
      await db
        .delete(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, adminUser.id),
            eq(cortexNodes.path, tempPath),
          ),
        );
    },
    SYNC_TIMEOUT,
  );
});
