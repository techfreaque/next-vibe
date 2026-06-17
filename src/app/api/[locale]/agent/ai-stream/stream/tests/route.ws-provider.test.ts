/**
 * AI Stream Integration — WS-Provider (hermes 3002, transportMode='ws-provider')
 *
 * Tests the ws-provider transport mode:
 *
 *   1. atlas sets transportMode='ws-provider' + isInferenceProvider=true on the
 *      connection to hermes, so hermes's AI loop handles all inference.
 *   2. When a stream request arrives, atlas's stream-relay POSTs to hermes's
 *      /ws-provider/stream endpoint and subscribes to the thread channel via WS.
 *   3. Hermes runs the AI loop; when the AI calls a tool, hermes emits
 *      tool-execute-request on agent/chat/threads/{threadId}/messages.
 *   4. atlas's WS subscriber receives the request, executes the tool locally,
 *      and POSTs tool-execute-result back to hermes via /ws/broadcast.
 *   5. hermes resolves the pending promise, AI loop continues, emits stream events.
 *   6. atlas relays all events to the local client via MessageDbWriter.
 *
 * Provider-side storage rule: hermes never persists threads/messages for ws-provider
 * sessions (incognito folder). All persistence lives on atlas (threadMirrorMode='both').
 *
 * Verified behaviors (via describeStreamSuite):
 *   WP1  — basic stream runs to completion; thread is idle; messages in atlas DB
 *   WP2  — AI calls tool-execute-request; atlas executes and sends result; AI continues
 *
 * Standalone suite (WP3–WP6):
 *   WP3  — threadMirrorMode=both → thread + messages exist in atlas DB
 *   WP4  — provider stateless: prod DB has ZERO chatMessages for the thread
 *   WP5  — tool roundtrip completed: atlas DB has a TOOL message with non-null result
 *   WP6  — hermes ran the AI loop: final AI message contains expected marker text
 *
 * PREREQUISITES
 * ─────────────
 *   Terminal 1: vibe dev               (atlas, port 3000, dev DB port 5432)
 *   Terminal 2: vibe --hermes dev       (hermes, port 3002, prod DB port 5433)
 */

import "server-only";

// AI SDK v2→v3 compat mode warning - provider works fine, SDK just prefers v3
// eslint-disable-next-line i18next/no-literal-string
globalThis.AI_SDK_LOG_WARNINGS = false;

import { installFetchCache } from "../../testing/fetch-cache";
installFetchCache();

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { ChatMessageRole } from "@/app/api/[locale]/agent/chat/enum";
import { RouteExecuteRepository } from "@/app/api/[locale]/system/unified-interface/execute-tool/repository";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { env } from "@/config/env";
import { defaultLocale } from "@/i18n/core/config";

import { setFetchCacheContext } from "../../testing/fetch-cache";
import {
  fetchThreadMessages,
  getOrCreateFolder,
  runTestStream,
} from "../../testing/headless-test-runner";
import {
  failSuitePrerequisites,
  isHermesInFixtureMode,
  resolveDevUser,
  resolveRemoteUrl,
} from "../../testing/remote-setup";
import { describeStreamSuite } from "./route-base.test";

const _remoteUrl = await resolveRemoteUrl();
const _isFixtureMode = isHermesInFixtureMode();

const HERMES_INSTANCE_ID = "hermes";

let _mainProdUserId: string | null = null;

async function setupWsProviderConnection(
  testUser: JwtPrivatePayloadType,
): Promise<void> {
  const {
    connectToHermes,
    disconnectFromHermes,
    ensureRemoteUserCredits,
    resolveProdAdminToken,
    resolveProdUserId,
    triggerPull,
  } = await import("../../testing/remote-setup");

  // Idempotent: clean up any leftover connection from a previous failed run
  await disconnectFromHermes(testUser.id);

  // E2E: log into remote, register atlas, sync capabilities.
  // connectToHermes sets transportMode='direct-http', loopLocation='server',
  // toolSource='local', threadMirrorMode='both' by default.
  await connectToHermes(testUser, _remoteUrl ?? "http://localhost:3002");

  // Switch to ws-provider transport mode and mark hermes as inference provider.
  // isInferenceProvider=true means hermes handles ALL inference for this connection —
  // no routing-rule match required. atlas will POST to hermes's /ws-provider/stream
  // and hermes dispatches tool-execute-request back to atlas via WS.
  const connByIdDef =
    await import("@/app/api/[locale]/remote-connection/[instanceId]/definition");
  await RouteExecuteRepository.runInProcessTyped({
    definition: connByIdDef.default.PATCH,
    input: { isInferenceProvider: true, forceSystemProvider: true },
    urlPathParams: { instanceId: HERMES_INSTANCE_ID },
    user: testUser,
    locale: defaultLocale,
    platform: Platform.AI,
    logger: createEndpointLogger(false, Date.now(), defaultLocale),
  });

  // Ensure capabilities are populated before tests run
  await triggerPull();

  _mainProdUserId = await resolveProdUserId();

  // Top up credits on the remote so the AI loop does not fail mid-stream
  const remoteAdminToken = await resolveProdAdminToken(
    _remoteUrl ?? "http://localhost:3002",
  );
  await ensureRemoteUserCredits(
    _remoteUrl ?? "http://localhost:3002",
    remoteAdminToken,
    _mainProdUserId,
    20000,
  );
}

async function teardownWsProviderConnection(
  testUser: JwtPrivatePayloadType,
): Promise<void> {
  const { disconnectFromHermes, unregisterDevFromHermes } =
    await import("../../testing/remote-setup");

  const tasks: Promise<void>[] = [disconnectFromHermes(testUser.id)];
  if (_mainProdUserId) {
    tasks.push(unregisterDevFromHermes(_mainProdUserId));
  }
  await Promise.all(tasks);
  _mainProdUserId = null;
}

if (_remoteUrl && _isFixtureMode) {
  // ── Main suite: full stream integration via describeStreamSuite ───────────────
  // Covers WP1 (basic stream) and WP2 (tool dispatch roundtrip) implicitly via
  // the T1 tool-help call in describeStreamSuite.
  describeStreamSuite({
    label: `AI Stream Integration — WS-Provider (${_remoteUrl}, transportMode='ws-provider')`,
    cachePrefix: "ws-provider-",
    // No remoteInstanceId: tools execute on atlas (local) via tool-execute-request
    // roundtrip; the AI calls them via the request name directly (no execute-tool wrapper).
    // Tool confirmations require local state. The AI runs on hermes remotely.
    // Attachment metadata is processed on the provider (hermes) side only.
    // Credits are deducted on hermes (remote). Not visible in local testUser balance.
    // System prompt is built locally (atlas) and sent in the ws-provider/stream POST.
    assertSystemPromptFromLocal: true,
    setup: setupWsProviderConnection,
    teardown: teardownWsProviderConnection,
  });

  // ── WP3–WP6: Provider stateless + tool roundtrip + AI loop assertions ─────────
  // WP3/WP4: verify incognito guarantee — hermes never persists threads/messages.
  // WP5: verify the tool-execute-request roundtrip completed successfully.
  // WP6: verify hermes actually ran the AI loop (not just relayed).

  describe(`WS-Provider — provider stateless + roundtrip assertions (${_remoteUrl})`, () => {
    let testUser: JwtPrivatePayloadType;
    let threadId: string;
    let wp3Wp6FolderId: string;

    beforeAll(async () => {
      const resolved = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
      expect(
        resolved,
        `WP3-WP6: admin user ${env.VIBE_ADMIN_USER_EMAIL} not found — run: vibe dev`,
      ).toBeTruthy();
      if (!resolved) {
        // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
        throw new Error(
          `WP3-WP6 setup failed: admin user ${env.VIBE_ADMIN_USER_EMAIL} not found — cannot continue suite (run: vibe dev)`,
        );
      }
      testUser = resolved;

      // Connection may already be set up by the main describeStreamSuite;
      // calling again is idempotent (disconnects first, then reconnects).
      await setupWsProviderConnection(testUser);

      // Create BACKGROUND/tests/ws-provider subfolder for this standalone suite.
      const testsParentId = await getOrCreateFolder(
        testUser,
        DefaultFolderId.BACKGROUND,
        "tests",
      );
      wp3Wp6FolderId = await getOrCreateFolder(
        testUser,
        DefaultFolderId.BACKGROUND,
        "ws-provider",
        testsParentId,
      );

      // Run a stream that forces a tool call (tool-help) so we can assert the
      // tool-execute-request roundtrip completed and the AI continued correctly.
      // The prompt asks the AI to call tool-help and report back with a marker,
      // which proves hermes's AI loop ran AND the WS roundtrip produced a result.
      setFetchCacheContext("ws-provider-wp3-wp6-");
      const streamResult = await runTestStream({
        prompt:
          "Call the tool-help tool with query='tool-help' and then reply with EXACTLY: WP_ROUNDTRIP_COMPLETE. Nothing else.",
        user: testUser,
        rootFolderId: DefaultFolderId.BACKGROUND,
        subFolderId: wp3Wp6FolderId,
      });

      expect(
        streamResult.result.success,
        "WP3-WP6 setup: stream must succeed",
      ).toBe(true);

      if (!streamResult.result.success) {
        // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
        throw new Error(
          "WP3-WP6 setup failed: stream did not succeed — cannot continue suite",
        );
      }

      threadId = streamResult.result.data.threadId ?? "";

      expect(
        streamResult.messages.length,
        "WP3-WP6 setup: stream must produce at least one message",
      ).toBeGreaterThan(0);
    }, 120_000);

    afterAll(async () => {
      const { closeProdDb } = await import("../../testing/remote-setup");
      if (testUser) {
        await teardownWsProviderConnection(testUser);
      }
      await closeProdDb();
    });

    it("WP3: threadMirrorMode=both → thread + messages exist in atlas DB", async () => {
      const threadDef =
        await import("@/app/api/[locale]/agent/chat/threads/[threadId]/definition");
      const threadResult = await RouteExecuteRepository.runInProcessTyped({
        definition: threadDef.default.GET,
        input: { rootFolderId: DefaultFolderId.REMOTE },
        urlPathParams: { threadId },
        user: testUser,
        locale: defaultLocale,
        platform: Platform.AI,
        logger: createEndpointLogger(false, Date.now(), defaultLocale),
      });

      expect(
        threadResult.success,
        "WP3: thread must exist in atlas DB (threadMirrorMode=both)",
      ).toBe(true);

      const msgs = await fetchThreadMessages(threadId, testUser);

      expect(
        msgs.length,
        "WP3: messages must exist in atlas DB (threadMirrorMode=both)",
      ).toBeGreaterThan(0);
    }, 30_000);

    it("WP4: provider stateless → prod DB has ZERO chatMessages for the thread", async () => {
      const { assertProdDbEmpty } = await import("../../testing/remote-setup");
      await assertProdDbEmpty(threadId, "chat_messages");
    }, 30_000);

    it("WP5: tool roundtrip completed → atlas DB has TOOL message with non-null result", async () => {
      // The tool-help call was dispatched from hermes to atlas via tool-execute-request.
      // Atlas executed it locally and sent tool-execute-result back to hermes.
      // The MessageDbWriter on atlas persists the tool message including metadata.result.
      // Verify: at least one TOOL message exists, and its metadata.toolCall.result is non-null.
      const msgs = await fetchThreadMessages(threadId, testUser);
      const toolMsgs = msgs.filter((m) => m.role === ChatMessageRole.TOOL);

      expect(
        toolMsgs.length,
        "WP5: expected at least one TOOL message in atlas DB for the tool-help call",
      ).toBeGreaterThan(0);

      // At least one tool message must have a completed result (not just pending)
      const completedTool = toolMsgs.find(
        (m) => m.toolCall?.result !== undefined && m.toolCall.result !== null,
      );

      expect(
        completedTool,
        "WP5: expected at least one TOOL message with non-null result — " +
          "tool-execute-request roundtrip must have completed via WS",
      ).toBeTruthy();
    }, 30_000);

    it("WP6: hermes ran the AI loop → final AI message contains expected marker", async () => {
      // If hermes ran the AI loop correctly and the WS roundtrip delivered the tool result,
      // the AI's final response must contain our requested marker.
      const msgs = await fetchThreadMessages(threadId, testUser);
      const assistantMsgs = msgs.filter(
        (m) => m.role === ChatMessageRole.ASSISTANT && m.content !== null,
      );

      expect(
        assistantMsgs.length,
        "WP6: expected at least one assistant message in atlas DB",
      ).toBeGreaterThan(0);

      const markerMsg = assistantMsgs.find((m) =>
        m.content?.includes("WP_ROUNDTRIP_COMPLETE"),
      );

      expect(
        markerMsg,
        "WP6: expected final AI message to contain 'WP_ROUNDTRIP_COMPLETE' — " +
          "proves hermes ran the AI loop AND the WS tool roundtrip completed",
      ).toBeTruthy();
    }, 30_000);
  });
} else if (!_remoteUrl) {
  failSuitePrerequisites(
    "WS-Provider",
    "hermes not running — start: vibe --hermes dev",
  );
} else if (!_isFixtureMode) {
  failSuitePrerequisites(
    "WS-Provider",
    "hermes is running but not in fixture mode — restart: vibe --hermes dev --fixture-mode",
  );
}
