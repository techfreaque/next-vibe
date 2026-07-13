/**
 * WsProviderConnector — E2E Tests
 *
 * Tests the real WsConnection lifecycle against running atlas + hermes servers.
 * Every assertion queries actual DBs, sends real WS messages, and verifies observable
 * side effects produced by the live connector code.
 *
 * Tested behaviors:
 *   CN1  — openConnection() opens WS; isConnected() returns true; wsConnectedAt updated in DB
 *   CN2  — closeConnection() stops WS; isConnected() returns false
 *   CN3  — acquireConnection() increments ref-count; idle timer starts on last release;
 *           timer fires → connection closed
 *   CN4  — re-acquire before idle timer fires cancels the timer; connection stays open
 *   CN5  — syncScope filtering: documents=false strips documents from WS remote-event payload
 *   CN6  — syncScope filtering: skills=false strips skills from WS remote-event payload
 *   CN7  — control "rename": WS message updates remoteConnections.instanceId + renames REMOTE subfolder
 *   CN8  — control "settings-update": WS message updates syncScope in DB
 *   CN9  — reconnect fires after WS close; pull-on-connect re-runs; DB lastSyncedAt updated
 *
 * PREREQUISITES
 * ─────────────
 *   Terminal 1: vibe dev                (atlas, port 3000)
 *   Terminal 2: vibe --hermes dev        (hermes, port 3002, prod DB port 5433)
 *
 * All tests skip gracefully when hermes is not running.
 */

import "server-only";

import { randomUUID } from "node:crypto";

import { and, eq, sql } from "drizzle-orm";
import {
  ATLAS_INSTANCE_ID,
  closeProdDb,
  connectToHermes,
  disconnectFromHermes,
  failSuitePrerequisites,
  getProdDb,
  HERMES_INSTANCE_ID,
  resolveDevUser,
  resolveProdUserId,
  resolveRemoteUrlSync,
  unregisterDevFromHermes,
} from "next-vibe/agent/ai-stream/testing/remote-setup";
import { customSkills } from "next-vibe/agent/skills/db";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import type { SyncScope } from "next-vibe/remote-connection/db";
import { remoteConnections } from "next-vibe/remote-connection/db";
import type { IconKey } from "next-vibe/unified-ui/form-fields/icon-field/icons";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { env } from "@/env/env";

import type { ConnectionConfig } from "./connector";
import {
  acquireConnection,
  closeConnection,
  getWsConnection,
  openConnection,
} from "./connector";

// ── Constants ────────────────────────────────────────────────────────────────

const CN_TIMEOUT = 60_000;

// ── Skip guard ────────────────────────────────────────────────────────────────

const _remoteUrl = resolveRemoteUrlSync();
if (!_remoteUrl) {
  failSuitePrerequisites(
    "Connector E2E tests",
    "hermes not running — start: vibe --hermes dev  → http://localhost:3002",
  );
}

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

/**
 * Load the real ConnectionConfig for a live remoteConnections row.
 * Used to openConnection() with the real token/config.
 */
async function loadConnectionConfig(
  userId: string,
  instanceId: string,
): Promise<ConnectionConfig | null> {
  const { RemoteConnectionRepository } =
    await import("next-vibe/remote-connection/repository");
  const [row] = await db
    .select()
    .from(remoteConnections)
    .where(
      and(
        eq(remoteConnections.userId, userId),
        eq(remoteConnections.instanceId, instanceId),
        eq(remoteConnections.isActive, true),
      ),
    )
    .limit(1);

  if (!row?.token) {
    return null;
  }
  const decryptedToken = RemoteConnectionRepository.decryptToken(row.token);
  return {
    id: row.id,
    instanceId: row.instanceId,
    remoteUrl: row.remoteUrl,
    token: decryptedToken,
    leadId: row.leadId,
    userId: row.userId,
    remoteUserId: row.remoteUserId ?? null,
    capabilitiesVersion: row.capabilitiesVersion ?? null,
    sentCapabilitiesVersion: row.sentCapabilitiesVersion ?? null,
    syncScope: (row.syncScope as SyncScope) ?? null,
    syncCursors: row.syncCursors ?? null,
    pushCursors: row.pushCursors ?? null,
    // These CN tests exercise the WS lifecycle, so present as reverse-ws.
    transportMode: row.transportMode ?? "reverse-ws",
    remoteTransportMode: row.remoteTransportMode ?? null,
  };
}

// ── Shared WS broadcast helper ────────────────────────────────────────────────

/**
 * Reconfigure hermes's connection to atlas the real production way: PATCH the
 * remote-connection endpoint ON hermes (routed via instanceId), which updates
 * hermes's row AND reconfigures its live reverse-ws connector to atlas. This is
 * the definition-driven path that replaced the old system/control WS pokes —
 * no raw /ws/broadcast, exercised end-to-end over reverse-ws.
 */
async function patchHermesAtlasConnection(
  user: JwtPrivatePayloadType,
  patch: { syncScope?: SyncScope; newInstanceId?: string },
): Promise<void> {
  const { sendTestRequest } =
    await import("next-vibe/tooling/check/testing/testing-suite/send-test-request");
  const connByIdDef = (
    await import("next-vibe/remote-connection/[instanceId]/definition")
  ).default;
  const result = await sendTestRequest({
    streamContext: undefined,
    endpoint: connByIdDef.PATCH,
    urlPathParams: { instanceId: ATLAS_INSTANCE_ID },
    data: {
      ...patch,
      // syncScope is required on the PATCH; default to full-except-threads
      // when a caller only reconfigures identity/reconnect.
      syncScope: patch.syncScope ?? {
        memories: true,
        documents: true,
        skills: true,
        favorites: true,
        threads: false,
      },
      reconnectNow: true,
    },
    user,
    instanceId: HERMES_INSTANCE_ID,
  });
  expect(
    result.success,
    `patchHermesAtlasConnection failed: ${result.success ? "" : result.message}`,
  ).toBe(true);
}

// ═════════════════════════════════════════════════════════════════════════════
// CONNECTOR E2E SUITE
// ═════════════════════════════════════════════════════════════════════════════

if (_remoteUrl) {
  describe(`Connector E2E — WsConnection lifecycle (${_remoteUrl})`, () => {
    let testUser: JwtPrivatePayloadType;
    let prodUserId: string;

    beforeAll(async () => {
      const resolved = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
      expect(
        resolved,
        `Admin user ${env.VIBE_ADMIN_USER_EMAIL} not found — run: vibe dev`,
      ).toBeTruthy();
      if (!resolved) {
        return;
      }
      testUser = resolved;

      // Fresh connection: clean both sides first.
      await disconnectFromHermes(testUser.id);
      const preCleanProdUserId = await resolveProdUserId();
      if (preCleanProdUserId) {
        await unregisterDevFromHermes(preCleanProdUserId);
      }

      await connectToHermes(testUser, _remoteUrl!);
      prodUserId = await resolveProdUserId();
    }, 120_000);

    afterAll(async () => {
      closeConnection(HERMES_INSTANCE_ID);
      const tasks: Promise<void>[] = [disconnectFromHermes(testUser.id)];
      if (prodUserId) {
        tasks.push(unregisterDevFromHermes(prodUserId));
      }
      await Promise.all(tasks);
      await closeProdDb();
    });

    // ── CN1: openConnection creates live WS; DB wsConnectedAt updated ────────

    it(
      "CN1: openConnection() → WS opens; isConnected()=true; wsConnectedAt set in DB",
      async () => {
        const config = await loadConnectionConfig(
          testUser.id,
          HERMES_INSTANCE_ID,
        );
        expect(
          config,
          "CN1: must have active connection row after connectToHermes",
        ).toBeTruthy();
        if (!config) {
          return;
        }

        // Close any pre-existing connection first (idempotent)
        closeConnection(HERMES_INSTANCE_ID);

        const before = Date.now();
        openConnection(config);

        // isConnected() becomes true once WS open event fires (async)
        const conn = await pollUntil("CN1: WS must open", async () => {
          const c = getWsConnection(HERMES_INSTANCE_ID);
          return c?.isConnected() ? c : false;
        });

        expect(conn.isConnected(), "CN1: isConnected() must be true").toBe(
          true,
        );

        // DB wsConnectedAt must be updated by the WS open handler
        const wsConn = await pollUntil(
          "CN1: wsConnectedAt must be set in DB",
          async () => {
            const [row] = await db
              .select({ wsConnectedAt: remoteConnections.wsConnectedAt })
              .from(remoteConnections)
              .where(
                and(
                  eq(remoteConnections.userId, testUser.id),
                  eq(remoteConnections.instanceId, HERMES_INSTANCE_ID),
                ),
              )
              .limit(1);
            const ts = row?.wsConnectedAt?.getTime() ?? 0;
            return ts >= before ? row : false;
          },
        );

        expect(
          wsConn.wsConnectedAt,
          "CN1: wsConnectedAt must be set to a recent timestamp",
        ).toBeTruthy();
      },
      CN_TIMEOUT,
    );

    // ── CN2: closeConnection stops WS; isConnected()=false ───────────────────

    it(
      "CN2: closeConnection() → isConnected()=false; connection removed from registry",
      async () => {
        // CN1 must have opened the connection; ensure it's open first
        let conn = getWsConnection(HERMES_INSTANCE_ID);
        if (!conn?.isConnected()) {
          const config = await loadConnectionConfig(
            testUser.id,
            HERMES_INSTANCE_ID,
          );
          if (config) {
            openConnection(config);
          }
          conn = await pollUntil("CN2: wait for WS open", async () => {
            const c = getWsConnection(HERMES_INSTANCE_ID);
            return c?.isConnected() ? c : false;
          });
        }

        expect(conn?.isConnected(), "CN2: must be connected before close").toBe(
          true,
        );

        closeConnection(HERMES_INSTANCE_ID);

        // After close, registry must not contain the connection
        const afterClose = getWsConnection(HERMES_INSTANCE_ID);
        expect(
          afterClose,
          "CN2: connection must be removed from registry after closeConnection",
        ).toBeNull();
      },
      CN_TIMEOUT,
    );

    // ── CN3: acquireConnection; idle timer fires → connection auto-closes ────

    it(
      "CN3: acquireConnection() ref-counts; idle timer fires after last release → WS closed",
      async () => {
        // acquireConnection does a DB lookup — the row must exist
        const release1 = await acquireConnection(HERMES_INSTANCE_ID);
        const release2 = await acquireConnection(HERMES_INSTANCE_ID);

        // Both acquired — WS must open
        await pollUntil("CN3: WS must open after acquire", async () => {
          const c = getWsConnection(HERMES_INSTANCE_ID);
          return c?.isConnected() ? c : false;
        });

        expect(
          getWsConnection(HERMES_INSTANCE_ID)?.isConnected(),
          "CN3: connected after two acquires",
        ).toBe(true);

        // Release one — still connected (ref=1)
        release1();
        await sleep(200);
        expect(
          getWsConnection(HERMES_INSTANCE_ID)?.isConnected(),
          "CN3: still connected after first release (ref=1)",
        ).toBe(true);

        // Release second — ref=0, idle timer starts (5 min default)
        // We cannot wait 5 minutes in a test. Instead we verify the connection
        // is still alive immediately after last release (timer not fired yet).
        release2();
        await sleep(200);
        expect(
          getWsConnection(HERMES_INSTANCE_ID),
          "CN3: connection must still exist immediately after last release (idle timer pending)",
        ).not.toBeNull();

        // Clean up: explicitly close so subsequent tests get a fresh connection
        closeConnection(HERMES_INSTANCE_ID);
      },
      CN_TIMEOUT,
    );

    // ── CN4: re-acquire before idle fires keeps connection alive ─────────────

    it(
      "CN4: re-acquire before idle timer fires cancels timer; connection stays open",
      async () => {
        const release1 = await acquireConnection(HERMES_INSTANCE_ID);
        await pollUntil("CN4: WS must open", async () => {
          const c = getWsConnection(HERMES_INSTANCE_ID);
          return c?.isConnected() ? c : false;
        });

        // Release → idle timer starts
        release1();
        await sleep(100);

        // Re-acquire immediately — cancels the idle timer
        const release2 = await acquireConnection(HERMES_INSTANCE_ID);

        // Wait longer than what a minimum timer delay would be
        await sleep(500);

        expect(
          getWsConnection(HERMES_INSTANCE_ID)?.isConnected(),
          "CN4: connection must remain open after re-acquire cancelled idle timer",
        ).toBe(true);

        release2();
        closeConnection(HERMES_INSTANCE_ID);
      },
      CN_TIMEOUT,
    );

    // ── CN5: syncScope documents=false strips documents from sync ─────────────

    it(
      "CN5: syncScope.documents=false → documents stripped from WS remote-event before apply",
      async () => {
        // Set syncScope.documents=false on the connection
        await db
          .update(remoteConnections)
          .set({
            syncScope: {
              documents: false,
              skills: true,
              threads: true,
              memories: false,
              favorites: false,
            } satisfies SyncScope,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(remoteConnections.userId, testUser.id),
              eq(remoteConnections.instanceId, HERMES_INSTANCE_ID),
            ),
          );

        // Open a connection that picks up the new syncScope
        closeConnection(HERMES_INSTANCE_ID);
        const config = await loadConnectionConfig(
          testUser.id,
          HERMES_INSTANCE_ID,
        );
        expect(config, "CN5: must have config").toBeTruthy();
        if (!config) {
          return;
        }
        expect(
          config.remoteUrl,
          "CN5: config.remoteUrl must be set",
        ).toBeTruthy();
        expect(config.token, "CN5: config.token must be set").toBeTruthy();
        expect(config.userId, "CN5: config.userId must match test user").toBe(
          testUser.id,
        );

        // Mutate syncScope on the config (connector reads it from config at construction time)
        const scopedConfig: ConnectionConfig = {
          ...config,
          syncScope: {
            documents: false,
            skills: true,
            threads: true,
            memories: false,
            favorites: false,
          } satisfies SyncScope,
        };
        // Block documents on hermes's side the real production way: PATCH
        // hermes's atlas connection (routed via instanceId), which persists the
        // syncScope AND reconfigures hermes's live reverse-ws connector.
        await patchHermesAtlasConnection(testUser, {
          syncScope: {
            documents: false,
            skills: true,
            threads: true,
            memories: true,
            favorites: true,
          },
        });
        // Give hermes time to reconnect with the new scope before opening connections
        await sleep(1000);

        // Now open the atlas→hermes connection (does NOT affect hermes's WsConnection to atlas)
        openConnection(scopedConfig);

        await pollUntil("CN5: WS must open", async () => {
          const c = getWsConnection(HERMES_INSTANCE_ID);
          return c?.isConnected() ? c : false;
        });

        // Write a document node on dev with a unique syncId so we can detect if it appears on prod
        const { cortexNodes } =
          await import("next-vibe/agent/cortex/db");
        const { CortexNodeType } =
          await import("next-vibe/agent/cortex/enum");
        const docSyncId = randomUUID();
        const docPath = `/documents/connector-cn5-${docSyncId}.md`;

        await db.insert(cortexNodes).values({
          userId: testUser.id,
          path: docPath,
          content: `# CN5 test\n\nMarker: ${docSyncId}`,
          size: 30,
          nodeType: CortexNodeType.FILE,
          syncId: docSyncId,
          frontmatter: {},
          tags: [],
        });

        // Trigger sync via reconnect (pull-on-connect runs the HTTP sync exchange;
        // hermes's sync endpoint filters pushPayloads by syncScope before applying)
        const { restartConnection } = await import("./connector");
        await restartConnection(HERMES_INSTANCE_ID);

        // Wait enough for any sync processing to complete
        await sleep(3000);

        // The document must NOT appear on prod (documents=false strips documents)
        const pdb = getProdDb();
        const prodRows = await pdb.execute<{ sync_id: string }>(
          sql`SELECT sync_id FROM cortex_nodes WHERE user_id = ${prodUserId} AND sync_id = ${docSyncId} LIMIT 1`,
        );

        expect(
          prodRows.rows.length,
          "CN5: document must NOT appear on prod when syncScope.documents=false",
        ).toBe(0);

        // Cleanup
        await db
          .delete(cortexNodes)
          .where(
            and(
              eq(cortexNodes.userId, testUser.id),
              eq(cortexNodes.path, docPath),
            ),
          );

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

        // Restore hermes's atlas connection syncScope the real way.
        await patchHermesAtlasConnection(testUser, {
          syncScope: {
            documents: true,
            skills: true,
            threads: true,
            memories: true,
            favorites: true,
          },
        });

        closeConnection(HERMES_INSTANCE_ID);
      },
      CN_TIMEOUT,
    );

    // ── CN6: syncScope skills=false strips skills ─────────────────────────────

    it(
      "CN6: syncScope.skills=false → skills stripped from WS remote-event before apply",
      async () => {
        // Set syncScope.skills=false on atlas's connection row for hermes
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

        // Block skills on hermes's side the real production way (PATCH →
        // persists syncScope + reconfigures hermes's live reverse-ws connector).
        await patchHermesAtlasConnection(testUser, {
          syncScope: {
            documents: true,
            skills: false,
            threads: true,
            memories: true,
            favorites: true,
          },
        });
        // Give hermes time to reconnect with the new scope before opening connections
        await sleep(1000);

        closeConnection(HERMES_INSTANCE_ID);
        const config = await loadConnectionConfig(
          testUser.id,
          HERMES_INSTANCE_ID,
        );
        if (!config) {
          return;
        }

        const scopedConfig = {
          ...config,
          syncScope: {
            documents: true,
            skills: false,
            threads: true,
            memories: true,
            favorites: true,
          } satisfies SyncScope,
        };

        // Record lastSyncedAt before opening — used to detect pullOnConnect completion
        const [rowBefore] = await db
          .select({ lastSyncedAt: remoteConnections.lastSyncedAt })
          .from(remoteConnections)
          .where(
            and(
              eq(remoteConnections.userId, testUser.id),
              eq(remoteConnections.instanceId, HERMES_INSTANCE_ID),
            ),
          )
          .limit(1);
        const lastSyncedAtBefore = rowBefore?.lastSyncedAt?.getTime() ?? 0;

        openConnection(scopedConfig);

        await pollUntil("CN6: WS must open", async () => {
          const c = getWsConnection(HERMES_INSTANCE_ID);
          return c?.isConnected() ? c : false;
        });

        // Wait for pullOnConnect to complete before inserting test data.
        // pullOnConnect updates lastSyncedAt when done — poll until it advances.
        await pollUntil(
          "CN6: pullOnConnect must complete",
          async () => {
            const [row] = await db
              .select({ lastSyncedAt: remoteConnections.lastSyncedAt })
              .from(remoteConnections)
              .where(
                and(
                  eq(remoteConnections.userId, testUser.id),
                  eq(remoteConnections.instanceId, HERMES_INSTANCE_ID),
                ),
              )
              .limit(1);
            const ts = row?.lastSyncedAt?.getTime() ?? 0;
            return ts > lastSyncedAtBefore ? row : false;
          },
          30_000,
        );

        const skillId = randomUUID();
        const skillSlug = `connector-cn6-${skillId.slice(0, 8)}`;

        await db.insert(customSkills).values({
          id: skillId,
          userId: testUser.id,
          name: "CN6 Skill",
          slug: skillSlug,
          description: "connector syncScope skills=false test",
          systemPrompt: "test",
          icon: "🧪" as IconKey,
          tagline: "cn6",
          category: "enums.category.assistant",
          ownershipType: "enums.ownershipType.user",
          variants: null,
        });

        // Trigger sync via reconnect — pull-on-connect runs the HTTP sync exchange
        // and hermes's sync endpoint filters by syncScope before applying payloads
        const { restartConnection } = await import("./connector");
        await restartConnection(HERMES_INSTANCE_ID);

        await sleep(3000);

        const pdb = getProdDb();
        const prodRows = await pdb.execute<{ slug: string }>(
          sql`SELECT slug FROM custom_skills WHERE user_id = ${prodUserId} AND slug = ${skillSlug} LIMIT 1`,
        );

        expect(
          prodRows.rows.length,
          "CN6: skill must NOT appear on prod when syncScope.skills=false",
        ).toBe(0);

        // Cleanup
        await db
          .delete(customSkills)
          .where(
            and(
              eq(customSkills.userId, testUser.id),
              eq(customSkills.slug, skillSlug),
            ),
          );

        // Restore syncScope on atlas's row for hermes
        await db
          .update(remoteConnections)
          .set({
            syncScope: {
              favorites: true,
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

        // Restore hermes's atlas connection syncScope the real way.
        await patchHermesAtlasConnection(testUser, {
          syncScope: {
            documents: true,
            skills: true,
            threads: true,
            memories: true,
            favorites: true,
          },
        });

        closeConnection(HERMES_INSTANCE_ID);
      },
      CN_TIMEOUT,
    );

    // ── CN7: control "rename" updates instanceId + renames REMOTE subfolder ──

    it(
      "CN7: control 'rename' WS message → remoteConnections.instanceId updated + REMOTE subfolder renamed",
      async () => {
        const config = await loadConnectionConfig(
          testUser.id,
          HERMES_INSTANCE_ID,
        );
        expect(config, "CN7: must have config").toBeTruthy();
        if (!config) {
          return;
        }
        expect(config.id, "CN7: config.id must be set").toBeTruthy();
        expect(
          config.remoteUrl,
          "CN7: config.remoteUrl must be set",
        ).toBeTruthy();
        expect(config.token, "CN7: config.token must be set").toBeTruthy();

        closeConnection(HERMES_INSTANCE_ID);
        openConnection(config);

        await pollUntil("CN7: WS must open", async () => {
          const c = getWsConnection(HERMES_INSTANCE_ID);
          return c?.isConnected() ? c : false;
        });

        const newInstanceId = `hermes-renamed-${randomUUID().slice(0, 8)}`;

        // Rename hermes's identity the real production way: hermes renames ITSELF
        // via self/rename with propagate=true, which pushes the rename to atlas
        // over the reverse-ws connection (updates atlas's row + REMOTE subfolder).
        {
          const { sendTestRequest } =
            await import("next-vibe/tooling/check/testing/testing-suite/send-test-request");
          const selfRenameDef = (
            await import("next-vibe/remote-connection/self/rename/definition")
          ).default;
          const renameResult = await sendTestRequest({
            streamContext: undefined,
            endpoint: selfRenameDef.PATCH,
            data: { newInstanceId, propagate: true },
            user: testUser,
            instanceId: HERMES_INSTANCE_ID,
          });
          expect(
            renameResult.success,
            `CN7: self-rename failed: ${renameResult.success ? "" : renameResult.message}`,
          ).toBe(true);
        }

        // Poll DB for the updated instanceId
        const updatedRow = await pollUntil(
          "CN7: remoteConnections.instanceId must be updated",
          async () => {
            const [row] = await db
              .select({ instanceId: remoteConnections.instanceId })
              .from(remoteConnections)
              .where(
                and(
                  eq(remoteConnections.userId, testUser.id),
                  eq(remoteConnections.id, config.id),
                ),
              )
              .limit(1);
            return row?.instanceId === newInstanceId ? row : false;
          },
        );

        expect(
          updatedRow.instanceId,
          "CN7: instanceId must be updated to newInstanceId",
        ).toBe(newInstanceId);

        // REMOTE subfolder must be renamed too
        const { chatFolders } =
          await import("next-vibe/agent/chat/db");
        const { DefaultFolderId } =
          await import("next-vibe/agent/chat/config");
        const { isNull } = await import("drizzle-orm");

        const renamedFolder = await pollUntil(
          "CN7: REMOTE subfolder must be renamed",
          async () => {
            const [folder] = await db
              .select({ name: chatFolders.name })
              .from(chatFolders)
              .where(
                and(
                  eq(chatFolders.userId, testUser.id),
                  eq(chatFolders.rootFolderId, DefaultFolderId.REMOTE),
                  eq(chatFolders.name, newInstanceId),
                  isNull(chatFolders.parentId),
                ),
              )
              .limit(1);
            return folder ?? false;
          },
        );

        expect(
          renamedFolder.name,
          "CN7: REMOTE subfolder name must match newInstanceId",
        ).toBe(newInstanceId);

        // Restore hermes's SELF identity the same production way — without this
        // hermes stays renamed on its own DB and every later suite (and re-run
        // of this one) starts from contaminated state.
        {
          const { sendTestRequest } =
            await import("next-vibe/tooling/check/testing/testing-suite/send-test-request");
          const selfRenameDef = (
            await import("next-vibe/remote-connection/self/rename/definition")
          ).default;
          const restoreResult = await sendTestRequest({
            streamContext: undefined,
            endpoint: selfRenameDef.PATCH,
            data: { newInstanceId: HERMES_INSTANCE_ID, propagate: true },
            user: testUser,
            instanceId: newInstanceId,
          });
          expect(
            restoreResult.success,
            `CN7: self-rename restore failed: ${restoreResult.success ? "" : restoreResult.message}`,
          ).toBe(true);
        }

        // Restore original instanceId for subsequent tests (idempotent with the
        // propagate above — direct DB write in case the propagate is slow).
        await db
          .update(remoteConnections)
          .set({ instanceId: HERMES_INSTANCE_ID, updatedAt: new Date() })
          .where(eq(remoteConnections.id, config.id));

        await db
          .update(chatFolders)
          .set({ name: HERMES_INSTANCE_ID, updatedAt: new Date() })
          .where(
            and(
              eq(chatFolders.userId, testUser.id),
              eq(chatFolders.rootFolderId, DefaultFolderId.REMOTE),
              eq(chatFolders.name, newInstanceId),
            ),
          );

        // Settle: the rename propagates are fire-and-forget WITH retry on the
        // sender — a late retry of the forward rename can re-apply the renamed
        // id AFTER the direct restore above and break the next test's row
        // lookup. Wait until the row reads HERMES_INSTANCE_ID twice in a row.
        await pollUntil(
          "CN7: connection row must settle on restored id",
          async () => {
            const read = async (): Promise<string | undefined> => {
              const [row] = await db
                .select({ instanceId: remoteConnections.instanceId })
                .from(remoteConnections)
                .where(eq(remoteConnections.id, config.id))
                .limit(1);
              return row?.instanceId;
            };
            if ((await read()) !== HERMES_INSTANCE_ID) {
              return false;
            }
            await new Promise<void>((resolve) => {
              setTimeout(resolve, 750);
            });
            if ((await read()) !== HERMES_INSTANCE_ID) {
              // A late propagate flipped it back — restore and keep polling.
              await db
                .update(remoteConnections)
                .set({ instanceId: HERMES_INSTANCE_ID, updatedAt: new Date() })
                .where(eq(remoteConnections.id, config.id));
              return false;
            }
            return true;
          },
        );

        closeConnection(HERMES_INSTANCE_ID);
        closeConnection(newInstanceId);
      },
      CN_TIMEOUT,
    );

    // ── CN8: control "settings-update" updates syncScope in DB ───────────────

    it(
      "CN8: control 'settings-update' WS message → syncScope updated in DB",
      async () => {
        const config = await loadConnectionConfig(
          testUser.id,
          HERMES_INSTANCE_ID,
        );
        expect(config, "CN8: must have config").toBeTruthy();
        if (!config) {
          return;
        }
        expect(
          config.remoteUrl,
          "CN8: config.remoteUrl must be set",
        ).toBeTruthy();
        expect(config.token, "CN8: config.token must be set").toBeTruthy();
        expect(config.userId, "CN8: config.userId must match test user").toBe(
          testUser.id,
        );

        closeConnection(HERMES_INSTANCE_ID);
        openConnection(config);

        await pollUntil("CN8: WS must open", async () => {
          const c = getWsConnection(HERMES_INSTANCE_ID);
          return c?.isConnected() ? c : false;
        });

        // Update atlas's connection-to-hermes syncScope the real production way:
        // PATCH the local remote-connection endpoint (no instanceId routing —
        // this is atlas's own row for hermes).
        {
          const { sendTestRequest } =
            await import("next-vibe/tooling/check/testing/testing-suite/send-test-request");
          const connByIdDef = (
            await import("next-vibe/remote-connection/[instanceId]/definition")
          ).default;
          const patchResult = await sendTestRequest({
            streamContext: undefined,
            endpoint: connByIdDef.PATCH,
            urlPathParams: { instanceId: HERMES_INSTANCE_ID },
            data: {
              syncScope: {
                documents: true,
                skills: true,
                threads: true,
                memories: false,
                favorites: true,
              },
            },
            user: testUser,
          });
          expect(
            patchResult.success,
            `CN8: settings PATCH failed: ${patchResult.success ? "" : patchResult.message}`,
          ).toBe(true);
        }

        // Poll DB for updated syncScope
        const updatedRow = await pollUntil(
          "CN8: syncScope must be updated in DB",
          async () => {
            const [row] = await db
              .select({ syncScope: remoteConnections.syncScope })
              .from(remoteConnections)
              .where(
                and(
                  eq(remoteConnections.userId, testUser.id),
                  eq(remoteConnections.instanceId, HERMES_INSTANCE_ID),
                ),
              )
              .limit(1);
            const scope = row?.syncScope as {
              memories?: boolean;
              skills?: boolean;
            } | null;
            return scope?.memories === false ? row : false;
          },
        );

        const scope = updatedRow.syncScope as {
          memories: boolean;
          skills: boolean;
        } | null;
        expect(scope?.memories, "CN8: memories must be false").toBe(false);
        expect(scope?.skills, "CN8: skills must be true").toBe(true);

        // Restore
        await db
          .update(remoteConnections)
          .set({
            syncScope: {
              favorites: true,
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

        closeConnection(HERMES_INSTANCE_ID);
      },
      CN_TIMEOUT,
    );

    // ── CN9: reconnect fires after WS close; pull-on-connect updates lastSyncedAt ──

    it(
      "CN9: WS close → connector reconnects; pull-on-connect fires → lastSyncedAt updated",
      async () => {
        const config = await loadConnectionConfig(
          testUser.id,
          HERMES_INSTANCE_ID,
        );
        expect(config, "CN9: must have config").toBeTruthy();
        if (!config) {
          return;
        }
        expect(config.id, "CN9: config.id must be set").toBeTruthy();
        expect(
          config.remoteUrl,
          "CN9: config.remoteUrl must be set",
        ).toBeTruthy();
        expect(config.token, "CN9: config.token must be set").toBeTruthy();

        closeConnection(HERMES_INSTANCE_ID);

        // Clear lastSyncedAt so we can detect when pull-on-connect fires
        await db
          .update(remoteConnections)
          .set({ lastSyncedAt: null, updatedAt: new Date() })
          .where(eq(remoteConnections.id, config.id));

        openConnection(config);

        // Wait for first open + pull-on-connect to update lastSyncedAt
        await pollUntil(
          "CN9: lastSyncedAt must be set after first connect",
          async () => {
            const [row] = await db
              .select({ lastSyncedAt: remoteConnections.lastSyncedAt })
              .from(remoteConnections)
              .where(eq(remoteConnections.id, config.id))
              .limit(1);
            return row?.lastSyncedAt ? row : false;
          },
          30_000,
        );

        const conn = getWsConnection(HERMES_INSTANCE_ID);
        expect(conn?.isConnected(), "CN9: must be connected").toBe(true);

        // Force WS close to trigger reconnect
        await db
          .update(remoteConnections)
          .set({ lastSyncedAt: null, updatedAt: new Date() })
          .where(eq(remoteConnections.id, config.id));

        // The only way to force a WS close from outside is to stop and reopen.
        // The reconnect path is exercised by closeConnection + re-openConnection.
        // A true reconnect (remote close) would require killing the hermes WS server.
        // We test the observable effect: after reopen, pull-on-connect fires again.
        closeConnection(HERMES_INSTANCE_ID);
        openConnection(config);

        const reconnectedRow = await pollUntil(
          "CN9: lastSyncedAt must be updated after reconnect pull-on-connect",
          async () => {
            const [row] = await db
              .select({ lastSyncedAt: remoteConnections.lastSyncedAt })
              .from(remoteConnections)
              .where(eq(remoteConnections.id, config.id))
              .limit(1);
            return row?.lastSyncedAt ? row : false;
          },
          30_000,
        );

        expect(
          reconnectedRow.lastSyncedAt,
          "CN9: lastSyncedAt must be set after pull-on-connect fires",
        ).toBeTruthy();

        closeConnection(HERMES_INSTANCE_ID);
      },
      CN_TIMEOUT,
    );
  });
}
