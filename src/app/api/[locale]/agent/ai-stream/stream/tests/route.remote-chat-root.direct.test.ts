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
  ATLAS_INSTANCE_ID,
  failSuitePrerequisites,
  isHermesInFixtureMode,
  resolveDevUser,
  resolveRemoteUrlSync,
} from "../../testing/remote-setup";
import {
  assertHermesFolderChainHasThread,
  makeDirectSetup,
} from "./helpers/remote";
import { describeStreamSuite } from "./route-base.test";

const _remoteUrl = resolveRemoteUrlSync();
const _isFixtureMode = isHermesInFixtureMode();

// Direct-http connection + REMOTE/hermes subfolder on atlas + remote credit
// top-up for the remote admin AND the mirrored testUser (the relayed loop
// bills the mirrored user on hermes) + mirrored teardown.
const hooks = makeDirectSetup(_remoteUrl, {
  createRemoteFolder: true,
});

if (_remoteUrl && _isFixtureMode) {
  describeStreamSuite({
    label: `AI Stream — remote chat root direct-HTTP (${_remoteUrl}, REMOTE/hermes, AI on hermes)`,
    cachePrefix: "remote-chat-root-direct-",
    // Tools and system prompt ALWAYS come from the client (options on the
    // ai-stream) — the executor runs the loop but identifies the CALLER.
    assertSystemPromptFromLocal: true,
    expectRelayTransport: "direct-http",
    get rootFolderIdOverride() {
      return DefaultFolderId.REMOTE;
    },
    get subFolderIdOverride() {
      return hooks.getLocalFolderId() ?? undefined;
    },
    setup: hooks.setup,
    teardown: hooks.teardown,
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

      await hooks.setup(testUser);

      // Create REMOTE/hermes/tests/remote-chat-root-direct folder chain on atlas.
      _rcrTestsFolderId = await getOrCreateFolder(
        testUser,
        DefaultFolderId.REMOTE,
        "tests",
        hooks.getLocalFolderId() ?? undefined,
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
        await hooks.teardown(testUser);
      }
      await closeProdDb();
    });

    it("RCR-D1: atlas thread is in REMOTE/hermes/tests/remote-chat-root-direct", async () => {
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

    it("RCR-D3: hermes thread is in REMOTE/atlas/tests/remote-chat-root-direct", async () => {
      // The executor SERVES the originator (atlas connected to hermes), so its
      // copy lands under REMOTE/<clientInstanceId>/<path>.
      await assertHermesFolderChainHasThread({
        prodUserId: hooks.getProdUserId(),
        rootFolderId: DefaultFolderId.REMOTE,
        folderChain: [ATLAS_INSTANCE_ID, "tests", "remote-chat-root-direct"],
        threadId,
      });
    }, 30_000);

    it("RCR-D4: hermes has messages — AI loop ran there", async () => {
      await assertProdDbHasMessages(threadId, 2);
    }, 30_000);
  });
  // ── Loop on CLIENT: the cloud (hermes) originates, this side runs the loop.
  //    Cloud copy:  REMOTE/atlas/tests/loop-on-client-direct
  //    Client copy: BACKGROUND/remote/hermes/tests/loop-on-client-direct
  describeLoopOnClientSuite({
    label: `Remote Chat Root — loop on CLIENT via direct-HTTP (${_remoteUrl})`,
    transport: "direct-http",
    caseName: "loop-on-client-direct",
    fetchCacheContext: "remote-chat-root-direct-loop-on-client",
    hooks: makeDirectSetup(_remoteUrl, { createRemoteFolder: true }),
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
