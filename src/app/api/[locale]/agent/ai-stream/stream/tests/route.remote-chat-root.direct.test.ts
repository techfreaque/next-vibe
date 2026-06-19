/**
 * AI Stream Integration — Remote Chat Root: Direct-HTTP relay + REMOTE folder
 *
 * Streams go into the REMOTE/hermes subfolder. connectToHermes sets
 * isDefault=true so the AI loop runs on hermes (loopLocation='server').
 *
 * Thread mirroring (threadMirrorMode='both'):
 *   - Atlas:  REMOTE/<hermes-subfolder-uuid>
 *   - Hermes: REMOTE/<atlas-subfolder-uuid>
 *
 * Full T-suite via describeStreamSuite (rootFolderIdOverride=REMOTE,
 * subFolderIdOverride=<hermes-instance-folder-uuid>).
 *
 * Standalone suite (RCR-D1–RCR-D4) verifies bidirectional storage:
 *   RCR-D1 — atlas thread in REMOTE/hermes subfolder
 *   RCR-D2 — atlas has messages, AI response contains marker
 *   RCR-D3 — hermes thread in REMOTE/atlas subfolder
 *   RCR-D4 — hermes has messages (AI loop ran there)
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
    // REMOTE-folder semantics: loop, tools and system prompt all come from
    // the remote instance — the thread merely starts locally and mirrors back.
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

  describe(`Remote Chat Root Direct — bidirectional mirror assertions (${_remoteUrl})`, () => {
    let testUser: JwtPrivatePayloadType;
    let threadId: string;

    beforeAll(async () => {
      const resolved = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
      expect(resolved, `admin user not found — run: vibe dev`).toBeTruthy();
      if (!resolved) {
        // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
        throw new Error(
          "RCR-D setup failed: admin user not found — cannot continue suite (run: vibe dev)",
        );
      }
      testUser = resolved;

      await setup(testUser);

      setFetchCacheContext("remote-chat-root-direct-rcr-d-");
      const streamResult = await runTestStream({
        prompt: "Reply with EXACTLY: RCR_DIRECT_OK. Nothing else.",
        user: testUser,
        rootFolderId: DefaultFolderId.REMOTE,
        subFolderId: _localFolderId ?? undefined,
      });

      expect(
        streamResult.result.success,
        "RCR-D setup: stream must succeed",
      ).toBe(true);
      if (!streamResult.result.success) {
        // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
        throw new Error(
          "RCR-D setup failed: stream did not succeed — cannot continue suite",
        );
      }
      threadId = streamResult.result.data.threadId ?? "";
    }, 120_000);

    afterAll(async () => {
      if (testUser) {
        await teardown(testUser);
      }
    });

    it("RCR-D1: atlas thread is in REMOTE/hermes subfolder", async () => {
      const threadDef =
        await import("@/app/api/[locale]/agent/chat/threads/[threadId]/definition");
      const result = await RouteExecuteRepository.runInProcessTyped({
        definition: threadDef.default.GET,
        input: { rootFolderId: DefaultFolderId.REMOTE },
        urlPathParams: { threadId },
        user: testUser,
        locale: defaultLocale,
        platform: Platform.AI,
        logger: createEndpointLogger(false, Date.now(), defaultLocale),
      });

      expect(result.success, `thread ${threadId} must exist in atlas DB`).toBe(
        true,
      );
      const threadRow = result.success ? result.data : null;
      expect(
        threadRow?.["rootFolderId"],
        "must be in REMOTE root on atlas",
      ).toBe(DefaultFolderId.REMOTE);
      expect(
        threadRow?.["folderId"],
        `must be in REMOTE/hermes subfolder`,
      ).toBe(_localFolderId);
    }, 30_000);

    it("RCR-D2: atlas has messages and AI response contains marker", async () => {
      const messages = await fetchThreadMessages(threadId, testUser);
      expect(messages.length, "atlas must have messages").toBeGreaterThan(0);
      const aiMsg = messages.find(
        (m) => m.role === "assistant" && m.content?.includes("RCR_DIRECT_OK"),
      );
      expect(aiMsg, "AI response must contain RCR_DIRECT_OK").toBeTruthy();
    }, 30_000);

    it("RCR-D3: hermes thread is in REMOTE/atlas subfolder", async () => {
      const { getProdDb } = await import("../../testing/remote-setup");
      const pdb = getProdDb();

      const folderRows = await pdb.execute<{ id: string }>(
        sql`SELECT id FROM chat_folders WHERE root_folder_id = ${DefaultFolderId.REMOTE} AND name = ${ATLAS_INSTANCE_ID} LIMIT 1`,
      );
      expect(
        folderRows.rows.length,
        `REMOTE/${ATLAS_INSTANCE_ID} subfolder must exist on hermes`,
      ).toBeGreaterThan(0);

      await assertProdDbHasThread(threadId, folderRows.rows[0]!.id);
    }, 30_000);

    it("RCR-D4: hermes has messages — AI loop ran there", async () => {
      await assertProdDbHasMessages(threadId, 1);
    }, 30_000);
  });
} else if (!_remoteUrl) {
  failSuitePrerequisites(
    "remote-chat-root-direct",
    "hermes not running — start: vibe --hermes dev",
  );
} else if (!_isFixtureMode) {
  failSuitePrerequisites(
    "remote-chat-root-direct",
    "hermes running but not in fixture mode — restart: vibe --hermes dev --fixture-mode",
  );
}
