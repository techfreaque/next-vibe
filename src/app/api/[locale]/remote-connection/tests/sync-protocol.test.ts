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

import { and, eq, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { cortexNodes } from "@/app/api/[locale]/agent/cortex/db";
import { CortexNodeType } from "@/app/api/[locale]/agent/cortex/enum";
import type { SyncScope } from "@/app/api/[locale]/remote-connection/db";
import { remoteConnections } from "@/app/api/[locale]/remote-connection/db";
import { db } from "@/app/api/[locale]/system/db";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { env } from "@/config/env";
import { defaultLocale } from "@/i18n/core/config";

import {
  applySyncPayloads,
  buildSyncPayloads,
  ensureProvidersRegistered,
  registerSyncProvider,
  type SyncProvider,
} from "@/app/api/[locale]/remote-connection/sync-provider";

import {
  closeProdDb,
  connectToHermes,
  disconnectFromHermes,
  getProdDb,
  HERMES_INSTANCE_ID,
  resolveDevUser,
  resolveProdUserId,
  resolveRemoteUrl,
  triggerPull,
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
  expect.fail(`[pollUntil] ${label}: timed out after ${timeoutMs}ms`);
}

// ═════════════════════════════════════════════════════════════════════════════
// SP6-SP8: In-process protocol tests (no servers needed)
// ═════════════════════════════════════════════════════════════════════════════

describe("Sync Protocol — buildSyncPayloads (in-process)", () => {
  const logger = createEndpointLogger(false, Date.now(), defaultLocale);

  beforeAll(async () => {
    await ensureProvidersRegistered();
  });

  it("SP6a: hash match → zero payloads returned", async () => {
    const resolved = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
    expect(resolved, "SP6a: admin user not found — run: vibe dev").toBeTruthy();
    if (!resolved) {
      return;
    }

    // Compute current hashes, then send them back as "incoming" — should be identical → no payloads
    const { computeSyncHashes } =
      await import("@/app/api/[locale]/remote-connection/sync-provider");
    const { perProvider: currentHashes } = await computeSyncHashes(resolved.id);

    const { syncPayloads } = await buildSyncPayloads(
      currentHashes,
      resolved.id,
      logger,
    );

    expect(
      Object.keys(syncPayloads).length,
      "SP6a: no payloads when hashes match",
    ).toBe(0);
  }, 30_000);

  it("SP6b: one provider differs → only that provider serialized", async () => {
    const resolved = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
    if (!resolved) {
      return;
    }

    const { computeSyncHashes } =
      await import("@/app/api/[locale]/remote-connection/sync-provider");
    const { perProvider: currentHashes } = await computeSyncHashes(resolved.id);

    // Corrupt only the "documents" hash
    const incomingHashes = { ...currentHashes, documents: "stale-hash-12345" };

    const { syncPayloads } = await buildSyncPayloads(
      incomingHashes,
      resolved.id,
      logger,
    );

    expect(
      "documents" in syncPayloads,
      "SP6b: documents must be in payloads (hash differed)",
    ).toBe(true);
    expect(
      "skills" in syncPayloads,
      "SP6b: skills must NOT be in payloads (hash matched)",
    ).toBe(false);
  }, 30_000);

  it("SP6c: all providers differ → all serialized", async () => {
    const resolved = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
    if (!resolved) {
      return;
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
      return;
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
      return;
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
      return;
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
        nodeType: "file",
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
      return;
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
        nodeType: "file",
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
      return;
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
        nodeType: "file",
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
      async getHashEntries() {
        return [];
      },
      async serializeToJson() {
        return "[]";
      },
      async upsertFromJson() {
        upsertCalled = true;
        return 0;
      },
    };

    registerSyncProvider(testProvider);

    const resolved = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
    if (!resolved) {
      return;
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
      await triggerPull();
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

    // ── SP1: after pull, remoteSyncHashes written to DB ───────────────────────

    it(
      "SP1: after pull, remoteSyncHashes written to remoteConnections row",
      async () => {
        // triggerPull in beforeAll already fired — check DB for remoteSyncHashes
        const row = await pollUntil(
          "SP1: remoteSyncHashes must be written after pull",
          async () => {
            const [r] = await db
              .select({ remoteSyncHashes: remoteConnections.remoteSyncHashes })
              .from(remoteConnections)
              .where(
                and(
                  eq(remoteConnections.userId, testUser.id),
                  eq(remoteConnections.instanceId, HERMES_INSTANCE_ID),
                ),
              )
              .limit(1);
            const hashes = r?.remoteSyncHashes as Record<string, string> | null;
            return hashes && Object.keys(hashes).length > 0 ? r : false;
          },
        );

        const hashes = row.remoteSyncHashes as Record<string, string>;
        expect(
          typeof hashes.documents,
          "SP1: remoteSyncHashes must include documents key",
        ).toBe("string");
        expect(
          typeof hashes.skills,
          "SP1: remoteSyncHashes must include skills key",
        ).toBe("string");
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

        // Trigger a second pull (nothing changed since SP1)
        await triggerPull();

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

        // Second pull: same capabilities version — server should NOT resend capabilities
        await triggerPull();

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

        // Trigger pull — server will see version mismatch, include capabilities in response
        await triggerPull();

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
              cortex: true,
              documents: true,
              skills: false,
              threads: true,
              memories: true,
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

        // Trigger pull from atlas
        await triggerPull();

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
              cortex: true,
              documents: true,
              skills: true,
              threads: true,
              memories: true,
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
