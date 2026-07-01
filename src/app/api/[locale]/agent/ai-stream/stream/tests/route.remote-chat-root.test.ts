/**
 * AI Stream Integration — Remote Chat Root: Reverse-WS transport
 *
 * Thread locations (threadMirrorMode='both'):
 *   Local  (atlas):  REMOTE  → hermes → tests → unbottled-relay → <thread>
 *   Remote (hermes): BACKGROUND → atlas → tests → unbottled-relay → <thread>
 *
 * The REMOTE folder routes by default: the AI loop runs ON HERMES, events mirror
 * back under REMOTE/hermes on atlas. The suite is the regular T-suite plus:
 *   T-RELAY — hermes wallet decreased (proves loop ran on hermes)
 *   T-SYS   — AI reports hermes instance ID (proves system prompt from hermes)
 *
 * Standalone bidirectional assertions (RCR-1–RCR-4):
 *   RCR-1 — atlas thread is in REMOTE/hermes/tests/unbottled-relay
 *   RCR-2 — atlas has messages and AI response contains marker
 *   RCR-3 — hermes thread is in BACKGROUND/atlas/tests/unbottled-relay
 *   RCR-4 — hermes has messages — AI loop ran there
 *
 * Transport: reverse-ws, routing by REMOTE folder ancestry.
 *
 * PREREQUISITES
 * ─────────────
 *   Terminal 1: vibe dev                        (atlas, port 3000)
 *   Terminal 2: vibe --hermes dev --fixture-mode (hermes, port 3002)
 */

import "server-only";

import { installFetchCache } from "../../testing/fetch-cache";
installFetchCache();

import { sql } from "drizzle-orm";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { env } from "@/config/env";

import { setFetchCacheContext } from "../../testing/fetch-cache";
import {
  fetchThreadMessages,
  getOrCreateFolder,
  runTestStream,
} from "../../testing/headless-test-runner";
import {
  assertProdDbHasMessages,
  assertProdDbHasThread,
  ATLAS_INSTANCE_ID,
  connectToHermesLocalAi,
  disconnectFromHermesLocalAi,
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
} from "../../testing/remote-setup";
import { describeStreamSuite } from "./route-base.test";

const _remoteUrl = resolveRemoteUrlSync();
const _isFixtureMode = isHermesInFixtureMode();

/** REMOTE/hermes subfolder UUID on atlas — threads start here. */
let _localFolderId: string | null = null;
let _prodUserId: string | null = null;

async function setup(testUser: JwtPrivatePayloadType): Promise<void> {
  await connectToHermesLocalAi(testUser, _remoteUrl ?? "http://localhost:3002");

  // Create REMOTE/hermes subfolder on atlas — threads go here.
  _localFolderId = await getOrCreateFolder(
    testUser,
    DefaultFolderId.REMOTE,
    HERMES_INSTANCE_ID,
    null,
  );

  _prodUserId = await resolveProdUserId();
  const remoteAdminToken = await resolveProdAdminToken(
    _remoteUrl ?? "http://localhost:3002",
  );
  await ensureRemoteUserCredits(
    _remoteUrl ?? "http://localhost:3002",
    remoteAdminToken,
    _prodUserId,
    20000,
  );
}

async function teardown(testUser: JwtPrivatePayloadType): Promise<void> {
  await disconnectFromHermesLocalAi(
    testUser,
    _remoteUrl ?? "http://localhost:3002",
  );
  if (_prodUserId) {
    await unregisterDevFromHermes(_prodUserId);
  }
  _prodUserId = null;
  _localFolderId = null;
}

if (_remoteUrl && _isFixtureMode) {
  describeStreamSuite({
    label: `AI Stream — remote chat root reverse-WS (${_remoteUrl}, REMOTE/hermes → atlas, AI on hermes)`,
    cachePrefix: "unbottled-relay-",
    systemPromptInstanceId: HERMES_INSTANCE_ID,
    assertRelayRan: true,
    get rootFolderIdOverride() {
      return DefaultFolderId.REMOTE;
    },
    get subFolderIdOverride() {
      return _localFolderId ?? undefined;
    },
    setup,
    teardown,
  });

  // ── Bidirectional thread location assertions ───────────────────────────────
  // RCR-1: atlas thread in REMOTE/hermes/tests/unbottled-relay
  // RCR-2: atlas has messages with expected marker
  // RCR-3: hermes thread in BACKGROUND/atlas/tests/unbottled-relay
  // RCR-4: hermes has messages — AI loop ran there

  describe(`Remote Chat Root — bidirectional thread location (${_remoteUrl})`, () => {
    let testUser: JwtPrivatePayloadType;
    let threadId: string;
    let _rcrTestsFolderId: string | null = null;
    let _rcrSuiteFolderId: string | null = null;

    beforeAll(async () => {
      const resolved = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
      expect(resolved, "admin user not found — run: vibe dev").toBeTruthy();
      if (!resolved) {
        // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
        throw new Error("RCR setup failed: admin user not found");
      }
      testUser = resolved;

      await setup(testUser);

      // Create REMOTE/hermes/tests/unbottled-relay folder chain on atlas.
      _rcrTestsFolderId = await getOrCreateFolder(
        testUser,
        DefaultFolderId.REMOTE,
        "tests",
        _localFolderId ?? undefined,
      );
      _rcrSuiteFolderId = await getOrCreateFolder(
        testUser,
        DefaultFolderId.REMOTE,
        "unbottled-relay",
        _rcrTestsFolderId ?? undefined,
      );

      setFetchCacheContext("unbottled-relay-rcr-");
      const streamResult = await runTestStream({
        prompt: "Reply with EXACTLY: RCR_OK. Nothing else.",
        user: testUser,
        rootFolderId: DefaultFolderId.REMOTE,
        subFolderId: _rcrSuiteFolderId ?? undefined,
      });

      expect(
        streamResult.result.success,
        "RCR setup: stream must succeed",
      ).toBe(true);
      if (!streamResult.result.success) {
        // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
        throw new Error("RCR setup failed: stream did not succeed");
      }
      threadId = streamResult.result.data.threadId ?? "";
    }, 120_000);

    afterAll(async () => {
      const { closeProdDb } = await import("../../testing/remote-setup");
      if (testUser) {
        await teardown(testUser);
      }
      await closeProdDb();
    });

    it("RCR-1: atlas thread is in REMOTE/hermes/tests/unbottled-relay", async () => {
      const { db } = await import("next-vibe/database");
      const { chatThreads } = await import("@/app/api/[locale]/agent/chat/db");
      const { eq } = await import("drizzle-orm");
      const [row] = await db
        .select({
          folderId: chatThreads.folderId,
          rootFolderId: chatThreads.rootFolderId,
        })
        .from(chatThreads)
        .where(eq(chatThreads.id, threadId))
        .limit(1);

      expect(
        row,
        `RCR-1: thread ${threadId} must exist in atlas DB`,
      ).toBeTruthy();
      expect(row?.rootFolderId, "RCR-1: must be in REMOTE root").toBe(
        DefaultFolderId.REMOTE,
      );
      expect(
        row?.folderId,
        "RCR-1: must be in REMOTE/hermes/tests/unbottled-relay subfolder",
      ).toBe(_rcrSuiteFolderId);
    }, 30_000);

    it("RCR-2: atlas has messages and AI response contains marker", async () => {
      const msgs = await fetchThreadMessages(threadId, testUser);
      expect(msgs.length, "RCR-2: atlas must have messages").toBeGreaterThan(0);
      const aiMsg = msgs.find(
        (m) => m.role === "assistant" && m.content?.includes("RCR_OK"),
      );
      expect(aiMsg, "RCR-2: AI response must contain RCR_OK").toBeTruthy();
    }, 30_000);

    it("RCR-3: hermes thread is in BACKGROUND/atlas/tests/unbottled-relay", async () => {
      const pdb = getProdDb();

      // Resolve BACKGROUND/atlas on hermes.
      const atlasRows = await pdb.execute<{ id: string }>(
        sql`SELECT id FROM chat_folders
              WHERE user_id = ${_prodUserId}
                AND root_folder_id = ${DefaultFolderId.BACKGROUND}
                AND name = ${ATLAS_INSTANCE_ID}
                AND parent_id IS NULL
              LIMIT 1`,
      );
      expect(
        atlasRows.rows.length,
        `BACKGROUND/${ATLAS_INSTANCE_ID} subfolder must exist on hermes`,
      ).toBeGreaterThan(0);
      const atlasFolderId = atlasRows.rows[0]!.id;

      // Resolve BACKGROUND/atlas/tests on hermes.
      const testsRows = await pdb.execute<{ id: string }>(
        sql`SELECT id FROM chat_folders
              WHERE user_id = ${_prodUserId}
                AND root_folder_id = ${DefaultFolderId.BACKGROUND}
                AND name = 'tests'
                AND parent_id = ${atlasFolderId}
              LIMIT 1`,
      );
      expect(
        testsRows.rows.length,
        "BACKGROUND/atlas/tests must exist on hermes",
      ).toBeGreaterThan(0);
      const testsFolderId = testsRows.rows[0]!.id;

      // Resolve BACKGROUND/atlas/tests/unbottled-relay on hermes.
      const suiteRows = await pdb.execute<{ id: string }>(
        sql`SELECT id FROM chat_folders
              WHERE user_id = ${_prodUserId}
                AND root_folder_id = ${DefaultFolderId.BACKGROUND}
                AND name = 'unbottled-relay'
                AND parent_id = ${testsFolderId}
              LIMIT 1`,
      );
      expect(
        suiteRows.rows.length,
        "BACKGROUND/atlas/tests/unbottled-relay must exist on hermes",
      ).toBeGreaterThan(0);
      const hermesTargetFolderId = suiteRows.rows[0]!.id;

      await assertProdDbHasThread(threadId, hermesTargetFolderId);
    }, 30_000);

    it("RCR-4: hermes has messages — AI loop ran there", async () => {
      await assertProdDbHasMessages(threadId, 2);
    }, 30_000);
  });
} else if (!_remoteUrl) {
  failSuitePrerequisites(
    "remote-chat-root (reverse-WS)",
    "hermes not running — start: vibe --hermes dev --fixture-mode",
  );
} else {
  failSuitePrerequisites(
    "remote-chat-root (reverse-WS)",
    "hermes running but not in fixture mode — restart: vibe --hermes dev --fixture-mode",
  );
}
