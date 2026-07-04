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
  makeReverseWsSetup,
} from "./helpers/remote";
import { describeStreamSuite } from "./route-base.test";

const _remoteUrl = resolveRemoteUrlSync();
const _isFixtureMode = isHermesInFixtureMode();

// Reverse-WS connection + REMOTE/hermes subfolder on atlas (threads start
// there) + remote credit top-up (20000cr) + mirrored teardown.
const hooks = makeReverseWsSetup(_remoteUrl, { createRemoteFolder: true });

if (_remoteUrl && _isFixtureMode) {
  describeStreamSuite({
    label: `AI Stream — remote chat root reverse-WS (${_remoteUrl}, REMOTE/hermes → atlas, AI on hermes)`,
    cachePrefix: "unbottled-relay-",
    // Tools and system prompt ALWAYS come from the client (options on the
    // ai-stream) — the executor runs the loop but identifies the CALLER.
    assertSystemPromptFromLocal: true,
    assertRelayRan: true,
    expectRelayTransport: "reverse-ws",
    get rootFolderIdOverride() {
      return DefaultFolderId.REMOTE;
    },
    get subFolderIdOverride() {
      return hooks.getLocalFolderId() ?? undefined;
    },
    setup: hooks.setup,
    teardown: hooks.teardown,
  });

  // ── Loop-LOCAL variant: EXACT same cases, HERMES originates (its REMOTE/atlas
  //    folder), the loop executes HERE over the reverse-ws leg — client prompt +
  //    tools both ways. Placement asserted per case on both sides.
  describeStreamSuite({
    label: `AI Stream — remote chat root reverse-WS LOOP-LOCAL (${_remoteUrl} originates, AI here)`,
    cachePrefix: "rcr-rws-loop-local-",
    assertSystemPromptFromLocal: true,
    expectRelayTransport: "reverse-ws",
    originateOnRemote: true,
    setup: hooks.setup,
    teardown: hooks.teardown,
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

      await hooks.setup(testUser);

      // Create REMOTE/hermes/tests/unbottled-relay folder chain on atlas.
      _rcrTestsFolderId = await getOrCreateFolder(
        testUser,
        DefaultFolderId.REMOTE,
        "tests",
        hooks.getLocalFolderId() ?? undefined,
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
        // The runner resolves model/skill from a favorite — same budget
        // favorite (slug id) the main suites create in their setup.
        favoriteId: "quality-tester-budget",
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
        await hooks.teardown(testUser);
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

    it("RCR-3: hermes thread is in BACKGROUND/remote/atlas/tests/unbottled-relay", async () => {
      // Unified executor landing: the EXECUTOR side always lands its thread
      // copy under BACKGROUND/remote/<callerInstanceId>/<path> — the REMOTE
      // root belongs exclusively to the CALLER's view.
      await assertHermesFolderChainHasThread({
        prodUserId: hooks.getProdUserId(),
        rootFolderId: DefaultFolderId.BACKGROUND,
        folderChain: ["remote", ATLAS_INSTANCE_ID, "tests", "unbottled-relay"],
        threadId,
      });
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
