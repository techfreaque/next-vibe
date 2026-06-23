/**
 * AI Stream Integration — Remote Chat Root: Direct-HTTP relay + REMOTE folder
 *
 * Thread locations (threadMirrorMode='both'):
 *   Local  (atlas):  REMOTE     → hermes → tests → remote-chat-root-direct → <thread>
 *   Remote (hermes): BACKGROUND → atlas  → tests → remote-chat-root-direct → <thread>
 *
 * Standalone bidirectional assertions (RCR-D1–RCR-D4):
 *   RCR-D1 — atlas thread in REMOTE/hermes/tests/remote-chat-root-direct
 *   RCR-D2 — atlas has messages and AI response contains marker
 *   RCR-D3 — hermes thread in BACKGROUND/atlas/tests/remote-chat-root-direct
 *   RCR-D4 — hermes has messages — AI loop ran there
 *
 * PREREQUISITES
 * ─────────────
 *   Terminal 1: vibe dev               (atlas, port 3000)
 *   Terminal 2: vibe --hermes dev       (hermes, port 3002)
 */

import "server-only";

import { installFetchCache } from "../../testing/fetch-cache";
installFetchCache();

import { sql } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
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
} from "../../testing/remote-setup";
import { describeStreamSuite } from "./route-base.test";

const _remoteUrl = resolveRemoteUrlSync();
const _isFixtureMode = isHermesInFixtureMode();

let _localFolderId: string | null = null;
let _mainProdUserId: string | null = null;

async function setup(testUser: JwtPrivatePayloadType): Promise<void> {
  await disconnectFromHermes(testUser.id);
  await connectToHermes(testUser, _remoteUrl ?? "http://localhost:3002");

  _mainProdUserId = await resolveProdUserId();
  const remoteAdminToken = await resolveProdAdminToken(
    _remoteUrl ?? "http://localhost:3002",
  );
  await ensureRemoteUserCredits(
    _remoteUrl ?? "http://localhost:3002",
    remoteAdminToken,
    _mainProdUserId,
    20000,
  );
  await ensureRemoteUserCredits(
    _remoteUrl ?? "http://localhost:3002",
    remoteAdminToken,
    testUser.id,
    20000,
  );

  _localFolderId = await getOrCreateFolder(
    testUser,
    DefaultFolderId.REMOTE,
    HERMES_INSTANCE_ID,
    null,
  );
}

async function teardown(testUser: JwtPrivatePayloadType): Promise<void> {
  await disconnectFromHermes(testUser.id);
  if (_mainProdUserId) {
    await unregisterDevFromHermes(_mainProdUserId);
  }
  _localFolderId = null;
  _mainProdUserId = null;
}

if (_remoteUrl && _isFixtureMode) {
  describeStreamSuite({
    label: `AI Stream — remote chat root direct-HTTP (${_remoteUrl}, REMOTE/hermes, AI on hermes)`,
    cachePrefix: "remote-chat-root-direct-",
    systemPromptInstanceId: HERMES_INSTANCE_ID,
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

  describe(`Remote Chat Root Direct — bidirectional thread location (${_remoteUrl})`, () => {
    let testUser: JwtPrivatePayloadType;
    let threadId: string;
    let _rcrTestsFolderId: string | null = null;
    let _rcrSuiteFolderId: string | null = null;

    beforeAll(async () => {
      const resolved = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
      expect(resolved, "admin user not found — run: vibe dev").toBeTruthy();
      if (!resolved) {
        // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
        throw new Error("RCR-D setup failed: admin user not found");
      }
      testUser = resolved;

      await setup(testUser);

      // Create REMOTE/hermes/tests/remote-chat-root-direct folder chain on atlas.
      _rcrTestsFolderId = await getOrCreateFolder(
        testUser,
        DefaultFolderId.REMOTE,
        "tests",
        _localFolderId ?? undefined,
      );
      _rcrSuiteFolderId = await getOrCreateFolder(
        testUser,
        DefaultFolderId.REMOTE,
        "remote-chat-root-direct",
        _rcrTestsFolderId ?? undefined,
      );

      setFetchCacheContext("remote-chat-root-direct-rcr-d-");
      const streamResult = await runTestStream({
        prompt: "Reply with EXACTLY: RCR_DIRECT_OK. Nothing else.",
        user: testUser,
        rootFolderId: DefaultFolderId.REMOTE,
        subFolderId: _rcrSuiteFolderId ?? undefined,
      });

      expect(
        streamResult.result.success,
        "RCR-D setup: stream must succeed",
      ).toBe(true);
      if (!streamResult.result.success) {
        // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
        throw new Error("RCR-D setup failed: stream did not succeed");
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

    it("RCR-D1: atlas thread is in REMOTE/hermes/tests/remote-chat-root-direct", async () => {
      const { db } = await import("@/app/api/[locale]/system/db");
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
        `RCR-D1: thread ${threadId} must exist in atlas DB`,
      ).toBeTruthy();
      expect(row?.rootFolderId, "RCR-D1: must be in REMOTE root").toBe(
        DefaultFolderId.REMOTE,
      );
      expect(
        row?.folderId,
        "RCR-D1: must be in REMOTE/hermes/tests/remote-chat-root-direct subfolder",
      ).toBe(_rcrSuiteFolderId);
    }, 30_000);

    it("RCR-D2: atlas has messages and AI response contains marker", async () => {
      const messages = await fetchThreadMessages(threadId, testUser);
      expect(
        messages.length,
        "RCR-D2: atlas must have messages",
      ).toBeGreaterThan(0);
      const aiMsg = messages.find(
        (m) => m.role === "assistant" && m.content?.includes("RCR_DIRECT_OK"),
      );
      expect(
        aiMsg,
        "RCR-D2: AI response must contain RCR_DIRECT_OK",
      ).toBeTruthy();
    }, 30_000);

    it("RCR-D3: hermes thread is in BACKGROUND/atlas/tests/remote-chat-root-direct", async () => {
      const pdb = getProdDb();

      // Resolve BACKGROUND/atlas on hermes.
      const atlasRows = await pdb.execute<{ id: string }>(
        sql`SELECT id FROM chat_folders
              WHERE user_id = ${_mainProdUserId}
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
              WHERE user_id = ${_mainProdUserId}
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

      // Resolve BACKGROUND/atlas/tests/remote-chat-root-direct on hermes.
      const suiteRows = await pdb.execute<{ id: string }>(
        sql`SELECT id FROM chat_folders
              WHERE user_id = ${_mainProdUserId}
                AND root_folder_id = ${DefaultFolderId.BACKGROUND}
                AND name = 'remote-chat-root-direct'
                AND parent_id = ${testsFolderId}
              LIMIT 1`,
      );
      expect(
        suiteRows.rows.length,
        "BACKGROUND/atlas/tests/remote-chat-root-direct must exist on hermes",
      ).toBeGreaterThan(0);
      const hermesTargetFolderId = suiteRows.rows[0]!.id;

      await assertProdDbHasThread(threadId, hermesTargetFolderId);
    }, 30_000);

    it("RCR-D4: hermes has messages — AI loop ran there", async () => {
      await assertProdDbHasMessages(threadId, 2);
    }, 30_000);
  });
} else if (!_remoteUrl) {
  failSuitePrerequisites(
    "remote-chat-root-direct",
    "hermes not running — start: vibe --hermes dev",
  );
} else {
  failSuitePrerequisites(
    "remote-chat-root-direct",
    "hermes running but not in fixture mode — restart: vibe --hermes dev --fixture-mode",
  );
}
