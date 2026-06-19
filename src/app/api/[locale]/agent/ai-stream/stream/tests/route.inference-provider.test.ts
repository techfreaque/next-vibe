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
 * locally and returns results. Thread stored on atlas (threadMirrorMode='both').
 * System prompt is built locally (atlas) and sent in the POST body.
 *
 * Standalone assertions (WP3–WP6):
 *   WP3 — threadMirrorMode=both → thread + messages exist in atlas DB
 *   WP4 — provider stateless → prod DB has ZERO chatMessages for the thread
 *   WP5 — tool roundtrip completed → atlas TOOL message has non-null result
 *   WP6 — hermes ran the AI loop → final message contains marker
 *
 * ── Suite B: UNBOTTLED Remote Mode ───────────────────────────────────────────
 * hermes as isInferenceProvider with toolSource='remote', threadMirrorMode='both'.
 * The AI loop, system prompt, and tool belt all live on hermes. Atlas relays
 * the request and mirrors events via HeadlessRelayProcessor.
 * Identical to regular suite from test perspective — same prompts, same
 * assertions — plus T-RELAY (remote wallet decreased) and T-SYS (system prompt
 * from hermes).
 *
 * ── Suite C: Reverse-WS (NAT) ────────────────────────────────────────────────
 * Local AI loop + remote tool execution via reverse-WS connector.
 * atlas runs the AI; when the AI calls execute-tool(instanceId='hermes'),
 * hermes executes it over its persistent reverse-WS connection to atlas.
 * Setup forces transportMode='cloud-only' so the first broadcast has no open
 * channel → thread enters 'waiting'. runReverseWsPulse PATCHes to 'reverse-ws'
 * which opens the connector, picks up the queued request, and delivers the result.
 *
 * PREREQUISITES
 * ─────────────
 *   Terminal 1: vibe dev                        (atlas, port 3000)
 *   Terminal 2: vibe --hermes dev --fixture-mode (hermes, port 3002)
 */

import "server-only";

import { installFetchCache } from "../../testing/fetch-cache";
installFetchCache();

import { installWsFixture } from "../../testing/ws-fixture";
installWsFixture();

import { and, eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { ChatMessageRole } from "@/app/api/[locale]/agent/chat/enum";
import { reloadWsProviderConnector } from "@/app/api/[locale]/remote-connection/connector";
import { remoteConnections } from "@/app/api/[locale]/remote-connection/db";
import { db } from "@/app/api/[locale]/system/db";
import { RouteExecuteRepository } from "@/app/api/[locale]/system/unified-interface/execute-tool/repository";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { env } from "@/config/env";
import { defaultLocale } from "@/i18n/core/config";

import {
  addLocalhostPort,
  clearLocalhostPorts,
  setFetchCacheContext,
  setFetchCacheStrictMode,
} from "../../testing/fetch-cache";
import {
  fetchThreadMessages,
  getOrCreateFolder,
  runTestStream,
} from "../../testing/headless-test-runner";
import {
  ATLAS_INSTANCE_ID,
  connectToHermes,
  disconnectFromHermes,
  failSuitePrerequisites,
  HERMES_INSTANCE_ID,
  isHermesInFixtureMode,
  LOCAL_DEV_URL,
  resolveDevUser,
  resolveRemoteUrlSync,
  unregisterDevFromHermes,
} from "../../testing/remote-setup";
import { describeStreamSuite } from "./route-base.test";

// eslint-disable-next-line i18next/no-literal-string
globalThis.AI_SDK_LOG_WARNINGS = false;

const _remoteUrl = resolveRemoteUrlSync();
const _isFixtureMode = isHermesInFixtureMode();
const HERMES_PORT = 3002;

// ── Suite A: WS-Provider ──────────────────────────────────────────────────────

let _wpProdUserId: string | null = null;

async function setupWsProvider(testUser: JwtPrivatePayloadType): Promise<void> {
  const {
    ensureRemoteUserCredits: _ensureCredits,
    resolveProdAdminToken: _resolveToken,
    resolveProdUserId: _resolveId,
  } = await import("../../testing/remote-setup");

  await disconnectFromHermes(testUser.id);
  await connectToHermes(testUser, _remoteUrl ?? "http://localhost:3002");

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

  _wpProdUserId = await _resolveId();
  const remoteAdminToken = await _resolveToken(
    _remoteUrl ?? "http://localhost:3002",
  );
  await _ensureCredits(
    _remoteUrl ?? "http://localhost:3002",
    remoteAdminToken,
    _wpProdUserId,
    20000,
  );
}

async function teardownWsProvider(
  testUser: JwtPrivatePayloadType,
): Promise<void> {
  const tasks: Promise<void>[] = [disconnectFromHermes(testUser.id)];
  if (_wpProdUserId) {
    tasks.push(unregisterDevFromHermes(_wpProdUserId));
  }
  await Promise.all(tasks);
  _wpProdUserId = null;
}

// ── Suite B: UNBOTTLED Remote Mode ────────────────────────────────────────────

async function cleanupHermesConnections(
  testUser: JwtPrivatePayloadType,
): Promise<void> {
  const rows = await db
    .select({ instanceId: remoteConnections.instanceId })
    .from(remoteConnections)
    .where(
      and(
        eq(remoteConnections.userId, testUser.id),
        eq(remoteConnections.remoteUrl, LOCAL_DEV_URL),
      ),
    );

  if (rows.length === 0) {
    return;
  }

  const connByIdDef =
    await import("@/app/api/[locale]/remote-connection/[instanceId]/definition");

  for (const row of rows) {
    await RouteExecuteRepository.runInProcessTyped({
      definition: connByIdDef.default.DELETE,
      urlPathParams: { instanceId: row.instanceId },
      user: testUser,
      locale: defaultLocale,
      platform: Platform.AI,
      logger: createEndpointLogger(false, Date.now(), defaultLocale),
    });
  }
}

async function setupUnbottled(testUser: JwtPrivatePayloadType): Promise<void> {
  addLocalhostPort(HERMES_PORT);
  setFetchCacheContext("unbottled-setup");

  await cleanupHermesConnections(testUser);
  reloadWsProviderConnector();
  await connectToHermes(testUser, LOCAL_DEV_URL);

  const [connRow] = await db
    .select({ instanceId: remoteConnections.instanceId })
    .from(remoteConnections)
    .where(
      and(
        eq(remoteConnections.userId, testUser.id),
        eq(remoteConnections.remoteUrl, LOCAL_DEV_URL),
        eq(remoteConnections.isReverseEntry, false),
      ),
    )
    .limit(1);

  if (!connRow) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(
      "setupUnbottled: no connection row found after connectToHermes",
    );
  }

  const connByIdDef =
    await import("@/app/api/[locale]/remote-connection/[instanceId]/definition");
  await RouteExecuteRepository.runInProcessTyped({
    definition: connByIdDef.default.PATCH,
    input: {
      isInferenceProvider: true,
      toolSource: "remote",
      threadMirrorMode: "both",
    },
    urlPathParams: { instanceId: connRow.instanceId },
    user: testUser,
    locale: defaultLocale,
    platform: Platform.AI,
    logger: createEndpointLogger(false, Date.now(), defaultLocale),
  });
}

async function teardownUnbottled(
  testUser: JwtPrivatePayloadType,
): Promise<void> {
  await cleanupHermesConnections(testUser);
  clearLocalhostPorts();
  setFetchCacheStrictMode(false);
}

// ── Suite C: Reverse-WS (NAT simulation) ─────────────────────────────────────

let _rwsProdAdminToken: string | null = null;
let _rwsProdUserId: string | null = null;

async function setupReverseWs(testUser: JwtPrivatePayloadType): Promise<void> {
  const {
    connectToHermesLocalAi: _connectLocalAi,
    resolveProdUserId: _resolveId,
    resolveProdAdminToken: _resolveToken,
  } = await import("../../testing/remote-setup");

  // Local AI loop + remote tool execution via execute-tool(instanceId='hermes').
  await _connectLocalAi(testUser, _remoteUrl ?? "http://localhost:3002");

  _rwsProdUserId = await _resolveId();
  _rwsProdAdminToken = await _resolveToken(
    _remoteUrl ?? "http://localhost:3002",
  );

  // NAT simulation: force cloud-only so the first tool broadcast has no WS channel.
  // Thread enters 'waiting'. runReverseWsPulse then switches to 'reverse-ws' which
  // opens the connector and delivers the missed request.
  await fetch(
    `${_remoteUrl}/api/en-US/user/remote-connection/${ATLAS_INSTANCE_ID}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        // eslint-disable-next-line i18next/no-literal-string
        Authorization: `Bearer ${_rwsProdAdminToken}`,
      },
      body: JSON.stringify({ transportMode: "cloud-only" }),
      signal: AbortSignal.timeout(10_000),
    },
  );
  await db
    .update(remoteConnections)
    .set({ transportMode: "cloud-only" as "reverse-ws" })
    .where(
      and(
        eq(remoteConnections.userId, testUser.id),
        eq(remoteConnections.instanceId, HERMES_INSTANCE_ID),
      ),
    );
}

async function teardownReverseWs(
  testUser: JwtPrivatePayloadType,
): Promise<void> {
  const {
    disconnectFromHermes: _disconnect,
    unregisterDevFromHermes: _unregister,
  } = await import("../../testing/remote-setup");

  if (_rwsProdAdminToken) {
    try {
      await fetch(
        `${_remoteUrl}/api/en-US/user/remote-connection/${ATLAS_INSTANCE_ID}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            // eslint-disable-next-line i18next/no-literal-string
            Authorization: `Bearer ${_rwsProdAdminToken}`,
          },
          body: JSON.stringify({ transportMode: "cloud-only" }),
          signal: AbortSignal.timeout(5_000),
        },
      );
    } catch {
      /* best-effort */
    }
  }

  const tasks: Promise<void>[] = [_disconnect(testUser.id)];
  if (_rwsProdUserId) {
    tasks.push(_unregister(_rwsProdUserId));
  }
  await Promise.all(tasks);
  _rwsProdUserId = null;
  _rwsProdAdminToken = null;
}

/**
 * PATCH transportMode='reverse-ws' on hermes's atlas row.
 * The PATCH handler calls openConnection() which opens a persistent WS to atlas,
 * subscribes to system/tool-dispatch/{userId}, and re-broadcasts any queued
 * tool-execute-request. Polls chatThreads.streamingState until thread exits 'waiting'.
 */
async function runReverseWsPulse(threadId: string): Promise<void> {
  if (!_rwsProdAdminToken) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test helper
    throw new Error(
      "runReverseWsPulse: no prod admin token — setupReverseWs not called?",
    );
  }

  const patchResp = await fetch(
    `${_remoteUrl}/api/en-US/user/remote-connection/${ATLAS_INSTANCE_ID}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        // eslint-disable-next-line i18next/no-literal-string
        Authorization: `Bearer ${_rwsProdAdminToken}`,
      },
      body: JSON.stringify({ transportMode: "reverse-ws" }),
      signal: AbortSignal.timeout(10_000),
    },
  );

  if (!patchResp.ok) {
    const body = await patchResp.text().catch(() => "unknown");
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test helper
    throw new Error(
      `runReverseWsPulse: PATCH transportMode failed ${String(patchResp.status)}: ${body}`,
    );
  }

  // eslint-disable-next-line no-console
  console.log("[runReverseWsPulse] transportMode=reverse-ws PATCH succeeded");

  const { chatThreads } = await import("@/app/api/[locale]/agent/chat/db");
  const deadline = Date.now() + 60_000;

  while (Date.now() < deadline) {
    const [thread] = await db
      .select({ streamingState: chatThreads.streamingState })
      .from(chatThreads)
      .where(eq(chatThreads.id, threadId))
      .limit(1);

    if (thread && thread.streamingState !== "waiting") {
      // eslint-disable-next-line no-console
      console.log(
        "[runReverseWsPulse] Thread exited waiting:",
        thread.streamingState,
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
    label: `AI Stream — WS-Provider (${_remoteUrl}, transportMode='ws-provider')`,
    cachePrefix: "ws-provider-",
    assertSystemPromptFromLocal: true,
    setup: setupWsProvider,
    teardown: teardownWsProvider,
  });

  // A: WP3–WP6 — provider stateless + tool roundtrip + AI loop assertions
  describe(`WS-Provider — provider stateless + roundtrip (${_remoteUrl})`, () => {
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
          `WP3-WP6 setup failed: admin user ${env.VIBE_ADMIN_USER_EMAIL} not found`,
        );
      }
      testUser = resolved;

      await setupWsProvider(testUser);

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
        await teardownWsProvider(testUser);
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

  // B: UNBOTTLED — hermes as full inference provider; toolSource='remote', threadMirrorMode='both'
  describeStreamSuite({
    label: `AI Stream — UNBOTTLED Remote Mode (${_remoteUrl}, AI on hermes)`,
    cachePrefix: "unbottled-",
    systemPromptInstanceId: HERMES_INSTANCE_ID,
    assertRelayRan: true,
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
