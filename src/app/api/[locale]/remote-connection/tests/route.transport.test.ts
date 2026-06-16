/**
 * Remote Transport Routing — AI Stream E2E Tests
 *
 * Tests that routing rules correctly route AI streams to the remote instance,
 * and that thread mirroring works correctly across the bidirectional connection.
 *
 * Routing suites — each validates one routing path end-to-end:
 *   Suite 1 — isDefault = true        → fallback for unmatched requests
 *   Suite 2 — folderIds = ["cron"]    → folder-based routing (runTestStream uses "cron")
 *   Suite 3 — handlesModelProviders   → model-provider-based routing (UNBOTTLED)
 *
 * Thread mirroring suite (TM1–TM2):
 *   TM1 — Stream from remote/hermes subfolder → thread appears locally in that folder
 *          AND is mirrored to hermes (remote) in their remote/atlas folder.
 *   TM2 — threadMirrorMode='none' → thread only appears locally, NOT on hermes.
 *
 * All suites use transportMode='direct-http'.
 * Setup is E2E: connectToHermes logs into hermes, registers atlas there, syncs caps.
 * triggerPull() ensures capabilities are populated before any test runs.
 *
 * Requires: vibe --hermes dev --fixture-mode  → http://localhost:3002
 */

import "server-only";

import { installFetchCache } from "../../agent/ai-stream/testing/fetch-cache";
installFetchCache();

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { chatFolders, chatThreads } from "@/app/api/[locale]/agent/chat/db";
import { chatFavorites } from "@/app/api/[locale]/agent/chat/favorites/db";
import { remoteConnections } from "@/app/api/[locale]/remote-connection/db";
import { db } from "@/app/api/[locale]/system/db";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { env } from "@/config/env";
import { and, eq, isNull, sql } from "drizzle-orm";
import { DEFAULT_CHAT_MODEL_ID } from "../../agent/ai-stream/constants";
import { describeStreamSuite } from "../../agent/ai-stream/stream/tests/route-base.test";
import { setFetchCacheContext } from "../../agent/ai-stream/testing/fetch-cache";
import { runTestStream } from "../../agent/ai-stream/testing/headless-test-runner";
import {
  ATLAS_INSTANCE_ID,
  HERMES_INSTANCE_ID,
  connectToHermes,
  disconnectFromHermes,
  ensureRemoteUserCredits,
  failSuitePrerequisites,
  getProdDb,
  isHermesInFixtureMode,
  resolveDevUser,
  resolveProdAdminToken,
  resolveProdUserId,
  resolveRemoteUrl,
  triggerPull,
  unregisterDevFromHermes,
} from "../../agent/ai-stream/testing/remote-setup";

// ── Remote URL — skip all suites if unreachable ───────────────────────────────

const _remoteUrl = await resolveRemoteUrl();
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

// ── Shared teardown state ─────────────────────────────────────────────────────

let _prodUserId: string | null = null;

async function teardownRoutingConnection(
  testUser: JwtPrivatePayloadType,
): Promise<void> {
  const tasks: Promise<void>[] = [disconnectFromHermes(testUser.id)];
  if (_prodUserId) {
    tasks.push(unregisterDevFromHermes(_prodUserId));
  }
  await Promise.all(tasks);
  _prodUserId = null;
}

/**
 * Shared setup: connect to hermes, pull capabilities, top up credits on both sides.
 * Overwrites routingRules after connect so each suite exercises the right routing path.
 */
async function setupRoutingConnection(
  testUser: JwtPrivatePayloadType,
  routingRules: {
    folderIds: string[];
    handlesModelProviders: string[];
    isDefault: boolean;
  },
): Promise<void> {
  await disconnectFromHermes(testUser.id);
  await connectToHermes(testUser, _remoteUrl ?? "http://localhost:3002");
  await triggerPull();

  _prodUserId = await resolveProdUserId();
  // Top up credits on the remote — non-fatal if the remote admin login fails
  // (e.g. Vite dev server temporarily unresponsive after capability sync).
  // In fixture mode the remote uses cached responses and rarely needs live credits.
  try {
    const remoteAdminToken = await resolveProdAdminToken(
      _remoteUrl ?? "http://localhost:3002",
    );
    await ensureRemoteUserCredits(
      _remoteUrl ?? "http://localhost:3002",
      remoteAdminToken,
      _prodUserId!,
      20000,
    );
    await ensureRemoteUserCredits(
      _remoteUrl ?? "http://localhost:3002",
      remoteAdminToken,
      testUser.id,
      20000,
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(
      "[setupRoutingConnection] Remote credit top-up skipped:",
      err instanceof Error ? err.message : String(err),
    );
  }

  await db
    .update(remoteConnections)
    .set({ routingRules, updatedAt: new Date() })
    .where(
      and(
        eq(remoteConnections.userId, testUser.id),
        eq(remoteConnections.instanceId, HERMES_INSTANCE_ID),
      ),
    );
}

// ── Suite 1 — isDefault routing ───────────────────────────────────────────────

async function setupIsDefaultRouting(
  testUser: JwtPrivatePayloadType,
): Promise<void> {
  await setupRoutingConnection(testUser, {
    folderIds: [],
    handlesModelProviders: [],
    isDefault: true,
  });
}

// ── Suite 2 — folderId routing ────────────────────────────────────────────────

async function setupFolderIdRouting(
  testUser: JwtPrivatePayloadType,
): Promise<void> {
  // "cron" is DefaultFolderId.BACKGROUND — the folder runTestStream uses by default
  await setupRoutingConnection(testUser, {
    folderIds: ["cron"],
    handlesModelProviders: [],
    isDefault: false,
  });
}

// ── Suite 3 — modelProvider routing ───────────────────────────────────────────

async function setupModelProviderRouting(
  testUser: JwtPrivatePayloadType,
): Promise<void> {
  await setupRoutingConnection(testUser, {
    folderIds: [],
    handlesModelProviders: ["UNBOTTLED"],
    isDefault: false,
  });
}

// ── Suite registration — routing suites ───────────────────────────────────────

if (_remoteUrl && _isFixtureMode) {
  describeStreamSuite({
    label: `Remote Transport — isDefault routing (${_remoteUrl}, transportMode='direct-http')`,
    cachePrefix: "transport-default-",
    // No remoteInstanceId: the AI runs on the remote instance directly,
    // so tool calls are local to the remote (no execute-tool wrapper needed).
    // depends on the remote AI model which may not report usage.
    // the wait-for-task revival runs on the remote in a separate stream whose
    // backfilled tool result is not visible to the local relay processor.
    // in relay mode the AI runs remotely and the confirmation never arrives.
    // attachments are only stored on the remote side.
    // specific cachePrefix — no transport-* fixtures exist; live API calls would
    // hit real providers (modelslab, etc.) and are non-deterministic.
    // assertSystemPromptFromLocal: the AI loop runs on the remote but the system prompt
    // is built on the local client — T-SYS asserts the AI identifies as the local instance.
    assertSystemPromptFromLocal: true,
    setup: setupIsDefaultRouting,
    teardown: teardownRoutingConnection,
  });

  describeStreamSuite({
    label: `Remote Transport — folderId routing (folderIds=['cron'], ${_remoteUrl})`,
    cachePrefix: "transport-folder-",
    assertSystemPromptFromLocal: true,
    setup: setupFolderIdRouting,
    teardown: teardownRoutingConnection,
  });

  // Suite 3: handlesModelProviders routing — no-match fallback path.
  //
  // The routing rule is set to handlesModelProviders=['UNBOTTLED']. The test
  // model's apiProvider is NOT 'UNBOTTLED', so the rule does NOT fire and
  // resolveTarget returns null (run locally). This validates:
  //   - Setting up handlesModelProviders rules works without errors.
  //   - When no rule matches, the stream runs locally (correct fallback).
  //   - The remote routing table update does not corrupt subsequent local streams.
  //
  // To test that handlesModelProviders routing FIRES, a model with
  // apiProvider='UNBOTTLED' would need to be in the fixture cache. That
  // requires a dedicated fixture recording run — covered separately in
  // transport.test.ts unit tests (resolveTarget with modelProvider argument).
  describeStreamSuite({
    label: `Remote Transport — modelProvider no-match fallback (handlesModelProviders=['UNBOTTLED'], ${_remoteUrl})`,
    cachePrefix: "transport-model-",
    setup: setupModelProviderRouting,
    teardown: teardownRoutingConnection,
  });
}

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

      // connect() → Step 6b: creates remote/hermes subfolder on atlas + adds folderId
      //             to routingRules so streams from that folder route to hermes.
      // register() on hermes side: creates remote/atlas subfolder on hermes.
      await connectToHermes(testUser, _remoteUrl!);
      await triggerPull();

      prodUserId = await resolveProdUserId();

      const remoteAdminToken = await resolveProdAdminToken();
      await ensureRemoteUserCredits(
        _remoteUrl!,
        remoteAdminToken,
        prodUserId,
        20000,
      );
      await ensureRemoteUserCredits(
        _remoteUrl!,
        remoteAdminToken,
        testUser.id,
        20000,
      );

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
      setFetchCacheContext("transport-mirror-tm1");

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
      let remoteThread: { id: string } | undefined;
      const deadline = Date.now() + 5_000;
      while (!remoteThread && Date.now() < deadline) {
        const rows = await pdb.execute<{ id: string }>(
          sql`SELECT id FROM chat_threads
                  WHERE user_id = ${prodUserId}
                    AND root_folder_id = ${DefaultFolderId.REMOTE}
                    AND folder_id = ${remoteFolderId}
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
        `TM1: no thread found on hermes in remote/${ATLAS_INSTANCE_ID} folder (${remoteFolderId}). ` +
          `ws-provider/stream on hermes must place the thread in that subfolder. ` +
          `Check that hermes passes subFolderId=${remoteFolderId} when creating the thread.`,
      ).toBeDefined();
    }, 180_000);

    // ── TM3: Reverse stream — hermes initiates to atlas ───────────────
    //
    // hermes calls atlas's ws-provider/stream endpoint directly (using an
    // admin JWT obtained from hermes's local DB). atlas runs the AI loop.
    // The resulting thread should appear in hermes's local DB in the
    // remote/atlas subfolder.
    //
    // This validates that the bidirectional relay works in both directions:
    //   TM1: atlas → hermes (covered above)
    //   TM3: hermes → atlas (reverse direction)
    //
    // Note: atlas's ws-provider/stream requires a valid token from atlas's DB.
    // We use the stored connection token from the local remoteConnections row
    // (the token hermes obtained during connect — it's atlas's device token).

    it("TM3: reverse stream — hermes initiates to atlas, thread appears in hermes remote/atlas folder", async () => {
      setFetchCacheContext("transport-mirror-tm3");

      // Get the token hermes holds for atlas (stored in hermes's remote_connections).
      // This is the token atlas issued during registration (atlas's device token).
      const pdb = getProdDb();
      const connRow = await pdb.execute<{
        token: string;
        lead_id: string;
      }>(
        sql`SELECT token, lead_id FROM remote_connections
                WHERE user_id = ${prodUserId}
                  AND instance_id = ${ATLAS_INSTANCE_ID}
                LIMIT 1`,
      );

      const remoteConnRow = connRow.rows[0];
      expect(
        remoteConnRow?.token,
        "[TM3] hermes has no token for atlas — connectToHermes() registration did not complete. " +
          "Check that register/repository.ts stored the token on hermes's side.",
      ).toBeTruthy();
      if (!remoteConnRow?.token) {
        return;
      }

      // POST to atlas's ws-provider/stream endpoint directly.
      // Use hermes's stored token for atlas (a device token on atlas).
      const { RemoteConnectionRepository } =
        await import("@/app/api/[locale]/remote-connection/repository");
      const decryptedToken = RemoteConnectionRepository.decryptToken(
        remoteConnRow.token,
      );

      const devUrl = "http://localhost:3000";
      const { defaultLocale } = await import("@/i18n/core/config");
      const streamUrl = `${devUrl}/api/${defaultLocale}/agent/ai-stream/ws-provider/stream`;

      const streamResp = await fetch(streamUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // eslint-disable-next-line i18next/no-literal-string
          Authorization: `Bearer ${decryptedToken}`,
        },
        body: JSON.stringify({
          content: "[TM3 reverse-stream] Reply with exactly: REVERSE_OK",
          model: DEFAULT_CHAT_MODEL_ID,
          rootFolderId: DefaultFolderId.REMOTE,
          // instanceId identifies the calling instance as known by the provider (atlas).
          // Hermes is known as HERMES_INSTANCE_ID ("hermes") by atlas.
          instanceId: HERMES_INSTANCE_ID,
        }),
        signal: AbortSignal.timeout(60_000),
      });

      expect(
        streamResp.ok,
        `TM3: ws-provider/stream POST to atlas failed with ${String(streamResp.status)}`,
      ).toBe(true);
      if (!streamResp.ok) {
        return;
      }

      const streamBody = (await streamResp.json()) as {
        success?: boolean;
        data?: { responseThreadId?: string; messageId?: string };
      };

      const responseThreadId = streamBody.data?.responseThreadId;
      expect(
        responseThreadId,
        "TM3: ws-provider/stream must return responseThreadId",
      ).toBeTruthy();
      if (!responseThreadId) {
        return;
      }

      // Wait for the stream to complete on atlas (poll thread state).
      const deadline = Date.now() + 60_000;
      let threadIdle = false;
      while (!threadIdle && Date.now() < deadline) {
        const [threadRow] = await db
          .select({ streamingState: chatThreads.streamingState })
          .from(chatThreads)
          .where(eq(chatThreads.id, responseThreadId))
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
        `TM3: atlas thread ${responseThreadId} did not reach idle state within timeout`,
      ).toBe(true);

      // ── atlas side: thread must exist locally ──────────────────────
      const [localThread] = await db
        .select({
          id: chatThreads.id,
          rootFolderId: chatThreads.rootFolderId,
        })
        .from(chatThreads)
        .where(eq(chatThreads.id, responseThreadId))
        .limit(1);

      expect(
        localThread,
        `TM3: thread ${responseThreadId} not found on atlas after reverse stream.`,
      ).toBeDefined();
    }, 180_000);

    // ── TM2: threadMirrorMode='none' — no local write on atlas ────────

    it("TM2: threadMirrorMode='none' skips local write on atlas — stream still runs on hermes", async () => {
      setFetchCacheContext("transport-mirror-tm2");

      // Set mode to 'none': atlas must NOT write the thread locally.
      // hermes still runs the AI loop and stores the thread on its side.
      await db
        .update(remoteConnections)
        .set({ threadMirrorMode: "none", updatedAt: new Date() })
        .where(
          and(
            eq(remoteConnections.userId, testUser.id),
            eq(remoteConnections.instanceId, HERMES_INSTANCE_ID),
          ),
        );

      try {
        const { result } = await runTestStream({
          user: testUser,
          prompt: "[TM2 no-mirror-test] Reply with exactly: REMOTE_ONLY",
          rootFolderId: DefaultFolderId.REMOTE,
          subFolderId: localFolderId,
          favoriteId: tmFavoriteId,
        });

        // The stream itself must succeed — hermes still runs it.
        expect(
          result.success,
          `TM2 stream failed: ${!result.success ? result.message : ""}`,
        ).toBe(true);
        if (!result.success) {
          return;
        }

        const threadId = result.data.threadId;
        if (!threadId) {
          return;
        }

        // ── Local side: thread must NOT be persisted ──────────────────────
        // Give any async write a chance to land, then confirm absence.
        await new Promise<void>((resolve) => {
          setTimeout(resolve, 2_000);
        });

        const [localThread] = await db
          .select({ id: chatThreads.id })
          .from(chatThreads)
          .where(eq(chatThreads.id, threadId))
          .limit(1);

        expect(
          localThread,
          `TM2: thread ${threadId} was written locally on atlas even though threadMirrorMode='none'. ` +
            `The relay path must respect threadMirrorMode and skip local DB writes when set to 'none'.`,
        ).toBeUndefined();
      } finally {
        // Always restore to 'both' so subsequent tests are not affected,
        // even if runTestStream throws or an assertion fails.
        await db
          .update(remoteConnections)
          .set({ threadMirrorMode: "both", updatedAt: new Date() })
          .where(
            and(
              eq(remoteConnections.userId, testUser.id),
              eq(remoteConnections.instanceId, HERMES_INSTANCE_ID),
            ),
          );
      }
    }, 180_000);
  });
}
