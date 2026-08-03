/**
 * AI Stream Integration — Inference Provider Modes
 *
 * All three suites share the same premise: hermes runs the full AI inference
 * loop. They differ only in how the stream is transported and how tools flow.
 *
 * ── Suite A: WS-Provider ──────────────────────────────────────────────────────
 * transportMode='ws-provider' + isInferenceProvider=true + forceSystemProvider=true.
 * Atlas posts to hermes's /ws-provider/stream; hermes runs the AI loop and
 * dispatches tool-execute-request back to atlas over WS. Atlas executes tools
 * locally and returns results. Atlas owns and stores the thread.
 * System prompt is built locally (atlas) and sent in the POST body.
 *
 * Standalone assertions (WP3–WP6):
 *   WP3 — originator owns the thread → thread + messages exist in atlas DB
 *   WP4 — provider stateless → prod DB has ZERO chatMessages for the thread
 *   WP5 — tool roundtrip completed → atlas TOOL message has non-null result
 *   WP6 — hermes ran the AI loop → final message contains marker
 *
 * ── Suite B: UNBOTTLED Remote Mode ───────────────────────────────────────────
 * hermes as isInferenceProvider: the loop relays to hermes, atlas owns the thread.
 * The AI loop, system prompt, and tool belt all live on hermes. Atlas relays
 * the request and mirrors events via the standard onRemoteEvent framework.
 * Identical to regular suite from test perspective — same prompts, same
 * assertions — plus T-RELAY (remote wallet decreased) and T-SYS (system prompt
 * from hermes).
 *
 * ── Suite C: Reverse-WS (NAT) ────────────────────────────────────────────────
 * Local AI loop + remote tool execution via reverse-WS connector.
 * atlas runs the AI; when the AI calls execute-tool(instanceId='hermes'),
 * hermes executes it over its persistent reverse-WS connection to atlas.
 * Setup closes the standing connector socket so the first broadcast has no
 * open channel → thread enters 'waiting'. runReverseWsPulse restarts the
 * connector, which picks up the queued request and delivers the result.
 *
 * PREREQUISITES
 * ─────────────
 *   Terminal 1: vibe dev                        (atlas, port 3000)
 *   Terminal 2: vibe --hermes dev --fixture-mode (hermes, port 3002)
 */

import "server-only";

import { DefaultFolderId, makeHeadlessContext, rootlessToolExecutionContext, type ToolExecutionContext } from "../../../../core/execution-context";
import { ChatMessageRole } from "../../../chat/enum";
// WS fixture record/replay — patches globalThis.WebSocket, must install
// before any module opens a socket. HTTP fixtures need no install anymore
// (explicit FixtureContext on each call), but WS interception is still global.
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { identityEnv } from "next-vibe/identity/env";
import {
  closeConnection,
  reloadWsProviderConnector,
  restartConnection,
} from "next-vibe/realtime/server/connector";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { seedFixtureThread } from "../../testing/fixture-seed";
import {
  fetchThreadMessages,
  getOrCreateFolder,
  runTestStream,
} from "../../testing/headless-test-runner";
import {
  connectToHermes,
  failSuitePrerequisites,
  HERMES_INSTANCE_ID,
  isHermesInFixtureMode,
  LOCAL_DEV_URL,
  resolveDevUser,
  resolveRemoteUrlSync,
} from "../../testing/remote-setup";
import { makeDirectSetup, makeReverseWsSetup } from "./helpers/remote";
import { describeStreamSuite } from "./route-base.test";

// eslint-disable-next-line i18next/no-literal-string
globalThis.AI_SDK_LOG_WARNINGS = false;

const _remoteUrl = resolveRemoteUrlSync();
const _isFixtureMode = isHermesInFixtureMode();

/**
 * Stream context for the UNBOTTLED setup/teardown block — connection PATCH /
 * cleanup DELETE traffic, no AI. Thread-less root: localhost is never
 * intercepted and these calls have no fixture run to anchor.
 */
const unbottledSetupFixture = rootlessToolExecutionContext();

// ── Suite A: WS-Provider ──────────────────────────────────────────────────────

// Shared direct-http connect/credit/teardown block; the ws-provider flags are
// PATCHed right after the connection is established.
const wsProviderFlagsPatch = async (
  testUser: JwtPrivatePayloadType,
): Promise<void> => {
  const connByIdDef =
    await import("next-vibe/remote-connection/[instanceId]/definition");
  await sendTestRequest({
    toolExecutionContext: unbottledSetupFixture,
    endpoint: connByIdDef.default.PATCH,
    data: {
      isInferenceProvider: true,
      forceSystemProvider: true,
      // Inference-provider relay test — exercises NO sync domain.
      syncScope: {
        memories: false,
        documents: false,
        skills: false,
        favorites: false,
        threads: false,
      },
    },
    urlPathParams: { instanceId: HERMES_INSTANCE_ID },
    user: testUser,
  });
};

const wsProviderHooks = makeDirectSetup(_remoteUrl, {
  afterConnect: wsProviderFlagsPatch,
});

// Same ws-provider flags over the REVERSE-WS leg: the relay must ride the
// standing connector socket, and T-RELAY asserts the ATTESTED transport.
const wsProviderReverseWsHooks = makeReverseWsSetup(_remoteUrl, {
  afterConnect: wsProviderFlagsPatch,
});

// ── Suite B: UNBOTTLED Remote Mode ────────────────────────────────────────────

async function cleanupHermesConnections(
  testUser: JwtPrivatePayloadType,
  toolExecutionContext: ToolExecutionContext,
): Promise<void> {
  const connListDef =
    await import("next-vibe/remote-connection/list/definition");
  const listResult = await sendTestRequest({
    toolExecutionContext,
    endpoint: connListDef.default.GET,
    data: {},
    user: testUser,
  });

  if (!listResult.success) {
    return;
  }

  const rows = listResult.data.connections.filter(
    (c) => c.remoteUrl === LOCAL_DEV_URL,
  );

  if (rows.length === 0) {
    return;
  }

  const connByIdDef =
    await import("next-vibe/remote-connection/[instanceId]/definition");

  for (const row of rows) {
    await sendTestRequest({
      endpoint: connByIdDef.default.DELETE,
      urlPathParams: { instanceId: row.instanceId },
      user: testUser,
      toolExecutionContext,
    });
  }
}

async function setupUnbottled(testUser: JwtPrivatePayloadType): Promise<void> {
  // WS store no longer syncs off the HTTP fixture context — set it explicitly.
  await cleanupHermesConnections(testUser, unbottledSetupFixture);
  reloadWsProviderConnector();
  // Connection setup is control-plane E2E against the LIVE hermes — the old
  // global-patch interception of these login/register calls was an artifact,
  // not a feature: only AI/media provider calls belong in fixtures.
  await connectToHermes(testUser, LOCAL_DEV_URL);

  const connListDefSetup =
    await import("next-vibe/remote-connection/list/definition");
  const connListResult = await sendTestRequest({
    endpoint: connListDefSetup.default.GET,
    data: {},
    user: testUser,
    toolExecutionContext: unbottledSetupFixture,
  });

  const connRow = connListResult.success
    ? connListResult.data.connections.find((c) => c.remoteUrl === LOCAL_DEV_URL)
    : undefined;

  if (!connRow) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(
      "setupUnbottled: no connection row found after connectToHermes",
    );
  }

  const connByIdDef =
    await import("next-vibe/remote-connection/[instanceId]/definition");
  await sendTestRequest({
    endpoint: connByIdDef.default.PATCH,
    data: {
      isInferenceProvider: true,
      // Inference-provider relay test — exercises NO sync domain.
      syncScope: {
        memories: false,
        documents: false,
        skills: false,
        favorites: false,
        threads: false,
      },
    },
    urlPathParams: { instanceId: connRow.instanceId },
    user: testUser,
    toolExecutionContext: unbottledSetupFixture,
  });
}

async function teardownUnbottled(
  testUser: JwtPrivatePayloadType,
): Promise<void> {
  await cleanupHermesConnections(testUser, unbottledSetupFixture);
}

// ── Suite C: Reverse-WS (NAT simulation) ─────────────────────────────────────

let _rwsProdUserId: string | null = null;
let _rwsTestUser: JwtPrivatePayloadType | null = null;

async function setupReverseWs(testUser: JwtPrivatePayloadType): Promise<void> {
  const {
    connectToHermesLocalAi: _connectLocalAi,
    resolveProdUserId: _resolveId,
  } = await import("../../testing/remote-setup");

  // Local AI loop + remote tool execution via execute-tool(instanceId='hermes').
  await _connectLocalAi(testUser, _remoteUrl ?? "http://localhost:3002");

  _rwsTestUser = testUser;
  _rwsProdUserId = await _resolveId();

  // NAT simulation: close the standing connector socket so the first tool
  // broadcast finds no WS channel. Thread enters 'waiting'. runReverseWsPulse
  // then restarts the connector, which reopens the channel and delivers the
  // missed request.
  closeConnection(HERMES_INSTANCE_ID);
}

async function teardownReverseWs(
  testUser: JwtPrivatePayloadType,
): Promise<void> {
  const {
    disconnectFromHermes: _disconnect,
    unregisterDevFromHermes: _unregister,
  } = await import("../../testing/remote-setup");

  try {
    closeConnection(HERMES_INSTANCE_ID);
  } catch {
    /* best-effort */
  }

  const tasks: Promise<void>[] = [_disconnect(testUser.id)];
  if (_rwsProdUserId) {
    tasks.push(_unregister(_rwsProdUserId));
  }
  await Promise.all(tasks);
  _rwsProdUserId = null;
  _rwsTestUser = null;
}

/**
 * PATCH transportMode='reverse-ws' on hermes's atlas row.
 * The PATCH handler calls openConnection() which opens a persistent WS to atlas,
 * subscribes to system/sync/{userId} for relayed remote events, and processes any
 * tool-execute-request via onRemoteEvent. Polls chatThreads.streamingState until thread exits 'waiting'.
 */
async function runReverseWsPulse(threadId: string): Promise<void> {
  if (!_rwsTestUser) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test helper
    throw new Error(
      "runReverseWsPulse: no test user — setupReverseWs not called?",
    );
  }

  // Reopen the reverse-ws channel: the connector reconnects and the
  // receiver delivers the queued tool-execute-request over the fresh socket.
  await restartConnection(HERMES_INSTANCE_ID);

  // eslint-disable-next-line no-console
  console.log("[runReverseWsPulse] connector restarted — channel reopened");

  const threadByIdDef =
    await import("../../../chat/threads/[threadId]/definition");
  const deadline = Date.now() + 60_000;

  while (Date.now() < deadline) {
    const threadResult = await sendTestRequest({
      toolExecutionContext: rootlessToolExecutionContext(),
      endpoint: threadByIdDef.default.GET,
      data: { rootFolderId: DefaultFolderId.REMOTE },
      urlPathParams: { threadId },
      user: _rwsTestUser,
      instanceId: HERMES_INSTANCE_ID,
    });

    if (
      threadResult.success &&
      threadResult.data.streamingState !== "waiting"
    ) {
      // eslint-disable-next-line no-console
      console.log(
        "[runReverseWsPulse] Thread exited waiting:",
        threadResult.data.streamingState,
      );
      return;
    }

    await new Promise<void>((resolve) => {
      setTimeout(resolve, 300);
    });
  }

  // oxlint-disable-next-line restricted-syntax -- intentional throw in test helper
  throw new Error(
    `runReverseWsPulse: thread ${threadId} still in 'waiting' after 60s — WS connector did not deliver result`,
  );
}

// ── Suite registration ─────────────────────────────────────────────────────────

if (_remoteUrl && _isFixtureMode) {
  // A: WS-Provider — hermes runs AI loop; tools execute locally via tool-execute-request roundtrip
  describeStreamSuite({
    label: `AI Stream — WS-Provider direct-HTTP (${_remoteUrl})`,
    cachePrefix: "ws-provider-",
    assertSystemPromptFromLocal: true,
    // Both-sides billing: the provider (hermes) bills its own markup for the
    // relayed loop — T-RELAY asserts the remote wallet decreased — while the
    // local side still bills the user, so the local deduction asserts run too.
    assertRelayRan: true,
    expectRelayTransport: "direct-http",
    setup: wsProviderHooks.setup,
    teardown: wsProviderHooks.teardown,
  });

  // A-RWS: same ws-provider semantics over the REVERSE-WS leg. The relay must
  // ride the standing connector socket; T-RELAY asserts the ATTESTED transport.
  describeStreamSuite({
    label: `AI Stream — WS-Provider reverse-WS (${_remoteUrl})`,
    cachePrefix: "ws-provider-rws-",
    assertSystemPromptFromLocal: true,
    assertRelayRan: true,
    expectRelayTransport: "reverse-ws",
    setup: wsProviderReverseWsHooks.setup,
    teardown: wsProviderReverseWsHooks.teardown,
  });

  // A: WP3–WP6 — provider stateless + tool roundtrip + AI loop assertions
  describe(`WS-Provider — provider stateless + roundtrip (${_remoteUrl})`, () => {
    let testUser: JwtPrivatePayloadType;
    let threadId: string;
    let wp3Wp6FolderId: string;

    beforeAll(async () => {
      const resolved = await resolveDevUser(identityEnv.VIBE_ADMIN_USER_EMAIL);
      expect(
        resolved,
        `WP3-WP6: admin user ${identityEnv.VIBE_ADMIN_USER_EMAIL} not found — run: vibe dev`,
      ).toBeTruthy();
      if (!resolved) {
        // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
        throw new Error(
          `WP3-WP6 setup failed: admin user ${identityEnv.VIBE_ADMIN_USER_EMAIL} not found`,
        );
      }
      testUser = resolved;

      await wsProviderHooks.setup(testUser);

      const testsParentId = await getOrCreateFolder(
        testUser,
        DefaultFolderId.PRIVATE,
        "tests",
      );
      wp3Wp6FolderId = await getOrCreateFolder(
        testUser,
        DefaultFolderId.PRIVATE,
        "ws-provider",
        testsParentId,
      );

      // Seed a fixtures row for this stream's thread on BOTH instances (the
      // ws-provider relay runs the loop on the live hermes receiver, which
      // reads its own fixtures row under the SAME threadId).
      const wp3Wp6ThreadId = crypto.randomUUID();
      await seedFixtureThread(wp3Wp6ThreadId, "ws-provider-wp3-wp6-", true);
      const streamResult = await runTestStream({
        prompt:
          "Call the tool-help tool with query='tool-help' and then reply with EXACTLY: WP_ROUNDTRIP_COMPLETE. Nothing else.",
        user: testUser,
        threadId: wp3Wp6ThreadId,
        rootFolderId: DefaultFolderId.PRIVATE,
        subFolderId: wp3Wp6FolderId,
        toolExecutionContext: makeHeadlessContext(
          undefined,
          wp3Wp6ThreadId,
          /* no user context — UTC (dates not user-facing here) */ "UTC",
        ),
      });

      expect(
        streamResult.result.success,
        "WP3-WP6 setup: stream must succeed",
      ).toBe(true);
      if (!streamResult.result.success) {
        // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
        throw new Error("WP3-WP6 setup failed: stream did not succeed");
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
        await wsProviderHooks.teardown(testUser);
      }
      await closeProdDb();
    });

    it("WP3: originator owns the thread → thread + messages exist in atlas DB", async () => {
      const threadDef =
        await import("../../../chat/threads/[threadId]/definition");
      const threadResult = await sendTestRequest({
        toolExecutionContext: rootlessToolExecutionContext(),
        endpoint: threadDef.default.GET,
        data: { rootFolderId: DefaultFolderId.PRIVATE },
        urlPathParams: { threadId },
        user: testUser,
      });
      expect(threadResult.success, "WP3: thread must exist in atlas DB").toBe(
        true,
      );
      const msgs = await fetchThreadMessages(threadId, testUser);
      expect(
        msgs.length,
        "WP3: messages must exist in atlas DB",
      ).toBeGreaterThan(0);
    }, 30_000);

    it("WP4: provider stateless → prod DB has ZERO chatMessages for the thread", async () => {
      const { assertProdDbEmpty } = await import("../../testing/remote-setup");
      await assertProdDbEmpty(threadId, "chat_messages");
    }, 30_000);

    it("WP5: tool roundtrip completed → atlas TOOL message has non-null result", async () => {
      const msgs = await fetchThreadMessages(threadId, testUser);
      const toolMsgs = msgs.filter((m) => m.role === ChatMessageRole.TOOL);
      expect(
        toolMsgs.length,
        "WP5: expected at least one TOOL message",
      ).toBeGreaterThan(0);
      const completedTool = toolMsgs.find(
        (m) => m.toolCall?.result !== undefined && m.toolCall.result !== null,
      );
      expect(
        completedTool,
        "WP5: expected TOOL message with non-null result — tool-execute-request roundtrip must have completed",
      ).toBeTruthy();
    }, 30_000);

    it("WP6: hermes ran the AI loop → final message contains marker", async () => {
      const msgs = await fetchThreadMessages(threadId, testUser);
      const assistantMsgs = msgs.filter(
        (m) => m.role === ChatMessageRole.ASSISTANT && m.content !== null,
      );
      expect(
        assistantMsgs.length,
        "WP6: expected at least one assistant message",
      ).toBeGreaterThan(0);
      const markerMsg = assistantMsgs.find((m) =>
        m.content?.includes("WP_ROUNDTRIP_COMPLETE"),
      );
      expect(
        markerMsg,
        "WP6: final AI message must contain 'WP_ROUNDTRIP_COMPLETE' — proves hermes ran the AI loop",
      ).toBeTruthy();
    }, 30_000);
  });

  // B: UNBOTTLED — hermes as full inference provider; atlas owns the thread
  describeStreamSuite({
    label: `AI Stream — UNBOTTLED Remote Mode (${_remoteUrl}, AI on hermes)`,
    cachePrefix: "unbottled-",
    // The provider runs the loop on hermes; its receiver reads its OWN fixtures
    // row (harness seeds both instances under the same threadId per case).
    // Tools and system prompt ALWAYS come from the client (options on the
    // ai-stream) — the provider runs the loop but must identify the CALLER.
    assertSystemPromptFromLocal: true,
    assertRelayRan: true,
    expectRelayTransport: "direct-http",
    setup: setupUnbottled,
    teardown: teardownUnbottled,
  });

  // C: Reverse-WS NAT — local AI loop, remote tools via reverse-WS connector + pulse
  describeStreamSuite({
    label: `AI Stream — Reverse-WS NAT (${_remoteUrl}, execute-tool → hermes → /report)`,
    cachePrefix: "reverse-ws-",
    remoteInstanceId: HERMES_INSTANCE_ID,
    setup: setupReverseWs,
    teardown: teardownReverseWs,
    pulse: runReverseWsPulse,
  });
} else if (!_remoteUrl) {
  failSuitePrerequisites(
    "inference-provider",
    "hermes not running — start: vibe --hermes dev --fixture-mode",
  );
} else {
  failSuitePrerequisites(
    "inference-provider",
    "hermes running but not in fixture mode — restart: vibe --hermes dev --fixture-mode",
  );
}
