/**
 * Remote Connection — Rename Propagation & Routing Continuity (Area 8)
 *
 * Tests that self-rename propagates correctly to connected remotes and that
 * routing continues to work after rename (folder UUID is stable):
 *
 *   RN1  — renameSelf() updates instanceIdentities + remoteConnections.remoteInstanceId locally
 *   RN2  — propagation: atlas renames itself → hermes's chatFolders.name updated to new name
 *   RN3  — folder UUID is stable after rename (only name changes, UUID is the same)
 *   RN4  — after rename: starting a stream from the subfolder still routes to hermes
 *           (REMOTE-folder routing is deterministic — no folderIds DB setting needed)
 *   RN5  — reverse: hermes renames itself → atlas's chatFolders.name updated (via _rename HTTP)
 *   RN6  — after reverse rename: folder UUID still exists, REMOTE routing still resolves correctly
 *
 * PREREQUISITES
 * ─────────────
 *   Terminal 1: vibe dev               (atlas, port 3000, dev DB port 5432)
 *   Terminal 2: vibe --hermes dev       (hermes, port 3002, prod DB port 5433)
 *
 * Requires: vibe --hermes dev  → http://localhost:3002
 */

import "server-only";

import { randomUUID } from "node:crypto";

import { and, eq, isNull, sql } from "drizzle-orm";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { sendTestRequest } from "next-vibe/tooling/check/testing/testing-suite/send-test-request";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { chatFolders } from "@/app/api/[locale]/agent/chat/db";
import { chatFavorites } from "@/app/api/[locale]/agent/skills/favorites/db";
import {
  instanceIdentities,
  remoteConnections,
} from "@/app/api/[locale]/remote-connection/db";
import { env } from "@/config/env";

import {
  installFetchCache,
  setFetchCacheContext,
} from "../../../agent/ai-stream/testing/fetch-cache";
import { runTestStream } from "../../../agent/ai-stream/testing/headless-test-runner";
import {
  ATLAS_INSTANCE_ID,
  connectToHermes,
  disconnectFromHermes,
  ensureRemoteUserCredits,
  failSuitePrerequisites,
  getProdDb,
  HERMES_INSTANCE_ID,
  resolveDevUser,
  resolveProdUserId,
  resolveRemoteUrlSync,
  restoreHermesIdentity,
  unregisterDevFromHermes,
} from "../../../agent/ai-stream/testing/remote-setup";
import selfRenameDefinitions from "./definition";

installFetchCache();

// ── Skip guard ─────────────────────────────────────────────────────────────────

const _remoteUrl = resolveRemoteUrlSync();
if (!_remoteUrl) {
  failSuitePrerequisites(
    "Rename propagation tests",
    "remote server not running — start: vibe --hermes dev  → http://localhost:3002",
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
  fn: () => Promise<T | false>,
  timeoutMs = 15_000,
): Promise<T> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const result = await fn();
    if (result !== false) {
      return result;
    }
    await sleep(200);
  }
  // oxlint-disable-next-line restricted-syntax
  throw new Error(`[pollUntil] ${label}: timed out after ${timeoutMs}ms`);
}

// ── Suite ─────────────────────────────────────────────────────────────────────

if (_remoteUrl) {
  describe(`Remote Connection — Rename Propagation (${_remoteUrl})`, () => {
    let testUser: JwtPrivatePayloadType;
    let prodUserId: string;
    /** UUID of remote/hermes subfolder on atlas */
    let localFolderId: string;
    /** UUID of remote/atlas subfolder on hermes */
    let remoteFolderId: string;
    /** Favorite to use for streams */
    let favoriteId: string;
    /** Tracks any rename we applied so afterAll can clean up */
    let appliedNewDevName: string | null = null;
    let appliedNewHermesName: string | null = null;

    beforeAll(async () => {
      const resolved = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
      expect(
        resolved,
        `Admin user ${env.VIBE_ADMIN_USER_EMAIL} not found — run: vibe dev`,
      ).toBeTruthy();
      if (!resolved) {
        // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
        throw new Error(
          `RN setup failed: admin user ${env.VIBE_ADMIN_USER_EMAIL} not found — cannot continue suite (run: vibe dev)`,
        );
      }
      testUser = resolved;

      // Pre-clean both sides before attempting connection to avoid "Already Connected"
      // from stale rows left by failed previous runs.
      await disconnectFromHermes(testUser.id);
      prodUserId = await resolveProdUserId();
      await restoreHermesIdentity();
      await unregisterDevFromHermes(prodUserId);

      await connectToHermes(testUser, _remoteUrl!);

      await ensureRemoteUserCredits("", "", prodUserId, 20000);
      // testUser only exists in atlas DB — best-effort if Hermes doesn't know them
      try {
        await ensureRemoteUserCredits("", "", testUser.id, 20000);
      } catch {
        /* best-effort — testUser may not exist on hermes */
      }

      // Capture local remote/hermes subfolder UUID
      const [lf] = await db
        .select({ id: chatFolders.id })
        .from(chatFolders)
        .where(
          and(
            eq(chatFolders.userId, testUser.id),
            eq(chatFolders.rootFolderId, DefaultFolderId.REMOTE),
            eq(chatFolders.name, HERMES_INSTANCE_ID),
            isNull(chatFolders.parentId),
          ),
        )
        .limit(1);

      expect(
        lf,
        `RN prerequisites: remote/${HERMES_INSTANCE_ID} subfolder missing after connect()`,
      ).toBeDefined();
      if (!lf) {
        // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
        throw new Error(
          `RN setup failed: remote/${HERMES_INSTANCE_ID} subfolder missing after connect() — cannot continue suite`,
        );
      }
      localFolderId = lf.id;

      // Capture remote/atlas subfolder UUID on hermes
      const pdb = getProdDb();
      const rfRows = await pdb.execute<{ id: string }>(
        sql`SELECT id FROM chat_folders
              WHERE user_id = ${prodUserId}
                AND root_folder_id = ${DefaultFolderId.REMOTE}
                AND name = ${ATLAS_INSTANCE_ID}
                AND parent_id IS NULL
              LIMIT 1`,
      );

      expect(
        rfRows.rows[0],
        `RN prerequisites: remote/${ATLAS_INSTANCE_ID} subfolder missing on hermes after connect()`,
      ).toBeDefined();
      if (!rfRows.rows[0]) {
        // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
        throw new Error(
          `RN setup failed: remote/${ATLAS_INSTANCE_ID} subfolder missing on hermes after connect() — cannot continue suite`,
        );
      }
      remoteFolderId = rfRows.rows[0].id;

      // Ensure a favorite exists for stream calls
      const RENAME_FAV_ID = "00000000-0000-4001-a000-000000000007";
      const [existingFav] = await db
        .select({ id: chatFavorites.id })
        .from(chatFavorites)
        .where(eq(chatFavorites.userId, testUser.id))
        .limit(1);
      if (existingFav) {
        favoriteId = existingFav.id;
      } else {
        await db
          .insert(chatFavorites)
          .values({
            id: RENAME_FAV_ID,
            userId: testUser.id,
            skillId: "quality-tester",
            variantId: "kimi",
            position: 9996,
          })
          .onConflictDoUpdate({
            target: chatFavorites.id,
            set: { userId: testUser.id },
          });
        favoriteId = RENAME_FAV_ID;
      }
    }, 180_000);

    afterAll(async () => {
      // Restore instanceIdentities if we renamed atlas
      if (appliedNewDevName) {
        await db
          .update(instanceIdentities)
          .set({ instanceId: ATLAS_INSTANCE_ID, updatedAt: new Date() })
          .where(
            and(
              eq(instanceIdentities.userId, testUser.id),
              eq(instanceIdentities.instanceId, appliedNewDevName),
              eq(instanceIdentities.isDefault, true),
            ),
          );
        // Also restore remoteConnections.remoteInstanceId
        await db
          .update(remoteConnections)
          .set({
            remoteInstanceId: ATLAS_INSTANCE_ID,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(remoteConnections.userId, testUser.id),
              eq(remoteConnections.remoteInstanceId, appliedNewDevName),
            ),
          );
        // Restore chatFolders if renamed but prod side not propagated
        await db
          .update(chatFolders)
          .set({ name: ATLAS_INSTANCE_ID, updatedAt: new Date() })
          .where(
            and(
              eq(chatFolders.userId, testUser.id),
              eq(chatFolders.rootFolderId, DefaultFolderId.REMOTE),
              eq(chatFolders.name, appliedNewDevName),
              isNull(chatFolders.parentId),
            ),
          );
      }

      const pdb = getProdDb();

      // Restore prod-side folder name if hermes was renamed
      if (appliedNewHermesName) {
        await pdb.execute(
          sql`UPDATE chat_folders SET name = ${HERMES_INSTANCE_ID}, updated_at = NOW()
              WHERE user_id = ${prodUserId}
                AND root_folder_id = ${DefaultFolderId.REMOTE}
                AND name = ${appliedNewHermesName}
                AND parent_id IS NULL`,
        );
        await pdb.execute(
          sql`UPDATE remote_connections SET instance_id = ${HERMES_INSTANCE_ID}, updated_at = NOW()
              WHERE user_id = ${prodUserId}
                AND instance_id = ${appliedNewHermesName}`,
        );
      }

      const tasks: Promise<void>[] = [disconnectFromHermes(testUser.id)];
      if (prodUserId) {
        tasks.push(unregisterDevFromHermes(prodUserId));
      }
      await Promise.all(tasks);
    });

    // ── RN1: renameSelf() updates local identity + remoteConnections ──────────

    it("RN1: renameSelf() updates instanceIdentities + remoteConnections.remoteInstanceId on atlas", async () => {
      const newName = `atlas-rn1-${randomUUID().slice(0, 8)}`;
      appliedNewDevName = newName;

      // Call the local self-rename endpoint via the typed executor (propagate=false: local only)
      const rn1Resp = await sendTestRequest({
        endpoint: selfRenameDefinitions.PATCH,
        data: { newInstanceId: newName, propagate: false },
        user: testUser,
      });

      expect(
        rn1Resp.success,
        `RN1: renameSelf must succeed — ${rn1Resp.success ? "" : JSON.stringify(rn1Resp)}`,
      ).toBe(true);

      // instanceIdentities must be updated
      const [identity] = await db
        .select({ instanceId: instanceIdentities.instanceId })
        .from(instanceIdentities)
        .where(
          and(
            eq(instanceIdentities.userId, testUser.id),
            eq(instanceIdentities.isDefault, true),
          ),
        )
        .limit(1);

      expect(
        identity?.instanceId,
        `RN1: instanceIdentities.instanceId must be updated to ${newName}`,
      ).toBe(newName);

      // remoteConnections.remoteInstanceId must reflect new name
      const [conn] = await db
        .select({ remoteInstanceId: remoteConnections.remoteInstanceId })
        .from(remoteConnections)
        .where(
          and(
            eq(remoteConnections.userId, testUser.id),
            eq(remoteConnections.instanceId, HERMES_INSTANCE_ID),
          ),
        )
        .limit(1);

      expect(
        conn?.remoteInstanceId,
        `RN1: remoteConnections.remoteInstanceId must be updated to ${newName}`,
      ).toBe(newName);

      // Restore for subsequent tests
      await db
        .update(instanceIdentities)
        .set({ instanceId: ATLAS_INSTANCE_ID, updatedAt: new Date() })
        .where(
          and(
            eq(instanceIdentities.userId, testUser.id),
            eq(instanceIdentities.instanceId, newName),
          ),
        );
      await db
        .update(remoteConnections)
        .set({
          remoteInstanceId: ATLAS_INSTANCE_ID,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(remoteConnections.userId, testUser.id),
            eq(remoteConnections.remoteInstanceId, newName),
          ),
        );
      appliedNewDevName = null;
    }, 30_000);

    // ── RN2: self-rename propagates → hermes updates its chatFolders.name ────

    it("RN2: renameSelf(propagate=true) → hermes's chatFolders.name updated to new dev instance name", async () => {
      const newName = `atlas-rn2-${randomUUID().slice(0, 8)}`;
      appliedNewDevName = newName;

      // Call the local self-rename endpoint via the typed executor (propagate=true: fires PATCH to hermes)
      const rn2Resp = await sendTestRequest({
        endpoint: selfRenameDefinitions.PATCH,
        data: { newInstanceId: newName, propagate: true },
        user: testUser,
      });

      expect(
        rn2Resp.success,
        `RN2: renameSelf must succeed — ${rn2Resp.success ? "" : JSON.stringify(rn2Resp)}`,
      ).toBe(true);

      // Give the fire-and-forget propagation time to reach hermes-dev
      // Poll hermes-dev DB for the renamed folder
      const pdb = getProdDb();
      const renamedFolder = await pollUntil(
        `RN2: hermes chatFolders.name must be updated to ${newName}`,
        async () => {
          const rows = await pdb.execute<{ id: string; name: string }>(
            sql`SELECT id, name FROM chat_folders
                  WHERE user_id = ${prodUserId}
                    AND root_folder_id = ${DefaultFolderId.REMOTE}
                    AND name = ${newName}
                    AND parent_id IS NULL
                  LIMIT 1`,
          );
          return rows.rows[0] ?? false;
        },
        20_000,
      );

      expect(
        renamedFolder.name,
        `RN2: hermes must rename remote/${ATLAS_INSTANCE_ID} subfolder to ${newName} after propagation`,
      ).toBe(newName);

      // Old folder name must be gone
      const oldRows = await pdb.execute<{ id: string }>(
        sql`SELECT id FROM chat_folders
              WHERE user_id = ${prodUserId}
                AND root_folder_id = ${DefaultFolderId.REMOTE}
                AND name = ${ATLAS_INSTANCE_ID}
                AND parent_id IS NULL
              LIMIT 1`,
      );
      expect(
        oldRows.rows.length,
        `RN2: hermes must NOT have a folder named ${ATLAS_INSTANCE_ID} after rename`,
      ).toBe(0);

      // Restore
      await pdb.execute(
        sql`UPDATE chat_folders SET name = ${ATLAS_INSTANCE_ID}, updated_at = NOW()
            WHERE user_id = ${prodUserId}
              AND root_folder_id = ${DefaultFolderId.REMOTE}
              AND name = ${newName}
              AND parent_id IS NULL`,
      );
      await db
        .update(instanceIdentities)
        .set({ instanceId: ATLAS_INSTANCE_ID, updatedAt: new Date() })
        .where(
          and(
            eq(instanceIdentities.userId, testUser.id),
            eq(instanceIdentities.instanceId, newName),
          ),
        );
      await db
        .update(remoteConnections)
        .set({
          remoteInstanceId: ATLAS_INSTANCE_ID,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(remoteConnections.userId, testUser.id),
            eq(remoteConnections.remoteInstanceId, newName),
          ),
        );
      appliedNewDevName = null;
    }, 60_000);

    // ── RN3: folder UUID stable after rename ─────────────────────────────────

    it("RN3: folder UUID is stable after rename (only the name changes)", async () => {
      // After connect(), localFolderId was captured. After rename operations,
      // the folder must still exist with the same UUID — only its name changes.
      // REMOTE-folder routing is deterministic (by folder ancestry), no DB folderIds needed.
      const [folder] = await db
        .select({ id: chatFolders.id, name: chatFolders.name })
        .from(chatFolders)
        .where(
          and(
            eq(chatFolders.id, localFolderId),
            eq(chatFolders.userId, testUser.id),
          ),
        )
        .limit(1);

      expect(
        folder?.id,
        `RN3: chatFolders row with id=${localFolderId} must still exist after rename — UUID is stable`,
      ).toBe(localFolderId);
    }, 15_000);

    // ── RN4: stream from remote/hermes folder routes to hermes after rename ───

    it("RN4: stream from remote/hermes subfolder routes AI to hermes — prod DB receives messages", async () => {
      setFetchCacheContext("rename-rn4-");

      // Run a stream from the localFolderId (remote/hermes subfolder).
      // REMOTE-folder routing is deterministic — folder ancestry resolves to hermes.
      const { result } = await runTestStream({
        user: testUser,
        prompt: "[RN4 routing-after-rename] Reply with exactly: ROUTE_STABLE",
        rootFolderId: DefaultFolderId.REMOTE,
        subFolderId: localFolderId,
        favoriteId,
      });

      expect(
        result.success,
        `RN4: stream must succeed after rename: ${!result.success ? result.message : ""}`,
      ).toBe(true);
      if (!result.success) {
        return;
      }

      // hermes must have a thread in remote/atlas subfolder
      const pdb = getProdDb();

      const remoteThread = await pollUntil(
        "RN4: hermes must have a thread in remote/atlas folder after routing",
        async () => {
          const rows = await pdb.execute<{ id: string }>(
            sql`SELECT id FROM chat_threads
                    WHERE user_id = ${prodUserId}
                      AND root_folder_id = ${DefaultFolderId.REMOTE}
                      AND folder_id = ${remoteFolderId}
                    LIMIT 1`,
          );
          return rows.rows[0] ?? false;
        },
        30_000,
      );

      expect(
        remoteThread,
        `RN4: hermes must have a thread in remote/${ATLAS_INSTANCE_ID} folder (${remoteFolderId}). ` +
          `Routing via folderIds UUID must survive instance rename.`,
      ).toBeDefined();
    }, 120_000);

    // ── RN5: reverse rename — hermes renames itself → atlas chatFolders renamed ──

    it("RN5: hermes renames itself → atlas chatFolders.name updated via _rename HTTP propagation", async () => {
      const newHermesName = `hermes-rn5-${randomUUID().slice(0, 8)}`;
      appliedNewHermesName = newHermesName;

      // hermes renames itself by calling its own self/rename endpoint (propagate=true).
      // hermes's rename sends PATCH to atlas's /remote-connection/[instanceId]/rename.
      // atlas's _rename() handler updates its local chatFolders.name.
      //
      // We call hermes's rename endpoint via sendTestRequest with instanceId routing.
      const rn5Resp = await sendTestRequest({
        endpoint: selfRenameDefinitions.PATCH,
        data: { newInstanceId: newHermesName, propagate: true },
        user: testUser,
        instanceId: HERMES_INSTANCE_ID,
      });

      expect(
        rn5Resp.success,
        `RN5: hermes self-rename must succeed — ${rn5Resp.success ? "" : JSON.stringify(rn5Resp)}`,
      ).toBe(true);

      // Poll atlas's chatFolders for the renamed folder
      const renamedFolder = await pollUntil(
        `RN5: atlas chatFolders.name must be updated to ${newHermesName}`,
        async () => {
          const [folder] = await db
            .select({ name: chatFolders.name, id: chatFolders.id })
            .from(chatFolders)
            .where(
              and(
                eq(chatFolders.userId, testUser.id),
                eq(chatFolders.rootFolderId, DefaultFolderId.REMOTE),
                eq(chatFolders.name, newHermesName),
                isNull(chatFolders.parentId),
              ),
            )
            .limit(1);
          return folder ?? false;
        },
        20_000,
      );

      expect(
        renamedFolder.name,
        `RN5: atlas chatFolders must rename remote/${HERMES_INSTANCE_ID} to ${newHermesName}`,
      ).toBe(newHermesName);

      // Old name must be gone
      const [oldFolder] = await db
        .select({ id: chatFolders.id })
        .from(chatFolders)
        .where(
          and(
            eq(chatFolders.userId, testUser.id),
            eq(chatFolders.rootFolderId, DefaultFolderId.REMOTE),
            eq(chatFolders.name, HERMES_INSTANCE_ID),
            isNull(chatFolders.parentId),
          ),
        )
        .limit(1);

      expect(
        oldFolder,
        `RN5: chatFolders must NOT have old name ${HERMES_INSTANCE_ID} after hermes renames itself`,
      ).toBeUndefined();

      // Restore hermes's identity
      const pdb = getProdDb();
      await pdb.execute(
        sql`UPDATE instance_identities SET instance_id = ${HERMES_INSTANCE_ID}, updated_at = NOW()
            WHERE instance_id = ${newHermesName} AND is_default = true`,
      );
      await pdb.execute(
        sql`UPDATE remote_connections SET instance_id = ${HERMES_INSTANCE_ID}, updated_at = NOW()
            WHERE instance_id = ${newHermesName}`,
      );
      // Restore atlas's chatFolders
      await db
        .update(chatFolders)
        .set({ name: HERMES_INSTANCE_ID, updatedAt: new Date() })
        .where(
          and(
            eq(chatFolders.userId, testUser.id),
            eq(chatFolders.rootFolderId, DefaultFolderId.REMOTE),
            eq(chatFolders.name, newHermesName),
            isNull(chatFolders.parentId),
          ),
        );
      // Restore atlas's remoteConnections.instanceId
      await db
        .update(remoteConnections)
        .set({ instanceId: HERMES_INSTANCE_ID, updatedAt: new Date() })
        .where(
          and(
            eq(remoteConnections.userId, testUser.id),
            eq(remoteConnections.instanceId, newHermesName),
          ),
        );
      appliedNewHermesName = null;
    }, 60_000);

    // ── RN6: after reverse rename — folder UUID stable, REMOTE routing works ──

    it("RN6: after hermes rename — folder UUID unchanged, REMOTE routing still resolves to hermes", async () => {
      // After RN5 restores everything, localFolderId must still exist in atlas DB.
      // Rename only changes the folder name — UUID is stable.
      // REMOTE-folder routing is deterministic: folder ancestry resolves to hermes connection.
      const [folder] = await db
        .select({ id: chatFolders.id })
        .from(chatFolders)
        .where(
          and(
            eq(chatFolders.id, localFolderId),
            eq(chatFolders.userId, testUser.id),
          ),
        )
        .limit(1);

      expect(
        folder?.id,
        `RN6: chatFolders row with id=${localFolderId} must still exist after hermes rename — UUID is stable`,
      ).toBe(localFolderId);
    }, 15_000);
  });
}
