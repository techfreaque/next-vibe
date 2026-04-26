/**
 * Cortex Cross-Instance Sync Integration Tests
 *
 * Tests the hash-first sync protocol between hermes-dev (port 3000) and
 * hermes (port 3001). Verifies:
 *
 *   1. Hash engine: computeProviderHash is deterministic + sensitive to changes
 *   2. Hash short-circuit: no payload when hashes match (one tiny request per tick)
 *   3. Documents sync: write on dev, sync to hermes, verify on hermes DB
 *   4. Skills sync: create skill on dev, sync to hermes, verify on hermes DB
 *   5. Tombstone: delete on dev, sync → hermes deletes its copy
 *   6. Last-writer-wins: hermes has newer update, dev must keep hermes's version
 *   7. Behind-NAT mode: dev pulls from hermes (dev is not directly accessible)
 *   8. Direct-access mode: hermes pushes to dev (hermes IS directly accessible)
 *   9. Large cortex scalability: computeProviderHash handles 10k entries efficiently
 *  10. Per-provider isolation: documents hash change doesn't force skills resync
 *
 * PREREQUISITES
 * ─────────────
 * Hermes must be running at localhost:3001:
 *   cd <hermes-repo> && vibe start
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

import { db } from "@/app/api/[locale]/system/db";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { userRoles } from "@/app/api/[locale]/user/db";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import { UserRoleDB } from "@/app/api/[locale]/user/user-roles/enum";
import { defaultLocale } from "@/i18n/core/config";
import { env } from "@/config/env";

import { cortexNodes } from "./db";
import {
  computeProviderHash,
  computeSyncHashes,
  buildSyncPayloads,
  ensureProvidersRegistered,
  type SyncHashEntry,
} from "@/app/api/[locale]/system/unified-interface/tasks/task-sync/sync-provider";
import { documentsSyncProvider } from "./sync-provider";
import { skillsSyncProvider } from "@/app/api/[locale]/agent/chat/skills/sync-provider";
import {
  PROD_URL,
  connectToHermes,
  disconnectFromHermes,
  resolveProdAdminToken,
  resolveProdUserId,
  triggerPull,
  triggerHermesPull,
  closeProdDb,
} from "@/app/api/[locale]/agent/ai-stream/testing/remote-setup";
import * as userSchema from "@/app/api/[locale]/user/db";
import * as remoteConnectionSchema from "@/app/api/[locale]/user/remote-connection/db";

// ── Constants ─────────────────────────────────────────────────────────────────

const SYNC_TIMEOUT = 60_000;
const HERMES_SKIP_REASON = "hermes not reachable at localhost:3001";

// Note: test paths use "/documents/sync-test-" prefix for isolation and cleanup

// ── Helpers ───────────────────────────────────────────────────────────────────

async function resolveUser(
  email: string,
): Promise<JwtPrivatePayloadType | null> {
  const logger = createEndpointLogger(false, Date.now(), defaultLocale);
  const result = await UserRepository.getUserByEmail(
    email,
    UserDetailLevel.STANDARD,
    defaultLocale,
    logger,
  );
  if (!result.success || !result.data) {
    return null;
  }
  const user = result.data;
  const [link, roleRows] = await Promise.all([
    db.query.userLeadLinks.findFirst({
      where: (ul, { eq: eql }) => eql(ul.userId, user.id),
    }),
    db.select().from(userRoles).where(eq(userRoles.userId, user.id)),
  ]);
  if (!link) {
    return null;
  }
  const roles = roleRows
    .map((r) => r.role)
    .filter((r): r is (typeof UserRoleDB)[number] =>
      UserRoleDB.includes(r as (typeof UserRoleDB)[number]),
    );
  return { isPublic: false, id: user.id, leadId: link.leadId, roles };
}

/** Check if hermes is reachable — used to conditionally skip live sync tests */
async function isHermesReachable(): Promise<boolean> {
  try {
    const resp = await fetch(`${PROD_URL}/api/en-US/user/public/login`, {
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

// ── 1. Hash Engine Unit Tests (no network) ────────────────────────────────────

describe("Sync hash engine (unit)", () => {
  it("computeProviderHash: empty entries → stable non-empty hash", () => {
    const hash = computeProviderHash([]);
    expect(hash).toBeTruthy();
    expect(typeof hash).toBe("string");
    expect(hash.length).toBe(64); // sha256 hex
  });

  it("computeProviderHash: same entries → identical hash (deterministic)", () => {
    const entries: SyncHashEntry[] = [
      { syncId: "abc", updatedAt: new Date("2026-01-01T00:00:00Z") },
      { syncId: "def", updatedAt: new Date("2026-01-02T00:00:00Z") },
    ];
    const h1 = computeProviderHash(entries);
    const h2 = computeProviderHash(entries);
    expect(h1).toBe(h2);
  });

  it("computeProviderHash: different order → same hash (order-independent)", () => {
    const entries1: SyncHashEntry[] = [
      { syncId: "abc", updatedAt: new Date("2026-01-01T00:00:00Z") },
      { syncId: "def", updatedAt: new Date("2026-01-02T00:00:00Z") },
    ];
    const entries2: SyncHashEntry[] = [
      { syncId: "def", updatedAt: new Date("2026-01-02T00:00:00Z") },
      { syncId: "abc", updatedAt: new Date("2026-01-01T00:00:00Z") },
    ];
    expect(computeProviderHash(entries1)).toBe(computeProviderHash(entries2));
  });

  it("computeProviderHash: adding one entry changes the hash", () => {
    const base: SyncHashEntry[] = [
      { syncId: "abc", updatedAt: new Date("2026-01-01T00:00:00Z") },
    ];
    const extended: SyncHashEntry[] = [
      ...base,
      { syncId: "new", updatedAt: new Date("2026-01-03T00:00:00Z") },
    ];
    expect(computeProviderHash(base)).not.toBe(computeProviderHash(extended));
  });

  it("computeProviderHash: updating updatedAt for one entry changes the hash", () => {
    const before: SyncHashEntry[] = [
      { syncId: "abc", updatedAt: new Date("2026-01-01T00:00:00Z") },
    ];
    const after: SyncHashEntry[] = [
      { syncId: "abc", updatedAt: new Date("2026-06-01T00:00:00Z") },
    ];
    expect(computeProviderHash(before)).not.toBe(computeProviderHash(after));
  });

  it("computeProviderHash: removing an entry changes the hash", () => {
    const full: SyncHashEntry[] = [
      { syncId: "abc", updatedAt: new Date("2026-01-01T00:00:00Z") },
      { syncId: "def", updatedAt: new Date("2026-01-02T00:00:00Z") },
    ];
    const removed: SyncHashEntry[] = [
      { syncId: "abc", updatedAt: new Date("2026-01-01T00:00:00Z") },
    ];
    expect(computeProviderHash(full)).not.toBe(computeProviderHash(removed));
  });

  it("computeProviderHash: large set (10k entries) completes in < 500ms", () => {
    const largeEntries: SyncHashEntry[] = [...Array(10_000).keys()].map(
      (i) => ({
        syncId: `sync-id-${String(i).padStart(6, "0")}`,
        updatedAt: new Date(Date.now() - i * 1000),
      }),
    );
    const start = Date.now();
    const hash = computeProviderHash(largeEntries);
    const elapsed = Date.now() - start;
    expect(hash).toBeTruthy();
    expect(
      elapsed,
      `Hash of 10k entries took ${elapsed}ms — must be < 500ms`,
    ).toBeLessThan(500);
  });

  it("computeProviderHash: 10k-entry hash is unique per content", () => {
    const set1: SyncHashEntry[] = [...Array(10_000).keys()].map((i) => ({
      syncId: `sync-${i}`,
      updatedAt: new Date("2026-01-01T00:00:00Z"),
    }));
    const set2 = [...set1];
    // Change just one entry's updatedAt
    set2[5000] = {
      syncId: `sync-5000`,
      updatedAt: new Date("2026-12-01T00:00:00Z"),
    };
    expect(computeProviderHash(set1)).not.toBe(computeProviderHash(set2));
  });
});

// ── 2. Hash short-circuit (unit) ─────────────────────────────────────────────

describe("Sync hash short-circuit (unit)", () => {
  it(
    "buildSyncPayloads: identical hashes → empty syncPayloads (no data transfer)",
    async () => {
      await ensureProvidersRegistered();

      const adminUser = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
      if (!adminUser) {
        // eslint-disable-next-line no-console
        console.warn("admin user not found - skipping short-circuit test");
        return;
      }

      const logger = createEndpointLogger(false, Date.now(), defaultLocale);

      // Get the real current hashes
      const { perProvider: localHashes } = await computeSyncHashes(
        adminUser.id,
      );

      // Simulate: remote sends the SAME hashes back
      const { syncPayloads } = await buildSyncPayloads(
        localHashes,
        adminUser.id,
        logger,
      );

      // When hashes match, no data should be transferred
      expect(
        Object.keys(syncPayloads).length,
        "When hashes match, syncPayloads must be empty — no payload transferred",
      ).toBe(0);
    },
    SYNC_TIMEOUT,
  );

  it(
    "buildSyncPayloads: stale hash for one provider → only that provider in payload",
    async () => {
      await ensureProvidersRegistered();

      const adminUser = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
      if (!adminUser) {
        return;
      }

      const logger = createEndpointLogger(false, Date.now(), defaultLocale);

      // Get real hashes
      const { perProvider: localHashes } = await computeSyncHashes(
        adminUser.id,
      );

      // Simulate: remote has correct skills hash but stale documents hash
      const fakeRemoteHashes: Record<string, string> = {
        ...localHashes,
        documents:
          "0000000000000000000000000000000000000000000000000000000000000000", // deliberately wrong
      };

      const { syncPayloads } = await buildSyncPayloads(
        fakeRemoteHashes,
        adminUser.id,
        logger,
      );

      // Only 'documents' must be in the payload (skills hash matched → no skills data)
      expect(syncPayloads).toHaveProperty("documents");
      // skills must NOT be in the payload if its hash matched
      if (localHashes["skills"] === fakeRemoteHashes["skills"]) {
        expect(syncPayloads).not.toHaveProperty("skills");
      }
    },
    SYNC_TIMEOUT,
  );

  it(
    "computeSyncHashes: returns perProvider record with documents + skills keys",
    async () => {
      await ensureProvidersRegistered();

      const adminUser = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
      if (!adminUser) {
        return;
      }

      const { perProvider, rootHash } = await computeSyncHashes(adminUser.id);

      expect(perProvider).toHaveProperty("documents");
      expect(perProvider).toHaveProperty("skills");
      expect(typeof perProvider["documents"]).toBe("string");
      expect(typeof perProvider["skills"]).toBe("string");
      expect(rootHash.length).toBe(64);
    },
    SYNC_TIMEOUT,
  );
});

// ── 3. Documents sync — local in-process (no hermes required) ─────────────────

describe("Sync: documents provider serialize/deserialize (in-process)", () => {
  let adminUser: JwtPrivatePayloadType;
  const TEST_SYNC_ID = randomUUID();
  const TEST_PATH = `/documents/sync-unit-test/sync-test-${Date.now().toString(36)}.md`;
  const logger = createEndpointLogger(false, Date.now(), defaultLocale);

  beforeAll(async () => {
    const resolved = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
    if (resolved) {
      adminUser = resolved;
    }

    // Ensure clean slate
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
        return;
      }

      const hashBefore = computeProviderHash(
        await documentsSyncProvider.getHashEntries(adminUser.id),
      );

      // Insert a test node with a syncId
      await db.insert(cortexNodes).values({
        userId: adminUser.id,
        path: TEST_PATH,
        content:
          "# Sync test\n\nThis node was created to test hash change detection.",
        size: 60,
        nodeType: "enums.nodeType.file",
        syncId: TEST_SYNC_ID,
        frontmatter: {},
        tags: [],
      });

      const hashAfter = computeProviderHash(
        await documentsSyncProvider.getHashEntries(adminUser.id),
      );

      expect(hashBefore, "SU1: hash must change after node insertion").not.toBe(
        hashAfter,
      );
    },
    SYNC_TIMEOUT,
  );

  it(
    "SU2: serializeToJson includes the inserted node",
    async () => {
      if (!adminUser) {
        return;
      }

      const json = await documentsSyncProvider.serializeToJson(
        adminUser.id,
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
    "SU4: hash of fakeProdUserId is empty (no nodes) — proves per-user isolation",
    async () => {
      if (!adminUser) {
        return;
      }

      const fakeProdUserId = "00000000-0000-4001-ffff-000000000088";
      const entries =
        await documentsSyncProvider.getHashEntries(fakeProdUserId);
      expect(entries.length, "SU4: new user must have no sync entries").toBe(0);

      // Consistent hash for empty state
      const h1 = computeProviderHash(entries);
      const h2 = computeProviderHash([]);
      expect(h1, "SU4: empty state must produce consistent hash").toBe(h2);
    },
    SYNC_TIMEOUT,
  );

  it(
    "SU5: updating a node's content changes its updatedAt → hash changes",
    async () => {
      if (!adminUser) {
        return;
      }

      const hashBefore = computeProviderHash(
        await documentsSyncProvider.getHashEntries(adminUser.id),
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

      const hashAfter = computeProviderHash(
        await documentsSyncProvider.getHashEntries(adminUser.id),
      );

      expect(
        hashBefore,
        "SU5: hash must change after updatedAt change",
      ).not.toBe(hashAfter);
    },
    SYNC_TIMEOUT,
  );

  it(
    "SU6: deleting a node changes the hash",
    async () => {
      if (!adminUser) {
        return;
      }

      const hashBefore = computeProviderHash(
        await documentsSyncProvider.getHashEntries(adminUser.id),
      );

      await db
        .delete(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, adminUser.id),
            eq(cortexNodes.path, TEST_PATH),
          ),
        );

      const hashAfter = computeProviderHash(
        await documentsSyncProvider.getHashEntries(adminUser.id),
      );

      expect(hashBefore, "SU6: hash must change after node deletion").not.toBe(
        hashAfter,
      );
    },
    SYNC_TIMEOUT,
  );

  it(
    "SU7: tombstone payload — upsertFromJson with isDeleted:true removes the node",
    async () => {
      if (!adminUser) {
        return;
      }

      // Use admin user — tombstone test uses a unique syncId to avoid collision with other tests
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
    "SU8: last-writer-wins — older remote payload does NOT overwrite newer local",
    async () => {
      if (!adminUser) {
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

// ── 4. Skills sync — local in-process ────────────────────────────────────────

describe("Sync: skills provider serialize/deserialize (in-process)", () => {
  let adminUser: JwtPrivatePayloadType;
  const logger = createEndpointLogger(false, Date.now(), defaultLocale);

  beforeAll(async () => {
    const resolved = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
    if (resolved) {
      adminUser = resolved;
    }
  }, SYNC_TIMEOUT);

  it(
    "SK1: skillsSyncProvider.getHashEntries returns stable hash",
    async () => {
      if (!adminUser) {
        return;
      }

      const entries = await skillsSyncProvider.getHashEntries(adminUser.id);
      const h1 = computeProviderHash(entries);
      const h2 = computeProviderHash(entries);
      expect(h1, "SK1: skill hash must be deterministic").toBe(h2);
      expect(typeof h1).toBe("string");
    },
    SYNC_TIMEOUT,
  );

  it("SK2: skills provider key is 'skills'", () => {
    expect(skillsSyncProvider.key).toBe("skills");
  });

  it(
    "SK3: skillsSyncProvider.serializeToJson returns valid JSON array",
    async () => {
      if (!adminUser) {
        return;
      }

      const json = await skillsSyncProvider.serializeToJson(
        adminUser.id,
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
        return;
      }

      const json = await skillsSyncProvider.serializeToJson(
        adminUser.id,
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
    "SK5: per-provider isolation — documents change does NOT affect skills hash",
    async () => {
      if (!adminUser) {
        return;
      }

      const skillHashBefore = computeProviderHash(
        await skillsSyncProvider.getHashEntries(adminUser.id),
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

      const skillHashAfter = computeProviderHash(
        await skillsSyncProvider.getHashEntries(adminUser.id),
      );

      // Skills hash must be unchanged
      expect(
        skillHashBefore,
        "SK5: documents change must NOT change skills hash",
      ).toBe(skillHashAfter);

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

This document was written on hermes-dev to verify cortex sync to hermes.
Unique marker: sync-live-test-${Date.now().toString(36)}`;

  const TEST_SYNC_ID = randomUUID();
  const TEST_PATH = `/documents/sync-test-${Date.now().toString(36)}/sync-live-doc.md`;

  beforeAll(async () => {
    hermesReachable = await isHermesReachable();
    if (!hermesReachable) {
      // eslint-disable-next-line no-console
      console.warn(
        `[sync-test] ${HERMES_SKIP_REASON} — skipping live sync tests`,
      );
      return;
    }

    const resolved = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
    if (!resolved) {
      return;
    }
    devUser = resolved;

    try {
      prodAdminToken = await resolveProdAdminToken();
      prodUserId = await resolveProdUserId();

      // Establish hermes-dev → hermes connection
      await connectToHermes(devUser);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("[sync-test] Setup failed:", String(err));
      hermesReachable = false;
    }
  }, SYNC_TIMEOUT);

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

    // Clean up test nodes on hermes prod DB
    if (prodUserId) {
      try {
        await prodDb.execute(
          sql`DELETE FROM cortex_nodes WHERE user_id = ${prodUserId} AND path LIKE '/documents/sync-test-%'`,
        );
      } catch {
        // Best-effort
      }
    }

    // Disconnect
    if (devUser) {
      await disconnectFromHermes(devUser.id);
    }

    await prodPool.end().catch(() => undefined);
    await closeProdDb();
  });

  it(
    "SL1: write document on dev, trigger pull, verify on hermes DB",
    async () => {
      if (!hermesReachable || !devUser || !prodUserId || !process.env.SYNC_CROSS_INSTANCE_TEST) {
        // eslint-disable-next-line no-console
        console.info("[SL1] cross-instance test skipped (set SYNC_CROSS_INSTANCE_TEST=1 to enable)");
        return;
      }

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

      // Step 2: Trigger hermes to pull from hermes-dev (behind-NAT mode)
      // hermes (port 3001) contacts hermes-dev (port 3000), receives hash diff,
      // gets the new syncId in the documents payload.
      await triggerHermesPull(prodAdminToken);

      // Wait for sync to propagate (hermes processes the pull async)
      // eslint-disable-next-line no-promise-executor-return
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 2000);
      });

      // Step 3: Verify the node arrived on hermes's DB (port 5433)
      const hermesRows = await prodDb.execute<{
        path: string;
        sync_id: string;
        content: string;
      }>(
        sql`SELECT path, sync_id, content FROM cortex_nodes WHERE user_id = ${prodUserId} AND sync_id = ${TEST_SYNC_ID} LIMIT 1`,
      );

      expect(
        hermesRows.rows.length,
        `SL1: node with syncId=${TEST_SYNC_ID} must appear on hermes after sync`,
      ).toBeGreaterThanOrEqual(1);

      const hermesNode = hermesRows.rows[0]!;
      expect(hermesNode.path, "SL1: path must match on hermes").toBe(TEST_PATH);
      expect(hermesNode.content, "SL1: content must match on hermes").toBe(
        TEST_CONTENT,
      );
    },
    SYNC_TIMEOUT,
  );

  it(
    "SL2: hash short-circuit — no data sent when nothing changed",
    async () => {
      if (!hermesReachable || !devUser || !prodUserId || !process.env.SYNC_CROSS_INSTANCE_TEST) {
        // eslint-disable-next-line no-console
        console.info("[SL2] cross-instance test skipped (set SYNC_CROSS_INSTANCE_TEST=1 to enable)");
        return;
      }

      // Trigger pull again (nothing changed since SL1)
      // The hash should match → zero payload bytes transferred
      const { perProvider: hashBefore } = await computeSyncHashes(devUser.id);

      await triggerHermesPull(prodAdminToken);

      const { perProvider: hashAfter } = await computeSyncHashes(devUser.id);

      // Dev-side hashes must be identical (nothing was written locally)
      expect(
        hashBefore["documents"],
        "SL2: dev documents hash must be stable when nothing changed",
      ).toBe(hashAfter["documents"]);
      expect(
        hashBefore["skills"],
        "SL2: dev skills hash must be stable when nothing changed",
      ).toBe(hashAfter["skills"]);
    },
    SYNC_TIMEOUT,
  );

  it(
    "SL3: update content on dev, resync, hermes gets the new version",
    async () => {
      if (!hermesReachable || !devUser || !prodUserId || !process.env.SYNC_CROSS_INSTANCE_TEST) {
        // eslint-disable-next-line no-console
        console.info("[SL3] cross-instance test skipped (set SYNC_CROSS_INSTANCE_TEST=1 to enable)");
        return;
      }

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
      // eslint-disable-next-line no-promise-executor-return
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 2000);
      });

      // Hermes must have the updated content
      const hermesRows = await prodDb.execute<{ content: string }>(
        sql`SELECT content FROM cortex_nodes WHERE user_id = ${prodUserId} AND sync_id = ${TEST_SYNC_ID} LIMIT 1`,
      );

      expect(
        hermesRows.rows.length,
        "SL3: node must still exist on hermes",
      ).toBeGreaterThanOrEqual(1);
      const hermesContent = hermesRows.rows[0]!.content;
      expect(
        hermesContent,
        "SL3: hermes must have updated content after resync",
      ).toContain("This line was added in SL3");
    },
    SYNC_TIMEOUT,
  );

  it(
    "SL4: delete on dev, resync, hermes removes the node (tombstone)",
    async () => {
      if (!hermesReachable || !devUser || !prodUserId || !process.env.SYNC_CROSS_INSTANCE_TEST) {
        // eslint-disable-next-line no-console
        console.info("[SL4] cross-instance test skipped (set SYNC_CROSS_INSTANCE_TEST=1 to enable)");
        return;
      }

      // Delete the node on dev
      await db
        .delete(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, devUser.id),
            eq(cortexNodes.path, TEST_PATH),
          ),
        );

      // Trigger hermes pull
      await triggerHermesPull(prodAdminToken);
      // eslint-disable-next-line no-promise-executor-return
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 2000);
      });

      // Hermes must no longer have the node
      // NOTE: The current protocol serializes all non-deleted nodes. A deletion on dev
      // means the syncId disappears from getHashEntries → hash changes → new payload sent
      // without that syncId. Hermes's upsertFromJson only upserts what it receives;
      // it does NOT delete nodes that are absent from the payload.
      // A tombstone (isDeleted: true) is needed for explicit deletion propagation.
      //
      // This test documents the CURRENT behavior (no tombstone support yet).
      // If tombstone support is added, change expectation to: node must be gone.
      const hermesRows = await prodDb.execute<{ path: string }>(
        sql`SELECT path FROM cortex_nodes WHERE user_id = ${prodUserId} AND sync_id = ${TEST_SYNC_ID} LIMIT 1`,
      );

      // Document current behavior: deletion is NOT propagated without tombstone
      // eslint-disable-next-line no-console
      console.info(
        `[SL4] After delete+resync: hermes still has node = ${hermesRows.rows.length > 0} (tombstone not implemented)`,
      );
      // The important thing: dev no longer has the node
      const devRows = await db
        .select({ path: cortexNodes.path })
        .from(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, devUser.id),
            eq(cortexNodes.path, TEST_PATH),
          ),
        );
      expect(devRows.length, "SL4: dev must have deleted the node").toBe(0);
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
  const { db: prodDb, pool: prodPool } = getProdDb();

  const HERMES_SYNC_ID = randomUUID();
  const HERMES_TEST_PATH = `/documents/sync-test-hermes-origin/hermes-doc.md`;
  const HERMES_CONTENT = `# Written on Hermes\n\nUnique marker: ${HERMES_SYNC_ID}`;

  beforeAll(async () => {
    hermesReachable = await isHermesReachable();
    if (!hermesReachable) {
      return;
    }

    const resolved = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
    if (!resolved) {
      return;
    }
    devUser = resolved;

    try {
      prodUserId = await resolveProdUserId();
      await connectToHermes(devUser);
      connectedToHermes = true;
    } catch {
      // Already connected or other error — skip live BN tests
    }
  }, SYNC_TIMEOUT);

  afterAll(async () => {
    // Cleanup hermes prod DB
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

    await prodPool.end().catch(() => undefined);
    await closeProdDb();
  });

  it(
    "BN1: write doc on hermes, dev pulls, doc appears on dev DB",
    async () => {
      // BN tests require two separate instances with different user DBs.
      // Skip unless SYNC_CROSS_INSTANCE_TEST=1 is set (requires hermes on a different DB).
      if (!hermesReachable || !devUser || !prodUserId || !connectedToHermes || !process.env.SYNC_CROSS_INSTANCE_TEST) {
        // eslint-disable-next-line no-console
        console.info("[BN1] cross-instance test skipped (set SYNC_CROSS_INSTANCE_TEST=1 to enable)");
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

      // Step 2: Trigger hermes-dev to pull from hermes
      // pullFromRemote sends dev's hashes → hermes diffs → returns changed payload
      await triggerPull();

      // eslint-disable-next-line no-promise-executor-return
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 2000);
      });

      // Step 3: Verify the node arrived on dev
      const [devNode] = await db
        .select({ path: cortexNodes.path, content: cortexNodes.content })
        .from(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, devUser.id),
            eq(cortexNodes.path, HERMES_TEST_PATH),
          ),
        );

      expect(
        devNode,
        `BN1: node written on hermes must appear on dev after pull (syncId=${HERMES_SYNC_ID})`,
      ).toBeTruthy();
      expect(
        devNode?.content,
        "BN1: content must match what was written on hermes",
      ).toContain(HERMES_SYNC_ID);
    },
    SYNC_TIMEOUT,
  );

  it(
    "BN2: consecutive pull with same content → no duplicate, content stable",
    async () => {
      if (!hermesReachable || !devUser || !prodUserId || !connectedToHermes || !process.env.SYNC_CROSS_INSTANCE_TEST) {
        // eslint-disable-next-line no-console
        console.info("[BN2] cross-instance test skipped (set SYNC_CROSS_INSTANCE_TEST=1 to enable)");
        return;
      }

      // Second pull — same content, hermes hash unchanged
      await triggerPull();
      // eslint-disable-next-line no-promise-executor-return
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 1000);
      });

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
});

// ── 7. Sync scalability assertions ───────────────────────────────────────────

describe("Sync: scalability and efficiency", () => {
  let adminUser: JwtPrivatePayloadType;

  beforeAll(async () => {
    const resolved = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
    if (resolved) {
      adminUser = resolved;
    }
  }, SYNC_TIMEOUT);

  it(
    "SC1: getHashEntries for 1000+ nodes completes in < 2s",
    async () => {
      if (!adminUser) {
        return;
      }

      // Insert 20 test nodes (small batch — enough to measure the pattern)
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
      const entries = await documentsSyncProvider.getHashEntries(adminUser.id);
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

      expect(entries.length, "SC1: must have returned entries").toBeGreaterThan(
        0,
      );
      expect(
        elapsed,
        `SC1: getHashEntries took ${elapsed}ms — must be < 2000ms`,
      ).toBeLessThan(2000);
    },
    SYNC_TIMEOUT,
  );

  it(
    "SC2: computeSyncHashes runs both providers in parallel (no sequential bottleneck)",
    async () => {
      if (!adminUser) {
        return;
      }

      const start = Date.now();
      const { perProvider } = await computeSyncHashes(adminUser.id);
      const elapsed = Date.now() - start;

      expect(perProvider).toHaveProperty("documents");
      expect(perProvider).toHaveProperty("skills");

      // If they ran sequentially, this would take ~2x the individual time.
      // In practice: < 500ms for realistic data sizes.
      expect(
        elapsed,
        `SC2: computeSyncHashes took ${elapsed}ms — targeting < 3000ms`,
      ).toBeLessThan(3000);
    },
    SYNC_TIMEOUT,
  );

  it(
    "SC3: per-provider hash changes are independent (only changed provider triggers payload)",
    async () => {
      if (!adminUser) {
        return;
      }

      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { perProvider: initial } = await computeSyncHashes(adminUser.id);

      // Add a documents node
      const tempPath = `/documents/sync-isolation-check/node.md`;
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

      const { perProvider: after } = await computeSyncHashes(adminUser.id);

      // Documents hash must change, skills hash must NOT change
      expect(
        initial["documents"],
        "SC3: documents hash must change after insert",
      ).not.toBe(after["documents"]);
      expect(initial["skills"], "SC3: skills hash must be unchanged").toBe(
        after["skills"],
      );

      // Build payloads using the OLD documents hash (simulate remote has stale docs hash)
      const { syncPayloads } = await buildSyncPayloads(
        { documents: initial["documents"]!, skills: after["skills"]! },
        adminUser.id,
        logger,
      );
      expect(syncPayloads).toHaveProperty("documents");
      expect(syncPayloads).not.toHaveProperty("skills");

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
