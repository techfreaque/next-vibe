/**
 * Remote Transport Routing — AI Stream E2E Tests
 *
 * Tests that routing correctly routes AI streams to the remote instance,
 * and that thread mirroring works correctly across the bidirectional connection.
 *
 * Routing: REMOTE root folder → deterministic per-instance subfolder routing.
 * A thread under REMOTE/<instanceId>/... routes to that connection by folder ancestry.
 * No DB routing rules (isDefault / handlesModelProviders) exist.
 *
 * Thread mirroring suite (TM1–TM2):
 *   TM1 — Stream from remote/hermes subfolder → thread appears locally in that folder
 *          AND is mirrored to hermes (remote) in their remote/atlas folder.
 *   TM2 — threadMirrorMode='none' → thread only appears locally, NOT on hermes.
 *
 * All suites use transportMode='direct-http'.
 * Setup is E2E: connectToHermes logs into hermes, registers atlas there, syncs caps.
 *
 * Requires: vibe --hermes dev --fixture-mode  → http://localhost:3002
 */

import "server-only";

import { and, eq, isNull, sql } from "drizzle-orm";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import type { ToolExecutionContext } from "next-vibe/agent/chat/config";
import {
  DefaultFolderId,
  rootlessStreamContext,
} from "next-vibe/agent/chat/config";
import { chatFolders, chatThreads } from "next-vibe/agent/chat/db";
import { chatFavorites } from "next-vibe/agent/skills/favorites/db";
import { env } from "@/env/env";

import { runTestStream } from "../../agent/ai-stream/testing/headless-test-runner";
import {
  ATLAS_INSTANCE_ID,
  connectToHermes,
  disconnectFromHermes,
  ensureRemoteUserCredits,
  failSuitePrerequisites,
  getProdDb,
  HERMES_INSTANCE_ID,
  isHermesInFixtureMode,
  resolveDevUser,
  resolveProdAdminToken,
  resolveProdUserId,
  resolveRemoteUrlSync,
  unregisterDevFromHermes,
} from "../../agent/ai-stream/testing/remote-setup";

// ── Remote URL — skip all suites if unreachable ───────────────────────────────

const _remoteUrl = resolveRemoteUrlSync();
const _isFixtureMode = isHermesInFixtureMode();

if (!_remoteUrl) {
  failSuitePrerequisites(
    "Remote Transport routing tests",
    "remote server not running — start: vibe --hermes dev --fixture-mode  → http://localhost:3002",
  );
} else if (!_isFixtureMode) {
  failSuitePrerequisites(
    "Remote Transport routing tests",
    "hermes is running but not in fixture mode — restart: vibe --hermes dev --fixture-mode",
  );
}

// REMOTE root folder routing is tested in the route.remote-folder.* suites
// (deterministic — folder ancestry, no DB routing setting needed).

// ── Thread mirroring suite ────────────────────────────────────────────────────
//
// Validates the bidirectional thread storage contract when a stream is initiated
// from the remote/hermes subfolder on atlas and routed to hermes.
//
// Topology:
//   atlas initiates from remote/hermes → hermes runs AI loop → hermes stores
//   thread in its DB (always, it owns the loop). threadMirrorMode controls whether
//   hermes-DEV also writes a local copy.
//
//   both  → atlas writes a local thread in remote/hermes folder
//   none  → atlas skips local write (fire-and-forget from initiating side)
//
// The remote-side thread on hermes has a DIFFERENT id (responseThreadId from relay).
// We verify hermes has any thread created in the right folder using the prod DB.
//
// Subfolder assertions (beforeAll):
//   - remote/hermes exists on atlas  (connect Step 6b)
//   - remote/atlas exists on hermes  (register step)

if (_remoteUrl && _isFixtureMode) {
  describe(`Remote Transport — thread mirroring (${_remoteUrl})`, () => {
    let testUser: JwtPrivatePayloadType;
    let prodUserId: string;
    /** UUID of remote/hermes subfolder on atlas — stream origin */
    let localFolderId: string;
    /** UUID of remote/atlas subfolder on hermes — remote thread lands here */
    let remoteFolderId: string;
    /** Favorite ID for running streams in TM tests */
    let tmFavoriteId: string;

    beforeAll(async () => {
      const resolved = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
      expect(
        resolved,
        `Admin user ${env.VIBE_ADMIN_USER_EMAIL} not found in local DB — run: vibe dev`,
      ).toBeTruthy();
      if (!resolved) {
        // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
        throw new Error(
          `TM setup failed: admin user ${env.VIBE_ADMIN_USER_EMAIL} not found in local DB — cannot continue suite (run: vibe dev)`,
        );
      }
      testUser = resolved;

      // Ensure a favorite exists for TM stream calls (model resolution requires favoriteId).
      const TM_FAVORITE_ID = "00000000-0000-4001-a000-000000000003";
      const [existingFav] = await db
        .select({ id: chatFavorites.id })
        .from(chatFavorites)
        .where(eq(chatFavorites.userId, testUser.id))
        .limit(1);
      if (existingFav) {
        tmFavoriteId = existingFav.id;
      } else {
        await db
          .insert(chatFavorites)
          .values({
            id: TM_FAVORITE_ID,
            userId: testUser.id,
            skillId: "quality-tester",
            variantId: "kimi",
            position: 9997,
          })
          .onConflictDoUpdate({
            target: chatFavorites.id,
            set: { userId: testUser.id },
          });
        tmFavoriteId = TM_FAVORITE_ID;
      }

      await disconnectFromHermes(testUser.id);

      // Give the remote Vite dev server time to recover after the 3 routing suites.
      // The suites send many AI requests; without a pause the server may still be busy
      // and the registration request times out (returns "Remote Server Error").
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 30000);
      });

      // connect() + register(): creates remote/hermes subfolder on atlas and
      // remote/atlas subfolder on hermes. REMOTE-folder routing is deterministic.
      // register() on hermes side: creates remote/atlas subfolder on hermes.
      await connectToHermes(testUser, _remoteUrl!);

      prodUserId = await resolveProdUserId();

      const remoteAdminToken = await resolveProdAdminToken();
      // Both credit top-ups are best-effort: hermes may run old code where admin-add
      // behaves differently, or testUser may not exist on hermes.
      try {
        await ensureRemoteUserCredits(
          _remoteUrl!,
          remoteAdminToken,
          prodUserId,
          20000,
        );
      } catch {
        /* best-effort — hermes version may not support this */
      }
      // testUser only exists in atlas DB — if Hermes doesn't know them (no --fixture-mode),
      // this call fails but isn't needed: TM streams run as prodUserId on Hermes.
      try {
        await ensureRemoteUserCredits(
          _remoteUrl!,
          remoteAdminToken,
          testUser.id,
          20000,
        );
      } catch {
        /* best-effort — testUser may not exist on hermes */
      }

      // Verify and capture the local remote/hermes subfolder UUID.
      const [localFolder] = await db
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
        localFolder,
        `remote/${HERMES_INSTANCE_ID} subfolder missing on atlas after connect(). ` +
          `connect/repository.ts Step 6b must create it — check logs for silent failure.`,
      ).toBeDefined();
      if (!localFolder) {
        // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
        throw new Error(
          `TM setup failed: remote/${HERMES_INSTANCE_ID} subfolder missing on atlas after connect() — cannot continue suite`,
        );
      }
      localFolderId = localFolder.id;

      // Verify and capture the remote/atlas subfolder UUID on hermes.
      const pdb = getProdDb();
      const remoteRows = await pdb.execute<{ id: string }>(
        sql`SELECT id FROM chat_folders
              WHERE user_id = ${prodUserId}
                AND root_folder_id = ${DefaultFolderId.REMOTE}
                AND name = ${ATLAS_INSTANCE_ID}
                AND parent_id IS NULL
              LIMIT 1`,
      );

      expect(
        remoteRows.rows[0],
        `remote/${ATLAS_INSTANCE_ID} subfolder missing on hermes after connect(). ` +
          `register/repository.ts must create it — check logs for silent failure.`,
      ).toBeDefined();
      if (!remoteRows.rows[0]) {
        // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
        throw new Error(
          `TM setup failed: remote/${ATLAS_INSTANCE_ID} subfolder missing on hermes after connect() — cannot continue suite`,
        );
      }
      remoteFolderId = remoteRows.rows[0].id;
    }, 240_000);

    afterAll(async () => {
      const tasks: Promise<void>[] = [disconnectFromHermes(testUser.id)];
      if (prodUserId) {
        tasks.push(unregisterDevFromHermes(prodUserId));
      }
      await Promise.all(tasks);
    });

    // ── TM1: threadMirrorMode='both' — thread on initiating side AND remote ──

    it("TM1: stream from remote/hermes folder stores thread locally (remote/hermes) AND on hermes (remote/atlas)", async () => {
      const fixtureCtx: ToolExecutionContext = rootlessStreamContext();

      // threadMirrorMode='both' is the default set by connect().
      // Stream from remote/hermes → resolveTarget() matches folderId routing rule
      // → relay to hermes → hermes runs AI loop → stores thread in remote/atlas.
      // atlas writes local copy in remote/hermes (mirrored from relay events).
      const { result } = await runTestStream({
        user: testUser,
        prompt: "[TM1 mirror-test] Reply with exactly: MIRROR_OK",
        rootFolderId: DefaultFolderId.REMOTE,
        subFolderId: localFolderId,
        favoriteId: tmFavoriteId,
        streamContext: fixtureCtx,
      });

      expect(
        result.success,
        `TM1 stream failed: ${!result.success ? result.message : ""}`,
      ).toBe(true);
      if (!result.success) {
        return;
      }

      const threadId = result.data.threadId;
      expect(threadId, "TM1: expected threadId in result").toBeDefined();
      if (!threadId) {
        return;
      }

      // ── Local side: thread in remote/hermes subfolder ─────────────────
      const [localThread] = await db
        .select({
          id: chatThreads.id,
          rootFolderId: chatThreads.rootFolderId,
          folderId: chatThreads.folderId,
        })
        .from(chatThreads)
        .where(eq(chatThreads.id, threadId))
        .limit(1);

      expect(
        localThread,
        `TM1: thread ${threadId} not found in local (atlas) DB. ` +
          `threadMirrorMode='both' must write the thread locally.`,
      ).toBeDefined();
      expect(
        localThread?.rootFolderId,
        "TM1: local thread must be in REMOTE root folder",
      ).toBe(DefaultFolderId.REMOTE);
      expect(
        localThread?.folderId,
        `TM1: local thread must be in remote/${HERMES_INSTANCE_ID} subfolder (${localFolderId})`,
      ).toBe(localFolderId);

      // ── Remote side: hermes must have a thread in remote/atlas ───
      // hermes runs the AI loop, so it always creates a thread. The remote thread
      // id (responseThreadId from relay) is different from the local threadId.
      // Poll the prod DB to find any thread in the expected folder. The relay
      // happens synchronously before runTestStream returns, so it should be there.
      const pdb = getProdDb();
      // Placement-is-data model: the relay-run loop places foreign threads at
      // REMOTE/<origin>/<private|background>/<chain>, so the thread lives in a
      // DESCENDANT of remote/atlas (e.g. remote/atlas/private) — accept the
      // whole subtree, not just the top-level folder.
      let remoteThread: { id: string } | undefined;
      const deadline = Date.now() + 5_000;
      while (!remoteThread && Date.now() < deadline) {
        const rows = await pdb.execute<{ id: string }>(
          sql`WITH RECURSIVE subtree AS (
                    SELECT id FROM chat_folders WHERE id = ${remoteFolderId}
                    UNION ALL
                    SELECT f.id FROM chat_folders f
                      JOIN subtree s ON f.parent_id = s.id
                  )
                  SELECT t.id FROM chat_threads t
                  WHERE t.user_id = ${prodUserId}
                    AND t.root_folder_id = ${DefaultFolderId.REMOTE}
                    AND t.folder_id IN (SELECT id FROM subtree)
                  LIMIT 1`,
        );
        remoteThread = rows.rows[0];
        if (!remoteThread) {
          await new Promise<void>((resolve) => {
            setTimeout(resolve, 500);
          });
        }
      }

      expect(
        remoteThread,
        `TM1: no thread found on hermes under the remote/${ATLAS_INSTANCE_ID} subtree (${remoteFolderId}). ` +
          `ws-provider/stream on hermes must place the thread at REMOTE/${ATLAS_INSTANCE_ID}/<private|background>/….`,
      ).toBeDefined();
    }, 180_000);

    // ── TM3: atlas → hermes stream reaches idle + persists locally ────
    //
    // Always initiate FROM atlas TO hermes (the normal direction) via the typed
    // headless stream runner — never a raw reverse device-token POST. atlas
    // relays to hermes, hermes runs the AI loop, and with threadMirrorMode='both'
    // the thread is mirrored back into atlas's local remote/hermes folder.
    //
    // Complements TM1 (which checks folder placement both sides) by asserting the
    // mirrored thread reaches a terminal (idle) streaming state on atlas.

    it("TM3: atlas → hermes stream mirrors thread to atlas and reaches idle", async () => {
      const fixtureCtx: ToolExecutionContext = rootlessStreamContext();

      const { result } = await runTestStream({
        user: testUser,
        prompt: "[TM3 mirror-idle] Reply with exactly: REVERSE_OK",
        rootFolderId: DefaultFolderId.REMOTE,
        subFolderId: localFolderId,
        favoriteId: tmFavoriteId,
        streamContext: fixtureCtx,
      });

      expect(
        result.success,
        `TM3 stream failed: ${!result.success ? result.message : ""}`,
      ).toBe(true);
      if (!result.success) {
        return;
      }

      const threadId = result.data.threadId;
      expect(threadId, "TM3: expected threadId in result").toBeDefined();
      if (!threadId) {
        return;
      }

      // Wait for the mirrored thread to reach a terminal (idle) state on atlas.
      const deadline = Date.now() + 60_000;
      let threadIdle = false;
      while (!threadIdle && Date.now() < deadline) {
        const [threadRow] = await db
          .select({ streamingState: chatThreads.streamingState })
          .from(chatThreads)
          .where(eq(chatThreads.id, threadId))
          .limit(1);
        if (threadRow?.streamingState === "idle") {
          threadIdle = true;
        } else {
          await new Promise<void>((resolve) => {
            setTimeout(resolve, 500);
          });
        }
      }

      expect(
        threadIdle,
        `TM3: atlas thread ${threadId} did not reach idle state within timeout`,
      ).toBe(true);

      // ── atlas side: thread must exist locally in the REMOTE folder ──
      const [localThread] = await db
        .select({
          id: chatThreads.id,
          rootFolderId: chatThreads.rootFolderId,
        })
        .from(chatThreads)
        .where(eq(chatThreads.id, threadId))
        .limit(1);

      expect(
        localThread,
        `TM3: thread ${threadId} not found on atlas after stream.`,
      ).toBeDefined();
      expect(
        localThread?.rootFolderId,
        "TM3: mirrored thread must be in the REMOTE root folder",
      ).toBe(DefaultFolderId.REMOTE);
    }, 180_000);

    // TM2 (threadMirrorMode='none' skips the local write) was removed: the
    // connection-level threadMirrorMode column was write-only dead config and
    // is gone — a remote-folder stream ALWAYS mirrors back locally (TM1), and
    // the no-local-write path is incognito, which never relays remotely
    // (folder restrictions forbid remote dispatch there).
  });
}
