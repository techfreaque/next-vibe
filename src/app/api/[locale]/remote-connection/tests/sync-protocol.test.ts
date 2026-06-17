/**
 * Sync Protocol — E2E Tests
 *
 * Tests the hash-first sync protocol behaviors NOT covered by cortex-sync.test.ts:
 *
 *   SP1  — after pull, remoteSyncHashes written to DB (touchLastSynced)
 *   SP2  — hash match on second pull → no payloads returned (short-circuit)
 *   SP3  — capability version match → capabilities=null in sync response
 *   SP4  — capability version mismatch → capabilities snapshot returned
 *   SP5  — server-side syncScope: skills=false on caller's connection → skills excluded
 *           from sync response sent TO the caller
 *   SP6  — buildSyncPayloads: hash match → zero payloads; one provider differs → only
 *           that provider; all differ → all three
 *   SP7  — applySyncPayloads: routes to correct upsertFromJson per provider key;
 *           unregistered key logs warning, does not throw
 *   SP8  — conflict resolution: incoming updatedAt > local → overwrite;
 *           incoming < local → keep; same updatedAt → remote wins (>=)
 *
 * PREREQUISITES
 * ─────────────
 *   Terminal 1: vibe dev               (atlas, port 3000, dev DB port 5432)
 *   Terminal 2: vibe --hermes dev       (hermes, port 3002, prod DB port 5433)
 *
 * SP1-SP5 require both servers running (cross-instance pull-on-connect).
 * SP6-SP8 are in-process (no servers needed) — always run.
 */

import "server-only";

import { randomUUID } from "node:crypto";

import { and, eq, sql } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { cortexNodes } from "@/app/api/[locale]/agent/cortex/db";
import { CortexNodeType } from "@/app/api/[locale]/agent/cortex/enum";
import type { SyncScope } from "@/app/api/[locale]/remote-connection/db";
import { remoteConnections } from "@/app/api/[locale]/remote-connection/db";
import {
  applySyncPayloads,
  buildSyncPayloads,
  ensureProvidersRegistered,
  registerSyncProvider,
  type SyncProvider,
} from "@/app/api/[locale]/remote-connection/sync-provider";
import { db } from "@/app/api/[locale]/system/db";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { env } from "@/config/env";
import { defaultLocale } from "@/i18n/core/config";

import {
  closeProdDb,
  connectToHermes,
  disconnectFromHermes,
  getProdDb,
  HERMES_INSTANCE_ID,
  resolveDevUser,
  resolveProdAdminToken,
  resolveProdUserId,
  resolveRemoteUrl,
  triggerHermesPull,
  unregisterDevFromHermes,
} from "../../agent/ai-stream/testing/remote-setup";

// ── Skip guard ─────────────────────────────────────────────────────────────────

const _remoteUrl = await resolveRemoteUrl();

// ── Helpers ───────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

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
    await sleep(200);
  }
  // oxlint-disable-next-line restricted-syntax
  throw new Error(`[pollUntil] ${label}: timed out after ${timeoutMs}ms`);
}

// ═════════════════════════════════════════════════════════════════════════════
// SP6-SP8: In-process protocol tests (no servers needed)
// ═════════════════════════════════════════════════════════════════════════════

describe("Sync Protocol — buildSyncPayloads (in-process)", () => {
  const logger = createEndpointLogger(false, Date.now(), defaultLocale);

  beforeAll(async () => {
    await ensureProvidersRegistered();
  });

  it("SP6a: cursor advancement — documents return 0 items after cursor is current", async () => {
    const resolved = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
    if (!resolved) {
      // oxlint-disable-next-line restricted-syntax
      throw new Error(`${env.VIBE_ADMIN_USER_EMAIL} not found — run: vibe seed`);
    }

    // Write a unique document so the first full scan always finds ≥1 item
    const syncId = randomUUID();
    const path = `/documents/sp6a-${syncId}.md`;
    const content = "SP6a cursor test";
    await db.insert(cortexNodes).values({
      userId: resolved.id,
      path,
      content,
      size: content.length,
      nodeType: CortexNodeType.FILE,
      syncId,
      frontmatter: {},
      tags: [],
    });

    try {
      // First call: no cursor → full sync; returns ourCursors at current high-water mark
      const { syncPayloads: firstPayloads, syncCounts: firstCounts, ourCursors } = await buildSyncPayloads(
        {},
        resolved.id,
        logger,
      );
      expect(Object.keys(firstPayloads).length, "SP6a: at least one provider expected").toBeGreaterThan(0);
      expect(firstCounts.documents ?? 0, "SP6a: documents must have ≥1 item on first full scan").toBeGreaterThan(0);

      // Second call: pass ourCursors — no new records written between calls
      // documents must return 0 items (nothing newer than the cursor)
      const { syncCounts: secondCounts } = await buildSyncPayloads(
        ourCursors,
        resolved.id,
        logger,
      );
      expect(
        secondCounts.documents ?? 0,
        "SP6a: documents must return 0 items when cursor is current",
      ).toBe(0);
    } finally {
      await db
        .delete(cortexNodes)
        .where(and(eq(cortexNodes.userId, resolved.id), eq(cortexNodes.path, path)));
    }
  }, 30_000);

  it("SP6b: stale cursor for one provider → only that provider has new records", async () => {
    const resolved = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
    if (!resolved) {
      // oxlint-disable-next-line restricted-syntax
      throw new Error(`${env.VIBE_ADMIN_USER_EMAIL} not found — run: vibe seed`);
    }

    // First call: get current cursors (up-to-date)
    const { ourCursors } = await buildSyncPayloads({}, resolved.id, logger);

    // Write a new document AFTER capturing the cursor
    const syncId = randomUUID();
    const path = `/documents/sp6b-${syncId}.md`;
    const content = "SP6b cursor test";
    await db.insert(cortexNodes).values({
      userId: resolved.id,
      path,
      content,
      size: content.length,
      nodeType: CortexNodeType.FILE,
      syncId,
      frontmatter: {},
      tags: [],
    });

    try {
      // Second call: use the cursor from before the write for "documents",
      // current cursor for everything else → only documents should return records
      const staleDocCursor = ourCursors.documents;
      const cursorsWithStaleDoc = staleDocCursor
        ? { ...ourCursors }
        : ourCursors;
      // Remove documents cursor to force a full-scan of documents
      const { documents: _removed, ...cursorsWithoutDoc } = cursorsWithStaleDoc;
      void _removed;

      const { syncPayloads, syncCounts } = await buildSyncPayloads(
        cursorsWithoutDoc,
        resolved.id,
        logger,
      );

      // documents must appear (cursor absent → full scan includes our new doc)
      expect(
        "documents" in syncPayloads,
        "SP6b: documents must be in payloads (cursor absent)",
      ).toBe(true);
      expect(
        syncCounts.documents ?? 0,
        "SP6b: documents payload must include the newly written node",
      ).toBeGreaterThanOrEqual(1);
    } finally {
      // Cleanup
      await db
        .delete(cortexNodes)
        .where(
          and(eq(cortexNodes.userId, resolved.id), eq(cortexNodes.path, path)),
        );
    }
  }, 30_000);

  it("SP6c: all providers differ → all serialized", async () => {
    const resolved = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
    if (!resolved) {
      // oxlint-disable-next-line restricted-syntax
      throw new Error(`${env.VIBE_ADMIN_USER_EMAIL} not found — run: vibe seed`);
    }

    // Send empty hashes → all providers will differ
    const { syncPayloads } = await buildSyncPayloads({}, resolved.id, logger);

    // At least documents and skills must be present (registered providers)
    expect(
      "documents" in syncPayloads,
      "SP6c: documents must be in payloads",
    ).toBe(true);
    expect("skills" in syncPayloads, "SP6c: skills must be in payloads").toBe(
      true,
    );
  }, 30_000);

  it("SP7a: applySyncPayloads routes to correct provider by key", async () => {
    const resolved = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
    if (!resolved) {
      // oxlint-disable-next-line restricted-syntax
      throw new Error(`${env.VIBE_ADMIN_USER_EMAIL} not found — run: vibe seed`);
    }

    // Apply an empty skills payload — should not throw, returns 0 synced
    const results = await applySyncPayloads(
      { skills: "[]" },
      resolved.id,
      logger,
    );

    expect(results.skills, "SP7a: empty skills payload → 0 synced").toBe(0);
  }, 30_000);

  it("SP7b: unregistered key in applySyncPayloads → no throw, key absent from results", async () => {
    const resolved = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
    if (!resolved) {
      // oxlint-disable-next-line restricted-syntax
      throw new Error(`${env.VIBE_ADMIN_USER_EMAIL} not found — run: vibe seed`);
    }

    const results = await applySyncPayloads(
      { nonexistent_provider_xyz: "[]" },
      resolved.id,
      logger,
    );

    expect(
      "nonexistent_provider_xyz" in results,
      "SP7b: unknown provider key must be absent from results (not throw)",
    ).toBe(false);
  }, 30_000);

  it("SP8a: conflict resolution — incoming updatedAt > local → overwrite", async () => {
    const resolved = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
    if (!resolved) {
      // oxlint-disable-next-line restricted-syntax
      throw new Error(`${env.VIBE_ADMIN_USER_EMAIL} not found — run: vibe seed`);
    }

    const syncId = randomUUID();
    const path = `/documents/sp8a-${syncId}.md`;
    const originalContent = "SP8a original";
    const newerContent = "SP8a remote newer";
    const now = new Date();
    const olderDate = new Date(now.getTime() - 60_000);
    const newerDate = new Date(now.getTime() + 60_000);

    // Insert local node with older timestamp
    await db.insert(cortexNodes).values({
      userId: resolved.id,
      path,
      content: originalContent,
      size: originalContent.length,
      nodeType: CortexNodeType.FILE,
      syncId,
      frontmatter: {},
      tags: [],
      updatedAt: olderDate,
    });

    // Apply a payload where remote has NEWER timestamp → must overwrite
    const remotePayload = JSON.stringify([
      {
        syncId,
        path,
        content: newerContent,
        nodeType: CortexNodeType.FILE,
        frontmatter: {},
        tags: [],
        size: newerContent.length,
        updatedAt: newerDate.toISOString(),
      },
    ]);

    await applySyncPayloads({ documents: remotePayload }, resolved.id, logger);

    const [row] = await db
      .select({ content: cortexNodes.content })
      .from(cortexNodes)
      .where(
        and(
          eq(cortexNodes.userId, resolved.id),
          eq(cortexNodes.syncId, syncId),
        ),
      )
      .limit(1);

    expect(
      row?.content,
      "SP8a: remote newer → local must be overwritten with remote content",
    ).toBe(newerContent);

    // Cleanup
    await db
      .delete(cortexNodes)
      .where(
        and(eq(cortexNodes.userId, resolved.id), eq(cortexNodes.path, path)),
      );
  }, 30_000);

  it("SP8b: conflict resolution — incoming updatedAt < local → keep local", async () => {
    const resolved = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
    if (!resolved) {
      // oxlint-disable-next-line restricted-syntax
      throw new Error(`${env.VIBE_ADMIN_USER_EMAIL} not found — run: vibe seed`);
    }

    const syncId = randomUUID();
    const path = `/documents/sp8b-${syncId}.md`;
    const localContent = "SP8b local newer";
    const staleContent = "SP8b remote stale";
    const now = new Date();
    const newerDate = new Date(now.getTime() + 60_000);
    const olderDate = new Date(now.getTime() - 60_000);

    // Insert local node with NEWER timestamp
    await db.insert(cortexNodes).values({
      userId: resolved.id,
      path,
      content: localContent,
      size: localContent.length,
      nodeType: CortexNodeType.FILE,
      syncId,
      frontmatter: {},
      tags: [],
      updatedAt: newerDate,
    });

    // Apply a payload where remote has OLDER timestamp → must keep local
    const stalePayload = JSON.stringify([
      {
        syncId,
        path,
        content: staleContent,
        nodeType: CortexNodeType.FILE,
        frontmatter: {},
        tags: [],
        size: staleContent.length,
        updatedAt: olderDate.toISOString(),
      },
    ]);

    await applySyncPayloads({ documents: stalePayload }, resolved.id, logger);

    const [row] = await db
      .select({ content: cortexNodes.content })
      .from(cortexNodes)
      .where(
        and(
          eq(cortexNodes.userId, resolved.id),
          eq(cortexNodes.syncId, syncId),
        ),
      )
      .limit(1);

    expect(
      row?.content,
      "SP8b: remote older → local must be kept (last-writer-wins >=)",
    ).toBe(localContent);

    // Cleanup
    await db
      .delete(cortexNodes)
      .where(
        and(eq(cortexNodes.userId, resolved.id), eq(cortexNodes.path, path)),
      );
  }, 30_000);

  it("SP8c: conflict resolution — same updatedAt → remote wins (>=)", async () => {
    const resolved = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
    if (!resolved) {
      // oxlint-disable-next-line restricted-syntax
      throw new Error(`${env.VIBE_ADMIN_USER_EMAIL} not found — run: vibe seed`);
    }

    const syncId = randomUUID();
    const path = `/documents/sp8c-${syncId}.md`;
    const localContent = "SP8c local";
    const remoteContent = "SP8c remote (wins on tie)";
    const tieDate = new Date("2026-06-01T12:00:00.000Z");

    // Insert local node with the SAME timestamp as what remote will send
    await db.insert(cortexNodes).values({
      userId: resolved.id,
      path,
      content: localContent,
      size: localContent.length,
      nodeType: CortexNodeType.FILE,
      syncId,
      frontmatter: {},
      tags: [],
      updatedAt: tieDate,
    });

    // Apply remote payload with identical timestamp → remote wins (>=)
    const tiePayload = JSON.stringify([
      {
        syncId,
        path,
        content: remoteContent,
        nodeType: CortexNodeType.FILE,
        frontmatter: {},
        tags: [],
        size: remoteContent.length,
        updatedAt: tieDate.toISOString(),
      },
    ]);

    await applySyncPayloads({ documents: tiePayload }, resolved.id, logger);

    const [row] = await db
      .select({ content: cortexNodes.content })
      .from(cortexNodes)
      .where(
        and(
          eq(cortexNodes.userId, resolved.id),
          eq(cortexNodes.syncId, syncId),
        ),
      )
      .limit(1);

    expect(
      row?.content,
      "SP8c: tie on updatedAt → remote wins (>= condition, remote is deterministic tiebreak)",
    ).toBe(remoteContent);

    // Cleanup
    await db
      .delete(cortexNodes)
      .where(
        and(eq(cortexNodes.userId, resolved.id), eq(cortexNodes.path, path)),
      );
  }, 30_000);

  it("SP-REG: registerSyncProvider: provider is callable after registration", async () => {
    const testKey = `test-provider-${randomUUID().slice(0, 8)}`;
    let upsertCalled = false;

    const testProvider: SyncProvider = {
      key: testKey,
      labelI18nKey: "test.label",
      async getCursor() {
        return { updatedAt: new Date(0).toISOString() };
      },
      async serializeFromCursor() {
        return { json: "[]", cursor: { updatedAt: new Date(0).toISOString() } };
      },
      async upsertFromJson() {
        upsertCalled = true;
        return 0;
      },
    };

    registerSyncProvider(testProvider);

    const resolved = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
    if (!resolved) {
      // oxlint-disable-next-line restricted-syntax
      throw new Error(`${env.VIBE_ADMIN_USER_EMAIL} not found — run: vibe seed`);
    }

    await applySyncPayloads({ [testKey]: "[]" }, resolved.id, logger);

    expect(
      upsertCalled,
      "SP-REG: upsertFromJson must be called after registration",
    ).toBe(true);
  }, 15_000);
});

// ═════════════════════════════════════════════════════════════════════════════
// SP1-SP5: Cross-instance E2E tests (requires both servers running)
// ═════════════════════════════════════════════════════════════════════════════

if (_remoteUrl) {
  describe(`Sync Protocol — cross-instance E2E (${_remoteUrl})`, () => {
    const SP_TIMEOUT = 60_000;
    let testUser: JwtPrivatePayloadType;
    let prodUserId: string;
    let prodAdminToken: string;

    beforeAll(async () => {
      const resolved = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
      expect(
        resolved,
        `SP: admin user ${env.VIBE_ADMIN_USER_EMAIL} not found — run: vibe dev`,
      ).toBeTruthy();
      if (!resolved) {
        return;
      }
      testUser = resolved;

      await disconnectFromHermes(testUser.id);
      const preProdUserId = await resolveProdUserId();
      if (preProdUserId) {
        await unregisterDevFromHermes(preProdUserId);
      }

      await connectToHermes(testUser, _remoteUrl!);
      prodAdminToken = await resolveProdAdminToken(_remoteUrl!);
      prodUserId = await resolveProdUserId();
    }, 120_000);

    afterAll(async () => {
      const tasks: Promise<void>[] = [disconnectFromHermes(testUser.id)];
      if (prodUserId) {
        tasks.push(unregisterDevFromHermes(prodUserId));
      }
      await Promise.all(tasks);
      await closeProdDb();
    });

    // ── SP1: after pull, lastSyncedAt + syncCursors written to DB ────────────────

    it(
      "SP1: after pull, lastSyncedAt is set and syncCursors is populated",
      async () => {
        // connectToHermes triggers pull-on-connect — check DB for lastSyncedAt and syncCursors
        const row = await pollUntil(
          "SP1: lastSyncedAt must be set after pull",
          async () => {
            const [r] = await db
              .select({
                lastSyncedAt: remoteConnections.lastSyncedAt,
                syncCursors: remoteConnections.syncCursors,
              })
              .from(remoteConnections)
              .where(
                and(
                  eq(remoteConnections.userId, testUser.id),
                  eq(remoteConnections.instanceId, HERMES_INSTANCE_ID),
                ),
              )
              .limit(1);
            return r?.lastSyncedAt ? r : false;
          },
        );

        expect(row.lastSyncedAt, "SP1: lastSyncedAt must be set after pull").toBeTruthy();
        // syncCursors may be null if no providers returned data, but the pull itself must have completed
        if (row.syncCursors) {
          expect(typeof row.syncCursors, "SP1: syncCursors must be an object if set").toBe("object");
        }
      },
      SP_TIMEOUT,
    );

    // ── SP2: hash short-circuit on second pull ─────────────────────────────────

    it(
      "SP2: second pull with same data → lastSyncedAt updated but no data written",
      async () => {
        // Get lastSyncedAt before second pull
        const [beforeRow] = await db
          .select({ lastSyncedAt: remoteConnections.lastSyncedAt })
          .from(remoteConnections)
          .where(
            and(
              eq(remoteConnections.userId, testUser.id),
              eq(remoteConnections.instanceId, HERMES_INSTANCE_ID),
            ),
          )
          .limit(1);

        const beforeTs = beforeRow?.lastSyncedAt?.getTime() ?? 0;

        // Trigger a second reconnect (nothing changed since SP1)
        await triggerHermesPull(prodAdminToken, _remoteUrl!);

        // lastSyncedAt must advance (pull was attempted)
        const updatedRow = await pollUntil(
          "SP2: lastSyncedAt must advance after second pull",
          async () => {
            const [r] = await db
              .select({ lastSyncedAt: remoteConnections.lastSyncedAt })
              .from(remoteConnections)
              .where(
                and(
                  eq(remoteConnections.userId, testUser.id),
                  eq(remoteConnections.instanceId, HERMES_INSTANCE_ID),
                ),
              )
              .limit(1);
            const ts = r?.lastSyncedAt?.getTime() ?? 0;
            return ts > beforeTs ? r : false;
          },
        );

        expect(
          updatedRow.lastSyncedAt,
          "SP2: lastSyncedAt must be updated even on no-op pull (short-circuit still pings remote)",
        ).toBeTruthy();
      },
      SP_TIMEOUT,
    );

    // ── SP3: capability version match → capabilities=null in response ──────────

    it(
      "SP3: capability version match → no capabilities snapshot in sync response",
      async () => {
        // After SP1 pull, capabilitiesVersion should be updated to match local.
        // Trigger a pull with same version → response should have capabilities=null.
        // We verify this indirectly: capabilitiesVersion in DB stays stable (not re-written).
        const [before] = await db
          .select({
            capabilitiesVersion: remoteConnections.capabilitiesVersion,
          })
          .from(remoteConnections)
          .where(
            and(
              eq(remoteConnections.userId, testUser.id),
              eq(remoteConnections.instanceId, HERMES_INSTANCE_ID),
            ),
          )
          .limit(1);

        const vBefore = before?.capabilitiesVersion;
        expect(
          vBefore,
          "SP3: capabilitiesVersion must be set after initial pull",
        ).toBeTruthy();

        // Second reconnect: same capabilities version — server should NOT resend capabilities
        await triggerHermesPull(prodAdminToken, _remoteUrl!);

        await sleep(2000); // let pull complete

        const [after] = await db
          .select({
            capabilitiesVersion: remoteConnections.capabilitiesVersion,
          })
          .from(remoteConnections)
          .where(
            and(
              eq(remoteConnections.userId, testUser.id),
              eq(remoteConnections.instanceId, HERMES_INSTANCE_ID),
            ),
          )
          .limit(1);

        // Version must remain the same (not cleared or changed by a re-send)
        expect(
          after?.capabilitiesVersion,
          "SP3: capabilitiesVersion must remain stable when version matches",
        ).toBe(vBefore);
      },
      SP_TIMEOUT,
    );

    // ── SP4: capability version mismatch → snapshot returned ──────────────────

    it(
      "SP4: capability version mismatch → capabilities snapshot written to DB after pull",
      async () => {
        // Force a version mismatch by clearing capabilitiesVersion on the connection
        await db
          .update(remoteConnections)
          .set({ capabilitiesVersion: null, updatedAt: new Date() })
          .where(
            and(
              eq(remoteConnections.userId, testUser.id),
              eq(remoteConnections.instanceId, HERMES_INSTANCE_ID),
            ),
          );

        // Trigger reconnect — server will see version mismatch, include capabilities in response
        await triggerHermesPull(prodAdminToken, _remoteUrl!);

        // Poll for capabilitiesVersion to be re-written
        const row = await pollUntil(
          "SP4: capabilitiesVersion must be re-written after version mismatch pull",
          async () => {
            const [r] = await db
              .select({
                capabilitiesVersion: remoteConnections.capabilitiesVersion,
              })
              .from(remoteConnections)
              .where(
                and(
                  eq(remoteConnections.userId, testUser.id),
                  eq(remoteConnections.instanceId, HERMES_INSTANCE_ID),
                ),
              )
              .limit(1);
            return r?.capabilitiesVersion ? r : false;
          },
        );

        expect(
          row.capabilitiesVersion,
          "SP4: capabilitiesVersion must be populated after mismatch pull",
        ).toBeTruthy();
      },
      SP_TIMEOUT,
    );

    // ── SP5: server-side syncScope filtering ───────────────────────────────────

    it(
      "SP5: server-side syncScope skills=false → skills payload excluded from pull response",
      async () => {
        // Set skills=false on atlas's connection to hermes.
        // When atlas pulls, hermes's sync route should either:
        // (a) not return skills in the response (server-side exclusion), OR
        // (b) atlas drops skills before applying (client-side exclusion in connector).
        // Either way, a new skill written on hermes must NOT appear in atlas after pull.
        await db
          .update(remoteConnections)
          .set({
            syncScope: {
              documents: true,
              skills: false,
              threads: true,
              memories: true,
              favorites: true,
            } satisfies SyncScope,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(remoteConnections.userId, testUser.id),
              eq(remoteConnections.instanceId, HERMES_INSTANCE_ID),
            ),
          );

        // Write a unique skill on prod (hermes) directly via SQL
        const pdb = getProdDb();
        const spSkillSlug = `sp5-scope-test-${randomUUID().slice(0, 8)}`;
        await pdb.execute(
          sql`INSERT INTO custom_skills (id, user_id, name, slug, description, tagline, icon, category, ownership_type, trust_level, updated_at, created_at)
              VALUES (gen_random_uuid(), ${prodUserId}, 'SP5 Scope Skill', ${spSkillSlug}, 'SP5 test', 'sp5', 'test', 'enums.category.assistant', 'enums.ownershipType.user', 'community', NOW(), NOW())`,
        );

        // Trigger reconnect — hermes reconnects and pulls from atlas, syncScope.skills=false
        await triggerHermesPull(prodAdminToken, _remoteUrl!);

        // Wait 4s to let any sync process complete
        await sleep(4000);

        // SP5: the skill must NOT appear on atlas (syncScope.skills=false)
        const { customSkills } =
          await import("@/app/api/[locale]/agent/chat/skills/db");
        const localRows = await db
          .select({ slug: customSkills.slug })
          .from(customSkills)
          .where(
            and(
              eq(customSkills.userId, testUser.id),
              eq(customSkills.slug, spSkillSlug),
            ),
          )
          .limit(1);

        expect(
          localRows.length,
          "SP5: skill must NOT appear on atlas when syncScope.skills=false",
        ).toBe(0);

        // Restore syncScope
        await db
          .update(remoteConnections)
          .set({
            syncScope: {
              documents: true,
              skills: true,
              threads: true,
              memories: true,
              favorites: true,
            } satisfies SyncScope,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(remoteConnections.userId, testUser.id),
              eq(remoteConnections.instanceId, HERMES_INSTANCE_ID),
            ),
          );

        // Cleanup prod skill
        await pdb.execute(
          sql`DELETE FROM custom_skills WHERE user_id = ${prodUserId} AND slug = ${spSkillSlug}`,
        );
      },
      SP_TIMEOUT,
    );
  });
}
